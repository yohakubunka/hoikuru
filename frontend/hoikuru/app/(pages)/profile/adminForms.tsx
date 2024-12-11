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
import { selectProfileAction , updateProfileAction } from './Actions'
import { useToast } from "@/hooks/use-toast"
import { data } from "autoprefixer"

// バリデーションルールの定義
const formSchema = z.object({
    email: z.string().email(),
})

export default function adminForms() {

    const { toast } = useToast()
    // useFormを使用して、フォームの状態管理を行います。
    //zodResolverでZodのバリデーションスキーマを適用。
    //defaultValuesで初期値を設定しています。ユーザーがフォームを開いたとき、空の状態から始まります。
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    //selectProfileAction関数を呼び出して、ユーザープロフィールデータを取得します。
    //データ取得後、form.setValueを使用してフォームの初期値をサーバーから取得した値で更新します。
    async function fetchUserProfile() {
        const res = selectProfileAction()
        res.then((data: any) => {
            form.setValue('email', data?.email)
        }, (data: any) => {

        })
    }

    //コンポーネントの初回レンダリング時にfetchUserProfileが一度だけ呼び出されます。
    //これにより、初回表示時にサーバーからユーザーデータを取得し、フォームを初期化します。
    useEffect(() => {
        fetchUserProfile()
    }, [])

    //フォームの送信時に呼ばれる関数です。
    //updateProfileAction関数でサーバーに更新リクエストを送信します。
    //成功・失敗に応じて、toast関数でユーザーに通知します。
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
            <h2 className="mb-4 text-4xl font-extrabold dark:text-white">プロフィール（管理者）</h2>
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
                        <Button type="submit">プロフィールを変更</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}