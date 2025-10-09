import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.get('/', (req, res)=>
    res.send('API working'));


app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`)); 