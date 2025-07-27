import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SEO from "@/components/SEO";
import { useTaskContext } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addTask, updateTask, getTaskById } = useTaskContext();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as "todo" | "in-progress" | "completed",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);

  // Load existing task data for edit mode (only once)
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
        setFormData(taskData);
        setOriginalData(taskData);
      } else {
        navigate("/tasks");
      }
    }
  }, [isEdit, id, originalData, getTaskById, navigate]);

  const hasChanges = useMemo(() => {
    if (!isEdit || !originalData) return true;
    
    return (
      formData.title !== originalData.title ||
      formData.description !== originalData.description ||
      formData.status !== originalData.status ||
      formData.priority !== originalData.priority ||
      formData.dueDate !== originalData.dueDate ||
      JSON.stringify([...formData.tags].sort()) !== JSON.stringify([...originalData.tags].sort())
    );
  }, [isEdit, originalData, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && !hasChanges) {
      navigate("/tasks");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        const existingTask = getTaskById(id);
        if (existingTask) {
          await updateTask({ ...existingTask, ...formData });
        }
      } else {
        await addTask(formData);
      }
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Failed to save task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isEdit, hasChanges, formData, id, getTaskById, updateTask, addTask, navigate]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setNewTag("");
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const { pageTitle, metaDescription } = useMemo(() => ({
    pageTitle: isEdit ? t('taskForm.editTitle') : t('taskForm.createTitle'),
    metaDescription: isEdit 
      ? t('taskForm.editMetaDescription', { title: formData.title })
      : t('taskForm.createMetaDescription')
  }), [isEdit, t, formData.title]);

  const statusOptions = useMemo(() => [
    { value: "todo", label: t('status.todo') },
    { value: "in-progress", label: t('status.inProgress') },
    { value: "completed", label: t('status.completed') }
  ], [t]);

  const priorityOptions = useMemo(() => [
    { value: "low", label: t('priority.low') },
    { value: "medium", label: t('priority.medium') },
    { value: "high", label: t('priority.high') }
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
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
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
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="rounded-2xl border-border/50 focus:border-primary/50"
                      required
                    />
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
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="rounded-2xl border-border/50 focus:border-primary/50 min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium break-words hyphens-auto">{t('taskForm.status')}</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleInputChange("status", value)}
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
                        value={formData.priority} 
                        onValueChange={(value) => handleInputChange("priority", value)}
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
                      value={formData.dueDate}
                      onChange={(value) => handleInputChange("dueDate", value)}
                      required
                      placeholder={t('taskForm.selectDate')}
                    />
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
                      
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
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
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {isLoading 
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