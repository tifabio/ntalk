module.exports = function ( io ) {
    var sockets = io.sockets;
    sockets.on( 'connection', function(client) {
        client.on( 'send-server', function(msg) {
            var session = client.handshake.session,
                usuario = session.usuario,
                msg = "<b>" + usuario.nome + ":</b> " + msg + "<br>";
            client.emit( 'send-client', msg );
            client.broadcast.emit( 'send-client', msg );
        });
    });
}