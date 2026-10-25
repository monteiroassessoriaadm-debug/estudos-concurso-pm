"use client";

import { useActionState } from "react";
import { createQuestaoAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const initialState: FormState = {};
const LETRAS = ["A", "B", "C", "D", "E"] as const;

type Topico = { id: string; nome: string; materia: { nome: string } };

export function QuestaoForm({ topicos }: { topicos: Topico[] }) {
  const [state, formAction, pending] = useActionState(createQuestaoAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="topicoId">Tópico</Label>
        <Select id="topicoId" name="topicoId" required defaultValue="">
          <option value="" disabled>
            Selecione o tópico
          </option>
          {topicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.materia.nome} — {t.nome}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="enunciado">Enunciado</Label>
        <Textarea id="enunciado" name="enunciado" rows={4} required />
      </div>

      <div className="space-y-2">
        <Label>Alternativas (preencha ao menos 2)</Label>
        {LETRAS.map((letra) => (
          <div key={letra} className="flex items-center gap-2">
            <span className="w-5 text-sm font-semibold text-slate-500">{letra}</span>
            <Input name={`alt_${letra}`} placeholder={`Alternativa ${letra}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gabarito">Gabarito (letra correta)</Label>
          <Select id="gabarito" name="gabarito" required defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {LETRAS.map((letra) => (
              <option key={letra} value={letra}>
                {letra}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="nivel">Nível</Label>
          <Select id="nivel" name="nivel" defaultValue="MEDIO">
            <option value="FACIL">Fácil</option>
            <option value="MEDIO">Médio</option>
            <option value="DIFICIL">Difícil</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="explicacao">Explicação (opcional, mas recomendado)</Label>
        <Textarea id="explicacao" name="explicacao" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="concurso">Concurso</Label>
          <Input id="concurso" name="concurso" placeholder="Soldado PM SP" required />
        </div>
        <div>
          <Label htmlFor="banca">Banca</Label>
          <Input id="banca" name="banca" placeholder="Vunesp" required />
        </div>
        <div>
          <Label htmlFor="estado">Estado (UF)</Label>
          <Input id="estado" name="estado" placeholder="SP" maxLength={2} required />
        </div>
        <div>
          <Label htmlFor="ano">Ano</Label>
          <Input id="ano" name="ano" type="number" placeholder="2024" required />
        </div>
      </div>

      <div>
        <Label htmlFor="fonteUrl">Link da fonte (opcional)</Label>
        <Input id="fonteUrl" name="fonteUrl" placeholder="https://..." />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar questão"}
      </Button>
    </form>
  );
}
