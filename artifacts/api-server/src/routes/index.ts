import { Router, type IRouter } from "express";
import healthRouter from "./health";
import brandsRouter from "./brands";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import blogRouter from "./blog";
import contactRouter from "./contact";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(brandsRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(blogRouter);
router.use(contactRouter);
router.use(settingsRouter);

export default router;
