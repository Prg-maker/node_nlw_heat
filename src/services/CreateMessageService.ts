import prismaClient from "../prisma"
import { io} from "../app"
import {v4 as uuid } from 'uuid' 

class CreateMessageService{
  async execute(text: string , user_id: string){
    const message = await prismaClient.message.create({
      data:{
        text,
        user_id
      },
      include:{
        user:true
      }
    })
    
    const info = {
      id: uuid(),
      message: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user:{
        name: message.user.name,
        avatar_url: message.user.avatar_url
      }
    }
    console.log(message.text)

    io.emit("new_message" , info)

    return message
  }
}

export {CreateMessageService}