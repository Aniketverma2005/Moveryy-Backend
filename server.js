// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { initDB } from "./src/models/index.js";
import userRoutes from "./src/routes/user.routes.js";
import organizationRoutes from "./src/routes/Organizations.routes.js";
import employeeRoutes from "./src/routes/Employee.routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// Connect DB & start server
(async () => {
  await initDB(); // 🔥 DB init only here

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
})();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/employee", employeeRoutes);
