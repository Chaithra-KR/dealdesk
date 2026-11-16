
import Branch from "../../models/Branch.model";

interface CreateBranchInput {
  name: string;
  code: string;
}

interface UpdateBranchInput {
  name?: string;
  code?: string;
  isActive?: boolean;
}

// Get all branches
export const getBranches = async () => {
  return Branch.find().sort({ createdAt: -1 });
};

// Get one branch
export const getBranchById = async (branchId: string) => {
  return Branch.findById(branchId);
};

// Create branch
export const createBranch = async (data: CreateBranchInput) => {
  return Branch.create({
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
  });
};

// Update branch
export const updateBranch = async (
  branchId: string,
  data: UpdateBranchInput
) => {
  const updateData: UpdateBranchInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.code !== undefined) {
    updateData.code = data.code.trim().toUpperCase();
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  return Branch.findByIdAndUpdate(
    branchId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Deactivate branch
export const deactivateBranch = async (branchId: string) => {
  return Branch.findByIdAndUpdate(
    branchId,
    { $set: { isActive: false } },
    { new: true }
  );
};
