import { logoutAction } from "@/app/(app)/logout-action";

export function Topbar({ name }: { name: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
