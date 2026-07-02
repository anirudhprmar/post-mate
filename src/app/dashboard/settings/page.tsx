"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserProfile } from "../../../hooks/useUserProfile";
// import { useOrganizations } from "../../../hooks/useOrganizations";
import { useBillingHistory } from "../../../hooks/useBillingHistory";
import { SettingsSkeleton } from "../../../components/settings-skeleton";
import { ProfileTab } from "../../../components/tabs/profile-tab";
// import { OrganizationTab } from "../../../components/tabs/org-tab";
import { BillingTab } from "../../../components/tabs/billing-tab";
// import { MembersTab } from "~/components/tabs/members-tab";

function SettingsContent() {
  const [currentTab, setCurrentTab] = useState("profile");
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, loading } = useUserProfile();
  // const {
  //   organizations,
  //   activeOrg,
  //   members,
  //   invitations,
  //   updatingOrg,
  //   handleSwitchOrg,
  //   handleCreateOrg,
  //   handleUpdateOrg,
  //   handleLeaveOrg,
  //   handleInviteMember,
  //   handleCancelInvite,
  //   handleRemoveMember,
  // } = useOrganizations();
  const { orders, handleCustomerPortal } = useBillingHistory();

  // const userRole =
  //   members.find((m) => {
  //     const mUser = m as { user?: { id?: string }; userId?: string };
  //     return mUser.user?.id === user?.id || mUser.userId === user?.id;
  //   })?.role ?? activeOrg?.members?.find((m) => m.userId === user?.id)?.role;
  // const canManageOrg = userRole === "owner" || userRole === "admin";

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        onValueChange={handleTabChange}
        className="w-full max-w-4xl"
        defaultValue={searchParams.get("tab") || "profile"}
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger> */}
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab user={user} />
        </TabsContent>

        {/* <TabsContent value="organization" className="space-y-6">
          <OrganizationTab
            activeOrg={activeOrg}
            organizations={organizations}
            currentUserId={user?.id}
            userRole={userRole}
            canManageOrg={canManageOrg}
            updatingOrg={updatingOrg}
            onSwitchOrg={handleSwitchOrg}
            onCreateOrg={handleCreateOrg}
            onUpdateOrg={handleUpdateOrg}
            onLeaveOrg={handleLeaveOrg}
          />
        </TabsContent> */}

        {/* <TabsContent value="members" className="space-y-6">
          <MembersTab
            activeOrg={activeOrg}
            organizations={organizations}
            members={members}
            invitations={invitations}
            currentUserId={user?.id}
            userRole={userRole}
            canManageOrg={canManageOrg}
            onInviteMember={handleInviteMember}
            onCancelInvite={handleCancelInvite}
            onRemoveMember={handleRemoveMember}
          />
        </TabsContent> */}

        <TabsContent value="billing" className="space-y-6">
          <BillingTab orders={orders} onCustomerPortal={handleCustomerPortal} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 p-6">
          <div>
            <div className="mb-2 h-9 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-80 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
