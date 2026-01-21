import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MessageSquare,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  type: "email" | "sms";
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  status: "active" | "draft";
}

const Marketing = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");

  // Mock data
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Welcome Email",
      type: "email",
      category: "welcome",
      subject: "Welcome to our store, {{name}}!",
      content:
        "Dear {{name}},\n\nThank you for joining us! We're excited to have you on board.\n\nYour account has been successfully created.\n\nBest regards,\nThe Team",
      variables: ["name"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Birthday Wishes",
      type: "email",
      category: "birthday",
      subject: "Happy Birthday {{name}}! 🎉",
      content:
        "Happy Birthday {{name}}!\n\nTo celebrate your special day, here's a {{discount}}% discount code: {{code}}\n\nValid until {{expiry_date}}\n\nEnjoy your day!\n\nBest wishes,\nThe Team",
      variables: ["name", "discount", "code", "expiry_date"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-20",
      status: "active",
    },
    {
      id: "3",
      name: "Promotion SMS",
      type: "sms",
      category: "promotion",
      content:
        "Hi {{name}}! {{promotion_text}}. Use code: {{code}}. Valid till {{expiry_date}}. Shop now!",
      variables: ["name", "promotion_text", "code", "expiry_date"],
      createdAt: "2024-02-01",
      updatedAt: "2024-02-01",
      status: "active",
    },
    {
      id: "4",
      name: "Order Confirmation SMS",
      type: "sms",
      category: "order",
      content:
        "Hi {{name}}, your order #{{order_id}} has been confirmed. Total: {{amount}}. Track: {{tracking_url}}",
      variables: ["name", "order_id", "amount", "tracking_url"],
      createdAt: "2024-02-05",
      updatedAt: "2024-02-05",
      status: "active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "email" as "email" | "sms",
    category: "",
    subject: "",
    content: "",
    status: "active" as "active" | "draft",
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const categories = [
    { value: "welcome", label: "Welcome" },
    { value: "birthday", label: "Birthday" },
    { value: "promotion", label: "Promotion" },
    { value: "order", label: "Order Confirmation" },
    { value: "shipping", label: "Shipping Update" },
    { value: "abandoned", label: "Abandoned Cart" },
    { value: "newsletter", label: "Newsletter" },
    { value: "feedback", label: "Feedback Request" },
  ];

  const commonVariables = [
    "{{name}}",
    "{{email}}",
    "{{phone}}",
    "{{order_id}}",
    "{{amount}}",
    "{{discount}}",
    "{{code}}",
    "{{date}}",
    "{{expiry_date}}",
    "{{tracking_url}}",
  ];

  const filteredTemplates = templates.filter(
    (template) =>
      template.type === activeTab &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const stats = {
    totalEmail: templates.filter((t) => t.type === "email").length,
    totalSMS: templates.filter((t) => t.type === "sms").length,
    active: templates.filter((t) => t.status === "active").length,
    draft: templates.filter((t) => t.status === "draft").length,
  };

  const handleCreateTemplate = () => {
    const finalCategory = isCustomCategory
      ? customCategoryInput
      : formData.category;

    if (!finalCategory) {
      toast({
        title: "Error",
        description: "Please enter a category",
        variant: "destructive",
      });
      return;
    }

    const variables = extractVariables(formData.content);
    const newTemplate: Template = {
      id: Date.now().toString(),
      ...formData,
      category: finalCategory,
      variables,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTemplates([...templates, newTemplate]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Template created successfully",
    });
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;

    const finalCategory = isCustomCategory
      ? customCategoryInput
      : formData.category;

    if (!finalCategory) {
      toast({
        title: "Error",
        description: "Please enter a category",
        variant: "destructive",
      });
      return;
    }

    const variables = extractVariables(formData.content);
    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              ...formData,
              category: finalCategory,
              variables,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : t,
      ),
    );
    setIsEditDialogOpen(false);
    setSelectedTemplate(null);
    resetForm();
    toast({
      title: "Success",
      description: "Template updated successfully",
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Template deleted successfully",
    });
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTemplates([...templates, newTemplate]);
    toast({
      title: "Success",
      description: "Template duplicated successfully",
    });
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = text.matchAll(regex);
    return Array.from(new Set(Array.from(matches, (m) => m[1])));
  };

  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + variable,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "email",
      category: "",
      subject: "",
      content: "",
      status: "active",
    });
    setIsCustomCategory(false);
    setCustomCategoryInput("");
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setIsCustomCategory(false);
      setCustomCategoryInput("");
      setFormData({ ...formData, category: value });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setFormData((prev) => ({ ...prev, type: activeTab }));
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template);
    const isExistingCategory = categories.some(
      (cat) => cat.value === template.category,
    );
    setIsCustomCategory(!isExistingCategory);
    setCustomCategoryInput(!isExistingCategory ? template.category : "");
    setFormData({
      name: template.name,
      type: template.type,
      category: isExistingCategory ? template.category : "custom",
      subject: template.subject || "",
      content: template.content,
      status: template.status,
    });
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>{t("nav.marketing") || "Marketing"}</CardTitle>
        <CardDescription>
          Manage SMS and email templates for various occasions
        </CardDescription>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Templates
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{stats.totalEmail}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Templates</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{stats.totalSMS}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl ">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Management */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Create and manage reusable templates for customer communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "email" | "sms")}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Templates
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS Templates
                </TabsTrigger>
              </TabsList>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <TabsContent value="email" className="m-0">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Variables</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {template.subject}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {template.variables.slice(0, 3).map((v) => (
                              <Badge
                                key={v}
                                variant="secondary"
                                className="text-xs"
                              >
                                {v}
                              </Badge>
                            ))}
                            {template.variables.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.variables.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              template.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{template.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPreviewDialog(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateTemplate(template)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sms" className="m-0">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Variables</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {template.content}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {template.variables.slice(0, 3).map((v) => (
                              <Badge
                                key={v}
                                variant="secondary"
                                className="text-xs"
                              >
                                {v}
                              </Badge>
                            ))}
                            {template.variables.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.variables.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              template.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{template.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPreviewDialog(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateTemplate(template)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable {formData.type} template with dynamic variables
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      + Add Custom Category
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isCustomCategory && (
                  <Input
                    placeholder="Enter custom category name"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {formData.type === "email" && (
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g., Welcome to {{name}}!"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder={
                  formData.type === "email"
                    ? "Dear {{name}},\n\nYour content here..."
                    : "Hi {{name}}, your message here..."
                }
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                Character count: {formData.content.length}
                {formData.type === "sms" && " / 160 (recommended)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Insert Variables</Label>
              <div className="flex flex-wrap gap-2">
                {commonVariables.map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "draft") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your {formData.type} template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      + Add Custom Category
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isCustomCategory && (
                  <Input
                    placeholder="Enter custom category name"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {formData.type === "email" && (
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Email Subject</Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                Character count: {formData.content.length}
                {formData.type === "sms" && " / 160 (recommended)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Insert Variables</Label>
              <div className="flex flex-wrap gap-2">
                {commonVariables.map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "draft") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTemplate}>Update Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} - {selectedTemplate?.category}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Badge>{selectedTemplate.type.toUpperCase()}</Badge>
              </div>
              {selectedTemplate.type === "email" && (
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedTemplate.subject}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Content</Label>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedTemplate.content}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Variables Used</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Metadata</Label>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {selectedTemplate.createdAt}</p>
                  <p>Last Updated: {selectedTemplate.updatedAt}</p>
                  <p>Status: {selectedTemplate.status}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketing;
