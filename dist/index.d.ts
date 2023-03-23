export interface DynamicObject {
    [key: string]: any;
}
export declare const parseGrpcData: (requestObject: {
    url: string;
    method: 'POST' | 'GET' | 'post' | 'get';
    headers: DynamicObject;
    body?: DynamicObject;
}, dataObject: {
    limiter?: number;
    concatData?: boolean;
    objectPrefix?: string;
}, onChunkReceive?: (data: any) => void, onFinish?: (data: any) => void, onError?: (e: any) => void) => Promise<void>;
