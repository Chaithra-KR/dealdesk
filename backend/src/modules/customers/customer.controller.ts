
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "./customer.service";

import Branch from "../../models/Branch.model";

const getUserFilters = (req: Request) => ({
  scope: req.user!.scope,
  userId: req.user!.id,
  branchId: req.user!.branchId,
});

// GET /api/customers
export const listCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await getCustomers(getUserFilters(req));

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:id
export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await getCustomerById(
      req.params.id,
      getUserFilters(req)
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers
export const addCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, company, branchId } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (
      email !== undefined &&
      (typeof email !== "string" || !email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer email",
      });
    }

    const user = req.user!;

    // Only all-scope users can choose a branch.
    const assignedBranchId =
      user.scope === "all" ? branchId : user.branchId;

    if (
      !assignedBranchId ||
      !mongoose.Types.ObjectId.isValid(assignedBranchId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid branch is required",
      });
    }

    const branch = await Branch.findOne({
      _id: assignedBranchId,
      isActive: true,
    });

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Active branch not found",
      });
    }

    const customer = await createCustomer({
      name: name.trim(),
      email: email?.trim().toLowerCase(),
      company:
        typeof company === "string" ? company.trim() : undefined,
      branchId: assignedBranchId,
      createdBy: user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/customers/:id
export const editCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, company } = req.body;

    if (
      name === undefined &&
      email === undefined &&
      company === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer name",
      });
    }

    if (
      email !== undefined &&
      (typeof email !== "string" || !email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer email",
      });
    }

    if (
      company !== undefined &&
      typeof company !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company name",
      });
    }

    const updateData = {
      ...(name !== undefined && { name: name.trim() }),
      ...(email !== undefined && {
        email: email.trim().toLowerCase(),
      }),
      ...(company !== undefined && { company: company.trim() }),
    };

    const customer = await updateCustomer(
      req.params.id,
      updateData,
      getUserFilters(req)
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};
