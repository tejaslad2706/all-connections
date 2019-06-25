const { EventEmitter } = require('events');

class all_connections extends EventEmitter{
    constructor( config = {}, cb){
        super();
        
        if(!(this instanceof all_connections)){
            return new all_connections(config);
        }
        
        if(config.db){
            this.db(config.db); 
        }    
    }
} 



all_connections.prototype.db = require("../db");
module.exports = all_connections;