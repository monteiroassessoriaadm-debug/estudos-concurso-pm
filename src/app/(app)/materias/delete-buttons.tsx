"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMateriaAction, deleteTopicoAction } from "./actions";

export function DeleteMateriaButton({ materiaId }: { materiaId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Excluir essa matéria e todos os seus tópicos?")) {
          startTransition(() => deleteMateriaAction(materiaId));
        }
      }}
      className="text-slate-400 hover:text-red-600 disabled:opacity-50"
      title="Excluir matéria"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function DeleteTopicoButton({ topicoId }: { topicoId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Excluir esse tópico?")) {
          startTransition(() => deleteTopicoAction(topicoId));
        }
      }}
      className="text-slate-400 hover:text-red-600 disabled:opacity-50"
      title="Excluir tópico"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
