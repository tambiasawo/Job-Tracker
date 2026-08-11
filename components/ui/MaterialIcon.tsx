import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Briefcase,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  Pencil,
  Plus,
  Search,
  Sun,
  Trash2,
  User,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  menu: Menu,
  search: Search,
  dark_mode: Moon,
  light_mode: Sun,
  person: User,
  work_history: BriefcaseBusiness,
  close: X,
  work: Briefcase,
  logout: LogOut,
  open_in_new: ExternalLink,
  edit: Pencil,
  delete: Trash2,
  work_off: BriefcaseBusiness,
  add: Plus,
  arrow_forward: ArrowRight,
  warning: AlertTriangle,
  bar_chart: BarChart3,
  description: FileText,
  forum: MessageSquare,
  task_alt: CircleCheck,
  info: Info,
  person_add: UserPlus,
  expand_more: ChevronDown,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  location_on: MapPin,
  lightbulb: Lightbulb,
};

type MaterialIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

function resolveIconClassName(className: string): string {
  const resolved = className
    .replace(/\btext-\[18px\]/g, "size-[18px]")
    .replace(/\btext-\[14px\]/g, "size-[14px]")
    .replace(/\btext-4xl\b/g, "size-10")
    .replace(/\btext-2xl\b/g, "size-6")
    .replace(/\btext-xl\b/g, "size-5")
    .replace(/\btext-sm\b/g, "size-4");

  if (/\b(size-|h-|w-)/.test(resolved)) {
    return resolved;
  }

  return `${resolved} size-5`.trim();
}

export function MaterialIcon({
  name,
  filled = false,
  className = "",
}: MaterialIconProps) {
  const Icon = ICONS[name];

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      aria-hidden="true"
      className={`inline-block shrink-0 ${resolveIconClassName(className)}`}
      strokeWidth={filled ? 2.25 : 1.75}
      fill={filled ? "currentColor" : "none"}
    />
  );
}
