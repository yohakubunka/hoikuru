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
import { selectProfileAction, selectFacilityAdmins } from './selectActions'
import { updateProfileAction, updateFacilityAdmins } from './updateActions'
import { useToast } from "@/hooks/use-toast"
import { data } from "autoprefixer"

// バリデーションルールの定義
const formSchema = z.object({
    email: z.string().email(),
    last_name: z.string().optional().nullable(),
    first_name: z.string().optional().nullable(),
    first_name_kana: z.string().optional().nullable(),
    last_name_kana: z.string().optional().nullable(),
    tell: z.string()
        .regex(/^(0\d{1,4})-?(\d{1,4})-?(\d{4})$/, { message: "数字、ハイフンのみ入力可能です" })
        .optional().nullable(),
    post_code: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
})

export default function facilityAdminsForm() {

    const { toast } = useToast()
    // useFormを使用して、フォームの状態管理を行います。
    //zodResolverでZodのバリデーションスキーマを適用。
    //defaultValuesで初期値を設定しています。ユーザーがフォームを開いたとき、空の状態から始まります。
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            last_name: "",
            first_name: "",
            first_name_kana: "",
            last_name_kana: "",
            tell: "",
            post_code: "",
            address: ""
        },
    })

    //selectProfileAction関数を呼び出して、ユーザープロフィールデータを取得します。
    //データ取得後、form.setValueを使用してフォームの初期値をサーバーから取得した値で更新します。
    async function fetchUserProfile() {
        const resProfile = selectProfileAction()
        const resFacilityAdmin = selectFacilityAdmins()
        resProfile.then((data: any) => {
            form.setValue('email', data?.email)
        }, (data: any) => {

        })
        resFacilityAdmin.then((data: any) => {
            form.setValue('last_name', data?.last_name)
            form.setValue('first_name', data?.first_name)
            form.setValue('last_name_kana', data?.last_name_kana)
            form.setValue('first_name_kana', data?.first_name_kana)
            form.setValue('post_code', data?.post_code)
            form.setValue('address', data?.address)
            form.setValue('tell', data?.tell)
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
        const resProfile: any = updateProfileAction({
            email: values.email,
        })
        const resFacilityAdmin: any = updateFacilityAdmins({
            last_name: values.last_name,
            first_name: values.first_name,
            last_name_kana: values.last_name_kana,
            first_name_kana: values.first_name_kana,
            post_code: values.post_code,
            address: values.address,
            tell: values.tell,
        })
        resProfile.then((data: any) => {
            if (!data.status) {
                toast({
                    title: "エラー(ユーザープロフィール)",
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
        resFacilityAdmin.then((data: any) => {
            if (!data.status) {
                toast({
                    title: "エラー(施設管理者)",
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
            <h2 className="mb-4 text-4xl font-extrabold dark:text-white">プロフィール（施設管理者）</h2>
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
                                name="last_name"
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
                                name="first_name"
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
                                name="last_name_kana"
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
                                name="first_name_kana"
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
                            name="tell"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>電話番号</FormLabel>
                                    <FormDescription>
                                        電話番号を編集します
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="090-1234-5678" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="post_code"
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