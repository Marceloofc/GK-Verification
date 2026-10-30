
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("GK Verification está online! 🇧🇷");
    }

    if (request.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");

    if (!signature || !timestamp || !env.DISCORD_PUBLIC_KEY) {
      return new Response("Solicitação inválida", { status: 401 });
    }

    const body = await request.text();

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        hexToBytes(env.DISCORD_PUBLIC_KEY),
        { name: "Ed25519" },
        false,
        ["verify"]
      );

      const valid = await crypto.subtle.verify(
        { name: "Ed25519" },
        key,
        hexToBytes(signature),
        new TextEncoder().encode(timestamp + body)
      );

      if (!valid) {
        return new Response("Assinatura inválida", { status: 401 });
      }

      const interaction = JSON.parse(body);

      if (interaction.type === 1) {
        return Response.json({ type: 1 });
      }

      if (interaction.type === 2) {
        return Response.json({
          type: 4,
          data: {
            content: "🇧🇷 GK Verification está funcionando! O sistema de verificação Roblox será configurado em breve.",
            flags: 64
          }
        });
      }

      return new Response("Interação não suportada", { status: 400 });

    } catch (error) {
      return new Response("Erro ao processar solicitação", { status: 400 });
    }
  }
};
