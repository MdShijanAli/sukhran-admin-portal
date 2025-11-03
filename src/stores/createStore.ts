import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const createStore = <T>(
  store: StateCreator<T>,
  name: string,
  shouldPersist = false
) => {
  // dev mode check
  const isDev = import.meta.env.MODE === "development";

  if (shouldPersist) {
    // persist + devtools both together
    return create<T>()(
      devtools(
        persist(store, {
          name: name.toLowerCase().replace(/\s+/g, "_"), // localStorage key
        }),
        { name: `${name} (Persisted)`, enabled: isDev }
      )
    );
  }

  // only devtools if needed
  return create<T>()(devtools(store, { name: `${name}`, enabled: isDev }));
};
