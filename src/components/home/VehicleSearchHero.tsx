"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiRequest, CHALLAN_FETCH_TIMEOUT_MS } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { RecentVehicle } from "@/lib/vehicles/types";
import { IconHistory, IconVehicle } from "./icons";

interface FetchResult {
  vehicle_number: string;
  count: number;
  challans: unknown[];
  no_challans_found?: boolean;
  from_cache?: boolean;
}

const LOCAL_RECENT_KEY = "dc_recent_vehicles";

function loadLocalRecent(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_RECENT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveLocalRecent(vehicleNumber: string) {
  const prev = loadLocalRecent().filter((v) => v !== vehicleNumber);
  localStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify([vehicleNumber, ...prev].slice(0, 8)));
}

export function VehicleSearchHero() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<RecentVehicle[]>([]);

  const valid = vehicleNumber.replace(/\s/g, "").length >= 6;

  const loadRecent = useCallback(async () => {
    try {
      const data = await apiRequest<RecentVehicle[]>("get", "/vehicles/recent/");
      setRecent(data);
    } catch {
      setRecent(
        loadLocalRecent().map((v) => ({
          vehicle_number: v,
          vehicle_type: "private",
          display_label: "",
          maker_model: "",
          last_searched_at: null,
          search_count: 0,
        })),
      );
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  async function searchVehicle(number: string) {
    const vn = number.toUpperCase().trim();
    if (vn.length < 6) return;
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest<FetchResult>(
        "post",
        "/challans/fetch/",
        {
          vehicle_number: vn,
          vehicle_type: "private",
        },
        { timeout: CHALLAN_FETCH_TIMEOUT_MS },
      );
      saveLocalRecent(vn);
      sessionStorage.setItem("dc_last_fetch", JSON.stringify(data));
      sessionStorage.setItem("dc_vehicle", data.vehicle_number);
      if (data.no_challans_found) {
        setError("No pending challans found for this vehicle.");
        return;
      }
      router.push(`/challans?vehicle=${encodeURIComponent(data.vehicle_number)}`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    searchVehicle(vehicleNumber);
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pt-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-tight tracking-tight max-w-2xl">
          Check &amp; settle traffic challans instantly
        </h1>
        <p className="mt-3 text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
          Search pending challans, pay securely, and track settlement updates — all in one place.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-8">
        <label htmlFor="vehicle" className="sr-only">
          Vehicle number
        </label>
        <div
          className={`relative flex items-center rounded-2xl border-2 bg-white shadow-sm transition-all ${
            loading
              ? "border-emerald-300 ring-4 ring-emerald-500/15"
              : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/20"
          }`}
        >
          <span className="pl-4 text-slate-400">
            <IconVehicle />
          </span>
          <input
            id="vehicle"
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
            required
            minLength={6}
            maxLength={12}
            autoComplete="off"
            disabled={loading}
            placeholder="Enter vehicle number (e.g. DL01AB1234)"
            className="flex-1 bg-transparent px-3 py-4 text-lg uppercase tracking-wider text-slate-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 outline-none disabled:opacity-60"
          />
        </div>

        {loading && (
          <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        )}

        {recent.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
              <IconHistory className="w-3.5 h-3.5" />
              Recent searches
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {recent.map((v) => (
                <button
                  key={v.vehicle_number}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setVehicleNumber(v.vehicle_number);
                    searchVehicle(v.vehicle_number);
                  }}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-emerald-400 hover:bg-emerald-50/50 transition disabled:opacity-50"
                >
                  {v.vehicle_number}
                  {(v.display_label || v.maker_model) && (
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5 truncate max-w-[120px]">
                      {v.display_label || v.maker_model}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={loading || !valid}
          whileHover={valid && !loading ? { scale: 1.01, y: -1 } : {}}
          whileTap={valid && !loading ? { scale: 0.99 } : {}}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 font-semibold text-base shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-45 disabled:shadow-none disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Fetching challans…" : "Check Challans"}
        </motion.button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Online challans ₹99 service fee · Court challans ₹999 settlement fee
        </p>
      </form>
    </section>
  );
}
