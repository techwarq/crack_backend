import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import rootRouter from "./routes";
import authMiddleware from "./middlewares/auth";

dotenv.config();
const app = express();

// Basic middleware
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Disable certain helmet features that might interfere with local development
    contentSecurityPolicy: false,
}));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3001', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // 10 minutes
}));

// Public routes (if any)
app.get('/', (req, res) => {
    res.send("This is home route");
});

// Apply auth middleware BEFORE protected routes
app.use('/api', authMiddleware, rootRouter);

const port = process.env.PORT || 4007;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});