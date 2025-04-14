import express from "express";
import limiter from "../middlewares/ratelimit.mjs";
import { getProductById, getProducts } from "../controllers/productController.mjs";


const productRouter = express.Router();

productRouter.route("/").get(limiter, getProducts);
productRouter.route("/:id").get(limiter, getProductById);

export default productRouter;