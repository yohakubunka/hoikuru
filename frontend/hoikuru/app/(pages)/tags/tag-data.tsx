"use client";

import { useState, useEffect } from "react";
import { useTagStore } from "./store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { columns, Tag } from "./column"; // カラム定義をインポート
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function TagsData() {
  const { Tags, fetchTags } = useTagStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true); // ローディング開始
      await fetchTags();
      setIsLoading(false); // ローディング終了
    };

    if (Tags.length === 0) {
      loadTags();
    } else {
      setIsLoading(false); // 既にデータがある場合
    }
  }, []);

  // データがない場合のメッセージ表示
  if (isLoading) {
    return (
      <div className="border rounded-lg w-full">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (Tags.length === 0) {
    return <p className="text-center text-gray-500">データが存在しません</p>;
  }

  return (
    <div>
      <DataTable<Tag, unknown> columns={columns} data={Tags} />
    </div>
  );
}
