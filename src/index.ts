import express from "express";
import dotenv from "dotenv";

import cors from"cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import rootRouter from "./routes";
import authMiddleware from "./middlewares/auth";


dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());
app.use('/api' ,rootRouter)
app.get('/', (req, res) =>{
    res.send("This is home route");

});

app.use(authMiddleware)
const port = process.env.PORT || 4005;
 
app.listen(port , () => {
    console.log(`srevr running on port ${port}`)
})