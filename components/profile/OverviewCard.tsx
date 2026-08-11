"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

type OverviewStats = {
  total: number;
  interviews: number;
  offers: number;
};

type OverviewCardProps = {
  stats: OverviewStats;
};

export function OverviewCard({ stats }: OverviewCardProps) {
  return (
    <div className="h-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <h3 className="mb-6 flex items-center gap-2 text-headline-md font-semibold text-on-surface">
        <MaterialIcon name="bar_chart" className="text-secondary" />
        Overview
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <MaterialIcon name="description" className="text-[18px]" />
            </div>
            <span className="text-body-sm font-medium text-on-surface">
              Total Applications
            </span>
          </div>
          <span className="text-headline-md font-semibold text-primary">
            {stats.total}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <MaterialIcon name="forum" className="text-[18px]" />
            </div>
            <span className="text-body-sm font-medium text-on-surface">
              Interviews
            </span>
          </div>
          <span className="text-headline-md font-semibold text-secondary">
            {stats.interviews}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#059669]/10 text-[#059669]">
              <MaterialIcon name="task_alt" className="text-[18px]" />
            </div>
            <span className="text-body-sm font-medium text-on-surface">
              Offers
            </span>
          </div>
          <span className="text-headline-md font-semibold text-[#059669]">
            {stats.offers}
          </span>
        </div>
      </div>
    </div>
  );
}
