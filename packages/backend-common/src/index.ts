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

