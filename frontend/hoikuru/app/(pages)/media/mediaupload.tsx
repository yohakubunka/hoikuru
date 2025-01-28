"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; path: string }[]
  >([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast({
        title: "画像を選択してください",
        variant: "destructive",
      });
      return;
    }

    const fileName = `test/${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("media")
      .upload(fileName, imageFile);

    if (error) {
      console.error("Upload error:", error.message);
      toast({
        title: "アップロード失敗",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const publicUrl = supabase.storage.from("media").getPublicUrl(fileName).data.publicUrl;

    const { error: dbError } = await supabase.from("media").insert([
      {
        name: imageFile.name,
        url: publicUrl,
        path: fileName,
      },
    ]);

    if (dbError) {
      console.error("Database insert error:", dbError.message);
      toast({
        title: "データベース更新失敗",
        description: dbError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "アップロード成功",
      description: "画像が正常にアップロードされました。",
    });
    fetchUploadedImages();
  };

  const fetchUploadedImages = async () => {
    const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching images:", error.message);
      toast({
        title: "画像一覧の取得失敗",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const imageUrls = data.map((row) => ({
        url: row.url,
        path: row.path,
      }));
      setUploadedImages(imageUrls);
    }
  };

  const handleDelete = async (path: string) => {
    const { data, error } = await supabase.storage.from("media").remove([path]);

    if (error) {
      console.error("削除エラー:", error.message);
      toast({
        title: "削除エラー",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { error: dbError } = await supabase.from("media").delete().eq("path", path);

    if (dbError) {
      console.error("データベース削除エラー:", dbError.message);
      toast({
        title: "データベース削除失敗",
        description: dbError.message,
        variant: "destructive",
      });
      return;
    }

    setUploadedImages((prevImages) => prevImages.filter((image) => image.path !== path));

    toast({
      title: "画像が削除されました",
    });
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">画像アップロード</h1>
      <div className="mb-6">
        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
        <Button className="mt-4" onClick={handleUpload}>
          アップロード
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">画像一覧</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative border rounded overflow-hidden">
              <img src={image.url} alt={`Uploaded ${index}`} className="w-full h-auto" />
              <button
                onClick={() => handleDelete(image.path)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
