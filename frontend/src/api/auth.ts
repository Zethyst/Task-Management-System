import {api} from "../lib/api";
export const signup =(data:{
    name:string;
    email:string;
    password:string;
})=>api.post("/auth/signup",data);

export const login = (data:{
    email:string;
    password:string; 
})=>api.post("/auth/login",data);

export const me = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");

export const updateProfile = (data: {
    name: string;
}) => api.patch("/auth/profile", data);

export const getAllUsers = () => api.get("/auth/users");