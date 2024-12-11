"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { selectNoticeAction, updateNoticeAction } from "./actions";
import { Switch } from "./switch";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Uppy from "@/components/uppy";
import { useSearchParams } from "next/navigation";
import { selectCategoriesAction } from "../categories/actions";

// zodによるvalidation
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です。"),
  content: z.string(),
  thumbnail_url: z.string(),
  publish: z.boolean(),
  category_id: z.string(),
});

export default function NoticeAdd() {
  const [quillValue, setQuillValue] = useState("");
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  interface Category {
    id: string;
    name: string;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail_url: "",
      publish: false,
      category_id: "",
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
  const notice_id: string | null = searchParams.get("id");

  // 作成した投稿情報をフォームに入れる
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

  // カテゴリー情報格納state
  const [categories, setCategories] = useState([]);
  // カテゴリーの取得
  const fetchCategories = async () => {
    const data: any = await selectCategoriesAction();
    if (data) {
      setCategories(data);
    } else {
      toast({
        title: "エラー",
        description: "施設データの取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res: any = await updateNoticeAction({
      id: notice_id,
      title: values.title,
      content: quillValue,
      publish: values.publish,
      thumbnail_url: values.thumbnail_url,
      category_id: values.category_id,
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

  // 新規追加ボタンがクリックされたときのハンドラー
  const handleAdd = () => {
    setOpen(true);
  };

  useEffect(() => {
    fetchNotice();
    fetchCategories();
  }, []);

  return (
    <div className="bg-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex gap-4"
        >
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="お知らせのタイトルを入力してください"
                      {...field}
                    />
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
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="publish"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
              <div className="ml-auto">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  保存
                </Button>
              </div>
            </div>

            <div className="w-64 mt-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリー</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: Category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="ml-auto flex mt-2"
                    onClick={handleAdd}
                    type="button"
                  >
                    サムネイル画像設定
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90%] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>サムネイル画像のアップロード</DialogTitle>
                  </DialogHeader>

                  <div className="">
                    <Uppy
                      onUploadComplete={(url) => {
                        form.setValue("thumbnail_url", url);
                        setOpen(false);
                        toast({
                          title: "アップロード成功",
                          description: "画像が正常にアップロードされました。",
                        });
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

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
                              className="w-full h-auto"
                            />
                            {/* 削除ボタン */}
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => form.setValue("thumbnail_url", "")}
                              className="mt-2 flex ml-auto"
                            >
                              サムネイル削除
                            </Button>
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
