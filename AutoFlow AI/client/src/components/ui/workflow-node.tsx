import { useState } from "react";
import { cn } from "@/lib/utils";
import { NodeType } from "@shared/schema";

interface WorkflowNodeProps {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  service?: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const typeColors = {
  trigger: {
    border: "border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    bgIcon: "bg-blue-500"
  },
  action: {
    border: "border-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    bgIcon: "bg-purple-500"
  },
  condition: {
    border: "border-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    bgIcon: "bg-yellow-500"
  },
  loop: {
    border: "border-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    bgIcon: "bg-indigo-500"
  },
  delay: {
    border: "border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/30",
    bgIcon: "bg-orange-500"
  }
};

const iconMap = {
  trigger: "notifications_active",
  action: "play_arrow",
  condition: "call_split",
  loop: "loop",
  delay: "timer",
  email: "email",
  search: "search",
  transform: "transform",
  person_add: "person_add",
  database: "database",
  code: "code",
  webhook: "webhook"
};

export default function WorkflowNode({
  id,
  type,
  name,
  description,
  service,
  icon,
  isSelected = false,
  onClick,
  className
}: WorkflowNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = typeColors[type];
  const nodeIcon = icon || iconMap[type] || "help_outline";
  
  return (
    <div 
      className={cn(
        "workflow-node w-56 p-3 rounded-lg border-2 shadow-md flex flex-col transition-all",
        colors.border,
        colors.bg,
        isSelected && "ring-2 ring-primary dark:ring-primary-light",
        isHovered && "shadow-lg -translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center mb-2">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", colors.bgIcon)}>
          <span className="material-icons text-sm">{nodeIcon}</span>
        </div>
        <h3 className="ml-2 font-medium">{name}</h3>
      </div>
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </div>
  );
}
