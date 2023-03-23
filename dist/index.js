"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGrpcData = void 0;
exports.parseGrpcData = function (requestObject, dataObject, onChunkReceive, onFinish, onError) { return __awaiter(void 0, void 0, void 0, function () {
    var url, method, headers, _a, limiter, concatData, objectPrefix, allData, limiterData, hasLimiter, fetchProps, res, count, failedCount, reader, decoder, result, startObject, endObjRegex, parsedChunkData, _b, value, done, chunk, startIndex, endIndex, jsonStr, restOfStr, parsedChunk, pushedData, newLimiterData, returnedData, returnedData, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                console.time('parseGrpcData');
                url = requestObject.url, method = requestObject.method, headers = requestObject.headers;
                _a = dataObject || {}, limiter = _a.limiter, concatData = _a.concatData, objectPrefix = _a.objectPrefix;
                allData = [];
                limiterData = [];
                hasLimiter = limiter && limiter > 0;
                fetchProps = {
                    method: method,
                    headers: headers,
                    body: requestObject.body ? JSON.stringify(requestObject.body) : undefined,
                };
                return [4 /*yield*/, fetch(url, fetchProps).catch(function (e) {
                        onError === null || onError === void 0 ? void 0 : onError(e);
                    })];
            case 1:
                res = _c.sent();
                count = 0;
                failedCount = 0;
                reader = (res === null || res === void 0 ? void 0 : res.body) ? res.body.getReader() : undefined;
                decoder = new TextDecoder('utf8');
                result = '';
                startObject = '{"result":';
                endObjRegex = /}}\n+/g;
                _c.label = 2;
            case 2:
                if (!(true && reader)) return [3 /*break*/, 4];
                parsedChunkData = [];
                return [4 /*yield*/, reader.read()];
            case 3:
                _b = _c.sent(), value = _b.value, done = _b.done;
                if (done)
                    return [3 /*break*/, 4];
                chunk = decoder.decode(value);
                result += chunk;
                startIndex = result.indexOf(startObject);
                endIndex = result.search(endObjRegex);
                if (startIndex !== -1 && endIndex !== -1) {
                    jsonStr = result.substring(startIndex, endIndex + 2);
                    restOfStr = result.substring(endIndex + 2);
                    try {
                        parsedChunk = JSON.parse(jsonStr);
                        pushedData = objectPrefix
                            ? parsedChunk === null || parsedChunk === void 0 ? void 0 : parsedChunk.objectPrefix : parsedChunk;
                        allData.push(pushedData);
                        parsedChunkData.push(pushedData);
                        if (hasLimiter) {
                            limiterData.push(pushedData);
                            if (limiterData.length === limiter) {
                                newLimiterData = __spreadArrays(limiterData);
                                limiterData.splice(0, limiter);
                                returnedData = concatData
                                    ? allData
                                    : newLimiterData;
                                onChunkReceive(returnedData);
                            }
                        }
                    }
                    catch (_err) {
                        // onError(_err);
                        console.log('Failed to parse json chunk');
                        failedCount++;
                    }
                    finally {
                        result = restOfStr;
                        count++;
                    }
                }
                return [3 /*break*/, 2];
            case 4:
                if (hasLimiter && limiterData.length > 0) {
                    returnedData = concatData ? allData : limiterData;
                    onChunkReceive(returnedData);
                }
                if (allData.length === 0) {
                    onChunkReceive([]);
                }
                if (onFinish) {
                    console.log("count: ", count);
                    console.log("failed count: ", failedCount);
                    console.timeEnd('parseGrpcData');
                    onFinish(allData);
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                if (onError)
                    onError(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map