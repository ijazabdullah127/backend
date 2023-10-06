const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const materialsRoutes=require("./routes/materials-routes");
const employeesRoutes=require("./routes/employees-routes");
const jacketsRoutes=require("./routes/jackets-routes");
const ordersRoutes=require("./routes/orders-routes");
const adminsRoutes=require("./routes/admins-routes");



app=express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use("/cosmo/materials",materialsRoutes);
app.use("/cosmo/employees",employeesRoutes);
app.use("/cosmo/jackets",jacketsRoutes);
app.use("/cosmo/orders",ordersRoutes);
app.use("/cosmo/admin",adminsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  mongoose.connect("mongodb+srv://ijazabdullah127:786Abdullah@hacerx.7zrqyw3.mongodb.net/cosmoDB",{useNewUrlParser:true}).then(()=>{
  app.listen(5000, ()=>{
    console.log("Server Started on Port 5000");
}); 
 })
 .catch(err=> console.log(err));