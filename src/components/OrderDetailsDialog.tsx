import { Order } from '@/stores/orderStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, Phone, Calendar, CreditCard, Truck } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'processing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order Details</DialogTitle>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <DialogDescription>Order ID: {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Customer Information</span>
              </div>
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {order.customerPhone}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Order Date</span>
              </div>
              <p className="font-medium">
                {new Date(order.orderDate).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Order Items</span>
            </div>
            <p className="font-medium">{order.items}</p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Payment Method</span>
              </div>
              <Badge variant="outline">{order.paymentMethod}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Delivery Agent</span>
              </div>
              <p className="font-medium">
                {order.deliveryAgent || (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="gradient-primary bg-clip-text text-transparent">
              ৳{order.total}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
