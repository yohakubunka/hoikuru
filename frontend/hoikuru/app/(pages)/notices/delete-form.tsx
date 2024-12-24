// DeleteForm.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteNoticeAction } from "./actions";
import { useRouter } from "next/navigation";
import { useNoticeStore } from "./store";


interface DeleteFormProps {
  notice_id: string;
}

export default function DeleteForm({ notice_id }: any) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();  // useRouterフックを使用
  const { fetchNotices } = useNoticeStore();

  // 削除処理
  const handleDelete = async () => {
    const res = await deleteNoticeAction(notice_id);

    if (res.status) {
      toast({
        title: "削除成功",
        description: res.message,
      });
      router.push("/notices");
      fetchNotices();

    } else {
      toast({
        title: "削除エラー",
        description: res.message,
        variant: "destructive",
      });
    }

    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="ml-auto bg-red-500 hover:bg-red-600">投稿の削除</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>投稿の削除</DialogTitle>
            <DialogDescription>投稿を削除しますか？</DialogDescription>
          </DialogHeader>
          <Button onClick={handleDelete}>削除する</Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
