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

export const logger = {

  get colorMapping( ) {
    return C;
  },

  set colorMapping( configs ) {

    for ( const [ key, val ] of configs ) {

      // only update what exists
      if ( C.has( key ) ) {
        C.set( key, fnFilterByColour( val ) );
      }
    }

  },

  get logLevel( ) {
    return _logLevel;
  },

  set logLevel( lvl ) {

    // only handle string level
    if ( typeof lvl !== 'string' ) {
      return;
    }

    lvl = lvl.toUpperCase( );

    _logLevel = genLogLevel( logLvl => logLvl === lvl );

  },

  get timeFormat( ) {
    return _timeFormat;
  },

  set timeFormat( fmt ) {

    // only handle string format
    if ( typeof fmt !== 'string' ) {
      return;
    }

    _timeFormat = fmt;
  },

  highlight( content ) {
    return C.get( 'highlight' )( content );
  },

  inspect( object ) {

    this.debug( `\n${ inspect( object, {
      depth: 7,
      colors: IS_COLOURED && true
    } ) }\n` );

  },

  info( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'info' )( 'INFO' ) }] ${ C.get( 'info' )( args[ 0 ] ) }`;

    this.logLevel.get( 'INFO' ) && Reflect.apply( console.info, this, args );
  },

  log( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'LOG' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'LOG' ) && Reflect.apply( console.log, this, args );
  },

  warn( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'warn' )( 'WARN' ) }] ${ C.get( 'warn' )( args[ 0 ] ) }`;

    this.logLevel.get( 'WARN' ) && Reflect.apply( console.warn, this, args );
  },

  error( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'error' )( 'ERROR' ) }] ${ C.get( 'error' )( args[ 0 ] ) }`;

    this.logLevel.get( 'ERROR' ) && Reflect.apply( console.error, this, args );
  },

  debug( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'DEBUG' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'DEBUG' ) && Reflect.apply( console.log, this, args );
  },

  verbose( ...args ) {

    // override the message
    args[ 0 ] = `[${ C.get( 'time' )( moment().format( this.timeFormat ) ) }][${ C.get( 'debug' )( 'VERBOSE' ) }] ${ C.get( 'debug' )( args[ 0 ] ) }`;

    this.logLevel.get( 'VERBOSE' ) && Reflect.apply( console.log, this, args );
  }
};
