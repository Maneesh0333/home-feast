import express from "express";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import { globalLimiter } from "./middleware/global-limiter.middleware.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import menuRoutes from "./routes/menu.routes.js";
import cookRoutes from "./routes/cook.routes.js"
import PlanRoutes from "./routes/plan.routes.js"
import SubscriptionsRoutes from "./routes/subscription.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(globalLimiter);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);

app.use("/menus", menuRoutes);
app.use("/cooks", cookRoutes);
app.use("/plans", PlanRoutes);
app.use("/subscriptions", SubscriptionsRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
