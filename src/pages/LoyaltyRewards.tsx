import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Coins,
  Settings,
  History,
  TrendingUp,
  Gift,
  Edit,
  Save,
  Users,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RewardSettings {
  earningRate: number; // coins per dollar spent
  redemptionRate: number; // dollar value per coin
  maxRedemptionPercent: number; // max % of order that can be paid with coins
  minOrderForRedemption: number; // minimum order value to use coins
  coinExpiryDays: number; // days until coins expire (0 = never)
  welcomeBonus: number; // coins given to new users
  birthdayBonus: number; // coins given on birthday
  referralBonus: number; // coins for successful referral
  isActive: boolean;
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: "earned" | "redeemed" | "bonus" | "expired";
  amount: number;
  orderId?: string;
  description: string;
  date: string;
}

interface UserBalance {
  userId: string;
  userName: string;
  email: string;
  totalEarned: number;
  totalRedeemed: number;
  currentBalance: number;
  lastActivity: string;
}

export default function LoyaltyRewards() {
  const { t } = useTranslation();

  // Reward Settings State
  const [settings, setSettings] = useState<RewardSettings>({
    earningRate: 10, // 10 coins per $1
    redemptionRate: 0.01, // $0.01 per coin
    maxRedemptionPercent: 50, // max 50% of order
    minOrderForRedemption: 10, // minimum $10 order
    coinExpiryDays: 365, // 1 year
    welcomeBonus: 100,
    birthdayBonus: 200,
    referralBonus: 500,
    isActive: true,
  });

  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<RewardSettings>(settings);

  // Mock Data
  const [transactions] = useState<Transaction[]>([
    {
      id: "txn1",
      userId: "user1",
      userName: "John Doe",
      type: "earned",
      amount: 500,
      orderId: "ORD-001",
      description: "Purchase - Order #ORD-001",
      date: "2024-01-15",
    },
    {
      id: "txn2",
      userId: "user2",
      userName: "Jane Smith",
      type: "redeemed",
      amount: -200,
      orderId: "ORD-002",
      description: "Redeemed on Order #ORD-002",
      date: "2024-01-14",
    },
    {
      id: "txn3",
      userId: "user1",
      userName: "John Doe",
      type: "bonus",
      amount: 100,
      description: "Welcome Bonus",
      date: "2024-01-10",
    },
    {
      id: "txn4",
      userId: "user3",
      userName: "Bob Wilson",
      type: "earned",
      amount: 750,
      orderId: "ORD-003",
      description: "Purchase - Order #ORD-003",
      date: "2024-01-13",
    },
  ]);

  const [userBalances] = useState<UserBalance[]>([
    {
      userId: "user1",
      userName: "John Doe",
      email: "john@example.com",
      totalEarned: 2500,
      totalRedeemed: 500,
      currentBalance: 2000,
      lastActivity: "2024-01-15",
    },
    {
      userId: "user2",
      userName: "Jane Smith",
      email: "jane@example.com",
      totalEarned: 1800,
      totalRedeemed: 800,
      currentBalance: 1000,
      lastActivity: "2024-01-14",
    },
    {
      userId: "user3",
      userName: "Bob Wilson",
      email: "bob@example.com",
      totalEarned: 3200,
      totalRedeemed: 200,
      currentBalance: 3000,
      lastActivity: "2024-01-13",
    },
  ]);

  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserBalance | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Statistics
  const totalCoinsInCirculation = userBalances.reduce(
    (sum, user) => sum + user.currentBalance,
    0
  );
  const totalCoinsEarned = userBalances.reduce(
    (sum, user) => sum + user.totalEarned,
    0
  );
  const totalCoinsRedeemed = userBalances.reduce(
    (sum, user) => sum + user.totalRedeemed,
    0
  );
  const activeUsers = userBalances.length;

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setEditingSettings(false);
    toast({
      title: "Success",
      description: "Reward settings updated successfully",
    });
  };

  const handleCancelSettings = () => {
    setTempSettings(settings);
    setEditingSettings(false);
  };

  const handleAdjustBalance = (user: UserBalance) => {
    setSelectedUser(user);
    setAdjustmentAmount("");
    setAdjustmentReason("");
    setShowAdjustmentDialog(true);
  };

  const handleSaveAdjustment = () => {
    if (!adjustmentAmount || !adjustmentReason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Balance adjusted for ${selectedUser?.userName}`,
    });
    setShowAdjustmentDialog(false);
  };

  const getTransactionBadge = (type: Transaction["type"]) => {
    const variants = {
      earned: "default",
      redeemed: "secondary",
      bonus: "default",
      expired: "destructive",
    } as const;

    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <div className=" animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty & Rewards</h1>
          <p className="text-muted-foreground mt-1">
            Manage reward coins, policies, and user balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={settings.isActive ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {settings.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Coins in Circulation
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCoinsInCirculation.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(totalCoinsInCirculation * settings.redemptionRate).toFixed(2)}{" "}
              value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCoinsEarned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redeemed
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCoinsRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(totalCoinsRedeemed * settings.redemptionRate).toFixed(2)} value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With reward balance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Reward Settings
          </TabsTrigger>
          <TabsTrigger value="balances">
            <Users className="mr-2 h-4 w-4" />
            User Balances
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Reward Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reward System Configuration</CardTitle>
                  <CardDescription>
                    Configure how users earn and redeem reward coins
                  </CardDescription>
                </div>
                {!editingSettings ? (
                  <Button onClick={() => setEditingSettings(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancelSettings}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="">
              {/* System Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Reward System Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the entire reward system
                  </p>
                </div>
                <Switch
                  checked={
                    editingSettings ? tempSettings.isActive : settings.isActive
                  }
                  onCheckedChange={(checked) =>
                    editingSettings &&
                    setTempSettings({ ...tempSettings, isActive: checked })
                  }
                  disabled={!editingSettings}
                />
              </div>

              {/* Earning Rules */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Earning Rules
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Coins Per Dollar Spent</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.earningRate
                          : settings.earningRate
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          earningRate: parseFloat(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Users earn this many coins for every $1 spent
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Welcome Bonus Coins</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.welcomeBonus
                          : settings.welcomeBonus
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          welcomeBonus: parseInt(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Coins given to new users on signup
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Birthday Bonus Coins</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.birthdayBonus
                          : settings.birthdayBonus
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          birthdayBonus: parseInt(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Coins given on user's birthday
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Referral Bonus Coins</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.referralBonus
                          : settings.referralBonus
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          referralBonus: parseInt(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Coins for successful referral
                    </p>
                  </div>
                </div>
              </div>

              {/* Redemption Rules */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Redemption Rules
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Redemption Rate ($ per coin)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={
                        editingSettings
                          ? tempSettings.redemptionRate
                          : settings.redemptionRate
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          redemptionRate: parseFloat(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Dollar value of each coin when redeemed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Redemption % Per Order</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.maxRedemptionPercent
                          : settings.maxRedemptionPercent
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          maxRedemptionPercent: parseInt(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum % of order that can be paid with coins
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Order for Redemption ($)</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.minOrderForRedemption
                          : settings.minOrderForRedemption
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          minOrderForRedemption: parseFloat(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum order value required to use coins
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Coin Expiry (Days)</Label>
                    <Input
                      type="number"
                      value={
                        editingSettings
                          ? tempSettings.coinExpiryDays
                          : settings.coinExpiryDays
                      }
                      onChange={(e) =>
                        editingSettings &&
                        setTempSettings({
                          ...tempSettings,
                          coinExpiryDays: parseInt(e.target.value),
                        })
                      }
                      disabled={!editingSettings}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days until coins expire (0 = never expire)
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Example Calculation</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    • Purchase of $100 = {settings.earningRate * 100} coins
                    earned
                  </p>
                  <p>
                    • {settings.earningRate * 100} coins = $
                    {(
                      settings.earningRate *
                      100 *
                      settings.redemptionRate
                    ).toFixed(2)}{" "}
                    redemption value
                  </p>
                  <p>
                    • On a $50 order, max redemption: $
                    {((50 * settings.maxRedemptionPercent) / 100).toFixed(2)} (
                    {settings.maxRedemptionPercent}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Balances Tab */}
        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>User Coin Balances</CardTitle>
              <CardDescription>
                View and manage user reward balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Balance</TableHead>
                      <TableHead>Total Earned</TableHead>
                      <TableHead>Total Redeemed</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBalances.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell className="font-medium">
                          {user.userName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="font-semibold">
                              {user.currentBalance.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.totalEarned.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {user.totalRedeemed.toLocaleString()}
                        </TableCell>
                        <TableCell>{user.lastActivity}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdjustBalance(user)}
                          >
                            Adjust
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All reward coin transactions across users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Order ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>{txn.date}</TableCell>
                        <TableCell className="font-medium">
                          {txn.userName}
                        </TableCell>
                        <TableCell>{getTransactionBadge(txn.type)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              txn.amount > 0
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {txn.amount > 0 ? "+" : ""}
                            {txn.amount}
                          </span>
                        </TableCell>
                        <TableCell>{txn.description}</TableCell>
                        <TableCell>{txn.orderId || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust Balance Dialog */}
      <Dialog
        open={showAdjustmentDialog}
        onOpenChange={setShowAdjustmentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust User Balance</DialogTitle>
            <DialogDescription>
              Manually adjust coin balance for {selectedUser?.userName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Current Balance:
                  </span>
                  <span className="font-semibold flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {selectedUser.currentBalance}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adjustment Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount (positive to add, negative to subtract)"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use positive numbers to add coins, negative to subtract
                </p>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Select
                  value={adjustmentReason}
                  onValueChange={setAdjustmentReason}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compensation">
                      Customer Compensation
                    </SelectItem>
                    <SelectItem value="correction">
                      Balance Correction
                    </SelectItem>
                    <SelectItem value="promotion">Promotional Bonus</SelectItem>
                    <SelectItem value="penalty">Penalty/Deduction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {adjustmentAmount && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm">
                    New balance will be:{" "}
                    <span className="font-semibold">
                      {selectedUser.currentBalance +
                        parseInt(adjustmentAmount || "0")}{" "}
                      coins
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdjustmentDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAdjustment}>Confirm Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
