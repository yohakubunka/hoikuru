"use client"

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
import { updatePassword } from './actions'
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    current_password: z.string()
        .min(8, { message: "現在のパスワードは8文字以上である必要があります。" })
        .max(50, { message: "現在のパスワードは50文字以下である必要があります。" }),
    new_password: z.string()
        .min(8, { message: "新しいパスワードは8文字以上である必要があります。" })
        .max(50, { message: "新しいパスワードは50文字以下である必要があります。" })
        .regex(/[a-z]/, { message: "新しいパスワードには小文字が必要です。" })
        .regex(/[A-Z]/, { message: "新しいパスワードには大文字が必要です。" })
        .regex(/[0-9]/, { message: "新しいパスワードには数字が必要です。" }),

    new_password_confirm: z.string()
        .min(8, { message: "新しいパスワードは8文字以上である必要があります。" })
        .max(50, { message: "新しいパスワードは50文字以下である必要があります。" })
        .regex(/[a-z]/, { message: "新しいパスワードには小文字が必要です。" })
        .regex(/[A-Z]/, { message: "新しいパスワードには大文字が必要です。" })
        .regex(/[0-9]/, { message: "新しいパスワードには数字が必要です。" }),
});

export default function ChangeForm() {

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            new_password_confirm: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const res: any = updatePassword({
            currentPassword: values.current_password,
            newPassword: values.new_password,
            newPasswordConfirm: values.new_password_confirm
        })

        if (!res.status) {
            toast({
                title: "エラー",
                description: res.message,
                variant: "destructive"
            })
        } else {
            toast({
                title: "追加",
                description: res.message,
            })
        }
        console.log(values)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="current_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>現在のパスワード</FormLabel>
                                <FormControl>
                                    <Input placeholder="current_password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>新しいパスワード</FormLabel>
                                <FormControl>
                                    <Input placeholder="new_password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="new_password_confirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>新しいパスワード(確認)</FormLabel>
                                <FormControl>
                                    <Input placeholder="new_password_confirm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}