import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Filter,
  RotateCcw,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Return {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  amount: number;
  reason: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "refunded";
  notes?: string;
  refundMethod?: string;
}

const Returns = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "refund" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");

  const [returns, setReturns] = useState<Return[]>([
    {
      id: "1",
      orderId: "ORD-2024-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Wireless Headphones",
      quantity: 1,
      amount: 129.99,
      reason: "Product defective - not charging properly",
      requestDate: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      orderId: "ORD-2024-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Smart Watch",
      quantity: 1,
      amount: 299.99,
      reason: "Changed mind - prefer different color",
      requestDate: "2024-01-14",
      status: "approved",
      notes: "Customer preferred black instead of white",
    },
    {
      id: "3",
      orderId: "ORD-2024-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      product: "Laptop Bag",
      quantity: 2,
      amount: 89.98,
      reason: "Wrong size ordered",
      requestDate: "2024-01-13",
      status: "refunded",
      refundMethod: "original",
      notes: "Refund processed to original payment method",
    },
    {
      id: "4",
      orderId: "ORD-2024-004",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      product: "Bluetooth Speaker",
      quantity: 1,
      amount: 79.99,
      reason: "Product not as described in listing",
      requestDate: "2024-01-12",
      status: "rejected",
      notes: "Product matches description, return not accepted",
    },
  ]);

  const stats = {
    total: returns.length,
    pending: returns.filter((r) => r.status === "pending").length,
    approved: returns.filter((r) => r.status === "approved").length,
    refunded: returns.filter((r) => r.status === "refunded").length,
    totalAmount: returns
      .filter((r) => r.status === "refunded")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch =
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (
    returnItem: Return,
    action: "approve" | "reject" | "refund"
  ) => {
    setSelectedReturn(returnItem);
    setActionType(action);
    setNotes("");
    setRefundMethod("original");
    setIsDialogOpen(true);
  };

  const handleAction = () => {
    if (!selectedReturn || !actionType) return;

    setReturns(
      returns.map((r) => {
        if (r.id === selectedReturn.id) {
          const updates: Partial<Return> = { notes };

          if (actionType === "approve") {
            updates.status = "approved";
          } else if (actionType === "reject") {
            updates.status = "rejected";
          } else if (actionType === "refund") {
            updates.status = "refunded";
            updates.refundMethod = refundMethod;
          }

          return { ...r, ...updates };
        }
        return r;
      })
    );

    toast({
      title: `Return ${actionType}d successfully`,
      description: `Return request #${selectedReturn.id} has been ${actionType}d`,
    });

    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle },
      rejected: { variant: "destructive" as const, icon: XCircle },
      refunded: { variant: "outline" as const, icon: DollarSign },
    };

    const { variant, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Returns & Refunds</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refunded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Refunded
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalAmount.toFixed(2)}
            </div>
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
                  placeholder="Search by order ID, customer, or product..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell className="font-medium">
                    {returnItem.orderId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{returnItem.customer}</div>
                      <div className="text-sm text-muted-foreground">
                        {returnItem.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{returnItem.product}</TableCell>
                  <TableCell>{returnItem.quantity}</TableCell>
                  <TableCell>${returnItem.amount.toFixed(2)}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={returnItem.reason}
                  >
                    {returnItem.reason}
                  </TableCell>
                  <TableCell>{returnItem.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {returnItem.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleOpenDialog(returnItem, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleOpenDialog(returnItem, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {returnItem.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenDialog(returnItem, "refund")}
                        >
                          Process Refund
                        </Button>
                      )}
                      {returnItem.notes && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title={returnItem.notes}
                        >
                          View Notes
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Return Request"}
              {actionType === "reject" && "Reject Return Request"}
              {actionType === "refund" && "Process Refund"}
            </DialogTitle>
            <DialogDescription>
              {selectedReturn && (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Order:</strong> {selectedReturn.orderId}
                  </div>
                  <div>
                    <strong>Customer:</strong> {selectedReturn.customer}
                  </div>
                  <div>
                    <strong>Product:</strong> {selectedReturn.product}
                  </div>
                  <div>
                    <strong>Amount:</strong> ${selectedReturn.amount.toFixed(2)}
                  </div>
                  <div>
                    <strong>Reason:</strong> {selectedReturn.reason}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {actionType === "refund" && (
              <div className="space-y-2">
                <Label htmlFor="refundMethod">Refund Method</Label>
                <Select value={refundMethod} onValueChange={setRefundMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">
                      Original Payment Method
                    </SelectItem>
                    <SelectItem value="store_credit">Store Credit</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or comments..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction}>
              Confirm {actionType?.charAt(0).toUpperCase()}
              {actionType?.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Returns;
