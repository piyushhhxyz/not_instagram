import React from "react"
import AuthLayout from "./_auth/AuthLayout"
import SigninForm from "./_auth/forms/SigninForm"
import SignupForm from "./_auth/forms/SignupForm"
import RootLayout from "./_root/RootLayout"
import { AllUsers, CreatePosts, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages"
import "./globals.css"
import { Routes,Route } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"

const App = () => {
  return (
    <main className="flex h-screen">
        <Routes>
            {/* public routes */}
            <Route element={<AuthLayout/>}>
                <Route path="/sign-in" element={<SigninForm/>}/>
                <Route path="/sign-up" element={<SignupForm />}/>
            </Route>
            
            {/* private Routes */}
            <Route element={<RootLayout/>}>
                <Route index element={<Home />}/>
                <Route path="/explore" element={<Explore />}/>
                <Route path="/saved" element={<Saved />}/>
                <Route path="/all-users" element={<AllUsers />}/>
                <Route path="/create-post" element={<CreatePosts />}/>
                <Route path="/update-post/:id" element={<EditPost />}/>
                <Route path="/post/:id" element={<PostDetails />}/>
                <Route path="/profile/:id/*" element={<Profile />}/>
                <Route path="/update-profile/:id" element={<UpdateProfile />}/>
            </Route>
        </Routes>
        <Toaster/>
    </main>
  )
}

export default App