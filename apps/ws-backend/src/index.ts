import { WebSocket, WebSocketServer } from 'ws';
import {JWT_secret} from "@repo/backend-common/config"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prismaClient } from '@repo/db/db';

interface users{
  ws:WebSocket
  userid:string
  room:string[]
}

const Users:users[]=[]


const wss = new WebSocketServer({ port: 8080 });
function checktoken(token:string):string|null{
  try {
    const decoded = jwt.verify(token, JWT_secret) as JwtPayload
  if(!decoded || !decoded.id){
    return null
  }
  return decoded.id
  } catch (error) {
    return null
    
  }
}

wss.on('connection', function connection(ws,request) {
  const url = request.url
  if(!url){
    return  
  }
  const queryparams = new URLSearchParams(url.split("?")[1])
  const token = queryparams.get("token")||""
  const userid=checktoken(token)
  if(!userid){
ws.close()
return 
  }

  Users.push({ws,userid,room:[]})
  
  ws.on('message', async function message(data) {
    const parseddata = JSON.parse(data.toString())
    if(parseddata.type==="join"){
        const user = Users.find(u=>u.ws===ws)
        if(!user){
          return
        }
        user.room.push(parseddata.roomId)
    }
    if(parseddata.type==="leave"){
      const user = Users.find(u=>u.ws===ws)
      if(!user){
        return
      }
      user.room = user.room.filter(r=>r!==parseddata.roomId)
    }
    if(parseddata.type==="chat"){
      const user = Users.find(u=>u.ws===ws)
      const message = parseddata.message
      const room = parseddata.roomId
      if(!user){
        return
      }

      if(!user.room.includes(parseddata.roomId)){
        return
      }

      await prismaClient.chat.create({
        data:{
          message,
          roomId: room,
          userId: userid
        }
      })

      Users.forEach((user)=>{
        if(user.room.includes(room)){
          user.ws.send(JSON.stringify({
            type:"chat",
            message,
            room
          }))
        }
        })
    }
  });

  
});