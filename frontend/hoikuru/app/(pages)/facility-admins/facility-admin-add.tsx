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
import { insertFacilityAdminAction, updateFacilityAdminAction } from "./actions";
import { useFacilityStore } from "./store";

// zodによるvalidation
const formSchema = z.object({
  first_name: z.string().nonempty("名前（性）は必須です。"),
  last_name: z.string().nonempty("名前（名）は必須です"),
  first_name_kana: z.string().nonempty("名前（せい）は必須です"),
  last_name_kana: z.string().nonempty("名前（めい）は必須です"),
  post_code: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は「123-4567」の形式で入力してください"),
  address: z.string().max(100, "住所は100文字以内で入力してください"),
  tell: z
    .string()
    .regex(
      /^(0[0-9]{1,4}-[0-9]{1,4}-[0-9]{4}|0[0-9]{9,10})$/,
      "電話番号は「0X-XXXX-XXXX」または「0XXXXXXXXX」の形式で入力してください"
    ),
    email : z.string().nonempty("メールアドレスは必須です。"),
    password: z.string().nonempty("パスワードは必須です。"),
});

export default function FacilityAdminAdd() {
  // ダイアログの状態を保持するstate
  const [open, setOpen] = useState(false);

  const { fetchFacilities } = useFacilityStore();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      first_name_kana: "",
      last_name_kana: "",
      post_code: "",
      address: "",
      tell: "",
      email: "",
      password:"",
    },
  });

  // 新規追加ボタンがクリックされたときのハンドラー
  const handleAdd = () => {
    setOpen(true);
    form.reset();
  };

  //   保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 新規追加処理
    const res: any = await insertFacilityAdminAction({
      first_name: values.first_name,
      last_name: values.last_name,
      first_name_kana: values.first_name_kana,
      last_name_kana: values.last_name_kana,
      post_code: values.post_code,
      address: values.address,
      tell: values.tell,
      email : values.email,
      password : values.password,
    });

    if (!res.status) {
      toast({
        title: "エラー",
        variant: "destructive",
      });
    } else {
      toast({
        title: "追加",
      });
      await fetchFacilities();

    }

    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex mb-8">
            <Button className="ml-auto" onClick={handleAdd}>新規追加</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>施設管理者の新規追加</DialogTitle>
            <DialogDescription>施設管理者の新規追加を行います。</DialogDescription>
          </DialogHeader>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>管理者名（性）</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          管理者名（性）を入力してください。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>管理者名（名）</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          管理者名（名）を入力してください。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="first_name_kana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>管理者名（せい）</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          管理者名（せい）を入力してください。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name_kana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>管理者名（めい）</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          管理者名（めい）を入力してください。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


<FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" />
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

                <Button type="submit">追加</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
