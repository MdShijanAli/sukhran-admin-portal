import { withPermission } from "@/hoc/withPermission";
import UsersTab from "./tabs/UsersTab";
import permissions from "@/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import StatisticsTab from "./tabs/StatisticsTab";
import DeletedUsersTab from "./tabs/DeletedUsersTab";

const Users = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="flex items-center justify-start mb-4">
          <TabsTrigger value="users">{t("users.tabs.users")}</TabsTrigger>
          <TabsTrigger value="statistics">
            {t("users.tabs.statistics")}
          </TabsTrigger>
          <TabsTrigger value="deletedUsers">
            {t("users.tabs.deletedUsers")}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <StatisticsTab />
        </TabsContent>

        {/* Deleted Users Tab */}
        <TabsContent value="deletedUsers">
          <DeletedUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withPermission(Users, permissions.users.view);
