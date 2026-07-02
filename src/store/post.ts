import { create } from "zustand";

export interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
  thumbnail?: File;
  thumbnailPreviewUrl?: string;
}

export type InstagramPostType = "image" | "reel" | "story";

interface PostState {
  content: string;
  setContent: (content: string) => void;
  selectedAccountIds: string[];
  toggleAccount: (accountId: string) => void;
  media: MediaItem[];
  addMedia: (files: File[]) => void;
  removeMedia: (id: string) => void;
  clearMedia: () => void;
  setThumbnail: (
    id: string,
    thumbnail: File | undefined,
    thumbnailPreviewUrl?: string,
  ) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  reset: () => void;
  isInsta: boolean;
  setIsInsta: (isInsta: boolean) => void;
  isOverLimit: boolean;
  setIsOverLimit: (over: boolean) => void;

  // Per-platform caption overrides (accountId → HTML string)
  platformCaptions: Record<string, string>;
  setPlatformCaption: (accountId: string, caption: string) => void;
  clearPlatformCaptions: () => void;

  // X premium toggle per account (accountId → boolean)
  xPremium: Record<string, boolean>;
  setXPremium: (accountId: string, isPremium: boolean) => void;

  // Instagram post type per account (accountId → type)
  instagramPostType: Record<string, InstagramPostType>;
  setInstagramPostType: (accountId: string, type: InstagramPostType) => void;
}

export const usePostStore = create<PostState>((set) => ({
  isInsta: false,
  setIsInsta: (isInsta: boolean) => set({ isInsta }),
  isOverLimit: false,
  setIsOverLimit: (over: boolean) => set({ isOverLimit: over }),
  content: "",
  setContent: (content) => set({ content }),
  selectedAccountIds: [],
  toggleAccount: (accountId) =>
    set((state) => ({
      selectedAccountIds: state.selectedAccountIds.includes(accountId)
        ? state.selectedAccountIds.filter((id) => id !== accountId)
        : [...state.selectedAccountIds, accountId],
    })),
  scheduledDate: undefined,
  setScheduledDate: (date) => set({ scheduledDate: date }),
  media: [],
  addMedia: (files) =>
    set((state) => {
      const newMedia = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("video/")
          ? "video"
          : ("image" as "video" | "image"),
      }));
      return { media: [...state.media, ...newMedia] };
    }),
  removeMedia: (id) =>
    set((state) => {
      const itemToRemove = state.media.find((m) => m.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
        if (itemToRemove.thumbnailPreviewUrl) {
          URL.revokeObjectURL(itemToRemove.thumbnailPreviewUrl);
        }
      }
      return { media: state.media.filter((m) => m.id !== id) };
    }),
  clearMedia: () =>
    set((state) => {
      state.media.forEach((m) => {
        URL.revokeObjectURL(m.previewUrl);
        if (m.thumbnailPreviewUrl) {
          URL.revokeObjectURL(m.thumbnailPreviewUrl);
        }
      });
      return { media: [] };
    }),
  setThumbnail: (id, thumbnail, thumbnailPreviewUrl) =>
    set((state) => ({
      media: state.media.map((m) =>
        m.id === id ? { ...m, thumbnail, thumbnailPreviewUrl } : m,
      ),
    })),

  // Per-platform captions
  platformCaptions: {},
  setPlatformCaption: (accountId, caption) =>
    set((state) => ({
      platformCaptions: { ...state.platformCaptions, [accountId]: caption },
    })),
  clearPlatformCaptions: () => set({ platformCaptions: {} }),

  // X premium
  xPremium: {},
  setXPremium: (accountId, isPremium) =>
    set((state) => ({
      xPremium: { ...state.xPremium, [accountId]: isPremium },
    })),

  // Instagram post type
  instagramPostType: {},
  setInstagramPostType: (accountId, type) =>
    set((state) => ({
      instagramPostType: {
        ...state.instagramPostType,
        [accountId]: type,
      },
    })),

  reset: () =>
    set((state) => {
      state.media.forEach((m) => {
        URL.revokeObjectURL(m.previewUrl);
        if (m.thumbnailPreviewUrl) {
          URL.revokeObjectURL(m.thumbnailPreviewUrl);
        }
      });
      return {
        content: "",
        selectedAccountIds: [],
        media: [],
        scheduledDate: undefined,
        platformCaptions: {},
        xPremium: {},
        instagramPostType: {},
      };
    }),
}));
