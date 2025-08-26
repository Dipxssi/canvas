import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import {JWT_SECRET} from "@repo/packages/backend-common/config"     
import { middleware } from "./middleware";

const app = express();

app.post('/signup', async function (req, res) {
  const requiredBody = z.object({
    username: z.string(),
    password: z.string().max(8, "Password must be 8 characters long")
  })

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.status(403).json({
      message: "Incorrect creds",
      error: parsedDataWithSuccess.error
    })
    return
  }
  const { username, password } = parsedDataWithSuccess.data;

  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    const newUser = await User.create({
      username: username,
      password: password
    })

    const userId = newUser._id

    res.json({
      message: "You are signed up"
    })
  } catch (e) {
    res.status(411).json({
      message: "User already exists"
    })
  }
});

app.post('/signin', async function (req, res) {
   const {username , password } = req.body;

   const existingUser = await User.findOne({
      username
   })

   if(!existingUser){
    return res.status(401).json({
      message : "User not found"
    })
   }

   const isPasswordValid = await bcrypt.compare(password, existingUser.password);

   if(!isPasswordValid){
    return res.status(402).json({
      message : "Incorrect one"
    })
   }
   const token = jwt.sign({
    userId : existingUser._id
   }, JWT_SECRET );

   res.json({
    token
   })
});

app.post('/room', middleware, async function (req, res) {
      res.json({
        roomId: 123
      })
});


app.listen(3001);