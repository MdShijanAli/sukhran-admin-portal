import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

export interface ActionItem<T = unknown> {
  label: string;
  icon?: LucideIcon;
  onClick: (item: T) => void;
  className?: string;
  show?: boolean | ((item: T) => boolean);
  variant?: "default" | "destructive";
  separator?: boolean; // Show separator after this item
}

interface DropdownMenuActionsProps<T> {
  item: T;
  actions: ActionItem<T>[];
  triggerIcon?: ReactNode;
  triggerVariant?: "default" | "outline" | "ghost" | "secondary";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  menuLabel?: string;
  align?: "start" | "center" | "end";
}

export function DropdownMenuActions<T>({
  item,
  actions,
  triggerIcon,
  triggerVariant = "ghost",
  triggerSize = "icon",
  menuLabel = "Actions",
  align = "end",
}: DropdownMenuActionsProps<T>) {
  const visibleActions = actions.filter((action) => {
    if (action.show === undefined) return true;
    if (typeof action.show === "function") return action.show(item);
    return action.show;
  });

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>
          {triggerIcon || <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {menuLabel && (
          <>
            <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div key={index}>
              <DropdownMenuItem
                onClick={() => action.onClick(item)}
                className={`cursor-pointer ${
                  action.variant === "destructive" ? "text-destructive" : ""
                } ${action.className || ""}`}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
              {action.separator && index < visibleActions.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
