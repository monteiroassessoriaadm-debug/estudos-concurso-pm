"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";
import type { MotivoErro } from "@/generated/prisma/enums";

export async function categorizarErroAction(formData: FormData) {
  await requireSession();

  const erroId = String(formData.get("erroId") ?? "");
  const motivo = String(formData.get("motivo") ?? "") as MotivoErro;
  const observacao = String(formData.get("observacao") ?? "").trim();

  if (!erroId) return;

  await prisma.erroRegistro.update({
    where: { id: erroId },
    data: {
      motivo: motivo || null,
      observacao: observacao || null,
      revisado: true,
    },
  });

  revalidatePath("/erros");
}
