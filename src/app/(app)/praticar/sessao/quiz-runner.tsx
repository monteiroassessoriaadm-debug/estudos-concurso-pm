"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submeterRespostasAction } from "../actions";

type Questao = {
  id: string;
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
};

export function QuizRunner({ topicoId, questoes }: { topicoId: string; questoes: Questao[] }) {
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const questao = questoes[index];
  const isLast = index === questoes.length - 1;
  const respondidas = Object.keys(respostas).length;

  return (
    <form action={submeterRespostasAction} className="space-y-4">
      <input type="hidden" name="topicoId" value={topicoId} />
      {questoes.map((q) => (
        <input key={q.id} type="hidden" name="questaoId" value={q.id} />
      ))}
      {Object.entries(respostas).map(([questaoId, letra]) => (
        <input key={questaoId} type="hidden" name={`resposta_${questaoId}`} value={letra} />
      ))}

      <Card>
        <CardContent className="space-y-4 py-5">
          <p className="text-xs text-slate-400">
            Questão {index + 1} de {questoes.length} — {respondidas} respondida(s)
          </p>
          <p className="text-sm text-slate-800">{questao.enunciado}</p>
          <div className="space-y-2">
            {questao.alternativas.map((alt) => {
              const selected = respostas[questao.id] === alt.letra;
              return (
                <button
                  key={alt.letra}
                  type="button"
                  onClick={() =>
                    setRespostas((prev) => ({ ...prev, [questao.id]: alt.letra }))
                  }
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-semibold">{alt.letra})</span>
                  <span>{alt.texto}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Anterior
        </Button>

        {isLast ? (
          <Button type="submit" disabled={respondidas < questoes.length}>
            Finalizar e corrigir
          </Button>
        ) : (
          <Button type="button" onClick={() => setIndex((i) => Math.min(questoes.length - 1, i + 1))}>
            Próxima
          </Button>
        )}
      </div>
    </form>
  );
}
