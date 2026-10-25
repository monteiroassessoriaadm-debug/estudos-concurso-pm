"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";

export async function submeterRespostasAction(formData: FormData) {
  const session = await requireSession();

  const topicoId = String(formData.get("topicoId") ?? "");
  const questaoIds = formData.getAll("questaoId").map(String);

  if (questaoIds.length === 0) {
    redirect("/praticar");
  }

  const questoes = await prisma.questao.findMany({
    where: { id: { in: questaoIds } },
    select: { id: true, gabarito: true },
  });
  const gabaritoPorQuestao = new Map(questoes.map((q) => [q.id, q.gabarito]));

  const sessaoEstudo = await prisma.sessaoEstudo.create({
    data: {
      userId: session.userId,
      topicoId: topicoId || null,
      tipo: "QUESTOES",
      duracaoMin: 0,
    },
  });

  for (const questaoId of questaoIds) {
    const alternativaEscolhida = String(formData.get(`resposta_${questaoId}`) ?? "");
    const gabarito = gabaritoPorQuestao.get(questaoId);
    if (!gabarito) continue;
    const correta = alternativaEscolhida === gabarito;

    const resposta = await prisma.resposta.create({
      data: {
        questaoId,
        userId: session.userId,
        alternativaEscolhida: alternativaEscolhida || "(em branco)",
        correta,
        sessaoEstudoId: sessaoEstudo.id,
      },
    });

    if (!correta) {
      await prisma.erroRegistro.create({ data: { respostaId: resposta.id } });
    }
  }

  redirect(`/praticar/resultado/${sessaoEstudo.id}`);
}
