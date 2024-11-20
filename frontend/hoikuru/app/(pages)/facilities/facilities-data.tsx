"use client";

import { useEffect } from "react";
import { useFacilityStore } from "./store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { columns,Facility } from "./column"; // カラム定義をインポート

export default function FacilitiesData() {
  const { facilities, fetchFacilities } = useFacilityStore();

  // 初回ロード時に施設情報を取得
  useEffect(() => {
    if (facilities.length === 0) {
      fetchFacilities();
    }
  }, [facilities, fetchFacilities]);

  // ローディング中のスケルトン表示
  if (facilities.length === 0) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  return (
    <div className="">
      <DataTable<Facility> columns={columns} data={facilities} />
    </div>
  );
}
