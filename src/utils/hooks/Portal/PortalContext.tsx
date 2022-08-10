import React, { ReactElement } from "react";
import Portal from "./Portal";
import usePortal from "./usePortal";

export interface IPortalContext {
  portal: boolean;
  closePortal: () => void;
  handlePortal: (portal: ReactElement) => void;
  PortalContent: ReactElement | string | null;
}

let PortalContext = React.createContext<IPortalContext | null>(null);

interface Props {
  children: JSX.Element;
}

let PortalProvider = ({ children }: Props) => {
  let { portal, closePortal, handlePortal, PortalContent } = usePortal();
  return (
    <PortalContext.Provider
      value={{ portal, closePortal, handlePortal, PortalContent }}
    >
      <Portal />
      {children}
    </PortalContext.Provider>
  );
};

export { PortalContext, PortalProvider };
