import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MateriaForm } from "./materia-form";
import { TopicoForm } from "./topico-form";
import { DeleteMateriaButton, DeleteTopicoButton } from "./delete-buttons";

export default async function MateriasPage() {
  const materias = await prisma.materia.findMany({
    orderBy: { ordem: "asc" },
    include: {
      topicos: {
        orderBy: { ordem: "asc" },
        include: { _count: { select: { questoes: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Matérias e Tópicos</h1>
        <p className="text-sm text-slate-500">
          Estrutura de conteúdo — cada tópico vai acumular questões reais e aulas conforme o
          sistema crescer.
        </p>
      </div>

      <Card>
        <CardContent className="py-4">
          <MateriaForm />
        </CardContent>
      </Card>

      {materias.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhuma matéria cadastrada ainda.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materias.map((materia) => (
            <Card key={materia.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {materia.nome}
                  <Badge tone="slate">{materia.topicos.length} tópicos</Badge>
                </CardTitle>
                <DeleteMateriaButton materiaId={materia.id} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  {materia.topicos.map((topico) => (
                    <div
                      key={topico.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-700">{topico.nome}</span>
                      <div className="flex items-center gap-2">
                        <Badge tone="blue">{topico._count.questoes} questões</Badge>
                        <DeleteTopicoButton topicoId={topico.id} />
                      </div>
                    </div>
                  ))}
                  {materia.topicos.length === 0 && (
                    <p className="text-xs text-slate-400">Nenhum tópico ainda.</p>
                  )}
                </div>
                <TopicoForm materiaId={materia.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
