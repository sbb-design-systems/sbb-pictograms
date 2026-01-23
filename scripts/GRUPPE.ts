export enum GRUPPE {
    PFEILRICHTUNGEN = 'PFEILRICHTUNGEN',
    DREHRICHTUNGEN = 'DREHRICHTUNGEN',
    GLEISE = 'GLEISE',
    SEKTOREN = 'SEKTOREN',
    KANTEN = 'KANTEN',
    KLASSEN = 'KLASSEN',
    VERKEHRSMITTEL = 'VERKEHRSMITTEL',
    PARKIEREN = 'PARKIEREN',
    BARRIEREFREIHEIT = 'BARRIEREFREIHEIT',
    DIENSTLEISTUNGEN = 'DIENSTLEISTUNGEN',
    AUF_ABGAENGE = 'AUF_ABGAENGE',
    ENTSORGUNG_RECYCLING = 'ENTSORGUNG_RECYCLING',
    HYGIENE = 'HYGIENE',
    FUNKTIONSWEISE = 'FUNKTIONSWEISE',
    GEBOTE_VERBOTE = 'GEBOTE_VERBOTE',
    EVAKUATION = 'EVAKUATION',
    BRANDBEKAEMPFUNG = 'BRANDBEKAEMPFUNG',
    POINT_OF_INTEREST = 'POINT_OF_INTEREST'
}

export interface GRUPPEDATA {
    key: GRUPPE
    nameDeutsch: string
    nameFranzoesisch: string
    nameItalienisch: string
    nameEnglisch: string
}

export const getGruppeData = (gruppe: GRUPPE): GRUPPEDATA => {
    switch(gruppe) {
        case GRUPPE.PFEILRICHTUNGEN: 
    return {
        key: "PFEILRICHTUNGEN",
        nameDeutsch: "Pfeilrichtungen",
        nameFranzoesisch: "Flèches de direction",
        nameItalienisch: "Direzioni",
        nameEnglisch: "Directions"
    } as GRUPPEDATA

case GRUPPE.DREHRICHTUNGEN: 
    return {
        key: "DREHRICHTUNGEN",
        nameDeutsch: "Drehrichtungen",
        nameFranzoesisch: "Sens de rotation",
        nameItalienisch: "Rotazioni",
        nameEnglisch: "Rotations"
    } as GRUPPEDATA

case GRUPPE.GLEISE: 
    return {
        key: "GLEISE",
        nameDeutsch: "Gleise",
        nameFranzoesisch: "Voies",
        nameItalienisch: "Binari",
        nameEnglisch: "Platforms"
    } as GRUPPEDATA

case GRUPPE.SEKTOREN: 
    return {
        key: "SEKTOREN",
        nameDeutsch: "Sektoren",
        nameFranzoesisch: "Secteurs",
        nameItalienisch: "Settori",
        nameEnglisch: "Sectors"
    } as GRUPPEDATA

case GRUPPE.KANTEN: 
    return {
        key: "KANTEN",
        nameDeutsch: "Kanten",
        nameFranzoesisch: "Quai",
        nameItalienisch: "Corsia",
        nameEnglisch: "Stops"
    } as GRUPPEDATA

case GRUPPE.KLASSEN: 
    return {
        key: "KLASSEN",
        nameDeutsch: "Klassen",
        nameFranzoesisch: "Classes",
        nameItalienisch: "Classi",
        nameEnglisch: "Classes"
    } as GRUPPEDATA

case GRUPPE.VERKEHRSMITTEL: 
    return {
        key: "VERKEHRSMITTEL",
        nameDeutsch: "Verkehrsmittel",
        nameFranzoesisch: "Moyen de transport",
        nameItalienisch: "Mezzi di trasporto",
        nameEnglisch: "Transports"
    } as GRUPPEDATA

case GRUPPE.PARKIEREN: 
    return {
        key: "PARKIEREN",
        nameDeutsch: "Parkieren",
        nameFranzoesisch: "Stationnement",
        nameItalienisch: "Parcheggi",
        nameEnglisch: "Parking"
    } as GRUPPEDATA

case GRUPPE.BARRIEREFREIHEIT: 
    return {
        key: "BARRIEREFREIHEIT",
        nameDeutsch: "Barrierefreiheit",
        nameFranzoesisch: "Accessibilité",
        nameItalienisch: "Accessibilità",
        nameEnglisch: "Accessibility"
    } as GRUPPEDATA

case GRUPPE.DIENSTLEISTUNGEN: 
    return {
        key: "DIENSTLEISTUNGEN",
        nameDeutsch: "Dienstleistungen",
        nameFranzoesisch: "Services",
        nameItalienisch: "Servizi",
        nameEnglisch: "Services"
    } as GRUPPEDATA

case GRUPPE.AUF_ABGAENGE: 
    return {
        key: "AUF_ABGAENGE",
        nameDeutsch: "Auf-Abgänge",
        nameFranzoesisch: "Escaliers, rampes, ascenseurs",
        nameItalienisch: "Salite/discese",
        nameEnglisch: "Risings-leavings"
    } as GRUPPEDATA

case GRUPPE.ENTSORGUNG_RECYCLING: 
    return {
        key: "ENTSORGUNG_RECYCLING",
        nameDeutsch: "Entsorgung-Recycling",
        nameFranzoesisch: "Élimination, recyclage",
        nameItalienisch: "Smaltimento, riciclaggio",
        nameEnglisch: "Recycling"
    } as GRUPPEDATA

case GRUPPE.HYGIENE: 
    return {
        key: "HYGIENE",
        nameDeutsch: "Hygiene",
        nameFranzoesisch: "Hygiène",
        nameItalienisch: "Igiene",
        nameEnglisch: "Hygiene"
    } as GRUPPEDATA

case GRUPPE.FUNKTIONSWEISE: 
    return {
        key: "FUNKTIONSWEISE",
        nameDeutsch: "Funktionsweise",
        nameFranzoesisch: "Fonctionnement",
        nameItalienisch: "Funzionamento",
        nameEnglisch: "Functionality"
    } as GRUPPEDATA

case GRUPPE.GEBOTE_VERBOTE: 
    return {
        key: "GEBOTE_VERBOTE",
        nameDeutsch: "Gebote_Verbote",
        nameFranzoesisch: "Prescriptions, interdictions",
        nameItalienisch: "Ingiunzioni, divieti",
        nameEnglisch: "Prohibitions"
    } as GRUPPEDATA

case GRUPPE.EVAKUATION: 
    return {
        key: "EVAKUATION",
        nameDeutsch: "Evakuation",
        nameFranzoesisch: "Évacuation",
        nameItalienisch: "Evacuazione",
        nameEnglisch: "Evacuation"
    } as GRUPPEDATA

case GRUPPE.BRANDBEKAEMPFUNG: 
    return {
        key: "BRANDBEKAEMPFUNG",
        nameDeutsch: "Brandbekämpfung",
        nameFranzoesisch: "Lutte contre le feu",
        nameItalienisch: "Lotta contro gli incendi",
        nameEnglisch: "Firefighting"
    } as GRUPPEDATA

case GRUPPE.POINT_OF_INTEREST: 
    return {
        key: "POINT_OF_INTEREST",
        nameDeutsch: "Point of Interest",
        nameFranzoesisch: "Point of Interest",
        nameItalienisch: "Point of Interest",
        nameEnglisch: "Point of Interest"
    } as GRUPPEDATA
    }
}