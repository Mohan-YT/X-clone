import express from "express";
import path from "path"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary"
import cors from "cors"

import connectDB from "./db/connectDB.js";

import authRoute from './routes/authRoute.js'
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";


dotenv.config();
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
  api_key : process.env.CLOUDINARY_API_KEY ,
  api_secret : process.env.CLOUDINARY_API_SECRET_KEY 
})

const PORT = process.env.PORT;
const app = express();
const __dirname = path.resolve(); //fine corrent file path

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))

app.use(express.json({
  limit : "5mb"   //default 100kb
})) //Returns middleware that only parses json
app.use(express.urlencoded({
  extended : true
}))
app.use(cookieParser())


//route
app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/posts',postRoute)
app.use('/api/notifications',notificationRoute)
// app.use('/api/posts',postRoute)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("/*splat", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
  console.log(`server runs port number ${PORT}`);
  //after the server run this port then database connect
  connectDB()
});
