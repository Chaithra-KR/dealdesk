
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

import {
  listCustomers,
  getCustomer,
  addCustomer,
  editCustomer,
} from "./customer.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requirePermission("customers:read"),
  listCustomers
);

router.get(
  "/:id",
  requirePermission("customers:read"),
  getCustomer
);

router.post(
  "/",
  requirePermission("customers:manage"),
  addCustomer
);

router.patch(
  "/:id",
  requirePermission("customers:manage"),
  editCustomer
);

export default router;
