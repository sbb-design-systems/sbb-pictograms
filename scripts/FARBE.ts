export enum FARBE {
    BLAU = "BLAU",
    GRUEN = "GRUEN",
    ROT = "ROT",
    GELB = "GELB"
}

export interface FARBEDATA {
    key: FARBE
    hexCode: string
    id: string
}

export const getFarbeData = (farbe: FARBE): FARBEDATA => {
    switch(farbe) {
        case FARBE.BLAU: 
            return {
                key: FARBE.BLAU,
                hexCode: "#2D327D",
                id: "background-blue"
            } as FARBEDATA
        case FARBE.GRUEN:
            return {
                key: FARBE.GRUEN,
                hexCode: "#237F52",
                id: "background-green"
            } as FARBEDATA
        case FARBE.ROT:
            return {
                key: FARBE.ROT,
                hexCode: "#9B2423",
                id: "background-red"
            } as FARBEDATA
        case FARBE.GELB:
            return {
                key: FARBE.GELB,
                hexCode: "#F7B500",
                id: "background-yellow"
            } as FARBEDATA
    }
}