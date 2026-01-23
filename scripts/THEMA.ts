export enum THEMA {
    PFEILE = 'PFEILE',
    GENERISCH = 'GENERISCH',
    REISEN = 'REISEN',
    FUNKTIONEN = 'FUNKTIONEN',
    VERHALTEN = 'VERHALTEN',
    SICHERHEIT = 'SICHERHEIT',
    TEXTE = 'TEXTE'
}

export interface THEMADATA {
    key: THEMA
    nameDeutsch: string
    nameFranzoesisch: string
    nameItalienisch: string
    nameEnglisch: string
}

export const getThemaData = (thema: THEMA): THEMADATA => {
    switch(thema) {
        case THEMA.PFEILE: 
        return {
            key: THEMA.PFEILE,
            nameDeutsch: "Pfeile",
            nameFranzoesisch: "Flèches",
            nameItalienisch: "Frecce",
            nameEnglisch: "Arrows"
        } as THEMADATA
         
case THEMA.GENERISCH: 
        return {
            key: THEMA.GENERISCH,
            nameDeutsch: "Generisch",
            nameFranzoesisch: "Généralités",
            nameItalienisch: "Generici",
            nameEnglisch: "Generic"
        } as THEMADATA
         
case THEMA.REISEN: 
        return {
            key: THEMA.REISEN,
            nameDeutsch: "Reisen",
            nameFranzoesisch: "Voyages",
            nameItalienisch: "Viaggi",
            nameEnglisch: "Travel"
        } as THEMADATA
         
case THEMA.FUNKTIONEN: 
        return {
            key: THEMA.FUNKTIONEN,
            nameDeutsch: "Funktionen",
            nameFranzoesisch: "Fonctions",
            nameItalienisch: "Funzioni",
            nameEnglisch: "Functions"
        } as THEMADATA
         
case THEMA.VERHALTEN: 
        return {
            key: THEMA.VERHALTEN,
            nameDeutsch: "Verhalten",
            nameFranzoesisch: "Comportement",
            nameItalienisch: "Comportamenti",
            nameEnglisch: "Behaviour"
        } as THEMADATA
         
case THEMA.SICHERHEIT: 
        return {
            key: THEMA.SICHERHEIT,
            nameDeutsch: "Sicherheit",
            nameFranzoesisch: "Sécurité",
            nameItalienisch: "Sicurezza",
            nameEnglisch: "Safety"
        } as THEMADATA
         
case THEMA.TEXTE: 
        return {
            key: THEMA.TEXTE,
            nameDeutsch: "Texte",
            nameFranzoesisch: "Textes",
            nameItalienisch: "Texti",
            nameEnglisch: "Texts"
        } as THEMADATA
    }
}

/*
console.log(temp1.Categories.content.map(kat => 
    `case THEMA.${kat.see_Enum}: 
        return {
            key: "XXX",
            nameDeutsch: "${kat.name_de}",
            nameFranzoesisch: "${kat.name_fr}",
            nameItalienisch: "${kat.name_it}",
            nameEnglisch: "${kat.name_en}"
        } as THEMADATA
         `
    ).join('\n')
)
*/