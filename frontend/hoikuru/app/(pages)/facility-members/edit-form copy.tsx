import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  selectFacilityMembersAction,
  selectFacilityMemberAction,
  updateFacilityMemberAction,
} from "./actions";
import { useFacilityMemberStore } from "./store";
import { selectFacilitiesAction } from "../facilities/actions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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


export default function EditForm(facility_member_id: number) {
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
      facility_id: "",
    },
  });

  //   施設情報の取得関数
  async function fecthFacilityMember() {
    const res = selectFacilityMemberAction(facility_member_id);
    res.then(
      (data) => {
        form.setValue("first_name", data.first_name);
        form.setValue("last_name", data.last_name);
        form.setValue("first_name_kana", data.first_name_kana);
        form.setValue("last_name_kana", data.last_name_kana);
        form.setValue("post_code", data.post_code);
        form.setValue("address", data.address);
        form.setValue("tell", data.tell);
        form.setValue("facility_id", data.facility_id);
      },
      (data) => {}
    );
  }

  // 保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateFacilityMemberAction({
      id: facility_member_id,
      first_name: values.first_name,
      last_name: values.last_name,
      first_name_kana: values.first_name_kana,
      last_name_kana: values.last_name_kana,
      post_code: values.post_code,
      address: values.address,
      tell: values.tell,
      facility_id: values.facility_id,
    });
    await fetchFacilityMembers();
    setOpen(false);
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
          <Button onClick={() => fecthFacilityMember()}>編集</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>施設の編集</DialogTitle>
            <DialogDescription>施設の編集を行います。</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex">
                  <div className="mr-2 w-full">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>メンバー名（性）</FormLabel>
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
                          <FormLabel>メンバー名（名）</FormLabel>
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
                          <FormLabel>メンバー名（せい）</FormLabel>
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
                          <FormLabel>メンバー名（めい）</FormLabel>
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
                            {facilities.map((facility) => (
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
              <Button type="submit">編集</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
