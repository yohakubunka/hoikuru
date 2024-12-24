"use client";
import AddForm from "./add";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { insertNoticeAction } from "./actions";
import NoticesData from "./data";

export default function Notices() {

  const router = useRouter();
  const handleInsertNotice = async () => {
    const response = await insertNoticeAction({
      title: "新しい投稿",
      content: "",
      thumbnail_url: "",
      publish: false,
    });

    if (response.status) {
      // 挿入成功時、createページにリダイレクト
      router.push(`/notices/create?id=${response.id}`);
    } else {
      console.error(response.message);
      alert("投稿の追加に失敗しました。");
    }
  };
  return (
    <>
      <div className="m-8 w-full">
        <Button className="flex mb-8 ml-auto" onClick={handleInsertNotice}>投稿を作成する</Button>
        <NoticesData />
      </div>
    </>
  );
}
