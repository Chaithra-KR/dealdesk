
import mongoose, { Schema, Document, Types } from "mongoose";

export type DealStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "won"
  | "lost";

export interface IDeal extends Document {
  dealNumber: string;
  title: string;
  customerId: Types.ObjectId;
  ownerId: Types.ObjectId;
  branchId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
  status: DealStatus;
}

const dealSchema = new Schema<IDeal>(
  {
    dealNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        lineTotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_approval",
        "approved",
        "rejected",
        "won",
        "lost",
      ],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDeal>("Deal", dealSchema);
