import { io } from "socket.io-client";
import { BACKEND_END_POINT } from "./constants.js";
import dotenv from dotenv
const SOCKET_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}`; 
export const socket = io(SOCKET_URL, { transports: ["websocket"] });
