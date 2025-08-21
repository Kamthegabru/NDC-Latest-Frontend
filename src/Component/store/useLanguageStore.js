// src/store/useLanguageStore.js
import { create } from 'zustand';

// ✅ Default to English, but don't import JSON at module level (causes issues in SSR/client boundary)
export const useLanguageStore = create((set) => ({
  locale: 'en',
  messages: {},

  // Dynamic import messages when language changes
  setLocale: async (locale) => {
    try {
      const messages = await import(`../messages/${locale}.json`);
      set({ locale, messages: messages.default });
    } catch (err) {
      console.error(`Failed to load ${locale}.json`, err);
    }
  },

  setMessages: (messages) => set({ messages }),
}));
