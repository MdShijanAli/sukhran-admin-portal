import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseTableList, Column } from "@/components/table";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "income",
    category: "Subscription",
    description: "Monthly subscription - Ahmed Hassan",
    amount: 2500,
    date: "2024-01-20",
    status: "completed",
    paymentMethod: "bKash",
  },
  {
    id: "TXN-002",
    type: "income",
    category: "Product Sale",
    description: "Fresh Milk 1L - Fatima Khan",
    amount: 85,
    date: "2024-01-20",
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "TXN-003",
    type: "expense",
    category: "Supplier Payment",
    description: "Dairy supplier monthly payment",
    amount: 45000,
    date: "2024-01-19",
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN-004",
    type: "income",
    category: "Subscription",
    description: "Weekly subscription - Mohammad Islam",
    amount: 850,
    date: "2024-01-19",
    status: "pending",
    paymentMethod: "Nagad",
  },
  {
    id: "TXN-005",
    type: "expense",
    category: "Operations",
    description: "Delivery vehicle fuel",
    amount: 3500,
    date: "2024-01-19",
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "TXN-006",
    type: "income",
    category: "Product Sale",
    description: "Eggs (12 pcs) - Nusrat Jahan",
    amount: 120,
    date: "2024-01-18",
    status: "completed",
    paymentMethod: "bKash",
  },
  {
    id: "TXN-007",
    type: "expense",
    category: "Salary",
    description: "Delivery staff salary",
    amount: 28000,
    date: "2024-01-18",
    status: "completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN-008",
    type: "income",
    category: "Subscription",
    description: "Monthly subscription - Rafiq Hossain",
    amount: 2500,
    date: "2024-01-18",
    status: "failed",
    paymentMethod: "Credit Card",
  },
];

export default function Financial() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const totalIncome = mockTransactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = mockTransactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const pendingAmount = mockTransactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "Total Income",
      value: `৳${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
      change: "+12.5%",
    },
    {
      title: "Total Expenses",
      value: `৳${totalExpense.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-500",
      change: "+8.2%",
    },
    {
      title: "Net Profit",
      value: `৳${netProfit.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-500",
      change: "+15.3%",
    },
    {
      title: "Pending Payments",
      value: `৳${pendingAmount.toLocaleString()}`,
      icon: Wallet,
      color: "text-yellow-500",
      change: "2 transactions",
    },
  ];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const columns: Column<Transaction>[] = [
    {
      key: "id",
      label: "Transaction ID",
      render: (transaction) => (
        <span className="font-medium">{transaction.id}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (transaction) => (
        <Badge
          variant={transaction.type === "income" ? "default" : "secondary"}
          className="gap-1"
        >
          {transaction.type === "income" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {transaction.type === "income" ? "Income" : "Expense"}
        </Badge>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (transaction) => (
        <span className="font-medium">{transaction.category}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (transaction) => (
        <span className="font-medium">{transaction.description}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (transaction) => (
        <span
          className={
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }
        >
          {transaction.type === "income" ? "+" : "-"}৳
          {transaction.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (transaction) => (
        <span className="text-sm">{formatDate(transaction.date)}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (transaction) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          {transaction.paymentMethod}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => (
        <Badge
          variant={
            transaction.status === "completed"
              ? "default"
              : transaction.status === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {transaction.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList
        title="All Transactions"
        description="View and manage all financial transactions"
        headerSlots={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="shadow-card">
              <Download className="mr-2 h-4 w-4" />
              {t("common.export")}
            </Button>
          </div>
        }
        searchPlaceholder="Search by customer, order, or driver..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            value: typeFilter,
            options: [
              { label: "All Types", value: "all" },
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ],
            onChange: setTypeFilter,
            placeholder: "Filter by type",
            className: "w-[180px]",
          },
        ]}
        columns={columns}
        data={filteredTransactions}
        emptyMessage="No transactions found"
        getRowKey={(transaction) => transaction.id}
        summaryLists={stats}
      />
    </div>
  );
}
