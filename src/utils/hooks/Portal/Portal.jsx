import ReactDOM from "react-dom";
import { useContext } from "react";
import { PortalContext } from "./PortalContext";

const Portal = () => {
  let { portal, PortalContent } = useContext(PortalContext);

  if (portal) {
    return ReactDOM.createPortal(
      PortalContent,
      document.querySelector("#portal-root")
    );
  } else {
    return null;
  }
};

export default Portal;
