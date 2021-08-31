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

parseGrpcData has 6 parameters

1. `url` - required - the grpc http endpoint
2. `method` - required - http method, currently 'POST' or 'GET'
3. `headers` - required - object request headers
4. `body` - required - object request body
5. `onChunkReceive` - required - function that returns the chunk data on each chunk received, (or on specific limit/pagesize defined in the 6th param)
6. `limiter` - optional - number of items to be returned in each chunk (chunk pagesize)
