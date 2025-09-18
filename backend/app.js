
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import disasterRoutes from "./routes/disasterRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import dangerZoneRoutes from "./routes/dangerZoneRoutes.js";

const app = express();

// Middleware call hotat 
app.use(cors({
origin: [
process.env.FRONTEND_URL || 'https://servonixadmin.netlify.app',
'http://localhost:5173',
'http://localhost:3000'
],
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
console.log('Origin:', req.get('origin'));
console.log('Headers:', JSON.stringify(req.headers, null, 2));
next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


// authentification hote ithe 
app.use("/api/auth", authRoutes);
// Disaster Management System routes
app.use("/api/users", userRoutes);
app.use("/api/disasters", disasterRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/dashboard", dashboardRoutes);
// admin che router hai mens to zo disater create karel
app.use("/api/admin", adminRoutes);
// Danger Zone routes (admin only)
app.use("/api/danger-zone", dangerZoneRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to Disaster Management System API");
});

// error handl karna shathi
app.use(errorHandler);

export default app;
