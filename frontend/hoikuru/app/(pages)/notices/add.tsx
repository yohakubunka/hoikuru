"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  selectNoticeAction,
  updateNoticeAction,
  fetchCategoriesByNoticeId,
  fetchTagsByNoticeId,
  uploadImageToSupabase,
} from "./actions";
import { Switch } from "./switch";
import React, { useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Uppy from "@/components/uppy";
import { useSearchParams } from "next/navigation";
import { selectCategoriesAction } from "../categories/actions";
import { selectTagsAction } from "../tags/actions";
import { log } from "node:console";

// zodによるvalidation
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です。"),
  content: z.string(),
  thumbnail_url: z.string(),
  publish: z.boolean(),
  category_id: z.array(z.string()).optional(), // 必須でない配列
  tag_id: z.array(z.string()).optional(), // 必須でない配列
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
      category_id: [],
      tag_id: [],
    },
  });

  const quillRef = useRef<ReactQuill | null>(null);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        try {
          // Supabaseに画像をアップロード
          const url = await uploadImageToSupabase(file);
          if (url) {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, "image", url);
              }
            }
            toast({
              title: "アップロード成功",
              description: "画像が正常にアップロードされました。",
            });
          } else {
            throw new Error("URLが取得できませんでした。");
          }
        } catch (error) {
          toast({
            title: "エラー",
            description: "画像のアップロードに失敗しました。",
            variant: "destructive",
          });
          console.error("画像アップロードエラー:", error);
        }
      }
    };
  };

  // Quillのモジュール設定をuseMemoでメモ化
  const modules = useMemo(
    () => ({
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
        handlers: {
          image: imageHandler, // 画像挿入ボタンにカスタムハンドラーを設定
        },
      },
    }),
    []
  ); // 初期レンダリング時に一度だけメモ化

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
    console.log(data);

    if (data) {
      setCategories(data);
    } else {
      toast({
        title: "エラー",
        description: "カテゴリーデータの取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // タグ情報格納state
  const [tags, setTags] = useState([]);
  // タグの取得
  const fetchTags = async () => {
    const data: any = await selectTagsAction();
    if (data) {
      setTags(data);
    } else {
      toast({
        title: "エラー",
        description: "タグデータの取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const [defaultCategories, setDefaultCategories] = useState<string[]>([]);
  const fetchSetCategories = async () => {
    if (notice_id) {
      fetchCategoriesByNoticeId(notice_id).then((data) => {
        setDefaultCategories(data);
        form.setValue("category_id", data); // 初期値をフォームに設定
      });
    }
  };

  const [defaultTags, setDefaultTags] = useState<string[]>([]);
  const fetchSetTags = async () => {
    if (notice_id) {
      fetchTagsByNoticeId(notice_id).then((data) => {
        setDefaultTags(data);
        form.setValue("tag_id", data); // 初期値をフォームに設定
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
      category_id: values.category_id ? values.category_id : [],
      tag_id: values.tag_id ? values.tag_id : [],
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
    fetchSetCategories();
    fetchTags();
    fetchSetTags();
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
                ref={quillRef} // Quillインスタンスを保持
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
                  <FormItem className="border  rounded-md">
                    <div className="flex space-x-4">
                      <FormLabel className="bg-gray-100 text-gray-800 p-4 rounded-t-md cursor-pointer transition-colors hover:bg-gray-200 w-full">
                        カテゴリー
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="checkbox-group">
                        {categories &&
                          categories.map((category: Category) => (
                            <div
                              key={category.id}
                              className="checkbox-item flex items-center gap-2 border-b last:border-0 p-4"
                            >
                              <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                value={category.id.toString()}
                                checked={(field.value || []).includes(
                                  category.id.toString()
                                )}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const newValue = e.target.checked
                                    ? [...(field.value || []), value]
                                    : (field.value || []).filter(
                                        (id) => id !== value
                                      );
                                  field.onChange(newValue);
                                }}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <label htmlFor={`category-${category.id}`}>
                                {category.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag_id"
                render={({ field }) => (
                  <FormItem className="border rounded-md mt-3">
                    <div className="flex">
                      <FormLabel className="bg-gray-100 text-gray-800 p-4 rounded-t-md cursor-pointer transition-colors hover:bg-gray-200 w-full">
                        タグ
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="checkbox-group">
                        {tags.map((tag: Category) => (
                          <div
                            key={tag.id}
                            className="checkbox-item flex items-center gap-2 border-b last:border-0 p-4"
                          >
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              value={tag.id.toString()}
                              checked={(field.value || []).includes(
                                tag.id.toString()
                              )}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newValue = e.target.checked
                                  ? [...(field.value || []), value]
                                  : (field.value || []).filter(
                                      (id) => id !== value
                                    );
                                field.onChange(newValue);
                              }}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border mt-3 rounded-md">
                <p className="bg-gray-100 text-gray-800 p-4 rounded-t-md  transition-colors  w-full">
                  サムネイル
                </p>
                <div className="p-4">
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
                              description:
                                "画像が正常にアップロードされました。",
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
                          <div>
                            <Input {...field} type="hidden" />
                            {field.value && (
                              <div className="mt-4">
                                <img
                                  src={field.value}
                                  alt="サムネイル"
                                  className="w-full h-auto"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() =>
                                    form.setValue("thumbnail_url", "")
                                  }
                                  className="mt-2 flex ml-auto"
                                >
                                  サムネイル削除
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
