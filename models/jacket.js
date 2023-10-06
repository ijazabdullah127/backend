const mongoose = require('mongoose');

const jacketSchema=new mongoose.Schema({
name:{type:String, require:true},
components: [{
    materialUsed:{type:mongoose.Types.ObjectId, require:true, ref: 'Material'},
    amount:{type:Number, require:true}
}]
});

module.exports=mongoose.model("Jacket",jacketSchema);