import { Package, MapPin, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed';
  scheduledTime: string;
  deliveredTime?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-2024-001',
    customer: 'Ahmed Hassan',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    driver: 'Karim Rahman',
    status: 'in-transit',
    scheduledTime: '2024-01-20 09:00 AM',
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-2024-002',
    customer: 'Fatima Khan',
    address: 'Flat 3B, Gulshan Avenue, Dhaka',
    driver: 'Rahim Ali',
    status: 'delivered',
    scheduledTime: '2024-01-20 08:30 AM',
    deliveredTime: '2024-01-20 08:45 AM',
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-2024-003',
    customer: 'Mohammad Islam',
    address: 'House 45, Banani DOHS, Dhaka',
    driver: 'Jamal Uddin',
    status: 'pending',
    scheduledTime: '2024-01-20 10:00 AM',
  },
  {
    id: 'DEL-004',
    orderId: 'ORD-2024-004',
    customer: 'Nusrat Jahan',
    address: 'Apartment 7C, Bashundhara, Dhaka',
    driver: 'Selim Ahmed',
    status: 'assigned',
    scheduledTime: '2024-01-20 11:00 AM',
  },
  {
    id: 'DEL-005',
    orderId: 'ORD-2024-005',
    customer: 'Rafiq Hossain',
    address: 'House 89, Uttara Sector 10, Dhaka',
    driver: 'Abdul Karim',
    status: 'failed',
    scheduledTime: '2024-01-20 07:00 AM',
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' as const },
  assigned: { label: 'Assigned', icon: Package, variant: 'default' as const },
  'in-transit': { label: 'In Transit', icon: Truck, variant: 'default' as const },
  delivered: { label: 'Delivered', icon: CheckCircle, variant: 'default' as const },
  failed: { label: 'Failed', icon: XCircle, variant: 'destructive' as const },
};

export default function Delivery() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = [
    {
      title: 'Pending Deliveries',
      value: mockDeliveries.filter((d) => d.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'In Transit',
      value: mockDeliveries.filter((d) => d.status === 'in-transit').length,
      icon: Truck,
      color: 'text-blue-500',
    },
    {
      title: 'Delivered Today',
      value: mockDeliveries.filter((d) => d.status === 'delivered').length,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Failed',
      value: mockDeliveries.filter((d) => d.status === 'failed').length,
      icon: XCircle,
      color: 'text-red-500',
    },
  ];

  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.delivery')}</h1>
        <p className="text-muted-foreground">Manage and track all deliveries</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery List</CardTitle>
          <CardDescription>View and manage all delivery orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search by customer, order, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => {
                  const config = statusConfig[delivery.status];
                  const StatusIcon = config.icon;
                  return (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.orderId}</TableCell>
                      <TableCell>{delivery.customer}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                      <TableCell>{delivery.driver}</TableCell>
                      <TableCell>{delivery.scheduledTime}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
