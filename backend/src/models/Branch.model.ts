
import mongoose, { Schema, Document } from "mongoose";

export interface IBranch extends Document {
  name: string;
  code: string;
  isActive: boolean;
}

const branchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Branch = mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;
