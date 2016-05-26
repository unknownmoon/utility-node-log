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
const LOG_LEVELS = [ 'MUTE', 'INFO', 'LOG', 'WARN', 'ERROR', 'DEBUG', 'VERBOSE' ].map( level => PREFIX + level );

// external opts in the arguments to start the application or from the environment variables
// prefer to set in the environment variables
const opts = getOpts( ...LOG_LEVELS.concat( `${ PREFIX }TIME_FMT` ) );

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
export const MUTE = _genericEnableStatus( opts, `${ PREFIX }MUTE` );

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
export const VERBOSE = !MUTE && _genericEnableStatus( opts, `${ PREFIX }VERBOSE` );

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
export const DEBUG = !MUTE && ( VERBOSE || _genericEnableStatus( opts, `${ PREFIX }DEBUG` ) );

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
export const ERROR = !MUTE && ( DEBUG || VERBOSE || _genericEnableStatus( opts, `${ PREFIX }ERROR` ) );

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
export const WARN = !MUTE && ( ERROR || DEBUG || VERBOSE || _genericEnableStatus( opts, `${ PREFIX }WARN` ) );

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
export const LOG = !MUTE && ( WARN || ERROR || DEBUG || VERBOSE || _genericEnableStatus( opts, `${ PREFIX }LOG` ) );

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
export const INFO = !MUTE && ( LOG || WARN || ERROR || DEBUG || VERBOSE || _genericEnableStatus( opts, `${ PREFIX }INFO` ) );
