export interface DynamicObject {
    [key: string]: any;
}
export declare const parseGrpcData: (url: string, method: "POST" | "GET", headers: DynamicObject, body: DynamicObject, onChunkReceive: (data: any) => void, limiter?: number) => Promise<void>;
