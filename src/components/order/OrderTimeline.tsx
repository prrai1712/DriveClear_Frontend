"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export interface TimelineEvent {
  status: string;
  message: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  CREATED: "bg-slate-400",
  PAYMENT_PENDING: "bg-amber-400",
  PAYMENT_SUCCESS: "bg-emerald-500",
  UNDER_REVIEW: "bg-blue-500",
  COURT_PROCESSING: "bg-purple-500",
  SETTLEMENT_IN_PROGRESS: "bg-indigo-500",
  COMPLETED: "bg-emerald-600",
  FAILED: "bg-red-500",
  REFUNDED: "bg-orange-500",
};

export function OrderTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative border-l border-slate-200 ml-3 space-y-6">
      {events.map((event, i) => (
        <motion.li
          key={`${event.status}-${i}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="ml-6"
        >
          <span
            className={clsx(
              "absolute -left-1.5 flex h-3 w-3 rounded-full ring-4 ring-white",
              STATUS_COLORS[event.status] || "bg-slate-300",
            )}
          />
          <p className="text-sm font-medium text-slate-900">{event.message}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(event.created_at).toLocaleString("en-IN")}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
