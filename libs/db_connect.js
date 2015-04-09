var mongoose  = require( 'mongoose' ),
    mongo_url = process.env.MONGO_URL,
    single_connection;
    
module.exports = function () {
    if(!single_connection) {
        single_connection = mongoose.connect( mongo_url );
    }
    return single_connection;
}();