import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useDemoContext } from "@/contexts/DemoContext";
import { useRTL } from "@/hooks/useRTL";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  createdAt: string;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleStatus?: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) => {
  const [showControls, setShowControls] = useState(false);
  const { t } = useTranslation();
  const { isDemoMode } = useDemoContext();
  const confirmation = useConfirmation();
  const isRTL = useRTL();

  const handleDelete = async () => {
    if (isDemoMode) {
      onDelete?.(task.id);
      return;
    }
    
    const confirmed = await confirmation.confirm({
      title: t('tasks.deleteTask'),
      description: t('tasks.deleteTaskConfirm', { title: task.title }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: 'destructive'
    });
    
    if (confirmed) {
      onDelete?.(task.id);
    }
  };
  
  const priorityColors = {
    LOW: "bg-success/10 text-success border-success/20",
    MEDIUM: "bg-warning/10 text-warning border-warning/20",
    HIGH: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const statusIcons = {
    "TODO": Circle,
    "IN_PROGRESS": Clock,
    "COMPLETED": CheckCircle2
  };

  const statusColors = {
    "TODO": "text-muted-foreground",
    "IN_PROGRESS": "text-warning",
    "COMPLETED": "text-success"
  };

  const StatusIcon = statusIcons[task.status] || Circle;
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

  return (
    <div 
      className="transform hover:-translate-y-1 transition-all duration-150 ease-out will-change-transform" 
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Card className="hover:shadow-md border-border/50 rounded-2xl bg-card overflow-hidden w-full max-w-full">
        <CardContent className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={cn(
              "flex items-center",
              isRTL ? "space-x-reverse space-x-3" : "space-x-3"
            )}>
              <div className="hover:scale-110 transition-transform duration-150">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus?.(task.id)}
                  className={cn("p-0 hover:bg-transparent", statusColors[task.status])}
                >
                  <StatusIcon className="h-5 w-5" />
                </Button>
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold text-foreground text-sm sm:text-base line-clamp-1 max-w-[150px] sm:max-w-[180px] md:max-w-full overflow-wrap-anywhere",
                  task.status === "COMPLETED" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs mt-1", priorityColors[task.priority])}
                >
                  {t(`taskCard.${task.priority.toLowerCase()}Priority`)}
                </Badge>
              </div>
            </div>
            
            <div 
              className={cn(
                "flex items-center transition-opacity duration-200",
                isRTL ? "space-x-reverse space-x-1" : "space-x-1",
                showControls ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="rounded-xl text-muted-foreground hover:text-primary hover:scale-105 transition-transform"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="rounded-xl text-muted-foreground hover:text-destructive hover:scale-105 transition-transform"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 overflow-wrap-anywhere">
          {task.description}
        </p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {task.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="text-xs rounded-full px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-2 sm:gap-0">
          <div className="flex items-center">
            <div className={cn(
              "flex items-center",
              isRTL ? "space-x-reverse space-x-1" : "space-x-1",
              isOverdue && "text-destructive"
            )}>
              {isOverdue && (
                <div className="animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                </div>
              )}
              <Calendar className="h-3 w-3" />
              <span className="truncate">{t('taskCard.due', { date: new Date(task.dueDate).toLocaleDateString() })}</span>
            </div>
          </div>
          
          <div className="text-xs">
            {t('taskCard.created', { date: new Date(task.createdAt).toLocaleDateString() })}
          </div>
        </div>
      </CardContent>
    </Card>
    
    {!isDemoMode && (
      <ConfirmationDialog
        open={confirmation.isOpen}
        onOpenChange={() => confirmation.handleCancel()}
        title={confirmation.options?.title || ''}
        description={confirmation.options?.description || ''}
        confirmText={confirmation.options?.confirmText}
        cancelText={confirmation.options?.cancelText}
        variant={confirmation.options?.variant}
        onConfirm={confirmation.handleConfirm}
      />
    )}
    </div>
  );
};

export default TaskCard;