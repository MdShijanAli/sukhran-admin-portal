import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import usePermissions from "@/hooks/use-permissions";

interface StatusSwitchProps {
  checked: boolean;
  onToggle: () => Promise<void> | void;
  disabled?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  permission?: string;
}

export function StatusSwitch({
  checked,
  onToggle,
  disabled = false,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  showLabel = true,
  size = "md",
  permission,
}: StatusSwitchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { hasPermission } = usePermissions();

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        hasPermission(permission || "") && (
          <Switch
            checked={checked}
            onCheckedChange={handleToggle}
            disabled={disabled}
          />
        )
      )}
      {showLabel && (
        <Label
          className={`cursor-pointer ${sizeClasses[size]} ${
            checked ? "text-green-600 font-medium" : "text-muted-foreground"
          }`}
        >
          {checked ? activeLabel : inactiveLabel}
        </Label>
      )}
    </div>
  );
}
