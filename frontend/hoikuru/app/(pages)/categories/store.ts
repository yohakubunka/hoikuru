import {create} from 'zustand';
import { selectCategoriesAction } from './actions';

interface CategorieStore {
  Categories: Array<any>;
  setCategories: (Categories: Array<any>) => void;
  fetchCategories: () => Promise<void>;
}

export const useCategorieStore = create<CategorieStore>((set: any) => ({
  Categories: [],
  message: '', // メッセージの初期状態
  setCategories: (Categories: any) => {
    if (Categories.length === 0) {
      set({ Categories, message: 'データが存在しません。' });
    } else {
      set({ Categories, message: '' });
    }
  },
  fetchCategories: async () => {
    const Categories:any = await selectCategoriesAction();
    if (Categories && Categories.length > 0) {
      set({ Categories, message: '' });
    } else {
      set({ Categories: [], message: 'データが存在しません。' });
    }
  },
}));