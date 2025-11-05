import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Tag,
  Calendar,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "inactive";
}

const Coupons = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
    status: "active" as "active" | "expired" | "inactive",
  });

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "SUMMER2024",
      description: "Summer Sale 20% Off",
      type: "percentage",
      value: 20,
      minAmount: 50,
      maxDiscount: 100,
      usageLimit: 100,
      usedCount: 45,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "active",
    },
    {
      id: "2",
      code: "WELCOME10",
      description: "Welcome Discount $10",
      type: "fixed",
      value: 10,
      minAmount: 30,
      usageLimit: 500,
      usedCount: 234,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
    },
    {
      id: "3",
      code: "NEWYEAR50",
      description: "New Year Special 50% Off",
      type: "percentage",
      value: 50,
      minAmount: 100,
      maxDiscount: 200,
      usageLimit: 50,
      usedCount: 50,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "expired",
    },
  ]);

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    expired: coupons.filter((c) => c.status === "expired").length,
    totalUsed: coupons.reduce((sum, c) => sum + c.usedCount, 0),
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minAmount: coupon.minAmount,
        maxDiscount: coupon.maxDiscount || 0,
        usageLimit: coupon.usageLimit,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        minAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        startDate: "",
        endDate: "",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id ? { ...c, ...formData } : c
        )
      );
      toast({ title: "Coupon updated successfully" });
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        ...formData,
        usedCount: 0,
      };
      setCoupons([...coupons, newCoupon]);
      toast({ title: "Coupon created successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast({ title: "Coupon deleted successfully" });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Coupon code copied to clipboard" });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      expired: "secondary",
      inactive: "outline",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Used</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">
                    {coupon.code}
                  </TableCell>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.type === "percentage" ? "Percentage" : "Fixed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `$${coupon.value}`}
                  </TableCell>
                  <TableCell>
                    {coupon.usedCount} / {coupon.usageLimit}
                  </TableCell>
                  <TableCell className="text-sm">
                    {coupon.startDate} to {coupon.endDate}
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to {editingCoupon ? "update" : "create"} a
              coupon
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SUMMER2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Summer Sale 20% Off"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min Order Amount ($)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCoupon ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
