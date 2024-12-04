import { ColumnDef } from "@tanstack/react-table";
import EditForm from "./edit-form";
import DeleteForm from "./delete-form";

// Facility の型を定義
export interface Category {
  name: string;
}

// カラム定義を作成
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "カテゴリー名",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditForm category_id={row.original.id} />
        <DeleteForm category_id={row.original.id} />
      </div>
    ),
  },
];
