import { createClient, RedisClientType } from "redis"
import { Users } from "."

export const pub: RedisClientType = createClient({
  url: process.env.redis_Url || "",
})
const sub: RedisClientType = pub.duplicate()


export async function connectredis(){
  await pub.connect()
  await sub.connect()

  await sub.pSubscribe("*",(data,channel)=>{
    const parsed=JSON.parse(data)
    Users.map((user)=>{
     if(user.room.includes(channel)){
      user.ws.send(JSON.stringify({
            type: "chat",
            message: parsed.message,
            room: parsed.room
          }))
     }
    })
  })


}