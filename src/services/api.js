const API_BASE_URL = "http://localhost/api-triagem";

async function requestJson(endpoint, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const headers = {
    ...(options.headers || {}),
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Erro na comunicacao com a API.");
  }

  return data;
}

export async function testarConexao() {
  return requestJson("teste.php", { method: "GET" });
}

export async function loginUser(email, senha) {
  return requestJson("login.php", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function salvarTriagem(dados) {
  return requestJson("salvar_triagem.php", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}