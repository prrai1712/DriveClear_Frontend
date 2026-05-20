"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api/client";

interface OrderSummary {
  uuid: string;
  order_type: string;
  order_status: string;
  payment_status: string;
  total_amount: string;
  challan: { challan_number: string; vehicle_number: string };
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  PAYMENT_PENDING: "bg-amber-100 text-amber-800",
  PAYMENT_SUCCESS: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<OrderSummary[]>("get", "/orders/")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      <p className="text-slate-500 text-sm mt-1">Track payments and settlement status</p>

      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No orders yet</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.uuid}
              href={`/orders/${order.uuid}`}
              className="block rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 transition bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">{order.challan.challan_number}</p>
                  <p className="text-sm text-slate-500">{order.challan.vehicle_number}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    STATUS_BADGE[order.order_status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {order.order_status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-slate-500">{order.order_type.replace(/_/g, " ")}</span>
                <span className="font-semibold">₹{order.total_amount}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
