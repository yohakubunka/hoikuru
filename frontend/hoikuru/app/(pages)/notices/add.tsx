"use client";

import { useState, useEffect } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
// import { insertNoticeAction, updateNoticeAction } from "./actions";
// import { useNoticeStore } from "./store";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// import { selectFacilitiesAction } from "../notices/actions";
import { Switch } from "./switch";
import { Label } from "@/components/ui/label";

// zodによるvalidation
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です。"),
  content: z.string().min(1, "内容は必須です。"),
  thumbnail_url: z.string().url("有効なURLを入力してください。"),
  publish: z.boolean(),
});

export default function NoticeAdd() {
  // ダイアログの状態を保持するstate
  const [open, setOpen] = useState(false);

  //   const { fetchNotices } = useNoticeStore();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail_url: "",
      publish: false,
    },
  });

  // 新規追加ボタンがクリックされたときのハンドラー
  const handleAdd = () => {
    setOpen(true);
    form.reset();
  };

  //   保存押下時の処理
  //   async function onSubmit(values: z.infer<typeof formSchema>) {
  //     // 新規追加処理
  //     const res: any = await insertNoticeAction({
  //       title: values.title,
  //       content: values.content,
  //       thumbnail_url: values.thumbnail_url,
  //       publish: values.publish,
  //     });

  //     if (!res.status) {
  //       toast({
  //         title: "エラー",
  //         description: res.message || "予期しないエラーが発生しました", // エラーメッセージを表示
  //         variant: "destructive",
  //       });
  //     } else {
  //       toast({
  //         title: "追加",
  //       });
  //       await fetchNotices();
  //       setOpen(false);
  //     }
  //   }

  return (
    <>
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>タイトル</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SummernoteEditor/>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>コンテンツ</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>画像</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公開</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">追加</Button>
              </form>
            </Form>
  
    </>
  );
}
