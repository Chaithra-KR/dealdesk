
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import branchRoutes from "./modules/branches.ts/branch.routes";
import customerRoutes from "./modules/customers/customer.routes";
import productRoutes from "./modules/product/product.routes";
import dealRoutes from "./modules/deal/deal.routes";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DealDesk API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/deals", dealRoutes);

export default app;
