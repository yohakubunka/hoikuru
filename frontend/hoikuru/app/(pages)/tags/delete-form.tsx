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
import { useTagStore } from "./store";
import { deleteTagAction } from "./actions";

interface DeleteFormProps {
  tag_id: string;
}

export default function DeleteForm({ tag_id }: DeleteFormProps) {
  const [open, setOpen] = useState(false);
  const { fetchTags } = useTagStore();
  const { toast } = useToast();

  // 削除処理
  const handleDelete = async () => {
    const res = await deleteTagAction(tag_id);

    if (res.status) {
      toast({
        title: "削除成功",
        description: res.message,
      });
      fetchTags();
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
          <Button>削除</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タグの削除</DialogTitle>
            <DialogDescription>タグを削除しますか？</DialogDescription>
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
