"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type DateRange = { start: string; end: string };

export function AvailabilityCalendar({
  blockedRanges = [],
  className,
}: {
  blockedRanges?: DateRange[];
  className?: string;
}) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const blocked = useMemo(
    () =>
      blockedRanges
        .map((range) => {
          const start = startOfDay(parseISO(range.start));
          // end_date is the checkout day (exclusive), so the last
          // blocked night is the day before.
          const end = startOfDay(subDays(parseISO(range.end), 1));
          return { start, end };
        })
        .filter((range) => !isBefore(range.end, range.start)),
    [blockedRanges],
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  function isBlocked(day: Date) {
    return blocked.some((range) =>
      isWithinInterval(day, { start: range.start, end: range.end }),
    );
  }

  return (
    <div className={cn("rounded-2xl border border-brand-100 bg-white p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="grid h-8 w-8 place-items-center rounded-full border border-brand-200 text-brand-700 hover:bg-brand-50"
          onClick={() => setCursor((c) => subMonths(c, 1))}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="font-display text-lg text-brand-900">
          {format(cursor, "MMMM yyyy")}
        </div>
        <button
          type="button"
          aria-label="Next month"
          className="grid h-8 w-8 place-items-center rounded-full border border-brand-200 text-brand-700 hover:bg-brand-50"
          onClick={() => setCursor((c) => addMonths(c, 1))}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-brand-600">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 text-sm">
        {days.map((day) => {
          const past = isBefore(day, today) && !isSameDay(day, today);
          const isOtherMonth = day.getMonth() !== cursor.getMonth();
          const taken = isBlocked(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-brand-800",
                isOtherMonth && "text-brand-300",
                past && "text-brand-300 line-through",
                taken &&
                  "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100 line-through",
                !past && !taken && !isOtherMonth && "hover:bg-brand-50",
              )}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-brand-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          Unavailable
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-200" />
          Available
        </span>
      </div>
    </div>
  );
}
