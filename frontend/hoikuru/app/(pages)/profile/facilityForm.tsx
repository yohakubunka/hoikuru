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
import { selectFacilities} from './selectActions'
import { updateFacilities} from './updateActions'
import { useToast } from "@/hooks/use-toast"
import { data } from "autoprefixer"

// バリデーションルールの定義
const formSchema = z.object({
    facility_name: z.string().optional(),
    tell: z.string()
        .regex(/^(0\d{1,4})-?(\d{1,4})-?(\d{4})$/, { message: "数字、ハイフンのみ入力可能です" })
        .optional().nullable(),
    post_code: z.string().optional(),
    address: z.string().optional(),
})

export default function facilityForm() {

    const { toast } = useToast()
    // useFormを使用して、フォームの状態管理を行います。
    //zodResolverでZodのバリデーションスキーマを適用。
    //defaultValuesで初期値を設定しています。ユーザーがフォームを開いたとき、空の状態から始まります。
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            facility_name: "",
            tell: "",
            post_code: "",
            address: ""
        },
    })

    //selectProfileAction関数を呼び出して、ユーザープロフィールデータを取得します。
    //データ取得後、form.setValueを使用してフォームの初期値をサーバーから取得した値で更新します。
    async function fetchUserProfile() {
        const resFacilityMember = selectFacilities()
        resFacilityMember.then((data: any) => {
            form.setValue('facility_name', data?.facility_name ?? "")
            form.setValue('post_code', data?.post_code ?? "")
            form.setValue('address', data?.address ?? "")
            form.setValue('tell', data?.tell ?? "")
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
        const resFacilityMember: any = updateFacilities({
            facility_name: values.facility_name,
            post_code: values.post_code,
            address: values.address,
            tell: values.tell,
        })
        resFacilityMember.then((data: any) => {
            if (!data.status) {
                toast({
                    title: "エラー(施設情報)",
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
            <h2 className="mb-4 text-4xl font-extrabold dark:text-white">施設情報</h2>
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="facility_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>施設名</FormLabel>
                                    <FormDescription>
                                        施設名を編集します
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="施設名" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                        <Button type="submit">施設情報を変更</Button>

                    </form>
                </Form>
            </div>
        </>
    )
}