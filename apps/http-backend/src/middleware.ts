import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
export function middleware(req : Request, res : Response, next : NextFunction){
     const token = req.headers["authorization"] ?? "";

     const decoded = jwt.verify(token as any, process.env.JWT_SECRET as string )

     if(decoded){
      //@ts-ignore
      req.userId = decoded.userId;
      next();
     } else {
      res.status(403).json({
        message : "Unauthorized"
      })
     }
}  

//01:17:04