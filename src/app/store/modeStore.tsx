import { create } from "zustand";
import type { ModeControllerProps, Mode } from "@/types";

export const useModeStore = create<ModeControllerProps>()((set) => ({
  mode: "draw",
  setMode: (mode: Mode) => set({ mode }),
}));
