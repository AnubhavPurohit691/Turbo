import zod from "zod"
export const JWT_secret="secret"

export const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(10),
})  

export const loginSchema = zod.object({
    email:zod.string().email(), 
    password:zod.string().min(10)
})

export const RoomSchema = zod.object({  
    room:zod.string().min(3).max(10)
})

