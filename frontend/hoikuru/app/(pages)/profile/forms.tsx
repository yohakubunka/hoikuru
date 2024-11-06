'use client'

import { useState, useEffect } from "react"
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
import { updateProfileAction, selectProfileAction } from './actions'
import { useToast } from "@/hooks/use-toast"
import { data } from "autoprefixer"

const formSchema = z.object({
    email: z.string().email(),
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
            email: "",
            lastName: "",
            firstName: "",
            lastName_kana: "",
            firstName_kana: "",
            tellNum: "",
            postCode: "",
            address: ""
        },
    })


    async function fetchUserProfile() {
        const res = selectProfileAction()
        res.then((data: any) => {
            form.setValue('email', data?.email)
        },(data: any) => {

        })
    }

    useEffect(() => {
        fetchUserProfile()
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const res: any = updateProfileAction({
            email: values.email
        })

        res.then((data: any) => {
            if (!data.status) {
                toast({
                    title: "エラー",
                    // description: values.message,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "追加",
                    description: data.message,
                })
            }
        }, (data: any) => {
            toast({
                title: "通信エラー",
                // description: values.message,
                variant: "destructive"
            })
        })

        // console.log('res',res)
    }


    return (
        <>
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Eメール</FormLabel>
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