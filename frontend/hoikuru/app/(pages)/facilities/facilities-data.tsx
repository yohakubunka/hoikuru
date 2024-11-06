"use client";
import { Button } from "@/components/ui/button";
import { selectFacilitiesAction } from "./actions";
import { useEffect, useState } from "react";
import EditForm from "./edit-form";
// facility-addで編集ボタンが押下されたときにonEditとしてクリックイベントを発火
interface FacilitiesDataProps {
  facilities: Array<{
    id: string;
    facility_name: string;
    tel: string;
    post_code: string;
    address: string;
  }>;
  onEdit: (facility: any) => void;
}

export default function FaciltiiesData() {
  const [facilities, setFacilities] = useState<any>([]);

  async function fetchFacilities() {
    const res = selectFacilitiesAction();
    res.then(
      (data) => {
        //   処理の成功時
        setFacilities(data);
      },
      (data) => {
        //   処理の失敗時
      }
    );
  }

  //   読み込み時に施設情報を取得
  useEffect(() => {
    fetchFacilities();
  }, []);

  if (facilities.length == 0) {
    return;
  }

  return (
    <ul>
      {facilities.map((facility: any) => (
        <li key={facility.id}>
          <p>施設名: {facility.facility_name}</p>
          <p>電話番号: {facility.tel}</p>
          <p>郵便番号: {facility.post_code}</p>
          <p>住所: {facility.address}</p>
          <EditForm facility_id={Number(facility.id)} />
        </li>
      ))}
    </ul>
  );
}
