const connections = require("../index");

allDbs = {
    db:{
        "mongo":{
            "host":"localhost",
            "port":"",
            "database":"mydb"
        }
    }
}

db = new connections(allDbs)
console.log("========",db);