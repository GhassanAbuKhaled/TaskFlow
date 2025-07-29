import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SEO from "@/components/SEO";
import { useTaskContext } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@/hooks/useForm";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ValidationRules } from "@/lib/errors";
import { ArrowLeft, Save, X } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { Link, useNavigate, useParams } from "react-router-dom";

interface TaskForm {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  tags: string[];
}

const CreateTask = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addTask, updateTask, getTaskById } = useTaskContext();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [newTag, setNewTag] = useState("");
  const [originalData, setOriginalData] = useState<TaskForm | null>(null);

  const form = useForm<TaskForm>({
    initialValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      tags: []
    },
    validation: {
      title: {
        required: true,
        rules: [ValidationRules.maxLength(255, t)]
      },
      description: {
        rules: [ValidationRules.maxLength(255, t)]
      },
      dueDate: {
        required: true,
        rules: [ValidationRules.futureDate(t)]
      }
    },
    onSubmit: async (values) => {
      try {
        if (isEdit && id) {
          const existingTask = getTaskById(id);
          if (existingTask) {
            await updateTask({ ...existingTask, ...values });
          }
        } else {
          await addTask(values);
        }
        navigate("/tasks");
      } catch (error: any) {
        handleError(error, isEdit ? 'updateTask' : 'createTask');
      }
    }
  });

  // Load existing task data for edit mode
  useEffect(() => {
    if (isEdit && id && !originalData) {
      const existingTask = getTaskById(id);
      if (existingTask) {
        const taskData = {
          title: existingTask.title,
          description: existingTask.description,
          status: existingTask.status,
          priority: existingTask.priority,
          dueDate: existingTask.dueDate,
          tags: existingTask.tags || []
        };
        form.setValue('title', taskData.title);
        form.setValue('description', taskData.description);
        form.setValue('status', taskData.status);
        form.setValue('priority', taskData.priority);
        form.setValue('dueDate', taskData.dueDate);
        form.setValue('tags', taskData.tags);
        setOriginalData(taskData);
      } else {
        navigate("/tasks");
      }
    }
  }, [isEdit, id, originalData, getTaskById, navigate, form]);

  const hasChanges = useMemo(() => {
    if (!isEdit || !originalData) return true;
    
    return (
      form.values.title !== originalData.title ||
      form.values.description !== originalData.description ||
      form.values.status !== originalData.status ||
      form.values.priority !== originalData.priority ||
      form.values.dueDate !== originalData.dueDate ||
      JSON.stringify([...form.values.tags].sort()) !== JSON.stringify([...originalData.tags].sort())
    );
  }, [isEdit, originalData, form.values]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && !hasChanges) {
      navigate("/tasks");
      return;
    }
    
    await form.handleSubmit(e);
  }, [isEdit, hasChanges, navigate, form]);

  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && trimmedTag.length <= 30 && !form.values.tags.includes(trimmedTag)) {
      form.setValue('tags', [...form.values.tags, trimmedTag]);
      setNewTag("");
    }
  }, [newTag, form]);

  const removeTag = useCallback((tagToRemove: string) => {
    form.setValue('tags', form.values.tags.filter(tag => tag !== tagToRemove));
  }, [form]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const { pageTitle, metaDescription } = useMemo(() => ({
    pageTitle: isEdit ? t('taskForm.editTitle') : t('taskForm.createTitle'),
    metaDescription: isEdit 
      ? t('taskForm.editMetaDescription', { title: form.values.title })
      : t('taskForm.createMetaDescription')
  }), [isEdit, t, form.values.title]);

  const statusOptions = useMemo(() => [
    { value: "TODO", label: t('status.todo') },
    { value: "IN_PROGRESS", label: t('status.inProgress') },
    { value: "COMPLETED", label: t('status.completed') }
  ], [t]);

  const priorityOptions = useMemo(() => [
    { value: "LOW", label: t('priority.low') },
    { value: "MEDIUM", label: t('priority.medium') },
    { value: "HIGH", label: t('priority.high') }
  ], [t]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col overflow-x-hidden">
      <SEO 
        title={pageTitle} 
        description={metaDescription}
        keywords="task creation, task management, productivity, task details"
      />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex flex-1 relative h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={user?.username}
        />
        
        <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="rounded-xl w-auto min-w-[140px] px-3 h-9 font-medium mb-2 sm:mb-0">
                  <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t('taskForm.backToTasks')}</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isEdit ? t('taskForm.editTitle') : t('taskForm.createTitle')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isEdit ? t('taskForm.editSubtitle') : t('taskForm.createSubtitle')}
                </p>
              </div>
            </div>

            {/* Form */}
            <Card className="rounded-2xl border-border/50 shadow-soft">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  {t('taskForm.taskDetails')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium break-words hyphens-auto">
                      {t('taskForm.title')} *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder={t('taskForm.enterTitle')}
                      value={form.values.title}
                      onChange={(e) => form.setValue('title', e.target.value)}
                      onBlur={() => form.validateField('title')}
                      className={`rounded-2xl border-border/50 focus:border-primary/50 ${
                        form.errors.title ? 'border-destructive' : ''
                      }`}
                      required
                    />
                    {form.errors.title && (
                      <p className="text-sm text-destructive mt-1">{form.errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium break-words hyphens-auto">
                      {t('taskForm.description')}
                    </Label>
                    <Textarea
                      key={`description-${id || 'new'}`}
                      id="description"
                      placeholder={t('taskForm.descriptionPlaceholder')}
                      value={form.values.description}
                      onChange={(e) => form.setValue('description', e.target.value)}
                      onBlur={() => form.validateField('description')}
                      className={`rounded-2xl border-border/50 focus:border-primary/50 min-h-[100px] ${
                        form.errors.description ? 'border-destructive' : ''
                      }`}
                      rows={4}
                    />
                    {form.errors.description && (
                      <p className="text-sm text-destructive mt-1">{form.errors.description.message}</p>
                    )}
                  </div>

                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium break-words hyphens-auto">{t('taskForm.status')}</Label>
                      <Select 
                        value={form.values.status} 
                        onValueChange={(value) => form.setValue('status', value as any)}
                      >
                        <SelectTrigger className="rounded-2xl border-border/50">
                          <SelectValue placeholder={t('taskForm.selectStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium break-words hyphens-auto">{t('taskForm.priority')}</Label>
                      <Select 
                        value={form.values.priority} 
                        onValueChange={(value) => form.setValue('priority', value as any)}
                      >
                        <SelectTrigger className="rounded-2xl border-border/50">
                          <SelectValue placeholder={t('taskForm.selectPriority')} />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-medium break-words hyphens-auto">
                      {t('taskForm.dueDate')} *
                    </Label>
                    <DateInput
                      id="dueDate"
                      value={form.values.dueDate}
                      onChange={(value) => form.setValue('dueDate', value)}
                      className={form.errors.dueDate ? 'border-destructive' : ''}
                      required
                      placeholder={t('taskForm.selectDate')}
                    />
                    {form.errors.dueDate && (
                      <p className="text-sm text-destructive mt-1">{form.errors.dueDate.message}</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium break-words hyphens-auto">
                      {t('taskForm.tags')}
                    </Label>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="tags"
                          type="text"
                          placeholder={t('taskForm.addTagPlaceholder')}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          maxLength={30}
                          className="rounded-2xl border-border/50 focus:border-primary/50"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="default"
                          className="rounded-2xl w-full sm:w-auto sm:min-w-[120px] sm:px-4 h-10 font-medium"
                        >
                          <span className="whitespace-nowrap">{t('taskForm.addTag')}</span>
                        </Button>
                      </div>
                      
                      {form.values.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {form.values.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full px-3 py-1 text-xs"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/50">
                    <Button
                      type="submit"
                      className="flex-1 rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-medium shadow-medium hover:shadow-large transition-all duration-300 px-3"
                      disabled={form.isSubmitting || !form.isValid}
                    >
                      <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {form.isSubmitting 
                          ? (isEdit ? t('taskForm.updating') : t('taskForm.creating')) 
                          : (isEdit ? t('taskForm.updateButton') : t('taskForm.createButton'))
                        }
                      </span>
                    </Button>
                    
                    <Link to="/tasks" className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-medium px-3"
                      >
                        <span className="whitespace-nowrap">{t('taskForm.cancel')}</span>
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTask;