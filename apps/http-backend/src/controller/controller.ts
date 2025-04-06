"use client"
import jwt from "jsonwebtoken"
import { JWT_secret, loginSchema, RoomSchema, signupSchema } from "@repo/backend-common/config";
import { AuthRequest, middleware } from "../middleware";
import {prismaClient} from "@repo/db/db"
import bcrypt from "bcrypt"
import { Router } from "express";
const router: Router = Router()

router.post("/signup", async (req, res) => {
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
       res.json({
         error: "Invalid data",
       });
     }
    } catch (error) {
     res.json({
       error: "User already exists",
     })
    }
   }
   );
   
   
   
   
   router.post("/login",async (req, res) => {
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
      
   
    router.get("/room",middleware,async (req:AuthRequest,res)=>{
     const roomId = req.body
     const room_data=RoomSchema.safeParse(roomId)
     if(!room_data.success){
       res.json({
         message:"Invalid data"
       })  
       return  
     }
     const userId= req.userId
     try {
       const createRoom = await prismaClient.room.create({
         data: {
          slug: room_data.data.room,
          userid: userId || "",
         },
       });
       res.json({
         roomid:createRoom.id
       })
     } catch (error) {
       res.json({
         error:"Room already exists"
       })
     }
    })
   
   router.get("/chats/:roomId",async(req,res)=>{
    try {
      const roomId = String(req.params.roomId);
      console.log(req.params.roomId);
      const messages = await prismaClient.chat.findMany({
          where: {
              roomId: roomId
          },
          orderBy: {
              id: "desc"
          },
          take: 50
      });

      res.json({
          messages
      })
  } catch(e) {
      console.log(e);
      res.json({
          messages: []
      })
  }
  
})
   
router.get("/room/:slug",async(req,res)=>{
  try {
    const slug=req.params.slug
    const room=await prismaClient.room.findFirst({
      where:{
        slug:slug
      }
    })
    res.json({
      room
    })
  } catch (error) {
    
  }
})

   export default router;