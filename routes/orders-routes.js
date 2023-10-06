const express=require("express");
const router=express.Router();
const ordersControllers=require("../controllers/orders-controllers");

router.get("/",ordersControllers.getInProgressOrdersList);
router.get("/completed",ordersControllers.getCompletedOrdersList);
router.get("/totalMaterialsOfInProgress",ordersControllers.getTotalMaterialsOfInProgressOrders);
router.get("/totalMaterialsOfOrder/:oID",ordersControllers.getTotalMaterialsOfOrder);
router.get("/:oID",ordersControllers.getOrdersJacketList);
router.post("/",ordersControllers.createOrder);
router.patch("/",ordersControllers.updateOrderDetails);
router.patch("/status",ordersControllers.updateOrderStatus);
router.delete("/:oID",ordersControllers.deleteOrder);

module.exports=router;