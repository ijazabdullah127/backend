const express=require("express");
const router=express.Router();
const adminsControllers=require("../controllers/admins-controllers");

router.get("/",adminsControllers.getAdminList);
router.post("/",adminsControllers.createAdmin);
router.post("/login",adminsControllers.login);
router.patch("/updatePassword",adminsControllers.updatePassword);
router.patch("/updateEmailAndName",adminsControllers.updateEmailAndName);
router.delete("/:aID",adminsControllers.deleteAdmin);

module.exports=router;