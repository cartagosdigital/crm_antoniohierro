// supabase/functions/lead-intake/index.ts
// Recebe os leads do widget do site e cria/atualiza contact + project no CRM.
// Público (publicar com --no-verify-jwt). Upsert por session_id para não
// duplicar as capturas parciais do widget.

import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const EVENT_TYPE: Record<string, string> = {
  Wedding: "Casamento",
  "Corporate event": "Corporativo",
  "Evento corporativo": "Corporativo",
  Birthday: "Aniversário",
  Other: "Outro",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  let p: Record<string, unknown>;
  try {
    p = JSON.parse(await req.text());
  } catch {
    return new Response("Invalid body", { status: 400, headers: cors });
  }

  const sessionId = String(p.sessionId ?? "").trim();
  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400, headers: cors });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const rawType = p.eventType ? String(p.eventType) : null;
  const eventType = rawType ? (EVENT_TYPE[rawType] ?? rawType) : null;

  const notes = [
    p.guests ? `Convidados: ${p.guests}` : null,
    p.date ? `Data prevista: ${p.date}` : null,
    p.language ? `Idioma: ${p.language}` : null,
  ].filter(Boolean).join(" · ");

  // contact: upsert por session_id — as capturas parciais completam o mesmo lead.
  // Só entram no payload as chaves que vieram preenchidas: o ON CONFLICT DO UPDATE
  // só escreve as colunas enviadas, portanto o que já estava não é apagado.
  const campos: Record<string, unknown> = {
    session_id: sessionId,
    source: "formulário site",
  };
  if (p.name) campos.name = p.name;
  if (p.email) campos.email = p.email;
  if (p.phone) campos.phone = p.phone;
  if (notes) campos.notes = notes;

  const { data: contact, error: cErr } = await supabase
    .from("contacts")
    .upsert(campos, { onConflict: "session_id" })
    .select("id")
    .single();

  if (cErr) return new Response(cErr.message, { status: 500, headers: cors });

  // project: um por contact — cria no primeiro toque, depois atualiza o tipo
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("contact_id", contact.id)
    .maybeSingle();

  if (existing) {
    if (eventType) {
      await supabase.from("projects").update({ event_type: eventType }).eq("id", existing.id);
    }
  } else {
    await supabase.from("projects").insert({
      contact_id: contact.id,
      event_type: eventType,
      stage: "diagnostico",
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...cors, "content-type": "application/json" },
  });
});
