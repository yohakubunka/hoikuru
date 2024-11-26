import {create} from 'zustand';
import { selectFacilityAdminsAction } from './actions';

interface FacilityAdminStore {
  FacilitiyAdmins: Array<any>;
  setFacilitiyAdmins: (FacilitiyAdmins: Array<any>) => void;
  fetchFacilityAdmins: () => Promise<void>;
}

export const useFacilityAdminStore = create<FacilityAdminStore>((set:any) => ({
  FacilitiyAdmins: [],
  setFacilitiyAdmins: (FacilitiyAdmins:any) => set({ FacilitiyAdmins }),
  fetchFacilityAdmins: async () => {
    const FacilitiyAdmins = await selectFacilityAdminsAction();
    if (FacilitiyAdmins) {
      set({ FacilitiyAdmins });
    } else {
      console.error('施設情報の取得に失敗しました');
    }
  },
}));
