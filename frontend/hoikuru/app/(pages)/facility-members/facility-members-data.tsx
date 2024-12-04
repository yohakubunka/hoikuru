"use client";

import { useEffect } from "react";
import { useFacilityMemberStore } from "./store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./data-table";
import { columns, FacilityMember } from "./column"; // カラム定義をインポート
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function FacilityMembersData() {
  const { FacilityMembers, fetchFacilityMembers } = useFacilityMemberStore();

  useEffect(() => {
    if (FacilityMembers.length === 0) {
      fetchFacilityMembers();
    }
  }, []);


  // ローディング中のスケルトン表示
  if (FacilityMembers.length === 0) {
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
              <TableRow>
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
              <TableRow>
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
              <TableRow>
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
              <TableRow>
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
              <TableRow>
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
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <DataTable<FacilityMember,unknown> columns={columns} data={FacilityMembers} />
    </div>
  );
}
