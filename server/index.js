const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinaryConnect = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const port = process.env.PORT || 3000;

//importing routes
const userRoutes = require('./routes/User');
const profileRoutes = require("./routes/Profile")
const courseRoutes = require("./routes/Course")

//adding middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
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

//default route
app.get('/', (req, res) => {
    res.send('Hello This is study notion backend');
});

app.listen(port, () => { 
    console.log(`Server is running at ${port}`);
});