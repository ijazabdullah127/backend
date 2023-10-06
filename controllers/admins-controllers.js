const mongoose = require('mongoose');
const HttpError=require("../models/http-error");
const bcrypt=require("bcryptjs");
const Admin=require("../models/admin");
const SALT_ROUNDS=12;

const getAdminList= async(req,res,next)=>{
    console.log("get request in employees for returning admin list ");
    let adminList;
    try{
      adminList= await Admin.find({});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find admin List', 500));
    }
    res.json({adminList:adminList });
}

const createAdmin= async(req,res,next)=>{
    console.log("post request in admin for creating a new admin");
    const { name, email, password, status} = req.body;

    let admin;
    try{
      admin= await Admin.find({email:email});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find admin', 500));
    }

    if(admin.length > 0){
        return next(new HttpError('admin with this email already exists! cant add again', 500));
    }

    let hashedPassword;
    try{
     hashedPassword=await bcrypt.hash(password,SALT_ROUNDS);
    }catch(error){
     return  next (new HttpError('Could not sign up user because bcrypt failed', 500));
    }

const createdAdmin = new Admin({
    name, 
    email, 
    password:hashedPassword, 
    status
  });

    try{
        await createdAdmin.save();
    }catch(err){
      return next(new HttpError('Something went wrong, could not create admin', 500));
    }
    res.json({createdAdmin:createdAdmin,success:true});
}

const login= async (req,res,next)=>{
  const { email, password } = req.body;

  let admin;
  try{
    admin = await Admin.findOne({email:email});
  }catch(error){
   return next(new HttpError('Could not login admin, login has failed', 422));
  }

  if (!admin ) {
    return next(new HttpError('Could not login admin, credentials seem to be wrong.', 401));
  }

 let isValidPassword=false;
 try{
  isValidPassword= await bcrypt.compare(password,admin.password);
 }catch(error){
  return next(new HttpError('Could not login user, credentials seem to be wrong in password.', 500));
}
 if(!isValidPassword)
 {
  return next(new HttpError('Could not login user, credentials seem to be wrong in password.', 403));
}
  res.json({email: admin.email, name:admin.name,status:admin.status, success:true});
}

const updatePassword= async(req,res,next)=>{
    console.log("update request in admin for updating admin password");
    const {email,oldPassword,newPassword} = req.body;
    let admin;
    try{
        admin= await Admin.findOne({email:email});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find admin', 500));
    }

    if(!admin){
        return next(new HttpError('admin doesnt exists! cant update', 500));
    }
   
    
    let isValidPassword=false;
    try{
      
     isValidPassword= await bcrypt.compare(oldPassword,admin.password);
    }catch(error){
     return next(new HttpError('Could not login admin, credentials seem to be wrong in password.', 500));
   }
    if(!isValidPassword)
    {
     return next(new HttpError('Could not update admin password, credentials seem to be wrong in password.', 403));
   }

   let hashedPassword;
   try{
    hashedPassword=await bcrypt.hash(newPassword,SALT_ROUNDS);
   }catch(error){
    return  next (new HttpError('Could not sign up user because bcrypt failed', 500));
   }

    try{
        await Admin.updateOne({email:email},{password:hashedPassword});
    }catch(err){
      return next(new HttpError('Something went wrong, could not update admin', 500));
    }

    res.json({success:true });
}

const updateEmailAndName= async(req,res,next)=>{
  console.log("update request in adim for updating admin email");
  const { oldEmail,newEmail, newName} = req.body;
  let admin;
  try{ 
    admin= await Admin.findOne({email:oldEmail});
  }catch(err){
    return next(new HttpError('Something went wrong, could not find admin', 500));
  }

  if(!admin){
      return next(new HttpError('admin doesnt exists! cant update', 500));
  }

   try{
      await Admin.updateOne( {email:oldEmail},{email:newEmail,name:newName});
  }catch(err){
    return next(new HttpError('Something went wrong, could not update admin', 500));
  }

  res.json({success:true });
}

const deleteAdmin= async(req,res,next)=>{
    console.log("delete request in admin for deleting admin");
    const adminID=req.params.aID;
    let admin;
    try{
      admin= await Admin.findById(adminID);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find admin', 500));
    }
    if(!admin){
        return next(new HttpError('admin doesnt exists! cant delete', 500));
    }

     try{
        await Admin.deleteOne({ _id: adminID });
    }catch(err){
      return next(new HttpError('Something went wrong, could not delete employee', 500));
    }
    res.json({deletedAdmin:adminID,success:true });
}

exports.getAdminList=getAdminList;
exports.createAdmin=createAdmin;
exports.login=login;
exports.updatePassword=updatePassword;
exports.updateEmailAndName=updateEmailAndName;
exports.deleteAdmin=deleteAdmin;
 