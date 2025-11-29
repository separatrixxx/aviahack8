export interface Meta {
    url: string;
    timestamp: string;
}

export interface FcpData {
    fcp: number;
    meta: Meta;
}

export interface LcpData {
    lcp: number;
    meta: Meta;
}

export interface ClickData {
    meta: Meta;
    isTarget: boolean;
    element: string;
    className: string;
    inlineStyles: string | null;
    cursorCoords: {
        x: number;
        y: number;
    };
}

export type MetricData = 
    | { type: 'fcp'; data: FcpData }
    | { type: 'lcp'; data: LcpData }
    | { type: 'click'; data: ClickData };

export interface MetricGroup {
    id: number;
    url: string;
    metrics: MetricData[];
    created_at: string;
    updated_at: string;
}
