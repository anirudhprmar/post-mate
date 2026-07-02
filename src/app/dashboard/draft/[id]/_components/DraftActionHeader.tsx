"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  Trash2,
  Save,
  Calendar as CalendarIcon,
  Loader2,
  Clock,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface DraftActionHeaderProps {
  onBack: () => void;
  onDelete: () => void;
  onSave: () => void;
  onSchedule: (date: Date) => void;
  isSaving: boolean;
  isDeleting: boolean;
  isScheduling: boolean;
  canSave: boolean;
  canSchedule: boolean;
}

export default function DraftActionHeader({
  onBack,
  onDelete,
  onSave,
  onSchedule,
  isSaving,
  isDeleting,
  isScheduling,
  canSave,
  canSchedule,
}: DraftActionHeaderProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined,
  );
  const [scheduleHour, setScheduleHour] = useState("12");
  const [scheduleMinute, setScheduleMinute] = useState("00");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(
        parseInt(scheduleHour) || 0,
        parseInt(scheduleMinute) || 0,
      );
      setScheduledDate(newDate);
    } else {
      setScheduledDate(undefined);
    }
  };

  const handleHourChange = (val: string) => {
    const hours = val.slice(0, 2);
    setScheduleHour(hours);
    if (scheduledDate) {
      const d = new Date(scheduledDate);
      d.setHours(parseInt(hours) || 0, parseInt(scheduleMinute) || 0);
      setScheduledDate(d);
    }
  };

  const handleMinuteChange = (val: string) => {
    const minutes = val.slice(0, 2);
    setScheduleMinute(minutes);
    if (scheduledDate) {
      const d = new Date(scheduledDate);
      d.setHours(parseInt(scheduleHour) || 0, parseInt(minutes) || 0);
      setScheduledDate(d);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="icon"
          className="hover:bg-muted rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground/90 text-2xl font-bold tracking-tight">
            Edit Draft
          </h1>
          <p className="text-muted-foreground text-xs font-medium">
            Refine and schedule your draft.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isDeleting || isSaving || isScheduling}
              className="rounded-full shadow-sm"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Draft
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground text-lg font-bold">
                Delete Draft
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm">
                Are you sure you want to delete this draft? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 gap-2">
              <AlertDialogCancel className="rounded-md">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="secondary"
          onClick={onSave}
          disabled={isSaving || isDeleting || isScheduling || !canSave}
          className="rounded-full shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Updates
        </Button>

        <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              disabled={isSaving || isDeleting || isScheduling || !canSchedule}
              className="rounded-full shadow-sm"
            >
              {isScheduling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CalendarIcon className="mr-2 h-4 w-4" />
              )}
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
                onSelect={handleDateSelect}
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
                      onChange={(e) => handleHourChange(e.target.value)}
                      className="bg-background focus:ring-ring w-12 rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none"
                    />
                    <span className="text-muted-foreground font-bold">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={scheduleMinute}
                      onChange={(e) => handleMinuteChange(e.target.value)}
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
                  if (scheduledDate) {
                    onSchedule(scheduledDate);
                  }
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
    </header>
  );
}
