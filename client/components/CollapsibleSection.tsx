import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
  badge,
  icon,
  variant = "default",
  className,
}: CollapsibleSectionProps) {
  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader 
        className={cn(
          "cursor-pointer hover:bg-glg-50 transition-colors",
          variant === "compact" ? "py-3" : "py-4"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-glg-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-glg-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-glg-600" />
              )}
            </Button>
            {icon && (
              <div className="text-glg-navy">
                {icon}
              </div>
            )}
            <h3 className={cn(
              "font-semibold text-glg-900",
              variant === "compact" ? "text-base" : "text-lg"
            )}>
              {title}
            </h3>
          </div>
          {badge && (
            <Badge 
              variant="secondary" 
              className="bg-glg-100 text-glg-800 hover:bg-glg-100"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className={cn(
          "border-t border-glg-200 transition-all duration-200 animate-in slide-in-from-top-1",
          variant === "compact" ? "pt-3" : "pt-4"
        )}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
