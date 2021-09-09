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

parseGrpcData has 3 parameters

1. `requestObject` - required - object - request object has 4 properties:  
   1.1. `url` - required - string - the grpc http endpoint  
   1.2. `method` - required - string - http method, currently 'POST' or 'GET'  
   1.3. `headers` - required - object - request headers  
   1.4. `body` - required - object - request body
2. `dataObject` - required - object - has the following 3 available properties (you can pass an empty object):  
   2.1. `limiter` - optional - int - number of items to be returned in each chunk (chunk pagesize)  
   2.2. `concatData` - optional - boolean - indicator if data to be returned is every chunk or all the data up to the current limit  
   2.3. `objectPrefix` - optional - string - for returning the object on a specific object path
3. `onChunkReceive` - required - function - returns the chunk data on each chunk received, (or on specific limit/pagesize defined in the 6th param)

## Example

```
import { parseGrpcData } from '@redjohnzarra/grpc-chunk-parser';

const headers = {
    //Header object
};
const body = {
    //Body object
};

parseGrpcData(
    {
        url: "SAMPLE_URL_HERE",
        method: 'POST',
        headers: {
            // request header object
        },
        body: {
            // request body object
        }
    },
    {
        limiter: 6, // Every 6 items received, the function in param 5 `onChunkReceive` will be called.
        concatData: false,
        objectPrefix: 'result.aws',
    },
    (data: any) => {
        console.log('returned data', data);
    },
);
```
