import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

export default function RouteLoadingBar() {
  const ref = useRef<LoadingBarRef>(null);

  const isLoading = useRouterState({
    select: (s) => s.status === "pending",
  });

  useEffect(() => {
    if (isLoading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isLoading]);

  return (
    <LoadingBar
      ref={ref}
      color="#1e9df1"
      height={3}
      shadow={true}
      waitingTime={100}
    />
  );
}
