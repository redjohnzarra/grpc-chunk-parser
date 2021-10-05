# GRPC Chunk data parser

Typescript package for parsing grpc chunk data

## Installing the package

First, add a `.npmrc` file with the following content:

```
@redjohnzarra:registry=https://npm.pkg.github.com
```

Then install:
`npm i -S @redjohnzarra/grpc-chunk-parser`

## Usage

Import the **parseGrpcData** function in your file via the command

```
import { parseGrpcData } from '@redjohnzarra/grpc-chunk-parser';
```

Then call it like you would a normal function
`parseGrpcData(**PARAMS_HERE**)`

parseGrpcData has **5 parameters**:

1. **requestObject** - `required` - _object_ - request object has 4 properties:
    - **url** - `required` - _string_ - the grpc http endpoint
    - **method** - `required` - _string_ - http method, currently 'POST' or 'GET'
    - **headers** - `required` - _object_ - request headers
    - **body** - `required` - _object_ - request body
2. **dataObject** - `required` (you can pass an empty object) - _object_ - has the following 3 available properties:
    - **limiter** - `optional` - _integer_ - number of items to be returned in each chunk (chunk pagesize)
    - **concatData** - `optional` - _boolean_ - indicator if data to be returned is every chunk or all the data up to the current limit
    - **objectPrefix** - `optional` - _string_ - for returning the object on a specific object path
3. **onChunkReceive** - `optional` - _function_ - returns the chunk data on each chunk received, (or on specific limit/pagesize defined in the 6th param)
4. **onFinish** - `optional` - _function_ - function called when all chunks have been returned, returns the full data
5. **onError** - `optional` - _function_ - returns the error if an error is encountered during the request

## Example

```
import { parseGrpcData } from '@redjohnzarra/grpc-chunk-parser';

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
        limiter: 20, // Every 20 items received, the function in
			        // param 3 `onChunkReceive` will be called.
        concatData: false,
        objectPrefix: 'result.aws',
    },
    (data: any) => {
        console.log('returned data', data);
    },
    (fullData: any) => {
        console.log('On finish here', fullData)
    },
    (err: any) => {
        console.log('Error here, err)
    }
);
```
