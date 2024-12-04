import { ColumnDef } from "@tanstack/react-table";
import EditForm from "./edit-form";
import DeleteForm from "./delete-form";

// Facility の型を定義
export interface Tag {
  id: string;
  name: string;
}

// カラム定義を作成
export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "タグ名",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditForm tag_id={row.original.id} />
        <DeleteForm tag_id={row.original.id} />
      </div>
    ),
  },
];
