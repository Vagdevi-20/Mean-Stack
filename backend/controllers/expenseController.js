// const Expense = require("../models/Expense");

// exports.createExpense = async (req, res) => {
//   try {
//     const expense = new Expense(req.body);
//     await expense.save();
//     res.json(expense);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find();
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(expense);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.deleteExpense = async (req, res) => {
//   try {
//     await Expense.findByIdAndDelete(req.params.id);
//     res.json({ message: "Expense deleted" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
const Expense = require('../models/Expense');

// Insert
exports.addExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
