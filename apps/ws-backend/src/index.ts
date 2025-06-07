import { WebSocket, WebSocketServer } from 'ws';
import {JWT_secret} from "@repo/backend-common/config"
import jwt, { JwtPayload } from "jsonwebtoken"

import dotenv from "dotenv"
import { pub, connectredis } from './connectredis';
import { connectwithrabbit, queueName } from './connectrabbitmq';
import { Channel } from 'amqplib';

dotenv.config()

interface users{
  ws:WebSocket
  userid:string
  room:string[]
}

export const Users:users[]=[]



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


async function startserver(){
 await connectredis()
 const channel:Channel|undefined = await connectwithrabbit()
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
      const roomId = parseddata.roomId
      if(!user){
        return
      }

      if(!user.room.includes(parseddata.roomId)){
        return
      }

      channel?.sendToQueue(queueName,Buffer.from(JSON.stringify({
        userId:userid,
        message,
        roomId:roomId
      })))


      await pub.publish(roomId,JSON.stringify({
        type:"chat",
        message,
        room:roomId
      }))

      
    }
  });

  
});

}
startserver().catch((err)=>console.log(err))
