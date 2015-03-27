var express        = require( 'express' ),
    expressLoad    = require( 'express-load' ),
    expressSession = require( 'express-session' ),
    bodyParser     = require( 'body-parser' ),
    cookieParser   = require( 'cookie-parser' ),
    methodOverride = require( 'method-override' ),
    app            = express();

app.set( 'views' , __dirname + '/views' );
app.set( 'view engine' , 'ejs' );
app.use( cookieParser( 'ntalk' ) );
app.use( expressSession( { secret: 'ntalk', resave: true, saveUninitialized: true } ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( methodOverride( '_method' ) );
app.use( express.static ( __dirname + '/public' ) );

expressLoad( 'models' )
          .then( 'controllers' )
          .then( 'routes' )
          .into( app );

app.listen( process.env.PORT , function() {
  console.log ( "Ntalk no ar." );
});