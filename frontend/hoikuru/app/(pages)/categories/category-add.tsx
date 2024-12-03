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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  insertCategorieAction,
  updateCategorieAction,
} from "./actions";
import { useCategorieStore } from "./store";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { selectFacilitiesAction } from "../facilities/actions";

// zodによるvalidation
const formSchema = z.object({
  name: z.string().min(1, "カテゴリー名は必須です。"),
});

export default function CategorieAdd() {
  // ダイアログの状態を保持するstate
  const [open, setOpen] = useState(false);

  const { fetchCategories } = useCategorieStore();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
  }});


  // 新規追加ボタンがクリックされたときのハンドラー
  const handleAdd = () => {
    setOpen(true);
    form.reset();
  };

  //   保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 新規追加処理
    const res: any = await insertCategorieAction({
      name: values.name,
    });

    if (!res.status) {
      toast({
        title: "エラー",
        description: res.message || "予期しないエラーが発生しました", // エラーメッセージを表示
        variant: "destructive",
      });
    } else {
      toast({
        title: "追加",
      });
      await fetchCategories();
      setOpen(false);
    }
  }

  const [facilities, setFacilities] = useState([]);

  // 施設データの取得
  useEffect(() => {
    const fetchFacilities = async () => {
      const data: any = await selectFacilitiesAction();
      if (data) {
        setFacilities(data);
      } else {
        toast({
          title: "エラー",
          description: "施設データの取得に失敗しました。",
          variant: "destructive",
        });
      }
    };
    fetchFacilities();
  }, [toast]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex mb-8">
            <Button className="ml-auto" onClick={handleAdd}>
              新規追加
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>カテゴリーの新規追加</DialogTitle>
            <DialogDescription>
              カテゴリーの新規追加を行います。
            </DialogDescription>
          </DialogHeader>

          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>カテゴリー名</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <Button type="submit">追加</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
