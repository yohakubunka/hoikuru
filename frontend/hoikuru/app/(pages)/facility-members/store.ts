import {create} from 'zustand';
import { selectFacilityMembersAction } from './actions';

interface FacilityMemberStore {
  FacilityMembers: Array<any>;
  setFacilityMembers: (FacilityMembers: Array<any>) => void;
  fetchFacilityMembers: () => Promise<void>;
}

export const useFacilityMemberStore = create<FacilityMemberStore>((set:any) => ({
  FacilityMembers: [],
  setFacilityMembers: (FacilityMembers:any) => set({ FacilityMembers }),
  fetchFacilityMembers: async () => {
    const FacilityMembers = await selectFacilityMembersAction();
    if (FacilityMembers) {
      set({ FacilityMembers });
    } else {
      console.error('情報の取得に失敗しました');
    }
  },
}));
