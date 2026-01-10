
import app from "./app.js";
import { initSocket } from "./lib/socket.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT,()=>{console.log(`[+] Server Running on port ${PORT} `)});

initSocket(server);