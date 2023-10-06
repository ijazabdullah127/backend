const mongoose = require('mongoose'); 

const employeeSchema=new mongoose.Schema({
name:{type:String, require:true},
salary:{type:Number, require:true},
position:{type:String, require:true},
phoneNumber:{type:String}
});

module.exports=mongoose.model("Employee",employeeSchema);