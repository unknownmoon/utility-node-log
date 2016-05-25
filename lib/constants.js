import chalk from 'chalk';
import { getOpts } from 'utility-node-opts-parser';

export const IS_COLOURED = chalk.supportsColor;
export const OUT_TIME_FMT = 'HH.mm.ss.SSS';

// external opts in the arguments to start the application or from the environment variables
// prefer to set in the environment variables
const opts = getOpts( 'MUTE', 'DEBUG' );

// MUTE is true if MUTE is set and the value is not `false`
export const MUTE = opts.get( 'MUTE' ) !== null && opts.get( 'MUTE' ) !== 'false';

// DEBUG is true if
//  - MUTE is false
//  - DEBUG is set and the value is not `false`
export const DEBUG = !MUTE && opts.get( 'DEBUG' ) !== null && opts.get( 'DEBUG' ) !== 'false';

// VERBOSE is true if
//  - MUTE is false
//  - VERBOSE is set and the value is not `false`
export const VERBOSE = !MUTE && opts.get( 'VERBOSE' ) !== null && opts.get( 'VERBOSE' ) !== 'false';
