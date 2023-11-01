import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { Button } from "@/components/ui/button"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validations"
import { Models } from "appwrite"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"

type PostFormProps =  {
    post? : Models.Document,
}

const PostForm = ({ post }: PostFormProps) => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { toast } = useToast();
    // Query
    const {mutateAsync: createPost , isPending: isLoadingCreate} = useCreatePost()
    
    //form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post? post?.caption : "",
            file: [],
            location: post? post?.location : "",
            tags: post? post.tags.join(","): "",
        },
    })

    //submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const newPost = await createPost({
            ...values,
            userId: user.id,
        });

        !newPost && toast({ title: "Please Try Again!"})
        navigate("/");
        console.log(values)
        console.log(newPost)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                    fieldChange = {field.onChange}
                    mediaUrl = {post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
              <Input className="shad-input" {...field}></Input>
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by ",")</FormLabel>
              <FormControl>
                <Input className="shad-input" placeholder="Mountains , Travel , Adeventure" {...field}></Input>
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button className="shad-button_dark_4" type="button">Cancel</Button>
        <Button className="shad-button_primary whitespace-nowrap" type="submit">Submit</Button>

        </div>
      </form>
    </Form>
  )
}

export default PostForm