import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PraticarPage() {
  const materias = await prisma.materia.findMany({
    include: {
      topicos: {
        orderBy: { ordem: "asc" },
        include: { _count: { select: { questoes: true } } },
      },
    },
    orderBy: { ordem: "asc" },
  });

  const totalQuestoes = await prisma.questao.count();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Praticar</h1>
        <p className="text-sm text-slate-500">
          Escolha um tópico para responder questões reais daquele assunto.
        </p>
      </div>

      {totalQuestoes === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-slate-500">
            Ainda não há questões cadastradas. Vá em{" "}
            <span className="font-medium">Banco de Questões</span> e adicione a primeira.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materias
            .filter((m) => m.topicos.some((t) => t._count.questoes > 0))
            .map((materia) => (
              <Card key={materia.id}>
                <CardHeader>
                  <CardTitle>{materia.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {materia.topicos
                    .filter((t) => t._count.questoes > 0)
                    .map((topico) => (
                      <form
                        key={topico.id}
                        action="/praticar/sessao"
                        className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                      >
                        <input type="hidden" name="topicoId" value={topico.id} />
                        <span className="text-sm text-slate-700">
                          {topico.nome}{" "}
                          <span className="text-xs text-slate-400">
                            ({topico._count.questoes} questões)
                          </span>
                        </span>
                        <Button type="submit" size="sm" variant="outline">
                          Praticar
                        </Button>
                      </form>
                    ))}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
