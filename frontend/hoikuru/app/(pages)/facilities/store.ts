import {create} from 'zustand';
import { selectFacilitiesAction } from './actions';

interface FacilityStore {
  facilities: Array<any>;
  setFacilities: (facilities: Array<any>) => void;
  fetchFacilities: () => Promise<void>;
}

export const useFacilityStore = create<FacilityStore>((set:any) => ({
  facilities: [],
  setFacilities: (facilities:any) => set({ facilities }),
  fetchFacilities: async () => {
    const facilities = await selectFacilitiesAction();
    if (facilities) {
      set({ facilities });
    } else {
      console.error('施設情報の取得に失敗しました');
    }
  },
}));
