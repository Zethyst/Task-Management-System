import {z} from "zod";

export const signupDto = z.object({
    name:z.string().min(1,{message:"Name is required"}),
    email: z.string().email({message:"Invalid email"}),
    password:z.string().min(8,{message:"Password must be atleast 8 characters"})
})

export const loginDto = z.object({
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(8)
})