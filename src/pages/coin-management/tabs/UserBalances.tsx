import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "@/components/table/BaseTable";
import { Button } from "@/components/ui/button";
import { CoinUser } from "@/lib/types";
import { Coins, Send, Eye, SendIcon } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";
import SendCoinModal from "../modal/SendCoinModal";
import UserCoinDetailsModal from "../modal/UserCoinDetailsModal";
import getSerialNumber from "@/lib/getSerialNumber";
import { useCoinUserStore } from "@/stores/coinUserStore";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import { BaseTableList } from "@/components/table";
import coinService from "@/services/coinService";

export default function UserBalances() {
  const { t } = useTranslation();
  const store = useCoinUserStore();
  const { hasPermission } = usePermissions();
  const [showSendCoinModal, setShowSendCoinModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CoinUser | null>(null);

  const handleSendCoins = (user: CoinUser) => {
    console.log("Viewing details for user:", user);
    setSelectedUser(user);
    setShowSendCoinModal(true);
  };

  const handleViewDetails = (user: CoinUser) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const columns: Column<CoinUser>[] = [
    {
      key: "sl",
      label: t("coinManagement.userBalances.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-16",
    },
    {
      key: "user",
      label: t("coinManagement.userBalances.columns.user"),
      render: (user) => (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "net_coins",
      label: t("coinManagement.userBalances.columns.currentBalance"),
      render: (holder) => (
        <div className="flex items-center gap-1 w-[110px]">
          <Coins className="h-4 w-4 text-amber-600" />
          <span className=" text-primary">
            {formatNumberWithCommas(holder?.statistics?.net_coins)}
          </span>
        </div>
      ),
    },
    {
      key: "total_earned",
      label: t("coinManagement.userBalances.columns.totalEarned"),
      render: (holder) => (
        <div className="w-[90px]">
          <span className="text-green-600 font-medium">
            {formatNumberWithCommas(holder?.statistics?.total_earned)}
          </span>
        </div>
      ),
    },
    {
      key: "total_spent",
      label: t("coinManagement.userBalances.columns.totalSpent"),
      render: (holder) => (
        <div className="w-[80px]">
          <span className="text-red-600 font-medium">
            {formatNumberWithCommas(holder?.statistics?.total_spent)}
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
          {hasPermission(permissions.coins.send) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendCoins(holder)}
            >
              <Send className="h-3 w-3 mr-1" />
              {t("coinManagement.userBalances.sendCoins")}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<CoinUser>
        title={t("coinManagement.userBalances.title")}
        description={t("coinManagement.userBalances.description")}
        searchPlaceholder={t("coinManagement.userBalances.searchPlaceholder")}
        headerActions={
          hasPermission(permissions.coins.send) && [
            {
              label: t("coinManagement.userBalances.sendCoins"),
              icon: SendIcon,
              onClick: () => {
                setSelectedUser(null);
                setShowSendCoinModal(true);
              },
              variant: "default",
            },
          ]
        }
        enableSearch={true}
        columns={columns}
        service={coinService}
        store={store}
        serviceMethod={coinService.fetchAllUsersCoins}
        emptyMessage={t("coinManagement.userBalances.noUsersFound")}
        getRowKey={(user) => user.user_id}
      />

      <SendCoinModal
        open={showSendCoinModal}
        onClose={() => {
          setShowSendCoinModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => coinService.fetchAllUsersCoins()}
        selectedUser={selectedUser}
      />

      {selectedUser && (
        <UserCoinDetailsModal
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.user_id}
        />
      )}

    </div>
  );
}
