var mongoose = require("mongoose");

mongoose
    .connect("mongodb://test:test@ac-6qxlq8a-shard-00-00.wvbgeuy.mongodb.net:27017,ac-6qxlq8a-shard-00-01.wvbgeuy.mongodb.net:27017,ac-6qxlq8a-shard-00-02.wvbgeuy.mongodb.net:27017/blood?ssl=true&replicaSet=atlas-8k6f6e-shard-0&authSource=admin&appName=Cluster0")
    .then(()=>{
        console.log("db connected");
    })
    .catch((err)=>{
        console.log(err);
    });
