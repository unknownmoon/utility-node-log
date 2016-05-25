# utility-node-log

> Note that this project is still in preview stage

[![GitHub version](https://badge.fury.io/gh/unknownmoon%2Futility-node-log.svg)](https://badge.fury.io/gh/unknownmoon%2Futility-node-log)
[![Dependency Status](https://david-dm.org/unknownmoon/utility-node-log.svg)](https://david-dm.org/unknownmoon/utility-node-log)
[![devDependency Status](https://david-dm.org/unknownmoon/utility-node-log/dev-status.svg)](https://david-dm.org/unknownmoon/utility-node-log#info=devDependencies)

| Master | Develop |
| ------ | ------- |
| [![Build Status Master](https://travis-ci.org/unknownmoon/utility-node-log.svg?branch=master)](https://travis-ci.org/unknownmoon/utility-node-log) | [![Build Status Develop](https://travis-ci.org/unknownmoon/utility-node-log.svg?branch=develop)](https://travis-ci.org/unknownmoon/utility-node-log) |

Log utility used in NodeJS environment.

- Featuring parsing objects using `util.inspect` and coloured outputs;
- Supporting NodeJS 6 and above.

Basic unit test powered by [Mocha][mocha-link]/[Chai][chai-link]/[Sinon][sinon-link];

__Table of Contents__

<!-- MarkdownTOC -->

- [Initialisation](#initialisation)
- [Clean Up](#clean-up)
- [Test](#test)
- [Generate JSDoc Documentation](#generate-jsdoc-documentation)

<!-- /MarkdownTOC -->

<a name="initialisation"></a>
## Initialisation

```bash
# Have Node ^6.0.0 & NPM ^3.8.6 installed

# install dependencies
npm install
```

<a name="clean-up"></a>
## Clean Up

```bash
# remove the built code, for now only the test result 
npm run clean

# remove the built code and node modules
npm run reset
```

<a name="test"></a>
## Test

Coverage report can be found in `./coverage` folder.

```bash
npm test
```

<a name="generate-jsdoc-documentation"></a>
## Generate JSDoc Documentation

```bash
# generate the documentation
npm run doc

# serve the generated documentation using `http-server`
# note that no watch functionality is hooked, hence
# changing code won't trigger documentation regeneration.
npm run serve-doc
```

<!-- links -->
[mocha-link]: http://mochajs.org/
[chai-link]: http://chaijs.com/ 
[sinon-link]: http://sinonjs.org/

