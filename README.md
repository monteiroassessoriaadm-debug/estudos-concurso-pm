# Estudos PM

Sistema de estudo estratégico pessoal, focado em concursos de Polícia Militar — matérias e tópicos organizados, banco de questões **reais** (nunca geradas), prática com correção automática, caderno de erros categorizado e painel de desempenho.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma 7 + PostgreSQL
- Autenticação por sessão (cookie JWT via `jose`)

## Como rodar localmente

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` (Postgres) e `SESSION_SECRET`.
2. `npm install`
3. `npx prisma migrate dev`
4. `npx prisma db seed` — cria o usuário inicial e as matérias/tópicos comuns de concursos de PM.
5. `npm run dev`

## Estado atual

- [x] Login e sessão
- [x] Matérias e Tópicos (cadastro)
- [x] Banco de Questões reais (cadastro com concurso/banca/estado/ano/fonte)
- [x] Praticar (responder questões, correção automática)
- [x] Caderno de Erros (categorização do motivo)
- [x] Dashboard com desempenho por matéria
- [ ] Aulas/resumos em PDF por tópico
- [ ] Lei seca organizada
- [ ] Revisão espaçada
- [ ] Simulados cronometrados
- [ ] Metas semanais e relatórios exportáveis
