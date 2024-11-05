'use client'

import { useState } from "react"
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
import { updateProfileAction } from './actions'
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    userName: z.string().nonempty('タイトルは必須です。'),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    lastName_kana: z.string().optional(),
    firstName_kana: z.string().optional(),
    tellNum: z.string().optional(),
    postCode: z.string().optional(),
    address: z.string().optional(),
})

export default function forms() {

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            lastName: "",
            firstName: "",
            lastName_kana: "",
            firstName_kana: "",
            tellNum: "",
            postCode: "",
            address: ""
        },
    })


    function onSubmit(values: z.infer<typeof formSchema>) {
        const res: any = updateProfileAction({
            title: values.title,
            lastName: values.lastName
        })

        if (!res.status) {
            toast({
                title: "エラー",
                // description: values.message,
                variant: "destructive"
            })
        } else {
            toast({
                title: "追加",
                // description: values.message,
            })
        }
    }


    return (
        <>
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ユーザー名</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-left items-center gap-4">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>姓</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>名</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-left items-center gap-4">
                            <FormField
                                control={form.control}
                                name="lastName_kana"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>セイ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName_kana"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>メイ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="tellNum"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>電話番号</FormLabel>
                                    <FormDescription>
                                        電話番号を編集します
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>郵便番号</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                                <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>住所</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">プロフィールを変更</Button>

                    </form>
                </Form>
            </div>
        </>
    )
}