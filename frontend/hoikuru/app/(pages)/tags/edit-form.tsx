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
  selectTagsAction,
  selectTagAction,
  updateTagAction,
} from "./actions";
import { useTagStore } from "./store";
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
  name: z.string().min(1, "タグ名は必須です。"),
});


export default function EditForm(category_id: any) {
  const [open, setOpen] = useState(false);
  const { fetchTags } = useTagStore();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  //   施設情報の取得関数
  async function fecthTag() {
    const res = selectTagAction(category_id);
    res.then(
      (data) => {
        form.setValue("name", data.name);
      },
      (data) => {}
    );
  }

  // 保存押下時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateTagAction({
      id: category_id,
      name: values.name,
    });
    await fetchTags();
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
          description: "タグデータの取得に失敗しました。",
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
          <Button onClick={() => fecthTag()}>編集</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タグの編集</DialogTitle>
            <DialogDescription>タグの編集を行います。</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>タグ名</FormLabel>
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
