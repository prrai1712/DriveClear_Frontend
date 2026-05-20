"use client";

import {
  Challan,
  challanAmount,
  challanMedium,
  challanStatus,
  isPendingChallan,
  isSelectableChallan,
  isZeroAmountChallan,
  mediumLabel,
  statusLabel,
  isOpsPendingChallan,
} from "@/lib/challans/types";

interface ChallanCardProps {
  challan: Challan;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (uuid: string) => void;
}

const PAYMENT_NOT_ACCEPTED_MSG = "We do not accept payment for this challan";

export function ChallanCard({ challan, selectable, selected, onToggle }: ChallanCardProps) {
  const status = challanStatus(challan);
  const label = statusLabel(challan);
  const medium = challanMedium(challan);
  const isPending = isPendingChallan(challan);
  const isProcessing = isOpsPendingChallan(challan);
  const zeroAmount = isZeroAmountChallan(challan);
  const canSelect = Boolean(selectable && isSelectableChallan(challan));

  return (
    <li
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        selected && canSelect
          ? "border-emerald-500 ring-2 ring-emerald-500/20"
          : zeroAmount && isPending
            ? "border-slate-200 bg-slate-50/80"
            : "border-slate-200"
      }`}
    >
      <div className="flex gap-3 items-start">
        {selectable && (
          <>
            {canSelect ? (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle?.(challan.uuid)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                aria-label={`Select challan ${challan.challan_number}`}
              />
            ) : (
              <div
                className="mt-1 h-5 w-5 rounded border border-slate-200 bg-slate-100 shrink-0"
                title={PAYMENT_NOT_ACCEPTED_MSG}
                aria-hidden
              />
            )}
          </>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-semibold text-slate-900">{challan.challan_number}</p>
              <p className="text-sm text-slate-500 mt-0.5">{challan.vehicle_number}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                isPending
                  ? "bg-amber-100 text-amber-800"
                  : isProcessing
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {label}
            </span>
          </div>

          {zeroAmount && isPending && (
            <p className="mt-2 text-xs font-medium text-slate-600 bg-slate-200/60 rounded-lg px-3 py-2">
              {PAYMENT_NOT_ACCEPTED_MSG}
            </p>
          )}

          <span
            className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${
              medium === "court_challan"
                ? "bg-orange-100 text-orange-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {mediumLabel(medium)}
          </span>

          {challan.offense_name && (
            <p className="text-sm text-slate-700 mt-2">{challan.offense_name}</p>
          )}
          {challan.place && <p className="text-xs text-slate-500 mt-1">{challan.place}</p>}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <span className="text-lg font-bold text-slate-900">
              ₹{challanAmount(challan).toLocaleString("en-IN")}
            </span>
            {challan.issue_date && (
              <span className="text-xs text-slate-400">{challan.issue_date}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
