"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Note = {
    id: number
    created_at: string
    content: string
    title: string
  }

  export const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
        accessorKey: "title",
        header: "タイトル",
      },
      {
        accessorKey: "content",
        header: "本文",
      },
      {
        accessorKey: "created_at",
        header: "作成日時",
      },
  ]