const { Router } = require("express");
const {
  getOrdersHandler,
  getOrderByUserEmailHandler,
  postOrderHandler,
  putOrderHandler,
  getUserOrdersHandler,
  getOrderDetailHandler,
  getBestSellersHandler,
} = require("../handlers/orderHandlers");
const orderRouter = Router();

orderRouter.get("/", getOrdersHandler);
orderRouter.get("/:userEmail", getOrderByUserIdHandler);
orderRouter.get("/user/:userId",getUserOrdersHandler)
orderRouter.get("/detail/:orderId", getOrderDetailHandler);
orderRouter.post("/", postOrderHandler);
orderRouter.put("/", putOrderHandler);
orderRouter.get("/bestSellers", getBestSellersHandler);

module.exports = {orderRouter}
