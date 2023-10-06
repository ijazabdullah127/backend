const mongoose = require('mongoose');

const materialSchema=new mongoose.Schema({
name:{type:String, require:true},
stock:{type:Number, require:true},
price:{type:Number, require:true},
});

module.exports=mongoose.model("Material",materialSchema);