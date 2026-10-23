import express, { Application } from "express";
import expenseRoutes from "./routes/expenseRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();
const PORT = 8000;

app.use(express.json());

// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("Hello from TS + Express");
});

// Expense Routes
app.use("/api/expenses", expenseRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(400).json({
    success: false,
    error: `Cannot Find ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
