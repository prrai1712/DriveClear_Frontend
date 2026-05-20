import { TRUST_STRIP } from "@/lib/home/content";
import { HomeIcon } from "./icons";

export function TrustStrip() {
  return (
    <div className="bg-emerald-50/90 border-b border-emerald-100/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs font-medium text-emerald-800">
        {TRUST_STRIP.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <HomeIcon name={item.icon} className="w-3.5 h-3.5 text-emerald-600" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
