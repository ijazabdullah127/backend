const express=require("express");
const router=express.Router();
const jacketsControllers=require("../controllers/jackets-controllers");

router.get("/",jacketsControllers.getJacketsList);
router.get("/:jID",jacketsControllers.getJacketsMaterialList);
router.post("/",jacketsControllers.createJacket);
router.patch("/",jacketsControllers.updateJacket);
router.delete("/:jID",jacketsControllers.deleteJacket);

module.exports=router;