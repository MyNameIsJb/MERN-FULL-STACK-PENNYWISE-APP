import express, { Application, Request, Response } from "express";
import expenseRoutes from "./routes/expenseRoutes";

const app: Application = express();
const PORT = 8000;

app.use(express.json());

// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("Hello from TS + Express");
});

// Expense Routes
app.use("/api/expenses", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
