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
import { useCategoryStore } from "./store";
import { deleteCategoryAction } from "./actions";

interface DeleteFormProps {
  category_id: string;
}

export default function DeleteForm({ category_id }: DeleteFormProps) {
  const [open, setOpen] = useState(false);
  const { fetchCategorys } = useCategoryStore();
  const { toast } = useToast();

  // 削除処理
  const handleDelete = async () => {
    const res = await deleteCategoryAction(category_id);

    if (res.status) {
      toast({
        title: "削除成功",
        description: res.message,
      });
      fetchCategorys();
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
            <DialogTitle>カテゴリーの削除</DialogTitle>
            <DialogDescription>カテゴリーを削除しますか？</DialogDescription>
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
