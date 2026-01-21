import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart,
  UtensilsCrossed,
  Image,
  Megaphone,
  FileText,
  Shield,
  BookOpen,
  CalendarDays,
  AlertTriangle,
  Bell,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Send,
  Archive,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useContentStore,
  ContentItem,
  ContentType,
  ContentStatus,
} from "@/stores/contentStore";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { ImageUpload } from "@/components/content/ImageUpload";
import { ContentAnalytics } from "@/components/content/ContentAnalytics";

const contentCategories = [
  {
    id: "health-tips",
    label: "Health Tips & Recipes",
    types: ["health-tip", "recipe"],
    icon: Heart,
  },
  {
    id: "banners",
    label: "Banners & Promos",
    types: ["banner", "promo"],
    icon: Image,
  },
  {
    id: "legal",
    label: "Terms & Privacy",
    types: ["terms", "privacy"],
    icon: Shield,
  },
  {
    id: "nutrition",
    label: "Nutrition & Meal Plans",
    types: ["nutrition-guide", "meal-plan"],
    icon: BookOpen,
  },
  {
    id: "notifications",
    label: "Emergency & Announcements",
    types: ["emergency", "announcement"],
    icon: Bell,
  },
];

const contentTypeLabels: Record<ContentType, string> = {
  "health-tip": "Health Tip",
  recipe: "Recipe",
  banner: "Banner",
  promo: "Promotional",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  "nutrition-guide": "Nutrition Guide",
  "meal-plan": "Meal Plan",
  emergency: "Emergency",
  announcement: "Announcement",
};

const getStatusBadgeVariant = (status: ContentStatus) => {
  switch (status) {
    case "published":
      return "default";
    case "scheduled":
      return "secondary";
    case "draft":
      return "outline";
    case "archived":
      return "destructive";
    default:
      return "outline";
  }
};

const getPriorityBadgeVariant = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

export default function ContentManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    contents,
    addContent,
    updateContent,
    deleteContent,
    publishContent,
    archiveContent,
    duplicateContent,
    getAnalytics,
  } = useContentStore();

  const [activeTab, setActiveTab] = useState("health-tips");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const [formData, setFormData] = useState({
    type: "" as ContentType,
    title: "",
    content: "",
    image: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    tags: "",
    linkUrl: "",
    scheduleDate: "",
    expiryDate: "",
  });

  const currentCategory = contentCategories.find((c) => c.id === activeTab);
  const filteredContents = contents.filter((item) => {
    const matchesCategory = currentCategory?.types.includes(item.type);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      type: (currentCategory?.types[0] as ContentType) || "health-tip",
      title: "",
      content: "",
      image: "",
      priority: "medium",
      tags: "",
      linkUrl: "",
      scheduleDate: "",
      expiryDate: "",
    });
    setIsScheduling(false);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedContent(null);
    resetForm();
    setFormData((prev) => ({
      ...prev,
      type: (currentCategory?.types[0] as ContentType) || "health-tip",
    }));
    setIsDialogOpen(true);
  };

  const handleEdit = (content: ContentItem) => {
    setIsEditing(true);
    setSelectedContent(content);
    setFormData({
      type: content.type,
      title: content.title,
      content: content.content,
      image: content.image || "",
      priority: content.priority || "medium",
      tags: content.tags?.join(", ") || "",
      linkUrl: content.linkUrl || "",
      scheduleDate: content.scheduleDate || "",
      expiryDate: content.expiryDate || "",
    });
    setIsScheduling(!!content.scheduleDate);
    setIsDialogOpen(true);
  };

  const handlePreview = (content: ContentItem) => {
    setSelectedContent(content);
    setIsPreviewOpen(true);
  };

  const handleAnalytics = (content: ContentItem) => {
    setSelectedContent(content);
    setIsAnalyticsOpen(true);
  };

  const handleDelete = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContent) {
      deleteContent(selectedContent.id);
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedContent(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const contentData = {
      type: formData.type,
      title: formData.title,
      content: formData.content,
      image: formData.image || undefined,
      priority: formData.priority,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : undefined,
      linkUrl: formData.linkUrl || undefined,
      scheduleDate: isScheduling ? formData.scheduleDate : undefined,
      expiryDate: formData.expiryDate || undefined,
      status: (isScheduling ? "scheduled" : "draft") as ContentStatus,
      author: "Admin User",
    };

    if (isEditing && selectedContent) {
      updateContent(selectedContent.id, contentData);
      toast({
        title: "Content Updated",
        description: "The content has been successfully updated.",
      });
    } else {
      addContent(contentData);
      toast({
        title: "Content Created",
        description: "The content has been successfully created.",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handlePublish = (content: ContentItem) => {
    publishContent(content.id);
    toast({
      title: "Content Published",
      description: "The content is now live.",
    });
  };

  const handleArchive = (content: ContentItem) => {
    archiveContent(content.id);
    toast({
      title: "Content Archived",
      description: "The content has been archived.",
    });
  };

  const handleDuplicate = (content: ContentItem) => {
    duplicateContent(content.id);
    toast({
      title: "Content Duplicated",
      description: "A copy has been created as a draft.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl  text-foreground">{t("nav.content")}</h1>
        <p className="text-muted-foreground mt-1">
          Manage all app content including health tips, banners, legal
          documents, and notifications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {contentCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              <span className="hidden md:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {contentCategories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-primary" />
                      {category.label}
                    </CardTitle>
                    <CardDescription>
                      Manage {category.label.toLowerCase()} content
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      {category.id === "notifications" && (
                        <TableHead>Priority</TableHead>
                      )}
                      <TableHead>Author</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No content found. Create your first content.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContents.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {content.image && (
                                <img
                                  src={content.image}
                                  alt={content.title}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">{content.title}</p>
                                {content.tags && content.tags.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {content.tags.slice(0, 2).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {contentTypeLabels[content.type]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(content.status)}
                            >
                              {content.status}
                            </Badge>
                            {content.scheduleDate &&
                              content.status === "scheduled" && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {content.scheduleDate}
                                </p>
                              )}
                          </TableCell>
                          {category.id === "notifications" && (
                            <TableCell>
                              {content.priority && (
                                <Badge
                                  variant={getPriorityBadgeVariant(
                                    content.priority,
                                  )}
                                >
                                  {content.priority}
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-muted-foreground">
                            {content.author}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {content.updatedAt}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAnalytics(content)}
                                title="Analytics"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePreview(content)}
                                title="Preview"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(content)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDuplicate(content)}
                                title="Duplicate"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              {content.status !== "published" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePublish(content)}
                                  title="Publish"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                              {content.status === "published" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleArchive(content)}
                                  title="Archive"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(content)}
                                className="text-destructive hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Content" : "Create New Content"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditing ? "update" : "create"}{" "}
              your content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as ContentType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory?.types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {contentTypeLabels[type as ContentType]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === "notifications" && (
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                placeholder="Enter content body"
              />
            </div>

            {activeTab !== "legal" && (
              <ImageUpload
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
              />
            )}

            {activeTab === "banners" && (
              <>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    placeholder="Enter destination URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {(activeTab === "health-tips" || activeTab === "nutrition") && (
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="health, nutrition, tips"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isScheduling}
                  onCheckedChange={setIsScheduling}
                />
                <Label>Schedule for later</Label>
              </div>
              {isScheduling && (
                <Input
                  type="datetime-local"
                  value={formData.scheduleDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduleDate: e.target.value })
                  }
                  className="w-auto"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Update" : "Create"} Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              {selectedContent.image && (
                <img
                  src={selectedContent.image}
                  alt={selectedContent.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedContent.status)}>
                  {selectedContent.status}
                </Badge>
                <Badge variant="secondary">
                  {contentTypeLabels[selectedContent.type]}
                </Badge>
                {selectedContent.priority && (
                  <Badge
                    variant={getPriorityBadgeVariant(selectedContent.priority)}
                  >
                    {selectedContent.priority}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl ">{selectedContent.title}</h2>
              <div
                className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: selectedContent.content }}
              />
              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {selectedContent.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {selectedContent.linkUrl && (
                <div className="flex items-center gap-2 text-primary">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={selectedContent.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedContent.linkUrl}
                  </a>
                </div>
              )}
              <div className="text-sm text-muted-foreground pt-4 border-t">
                <p>Author: {selectedContent.author}</p>
                <p>Created: {selectedContent.createdAt}</p>
                <p>Last Updated: {selectedContent.updatedAt}</p>
                {selectedContent.publishDate && (
                  <p>Published: {selectedContent.publishDate}</p>
                )}
                {selectedContent.expiryDate && (
                  <p>Expires: {selectedContent.expiryDate}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedContent?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Content Analytics
            </DialogTitle>
            <DialogDescription>
              Performance metrics for "{selectedContent?.title}"
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <ContentAnalytics
              content={selectedContent}
              analytics={getAnalytics(selectedContent.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
