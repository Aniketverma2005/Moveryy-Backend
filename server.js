// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { initDB } from "./src/models/index.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/swagger/swagger.js";
import routes from "./src/routes/index.routes.js";
import cors from "cors";



// Configure dotenv with explicit path
dotenv.config({ path: './.env' });


const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // Adjust as needed for your frontend
  credentials: true, // Allow cookies to be sent
}));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect DB & start server
(async () => {
  await initDB(); // 🔥 DB init only here

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
})();

app.get("/", (req, res) => {
  res.send("OK 🚀");
});

app.use("/api/v1", routes);


