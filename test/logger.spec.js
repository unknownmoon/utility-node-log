import { expect } from 'chai';
import { logger } from '../index';

describe( 'opts-parser', function ( ) {

  it( 'should be an object', function ( ) {

    expect( logger )
      .to.be.instanceOf( Object );

  } );

} );
