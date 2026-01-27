import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  FileText,
  User,
  ShoppingBag,
  User2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import supportService from "@/services/supportService";
import userService from "@/services/userService";
import { ComboboxSelect } from "@/components/custom/ComboboxSelect";
import ViewOrderDetailsModal from "../orders/modal/ViewModal";
import { useUserStore } from "@/stores/userStore";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  image_url?: string;
}

interface Order {
  id: string;
  orderId: string;
  status?: string;
  grandTotal?: number;
}

interface OrderDetails {
  id: number;
  orderId: string;
  status: string;
  grandTotal: number;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function CreateSupport() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userstore = useUserStore()

  // Form state
  const [userId, setUserId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Selected details
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      fetchOrders(selectedUser);
    }
  }, [selectedUser]);

  const fetchOrders = async (newUser: User) => {
    if (!newUser) {
      toast.error(t("support.create.selectCustomerFirst"));
      return;
    }
    setIsLoadingOrders(true);
    try {
      const response = await supportService.getOrdersList(
        newUser.mobile || newUser.email,
      );
      const data = response as any;
      console.log("Orders data:", data.data.orders);
      setOrders(data?.data?.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(t("support.create.failedToLoadOrders"));
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUserSelect = async (user: User) => {
    setUserId(user.id.toString());
    setSelectedUser(user);
    setIsLoadingUserDetails(true);

    try {
      const response = await userService.fetchDetails(user.id);
      const data = response as any;
      setSelectedUser(data?.data || user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  const handleOrderSelect = async (order: Order) => {
    setOrderId(order.id);
    setSelectedOrder(order);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Validate each file size (10MB)
      const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        toast.error(t("support.create.fileSizeError"));
        return;
      }
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById(
      "attachments",
    ) as HTMLInputElement;
    if (fileInput && attachments.length === 1) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    if (!userId) {
      toast.error(t("support.validation.userRequired"));
      return false;
    }
    if (!category) {
      toast.error(t("support.validation.categoryRequired"));
      return false;
    }
    if (!subject.trim()) {
      toast.error(t("support.validation.subjectRequired"));
      return false;
    }
    if (!description.trim()) {
      toast.error(t("support.validation.descriptionRequired"));
      return false;
    }
    if (description.trim().length < 10) {
      toast.error(t("support.validation.descriptionMinLength"));
      return false;
    }
    if (!priority) {
      toast.error(t("support.validation.priorityRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      if (selectedOrder) formData.append("order_id", selectedOrder.id);
      formData.append("category", category);
      formData.append("subject", subject.trim());
      formData.append("description", description.trim());
      formData.append("priority", priority);
      attachments.forEach((file) => {
        formData.append("attachments[]", file);
      });

      await supportService.storeItem(formData);
      toast.success(t("support.messages.created"));
      navigate("/support");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(
        error.response.data.message || t("support.messages.failedToCreate"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/support")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>{t("support.create.title")}</CardTitle>
            <CardDescription>{t("support.create.subtitle")}</CardDescription>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-3">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("support.create.customerInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="user">
                    {t("support.create.selectCustomer")} *
                  </Label>
                  <div className="mt-2">
                    <ComboboxSelect<User>
                      service={userService}
                      store={userstore}
                      additionalParams={{ role_id: "1" }}
                      storeDataKey="users"
                      enableApiSearch={true}
                      value={userId}
                      onValueChange={(value) => setUserId(value.toString())}
                      onSelect={handleUserSelect}
                      placeholder={t("support.create.searchCustomer")}
                      searchPlaceholder={t(
                        "support.create.searchCustomerPlaceholder",
                      )}
                      emptyText={t("support.create.noCustomerFound")}
                      getOptionValue={(user) => user.id}
                      getOptionLabel={(user) =>
                        `${user.firstName} ${user.lastName}`
                      }
                      renderOption={(user) => (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.mobile}
                          </span>
                        </div>
                      )}
                      icon={
                        <User2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      }
                    />
                  </div>
                </div>

                {selectedUser && (
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 space-y-3">
                    <div className="flex items-center gap-4 pb-3 border-b">
                      {selectedUser.image_url ? (
                        <img
                          src={selectedUser.image_url}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          className="w-16 h-16 rounded-full object-cover object-top border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl  shadow-md">
                          {selectedUser.firstName?.[0]?.toUpperCase()}
                          {selectedUser.lastName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("support.create.selectedCustomer")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          {t("support.create.email")}
                        </p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          {t("support.create.mobile")}
                        </p>
                        <p className="font-medium">{selectedUser.mobile}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Selection (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t("support.create.orderInfo")}{" "}
                  <Badge variant="secondary" className="ml-2">
                    {t("support.create.optional")}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="order">
                    {t("support.create.selectOrder")}
                  </Label>
                  <div className="mt-2">
                    <ComboboxSelect
                      options={orders}
                      value={orderId}
                      onValueChange={(value) => setOrderId(value.toString())}
                      onSelect={handleOrderSelect}
                      placeholder={t("support.create.searchOrder")}
                      searchPlaceholder={t(
                        "support.create.searchOrderPlaceholder",
                      )}
                      emptyText={t("support.create.noOrderFound")}
                      isLoading={isLoadingOrders}
                      getOptionValue={(order) => order.id}
                      getOptionLabel={(order) => order.orderId}
                      renderOption={(order) => (
                        <span className="font-mono">
                          {order.orderId} {` - ৳${order.grandTotal}`}
                        </span>
                      )}
                      icon={
                        <ShoppingBag className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      }
                      disabled={!selectedUser}
                    />
                  </div>
                </div>

                {selectedOrder && (
                  <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
                    <div className="grid grid-cols-3 justify-between items-center text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {t("support.create.orderStatus")}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("support.create.orderTotal")}
                        </p>
                        <p className=" text-lg">৳{selectedOrder.grandTotal}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="default"
                          onClick={() => setShowOrderDetails(true)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          <span>{t("viewDetails")}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t("support.create.ticketDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="category">
                      {t("support.create.category")} *
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-2">
                        <SelectValue
                          placeholder={t("support.create.categoryPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">
                          {t("support.tickets.category.delivery")}
                        </SelectItem>
                        <SelectItem value="payment">
                          {t("support.tickets.category.payment")}
                        </SelectItem>
                        <SelectItem value="product">
                          {t("support.tickets.category.product")}
                        </SelectItem>
                        <SelectItem value="account">
                          {t("support.tickets.category.account")}
                        </SelectItem>
                        <SelectItem value="order">
                          {t("support.tickets.category.order")}
                        </SelectItem>
                        <SelectItem value="return">
                          {t("support.tickets.category.return")}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("support.tickets.category.other")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">
                      {t("support.create.priority")} *
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="mt-2">
                        <SelectValue
                          placeholder={t("support.create.priorityPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">
                          {t("support.tickets.priority.urgent")}
                        </SelectItem>
                        <SelectItem value="high">
                          {t("support.tickets.priority.high")}
                        </SelectItem>
                        <SelectItem value="medium">
                          {t("support.tickets.priority.medium")}
                        </SelectItem>
                        <SelectItem value="low">
                          {t("support.tickets.priority.low")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">
                    {t("support.create.subject")} *
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("support.create.subjectPlaceholder")}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    {t("support.create.description")} *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("support.create.descriptionPlaceholder")}
                    rows={6}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>
                    {t("support.create.attachments")}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({t("support.create.optional")})
                    </span>
                  </Label>

                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label
                    htmlFor="attachments"
                    className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          {t("support.create.clickToUpload")}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("support.create.fileFormats")}
                      </p>
                      {attachments.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {attachments.length}{" "}
                          {t("support.create.filesSelected")}
                        </p>
                      )}
                    </div>
                    <input
                      id="attachments"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>{t("support.create.summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("support.create.customer")}
                    </span>
                    <span className="font-medium">
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("support.create.order")}
                    </span>
                    <span className="font-medium">
                      {selectedOrder ? selectedOrder.orderId : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("support.create.category")}
                    </span>
                    <span className="font-medium">
                      {category
                        ? t(`support.tickets.category.${category}`)
                        : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("support.create.priority")}
                    </span>
                    <span className="font-medium">
                      {priority
                        ? t(`support.tickets.priority.${priority}`)
                        : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("support.create.attachments")}
                    </span>
                    <Badge
                      variant={attachments.length > 0 ? "default" : "secondary"}
                    >
                      {attachments.length > 0
                        ? `${attachments.length} ${t("support.create.files")}`
                        : t("no")}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("creating") : t("support.create.submit")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/support")}
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Order Details Modal */}
      <ViewOrderDetailsModal
        open={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
        orderId={orderId}
      />
    </div>
  );
}
