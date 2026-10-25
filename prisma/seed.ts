import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const MATERIAS: { nome: string; topicos: string[] }[] = [
  {
    nome: "Português",
    topicos: [
      "Interpretação de texto",
      "Ortografia",
      "Acentuação gráfica",
      "Crase",
      "Concordância verbal e nominal",
      "Regência verbal e nominal",
      "Classes de palavras",
      "Pontuação",
    ],
  },
  {
    nome: "Matemática",
    topicos: [
      "Porcentagem",
      "Regra de três simples e composta",
      "Razão e proporção",
      "Equações do 1º e 2º grau",
      "Sistema de medidas",
      "Juros simples e compostos",
    ],
  },
  {
    nome: "Raciocínio Lógico",
    topicos: ["Lógica proposicional", "Sequências e padrões", "Análise combinatória", "Probabilidade"],
  },
  {
    nome: "Atualidades",
    topicos: ["Política nacional", "Economia", "Meio ambiente", "Segurança pública"],
  },
  {
    nome: "Direito Constitucional",
    topicos: ["Direitos e garantias fundamentais", "Organização do Estado", "Forças de Segurança na Constituição"],
  },
  {
    nome: "Direito Administrativo",
    topicos: ["Princípios da Administração Pública", "Poderes administrativos", "Atos administrativos"],
  },
  {
    nome: "Direitos Humanos",
    topicos: ["Declaração Universal dos Direitos Humanos", "Uso da força e proporcionalidade"],
  },
  {
    nome: "Informática",
    topicos: ["Conceitos básicos de hardware e software", "Internet e segurança da informação", "Pacote Office"],
  },
];

async function main() {
  const email = "estudante@estudospm.com";
  const senhaPadrao = "Estudar@123";

  const existente = await prisma.user.findUnique({ where: { email } });
  if (!existente) {
    await prisma.user.create({
      data: {
        name: "Estudante",
        email,
        passwordHash: await bcrypt.hash(senhaPadrao, 10),
      },
    });
    console.log(`Usuário criado: ${email} / senha: ${senhaPadrao} (troque depois de logar)`);
  } else {
    console.log("Usuário já existia, mantido.");
  }

  for (let i = 0; i < MATERIAS.length; i++) {
    const { nome, topicos } = MATERIAS[i];
    const slug = slugify(nome);
    const materia = await prisma.materia.upsert({
      where: { slug },
      update: {},
      create: { nome, slug, ordem: i },
    });

    for (let j = 0; j < topicos.length; j++) {
      const topicoNome = topicos[j];
      const topicoSlug = slugify(topicoNome);
      await prisma.topico.upsert({
        where: { materiaId_slug: { materiaId: materia.id, slug: topicoSlug } },
        update: {},
        create: { materiaId: materia.id, nome: topicoNome, slug: topicoSlug, ordem: j },
      });
    }
  }

  console.log("Matérias e tópicos iniciais prontos (núcleo comum de concursos de PM).");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
