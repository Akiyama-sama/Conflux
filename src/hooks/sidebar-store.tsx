import { create } from 'zustand';
type SideBar = 'sensor' | 'chatbot';

interface SideBarState {
  sideBar: SideBar;
  setSideBar: (newSideBar: SideBar) => void;
}

export const useSideBar = create<SideBarState>((set) => ({
  sideBar: 'sensor',
  setSideBar: (newSideBar) => set({ sideBar: newSideBar }),
}));