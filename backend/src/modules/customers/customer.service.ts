
import mongoose from "mongoose";
import Customer from "../../models/Customer.model";

interface CustomerFilters {
  scope: "own" | "branch" | "all";
  userId: string;
  branchId: string;
}

interface CreateCustomerInput {
  name: string;
  email?: string;
  company?: string;
  branchId: string;
  createdBy: string;
}

interface UpdateCustomerInput {
  name?: string;
  email?: string;
  company?: string;
}

// Build access filter based on logged-in user's scope
const buildAccessFilter = (filters: CustomerFilters) => {
  if (filters.scope === "own") {
    return { createdBy: filters.userId };
  }

  if (filters.scope === "branch") {
    return { branchId: filters.branchId };
  }

  return {};
};

// Get customers
export const getCustomers = async (filters: CustomerFilters) => {
  return Customer.find(buildAccessFilter(filters))
    .populate("branchId", "name code")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Get customer by ID, respecting access scope
export const getCustomerById = async (
  customerId: string,
  filters: CustomerFilters
) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return Customer.findOne({
    _id: customerId,
    ...buildAccessFilter(filters),
  })
    .populate("branchId", "name code")
    .populate("createdBy", "name email");
};

// Create customer
export const createCustomer = async (data: CreateCustomerInput) => {
  return Customer.create(data);
};

// Update customer, respecting access scope
export const updateCustomer = async (
  customerId: string,
  data: UpdateCustomerInput,
  filters: CustomerFilters
) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return null;
  }

  return Customer.findOneAndUpdate(
    {
      _id: customerId,
      ...buildAccessFilter(filters),
    },
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("branchId", "name code")
    .populate("createdBy", "name email");
};
