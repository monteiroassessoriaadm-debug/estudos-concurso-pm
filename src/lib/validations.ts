import { z } from "zod";

const normalizedEmail = z
  .string()
  .email("Informe um e-mail válido.")
  .transform((v) => v.trim().toLowerCase());

export const loginSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1, "Informe a senha."),
});

export const materiaSchema = z.object({
  nome: z.string().min(2, "Informe o nome da matéria."),
});

export const topicoSchema = z.object({
  materiaId: z.string().min(1, "Selecione a matéria."),
  nome: z.string().min(2, "Informe o nome do tópico."),
});

const alternativaSchema = z.object({
  letra: z.string().min(1).max(1),
  texto: z.string().min(1, "Preencha o texto da alternativa."),
});

export const questaoSchema = z.object({
  topicoId: z.string().min(1, "Selecione o tópico."),
  enunciado: z.string().min(10, "Enunciado muito curto."),
  alternativas: z.array(alternativaSchema).min(2, "Inclua pelo menos 2 alternativas."),
  gabarito: z.string().min(1, "Informe a letra do gabarito."),
  explicacao: z.string().optional(),
  concurso: z.string().min(2, "Informe o concurso de origem."),
  banca: z.string().min(2, "Informe a banca organizadora."),
  estado: z.string().min(2, "Informe o estado (UF)."),
  ano: z.coerce.number().int().min(1990).max(2100),
  fonteUrl: z.string().optional(),
  nivel: z.enum(["FACIL", "MEDIO", "DIFICIL"]).default("MEDIO"),
});
