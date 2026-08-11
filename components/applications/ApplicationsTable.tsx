"use client";

import Image from "next/image";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Application, APPLICATIONS_PAGE_SIZE_OPTIONS, formatDate } from "@/lib/applications";
import { getStatusStyle } from "@/lib/status-styles";

type ApplicationsTableProps = {
  applications: Application[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading?: boolean;
  paginationEnabled?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
};

function TablePagination({
  page,
  limit,
  total,
  totalPages,
  isLoading = false,
  paginationEnabled = true,
  onPageChange,
  onLimitChange,
  className = "",
}: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isLoading?: boolean;
  paginationEnabled?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
}) {
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * limit, total);
  const hasPrevPage = paginationEnabled && !isLoading && page > 1;
  const hasNextPage =
    paginationEnabled && !isLoading && total > 0 && page < totalPages;

  return (
    <div
      className={`flex flex-col gap-4 border-t border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="applications-page-size"
          className="text-on-surface-variant"
        >
          Rows per page
        </label>
        <div className="relative">
          <select
            id="applications-page-size"
            value={limit}
            disabled={!paginationEnabled || isLoading}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-3 pr-9 text-body-sm text-on-surface outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {APPLICATIONS_PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <MaterialIcon
            name="expand_more"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
        </div>
        <span className="text-on-surface-variant">
          {paginationEnabled
            ? `Showing ${rangeStart}-${rangeEnd} of ${total}`
            : "Clear status filter to paginate"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-on-surface-variant">
          Page{" "}
          <span className="font-semibold text-on-surface">{page}</span> of{" "}
          <span className="font-semibold text-on-surface">{totalPages}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            aria-disabled={!hasPrevPage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors enabled:hover:bg-surface-container-high enabled:hover:text-on-surface disabled:cursor-not-allowed disabled:border-outline-variant/50 disabled:bg-surface-container-low disabled:text-on-surface-variant/40"
            aria-label="Previous page"
          >
            <MaterialIcon name="chevron_left" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            aria-disabled={!hasNextPage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors enabled:hover:bg-surface-container-high enabled:hover:text-on-surface disabled:cursor-not-allowed disabled:border-outline-variant/50 disabled:bg-surface-container-low disabled:text-on-surface-variant/40"
            aria-label="Next page"
          >
            <MaterialIcon name="chevron_right" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getUrlPreview(url: string): string {
  const withoutProtocol = url.replace(/^https?:\/\//i, "");
  return withoutProtocol.slice(0, 5);
}

function CompanyAvatar({ application }: { application: Application }) {
  if (application.company_logo) {
    return (
      <Image
        src={application.company_logo}
        alt={`${application.company_name} logo`}
        width={24}
        height={24}
        className="h-6 w-6 rounded border border-outline-variant/30 object-cover"
      />
    );
  }

  return (
    <div className="flex h-6 w-6 items-center justify-center rounded border border-outline-variant/30 bg-surface-container-high text-xs font-bold text-on-surface-variant">
      {application.company_name.charAt(0)}
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const statusStyle = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.badge}`}
    >
      {status === "Offer" ? "Offered" : status}
    </span>
  );
}

function JobPostLink({ url }: { url?: string | null }) {
  if (!url) {
    return <span className="text-on-surface-variant/50">—</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-secondary hover:underline"
      title={url}
    >
      <span>{getUrlPreview(url)}</span>
      <MaterialIcon name="open_in_new" className="shrink-0 text-[14px]" />
    </a>
  );
}

function ActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="inline-flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-secondary/10 hover:text-secondary"
        aria-label="Edit application"
      >
        <MaterialIcon name="edit" className="text-[18px]" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-error transition-all hover:bg-error/10"
        aria-label="Delete application"
      >
        <MaterialIcon name="delete" className="text-[18px]" />
      </button>
    </div>
  );
}

export function ApplicationsTable({
  applications,
  page,
  limit,
  total,
  totalPages,
  isLoading = false,
  paginationEnabled = true,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: ApplicationsTableProps) {
  const paginationProps = {
    page,
    limit,
    total,
    totalPages,
    isLoading,
    paginationEnabled,
    onPageChange,
    onLimitChange,
  };

  if (applications.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="p-10 text-center">
          <MaterialIcon
            name="work_off"
            className="mx-auto mb-3 text-4xl text-on-surface-variant"
          />
          <p className="text-body-md text-on-surface-variant">
            No applications match this filter.
          </p>
        </div>
        <TablePagination {...paginationProps} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {applications.map((application) => {
          const statusStyle = getStatusStyle(application.status);

          return (
            <article
              key={application.id}
              className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div
                  className={`min-w-0 flex-1 border-l-4 ${statusStyle.border} pl-3`}
                >
                  <h3 className="truncate font-semibold text-on-surface">
                    {application.job_title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CompanyAvatar application={application} />
                    <span className="truncate">{application.company_name}</span>
                  </div>
                </div>
                <ActionButtons
                  onEdit={() => onEdit(application)}
                  onDelete={() => onDelete(application)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={application.status} />
                <span className="text-body-sm text-on-surface-variant">
                  {formatDate(application.date_applied)}
                </span>
              </div>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                {application.industry}
              </p>
              {application.job_url ? (
                <div className="mt-2">
                  <JobPostLink url={application.job_url} />
                </div>
              ) : null}
            </article>
          );
        })}
        <TablePagination
          {...paginationProps}
          className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-4 py-3 text-table-header font-medium uppercase text-on-surface-variant">
                  Job Title
                </th>
                <th className="px-4 py-3 text-table-header font-medium uppercase text-on-surface-variant">
                  Company
                </th>
                <th className="px-4 py-3 text-table-header font-medium uppercase text-on-surface-variant">
                  Industry
                </th>
                <th className="w-28 px-3 py-3 text-table-header font-medium uppercase text-on-surface-variant">
                  Status
                </th>
                <th className="w-32 px-3 py-3 text-right text-table-header font-medium uppercase text-on-surface-variant">
                  Date Applied
                </th>
                <th className="px-4 py-3 text-table-header font-medium uppercase text-on-surface-variant">
                  Job Post Link
                </th>
                <th className="w-24 px-3 py-3 text-center text-table-header font-medium uppercase text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-container-lowest text-body-sm text-on-surface">
              {applications.map((application) => {
                const statusStyle = getStatusStyle(application.status);

                return (
                  <tr
                    key={application.id}
                    className="border-b border-surface-container-low transition-colors last:border-b-0 hover:bg-secondary/[0.04]"
                  >
                    <td className="px-4 py-4">
                      <div
                        className={`flex items-center gap-2 border-l-4 ${statusStyle.border} pl-3`}
                      >
                        <span className="font-semibold text-on-surface">
                          {application.job_title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CompanyAvatar application={application} />
                        {application.company_name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-on-surface-variant">
                      {application.industry}
                    </td>
                    <td className="w-28 px-3 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="w-32 whitespace-nowrap px-3 py-4 text-right text-on-surface-variant">
                      {formatDate(application.date_applied)}
                    </td>
                    <td className="px-4 py-4">
                      <JobPostLink url={application.job_url} />
                    </td>
                    <td className="w-24 px-3 py-4 text-center">
                      <ActionButtons
                        onEdit={() => onEdit(application)}
                        onDelete={() => onDelete(application)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="p-0">
                  <TablePagination {...paginationProps} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
