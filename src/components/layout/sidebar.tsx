"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materias", label: "Matérias e Tópicos", icon: BookOpen },
  { href: "/questoes", label: "Banco de Questões", icon: HelpCircle },
  { href: "/praticar", label: "Praticar", icon: PlayCircle },
  { href: "/erros", label: "Caderno de Erros", icon: AlertTriangle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-y-auto bg-slate-950 text-slate-200">
      <div className="px-5 py-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Concurso
        </p>
        <p className="text-lg font-bold text-white">Estudos PM</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-[11px] text-slate-500">Questões reais, foco real.</div>
    </aside>
  );
}
