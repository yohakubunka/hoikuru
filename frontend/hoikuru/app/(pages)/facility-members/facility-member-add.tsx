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
  insertFacilityMemberAction,
  updateFacilityMemberAction,
} from "./actions";
import { useFacilityMemberStore } from "./store";
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
  first_name: z.string().min(1, "名前（性）は必須です。"),
  last_name: z.string().min(1, "名前（名）は必須です。"),
  first_name_kana: z
    .string()
    .regex(
      /^[\u3041-\u3096ー]+$/,
      "名前（せい）は全角ひらがなで入力してください"
    )
    .min(1, "名前（せい）は必須です。"),
  last_name_kana: z
    .string()
    .regex(
      /^[\u3041-\u3096ー]+$/,
      "名前（めい）は全角ひらがなで入力してください"
    )
    .min(1, "名前（めい）は必須です。"),
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
  email: z
    .string()
    .email("メールアドレスの形式が正しくありません")
    .min(1, "メールアドレスは必須です。"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "パスワードは8文字以上で、英数字を含めてください"
    )
    .min(1, "パスワードは必須です。"),
  facility_id: z.string().min(1, "施設IDは必須です。"),
});

export default function FacilityMemberAdd() {
  // ダイアログの状態を保持するstate
  const [open, setOpen] = useState(false);

  const { fetchFacilityMembers } = useFacilityMemberStore();

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
      password: "",
      facility_id: "",
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
    const res: any = await insertFacilityMemberAction({
      first_name: values.first_name,
      last_name: values.last_name,
      first_name_kana: values.first_name_kana,
      last_name_kana: values.last_name_kana,
      post_code: values.post_code,
      address: values.address,
      tell: values.tell,
      email: values.email,
      password: values.password,
      facility_id: values.facility_id,
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
      await fetchFacilityMembers();
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

  interface Facility {
    id:string;
    facility_name:string;
  }


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
        <DialogContent className="max-h-[90%] overflow-hidden">
          <DialogHeader>
            <DialogTitle>施設管理者の新規追加</DialogTitle>
            <DialogDescription>
              施設管理者の新規追加を行います。
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 overflow-y-scroll">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex">
                  <div className="mr-2 w-full">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>管理者名（性）</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>管理者名（名）</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-2 w-full">
                    <FormField
                      control={form.control}
                      name="first_name_kana"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>管理者名（せい）</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="last_name_kana"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>管理者名（めい）</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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

                <FormField
                  control={form.control}
                  name="facility_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>施設</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {facilities.map((facility:Facility) => (
                              <SelectItem
                                key={facility.id}
                                value={facility.id.toString()}
                              >
                                {facility.facility_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
