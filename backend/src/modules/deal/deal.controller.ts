
import { Request, Response, NextFunction } from "express";

import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  submitDeal,
} from "./deal.service";

const getAccess = (req: Request) => ({
  scope: req.user!.scope,
  userId: req.user!.id,
  branchId: req.user!.branchId,
});

// Handle errors returned from the deal service
const handleServiceError = (
  error: unknown,
  res: Response,
  next: NextFunction
) => {
  const messages: Record<string, string> = {
    INVALID_CUSTOMER: "Invalid customer ID",
    CUSTOMER_NOT_FOUND: "Customer not found in your branch",
    DEAL_ITEMS_REQUIRED: "At least one deal item is required",
    INVALID_DISCOUNT: "Discount must be between 0 and 100",
    INVALID_DEAL_ITEMS: "Invalid product or quantity",
    PRODUCT_NOT_FOUND_OR_INACTIVE: "One or more products are unavailable",
  };

  const key = error instanceof Error ? error.message : "";

  if (messages[key]) {
    return res.status(400).json({
      success: false,
      message: messages[key],
    });
  }

  return next(error);
};

// Get all deals
export const listDeals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deals = await getDeals(getAccess(req));

    return res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    next(error);
  }
};

// Get deal by ID
export const getDeal = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deal = await getDealById(id, getAccess(req));

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new deal
export const addDeal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, customerId, items, discountPercent } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof customerId !== "string" ||
      !customerId.trim() ||
      !Array.isArray(items) ||
      (discountPercent !== undefined &&
        (typeof discountPercent !== "number" ||
          !Number.isFinite(discountPercent)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid deal details",
      });
    }

    const user = req.user!;

    const deal = await createDeal(
      {
        title: title.trim(),
        customerId,
        items,
        discountPercent,
      },
      {
        id: user.id,
        branchId: user.branchId,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Deal created successfully",
      data: deal,
    });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

// Update deal details
export const editDeal = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, customerId, items, discountPercent } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof customerId !== "string" ||
      !customerId.trim() ||
      !Array.isArray(items) ||
      (discountPercent !== undefined &&
        (typeof discountPercent !== "number" ||
          !Number.isFinite(discountPercent)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid deal details",
      });
    }

    const deal = await updateDeal(
      id,
      {
        title: title.trim(),
        customerId,
        items,
        discountPercent,
      },
      getAccess(req)
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found or cannot be edited",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      data: deal,
    });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

// Submit deal for approval
export const sendDealForApproval = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deal = await submitDeal(id, getAccess(req));

    if (!deal) {
      return res.status(400).json({
        success: false,
        message: "Deal not found or cannot be submitted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deal submitted for approval",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};
