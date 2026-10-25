-- CreateEnum
CREATE TYPE "NivelQuestao" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL');

-- CreateEnum
CREATE TYPE "MotivoErro" AS ENUM ('NAO_SABIA_CONTEUDO', 'INTERPRETACAO_ERRADA', 'PEGADINHA_BANCA', 'DESATENCAO');

-- CreateEnum
CREATE TYPE "TipoSessaoEstudo" AS ENUM ('TEORIA', 'QUESTOES', 'REVISAO', 'SIMULADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topicos" (
    "id" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "topicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questoes" (
    "id" TEXT NOT NULL,
    "topicoId" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" JSONB NOT NULL,
    "gabarito" TEXT NOT NULL,
    "explicacao" TEXT,
    "concurso" TEXT NOT NULL,
    "banca" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "fonteUrl" TEXT,
    "nivel" "NivelQuestao" NOT NULL DEFAULT 'MEDIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alternativaEscolhida" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL,
    "sessaoEstudoId" TEXT,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "erros_registro" (
    "id" TEXT NOT NULL,
    "respostaId" TEXT NOT NULL,
    "motivo" "MotivoErro",
    "observacao" TEXT,
    "revisado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "erros_registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes_estudo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicoId" TEXT,
    "tipo" "TipoSessaoEstudo" NOT NULL,
    "duracaoMin" INTEGER NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_estudo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "materias_nome_key" ON "materias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "materias_slug_key" ON "materias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "topicos_materiaId_slug_key" ON "topicos"("materiaId", "slug");

-- CreateIndex
CREATE INDEX "questoes_topicoId_idx" ON "questoes"("topicoId");

-- CreateIndex
CREATE INDEX "questoes_estado_idx" ON "questoes"("estado");

-- CreateIndex
CREATE INDEX "questoes_banca_idx" ON "questoes"("banca");

-- CreateIndex
CREATE INDEX "respostas_userId_idx" ON "respostas"("userId");

-- CreateIndex
CREATE INDEX "respostas_questaoId_idx" ON "respostas"("questaoId");

-- CreateIndex
CREATE UNIQUE INDEX "erros_registro_respostaId_key" ON "erros_registro"("respostaId");

-- CreateIndex
CREATE INDEX "sessoes_estudo_userId_idx" ON "sessoes_estudo"("userId");

-- AddForeignKey
ALTER TABLE "topicos" ADD CONSTRAINT "topicos_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "materias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "topicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_sessaoEstudoId_fkey" FOREIGN KEY ("sessaoEstudoId") REFERENCES "sessoes_estudo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "erros_registro" ADD CONSTRAINT "erros_registro_respostaId_fkey" FOREIGN KEY ("respostaId") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes_estudo" ADD CONSTRAINT "sessoes_estudo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes_estudo" ADD CONSTRAINT "sessoes_estudo_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "topicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
