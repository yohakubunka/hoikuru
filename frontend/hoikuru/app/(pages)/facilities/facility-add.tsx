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
import { insertFacilityAction, updateFacilityAction } from "./actions";
import { useFacilityStore } from "./store";  

// zodによるvalidation
const formSchema = z.object({
  facility_name: z.string().nonempty("施設名は必須です"),
  post_code: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は「123-4567」の形式で入力してください"),
  address: z.string().max(100, "住所は100文字以内で入力してください"),
  tel: z
    .string()
    .regex(
      /^(0[0-9]{1,4}-[0-9]{1,4}-[0-9]{4}|0[0-9]{9,10})$/,
      "電話番号は「0X-XXXX-XXXX」または「0XXXXXXXXX」の形式で入力してください"
    ),
});

export default function FacilityAdd() {
  // ダイアログの状態を保持するstate
  const [open, setOpen] = useState(false);

  const { fetchFacilities } = useFacilityStore();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facility_name: "",
      post_code: "",
      address: "",
      tel: "",
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
    const res: any = await insertFacilityAction({
      facility_name: values.facility_name,
      post_code: values.post_code,
      address: values.address,
      tel: values.tel,
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
            <DialogTitle>施設の新規追加</DialogTitle>
            <DialogDescription>施設の新規追加を行います。</DialogDescription>
          </DialogHeader>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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

                <Button type="submit">追加</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
