import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar from "./LoadingBar";

export default function RouteChangeListener() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Show loading bar for at least 1 second
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return isLoading ? <LoadingBar /> : null;
}
