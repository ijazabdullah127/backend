const express=require("express");
const router=express.Router();
const employeesControllers=require("../controllers/employees-controllers");

router.get("/",employeesControllers.getEmployeesList);
router.post("/",employeesControllers.createEmployee);
router.patch("/",employeesControllers.updateEmployee);
router.delete("/:eID",employeesControllers.deleteEmployee);

module.exports=router;