const mongoose = require('mongoose');

const orderSchema=new mongoose.Schema({
countryName:{type:String, require:true},
orderItems: [{
    jacketOrdered:{type: mongoose.Types.ObjectId, require:true, ref: 'Jacket'},
    quantity:{type:Number, require:true}
}],
status:{type:String, require:true}
});

module.exports=mongoose.model("Order",orderSchema);