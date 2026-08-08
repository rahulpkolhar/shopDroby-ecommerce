const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectdb=require("./config/db");
 
dotenv.config();

connectdb();



const app=express();
app.use(cors(
    {
    origin: ['http://localhost:3000','http://127.0.01:3000'],
   credentials:true
    }
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req,res) =>{
    res.send("ecom backend is working prop!");
});
app.use('/api/auth',require('./routes/authroutes'));
app.use('/api/products',require('./routes/productroutes'));
app.use('/api/orders', require('./routes/orderroutes'));
app.use('/api/payment',require('./routes/paymentroutes'));
app.use('/api/analytics',require('./routes/analyticsroutes.js'));

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});