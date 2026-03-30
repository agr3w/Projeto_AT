const API_BASE_URL = "http://localhost/api-triagem";

export function getFriendlyApiErrorMessage(
  error,
  fallbackMessage = "Nao foi possivel concluir a operacao no momento. Tente novamente.",
) {
  const technicalMessage =
    typeof error?.message === "string" ? error.message : String(error || "");

  if (/Failed to fetch|NetworkError|ERR_CONNECTION/i.test(technicalMessage)) {
    return "Nao foi possivel conectar ao servidor. Verifique se a API esta ativa.";
  }

  if (/HTTP\s*401|HTTP\s*403/i.test(technicalMessage)) {
    return "Acesso negado. Verifique suas credenciais e permissoes.";
  }

  if (/HTTP\s*404/i.test(technicalMessage)) {
    return "Servico da API nao encontrado. Verifique a URL e os arquivos no servidor.";
  }

  if (/HTTP\s*5\d{2}/i.test(technicalMessage)) {
    return "O servidor encontrou um erro interno. Tente novamente em instantes.";
  }

  if (/Resposta inesperada da API|JSON/i.test(technicalMessage)) {
    return "O servidor respondeu em formato invalido. Tente novamente em instantes.";
  }

  return fallbackMessage;
}

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

  const rawText = await response.text();
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const statusInfo = `HTTP ${response.status}`;
    const message = data?.message || rawText || "Erro na comunicacao com a API.";
    throw new Error(`${statusInfo}: ${message}`);
  }

  if (data === null) {
    throw new Error(
      "Resposta inesperada da API (nao veio JSON valido).",
    );
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
  try {
    const response = await fetch("http://localhost/api-triagem/salvar_triagem.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return await response.json();
  } catch (error) {
    throw new Error(
      error?.message || "Falha de rede ao salvar triagem.",
    );
  }
}