import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Lang } from "@/lib/translations";

type Translation = (typeof translations)[Lang];

interface LanguageStore {
  lang: Lang;
  t: Translation;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: "th",
      t: translations["th"],
      setLang: (lang) => set({ lang, t: translations[lang] }),
    }),
    {
      name: "shc-lang",
      // Only persist the lang key — t contains functions that JSON can't serialise
      partialize: (state) => ({ lang: state.lang }),
      // Recompute t from the live translations object after rehydration
      onRehydrateStorage: () => (state) => {
        if (state) state.t = translations[state.lang];
      },
    }
  )
);
