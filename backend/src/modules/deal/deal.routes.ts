
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

import {
  listDeals,
  getDeal,
  addDeal,
  editDeal,
  sendDealForApproval,
} from "./deal.controller";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission("deals:read"), listDeals);
router.get("/:id", requirePermission("deals:read"), getDeal);

router.post("/", requirePermission("deals:manage"), addDeal);
router.patch("/:id", requirePermission("deals:manage"), editDeal);

router.patch(
  "/:id/submit",
  requirePermission("deals:manage"),
  sendDealForApproval
);

export default router;
