export type ApplicationStatus =
  "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted";

export type Application = {
  id: number;
  job_title: string;
  company_name: string;
  industry: string;
  status: ApplicationStatus;
  date_applied: string;
  job_url?: string | null;
  company_logo?: string | null;
};

export const INDUSTRIES = [
  "Tech",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
] as const;

export const STATUS_FILTERS: Array<ApplicationStatus | "All"> = [
  "All",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Ghosted",
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    job_title: "Senior Frontend Engineer",
    company_name: "TechNova",
    industry: "Technology",
    status: "Interviewing",
    date_applied: "2023-10-24",
    job_url: "https://example.com/jobs/senior-frontend-engineer",
    company_logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0OMjksqFRbMOweXkvhNtniix2DRldvVr8uBhLIit-oSVX-3tO8hge63cYkIc945Y3I9aicDOC7WXDU8-aNrrCuPfFMdL4K-9FKnN7k2lRoZWr1Eu4UP89GQZ7EbN2MnymH4M9pUfXbEDuVjIYok5zybiiomSKTQ9ZCo2S_sHIWW82KDSXnG4IpvGUcfaNwBmT-j7-nlIdWk-1Jcaj0tZb49qW0-o_RTKC9CXhzuXo-6JdKHMrSrhF",
  },
  {
    id: 2,
    job_title: "Product Designer",
    company_name: "Vanguard Capital",
    industry: "Finance",
    status: "Applied",
    date_applied: "2023-10-22",
    job_url: "https://example.com/jobs/product-designer",
    company_logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB09G8nnas8MeVZoTbRQVgTekZl6AXXlQP80dA-aUeJqf9SkKJ_asVLKns7HtAs2KeNJl2fYAqNH2cFOfjEmLzS0cA3bBC4S_kH-ei3IVEzC1fQTwykJV7cR5jr0Tln532wfkiOi8Z5CUTrNCzVHMNRTpsPiYFXq_um4QZ-OMKGnkg9igw1bC-v7JzBh-XuvA2OWyWZqE7YQchtlPI0iUZPu9Lo52nUIEx2ICPX2v3eJmlWODsuDuse",
  },
  {
    id: 3,
    job_title: "Lead UX Researcher",
    company_name: "HealthSync",
    industry: "Healthcare",
    status: "Offer",
    date_applied: "2023-10-15",
  },
  {
    id: 4,
    job_title: "Full Stack Developer",
    company_name: "StartupX",
    industry: "Technology",
    status: "Rejected",
    date_applied: "2023-10-10",
  },
];

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function countByStatus(
  applications: Application[],
  status: ApplicationStatus | "All",
): number {
  if (status === "All") return applications.length;
  return applications.filter((app) => app.status === status).length;
}
