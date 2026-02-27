export type THEMA = 'PFEILE' | 'GENERISCH' | 'REISEN' | 'FUNKTIONEN' | 'VERHALTEN' | 'SICHERHEIT' | 'TEXTE'

export type THEMADATA = {
    key: THEMA
    nameDeutsch: string
    nameFranzoesisch: string
    nameItalienisch: string
    nameEnglisch: string
}

export const getThemaData = (thema: THEMA): THEMADATA => {
    switch(thema) {
        case 'PFEILE': 
        return {
            key: 'PFEILE',
            nameDeutsch: "Pfeile",
            nameFranzoesisch: "Flèches",
            nameItalienisch: "Frecce",
            nameEnglisch: "Arrows"
        } as THEMADATA
         
case 'GENERISCH': 
        return {
            key: 'GENERISCH',
            nameDeutsch: "Generisch",
            nameFranzoesisch: "Généralités",
            nameItalienisch: "Generici",
            nameEnglisch: "Generic"
        } as THEMADATA
         
case 'REISEN': 
        return {
            key: 'REISEN',
            nameDeutsch: "Reisen",
            nameFranzoesisch: "Voyages",
            nameItalienisch: "Viaggi",
            nameEnglisch: "Travel"
        } as THEMADATA
         
case 'FUNKTIONEN': 
        return {
            key: 'FUNKTIONEN',
            nameDeutsch: "Funktionen",
            nameFranzoesisch: "Fonctions",
            nameItalienisch: "Funzioni",
            nameEnglisch: "Functions"
        } as THEMADATA
         
case 'VERHALTEN': 
        return {
            key: 'VERHALTEN',
            nameDeutsch: "Verhalten",
            nameFranzoesisch: "Comportement",
            nameItalienisch: "Comportamenti",
            nameEnglisch: "Behaviour"
        } as THEMADATA
         
case 'SICHERHEIT': 
        return {
            key: 'SICHERHEIT',
            nameDeutsch: "Sicherheit",
            nameFranzoesisch: "Sécurité",
            nameItalienisch: "Sicurezza",
            nameEnglisch: "Safety"
        } as THEMADATA
         
case 'TEXTE': 
        return {
            key: 'TEXTE',
            nameDeutsch: "Texte",
            nameFranzoesisch: "Textes",
            nameItalienisch: "Texti",
            nameEnglisch: "Texts"
        } as THEMADATA
    }
}