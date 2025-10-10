import { create } from "zustand";
import { type  MCPSelectType, MCPSelectData } from "@/feature/index/data/mcp-select-data";
interface MCPState {
    mcps: MCPSelectType[];
    setMCPs: (mcps: MCPSelectType[]) => void;
}

export const useMCP = create<MCPState>((set, get) => ({
    mcps: MCPSelectData,
    setMCPs: (mcps: MCPSelectType[]) => set({ mcps }),
}));