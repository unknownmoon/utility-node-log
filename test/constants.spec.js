import { expect } from 'chai';

import {
  MUTE,
  INFO,
  LOG,
  WARN,
  ERROR,
  DEBUG,
  VERBOSE,
  OUT_TIME_FMT,
  IS_COLOURED
} from '../lib/constants';

import chalk from 'chalk';

describe( 'constants', function ( ) {

  it( 'should be able to detect log levels', function ( ) {

    // the test configuration should be set as `LOG_DEBUG=true`, to enable INFO, LOG, WARN, ERROR and DEBUG

    expect( MUTE )
      .to.be.false;

    expect( INFO )
      .to.be.true;

    expect( LOG )
      .to.be.true;

    expect( WARN )
      .to.be.true;

    expect( ERROR )
      .to.be.true;

    expect( DEBUG )
      .to.be.true;

    expect( VERBOSE )
      .to.be.false;

  } );

  it( 'should be able to detect colour supports', function ( ) {

    expect( IS_COLOURED )
      .to.equal( chalk.supportsColor );

  } );

  it( 'should be able to get the time format from envvars', function ( ) {

    // the test configuration should be set as `LOG_TIME_FMT=HH.mm.ss.SSSZZ`

    expect( OUT_TIME_FMT )
      .to.equal( 'HH.mm.ss.SSSZZ' );

  } );

} );
