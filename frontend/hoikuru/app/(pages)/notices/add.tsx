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

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
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
  const [quillValue, setQuillValue] = useState("");
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

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link", "image"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
      ],
    },
  };

  const searchParams = useSearchParams();
  const notice_id: any = searchParams.get("id");

  async function fetchNotice() {
    if (notice_id) {
      try {
        const data = await selectNoticeAction({ notice_id });
        form.setValue("title", data.title || "");
        form.setValue("content", data.content || "");
        form.setValue("thumbnail_url", data.thumbnail_url || "");
        form.setValue("publish", data.publish || false);
        setQuillValue(data.content || "");
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

  useEffect(() => {
    fetchNotice();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    <div className="container mx-auto p-6 max-w-4xl bg-white rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-4">
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="お知らせのタイトルを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <FormLabel>内容</FormLabel>
              <ReactQuill
                theme="snow"
                value={quillValue}
                onChange={setQuillValue}
                modules={modules}
                style={{ height: "300px" }}
              />
            </div>
          </div>
          <div>
            <div className="w-64">
              <div className="">
                <Uppy
                  onUploadComplete={(url) => {
                    form.setValue("thumbnail_url", url);
                    toast({
                      title: "アップロード成功",
                      description: "画像が正常にアップロードされました。",
                    });
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input {...field} type="hidden" />
                        {field.value && (
                          <div className="mt-4">
                            <img
                              src={field.value}
                              alt="サムネイル"
                              style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "10px" }}
                            />
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="publish"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
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
            <div className="flex justify-end mt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                保存
              </Button>
            </div>
          </div>


        </form>
      </Form>
    </div>
  );
}
