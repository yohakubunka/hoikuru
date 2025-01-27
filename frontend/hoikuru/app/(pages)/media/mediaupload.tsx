"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  // uploadedImages　画像の公開URL（文字列）を配列として保持します。
  // setUploadedImages　uploadedImagesの値を更新するための関数。
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; path: string }[]
  >([]); // 画像URLとパスの配列
  const { toast } = useToast();

  // ファイル選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  // ファイルアップロード
  const handleUpload = async () => {
    if (!imageFile) {
      toast({
        title: "画像を選択してください",
        variant: "destructive",
      });
      return;
    }
    // ファイル名の生成
    const fileName = `test/${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("media") // バケット名
      // fileNameで指定したパスに‘imageFile’オブジェクトをアップロード
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
    // 成功した場合、画像一覧を再取得
    toast({
      title: "アップロード成功",
      description: "画像が正常にアップロードされました。",
    });
    fetchUploadedImages(); // 新しい画像を含めた最新の一覧を取得
  };

  // バケット内の画像一覧を取得
  const fetchUploadedImages = async () => {
    // supabaseメソッド（この場合は .list()）から返された結果オブジェクトを、それぞれの変数に分解して取得
    const { data, error } = await supabase.storage
      .from("media") // バケット名
      .list("test"); // 'test'フォルダーの画像一覧
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
      // 画像の公開URLを取得して配列に変換
      const filteredFiles = data.filter(
        // supabaseで自動的に生成される空データ「.emptyFolderPlaceholder」を除外
        (file) => file.name !== ".emptyFolderPlaceholder"
      );
      const imageUrls = filteredFiles.map((file) => {
        const publicUrl = supabase.storage
          .from("media")
          .getPublicUrl(`test/${file.name}`).data.publicUrl;
        return { url: publicUrl, path: `test/${file.name}` }; // 公開URLとパスを保持
      });
      setUploadedImages(imageUrls); // 公開URLをstateに保存
    }
  };

  // 画像を削除
  const handleDelete = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("media") // バケット名
      .remove([path]); // 削除するファイルパス（配列で指定）

    if (error) {
      console.error("削除エラー:", error.message);
      toast({
        title: "削除エラー",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // 削除成功後、ローカルの画像リストを更新
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image.path !== path)
    );
    alert("画像が削除されました");
  };

  // ページが読み込まれた際に画像一覧を取得（useEffect）
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">画像アップロード</h1>
        <div className="mb-6">
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button className="mt-4" onClick={handleUpload}>
            アップロード
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">画像一覧</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="relative border rounded overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-auto"
                />
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
    </>
  );
}
