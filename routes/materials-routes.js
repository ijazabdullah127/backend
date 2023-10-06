const express=require("express");
const router=express.Router();
const materialsControllers=require("../controllers/materials-controllers");

router.get("/",materialsControllers.getMaterialsList);
router.post("/",materialsControllers.createMaterial);
router.patch("/",materialsControllers.updateMaterial);
router.delete("/:mID",materialsControllers.deleteMaterial);

module.exports=router;