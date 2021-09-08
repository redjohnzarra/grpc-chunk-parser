# GRPC Chunk data parser

Typescript package for parsing grpc chunk data

## Installing the package

First, add a .npmrc file with the following content:

```
@redjohnzarra:registry=https://npm.pkg.github.com
```

Then install:
`npm i -S @redjohnzarra/grpc-chunk-parser`

## Usage

Import the parseGrpcData function in your file via the command

```
import { parseGrpcData } from '@redjohnzarra/grpc-chunk-parser';
```

parseGrpcData has 7 parameters

1. `url` - required - string - the grpc http endpoint
2. `method` - required - string - http method, currently 'POST' or 'GET'
3. `headers` - required - object - request headers
4. `body` - required - object - request body
5. `onChunkReceive` - required - function - returns the chunk data on each chunk received, (or on specific limit/pagesize defined in the 6th param)
6. `limiter` - optional - int - number of items to be returned in each chunk (chunk pagesize)
7. `concatData` - optional - boolean - indicator if data to be returned is every chunk or all the data up to the current limit

## Example

```
import { parseGrpcData } from '@redjohnzarra/grpc-chunk-parser';

const headers = {
    //Header object
};
const body = {
    //Body object
};

const url = SAMPLE_URL_HERE;

parseGrpcData(
    url,
    'POST',
    headers,
    body,
    (data: any) => {
        console.log('returned data', data);
    },
    6 // Every 6 items received, the function in param 5 `onChunkReceive` will be called.
);
```
