import amqp from "amqplib"

export const queueName="chat-message"
export async function connectwithrabbit(){

    try{
const connection = await amqp.connect("amqp://localhost")
    const channel = await connection.createChannel()


    await channel.assertQueue(queueName,{
        durable:false
    })

    return channel
    }
    catch(err){
        console.log(err)
    }
}