export interface Module {
    clicks?: boolean;
    fcp?: boolean;
    lcp?: boolean;
    pageTime?: boolean;
};

export interface CoreProps {
    modules?: Module;
    selectors?: string[];
    delayToLocalStore?: number;
    targetPages?: string[];
}

export interface CommonData {
    clicks?: ClickData[];
    fcp?: FcpData[];
    lcp?: LcpData[];
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
    element: HTMLElement;
    className: string;
    inlineStyles: string | null;
    cssStyles: Record<string, string>;
    cursorCoords: {
        x: number;
        y: number;
    };
}
