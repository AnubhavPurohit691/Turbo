import express, { NextFunction, Response ,Request   } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_secret } from "@repo/backend-common/config";
export interface AuthRequest extends Request{
    userId?:string
}
export function middleware (req:AuthRequest,res:Response,next:NextFunction){
    try {
        const token = req.header("Authorization")?.split(' ')[1]
        if (!token) {
            res.status(403).json({ message: "No token provided." });
           return
           }

        const decoded = jwt.verify(token!, JWT_secret) as JwtPayload

        req.userId=decoded.email
        next()
    } catch (error) {
        res.status(500).json({
            message:"server error"
          })
    }
}