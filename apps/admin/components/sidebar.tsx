"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  GraduationCap,
  BookOpen,

  Globe,
  MapPin,
  Layers,
  FlaskConical,
  Brain,
  FileText,
  CheckSquare,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useSidebar } from "../lib/sidebar";
import { dashboardApi } from "../lib/api";
import { useEffect, useState } from "react";

const mainNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  { label: "Applications", href: "/applications", icon: BarChart3 },
  { label: "Universities", href: "/universities", icon: GraduationCap },
  { label: "Courses", href: "/courses", icon: BookOpen },

  { label: "Countries", href: "/countries", icon: Globe },
  { label: "Cities", href: "/cities", icon: MapPin },
  { label: "Degrees", href: "/degrees", icon: Layers },
  { label: "Faculties", href: "/faculties", icon: FlaskConical },
];

const workspaceNavItems = [
  {
    label: "AI Knowledge",
    href: "/ai-knowledge",
    icon: Brain,
    badge: "AI",
  },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Tasks", href: "/tasks", icon: CheckSquare, count: "12" },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

function CompassIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    count?: string;
    badge?: string;
  };
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-[10px] md:gap-[10px] w-full rounded-lg transition-colors font-semibold nav-item"
      style={{
        padding: "9px 12px",
        fontSize: "15px",
        fontWeight: isActive ? 600 : 500,
        background: isActive ? "var(--c-nav-active-bg)" : undefined,
        color: isActive ? "#2563eb" : "var(--c-text-2)",
      }}
    >
      <Icon
        width={19}
        height={19}
        stroke="currentColor"
        strokeWidth={1.8}
        style={{ flexShrink: 0 }}
      />
      <span className="flex-1">{item.label}</span>
      {item.count && (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--c-text-4)",
          }}
        >
          {item.count}
        </span>
      )}
      {item.badge && (
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            backgroundColor: "var(--c-chip-ai-bg)",
            color: "var(--c-chip-ai-text)",
            padding: "2px 8px",
            borderRadius: "20px",
          }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open, close } = useSidebar();
  const [counts, setCounts] = useState<Record<string, string>>({});

  // Close sidebar on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Sync nav counts on route change
  useEffect(() => {
    dashboardApi.stats()
      .then((s) => setCounts({
        "/students": s.totalStudents.toLocaleString(),
        "/applications": s.totalApplications.toLocaleString(),
      }))
      .catch(() => {});
  }, [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "var(--c-overlay)" }}
          onClick={close}
        />
      )}

      <aside
        className={`
          flex flex-col h-full
          fixed inset-y-0 left-0 z-50 md:static md:z-auto
          transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          width: "236px",
          background: "var(--c-bg-sidebar)",
          borderRight: "1px solid var(--c-border-alt)",
          padding: "14px 12px",
          flexShrink: 0,
        }}
      >
        {/* Logo row */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "6px 8px 16px 8px" }}
        >
          <div className="flex items-center" style={{ gap: "10px" }}>
            <div
              className="flex items-center justify-center rounded-lg bg-primary"
              style={{ width: "28px", height: "28px", flexShrink: 0 }}
            >
              <CompassIcon />
            </div>
            <div>
              <div
                style={{
                  fontSize: "14.5px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--c-text-1)",
                }}
              >
                Meridian
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 450,
                  color: "var(--c-text-4b)",
                }}
              >
                Study Abroad OS
              </div>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={close}
            className="flex items-center justify-center md:hidden cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "transparent",
              color: "var(--c-text-4)",
              borderRadius: "6px",
            }}
          >
            <X width={18} height={18} strokeWidth={2} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex flex-col flex-1 gap-[4px] md:gap-[1px]" style={{ marginTop: "2px" }}>
          {mainNavItems.map((item) => (
            <NavItem key={item.href} item={{ ...item, count: counts[item.href] }} isActive={isActive(item.href)} onClick={close} />
          ))}

          {/* Admin Users - super admin only */}
          {user?.role === "super_admin" && (
            <NavItem
              item={{ label: "Admin Users", href: "/admin-users", icon: ShieldCheck }}
              isActive={isActive("/admin-users")}
              onClick={close}
            />
          )}

          {/* Separator */}
          <div
            style={{
              height: "1px",
              backgroundColor: "var(--c-border-alt)",
              margin: "8px 0",
            }}
          />

          {/* Workspace label */}
          <div
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "var(--c-text-5)",
              textTransform: "uppercase",
              padding: "4px 10px 6px",
            }}
          >
            Workspace
          </div>

          {workspaceNavItems.map((item) => (
            <NavItem key={item.href} item={item} isActive={isActive(item.href)} onClick={close} />
          ))}
        </nav>

        {/* User section */}
        <div
          style={{
            borderTop: "1px solid var(--c-border-alt)",
            paddingTop: "10px",
            marginTop: "6px",
          }}
        >
          <div className="flex items-center gap-[10px] nav-item rounded-lg transition-colors"
            style={{ padding: "6px 8px" }}
          >
            <div
              className="flex items-center justify-center text-white"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                fontSize: "12px",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  fontSize: "12.5px",
                  fontWeight: 550,
                  color: "var(--c-text-1)",
                }}
              >
                {user ? `${user.first_name} ${user.last_name}` : ""}
              </div>
              <div
                className="truncate"
                style={{ fontSize: "11px", color: "var(--c-text-4b)" }}
              >
                {user?.role === "super_admin" ? "Super Admin" : "Admin"}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "28px",
                height: "28px",
                border: "none",
                background: "transparent",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            >
              <LogOut
                width={15}
                height={15}
                stroke="var(--c-text-5)"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
