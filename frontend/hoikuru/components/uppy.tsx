import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import Japanese from "@uppy/locales/lib/ja_JP";

export default function UppyComponent({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  const uppy = new Uppy({
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ["image/*"],
    },
    locale: Japanese,
  });

  uppy.use(XHRUpload, {
    endpoint: "/api/upload", // アップロード用APIエンドポイント
    fieldName: "file",
  });

  uppy.on("complete", (result) => {
    const uploadedFile = result.successful[0];
    if (uploadedFile) {
      onUploadComplete(uploadedFile.response.body.url); // URLを親コンポーネントに渡す
    }
  });

  return <Dashboard uppy={uppy} height={200} />;
}
