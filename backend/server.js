// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const expenseRoutes = require("./routes/expenses");

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// // mongoose.connect("mongodb://localhost:27017/expenses", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// mongoose.connect("mongodb://localhost:27017/expenses")
//   .then(() => console.log(" MongoDB connected"))
//   .catch(err => console.error(err));

// //})
//   // .then(() => console.log(" MongoDB connected"))
//   // .catch((err) => console.log(err));

// // Routes
// app.get("/", (req, res) => {
//   res.json({ message: "MEAN backend is running" });
// });

// app.use("/expenses", expenseRoutes);

// app.listen(PORT, () => {
//   console.log(` Backend running on http://localhost:${PORT}`);
// });
// const express = require('express');
// const mongoose = require('mongoose');
// const expensesRoutes = require('./routes/expenses');
// const authRoutes = require('./routes/auth');
// app.use('/api/users', authRoutes);

// const app = express();
// app.use(express.json());

// mongoose.connect('mongodb://127.0.0.1:27017/expenses')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error(err));

// app.use('/expenses', expensesRoutes);

// app.listen(3000, () => console.log('🚀 Backend running on http://localhost:3000'));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');   // ✅ declare once

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', authRoutes);   // ✅ use here

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/meanstack')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

