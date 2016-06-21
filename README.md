# utility-node-log

> Note that this project is still in preview stage

[![GitHub version](https://badge.fury.io/gh/unknownmoon%2Futility-node-log.svg)](https://badge.fury.io/gh/unknownmoon%2Futility-node-log)
[![Dependency Status](https://david-dm.org/unknownmoon/utility-node-log.svg)](https://david-dm.org/unknownmoon/utility-node-log)
[![devDependency Status](https://david-dm.org/unknownmoon/utility-node-log/dev-status.svg)](https://david-dm.org/unknownmoon/utility-node-log#info=devDependencies)

| Master | Develop |
| ------ | ------- |
| [![Build Status Master](https://travis-ci.org/unknownmoon/utility-node-log.svg?branch=master)](https://travis-ci.org/unknownmoon/utility-node-log) | [![Build Status Develop](https://travis-ci.org/unknownmoon/utility-node-log.svg?branch=develop)](https://travis-ci.org/unknownmoon/utility-node-log) |
| [![Coverage Status](https://coveralls.io/repos/github/unknownmoon/utility-node-log/badge.svg?branch=master)](https://coveralls.io/github/unknownmoon/utility-node-log?branch=master) | [![Coverage Status](https://coveralls.io/repos/github/unknownmoon/utility-node-log/badge.svg?branch=develop)](https://coveralls.io/github/unknownmoon/utility-node-log?branch=develop) |

Log utility used in NodeJS environment.

- Featuring parsing objects using `util.inspect` and coloured outputs;
- Supporting NodeJS 6 and above.

The currently supported log levels are

| Level   | Description |
| ------- | ----------- |
| MUTE    | Avoid all outputs |
| INFO    | Informational outputs |
| LOG     | Generic logging, when enabled, the outputs of INFO will also be printed. |
| WARN    | Warning, when enabled, the outputs of INFO and LOG will also be printed. |
| ERROR   | Errors, when enabled, the outputs of INFO, LOG and WARN will also be printed |
| DEBUG   | Debugging information, when enabled, the outputs of INFO, LOG, WARN and ERROR will also be printed |
| VERBOSE | Anything, including the outputs of all of the other logging levels. |

Set `LOG_${levelName}` environment variable to `true` to enable the given level, i.e. `LOG_DEBUG=true`;

Basic unit test powered by [Mocha][mocha-link]/[Chai][chai-link]/[Sinon][sinon-link];

__Table of Contents__

<!-- MarkdownTOC -->

- [Basic Module Usages](#basic-module-usages)
    - [Set log level programmatically](#set-log-level-programmatically)
    - [Set time format programmatically](#set-time-format-programmatically)
    - [Wrap a content with colour](#wrap-a-content-with-colour)
    - [Change colour functions](#change-colour-functions)
    - [Logging APIs](#logging-apis)
- [Development](#development)
    - [Initialisation](#initialisation)
    - [Clean Up](#clean-up)
    - [Test](#test)
    - [Build](#build)
    - [Generate JSDoc Documentation](#generate-jsdoc-documentation)
    - [Release](#release)

<!-- /MarkdownTOC -->

<a name="basic-module-usages"></a>
## Basic Module Usages

<a name="set-log-level-programmatically"></a>
### Set log level programmatically

```javascript
import {logger} from 'utility-node-log';

// if muted
logger.logLevel = 'MUTE';
logger.log('anything'); // no outputs

// if error
logger.logLevel = 'ERROR';
logger.log('anything'); // [<time>][LOG] anything
logger.error('anything'); // [<time>][ERROR] anything 
logger.debug('anything'); // no outputs
```

<a name="set-time-format-programmatically"></a>
### Set time format programmatically

```javascript
import {logger} from 'utility-node-log';

// will be used to feed `moment.format`
logger.timeFormat = 'HH.mm.ss.SS';
```

<a name="wrap-a-content-with-colour"></a>
### Wrap a content with colour

```javascript
import {logger} from 'utility-node-log';

// used `chalk` colour functions to do the job
const result = logger.highlight('something');
// result: '<color-code>something<color-code>'

```

<a name="change-colour-functions"></a>
### Change colour functions

The currently supported colour cases are:

- `highlight`
- `time`
- `info`
- `warn`
- `error`
- `debug` - also used in `log` and `verbose` cases.
- `help` - not in use

```javascript
import {logger} from 'utility-node-log';
import chalk from 'chalk';

// only the given functions will be overridden
logger.colorMapping = new Map([
    ['highlight', chalk.cyan],
    ['time', chalk.gray]
]);
```

<a name="logging-apis"></a>
### Logging APIs

```javascript
import {logger} from 'utility-node-log';

// similar to use `console.log`, but with `[<time>][<log level>]` wrapper and coloured.
logger.info('anything'); // [<time>][INFO] anything
logger.log('anything'); // [<time>][LOG] anything
logger.warn('anything'); // [<time>][WARN] anything
logger.error('anything'); // [<time>][ERROR] anything
logger.debug('anything'); // [<time>][DEBUG] anything
logger.verbose('anything'); // [<time>][VERBOSE] anything

// -------

logger.inspect({ a: 1 }); 
// is the shorthand of
logger.debug( require( 'util' )
  .inspect( { a: 1 }, { depth: 7, colors: true } ) );

```

<a name="development"></a>
## Development

<a name="initialisation"></a>
### Initialisation

```bash
# Have Node ^6.0.0 & NPM ^3.8.6 installed

# install dependencies
npm install
```

<a name="clean-up"></a>
### Clean Up

```bash
# remove the built code, for now only the test result 
npm run clean

# remove the built code and node modules
npm run reset
```

<a name="test"></a>
### Test

Coverage report can be found in `./coverage` folder.

```bash
npm test
```

<a name="build"></a>
### Build

The source code is written in ES2015, hence before NodeJS fully support ES2015, we need to build the code to `es2015-node` using [Babel][babel-link].

The built code can be found in `./dist` folder. 

```bash
npm run build
```

<a name="generate-jsdoc-documentation"></a>
### Generate JSDoc Documentation

```bash
# generate the documentation
npm run doc

# serve the generated documentation using `http-server`
# note that no watch functionality is hooked, hence
# changing code won't trigger documentation regeneration.
npm run serve-doc
```

<a name="release"></a>
### Release

Shorthand script to generate release content, including `./coverage`, `./jsdoc` and `./dist`.

```bash
npm run release
```

<!-- links -->
[mocha-link]: http://mochajs.org/
[chai-link]: http://chaijs.com/ 
[sinon-link]: http://sinonjs.org/

