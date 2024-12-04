import { ColumnDef } from "@tanstack/react-table";
import EditForm from "./edit-form";
import DeleteForm from "./delete-form";

// Facility の型を定義
export interface FacilityAdmin {
  id: string;
  first_name: string;
  last_name: string;
  first_name_kana: string;
  last_name_kana: string;
  tel: string;
  post_code: string;
  address: string;
  facility_name:string;
}

// カラム定義を作成
export const columns: ColumnDef<FacilityAdmin>[] = [
  {
    accessorKey: "first_name",
    header: "管理者名",
    cell: ({ row }) => {
      // first_name と last_name を結合して表示
      const { first_name, last_name } = row.original;
      return `${first_name} ${last_name}`;
    },
  },
  {
    accessorKey: "tell",
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
    accessorKey: "facility_name",
    header: "施設",
    cell: ({ row }) => row.original.facility_name || "未設定",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditForm facility_admin_id={Number(row.original.id)} />
        <DeleteForm facility_admin_id={Number(row.original.id)} />
      </div>
    ),
  },
];
