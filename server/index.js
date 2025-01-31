const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinaryConnect = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const job = require('./cron.js')
require('dotenv').config();
job.start();

const port = process.env.PORT || 3000;

//importing routes
const userRoutes = require('./routes/User');
const profileRoutes = require("./routes/Profile")
const courseRoutes = require("./routes/Course")
const contactRoutes = require("./routes/Contact")
const paymentRoutes = require("./routes/Payments")

//adding middlewares
app.use(express.json());
app.use(cookieParser());
const FRONTEND_URL = process.env.NODE_ENV === 'prod' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    
}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//connection with database
connectDB();
//connection with cloudinary
cloudinaryConnect();

//mouting routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/reach',contactRoutes)
app.use('/api/v1/payment',paymentRoutes)

//default route
app.get('/', (req, res) => {
    res.send('Hello This is study notion backend');
});

app.listen(port, () => { 
    console.log(`Server is running at ${port}`);
});