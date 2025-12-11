import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "@/components/table/BaseTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TopHolder } from "@/lib/types";
import { Coins, Send, Eye, SendIcon } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";
import SendCoinModal from "../modal/SendCoinModal";
import UserCoinDetailsModal from "../modal/UserCoinDetailsModal";

interface UserBalancesProps {
  topHolders: TopHolder[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function UserBalances({
  topHolders,
  isLoading,
  onRefresh,
}: UserBalancesProps) {
  const { t } = useTranslation();
  const [showSendCoinModal, setShowSendCoinModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TopHolder | null>(null);

  const handleSendCoins = (user: TopHolder) => {
    setSelectedUser(user);
    setShowSendCoinModal(true);
  };

  const handleViewDetails = (user: TopHolder) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const columns: Column<TopHolder>[] = [
    {
      key: "sl",
      label: t("coinManagement.userBalances.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center w-16",
    },
    {
      key: "user",
      label: t("coinManagement.userBalances.columns.user"),
      render: (holder) => (
        <div>
          <p className="font-medium">{holder.user.name}</p>
          <p className="text-sm text-muted-foreground">{holder.user.email}</p>
        </div>
      ),
    },
    {
      key: "total_coins",
      label: t("coinManagement.userBalances.columns.currentBalance"),
      render: (holder) => (
        <div className="flex items-center gap-1 w-[110px]">
          <Coins className="h-4 w-4 text-amber-600" />
          <span className="font-bold text-primary">
            {formatNumberWithCommas(holder.total_coins)}
          </span>
        </div>
      ),
    },
    {
      key: "available_coins",
      label: t("coinManagement.userBalances.columns.totalEarned"),
      render: (holder) => (
        <div className="w-[90px]">
          <span className="text-green-600 font-medium">
            {formatNumberWithCommas(holder.available_coins)}
          </span>
        </div>
      ),
    },
    {
      key: "locked_coins",
      label: t("coinManagement.userBalances.columns.totalSpent"),
      render: (holder) => (
        <div className="w-[80px]">
          <span className="text-red-600 font-medium">
            {formatNumberWithCommas(holder.locked_coins)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: t("actions"),
      className: "text-center",
      render: (holder) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(holder)}
          >
            <Eye className="h-3 w-3 mr-1" />
            {t("coinManagement.userBalances.viewDetails")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSendCoins(holder)}
          >
            <Send className="h-3 w-3 mr-1" />
            {t("coinManagement.userBalances.sendCoins")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("coinManagement.userBalances.title")}</CardTitle>
              <CardDescription>
                {t("coinManagement.userBalances.description")}
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setShowSendCoinModal(true);
              }}
            >
              <SendIcon className="h-4 w-4 mr-2" />
              {t("coinManagement.userBalances.sendCoins")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key as string}
                      className={column.className}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.key as string}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : topHolders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("coinManagement.userBalances.noUsers")}
                    </TableCell>
                  </TableRow>
                ) : (
                  topHolders.map((holder, index) => (
                    <TableRow key={holder.user.id}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.key as string}
                          className={column.className}
                        >
                          {column.render
                            ? column.render(holder, index)
                            : String(holder[column.key as keyof TopHolder])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SendCoinModal
        open={showSendCoinModal}
        onClose={() => {
          setShowSendCoinModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          onRefresh();
        }}
        selectedUser={selectedUser}
        topHolders={topHolders}
      />

      {selectedUser && (
        <UserCoinDetailsModal
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.user.id}
        />
      )}
    </>
  );
}
