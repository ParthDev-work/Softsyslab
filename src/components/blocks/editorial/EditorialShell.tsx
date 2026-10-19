import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Figma Make page width and horizontal rhythm — SoftSysLab tokens inside. */
export function EditorialShell({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("editorial-shell", className)}>{children}</Tag>
  );
}
