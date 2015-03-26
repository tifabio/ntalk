module.exports = function ( app ) {
    var ContatosController = {  
        index: function ( req , res ) { 
            var params = { usuario: req.session.usuario };
            if (params.usuario) {
                res.render ( 'contatos/index', params );
            } else {
                res.redirect('/');
            }
        }
    }; 
    return ContatosController;
}; 