export type FARBE = 'BLAU' | 'GRUEN' | 'ROT' | 'GELB'

export type FARBEDATA = {
    key: FARBE
    hexCode: string
    id: string
}

export const getFarbeData = (farbe: FARBE): FARBEDATA => {
    switch(farbe) {
        case 'BLAU': 
            return {
                key: 'BLAU',
                hexCode: "#2D327D",
                id: "background-blue"
            } as FARBEDATA
        case 'GRUEN':
            return {
                key: 'GRUEN',
                hexCode: "#237F52",
                id: "background-green"
            } as FARBEDATA
        case 'ROT':
            return {
                key: 'ROT',
                hexCode: "#9B2423",
                id: "background-red"
            } as FARBEDATA
        case 'GELB':
            return {
                key: 'GELB',
                hexCode: "#F7B500",
                id: "background-yellow"
            } as FARBEDATA
    }
}