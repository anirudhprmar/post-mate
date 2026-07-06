"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { SettingsSkeleton } from "../../../components/settings-skeleton";
import { ProfileTab } from "../../../components/tabs/profile-tab";

function SettingsContent() {
  const searchParams = useSearchParams();

  const { user, loading } = useUserProfile();

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
        className="w-full max-w-4xl"
        defaultValue={searchParams.get("tab") || "profile"}
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsClientPage() {
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
