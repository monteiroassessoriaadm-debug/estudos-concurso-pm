"use client";

import { useActionState, useRef, useEffect } from "react";
import { createTopicoAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: FormState = {};

export function TopicoForm({ materiaId }: { materiaId: string }) {
  const [state, formAction, pending] = useActionState(createTopicoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex items-end gap-2">
      <input type="hidden" name="materiaId" value={materiaId} />
      <div className="flex-1">
        <Input name="nome" placeholder="Novo tópico" required />
      </div>
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "..." : "Adicionar"}
      </Button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
