'use client'
import { Button } from "@/components/ui/button"
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

export default function FaciltiiesData({ facilities, onEdit }: FacilitiesDataProps) {
  return (
      <ul>
          {facilities.map((facility) => (
              <li key={facility.id}>
                  <p>施設名: {facility.facility_name}</p>
                  <p>電話番号: {facility.tel}</p>
                  <p>郵便番号: {facility.post_code}</p>
                  <p>住所: {facility.address}</p>
                  <Button onClick={() => onEdit(facility)}>編集</Button> 
              </li>
          ))}
      </ul>
  );
}
