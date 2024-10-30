'use client'

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import {insertNoteAction} from './actions'
import { useToast } from "@/hooks/use-toast"



const formSchema = z.object({
    title: z.string().nonempty('タイトルは必須です。'),
    content: z.string().optional()
  })

export default function AddForm() {

    const [open, setOpen] = useState(false)

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          content: "",
        },
      })


    function onSubmit(values: z.infer<typeof formSchema>) {
        const res:any = insertNoteAction({
            title: values.title,
            content: values.content
        }) 
        
        if(!res.status) {
            toast({
                title: "エラー",
                // description: values.message,
                variant: "destructive"
              })
        }else {
            toast({
                title: "追加",
                // description: values.message,
              })
        }

        setOpen(false)
    }


    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>新規追加</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Noteの新規追加</DialogTitle>
            <DialogDescription>
                テスト用ノートです。
            </DialogDescription>
            </DialogHeader>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>タイトル</FormLabel>
                        <FormControl>
                            <Input placeholder="" {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                            Noteのタイトルを入力してください。
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>タイトル</FormLabel>
                        <FormControl>
                            <textarea {...field} className="w-full h-40"></textarea>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit">追加</Button>

                    </form>
                </Form>
            </div>
        </DialogContent>
        </Dialog>
        </>
    )
}