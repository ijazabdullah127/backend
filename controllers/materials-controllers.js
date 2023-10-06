const mongoose = require('mongoose');
const HttpError=require("../models/http-error");
const Material=require("../models/material");
const Jacket=require("../models/jacket");

const getMaterialsList= async(req,res,next)=>{
    console.log("get Request in materials for returning materials list ");
    let materialList;
    try{
        materialList= await Material.find({});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find material List', 500));
    }
    res.json({materialList:materialList });
}
const createMaterial= async(req,res,next)=>{
    console.log("post request in materials for creating a new material");
    const { name, stock, price} = req.body;

    // ADD LOGIC TO check NAME eg Collar == collar etc!!!!
  
    let material;
    try{
        material= await Material.find({name:name});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find material', 500));
    }
    if(material.length > 0){
        return next(new HttpError('material already exists! cant add again', 500));
    }

const createdMaterial = new Material({
    name ,
    stock,
    price
  });

    try{
         await createdMaterial.save();
    }catch(err){
      return next(new HttpError('Something went wrong, could not create material', 500));
    }
    res.json({createdMaterial:createdMaterial,success:true });
}
const updateMaterial= async(req,res,next)=>{
    console.log("update request in materials for updating material");
    const { name, stock, price, id} = req.body;

    console.log("updated data: "+name+" "+stock+" "+price+" "+id);

    let material;
    try{
        material= await Material.findById(id);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find material', 500));
    }

    if(!material){
        return next(new HttpError('material doesnt exists! cant update', 500));
    }

     try{
        await Material.updateOne( {_id:id} , { name:name, stock:stock, price:price });
    }catch(err){
      return next(new HttpError('Something went wrong, could not update material', 500));
    }

    res.json({updatedMaterial:req.body,success:true });
}
const deleteMaterial= async(req,res,next)=>{
    console.log("delete request in materials for deleting material");
    const materialID=req.params.mID; 

    let material;
    try{
        material= await Material.findById(materialID);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find material', 500));
    }

    if(!material){
        return next(new HttpError('material doesnt exists! cant delete', 500));
    }

     try{
        await Material.deleteOne({ _id: materialID });
    }catch(err){
      return next(new HttpError('Something went wrong, could not delete material', 500));
    }
    
    
    try{
      var allJackets =await Jacket.find({});
        for(var i=0;i<allJackets.length;i++){
          var tempJacket=await Jacket.find({_id:allJackets[i]._id})
          var newComp=[];
          for(var k=0;k<tempJacket[0].components.length;k++){
            if(materialID !==tempJacket[0].components[k].materialUsed.toString()){
              newComp.push(tempJacket[0].components[k]) 
            }
           }
           tempJacket[0].components=newComp;
           tempJacket[0].save();
        }

    }catch(err){
      return next(new HttpError('Something went wrong, could not delete material from all other jackets completely', 500));
    }


    res.json({deletedMaterial:materialID,message: "Sucessfully pulled this material from all other jackets",success:true });
}
exports.getMaterialsList=getMaterialsList;
exports.createMaterial=createMaterial;
exports.updateMaterial=updateMaterial;
exports.deleteMaterial=deleteMaterial;