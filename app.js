const KEY = 'ntalk.sid', SECRET = 'ntalk';

var express        = require( 'express' ),
    expressLoad    = require( 'express-load' ),
    expressSession = require( 'express-session' ),
    bodyParser     = require( 'body-parser' ),
    cookieParser   = require( 'cookie-parser' ),
    methodOverride = require( 'method-override' ),
    csurf          = require( 'csurf' ),
    error          = require( './middlewares/error' ),
    app            = express(),
    server         = require( 'http' ).Server(app),
    io             = require( 'socket.io' )(server),
    cookie         = cookieParser( SECRET ),
    store          = new expressSession.MemoryStore(),
    domain         = require( 'domain' ).create();
    
domain.on('error', function(e) {
    
	console.log(e.stack);
	
});
    
domain.run(function() {    
    
    app.disable('x-powered-by');
    app.set( 'views' , __dirname + '/views' );
    app.set( 'view engine' , 'ejs' );
    app.use( cookie );
    app.use( expressSession( { 
        secret: SECRET, 
        name  : KEY,
        resave: true, 
        saveUninitialized: true,
        store : store
    }));
    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded( { extended: true } ) );
    app.use( methodOverride( '_method' ) );
    app.use( express.static ( __dirname + '/public' ) );
    app.use( csurf() );
    app.use( function(req, res, next) {
        res.locals._csrf = req.csrfToken();
        next();
    });
    
    expressLoad( 'models' )
              .then( 'controllers' )
              .then( 'routes' )
              .into( app );
    
    io.use( function( socket, next) {
        var data = socket.request;
        cookie( data, {}, function( err ) {
            if(!err) {
                var sessionID = data.signedCookies[KEY];
                store.get( sessionID, function( err, session ){
                    if (err || !session) {
                        return next(new Error('acesso negado'));
                    } else {
                        socket.handshake.session = session;
                        return next();
                    }
                });
            } else {
                return next(new Error('acesso negado'));
            }
        });
    });
              
    expressLoad( 'sockets' ) 
              .into( io );
              
    app.use( error.notFound );
    app.use( error.serverError );
    
    server.listen( process.env.PORT , function() {
      console.log( "Ntalk no ar." );
    });
    
});