import express from "express";
import jwt from "jsonwebtoken"
import { JWT_secret, loginSchema, RoomSchema, signupSchema } from "@repo/backend-common/config";
import { AuthRequest, middleware } from "./middleware";


const app = express();

app.post("/signup", (req, res) => {
 const user=req.body
 const user_data=signupSchema.safeParse(user)
 if(user_data.success){
   res.send("User signed up successfully")
 }
 else{
  res.send(user_data.error)
}

});



app.post("/login", (req, res) => {
  const user=req.body
  const user_data=loginSchema.safeParse(user)
  if(user_data.success){
    res.send("User signed up successfully")
  }
  else{
   res.send(user_data.error)
 }
  const token = jwt.sign({email:user.email}, JWT_secret)
  
  res.json({
   token:token
  })
   
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
