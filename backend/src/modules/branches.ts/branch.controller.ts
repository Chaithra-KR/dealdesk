
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deactivateBranch,
} from "./branch.service";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Get all branches
export const listBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branches = await getBranches();

    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};

// Get branch by ID
export const getBranch = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    const branch = await getBranchById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new branch
export const addBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, code } = req.body;

    if (
      typeof name !== "string" ||
      typeof code !== "string" ||
      !name.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Branch name and code are required",
      });
    }

    const branch = await createBranch({
      name: name.trim(),
      code: code.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

// Update branch details
export const editBranch = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    const { name, code, isActive } = req.body;

    if (
      (name !== undefined &&
        (typeof name !== "string" || !name.trim())) ||
      (code !== undefined &&
        (typeof code !== "string" || !code.trim())) ||
      (isActive !== undefined && typeof isActive !== "boolean")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch details",
      });
    }

    const branch = await updateBranch(id, {
      name: name?.trim(),
      code: code?.trim(),
      isActive,
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate branch
export const disableBranch = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    const branch = await deactivateBranch(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch deactivated successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};
