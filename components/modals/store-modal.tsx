"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Modal } from "../ui/modal"
import { useStoreModal } from '../../hooks/use-store-modal';
import { useForm } from "react-hook-form";


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import axios from "axios"
import { Trophy } from "lucide-react"
import { toast } from "react-hot-toast"

const formSchema=z.object({
 name:z.string().min(2).max(21,{
    message:" Store name must be minimum of 2 charactersy and maximum 21"
 })
})

export const StoreModal=()=>{
    const storeModal=useStoreModal()
   const [loading,setLoading]=useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
         name: "",
        },
      })
      //Now this is the values which we type submit function handles
  async function onSubmit(values: z.infer<typeof formSchema>) {

        try{
               setLoading(true)
       const res=await toast.promise(
   axios.post("/api/stores", values),
      {
        loading: "Creating store...",
        success: "Store created",
        error: (err) => {
            if (err.response?.status === 409) {
              return "Store name already exists. Please try another.";
            } else {
              return "Something went wrong";
            }
          },
      }
    );
    console.log(res.data.id);
    window.location.assign(`/${res.data.id}`)
        //    await axios.post("/api/stores",values),{

        //    }
            // console.log(response);
            // toast.success("store created ")
            form.reset();

        }
        catch(err:any){
              console.log("there is error");
        }
        finally{
            setLoading(false)
        }
      }

   return(
     <Modal
    title="Create a store"
    description="Add a new store to manage products and categories."
    isOpen={storeModal.isOpen} 
    onClose={storeModal.onClose}
  >
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled={loading}  placeholder="Launch a new store" {...field} />
              </FormControl>
              <FormDescription className="text-slate-300">
                give it a name 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 items-center text-sm">
        <Button  disabled={loading} variant={'outline'} onClick={storeModal.onClose}>Cancel</Button>
        <Button variant={"default"} disabled={loading} type='submit'>Submit</Button>
        </div>
      </form>
    </Form>
    </div>
    </Modal>
    )
}