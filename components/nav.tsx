"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "ホーム", icon: "🏠" },
  { href: "/learn", label: "学ぶ", icon: "📚" },
  { href: "/challenges", label: "課題", icon: "🎯" },
  { href: "/profile", label: "プロフィール", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                active ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({
  title,
  back,
  right,
}: {
  title: string;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        {back && (
          <Link href={back} className="mr-3 text-gray-600 hover:text-gray-900">
            ←
          </Link>
        )}
        <h1 className="flex-1 font-bold text-gray-900 text-lg">{title}</h1>
        {right}
      </div>
    </header>
  );
}
