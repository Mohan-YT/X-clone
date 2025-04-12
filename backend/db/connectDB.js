import mongoose from "mongoose"


const connectDB = async () => {
try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB connected')
}catch(err){
    console.log(`Error in connecting DB:${err.message}`)
    process.exit(1) // 1 means true
}
}

export default connectDB