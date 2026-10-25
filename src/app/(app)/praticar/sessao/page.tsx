import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QuizRunner } from "./quiz-runner";

export default async function SessaoPraticaPage({
  searchParams,
}: {
  searchParams: Promise<{ topicoId?: string }>;
}) {
  const { topicoId } = await searchParams;
  if (!topicoId) redirect("/praticar");

  const [topico, questoes] = await Promise.all([
    prisma.topico.findUnique({ where: { id: topicoId }, include: { materia: true } }),
    prisma.$queryRaw<
      { id: string; enunciado: string; alternativas: { letra: string; texto: string }[] }[]
    >`SELECT id, enunciado, alternativas FROM questoes WHERE "topicoId" = ${topicoId} ORDER BY RANDOM() LIMIT 10`,
  ]);

  if (!topico || questoes.length === 0) redirect("/praticar");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {topico.materia.nome} — {topico.nome}
        </h1>
        <p className="text-sm text-slate-500">
          {questoes.length} questão(ões) real(is) nesta rodada.
        </p>
      </div>
      <QuizRunner topicoId={topico.id} questoes={questoes} />
    </div>
  );
}
