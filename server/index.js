const express = require("express");
const app = express();
const connectWithDB = require("./config/database")
require("dotenv").config();
const PORT = process.env.PORT;
connectWithDB();
app.listen(PORT,()=>{
    console.log(`App started at PORT ${PORT}`);
}) 