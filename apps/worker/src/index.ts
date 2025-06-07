import amqp from "amqplib"
import{prismaClient}from"@repo/db/db"
async function startworker(){
const connection = await amqp.connect("amqp://localhost")
const channel = await connection.createChannel()
const queueName="chat-message"
 await channel.assertQueue(queueName, { durable: false });
channel.consume(queueName,async(msg)=>{
if(msg!==null){
   const content= JSON.parse(msg.content.toString())
   const {message,userId,roomId}=content

   try {
    await prismaClient.chat.create({
      data: {
            message,
            roomId,
            userId
          }
    })
    channel.ack(msg)
   } catch (error) {
    console.log(error)
   }
}
})

}

startworker().catch((err)=>console.log(err))