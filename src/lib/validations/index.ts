import * as z from "zod"

export const SignupValidation = z.object({ // SignupValidation Schema
    name: z.string().min(2, {message:"Name Must be Atleast 2char long"}) ,
    username: z.string().min(2).max(50),
    email: z.string().email() ,
    password: z.string().min(8, {message:"Password Must Be atleast 8characters Long"})
})

export const SigninValidation = z.object({ // SignupValidation Schema
    email: z.string().email() ,
    password: z.string().min(8, {message:"Password Must Be atleast 8characters Long"})
})

export const PostValidation = z.object({ // SignupValidation Schema
    caption: z.string().min(5).max(2200), 
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100), 
    tags: z.string()
})