// const express = require("express");
// const {
//   createExpense,
//   getExpenses,
//   updateExpense,
//   deleteExpense
// } = require("../controllers/expenseController");

// const router = express.Router();

// router.post("/", createExpense);
// router.get("/", getExpenses);
// router.put("/:id", updateExpense);
// router.delete("/:id", deleteExpense);

// module.exports = router;
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Add expense
router.post('/expenses', async (req, res) => {
  const expense = new Expense({ ...req.body, userId: req.user.id });
  await expense.save();
  res.json(expense);
});

// Get all expenses for user
router.get('/expenses', async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
});
