import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

interface IBadgeProps {
  children?: ReactNode,
  className?: ClassNameValue
}

const Badge = ({
  children,
  className
} : IBadgeProps) => {
  return (
    <div className={"bg-zinc-800 rounded-full px-3 py-2 " + className}>
      {children}
    </div>
  )
}

export default Badge;
