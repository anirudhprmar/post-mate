import { create } from 'zustand';

export interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}

interface PostState {
  content: string;
  setContent: (content: string) => void;
  selectedAccountIds: string[];
  toggleAccount: (accountId: string) => void;
  media: MediaItem[];
  addMedia: (files: File[]) => void;
  removeMedia: (id: string) => void;
  clearMedia: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  content: '',
  setContent: (content) => set({ content }),
  selectedAccountIds: [],
  toggleAccount: (accountId) => set((state) => ({
    selectedAccountIds: state.selectedAccountIds.includes(accountId)
      ? state.selectedAccountIds.filter(id => id !== accountId)
      : [...state.selectedAccountIds, accountId]
  })),
  media: [],
  addMedia: (files) => set((state) => {
    const newMedia = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image' as 'video' | 'image'
    }));
    return { media: [...state.media, ...newMedia] };
  }),
  removeMedia: (id) => set((state) => {
    const itemToRemove = state.media.find(m => m.id === id);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }
    return { media: state.media.filter(m => m.id !== id) };
  }),
  clearMedia: () => set((state) => {
    state.media.forEach(m => URL.revokeObjectURL(m.previewUrl));
    return { media: [] };
  })
}));
