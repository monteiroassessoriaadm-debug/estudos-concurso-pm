import Link from "next/link";
import { HelpCircle, CheckCircle2, AlertTriangle, BookOpen, Target } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";
import { StatCard, SectionTitle } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await requireSession();

  const [
    totalQuestoesBanco,
    totalMaterias,
    respostas,
    errosNaoCategorizados,
  ] = await Promise.all([
    prisma.questao.count(),
    prisma.materia.count(),
    prisma.resposta.findMany({
      where: { userId: session.userId },
      include: { questao: { include: { topico: { include: { materia: true } } } } },
    }),
    prisma.erroRegistro.count({
      where: { revisado: false, resposta: { userId: session.userId } },
    }),
  ]);

  const totalRespondidas = respostas.length;
  const totalAcertos = respostas.filter((r) => r.correta).length;
  const percentualGeral =
    totalRespondidas > 0 ? Math.round((totalAcertos / totalRespondidas) * 100) : 0;

  const porMateria = new Map<string, { nome: string; total: number; acertos: number }>();
  for (const r of respostas) {
    const materia = r.questao.topico.materia;
    const atual = porMateria.get(materia.id) ?? { nome: materia.nome, total: 0, acertos: 0 };
    atual.total += 1;
    if (r.correta) atual.acertos += 1;
    porMateria.set(materia.id, atual);
  }
  const desempenhoPorMateria = [...porMateria.values()].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Seu painel de estudos</h1>
        <p className="text-sm text-slate-500">
          Acompanhamento em tempo real do seu desempenho com questões reais.
        </p>
      </div>

      {totalQuestoesBanco === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-amber-800">
              Comece cadastrando matérias, tópicos e as primeiras questões reais.
            </p>
            <Link href="/materias">
              <Button size="sm">Começar</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <section>
        <SectionTitle>Visão geral</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Questões no banco"
            value={totalQuestoesBanco}
            icon={HelpCircle}
            tone="blue"
          />
          <StatCard label="Matérias cadastradas" value={totalMaterias} icon={BookOpen} />
          <StatCard
            label="Questões respondidas"
            value={totalRespondidas}
            icon={Target}
            tone="slate"
          />
          <StatCard
            label="Taxa de acerto geral"
            value={totalRespondidas > 0 ? `${percentualGeral}%` : "-"}
            icon={CheckCircle2}
            tone={percentualGeral >= 70 ? "green" : percentualGeral >= 50 ? "amber" : "red"}
          />
        </div>
      </section>

      {errosNaoCategorizados > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between py-4">
            <p className="flex items-center gap-2 text-sm text-red-800">
              <AlertTriangle className="h-4 w-4" />
              {errosNaoCategorizados} erro(s) ainda sem categorizar no caderno de erros.
            </p>
            <Link href="/erros">
              <Button size="sm" variant="outline">
                Revisar agora
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <section>
        <SectionTitle>Desempenho por matéria</SectionTitle>
        {desempenhoPorMateria.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhuma questão respondida ainda — vá em Praticar para começar.
          </p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Taxa de acerto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {desempenhoPorMateria.map((m) => {
                const pct = Math.round((m.acertos / m.total) * 100);
                return (
                  <div key={m.nome} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{m.nome}</span>
                      <span className="text-slate-500">
                        {m.acertos}/{m.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
