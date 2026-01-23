import { FARBE } from "./FARBE"
import { GRUPPE } from "./GRUPPE"
import { THEMA } from "./THEMA"
import { TYP } from "./TYP"


export type SEEPiktogrammData = {
    id: number,
    nameDe: string
    nameFr: string
    nameIt: string
    nameEn: string
    svg: string
    richtungsabhaengig: boolean
    sprachabhaengig: boolean
    groessenabhaengig: boolean
    wertabhaengig: boolean
    einsetzbarBahnhof: boolean
    aktiv: boolean
    sortierung: number
    info: string
    thema: THEMA
    gruppe: GRUPPE
    farbe: FARBE
    typ: TYP
    werte: string[]
}

export type SEEPiktogrammDokumentData = {
    id: number
    piktogrammId: number
    rechts: boolean
    links: boolean
    deutsch: boolean
    franzoesisch: boolean
    italienisch: boolean
    englisch: boolean
    klein: boolean
    gross: boolean
    svg: string
    wert: string | null
}

export type FarbeData = {
    hexCode: string
    id: string
}

export type IndexJSONEntry = {
      name: string
      color: boolean
      scalable: boolean
      tags: string[]
}