import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ResultadoSessaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessao = await prisma.sessaoEstudo.findUnique({
    where: { id },
    include: {
      respostas: {
        include: { questao: true },
      },
    },
  });

  if (!sessao) notFound();

  const total = sessao.respostas.length;
  const acertos = sessao.respostas.filter((r) => r.correta).length;
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Resultado</h1>
        <p className="text-sm text-slate-500">
          Você acertou {acertos} de {total} questões ({percentual}%).
        </p>
      </div>

      <div className="space-y-4">
        {sessao.respostas.map(({ questao, alternativaEscolhida, correta }) => {
          const alternativas = questao.alternativas as { letra: string; texto: string }[];
          return (
            <Card key={questao.id}>
              <CardContent className="space-y-2 py-4">
                <div className="flex items-center justify-between">
                  <Badge tone={correta ? "green" : "red"}>
                    {correta ? "Correta" : "Errada"}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {questao.concurso} — {questao.banca}/{questao.estado} {questao.ano}
                  </span>
                </div>
                <p className="text-sm text-slate-800">{questao.enunciado}</p>
                <div className="space-y-1">
                  {alternativas.map((alt) => {
                    const isGabarito = alt.letra === questao.gabarito;
                    const isEscolhida = alt.letra === alternativaEscolhida;
                    return (
                      <p
                        key={alt.letra}
                        className={`rounded px-2 py-1 text-sm ${
                          isGabarito
                            ? "bg-emerald-50 text-emerald-800"
                            : isEscolhida
                              ? "bg-red-50 text-red-800"
                              : "text-slate-600"
                        }`}
                      >
                        <span className="font-semibold">{alt.letra})</span> {alt.texto}
                        {isGabarito && " ✓ gabarito"}
                        {isEscolhida && !isGabarito && " ← sua resposta"}
                      </p>
                    );
                  })}
                </div>
                {questao.explicacao && (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <span className="font-semibold">Explicação: </span>
                    {questao.explicacao}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href="/praticar">
          <Button variant="outline">Praticar outro tópico</Button>
        </Link>
        <Link href="/erros">
          <Button variant="outline">Ver caderno de erros</Button>
        </Link>
      </div>
    </div>
  );
}
