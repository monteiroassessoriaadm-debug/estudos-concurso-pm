import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Estudos PM
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Sistema de Estudo Estratégico</h1>
          <p className="mt-1 text-sm text-slate-400">Foco, constância e questões reais.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
