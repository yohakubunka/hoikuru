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
import { selectNoticeAction, updateNoticeAction } from "./actions";
import { Switch } from "./switch";

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Uppy from "@/components/uppy";
import { useSearchParams } from "next/navigation";

// zodによるvalidation
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です。"),
  content: z.string(),
  thumbnail_url: z.string(),
  publish: z.boolean(),
});

export default function NoticeAdd() {
  // エディタ内のコンテンツを保持するstate
  const [quillValue, setQuillValue] = useState('');


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

  // Quill用のモジュール
  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

      ],
      // handlers: {
      //   image: handleImageUpload, // カスタム画像ハンドラー
      // },
    },
  };

  // getパラメータ取得
  const searchParams = useSearchParams();
  const notice_id: any = searchParams.get("id");

  // お知らせ情報取得
  async function fetchNotice() {

    if (notice_id) {
      try {
        const data = await selectNoticeAction({ notice_id: notice_id }); // データ取得

        form.setValue("title", data.title || ""); // タイトルを設定
        form.setValue("content", data.content || ""); // 内容を設定
        form.setValue("thumbnail_url", data.thumbnail_url || ""); // サムネイルURLを設定
        form.setValue("publish", data.publish || false); // 公開ステータスを設定
        setQuillValue(data.content || ""); // Quillエディタ用の内容を設定
      } catch (error) {
        toast({
          title: "データ取得エラー",
          description: "お知らせ情報の取得に失敗しました。",
          variant: "destructive",
        });
        console.error("データ取得エラー:", error);
      }
    }
  }
  // 読み込み時に投稿情報を取得
  useEffect(() => {
    fetchNotice();
  }, []);


  //   保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {

    // 新規追加処理
    const res: any = await updateNoticeAction({
      id: notice_id,
      title: values.title,
      content: quillValue,
      publish: values.publish,
      thumbnail_url: values.thumbnail_url,
    });

    if (res?.status === false) {
      toast({
        title: "エラー",
        description: res.message || "予期しないエラーが発生しました",
        variant: "destructive",
      });
    } else {
      toast({
        title: "更新成功",
        description: "お知らせが正常に更新されました。",
      });
    }
  }



  return (
    <>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-10 mb-10">
            <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue} modules={modules} style={{ height: '300px' }} />
          </div>

          <Uppy
            onUploadComplete={(url) => {
              form.setValue("thumbnail_url", url); // フォームフィールドに反映
              toast({
                title: "アップロード成功",
                description: "画像が正常にアップロードされました。",
              });
            }}
          />
          <FormField
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>サムネイル URL</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
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
          <Button type="submit">保存</Button>
        </form>
      </Form>
    </>
  );
}
