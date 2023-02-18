let mongoose = require("mongoose");

const ClientScheema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String
    }
})
module.exports= mongoose.model('Client',ClientScheema)