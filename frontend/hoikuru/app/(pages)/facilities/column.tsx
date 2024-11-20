import { ColumnDef } from "@tanstack/react-table";
import EditForm from "./edit-form";
import DeleteForm from "./delete-form";

// Facility の型を定義
export interface Facility {
  id: string;
  facility_name: string;
  tel: string;
  post_code: string;
  address: string;
}

// カラム定義を作成
export const columns: ColumnDef<Facility>[] = [
  {
    accessorKey: "facility_name",
    header: "施設名",
  },
  {
    accessorKey: "tel",
    header: "電話番号",
  },
  {
    accessorKey: "post_code",
    header: "郵便番号",
  },
  {
    accessorKey: "address",
    header: "住所",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditForm facility_id={Number(row.original.id)} />
        <DeleteForm facility_id={Number(row.original.id)} />
      </div>
    ),
  },
];
