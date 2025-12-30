import { createContext, useContext, useState } from "react";

export type NavConfig = {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
};

const NavContext = createContext<{
  config: NavConfig;
  setConfig: (c: NavConfig) => void;
} | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<NavConfig>({});

  return (
    <NavContext.Provider value={{ config, setConfig }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  //   if (!ctx) {
  //     throw new Error("useNav must be used inside NavProvider");
  //   }
  return ctx;
}
