import express from "express";
import jwt from "jsonwebtoken"
import { JWT_secret, loginSchema, RoomSchema, signupSchema } from "@repo/backend-common/config";
import { AuthRequest, middleware } from "./middleware";
import {prismaClient} from "@repo/db/db"
import bcrypt from "bcrypt"

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
 const user=req.body
 const user_data=signupSchema.safeParse(user)
 try {
  if(user_data.success){
    const hashedPassword=await bcrypt.hash(user_data.data.password,10)
    const createuser = await prismaClient.user.create({
      data: {
        email: user_data.data.email,
        password: hashedPassword,
        name: user_data.data.name,
      },
    });
    const token=jwt.sign({id:createuser.id},JWT_secret)
    res.json({token,createuser});
  } else {
    res.send(user_data.error);
  }
 } catch (error) {
  res.json({
    error: "User already exists",
  })
 }
}
);




app.post("/login",async (req, res) => {
  const user=req.body
  const user_data=loginSchema.safeParse(user)
  if(user_data.success){
    const userdb= await prismaClient.user.findUnique({
      where:{ 
        email:user_data.data.email,
      }
  })
  if(userdb){
    const validPassword = await bcrypt.compare(user_data.data.password, userdb.password);
    if(validPassword){
      const token=jwt.sign({id:userdb.id},JWT_secret)
      res.json({
        token:token
      })
    }
  }
}
  else{
   res.json({
      error:"Invalid email or password"
   })
 }
   
 });


 app.get("/room",middleware,(req:AuthRequest,res)=>{
  const roomId = req.body
  const room_data=RoomSchema.safeParse(roomId)
  if(room_data.success){
    res.send("Room created successfully")
  }
  else{
   res.send(room_data.error)
  }
  
  res.json({
    userId:req.userId
  })
 })
app.listen(9000, () => {
  console.log("Server is running on port 3000");
});
