'use client'

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { insertFacilityAction,updateFacilityAction } from './actions'
import FaciltiiesData from "./facilities-data";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
    facility_name: z.string().nonempty('施設名は必須です'),
    post_code: z.string()
        .regex(/^\d{3}-\d{4}$/, '郵便番号は「123-4567」の形式で入力してください'),
    address: z.string().max(100, '住所は100文字以内で入力してください'),
    tel: z.string()
        .regex(/^(0[0-9]{1,4}-[0-9]{1,4}-[0-9]{4}|0[0-9]{9,10})$/, '電話番号は「0X-XXXX-XXXX」または「0XXXXXXXXX」の形式で入力してください'),
});

export default function FacilityAdd() {
    const [open, setOpen] = useState(false)
    const [facilities, setFacilities] = useState([])
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            facility_name: "",
            post_code: "",
            address: "",
            tel: "",
        },
    })

    const [selectedFacility, setSelectedFacility] = useState(null);

       // 新規追加ボタンがクリックされたときのハンドラー
       const handleAdd = () => {
        setSelectedFacility(null); // selectedFacilityを空にする
        setOpen(true); 
        form.reset();
    };

    const handleEdit = (facility:any) => {
        setSelectedFacility(facility);
        setOpen(true);
    };

    // 施設一覧を取得する関数
    const getFacilities = async () => {
        const { data, error } = await supabase.from('facilities').select('*');
        
        if (error) {
            console.error('施設の取得エラー:', error);
        } else {
            setFacilities(data);
        }
    };

    // selectedFacilityが変更されたときにフォームの値を設定
    useEffect(() => {
        if (selectedFacility) {
            form.setValue("facility_name", selectedFacility.facility_name);
            form.setValue("post_code", selectedFacility.post_code);
            form.setValue("address", selectedFacility.address);
            form.setValue("tel", selectedFacility.tel);
        } else {
            form.reset(); // 新規追加の場合はフォームをリセット
        }
    }, [selectedFacility]);

    useEffect(() => {
        getFacilities();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (selectedFacility) {
            // 既存の施設を更新
            const { error } = await updateFacilityAction(selectedFacility.id, {
                facility_name: values.facility_name,
                post_code: values.post_code,
                address: values.address,
                tel: values.tel,
            });
            
    
            if (error) {
                toast({
                    title: "エラー",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "更新完了",
                });
                getFacilities(); // 施設一覧を再取得
            }
        } else {
            // 新規追加処理（既存の実装）
            const res: any = await insertFacilityAction({
                facility_name: values.facility_name,
                post_code: values.post_code,
                address: values.address,
                tel: values.tel,
            });
    
            if (!res.status) {
                toast({
                    title: "エラー",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "追加",
                });
                getFacilities(); // 施設を追加後に施設一覧を再取得
            }
        }
    
        setOpen(false);
        setSelectedFacility(null); // ダイアログを閉じた後に選択した施設をリセット
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAdd}>新規追加</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedFacility ? "施設の編集" : "施設の新規追加"}</DialogTitle>
                        <DialogDescription>
                            {selectedFacility ? "施設の情報を編集します。" : "施設の新規追加を行います。"}
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="facility_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>施設名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} type="text" />
                                            </FormControl>
                                            <FormDescription>
                                                施設名を入力してください。
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>電話番号</FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} type="text" />
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

                                <Button type="submit">{selectedFacility ? "更新" : "追加"}</Button>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>

            <FaciltiiesData
                facilities={facilities}
                onEdit={handleEdit}
            />
        </>
    );
}
