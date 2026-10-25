"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";
import { questaoSchema } from "@/lib/validations";

export type FormState = { error?: string };

const LETRAS = ["A", "B", "C", "D", "E"] as const;

export async function createQuestaoAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const alternativas = LETRAS.map((letra) => ({
    letra,
    texto: String(formData.get(`alt_${letra}`) ?? "").trim(),
  })).filter((a) => a.texto.length > 0);

  const raw = {
    topicoId: formData.get("topicoId"),
    enunciado: formData.get("enunciado"),
    alternativas,
    gabarito: formData.get("gabarito"),
    explicacao: formData.get("explicacao") || undefined,
    concurso: formData.get("concurso"),
    banca: formData.get("banca"),
    estado: formData.get("estado"),
    ano: formData.get("ano"),
    fonteUrl: formData.get("fonteUrl") || undefined,
    nivel: formData.get("nivel") || "MEDIO",
  };

  const parsed = questaoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  const data = parsed.data;

  if (!data.alternativas.some((a) => a.letra === data.gabarito)) {
    return { error: "A letra do gabarito precisa corresponder a uma alternativa preenchida." };
  }

  await prisma.questao.create({
    data: {
      topicoId: data.topicoId,
      enunciado: data.enunciado,
      alternativas: data.alternativas,
      gabarito: data.gabarito,
      explicacao: data.explicacao || null,
      concurso: data.concurso,
      banca: data.banca,
      estado: data.estado.toUpperCase(),
      ano: data.ano,
      fonteUrl: data.fonteUrl || null,
      nivel: data.nivel,
    },
  });

  revalidatePath("/questoes");
  redirect("/questoes");
}

export async function deleteQuestaoAction(questaoId: string) {
  await requireSession();
  await prisma.questao.delete({ where: { id: questaoId } });
  revalidatePath("/questoes");
}
