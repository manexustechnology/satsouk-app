import { useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
}

const useResizeWindow = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSize);

    return () => window.removeEventListener("resize", handleWindowSize);
  }, []);

  return {windowSize}
};

export default useResizeWindow;
