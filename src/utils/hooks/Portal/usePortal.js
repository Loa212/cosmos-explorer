import { useState } from "react";

const usePortal = () => {
  let [portal, setPortal] = useState(false);
  let [PortalContent, setPortalContent] = useState("");

  let handlePortal = (content = <>test content</>) => {
    setPortal(true);
    if (content) {
      setPortalContent(content);
    } else {
      setPortal(false);
    }
  };

  let closePortal = () => {
    setPortal(false);
  };

  return { portal, closePortal, handlePortal, PortalContent };
};

export default usePortal;
