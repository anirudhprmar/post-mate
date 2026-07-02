"use client";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Skeleton className="mb-2 h-9 w-32 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-5 w-80 bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex space-x-1">
          <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-10 w-28 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-10 w-16 bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-800" />
              </div>
              <Skeleton className="h-4 w-72 bg-gray-200 dark:bg-gray-800" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-8 w-12 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
              <Skeleton className="h-10 w-28 bg-gray-200 dark:bg-gray-800" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
