export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("GK Verification está online! 🇧🇷");
    }

    if (request.method === "POST") {
      return new Response(
        JSON.stringify({
          type: 1
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response("Método não permitido", {
      status: 405
    });
  }
};
