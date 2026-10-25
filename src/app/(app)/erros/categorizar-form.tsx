"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categorizarErroAction } from "./actions";

const motivoLabels: Record<string, string> = {
  NAO_SABIA_CONTEUDO: "Não sabia o conteúdo",
  INTERPRETACAO_ERRADA: "Interpretei errado",
  PEGADINHA_BANCA: "Caí em pegadinha da banca",
  DESATENCAO: "Desatenção",
};

export function CategorizarForm({
  erroId,
  motivoAtual,
  observacaoAtual,
}: {
  erroId: string;
  motivoAtual: string | null;
  observacaoAtual: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => categorizarErroAction(formData))}
      className="space-y-2 border-t border-slate-100 pt-3"
    >
      <input type="hidden" name="erroId" value={erroId} />
      <Select name="motivo" defaultValue={motivoAtual ?? ""} className="text-xs">
        <option value="">Por que você errou?</option>
        {Object.entries(motivoLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Textarea
        name="observacao"
        defaultValue={observacaoAtual ?? ""}
        placeholder="Observação (opcional)"
        rows={2}
        className="text-xs"
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
