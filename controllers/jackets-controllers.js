const mongoose = require('mongoose');
const HttpError=require("../models/http-error");
const Jacket=require("../models/jacket");
const Material=require("../models/material");
const Order=require("../models/order");

const getJacketsList= async(req,res,next)=>{
    console.log("get request in jackets for returning jackets list ");
    let jacketList;
    try{
        jacketList= await Jacket.find({});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find jackets List', 500));
    }
    res.json({jacketList:jacketList });
}
const getJacketsMaterialList=async(req,res,next)=>{
 console.log("get materials of a jacket request received");
 const jacketID=req.params.jID; 

 let jacket;
 let materialList=[];
 try{
   jacket= await Jacket.findById(jacketID);
 }catch(err){
   return next(new HttpError('Something went wrong, could not find jacket', 500));
 }
  
 if(!jacket){
  return next(new HttpError('jacket doesnt exists! cant delete', 500));
}
 for(var i=0;i<jacket.components.length;i++){
  let material;
  try{
    material =await Material.findById(jacket.components[i].materialUsed.toString())
  }catch(err){  
    return next(new HttpError('Something went wrong, could not find material list for the jacket', 500));
  }
  if(!material){
    return next(new HttpError('material doesnt exists! cant create list', 500));
  }
  materialList.push(material);
 }
 res.json({materialList:materialList,jacket:jacket });
}
const createJacket= async(req,res,next)=>{
    console.log("post request in jacket for creating a new jacket");
    const { name, components} = req.body;

    for(var i=0;i<components.length;i++){
      var materialID=components[i].materialUsed;
      let materialfound;
      try{
        materialfound=await Material.findById(materialID);
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find material used in this jacket', 500));
     }
     if(!materialfound){
      return next(new HttpError('Something went wrong, could not find material used in this jacket', 500));
    }
    }

    let jacket;
    try{
        jacket= await Jacket.find({name:name});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find jacket', 500));
    }

    if(jacket.length > 0){
        return next(new HttpError('jacket already exists! cant add again', 500));
    }

const createdJacket = new Jacket({
    name,
    components 
  }); 
  
    try{
         await createdJacket.save();
    }catch(err){
      return next(new HttpError('Something went wrong, could not create jacket', 500));
    }
    res.json({createdJacket:createdJacket,success:true });
}
const updateJacket= async(req,res,next)=>{
    console.log("update request in jacket for updating jacket");
    const { name, id} = req.body;

   /* for(var i=0;i<components.length;i++){
      var materialID=components[i].materialUsed;
      let materialfound;
      try{
        materialfound=await Material.findById(materialID);
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find material used in this jacket', 500));
     }
    }*/
    
    let jacket;
    try{
      jacket= await Jacket.findById(id);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find jacket', 500));
    }

    if(!jacket){
        return next(new HttpError('jacket doesnt exists! cant update', 500));
    }

     try{
        await Jacket.updateOne( {_id:id} , { name:name});
    }catch(err){
      return next(new HttpError('Something went wrong, could not update jacket', 500));
    }
    res.json({updatedJacket:req.body,success:true });
} 
const deleteJacket= async(req,res,next)=>{
    console.log("delete request in jacket for deleting jacket");
    const jacketID=req.params.jID; 
    let jacket;
    try{
      jacket= await Jacket.findById(jacketID);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find jacket', 500));
    }

    if(!jacket){
        return next(new HttpError('jacket doesnt exists! cant delete', 500));
    }

     try{
        await Jacket.deleteOne({ _id: jacketID });
    }catch(err){
      return next(new HttpError('Something went wrong, could not delete jacket', 500));
    }

    try{
      var allOrders =await Order.find({});
        for(var i=0;i<allOrders.length;i++){
          var tempOrder=await Order.find({_id:allOrders[i]._id})
          var newComp=[];
          for(var k=0;k<tempOrder[0].orderItems.length;k++){
            if(jacketID !==tempOrder[0].orderItems[k].jacketOrdered.toString()){
              newComp.push(tempOrder[0].orderItems[k]) 
            }
           }
           tempOrder[0].orderItems=newComp;
           tempOrder[0].save();
        }

    }catch(err){
      return next(new HttpError('Something went wrong, could not delete jacket from all other orders completely', 500));
    }

    res.json({deletedJacket:jacketID,success:true });
}

exports.getJacketsList=getJacketsList;
exports.getJacketsMaterialList=getJacketsMaterialList;
exports.createJacket=createJacket;
exports.updateJacket=updateJacket;
exports.deleteJacket=deleteJacket;