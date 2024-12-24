import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteForm from "./delete-form";

// Facility の型を定義
export interface Notice {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// 日付フォーマット関数
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

// カラム定義を作成
export const columns: ColumnDef<Notice>[] = [
  {
    accessorKey: "title",
    header: "投稿タイトル",
  },
  {
    accessorKey: "created_at",
    header: "作成日時",
    cell: ({ row }) => <span>{formatDateTime(row.original.created_at)}</span>,
  },
  {
    accessorKey: "updated_at",
    header: "最終更新日時",
    cell: ({ row }) => <span>{formatDateTime(row.original.updated_at)}</span>,
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/notices/edit/${row.original.id}`}>
          <Button type="button">編集</Button>
        </Link>
        <DeleteForm notice_id={row.original.id} />
      </div>
    ),
  },
];
