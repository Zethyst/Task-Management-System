import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function signup({ name, email, password }: { name: string, email: string, password: string }) {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) throw new Error("Email already in use");
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return { user, token };
}

export async function login({ email, password }: { email: string, password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return { user, token };
}