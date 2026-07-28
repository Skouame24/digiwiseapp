import { ReactNode } from "react";

interface GateWrapperProps {
  children: ReactNode;
}

export function GateWrapper({ children }: GateWrapperProps) {
  return <>{children}</>;
}

