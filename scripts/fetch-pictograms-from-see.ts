import { readdirSync, readFileSync, writeFileSync, unlink, existsSync, mkdirSync } from "fs"
import { optimize, Output } from "svgo"
import type { Visitor, XastElement } from 'svgo/lib/types.js'
import { exit } from "process"

import type { 
    SEEPiktogrammData, 
    SEEPiktogrammDokumentData, 
    FarbeData,
    IndexJSONEntry,
} from "./types.js"
import { FARBE, getFarbeData } from "./FARBE.js"
import { getThemaData } from "./THEMA.js"
import { getGruppeData } from "./GRUPPE.js"


const API_BASE_URL = "https://signaletikeditor-apikey.api.sbb.ch"
const API_KEY = process.env.API_KEY
const OUT_DIR = "./picto-test"

if(!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

if(!API_KEY) {
    console.error("Usage: API_KEY=[YOUR_APP_KEY] npm run fetchFromSEE ")
    exit(1)
}

const piktogrammURL = `${API_BASE_URL}/json/piktogramme?api_key=${API_KEY}`

const buildFileName = (piktogramm: SEEPiktogrammData, dokument: SEEPiktogrammDokumentData, framed: boolean): string => {
    const piktogrammNameEn = piktogramm.nameEn.replace(/([\W_]+)/gm, "-").replace(/^-|-$/gm, "").toLowerCase() //replace all non word characters with "-" then remove "-" at the beginning or end of the string if existing
    const wertFragment = piktogramm.wertabhaengig ? `-${dokument.wert?.toLowerCase()}` : ""
    const richtungFragment = piktogramm.richtungsabhaengig ? dokument.links ? "-left" : dokument.rechts ? "-right" : "-unknown" : ""
    const spracheFragment = piktogramm.sprachabhaengig ? dokument.deutsch ? "-de" : dokument.franzoesisch ? "-fr" : dokument.italienisch ? "-it" : dokument.englisch ? "-en" : "-unknown" : ""
    const groesseFragment = piktogramm.groessenabhaengig ? dokument.gross ? "-large" : dokument.klein ? "-small" : "-unknown" : ""
    const rahmenFragment = framed ? "-framed" : ""
    return piktogrammNameEn + wertFragment + richtungFragment + spracheFragment + groesseFragment + rahmenFragment
}

const processPiktogramm = (piktogramme: SEEPiktogrammData[]) => {
    piktogramme
    .filter(piktogramm => piktogramm.aktiv === true)
    .forEach(piktogramm => {
        return processDokumente(piktogramm)
    })
}

const processDokumente = (piktogramm: SEEPiktogrammData) => {
    const dokumenteURL = `${API_BASE_URL}/json/piktogramme/${piktogramm.id}/dokumente?api_key=${API_KEY}`
    fetch(dokumenteURL)
    .then(response => {
        if(response.status === 200) {
            response.json()
            .then((seeDokumente: { values: SEEPiktogrammDokumentData[] }) => {
                seeDokumente.values
                .forEach(dokument => {
                    generateFile(piktogramm, dokument, true)
                    generateFile(piktogramm, dokument, false)
                })
            })
        } else { console.log(response) }
    })
}

const svgFromGroup = (group: string, farbe: FARBE, framed: boolean): string => {
    const farbeData = getFarbeData(farbe)
    const viewBoxSize = framed ? 400 : 320
    const edgeLength = framed ? 30 : 24
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${edgeLength}" height="${edgeLength}" class="color-immutable"> 
${ piktogramBackground(farbeData, framed) }
${group}
</svg>` // SVG tag containing the background and the content of the Piktogramm
}

const piktogramBackground = (farbData: FarbeData, framed: boolean): string => {
    return framed === true 
    ? `<polygon id="${farbData.id}" fill="${farbData.hexCode}" points="0,0 400,0 400,400 0,400 0,0 "/>` // background shape for framed Piktogramme
    : `<path id="${farbData.id}" fill="${farbData.hexCode}" d="M340,40c11,0,20,9,20,20v280c0,11.001-9,20.001-20,20.001H60c-11,0-20-9-20-20.001V60c0-11,9-20,20-20H340 z" transform="matrix(1 0 0 1 -40 -40)"/>` // background shape for frameless Piktogramme
}

const minifySVG = (content: string, framed: boolean): Output => {
    return optimize(content, {
        plugins: [
            {
                name: 'remove-clip-path',
                fn(ast) {
                const svgRoot = ast.children[0];
                if (svgRoot.type !== 'element' || svgRoot.name !== 'svg') {
                    return ast as Visitor
                }

                const group = svgRoot.children[0]
                if (
                    group.type !== 'element' ||
                    group.name !== 'g' ||
                    !group.attributes['clip-path'] ||
                    !group.attributes['clip-path'].match(/^url\(\#\w+\)$/)
                ) {
                    return ast as Visitor
                }

                const clipPathId = group.attributes['clip-path'].slice(5, -1);
                const defs = svgRoot.children.find(
                    (c): c is XastElement =>
                    c.type === 'element' && c.name === 'defs'
                )!;
                const clipPath = defs.children.find(
                    (c) =>
                    c.type === 'element' &&
                    c.name === 'clipPath' &&
                    c.attributes['id'] === clipPathId
                );

                if (Object.keys(group.attributes).length === 1) {
                    svgRoot.children = svgRoot.children.flatMap((c) =>
                    c !== group ? c : group.children
                    );
                } else {
                    delete group.attributes['clip-path']
                }

                if (defs.children.length === 1) {
                    svgRoot.children = svgRoot.children.filter((c) => c !== defs)
                } else {
                    defs.children = defs.children.filter((c) => c !== clipPath)
                }

                return ast as Visitor
                },
            },
            {
                name: "removeElementsByAttr",
                params: {
                    id: framed ? [] : ["frameWhite"],
                    class: []
                }
            },
            {
                name: "removeElementsByAttr",
                params: {
                    id: framed ? [] : ["frameBlack"],
                    class: []
                }
            },
            {
                name: "addMatrixToFramelessContentGroup",
                fn: (ast) => ({
                    element: {
                        enter: (node) => {
                            if(node.name === 'g' && node.attributes && node.attributes.id === 'content') {
                                if(framed === false) {
                                    node.attributes.transform = 'matrix(1 0 0 1 -40 -40)'
                                }
                            }
                        }
                    }
                })
            }
        ],
    })
}

const generateFile = (piktogramm: SEEPiktogrammData, dokument: SEEPiktogrammDokumentData, framed: boolean) => {
    const fileName = buildFileName(piktogramm, dokument, framed)
    const svgData = svgFromGroup(dokument.svg, piktogramm.farbe, framed)
    const minifiedContent = minifySVG(svgData, framed)
    writeFileSync(`${OUT_DIR}/${fileName}.svg`, minifiedContent.data) //TODO: Use path.combine or so

    var indexJSON = JSON.parse(readFileSync(`${OUT_DIR}/index.json`).toString()) as { version: string, picto: IndexJSONEntry[] }
    indexJSON.picto.push({
        name: fileName,
        color: false, //Piktogramm color must not be modified
        scalable: true, //Piktogramm can be scaled
        tags: [
            getThemaData(piktogramm.thema).nameDeutsch,
            getThemaData(piktogramm.thema).nameFranzoesisch,
            getThemaData(piktogramm.thema).nameItalienisch,
            getThemaData(piktogramm.thema).nameEnglisch,

            getGruppeData(piktogramm.gruppe).nameDeutsch,
            getGruppeData(piktogramm.gruppe).nameFranzoesisch,
            getGruppeData(piktogramm.gruppe).nameItalienisch,
            getGruppeData(piktogramm.gruppe).nameEnglisch,

            piktogramm.nameDe,
            piktogramm.nameFr,
            piktogramm.nameIt,
            piktogramm.nameEn,

            "SBB Piktogramme",
            framed ? "With-frames" : "Without-frames"
        ]
    })

    indexJSON.picto.sort((a, b) => a.name < b.name ? -1 : 1)
    writeFileSync(`${OUT_DIR}/index.json`, JSON.stringify(indexJSON, null, 2))
}

writeFileSync(`${OUT_DIR}/index.json`, JSON.stringify({ version: "0.1.0", picto: [] }, null, 2)) //clear index.json file

readdirSync(OUT_DIR, { withFileTypes: true }) //delete all .svg files inside the output directory
.filter(file => file.isFile() && file.name.endsWith(".svg"))
.forEach(file => unlink(`${file.parentPath}/${file.name}`, (err) => { if(err) console.error(err) }))

fetch(piktogrammURL)
.then(response => {
    if (response.status === 200) {
        response.json()
        .then((seePiktogramme: { values: SEEPiktogrammData[] }) => {
            processPiktogramm(seePiktogramme.values)
        })
    } else { console.log(response) }
})