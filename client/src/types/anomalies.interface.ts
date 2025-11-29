export interface Feature {
    feature: string;
    value: number;
    shap_value: number;
}

export interface DeviceInfo {
    os?: string;
    browser?: string;
    device_category?: number;
    screen_w?: number;
    screen_h?: number;
}

export interface GeoInfo {
    country?: string;
    city?: string;
}

export interface TrafficInfo {
    source?: string;
    utm_source?: string;
    utm_campaign?: string;
}

export interface AdditionalVisitInfo {
    bounce?: number;
    pageViews?: number;
    [key: string]: any;
}

export interface VisitEvent {
    event_type: "visit_start" | "visit_end" | string;
    timestamp: string;
    visit_id: string;
    client_id: string;
    url: string;
    referer?: string | null;
    device: DeviceInfo;
    geo: GeoInfo;
    traffic: TrafficInfo;
    additional: AdditionalVisitInfo;
}

export interface Anomalies {
    visit_id: string;
    is_anomaly: boolean;
    top_features: Feature[];
    explanation: string;
    llm_explanation: string;
    events: VisitEvent[];
}
