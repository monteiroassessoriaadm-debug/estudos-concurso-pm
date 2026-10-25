import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateBR } from "@/lib/utils";
import { CategorizarForm } from "./categorizar-form";

const motivoLabels: Record<string, string> = {
  NAO_SABIA_CONTEUDO: "Não sabia o conteúdo",
  INTERPRETACAO_ERRADA: "Interpretei errado",
  PEGADINHA_BANCA: "Caí em pegadinha da banca",
  DESATENCAO: "Desatenção",
};

export default async function ErrosPage() {
  const session = await requireSession();

  const erros = await prisma.erroRegistro.findMany({
    where: { resposta: { userId: session.userId } },
    include: {
      resposta: {
        include: { questao: { include: { topico: { include: { materia: true } } } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const naoRevisados = erros.filter((e) => !e.revisado).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Caderno de Erros</h1>
        <p className="text-sm text-slate-500">
          {erros.length} erro(s) registrado(s) — {naoRevisados} ainda sem categorizar.
        </p>
      </div>

      {erros.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-slate-500">
            Nenhum erro registrado ainda — bom sinal, ou você ainda não praticou questões.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {erros.map((erro) => {
            const { questao } = erro.resposta;
            return (
              <Card key={erro.id}>
                <CardContent className="space-y-3 py-4">
                  <div className="flex items-center justify-between">
                    <Badge tone="slate">
                      {questao.topico.materia.nome} — {questao.topico.nome}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatDateBR(erro.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800">{questao.enunciado}</p>
                  <p className="text-xs text-slate-500">
                    Sua resposta:{" "}
                    <span className="font-medium text-red-600">
                      {erro.resposta.alternativaEscolhida}
                    </span>{" "}
                    — Gabarito: <span className="font-medium text-emerald-700">{questao.gabarito}</span>
                  </p>
                  {erro.motivo && (
                    <Badge tone="purple">{motivoLabels[erro.motivo]}</Badge>
                  )}
                  <CategorizarForm
                    erroId={erro.id}
                    motivoAtual={erro.motivo}
                    observacaoAtual={erro.observacao}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
