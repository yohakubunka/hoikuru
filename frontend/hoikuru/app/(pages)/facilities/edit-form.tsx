import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
import { selectFacilityAction, updateFacilityAction } from "./actions";

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

export default function EditForm(facility_id: number) {
  const [open, setOpen] = useState(false);

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

  //   施設情報の取得関数
  async function fecthFacility() {
    const res = selectFacilityAction(facility_id);
    res.then(
      (data) => {
        console.log(data);
        form.setValue("facility_name", data.facility_name);
        form.setValue("post_code", data.post_code);
        form.setValue("address", data.address);
        form.setValue("tel", data.tel);
      },
      (data) => {}
    );
  }

  //   保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateFacilityAction(
      facility_id,
      values.facility_name,
      values.post_code,
      values.address,
      values.tel
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => fecthFacility()}>編集</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>施設の編集</DialogTitle>
            <DialogDescription>施設の編集を行います。</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <Button type="submit">編集</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
