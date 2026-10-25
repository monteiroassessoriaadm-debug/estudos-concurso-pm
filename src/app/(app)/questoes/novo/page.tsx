import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestaoForm } from "../questao-form";

export default async function NovaQuestaoPage() {
  const topicos = await prisma.topico.findMany({
    include: { materia: true },
    orderBy: [{ materia: { ordem: "asc" } }, { ordem: "asc" }],
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Nova questão real</h1>
        <p className="text-sm text-slate-500">
          Cadastre apenas questões que realmente caíram em uma prova — informe a fonte.
        </p>
      </div>

      {topicos.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-slate-500">
            Cadastre pelo menos uma matéria e um tópico antes de adicionar questões.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dados da questão</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestaoForm topicos={topicos} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
