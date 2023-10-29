import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"

import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validations"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


function SignupForm() {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoadin } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:"",
      username: "",
      email:"",
      password:""
    },

  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values. -> create User
    const newUser = await createUserAccount(values)
    // ✅ This will be type-safe and validated.
    if(!newUser) {
      return toast({
      title: "Sign Up Failed! Please try again",
      description: "Oh No! its not you, its us!",
    })
    }
    console.log(newUser)
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if(!session) {
      return toast({
        title: "SignIn Failed! Please try again",
        description: "Oh No! its not us, its you!",
      })
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn) {
      form.reset(); 
      navigate("/")
    }
    else {
      return toast({
        title: "SignUp Failed! Please try again",
        description: "Oh No! its not us, its you!",
      })
    }
    
  }

  return (
    <Form {...form}>
      <div className="sm:w-420px flex-center flex-col">
        <img src="assets/images/logo.svg" alt="" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create A New Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">To use not_instagram, Please enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader/> Loading...
              </div>
            ) : ("Signup")}
          </Button>

          <p className="text-sm text-light-2 text-center mt-2">
            Already Have an Account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Login</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}
// That's it. You now have a fully accessible form that is type-safe with client-side validation. -> ZOD + RHF 

export default SignupForm