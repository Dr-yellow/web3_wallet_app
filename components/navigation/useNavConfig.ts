import { useEffect } from "react";
import { NavConfig, useNav } from "./NavContext";

export function useNavConfig(config: NavConfig) {
  const NavConfig = useNav();
  const { setConfig } = NavConfig || {};

  if (!setConfig) {
    return;
  }

  useEffect(() => {
    setConfig(config);

    return () => {
      setConfig({});
    };
  }, [JSON.stringify(config)]);
}
