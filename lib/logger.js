/**
 * Logger module.
 *
 * @module logger
 */
import chalk from 'chalk';
import moment from 'moment';
import { inspect } from 'util';
import { defaultLogLevels, OUT_TIME_FMT, IS_COLOURED, genLogLevel } from './constants';

/**
 * @summary Wrap a function based on colour supports.
 *
 * @desc If supports colour, return the function, otherwise return a echo function `whatever => whatever`
 *
 * @param  {Function} fn Function to be filtered.
 * @return {Function}      The filtered function.
 */
function fnFilterByColour( fn ) {

  if ( IS_COLOURED ) {
    return fn;
  }

  return whatever => whatever;
}

const C = new Map( [
  [ 'highlight', fnFilterByColour( chalk.cyan ) ],
  [ 'time', fnFilterByColour( chalk.gray ) ],
  [ 'info', fnFilterByColour( chalk.reset ) ],
  [ 'warn', fnFilterByColour( chalk.yellow ) ],
  [ 'error', fnFilterByColour( chalk.red ) ],
  [ 'debug', fnFilterByColour( chalk.blue ) ],
  [ 'help', fnFilterByColour( chalk.green ) ]
] );

let _logLevel = new Map( defaultLogLevels );
let _timeFormat = OUT_TIME_FMT;

/**
 * Logger class with logging APIs and related helper APIs.
 */
class Logger {

  /**
   * @summary Get the colour mapping of the logger.
   *
   * @desc A map of colour case and corresponding colour function from `chalk`, of `{ colourCase: fn }` format.
   *
   * For example `{ highlight: ( content ) => hightlightFn( content ) }`.
   *
   * @type {Map}
   */
  get colorMapping( ) {
    return C;
  }

  /**
   * @summary Set the colour mapping of the logger.
   *
   * @desc A map of colour case and corresponding colour function from `chalk`, of `{ colourCase: fn }` format.
   *
   * If a colour case doesn't exist, the configuration will be omitted. The currently supported colour cases are:
   *
   * - `highlight`
   * - `time`
   * - `info`
   * - `warn`
   * - `error`
   * - `debug` - also used in `log` and `verbose` cases.
   * - `help` - not in use
   *
   * @type {Map}
   * @param {Map} configs A map of colour case and corresponding colour function from `chalk`, of `{ colourCase: fn }` format.
   */
  set colorMapping( configs ) {

    for ( const [ key, val ] of configs ) {

      // only update what exists
      if ( C.has( key ) ) {
        C.set( key, fnFilterByColour( val ) );
      }
    }

  }

  /**
   * @summary Get the log level configurations of the logger.
   *
   * @desc A map of log level is provided, of `{ logLevel: Boolean }` format.
   *
   * For example `map.get('INFO')` will be `true`, if the `INFO=true` is given when start the application.
   *
   * @type {Map}
   */
  get logLevel( ) {
    return _logLevel;
  }

  /**
   * @summary Set log level of the logger.
   *
   * @desc Set the log level of the logger by assign this property one of the following values:
   *
   * ```javascript
   * [ 'MUTE', 'VERBOSE', 'DEBUG', 'ERROR', 'WARN', 'LOG', 'INFO' ]
   * ```
   *
   * `MUTE` will disable outputs, while among the reset of the levels, when one is set, all of the right ones will also be flagged as `true`.
   *
   * For example, `logger.logLevel = 'DEBUG';` will enable APIs `debug`, `error`, ..., till `info`, but disable `verbose`.
   *
   * Note that only string assignment will be handled.
   *
   * @type {String}
   * @param {String} lvl Log level.
   */
  set logLevel( lvl ) {

    // only handle string level
    if ( typeof lvl !== 'string' ) {
      return;
    }

    lvl = lvl.toUpperCase( );

    _logLevel = genLogLevel( logLvl => logLvl === lvl );

  }

  /**
   * @summary Get the time format string of the logger.
   *
   * @desc The time format is used to feed `moment.format()`.
   *
   * The default value is `'HH.mm.ss.SSS'`.
   *
   * @type {String}
   */
  get timeFormat( ) {
    return _timeFormat;
  }

  /**
   * @summary Set the time format string of the logger.
   *
   * @desc The time format is used to feed `moment.format()`.
   *
   * Note that only string assignment will be handled.
   *
   * @type {String}
   * @param {String} fmt The time format is used to feed `moment.format()`.
   */
  set timeFormat( fmt ) {

    // only handle string format
    if ( typeof fmt !== 'string' ) {
      return;
    }

    _timeFormat = fmt;
  }

  /**
   * @summary Wrapper the given content with the highlight colour.
   * @param  {String} content Content to be wrapped.
   * @return {String}         Content wrapped using the highlight colour.
   */
  highlight( content ) {
    return C.get( 'highlight' )( content );
  }

  /**
   * @summary Inspect the given object.
   *
   * @desc Enforced `util.inspect` to inspect object.
   *
   * It may only be helpful when debugging, hence `DEBUG` level should be enabled to use this API.
   * The `depth` of `util.inspect` is set to `7`, which should be enough for 80% of the cases.
   *
   * @param  {Object} object The object to be inspected.
   */
  inspect( object ) {

    this.debug( `\n${ inspect( object, {
      depth: 7,
      colors: IS_COLOURED && true
    } ) }\n` );

  }

  /**
   * Wrapper of `console.info`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.info` API, will wrap the first argument (the message).
   */
  info( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'info' )( 'INFO' ) }] ${ C.get( 'info' )( args[ 0 ] ) }`;

    this.logLevel.get( 'INFO' ) && Reflect.apply( console.info, this, args );
  }

  /**
   * Wrapper of `console.log`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.log` API, will wrap the first argument (the message).
   */
  log( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'LOG' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'LOG' ) && Reflect.apply( console.log, this, args );
  }

  /**
   * Wrapper of `console.warn`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.warn` API, will wrap the first argument (the message).
   */
  warn( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'warn' )( 'WARN' ) }] ${ C.get( 'warn' )( args[ 0 ] ) }`;

    this.logLevel.get( 'WARN' ) && Reflect.apply( console.warn, this, args );
  }

  /**
   * Wrapper of `console.error`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.error` API, will wrap the first argument (the message).
   */
  error( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'error' )( 'ERROR' ) }] ${ C.get( 'error' )( args[ 0 ] ) }`;

    this.logLevel.get( 'ERROR' ) && Reflect.apply( console.error, this, args );
  }

  /**
   * Wrapper of `console.log`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.log` API, will wrap the first argument (the message).
   */
  debug( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'DEBUG' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'DEBUG' ) && Reflect.apply( console.log, this, args );
  }

  /**
   * Wrapper of `console.log`.
   * Extra content such as log level and time will be injected, and the message will be coloured whenever possible.
   *
   * Detected by `supports-color`.
   *
   * @param  {...String|Object} args Used to feed `console.log` API, will wrap the first argument (the message).
   */
  verbose( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'VERBOSE' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'VERBOSE' ) && Reflect.apply( console.log, this, args );
  }
}

export const logger = new Logger( );
