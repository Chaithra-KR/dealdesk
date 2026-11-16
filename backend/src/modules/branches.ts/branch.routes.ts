
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

import {
  listBranches,
  getBranch,
  addBranch,
  editBranch,
  disableBranch,
} from "./branch.controller";

const router = Router();

router.use(authenticate);

// Read operations
router.get("/", requirePermission("branches:read"), listBranches);
router.get("/:id", requirePermission("branches:read"), getBranch);

// Management operations
router.post("/", requirePermission("branches:manage"), addBranch);
router.patch("/:id", requirePermission("branches:manage"), editBranch);
router.patch(
  "/:id/deactivate",
  requirePermission("branches:manage"),
  disableBranch
);

export default router;
