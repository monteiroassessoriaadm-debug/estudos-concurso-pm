import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateBR } from "@/lib/utils";

export default async function QuestoesPage({
  searchParams,
}: {
  searchParams: Promise<{ materiaId?: string; topicoId?: string; estado?: string; banca?: string }>;
}) {
  const { materiaId, topicoId, estado, banca } = await searchParams;

  const [questoes, materias] = await Promise.all([
    prisma.questao.findMany({
      where: {
        ...(topicoId ? { topicoId } : materiaId ? { topico: { materiaId } } : {}),
        ...(estado ? { estado: estado.toUpperCase() } : {}),
        ...(banca ? { banca: { contains: banca, mode: "insensitive" } } : {}),
      },
      include: { topico: { include: { materia: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.materia.findMany({
      include: { topicos: { orderBy: { ordem: "asc" } } },
      orderBy: { ordem: "asc" },
    }),
  ]);

  const topicosDisponiveis = materiaId
    ? materias.find((m) => m.id === materiaId)?.topicos ?? []
    : materias.flatMap((m) => m.topicos);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Banco de Questões</h1>
          <p className="text-sm text-slate-500">
            {questoes.length} questão(ões) real(is) cadastrada(s).
          </p>
        </div>
        <Link href="/questoes/novo">
          <Button>
            <Plus className="h-4 w-4" /> Nova questão
          </Button>
        </Link>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <select
          name="materiaId"
          defaultValue={materiaId ?? ""}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">Todas as matérias</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
        <select
          name="topicoId"
          defaultValue={topicoId ?? ""}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">Todos os tópicos</option>
          {topicosDisponiveis.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
        <input
          name="estado"
          defaultValue={estado ?? ""}
          placeholder="UF"
          maxLength={2}
          className="h-10 w-20 rounded-lg border border-slate-300 bg-white px-3 text-sm uppercase"
        />
        <input
          name="banca"
          defaultValue={banca ?? ""}
          placeholder="Banca"
          className="h-10 w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm"
        />
        <Button type="submit" variant="outline">
          Filtrar
        </Button>
      </form>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Enunciado</th>
              <th className="px-4 py-3">Matéria / Tópico</th>
              <th className="px-4 py-3">Concurso</th>
              <th className="px-4 py-3">Banca</th>
              <th className="px-4 py-3">UF</th>
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3">Cadastrada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questoes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="max-w-sm px-4 py-3 text-slate-700">
                  <p className="line-clamp-2">{q.enunciado}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {q.topico.materia.nome} — {q.topico.nome}
                </td>
                <td className="px-4 py-3 text-slate-600">{q.concurso}</td>
                <td className="px-4 py-3 text-slate-600">{q.banca}</td>
                <td className="px-4 py-3">
                  <Badge tone="slate">{q.estado}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{q.ano}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateBR(q.createdAt)}</td>
              </tr>
            ))}
            {questoes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Nenhuma questão encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
