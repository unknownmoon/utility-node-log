/**
 * Constants module.
 *
 * @module constants
 */
import chalk from 'chalk';
import { getOpts } from 'utility-node-opts-parser';

/**
 * @summary Indicating if the environment support colours, powered by `supports-color` in `chalk`.
 *
 * @type {Boolean}
 */
export const IS_COLOURED = chalk.supportsColor;

/**
 * @summary The prefix of environment variable
 *
 * @default `LOG_`
 *
 * @type {String}
 */
const PREFIX = 'LOG_';

/**
 * @summary The supported log levels.
 *
 * @desc The currently supported log levels are
 *
 * | Level   | Description |
 * | ------- | ----------- |
 * | MUTE    | Avoid all outputs |
 * | INFO    | Informational outputs |
 * | LOG     | Generic logging, when enabled, the outputs of INFO will also be printed. |
 * | WARN    | Warning, when enabled, the outputs of INFO and LOG will also be printed. |
 * | ERROR   | Errors, when enabled, the outputs of INFO, LOG and WARN will also be printed |
 * | DEBUG   | Debugging information, when enabled, the outputs of INFO, LOG, WARN and ERROR will also be printed |
 * | VERBOSE | Anything, including the outputs of all of the other logging levels. |
 *
 * @constant
 * @type {Array}
 */
const LOG_LEVELS = [ 'MUTE', 'VERBOSE', 'DEBUG', 'ERROR', 'WARN', 'LOG', 'INFO' ]; // strictly ordered, so that the previous one override the next one.

// external opts in the arguments to start the application or from the environment variables
// prefer to set in the environment variables
const opts = getOpts( ...LOG_LEVELS.map( level => PREFIX + level )
  .concat( `${ PREFIX }TIME_FMT` ) );


/**
 * @summary Function to generate the value of log value.
 *
 * @desc The result will be used to do logic operation.
 *
 * @callback logLvlValFn
 *
 * @param  {String} logLvl Log level such as `INFO`
 *
 * @return {Boolean}    The value of the log level should be, regardless the other log levels.
 */

/**
 * @summary Generate log level switches, based on the given log level value calculate function and the pre-set log level override logic.
 *
 * @param  {logLvlValFn} logLvlValFn  Function to generate the value of log value.
 *
 * @return {Map}    Result map with data in `{ logLvl: Boolean }` format.
 */
export function genLogLevel( logLvlValFn ) {

  let fn = ( ) => false;
  const result = new Map( );

  if ( typeof logLvlValFn === 'function' ) {
    fn = logLvlValFn;
  }

  LOG_LEVELS.reduce( ( status, logLvl ) => {
    let val = fn( logLvl );

    if ( logLvl !== 'MUTE' ) {

      // it's the other log levels

      val = !status.result.get( 'MUTE' ) && ( status.currentLvl || val );
      status.currentLvl = val;
    }

    status.result.set( logLvl, val );

    return status;
  }, {
    currentLvl: false,
    result
  } );

  return result;
}

export const defaultLogLevels = genLogLevel( logLvl => _genericEnableStatus( opts, `${ PREFIX }${ logLvl }` ) );

/**
 * @summary The time format when logging.
 *
 * @desc This value can be set from environment variable `LOG_TIME_FMT`
 *
 * @default `'HH.mm.ss.SSS'`
 *
 * @type {String}
 */
export const OUT_TIME_FMT = opts.get( `${ PREFIX }TIME_FMT` ) || 'HH.mm.ss.SSS';

/**
 * @summary Generic function to check if a flag has been set to non-`false` value.
 *
 * @param  {Map} opts A map with items of `{ optName: value|null }` format.
 * @param  {String} flag The flag to be verified
 * @return {Boolean}    `true` when the flag is set and the value isn't `false`
 */
function _genericEnableStatus( opts, flag ) {
  // if the flag is set and the value is not `false`.
  // even CLI only have text, namely Boolean `false` will be `'false'`,
  // still append the Boolean value check.
  return opts.get( flag ) !== null && opts.get( flag ) !== 'false' && opts.get( flag ) !== false;
}

/**
 * @summary Log level - Mute
 *
 * @desc If MUTE is `true`, the log using all of the logging APIs will not be printed to stdout.
 *
 * MUTE is `true` if LOG_MUTE is set in the environment variable and the value is not `false`.
 *
 * @type {Boolean}
 */
export const MUTE = defaultLogLevels.get( 'MUTE' );

/**
 * @summary Log level - Verbose
 *
 * @desc If VERBOSE is `true`, the log using the `verbose` APIs will be printed to stdout.
 *
 * The outputs of all of the other logging levels will be printed to stdout.
 *
 * VERBOSE is `true` if
 *
 * - MUTE is `false` and
 * - VERBOSE is set in the environment variable and the value is not `false`
 *
 * @type {Boolean}
 */
export const VERBOSE = defaultLogLevels.get( 'VERBOSE' );

/**
 * @summary Log level - Debug
 *
 * @desc If DEBUG is `true`, the log using the `debug` APIs will be printed to stdout.
 *
 * The outputs of INFO, LOG, WARN and ERROR will also be printed.
 *
 * DEBUG is `true` if
 *
 * - MUTE is `false` and
 * - and
 *   - DEBUG is set in the environment variable and the value is not `false`
 *   - or VERBOSE is `true`
 *
 * @type {Boolean}
 */
export const DEBUG = defaultLogLevels.get( 'DEBUG' );

/**
 * @summary Log level - Error
 *
 * @desc If ERROR is `true`, the log using the `error` API will be printed to stdout.
 *
 * The outputs of INFO, LOG and WARN will also be printed.
 *
 * ERROR is `true` if
 *
 * - MUTE is `false`
 * - and
 *   - ERROR is set in the environment variable and the value is not `false`
 *   - or DEBUG is `true`
 *   - or VERBOSE is `true`
 *
 * @type {Boolean}
 */
export const ERROR = defaultLogLevels.get( 'ERROR' );

/**
 * @summary Log level - Warn
 *
 * @desc If WARN is `true`, the log using the `warn` API will be printed to stdout.
 *
 * The outputs of INFO and LOG will also be printed.
 *
 * WARN is `true` if
 *
 * - MUTE is `false`
 * - and
 *   - WARN is set in the environment variable and the value is not `false`
 *   - or ERROR is `true`
 *   - or DEBUG is `true`
 *   - or VERBOSE is `true`
 *
 * @type {Boolean}
 */
export const WARN = defaultLogLevels.get( 'WARN' );

/**
 * @summary Log level - Log
 *
 * @desc If LOG is `true`, the log using the `log` API will be printed to stdout.
 *
 * The outputs of INFO will also be printed.
 *
 * LOG is `true` if
 *
 * - MUTE is `false`
 * - and
 *   - LOG is set in the environment variable and the value is not `false`
 *   - or WARN is `true`
 *   - or ERROR is `true`
 *   - or DEBUG is `true`
 *   - or VERBOSE is `true`
 *
 * @type {Boolean}
 */
export const LOG = defaultLogLevels.get( 'LOG' );

/**
 * @summary Log level - Info
 *
 * @desc If INFO is `true`, the log using the `info` API will be printed to stdout.
 *
 * INFO is `true` if
 *
 * - MUTE is `false`
 * - and
 *   - INFO is set in the environment variable and the value is not `false`
 *   - or LOG is `true`
 *   - or WARN is `true`
 *   - or ERROR is `true`
 *   - or DEBUG is `true`
 *   - or VERBOSE is `true`
 *
 * @type {Boolean}
 */
export const INFO = defaultLogLevels.get( 'INFO' );
