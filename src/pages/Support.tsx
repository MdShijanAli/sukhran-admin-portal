import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customer: string;
  email: string;
  subject: string;
  category: 'order' | 'delivery' | 'payment' | 'product' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  description: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TICK-2024-001',
    customer: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    subject: 'Order not delivered on time',
    category: 'delivery',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-20 09:30 AM',
    updatedAt: '2024-01-20 09:30 AM',
    description: 'My order was supposed to be delivered this morning but I have not received it yet.',
  },
  {
    id: '2',
    ticketNumber: 'TICK-2024-002',
    customer: 'Fatima Khan',
    email: 'fatima@example.com',
    subject: 'Payment failed but amount deducted',
    category: 'payment',
    priority: 'urgent',
    status: 'in-progress',
    createdAt: '2024-01-20 08:15 AM',
    updatedAt: '2024-01-20 09:00 AM',
    assignedTo: 'Support Agent 1',
    description: 'I tried to make a payment but it failed. However, the amount was deducted from my account.',
  },
  {
    id: '3',
    ticketNumber: 'TICK-2024-003',
    customer: 'Mohammad Islam',
    email: 'mohammad@example.com',
    subject: 'Product quality issue',
    category: 'product',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2024-01-19 03:45 PM',
    updatedAt: '2024-01-20 10:30 AM',
    assignedTo: 'Support Agent 2',
    description: 'The milk I received today was not fresh. The expiry date seems incorrect.',
  },
  {
    id: '4',
    ticketNumber: 'TICK-2024-004',
    customer: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    subject: 'Cannot login to account',
    category: 'account',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-01-19 02:20 PM',
    updatedAt: '2024-01-19 04:15 PM',
    assignedTo: 'Support Agent 1',
    description: 'I am unable to login to my account. The password reset link is not working.',
  },
  {
    id: '5',
    ticketNumber: 'TICK-2024-005',
    customer: 'Rafiq Hossain',
    email: 'rafiq@example.com',
    subject: 'Wrong items in order',
    category: 'order',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-19 11:30 AM',
    updatedAt: '2024-01-19 11:30 AM',
    description: 'I received 1L milk instead of 500ml milk that I ordered.',
  },
  {
    id: '6',
    ticketNumber: 'TICK-2024-006',
    customer: 'Shahana Begum',
    email: 'shahana@example.com',
    subject: 'Subscription cancellation query',
    category: 'account',
    priority: 'low',
    status: 'closed',
    createdAt: '2024-01-18 10:00 AM',
    updatedAt: '2024-01-19 09:00 AM',
    assignedTo: 'Support Agent 3',
    description: 'I want to know how to cancel my monthly subscription.',
  },
];

const categoryConfig = {
  order: { label: 'Order', color: 'bg-blue-500/10 text-blue-500' },
  delivery: { label: 'Delivery', color: 'bg-purple-500/10 text-purple-500' },
  payment: { label: 'Payment', color: 'bg-green-500/10 text-green-500' },
  product: { label: 'Product', color: 'bg-orange-500/10 text-orange-500' },
  account: { label: 'Account', color: 'bg-pink-500/10 text-pink-500' },
  other: { label: 'Other', color: 'bg-gray-500/10 text-gray-500' },
};

const priorityConfig = {
  low: { label: 'Low', variant: 'secondary' as const },
  medium: { label: 'Medium', variant: 'default' as const },
  high: { label: 'High', variant: 'default' as const },
  urgent: { label: 'Urgent', variant: 'destructive' as const },
};

const statusConfig = {
  open: { label: 'Open', icon: AlertCircle, variant: 'default' as const },
  'in-progress': { label: 'In Progress', icon: Clock, variant: 'default' as const },
  resolved: { label: 'Resolved', icon: CheckCircle, variant: 'default' as const },
  closed: { label: 'Closed', icon: CheckCircle, variant: 'secondary' as const },
};

export default function Support() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const stats = [
    {
      title: 'Open Tickets',
      value: mockTickets.filter((t) => t.status === 'open').length,
      icon: AlertCircle,
      color: 'text-yellow-500',
    },
    {
      title: 'In Progress',
      value: mockTickets.filter((t) => t.status === 'in-progress').length,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      title: 'Resolved Today',
      value: mockTickets.filter((t) => t.status === 'resolved').length,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Total Tickets',
      value: mockTickets.length,
      icon: MessageSquare,
      color: 'text-purple-500',
    },
  ];

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    toast({
      title: 'Success',
      description: `Ticket status updated to ${newStatus}`,
    });
  };

  const handleAssignTicket = (ticketId: string, agent: string) => {
    toast({
      title: 'Success',
      description: `Ticket assigned to ${agent}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.support')}</h1>
        <p className="text-muted-foreground">Manage customer support tickets and inquiries</p>
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
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage all customer support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, ticket number, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => {
                  const category = categoryConfig[ticket.category];
                  const priority = priorityConfig[ticket.priority];
                  const status = statusConfig[ticket.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{ticket.customer}</span>
                          <span className="text-xs text-muted-foreground">{ticket.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="truncate">{ticket.subject}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={category.color} variant="secondary">
                          {category.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priority.variant}>{priority.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.createdAt}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{ticket.assignedTo || 'Unassigned'}</span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Ticket Details - {ticket.ticketNumber}</DialogTitle>
                              <DialogDescription>
                                View and manage ticket information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Customer</Label>
                                  <p className="text-sm">{ticket.customer}</p>
                                  <p className="text-xs text-muted-foreground">{ticket.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Created At</Label>
                                  <p className="text-sm">{ticket.createdAt}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Subject</Label>
                                <p className="text-sm">{ticket.subject}</p>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <p className="text-sm text-muted-foreground">
                                  {ticket.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Category</Label>
                                  <Badge className={`mt-1 ${categoryConfig[ticket.category].color}`} variant="secondary">
                                    {categoryConfig[ticket.category].label}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Priority</Label>
                                  <Badge className="mt-1" variant={priorityConfig[ticket.priority].variant}>
                                    {priorityConfig[ticket.priority].label}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <Badge className="mt-1 gap-1" variant={statusConfig[ticket.status].variant}>
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig[ticket.status].label}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Update Status</Label>
                                <Select
                                  defaultValue={ticket.status}
                                  onValueChange={(value) => handleUpdateStatus(ticket.id, value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Assign To</Label>
                                <Select
                                  defaultValue={ticket.assignedTo}
                                  onValueChange={(value) => handleAssignTicket(ticket.id, value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select agent" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Support Agent 1">Support Agent 1</SelectItem>
                                    <SelectItem value="Support Agent 2">Support Agent 2</SelectItem>
                                    <SelectItem value="Support Agent 3">Support Agent 3</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="response" className="text-sm font-medium">
                                  Add Response
                                </Label>
                                <Textarea
                                  id="response"
                                  placeholder="Type your response here..."
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button
                                  onClick={() => {
                                    toast({
                                      title: 'Success',
                                      description: 'Response sent to customer',
                                    });
                                  }}
                                >
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
