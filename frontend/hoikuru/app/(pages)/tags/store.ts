import {create} from 'zustand';
import { selectTagsAction } from './actions';

interface TagStore {
  Tags: Array<any>;
  setTags: (Tags: Array<any>) => void;
  fetchTags: () => Promise<void>;
}

export const useTagStore = create<TagStore>((set: any) => ({
  Tags: [],
  message: '', // メッセージの初期状態
  setTags: (Tags: any) => {
    if (Tags.length === 0) {
      set({ Tags, message: 'データが存在しません。' });
    } else {
      set({ Tags, message: '' });
    }
  },
  fetchTags: async () => {
    const Tags:any = await selectTagsAction();
    if (Tags && Tags.length > 0) {
      set({ Tags, message: '' });
    } else {
      set({ Tags: [], message: 'データが存在しません。' });
    }
  },
}));