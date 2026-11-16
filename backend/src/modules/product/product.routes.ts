
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

import {
  listProducts,
  getProduct,
  addProduct,
  editProduct,
  disableProduct,
} from "./product.controller";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission("products:read"), listProducts);
router.get("/:id", requirePermission("products:read"), getProduct);

router.post("/", requirePermission("products:manage"), addProduct);
router.patch("/:id", requirePermission("products:manage"), editProduct);
router.patch(
  "/:id/deactivate",
  requirePermission("products:manage"),
  disableProduct
);

export default router;
