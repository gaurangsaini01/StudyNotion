const mongoose = require("mongoose");
require("dotenv").config();
async function connectWithDB(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{('DB Connected Successfully')})
        .catch((e)=>{
            ('Error in connecting Database');
        })
    } catch (error) {
        (error.message);
        process.exit(1);
    }
}

module.exports = connectWithDB