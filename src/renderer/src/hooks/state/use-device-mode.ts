import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreType<T> {
  data: T;
  history: T[];
  onChange: (data: T) => void;
  onReset: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const initial = {
  mode: "0",
  deterministic: false,
  stochastic: false,
};

export const useDeviceMode = create(
  persist<StoreType<typeof initial>>(
    (set, get) => ({
      data: initial,
      history: [initial, initial],

      onChange: (data) => {
        set({ data });
      },

      onReset: () => {
        set({ data: initial, history: [initial, initial] });
      },

      onCancel: () => {
        const { history } = get();
        set({
          data: history[0],
        });
      },

      onSubmit: () => {
        const { data, history } = get();
        set({
          history: [history[1], data],
        });
      },
    }),
    {
      name: "device-mode",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
