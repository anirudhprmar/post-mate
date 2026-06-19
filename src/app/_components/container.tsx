import { cn } from "~/lib/utils";
import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "selection:bg-primary relative z-10 mx-auto h-full max-w-6xl selection:text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
