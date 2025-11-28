export interface EventData {
    type: string;
    data: EventType[];
}

export type EventType = ClickData | LcpData | FcpData | PageTimeData;

export interface Module {
    clicks?: boolean;
    fcp?: boolean;
    lcp?: boolean;
    pageTime?: boolean;
};

export interface Selectors {
    targeted: string[];
    tracked: string[];
};

export interface CoreProps {
    modules?: Module;
    selectors?: Selectors;
    delayToLocalStore?: number;
    targetPages?: string[];
}

export interface Meta {
    url: string;
    timestamp: string;
}

export interface PageTimeData {
    meta: Meta;
    pageTime: number;
}

export interface FcpData {
    meta: Meta;
    fcp: number;
}

export interface LcpData {
    meta: Meta;
    lcp: number;
}

export interface ClickData {
    meta: Meta;
    isTarget: boolean;
    element: string;
    className: string;
    inlineStyles: string | null;
    // cssStyles: Record<string, string>;
    cursorCoords: {
        x: number;
        y: number;
    };
}
