import { clone, first, forEach, get, isEmpty, last } from 'lodash';

export interface DynamicObject {
    [key: string]: any;
}

export const parseGrpcData = async (
    requestObject: {
        url: string;
        method: 'POST' | 'GET' | 'post' | 'get';
        headers: DynamicObject;
        body: DynamicObject;
    },
    dataObject: {
        limiter?: number; //limit/page size before data is being returned
        concatData?: boolean; //returns all data from start until the limit
        objectPrefix?: string; // string for returning the object on a specific object path
    },
    onChunkReceive?: (data: any) => void,
    onFinish?: (data: any) => void,
    onError?: (e: any) => void
) => {
    const { url, method, headers, body } = requestObject;
    const limiter = get(dataObject, 'limiter');
    const concatData = get(dataObject, 'concatData');
    const objectPrefix = get(dataObject, 'objectPrefix');
    let lastCutData = '';
    const allData: DynamicObject[] = [];
    const limiterData: DynamicObject[] = [];
    const hasLimiter = limiter && limiter > 0;

    const res: any = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
    }).catch((e: any) => {
        if (onError) onError(e);
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf8');
    while (true) {
        const parsedChunkData: DynamicObject[] = [];
        const { value, done } = await reader.read();
        if (done) break;
        const chunk: string = decoder.decode(value);
        const chunkData = chunk.split(/\r?\n/);
        const lastData = last(chunkData) || '';
        let includedParsedData;
        if (!isEmpty(lastCutData)) {
            const firstData = first(chunkData) || '';
            includedParsedData = lastCutData + firstData;
            chunkData[0] = includedParsedData;
        }

        if (!isEmpty(lastData)) {
            lastCutData = lastData;
            delete chunkData[chunkData.length - 1];
        } else {
            lastCutData = '';
        }

        forEach(chunkData, (chunkStr: string) => {
            if (!isEmpty(chunkStr)) {
                try {
                    const parsedChunk = JSON.parse(chunkStr);
                    const pushedData = objectPrefix
                        ? get(parsedChunk, objectPrefix)
                        : parsedChunk;
                    allData.push(pushedData);
                    parsedChunkData.push(pushedData);
                    if (hasLimiter) {
                        limiterData.push(pushedData);
                        if (limiterData.length === limiter) {
                            const newLimiterData = clone(limiterData);
                            limiterData.splice(0, limiter);
                            const returnedData = concatData
                                ? allData
                                : newLimiterData;
                            onChunkReceive(returnedData);
                        }
                    }
                } catch (_err) {
                    console.log('Failed to parse json chunk');
                }
            }
        });

        if (!hasLimiter) {
            const returnedData = concatData ? allData : parsedChunkData;
            onChunkReceive(returnedData);
        }
    }
    if (hasLimiter && limiterData.length > 0) {
        const returnedData = concatData ? allData : limiterData;
        onChunkReceive(returnedData);
    }

    if (isEmpty(allData)) {
        onChunkReceive([]);
    }

    if (onFinish) {
        onFinish(allData);
    }
};
