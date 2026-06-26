"use client";

import { useState } from "react";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { usePostStore } from "~/store/post";
import { usePublishPost } from "~/hooks/usePublishPost";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function PublishActions() {
  const selectedAccountIds = usePostStore((state) => state.selectedAccountIds);
  const scheduledDate = usePostStore((state) => state.scheduledDate);
  const setScheduledDate = usePostStore((state) => state.setScheduledDate);
  const isOverLimit = usePostStore((state) => state.isOverLimit);
  const content = usePostStore((state) => state.content);

  // Strip HTML tags and check if there's any real text
  const isEmpty = content.replace(/<[^>]+>/g, "").trim().length === 0;

  const { handlePublish, publishingMode } = usePublishPost();

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleHour, setScheduleHour] = useState("12");
  const [scheduleMinute, setScheduleMinute] = useState("00");

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <Button
        variant={"secondary"}
        disabled={publishingMode !== null || isOverLimit || isEmpty}
        title={
          isEmpty
            ? "Write something first"
            : isOverLimit
              ? "Content exceeds platform character limit"
              : undefined
        }
        onClick={() => handlePublish("draft")}
      >
        {publishingMode === "draft" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Save as Draft
      </Button>
      <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"default"}
            disabled={
              publishingMode !== null ||
              selectedAccountIds.length === 0 ||
              isOverLimit ||
              isEmpty
            }
            title={
              isEmpty
                ? "Write something first"
                : isOverLimit
                  ? "Content exceeds platform character limit"
                  : undefined
            }
          >
            {publishingMode === "schedule" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <CalendarIcon className="mr-2 h-4 w-4" />
            {scheduledDate
              ? format(scheduledDate, "MMM d, yyyy 'at' HH:mm")
              : "Schedule"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
          <div className="space-y-3 p-3">
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setHours(
                    parseInt(scheduleHour),
                    parseInt(scheduleMinute),
                  );
                  setScheduledDate(newDate);
                } else {
                  setScheduledDate(undefined);
                }
              }}
              disabled={{ before: new Date() }}
            />
            <div className="border-t px-1 pt-3">
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">Time</span>
                <div className="ml-auto flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={scheduleHour}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2);
                      setScheduleHour(val);
                      if (scheduledDate) {
                        const d = new Date(scheduledDate);
                        d.setHours(
                          parseInt(val) || 0,
                          parseInt(scheduleMinute),
                        );
                        setScheduledDate(d);
                      }
                    }}
                    className="bg-background focus:ring-ring w-12 rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground font-bold">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={scheduleMinute}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2);
                      setScheduleMinute(val);
                      if (scheduledDate) {
                        const d = new Date(scheduledDate);
                        d.setHours(parseInt(scheduleHour), parseInt(val) || 0);
                        setScheduledDate(d);
                      }
                    }}
                    className="bg-background focus:ring-ring w-12 rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!scheduledDate}
              onClick={() => {
                setScheduleOpen(false);
                handlePublish("schedule");
              }}
            >
              {scheduledDate
                ? `Schedule for ${format(scheduledDate, "MMM d 'at' HH:mm")}`
                : "Pick a date"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
