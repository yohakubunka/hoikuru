import {create} from 'zustand';
import { selectCategorysAction } from './actions';

interface CategoryStore {
  Categorys: Array<any>;
  setCategorys: (Categorys: Array<any>) => void;
  fetchCategorys: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set: any) => ({
  Categorys: [],
  message: '', // メッセージの初期状態
  setCategorys: (Categorys: any) => {
    if (Categorys.length === 0) {
      set({ Categorys, message: 'データが存在しません。' });
    } else {
      set({ Categorys, message: '' });
    }
  },
  fetchCategorys: async () => {
    const Categorys:any = await selectCategorysAction();
    if (Categorys && Categorys.length > 0) {
      set({ Categorys, message: '' });
    } else {
      set({ Categorys: [], message: 'データが存在しません。' });
    }
  },
}));