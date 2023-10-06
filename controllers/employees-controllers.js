const mongoose = require('mongoose');
const HttpError=require("../models/http-error");
const Employee=require("../models/employee");

const getEmployeesList= async(req,res,next)=>{
    console.log("get request in employees for returning employees list ");
    let employeesList;
    try{
        employeesList= await Employee.find({});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find employee List', 500));
    }
    res.json({employeesList:employeesList });
}

const createEmployee= async(req,res,next)=>{
    console.log("post request in employee for creating a new employee");
    const { name, salary, position, phoneNumber} = req.body;

    let employee;
    try{
        employee= await Employee.find({name:name});
    }catch(err){
      return next(new HttpError('Something went wrong, could not find employee', 500));
    }

    if(employee.length > 0){
        return next(new HttpError('employee already exists! cant add again', 500));
    }

const createdEmployee = new Employee({
    name,
    salary,
    position,
    phoneNumber
  });

    try{
         await createdEmployee.save();
    }catch(err){
      return next(new HttpError('Something went wrong, could not create employee', 500));
    }
    res.json({createdEmployee:createdEmployee,success:true });
}

const updateEmployee= async(req,res,next)=>{
    console.log("update request in employee for updating employee");
    const { name, salary, position, phoneNumber,id} = req.body;
    let employee;
    try{
        employee= await Employee.findById(id);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find employee', 500));
    }

    if(!employee){
        return next(new HttpError('employee doesnt exists! cant update', 500));
    }

     try{
        await Employee.updateOne( {_id:id} , { name:name, salary:salary, position:position,phoneNumber:phoneNumber });
    }catch(err){
      return next(new HttpError('Something went wrong, could not update employee', 500));
    }

    res.json({updatedEmployee:req.body,success:true });
}

const deleteEmployee= async(req,res,next)=>{
    console.log("delete request in employee for deleting employee");
    const employeeID=req.params.eID; 
    let employee;
    try{
        employee= await Employee.findById(employeeID);
    }catch(err){
      return next(new HttpError('Something went wrong, could not find employee', 500));
    }

    if(!employee){
        return next(new HttpError('employee doesnt exists! cant delete', 500));
    }

     try{
        await Employee.deleteOne({ _id: employeeID });
    }catch(err){
      return next(new HttpError('Something went wrong, could not delete employee', 500));
    }
    res.json({deletedEmployee:employeeID,success:true });
}

exports.getEmployeesList=getEmployeesList;
exports.createEmployee=createEmployee;
exports.updateEmployee=updateEmployee;
exports.deleteEmployee=deleteEmployee;