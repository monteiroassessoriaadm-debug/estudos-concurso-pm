"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/permissions";
import { materiaSchema, topicoSchema } from "@/lib/validations";
import { slugify } from "@/lib/slug";

export type FormState = { error?: string };

export async function createMateriaAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = materiaSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const nome = parsed.data.nome.trim();
  const slug = slugify(nome);

  const existing = await prisma.materia.findFirst({ where: { OR: [{ nome }, { slug }] } });
  if (existing) {
    return { error: "Já existe uma matéria com esse nome." };
  }

  const count = await prisma.materia.count();
  await prisma.materia.create({ data: { nome, slug, ordem: count } });

  revalidatePath("/materias");
  return {};
}

export async function createTopicoAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  const parsed = topicoSchema.safeParse({
    materiaId: formData.get("materiaId"),
    nome: formData.get("nome"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { materiaId, nome } = parsed.data;
  const slug = slugify(nome.trim());

  const existing = await prisma.topico.findFirst({ where: { materiaId, slug } });
  if (existing) {
    return { error: "Esse tópico já existe nessa matéria." };
  }

  const count = await prisma.topico.count({ where: { materiaId } });
  await prisma.topico.create({
    data: { materiaId, nome: nome.trim(), slug, ordem: count },
  });

  revalidatePath("/materias");
  return {};
}

export async function deleteTopicoAction(topicoId: string) {
  await requireSession();
  await prisma.topico.delete({ where: { id: topicoId } });
  revalidatePath("/materias");
}

export async function deleteMateriaAction(materiaId: string) {
  await requireSession();
  await prisma.materia.delete({ where: { id: materiaId } });
  revalidatePath("/materias");
}
