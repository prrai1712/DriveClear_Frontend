"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChallanCard } from "@/components/challans/ChallanCard";
import { ChallanPagination } from "@/components/challans/ChallanPagination";
import { apiRequest } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { CHALLANS_PAGE_SIZE, CHECKOUT_MAX_CHALLANS } from "@/lib/challans/constants";
import {
  Challan,
  challanAmount,
  isPaidChallan,
  isPendingChallan,
  isSelectableChallan,
} from "@/lib/challans/types";

function sortByAmountDesc(a: Challan, b: Challan) {
  return challanAmount(b) - challanAmount(a);
}
import { CHECKOUT_STORAGE_KEY } from "@/lib/orders/types";

interface FetchResult {
  vehicle_number: string;
  count: number;
  challans: Challan[];
  no_challans_found?: boolean;
  vehicle?: {
    vehicle_number: string;
    maker_model?: string;
    owner_name?: string;
  };
}

type Tab = "pending" | "paid";

export default function ChallansPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [page, setPage] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [challans, setChallans] = useState<Challan[]>([]);
  const [vehicleInfo, setVehicleInfo] = useState<FetchResult["vehicle"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadChallans = useCallback(async (vehicle: string) => {
    setLoading(true);
    setError("");
    setEmptyMessage("");
    const cached = sessionStorage.getItem("dc_last_fetch");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as FetchResult;
        if (!vehicle || parsed.vehicle_number === vehicle) {
          setChallans(parsed.challans || []);
          setVehicleInfo(parsed.vehicle || null);
          setVehicleNumber(parsed.vehicle_number);
          if (parsed.no_challans_found || (parsed.challans || []).length === 0) {
            setEmptyMessage("No challans found for this vehicle.");
          }
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem("dc_last_fetch");
      }
    }

    const url = vehicle
      ? `/challans/?vehicle_number=${encodeURIComponent(vehicle)}`
      : "/challans/";

    try {
      const data = await apiRequest<Challan[]>("get", url);
      setChallans(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const v =
      new URLSearchParams(window.location.search).get("vehicle") ||
      sessionStorage.getItem("dc_vehicle") ||
      "";
    setVehicleNumber(v);
    loadChallans(v);
  }, [loadChallans]);

  const pendingList = useMemo(
    () => challans.filter(isPendingChallan).sort(sortByAmountDesc),
    [challans],
  );
  const payablePendingList = useMemo(() => pendingList.filter(isSelectableChallan), [pendingList]);
  const paidList = useMemo(
    () => challans.filter(isPaidChallan).sort(sortByAmountDesc),
    [challans],
  );
  const activeList = tab === "pending" ? pendingList : paidList;

  const totalPages = Math.max(1, Math.ceil(activeList.length / CHALLANS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [tab, vehicleNumber]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * CHALLANS_PAGE_SIZE;
    return activeList.slice(start, start + CHALLANS_PAGE_SIZE);
  }, [activeList, currentPage]);

  const pendingIds = useMemo(() => payablePendingList.map((c) => c.uuid), [payablePendingList]);
  const allSelected =
    payablePendingList.length > 0 && pendingIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0 && !allSelected;

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pendingIds));
    }
  }

  function toggleSelect(uuid: string) {
    const challan = challans.find((c) => c.uuid === uuid);
    if (challan && !isSelectableChallan(challan)) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  }

  useEffect(() => {
    const payableIds = new Set(payablePendingList.map((c) => c.uuid));
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => payableIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [payablePendingList]);

  function handlePayNow() {
    setError("");
    const uuids = Array.from(selected);
    if (uuids.length > CHECKOUT_MAX_CHALLANS) {
      setError(
        `You can pay up to ${CHECKOUT_MAX_CHALLANS} challans at once. Please deselect ${uuids.length - CHECKOUT_MAX_CHALLANS} challan(s).`,
      );
      return;
    }
    const items = payablePendingList.filter((c) => uuids.includes(c.uuid));
    sessionStorage.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify({ challan_uuids: uuids, challans: items, vehicle_number: vehicleNumber }),
    );
    router.push("/order-summary");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/vehicle" className="text-emerald-600 text-sm font-medium">
          ← Search another vehicle
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Your challans</h1>
        {vehicleInfo?.vehicle_number && (
          <p className="text-slate-600 text-sm mt-1">
            {vehicleInfo.vehicle_number}
            {vehicleInfo.maker_model ? ` · ${vehicleInfo.maker_model}` : ""}
            {vehicleInfo.owner_name ? ` · ${vehicleInfo.owner_name}` : ""}
          </p>
        )}

        <div className="mt-6 flex rounded-xl bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === "pending"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending
            {pendingList.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({pendingList.length})</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("paid");
              setSelected(new Set());
            }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === "paid"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Paid / processing
            {paidList.length > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({paidList.length})</span>
            )}
          </button>
        </div>

        {error && !loading && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-500 mt-8">Loading…</p>
        ) : activeList.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-slate-800 font-medium">
              {emptyMessage || (challans.length === 0 ? "No challans found for this vehicle." : `No ${tab} challans.`)}
            </p>
            <p className="text-slate-500 text-sm mt-2">
              {challans.length === 0
                ? "This vehicle was checked recently. Try again after a few days or verify the number."
                : tab === "pending" && paidList.length > 0
                  ? "Check the paid / processing tab for other challans."
                  : ""}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {tab === "pending" && paidList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTab("paid")}
                  className="text-emerald-700 font-medium hover:underline"
                >
                  View paid
                </button>
              )}
              <Link href="/vehicle" className="text-emerald-700 font-medium hover:underline">
                Search again
              </Link>
            </div>
          </div>
        ) : (
          <>
            {tab === "pending" && payablePendingList.length > 0 && (
              <div className="sticky top-0 z-20 -mx-6 px-6 py-3 mt-4 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    aria-label="Select all payable pending challans"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Select all
                    <span className="font-normal text-slate-500 ml-1">
                      ({payablePendingList.length} payable
                      {pendingList.length > payablePendingList.length
                        ? ` · ${pendingList.length - payablePendingList.length} not payable`
                        : ""}
                      )
                    </span>
                  </span>
                  {selected.size > 0 && (
                    <span className="ml-auto text-xs text-emerald-700 font-medium">
                      {selected.size} selected
                      {selected.size > CHECKOUT_MAX_CHALLANS && (
                        <span className="text-red-600 block">Max {CHECKOUT_MAX_CHALLANS} per payment</span>
                      )}
                    </span>
                  )}
                </label>
              </div>
            )}

            <ul className={`space-y-3 ${tab === "pending" && pendingList.length > 0 ? "mt-3" : "mt-6"}`}>
              {paginatedList.map((c) => (
                <ChallanCard
                  key={c.uuid}
                  challan={c}
                  selectable={tab === "pending"}
                  selected={selected.has(c.uuid)}
                  onToggle={toggleSelect}
                />
              ))}
            </ul>

            <ChallanPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={activeList.length}
              pageSize={CHALLANS_PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {tab === "pending" && selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{selected.size}</span> selected
              {selected.size > CHECKOUT_MAX_CHALLANS && (
                <span className="block text-xs text-red-600">Max {CHECKOUT_MAX_CHALLANS}</span>
              )}
            </p>
            <button
              type="button"
              onClick={handlePayNow}
              disabled={selected.size > CHECKOUT_MAX_CHALLANS}
              className="flex-1 max-w-xs rounded-xl bg-emerald-600 text-white py-3.5 font-semibold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Pay now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
