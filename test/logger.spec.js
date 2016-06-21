import { expect } from 'chai';
import { spy, stub } from 'sinon';
import moment from 'moment';
import { logger } from '../index';

describe( 'logger', function ( ) {

  function invokeAllLogAPIs( ) {

    [ 'info', 'log', 'warn', 'error', 'debug', 'verbose' ].forEach( ( type ) => {

      logger[ type ]( `${ type }` );

    } );

  }

  function verifyLogAPIsCalledBy( times ) {
    let counter = 0;
    let err = null;

    stub( console, 'log', ( ...args ) => {

      counter++;

      expect( args[ 0 ] )
        .to.match( /(LOG)|(DEBUG)|(VERBOSE)/ );

    } );

    stub( console, 'info', ( ...args ) => {

      counter++;

      expect( args[ 0 ] )
        .to.match( /INFO/ );

    } );

    stub( console, 'warn', ( ...args ) => {

      counter++;

      expect( args[ 0 ] )
        .to.match( /WARN/ );

    } );

    stub( console, 'error', ( ...args ) => {

      counter++;

      expect( args[ 0 ] )
        .to.match( /ERROR/ );

    } );

    try {
      invokeAllLogAPIs( );
    } catch ( e ) {
      err = e;
    } finally {

      [ 'info', 'log', 'warn', 'error' ].forEach( ( type ) => {

        console[ type ].restore( );

      } );

      if ( err ) {
        console.error( err );
      }
    }

    expect( err )
      .to.be.null;

    expect( counter )
      .to.equal( times );

  }

  it( 'should be an object', function ( ) {

    expect( logger )
      .to.be.instanceOf( Object );

  } );

  it( 'should invoke all of the logging apis when verbose', function ( ) {

    logger.logLevel = 'VERBOSE';

    verifyLogAPIsCalledBy( 6 );

  } );

  it( 'should invoke info/log/warn/error when error', function ( ) {

    logger.logLevel = 'ERROR';

    verifyLogAPIsCalledBy( 4 );

  } );

  it( 'should invoke none of the logging apis when mute', function ( ) {

    logger.logLevel = 'MUTE';

    verifyLogAPIsCalledBy( 0 );

  } );

  it( 'Getter/Setter colorMapping', function ( ) {

    /* get by getter */
    const cm = logger.colorMapping;

    /* keep original settings */

    const origHelp = cm.get( 'help' );
    const origHighlight = cm.get( 'highlight' );

    expect( cm )
      .to.be.instanceOf( Map );

    /* set by setter */
    logger.colorMapping = new Map( [
      [ 'help', 1 ]
    ] );

    expect( logger.colorMapping.get( 'help' ) )
      .to.equal( 1 );

    expect( logger.colorMapping.get( 'highlight' ) )
      .to.eql( origHighlight );

    /* direct set */
    logger.colorMapping.set( 'help', 2 );

    expect( logger.colorMapping.get( 'help' ) )
      .to.equal( 2 );

    /* restore help */
    logger.colorMapping.set( 'help', origHelp );

  } );

  it( 'Getter/Setter logLevel', function ( ) {

    /* set by setter */
    logger.logLevel = 'MUTE';
    logger.logLevel = 1; // this won't affect the log level, since only string is acceptable

    /* get by getter */
    let ll = logger.logLevel;

    for ( const [ key, val ] of ll ) {
      if ( key === 'MUTE' ) {

        expect( val )
          .to.be.true;

      } else {

        expect( val )
          .to.be.false;

      }
    }

    logger.logLevel = 'ERROR';

    ll = logger.logLevel;

    for ( const [ key, val ] of ll ) {
      if ( [ 'INFO', 'LOG', 'WARN', 'ERROR' ].includes( key ) ) {

        expect( val )
          .to.be.true;

      } else {

        expect( val )
          .to.be.false;

      }
    }

  } );

  it( 'Getter/Setter timeFormat', function ( ) {

    const date = new Date( '2016-06-01T02:03:04.567+0800' );
    const origFmt = logger.timeFormat;

    logger.timeFormat = 'DHmsSSS';
    logger.timeFormat = 1; // this won't affect since only string will be assigned.

    expect( moment( date )
        .format( logger.timeFormat ) )
      .to.equal( '1234567' );

    logger.timeFormat = origFmt;

  } );

  it( 'highlight( content )', function ( ) {

    const highlightFn = logger.colorMapping.get( 'highlight' );
    const highlightMsg = 'highlighting...';

    expect( highlightFn( highlightMsg ) )
      .to.equal( logger.highlight( highlightMsg ) );

  } );

  it( 'inspect( object )', function ( ) {

    let counter = 0;
    const crazy = {
      'lvl0': {
        'lvl1': {
          'lvl2': {
            'lvl3': {
              'lvl4': {
                'lvl5': {
                  'lvl6': {
                    'lvl7': {
                      'lvl8': {
                        'lvl9': {
                          'lvl10': {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    // log level >= 'DEBUG' can trigger the inspect
    logger.logLevel = 'DEBUG';

    const logStub = stub( console, 'log', ( ...args ) => {

      counter++;

      expect( args[ 0 ] )
        .to.have.string( 'lvl7' )
        .and.not.have.string( 'lvl8' )
        .and.not.have.string( 'lvl10' );;
    } );

    logger.inspect( crazy );

    expect( counter )
      .to.equal( 1 );

    logger.logLevel = 'ERROR';

    logger.inspect( crazy );

    expect( counter )
      .to.equal( 1 );

    logStub.restore( );

    logger.logLevel = 'VERBOSE';

  } );

} );
