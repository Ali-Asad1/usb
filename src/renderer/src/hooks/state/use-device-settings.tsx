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
  SINGLE: {
    FREQCY0: -20000000,
    ATTENV0: 255,
  },
  SWEEPF: {
    MINFREQ: 10000000,
    MAXFREQ: 10000000,
    STPFREQ: 100,
    SWPTIME: 8,
    ATTENVL: 255,
    REVERSE: 0,
  },
  MULTON: {
    FREQCY0: -20000000,
    FREQCY1: -10000000,
    FREQCY2: 0,
    FREQCY3: 10000000,
    FREQCY4: 20000000,
    ATTENV0: 255,
    ATTENV1: 255,
    ATTENV2: 255,
    ATTENV3: 255,
    ATTENV4: 255,
    MSELECT: 31,
  },
  FNOISE: {
    NOISEBW: 56000000,
    SHFFREQ: 10000000,
    SHFENBL: 0,
  },
  BARAGE: {
    BNUMBER: 32,
  },

  DELDOP: {
    DELAYEN: 1,
    DOPLREN: 0,
    DLYVALU: 1000,
    DOPFREQ: 1000000,
  },

  NOISES: {
    NOISESS: 0,
    PSGMODE: "0",
    ONDETER: 500000,
    OFFDETR: 500000,
    ONSTOCH: 100000,
    OFFSTOC: 100000,
  },
  LOFATT: {
    LOFRQCY: 1000000000,
    TXATTEN: 12,
  },

  DPOWER: {
    TXPOWER: 0,
  },
};

export const useDeviceSettings = create(
  persist<StoreType<typeof initial>>(
    (set, get) => ({
      data: initial,
      history: [initial, initial],

      onChange: (data) => {
        set({ data });
      },

      onReset: () => {
        set({ data: initial, history: [] });
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
      name: "device-setting",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
