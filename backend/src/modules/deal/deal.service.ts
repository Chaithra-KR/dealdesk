
import mongoose from "mongoose";
import Deal from "../../models/Deal.model";
import Product from "../../models/Product.model";
import Customer from "../../models/Customer.model";

interface DealItemInput {
  productId: string;
  quantity: number;
}

interface CreateDealInput {
  title: string;
  customerId: string;
  items: DealItemInput[];
  discountPercent?: number;
}

interface DealAccess {
  scope: "own" | "branch" | "all";
  userId: string;
  branchId: string;
}

const accessFilter = (access: DealAccess) => {
  if (access.scope === "own") {
    return { ownerId: access.userId };
  }

  if (access.scope === "branch") {
    return { branchId: access.branchId };
  }

  return {};
};

export const getDeals = async (access: DealAccess) => {
  return Deal.find(accessFilter(access))
    .populate("customerId", "name email company")
    .populate("ownerId", "name email")
    .populate("items.productId", "name sku price")
    .sort({ createdAt: -1 });
};

export const getDealById = async (
  id: string,
  access: DealAccess
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return Deal.findOne({
    _id: id,
    ...accessFilter(access),
  })
    .populate("customerId", "name email company")
    .populate("ownerId", "name email")
    .populate("items.productId", "name sku price");
};

export const createDeal = async (
  data: CreateDealInput,
  user: { id: string; branchId: string }
) => {
  if (!mongoose.Types.ObjectId.isValid(data.customerId)) {
    throw new Error("INVALID_CUSTOMER");
  }

  const customer = await Customer.findOne({
    _id: data.customerId,
    branchId: user.branchId,
  });

  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  if (!data.items?.length) {
    throw new Error("DEAL_ITEMS_REQUIRED");
  }

  const discountPercent = data.discountPercent ?? 0;

  if (
    !Number.isFinite(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  ) {
    throw new Error("INVALID_DISCOUNT");
  }

  const productIds = data.items.map((item) => item.productId);

  if (
    data.items.some(
      (item) =>
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    )
  ) {
    throw new Error("INVALID_DEAL_ITEMS");
  }

  const uniqueIds = [...new Set(productIds)];

  const products = await Product.find({
    _id: { $in: uniqueIds },
    isActive: true,
  });

  if (products.length !== uniqueIds.length) {
    throw new Error("PRODUCT_NOT_FOUND_OR_INACTIVE");
  }

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const items = data.items.map((item) => {
    const product = productMap.get(item.productId)!;
    const unitPrice = product.price;

    return {
      productId: product._id,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const discountAmount = Number(
    ((subtotal * discountPercent) / 100).toFixed(2)
  );

  const totalAmount = Number(
    (subtotal - discountAmount).toFixed(2)
  );

  const dealNumber = `DL-${Date.now()}`;

  return Deal.create({
    dealNumber,
    title: data.title.trim(),
    customerId: customer._id,
    ownerId: user.id,
    branchId: user.branchId,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    totalAmount,
    status: "draft",
  });
};

export const updateDeal = async (
  id: string,
  data: CreateDealInput,
  access: DealAccess
) => {
  const deal = await Deal.findOne({
    _id: id,
    ...accessFilter(access),
  });

  if (!deal || !["draft", "rejected"].includes(deal.status)) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(data.customerId)) {
    throw new Error("INVALID_CUSTOMER");
  }

  const customer = await Customer.findOne({
    _id: data.customerId,
    branchId: deal.branchId,
  });

  if (!customer) throw new Error("CUSTOMER_NOT_FOUND");
  if (!data.items?.length) throw new Error("DEAL_ITEMS_REQUIRED");

  const discountPercent = data.discountPercent ?? 0;

  if (
    !Number.isFinite(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  ) {
    throw new Error("INVALID_DISCOUNT");
  }

  if (
    data.items.some(
      (item) =>
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    )
  ) {
    throw new Error("INVALID_DEAL_ITEMS");
  }

  const ids = [...new Set(data.items.map((item) => item.productId))];

  const products = await Product.find({
    _id: { $in: ids },
    isActive: true,
  });

  if (products.length !== ids.length) {
    throw new Error("PRODUCT_NOT_FOUND_OR_INACTIVE");
  }

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const items = data.items.map((item) => {
    const product = productMap.get(item.productId)!;

    return {
      productId: product._id,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const discountAmount = Number(
    ((subtotal * discountPercent) / 100).toFixed(2)
  );

  deal.title = data.title.trim();
  deal.customerId = customer._id;
  deal.items = items as typeof deal.items;
  deal.subtotal = subtotal;
  deal.discountPercent = discountPercent;
  deal.discountAmount = discountAmount;
  deal.totalAmount = Number((subtotal - discountAmount).toFixed(2));
  deal.status = "draft";

  return deal.save();
};

export const submitDeal = async (
  id: string,
  access: DealAccess
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const deal = await Deal.findOne({
    _id: id,
    ...accessFilter(access),
  });

  if (!deal || !["draft", "rejected"].includes(deal.status)) {
    return null;
  }

  deal.status = "pending_approval";
  return deal.save();
};
