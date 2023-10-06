const mongoose = require('mongoose');
const HttpError=require("../models/http-error");
const Order=require("../models/order");
const Jacket=require("../models/jacket");
const Material=require("../models/material");
const STATUS_IN_PROGRESS="In Progress",STATUS_COMPLETED="Completed";

function updateArray (materialList,name,total){
  var found=false;  
  for(var i=0;i<materialList.length && !found;i++){
    if(materialList[i].name===name){
      materialList[i].total=materialList[i].total+total;
      found=true;
    }
    }
  if(!found){
    materialList.push({name:name, total:total})
  }
  return found;
}

const checkExistsAndUpdate=(MaterialList,MaterialIDList,jacketMaterialID,total)=>{
  for(var i=0;i<MaterialIDList.length;i++){
    if(MaterialIDList[i]===jacketMaterialID){
      MaterialList[i].total= MaterialList[i].total+total;
    }
  }
}

const getInProgressOrdersList= async(req,res,next)=>{
    console.log("get request in orders for returning in progress orders list ");
    let orderList;
    try{
        orderList= await Order.find({status:STATUS_IN_PROGRESS});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find orders List', 500));
    }
    res.json({orderList:orderList });
}

const getCompletedOrdersList=async(req,res,next)=>{
  console.log("get request in orders for returning completed orders list ");
  let orderList;
  try{
      orderList= await Order.find({status:STATUS_COMPLETED});
  }catch(err){
    return next(new HttpError('Something went wrong, could not find orders List', 500));
  }
 
  res.json({orderList:orderList });
}

const getTotalMaterialsOfInProgressOrders=async (req,res,next)=>{
  console.log("get request in orders for returning total materials of in progress orders list ");
  let orderList;
  try{
      orderList= await Order.find({status:STATUS_IN_PROGRESS});
  }catch(err){
    return next(new HttpError('Something went wrong, could not find orders List', 500));
  }

  var materialList= [];
  for(var i=0;i<orderList.length;i++){
     for(var j=0;j<orderList[i].orderItems.length;j++){
      let jacket=null;
      try{
       jacket =await Jacket.findById(orderList[i].orderItems[j].jacketOrdered.toString())
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find jacket list for an order', 500));
      }
      if(!jacket){
        return next(new HttpError('jacket doesnt exists! cant create list', 500));
      } 
       let quantity=orderList[i].orderItems[j].quantity;
      for(var k=0;k<jacket.components.length;k++){
        let material=null;
      try{
        material =await Material.findById(jacket.components[k].materialUsed.toString())
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find material list for an order', 500));
      }
      if(!material){
        return next(new HttpError('material doesnt exists! cant create list', 500));
      } 
         updateArray(materialList,material.name,quantity*jacket.components[k].amount)
       }
     }
  }
  res.json({materialList:materialList });
}

const getTotalMaterialsOfOrder=async (req,res,next)=>{
  console.log("get request in orders for returning total materials of an order");
  const orderID=req.params.oID; 
  console.log(orderID);

  let order;
  try{
    order= await Order.findById(orderID);
  }catch(err){
    return next(new HttpError('Something went wrong, could not find Order', 500));
  }
  if(!order){
   return next(new HttpError('Order doesnt exists! cant fetch', 500));
 }
 var materialList= [];
 for(var j=0;j<order.orderItems.length;j++){
  let jacket=null;
  try{
   jacket =await Jacket.findById(order.orderItems[j].jacketOrdered.toString())
  }catch(err){  
    return next(new HttpError('Something went wrong, could not find jacket list for an order', 500));
  }
  if(!jacket){
    return next(new HttpError('jacket doesnt exists! cant create list', 500));
  } 
   let quantity=order.orderItems[j].quantity;
  for(var k=0;k<jacket.components.length;k++){
    let material=null;
  try{
    material =await Material.findById(jacket.components[k].materialUsed.toString())
  }catch(err){  
    return next(new HttpError('Something went wrong, could not find material list for an order', 500));
  }
  if(!material){
    return next(new HttpError('material doesnt exists! cant create list', 500));
  } 
     updateArray(materialList,material.name,quantity*jacket.components[k].amount)
    }
 }
res.json({materialList:materialList});
}

const getOrdersJacketList=async(req,res,next)=>{
  console.log("get jackets of a order request received");
  const orderID=req.params.oID; 
 
  let order;
  let jacketList=[];
  try{
    order= await Order.findById(orderID);
  }catch(err){
    return next(new HttpError('Something went wrong, could not find Order', 500));
  }
   
  if(!order){
   return next(new HttpError('Order doesnt exists! cant fetch', 500));
 }

  for(var i=0;i<order.orderItems.length;i++){
   let jacket;
   try{
    jacket =await Jacket.findById(order.orderItems[i].jacketOrdered.toString())
   }catch(err){  
     return next(new HttpError('Something went wrong, could not find jacket list for the order', 500));
   }
   
   if(!jacket){
     return next(new HttpError('jacket doesnt exists! cant create list', 500));
   }
   jacketList.push(jacket);
  }
  res.json({jacketList:jacketList,order:order });
}

const createOrder= async(req,res,next)=>{
    console.log("post request in order for creating a new order");
    const { countryName, orderItems} = req.body;
    var totalRequiredMaterialList= [];
    var totalRequiredMaterialIDList=[];
    let missingMaterialList=[];
    var addOrder=true;
    for(var i=0;i<orderItems.length;i++){
      
      var jacketID=orderItems[i].jacketOrdered;
      let jacketfound;
      try{
        jacketfound=await Jacket.findById(jacketID);
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find jacket used in this order', 500));
     }
     if(!jacketfound){
      return next(new HttpError('Something went wrong, could not find jacket used in this order', 500));
    }

    let material=null;
    let quantity=orderItems[i].quantity;
    for(var k=0;k<jacketfound.components.length;k++){
    try{
      material =await Material.findById(jacketfound.components[k].materialUsed.toString())
    }catch(err){  
      return next(new HttpError('Something went wrong, could not find material list for an order', 500));
    }
    if(!material){
      return next(new HttpError('material doesnt exists! cant create list', 500));
    }
      let found= updateArray(totalRequiredMaterialList,material.name,quantity*jacketfound.components[k].amount)
      if(!found){
        totalRequiredMaterialIDList.push(material._id.toString())
      }
      }
 }

  let orderList;
  try{
      orderList= await Order.find({status:STATUS_IN_PROGRESS});
  }catch(err){
      return next(new HttpError('Something went wrong, could not find orders List', 500));
  }

  for(var i=0;i<orderList.length;i++){
    for(var j=0;j<orderList[i].orderItems.length;j++){
      let jacket=null;
      try{
       jacket =await Jacket.findById(orderList[i].orderItems[j].jacketOrdered.toString())
      }catch(err){  
        return next(new HttpError('Something went wrong, could not find jacket list for an order', 500));
      }

      if(!jacket){
        return next(new HttpError('jacket doesnt exists! cant create list', 500));
      }
      let quantity=orderList[i].orderItems[j].quantity;
      for(var k=0;k<jacket.components.length;k++){
        checkExistsAndUpdate(totalRequiredMaterialList,totalRequiredMaterialIDList,jacket.components[k].materialUsed.toString(),quantity*jacket.components[k].amount);
      }
    }
  }

 
  for(var i=0;i<totalRequiredMaterialIDList.length;i++){
    let temporaryMaterial;
    try{
      temporaryMaterial=await Material.findById(totalRequiredMaterialIDList[i])
    }catch(err){
      return next(new HttpError('Something went wrong, could not find material for an order', 500));
    }

    if(temporaryMaterial.stock<totalRequiredMaterialList[i].total){
    addOrder=false;
    updateArray(missingMaterialList,temporaryMaterial.name,totalRequiredMaterialList[i].total-temporaryMaterial.stock)
    }

  }


  //console.log(totalRequiredMaterialList);
  //console.log(totalRequiredMaterialIDList);
  //console.log(missingMaterialList);

  if(!addOrder){
    console.log("the order failed to be created!!!!..missing materials:: ");
    console.log(missingMaterialList);
    res.json({success:false, missingMaterialList:missingMaterialList});
    return;
  } 
    const createdOrder = new Order({
    countryName,
    orderItems,
    status:STATUS_IN_PROGRESS
  });
    try{
        await createdOrder.save();
    }catch(err){
      return next(new HttpError('Something went wrong, could not create order', 500));
    }
    res.json({createdOrder:createdOrder,success:true });
}

const updateOrderDetails= async(req,res,next)=>{
    console.log("update request in employee for updating order details");
    const { countryName, id} = req.body;
    
    let order;
    try{
        order= await Order.findById(id);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find order', 500));
    }

    if(!order){
        return next(new HttpError('order doesnt exists! cant update', 500));
    }

     try{
        await Order.updateOne( {_id:id} , { countryName:countryName });
    }catch(err){
      return next(new HttpError('Something went wrong, could not update order', 500));
    }

    res.json({updatedOrder:req.body,success:true });
} 

const updateOrderStatus=async (req,res,next)=>{
  console.log("update request in orders for updating order status");
  const { id} = req.body; 

   let order;
   try{
       order= await Order.findById(id);
   }catch(err){
     return next(new HttpError('Something went wrong, could not find order', 500));
   }

   if(!order){
       return next(new HttpError('order doesnt exists! cant update status', 500));
   }

   for(var i=0;i<order.orderItems.length;i++){
    let jacket;
    try{
     jacket =await Jacket.findById(order.orderItems[i].jacketOrdered.toString())
    }catch(err){  
      return next(new HttpError('Something went wrong, could not find jacket list for the order', 500));
    }
    if(!jacket){
      return next(new HttpError('jacket doesnt exists! cant create list', 500));
    }
    let quantity=order.orderItems[i].quantity;
    for(var j=0;j<jacket.components.length;j++){
      let material;
      try{  
        let jacketID=jacket.components[j].materialUsed.toString();
        material= await Material.findOne({_id:jacketID})
        let newStock=material.stock-(quantity*jacket.components[j].amount);
        let materialID=jacket.components[j].materialUsed.toString();
        await Material.updateOne({_id:materialID},{stock:newStock } )
      }catch(err){   
        return next(new HttpError('error in updating material stock', 500));
      }
    }
   }

    try{
       await Order.updateOne( {_id:id} , { status:STATUS_COMPLETED });
   }catch(err){
     return next(new HttpError('Something went wrong, could not update order', 500));
   }
   res.json({success:true });
}

const deleteOrder= async(req,res,next)=>{
    console.log("delete request in jacket for deleting order");
    const orderID=req.params.oID;
    let order;
    try{
        order= await Order.findById(orderID);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find order', 500));
    }

    if(!order){
        return next(new HttpError('order doesnt exists! cant delete', 500));
    }
    
     try{
        await Order.deleteOne({ _id: orderID });
    }catch(err){
      return next(new HttpError('Something went wrong, could not delete order', 500));
    }
    res.json({deletedOrder:orderID,success:true });
}

exports.getInProgressOrdersList=getInProgressOrdersList;
exports.getCompletedOrdersList=getCompletedOrdersList;
exports.getTotalMaterialsOfInProgressOrders=getTotalMaterialsOfInProgressOrders;
exports.getTotalMaterialsOfOrder=getTotalMaterialsOfOrder;
exports.getOrdersJacketList=getOrdersJacketList;
exports.createOrder=createOrder;
exports.updateOrderDetails=updateOrderDetails;
exports.updateOrderStatus=updateOrderStatus;
exports.deleteOrder=deleteOrder;