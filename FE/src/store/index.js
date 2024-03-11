import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set, get) => ({
    cart: [],
    userInfo: null,
    updateStore(data) {
        set({...data})
    }
  }), {
    name: "store"
  })
);

export default useStore;