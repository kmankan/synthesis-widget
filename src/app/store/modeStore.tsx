import { create } from "zustand";
import type { ModeControllerProps, Mode } from "@/types";

export const useModeStore = create<ModeControllerProps>()((set) => ({
  mode: "addRemove",
  setMode: (mode: Mode) => set({ mode }),
  showLines: true,
  setShowLines: (showLines: boolean) => set({ showLines }),
}));
