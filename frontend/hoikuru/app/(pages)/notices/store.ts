import { create } from 'zustand';
import { selectNoticesAction } from './actions';

interface NoticeStore {
  Notices: Array<any>;
  setNotices: (Notices: Array<any>) => void;
  fetchNotices: () => Promise<void>;
}

export const useNoticeStore = create<NoticeStore>((set: any) => ({
  Notices: [],
  message: '', // メッセージの初期状態
  setNotices: (Notices: any) => {
    if (Notices.length === 0) {
      set({ Notices, message: 'データが存在しません。' });
    } else {
      set({ Notices, message: '' });
    }
  },
  fetchNotices: async () => {
    const Notices: any = await selectNoticesAction();
    if (Notices && Notices.length > 0) {
      set({ Notices, message: '' });
    } else {
      set({ Notices: [], message: 'データが存在しません。' });
    }
  },
}));