// const utils = require("../utils");
const Promise = require("bluebird");
const _ = require("lodash");

module.exports = function(db){
    Promise.map(_.keys(db), async function(key){
        console.log(": key", key)
        
        // [key] = await require("./"+key)(db[key])
        // console.log(": key", key)
        require("./"+key)(db[key],(err,client)=>{
            if(err){
                console.log(err)
            }else{
                console.log(client)
                [key] = client
                [key].createCollection('sample')
                [key].sample.insertOne({"data":"data"});
                console.log("Done")
            }
        });
    })
}