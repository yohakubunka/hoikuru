"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { fetchMediaList, createMedia, deleteMedia } from "./actions"

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `ファイルサイズは5MB以下にしてください。`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "ファイル形式は .jpg, .png, .gif, または .webp のみ許可されています。",
    ),
})

type Media = {
  id: number
  file_path: string
  created_at: string
}

export function MediaUploadForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mediaList, setMediaList] = useState<Media[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    loadMediaList()
  }, [])

  async function loadMediaList() {
    try {
      const data = await fetchMediaList()
      setMediaList(data || [])
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "メディアリストの取得に失敗しました。",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await createMedia(values.file)
      toast({
        title: "メディアがアップロードされました",
      })
      form.reset()
      loadMediaList()
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "メディアの保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: number, filePath: string) {
    try {
      await deleteMedia(id, filePath)
      toast({
        title: "メディアが削除されました",
      })
      loadMediaList()
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "メディアの削除に失敗しました。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>画像ファイル</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  JPEG、PNG、GIF、またはWebP形式の画像をアップロードしてください（最大5MB）。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "アップロード中..." : "アップロード"}
          </Button>
        </form>
      </Form>

      {mediaList.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {mediaList.map((media) => (
            <div key={media.id} className="relative group">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${media.file_path}`}
                alt="Uploaded media"
                className="w-full aspect-square object-cover rounded"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button onClick={() => handleDelete(media.id, media.file_path)} variant="destructive" size="sm">
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">アップロードされた画像はありません。</p>
      )}
    </div>
  )
}

