import { clone, first, forEach, isEmpty, last } from 'lodash';

export interface DynamicObject {
    [key: string]: any;
}

export const parseGrpcData = async (
    url: string,
    method: 'POST' | 'GET' | 'post' | 'get',
    headers: DynamicObject,
    body: DynamicObject,
    onChunkReceive: (data: any) => void,
    limiter?: number
) => {
    let lastCutData = '';
    const allData: DynamicObject[] = [];
    const limiterData: DynamicObject[] = [];
    const hasLimiter = limiter && limiter > 0;

    const res: any = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf8');
    while (true) {
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
                    allData.push(parsedChunk);
                    if (hasLimiter) {
                        limiterData.push(parsedChunk);
                        if (limiterData.length === limiter) {
                            const newLimiterData = clone(limiterData);
                            limiterData.splice(0, limiter);
                            onChunkReceive(newLimiterData);
                        }
                    }
                } catch (_err) {
                    throw new Error('Failed to parse json chunk');
                }
            }
        });

        if (!hasLimiter) onChunkReceive(chunk);
    }
    if (hasLimiter && limiterData.length > 0) onChunkReceive(limiterData);
};
