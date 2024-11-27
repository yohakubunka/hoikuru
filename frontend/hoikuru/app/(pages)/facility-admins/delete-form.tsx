// DeleteForm.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFacilityAdminStore } from "./store"; 
import { deleteFacilityAdminAction } from "./actions";

interface DeleteFormProps {
  facility_admin_id: number;
}

export default function DeleteForm({ facility_admin_id }: DeleteFormProps) {
  const [open, setOpen] = useState(false);
  const { fetchFacilityAdmins } = useFacilityAdminStore();
  const { toast } = useToast();

  // 削除処理
  const handleDelete = async () => {
    const res = await deleteFacilityAdminAction(facility_admin_id);
    
    if (res.status) {
      toast({
        title: "削除成功",
        description: res.message,
      });
      fetchFacilityAdmins(); // 施設リストを再取得して更新
    } else {
      toast({
        title: "削除エラー",
        description: res.message,
        variant: "destructive",
      });
    }
    
    setOpen(false); // ダイアログを閉じる
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>削除</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>施設管理者の削除</DialogTitle>
            <DialogDescription>施設管理者を削除しますか？</DialogDescription>
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
