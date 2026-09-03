const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectdb = require("./config/db");

dotenv.config();

connectdb();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("ecom backend is working properly!");
});

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/products", require("./routes/productroutes"));
app.use("/api/orders", require("./routes/orderroutes"));
app.use("/api/payment", require("./routes/paymentroutes"));
app.use("/api/analytics", require("./routes/analyticsroutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});