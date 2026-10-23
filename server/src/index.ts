import express, { Application } from "express";
import expenseRoutes from "./routes/expenseRoutes";
import authRoutes from "./routes/authRoutes";

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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
