var express        = require( 'express' ),
    expressLoad    = require( 'express-load' ),
    expressSession = require( 'express-session' ),
    bodyParser     = require( 'body-parser' ),
    cookieParser   = require( 'cookie-parser' ),
    methodOverride = require( 'method-override' ),
    error          = require( './middlewares/error' ),
    app            = express(),
    server         = require( 'http' ).Server(app),
    io             = require( 'socket.io' )(server);

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
          
app.use( error.notFound );
app.use( error.serverError );

io.sockets.on( 'connection', function(client) {
    client.on( 'send-server', function(data) {
        var msg = "<b>" + data.nome + ":</b> " + data.msg + "<br>";
        client.emit( 'send-client', msg );
        client.broadcast.emit( 'send-client', msg );
    });
});

server.listen( process.env.PORT , function() {
  console.log ( "Ntalk no ar." );
});