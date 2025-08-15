import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import mongoose from 'mongoose';

const app=express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.send('Server is running')
})

const PORT=process.env.PORT || 4000;

//Connecting mongodb

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database Connected")
}).catch(()=>{
    console.log("error Connecting MongoDB")
})



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})