export const DASHBOARD_FILTER_DEFAULTS = {
  searchTerm: "",
  operador: null,
  status: "",
  motivo: null,
  defeito: null,
  numeroChamado: "",
  dataInicial: "",
  dataFinal: "",
  apenasComLink: false,
  apenasComObservacoes: false,
};

export function areFiltrosIguais(a, b) {
  return (
    a.searchTerm === b.searchTerm &&
    a.operador === b.operador &&
    a.status === b.status &&
    a.motivo === b.motivo &&
    a.defeito === b.defeito &&
    a.numeroChamado === b.numeroChamado &&
    a.dataInicial === b.dataInicial &&
    a.dataFinal === b.dataFinal &&
    a.apenasComLink === b.apenasComLink &&
    a.apenasComObservacoes === b.apenasComObservacoes
  );
}

export function hasRangeInvalido(filters) {
  return Boolean(
    filters.dataInicial &&
      filters.dataFinal &&
      filters.dataInicial > filters.dataFinal,
  );
}

export function contarFiltrosAtivos(filters) {
  let total = 0;

  if (filters.searchTerm.trim()) total += 1;
  if (filters.operador) total += 1;
  if (filters.status) total += 1;
  if (filters.motivo) total += 1;
  if (filters.defeito) total += 1;
  if (filters.numeroChamado.trim()) total += 1;
  if (filters.dataInicial) total += 1;
  if (filters.dataFinal) total += 1;
  if (filters.apenasComLink) total += 1;
  if (filters.apenasComObservacoes) total += 1;

  return total;
}

export function isTriagemFinalizadaValue(value) {
  return value === true || value === 1 || value === "1" || value === "t";
}

export function isTriagemFinalizada(triagem) {
  return isTriagemFinalizadaValue(triagem?.finalizado);
}

export function buildTriagemSearchBlob(triagem) {
  const codigo = String(triagem.codigo_rastreio || "").toLowerCase();
  const macs = (triagem.equipamentos || [])
    .map((equipamento) => String(equipamento.mac_address || "").toLowerCase())
    .join(" ");

  return `${codigo} ${macs}`.trim();
}

export function applyTriagensFilters(triagens, filtros) {
  const termo = filtros.searchTerm.trim().toLowerCase();
  const numeroChamadoTermo = filtros.numeroChamado.trim().toLowerCase();

  return triagens.filter((triagem) => {
    const matchBusca = !termo || String(triagem._searchBlob || "").includes(termo);
    const matchOperador = !filtros.operador || triagem.operador_nome === filtros.operador;
    const matchMotivo = !filtros.motivo || triagem.motivo === filtros.motivo;
    const matchDefeito = !filtros.defeito || triagem.defeito === filtros.defeito;
    const statusTriagem = isTriagemFinalizada(triagem) ? "Finalizado" : "Pendente";
    const matchStatus = !filtros.status || statusTriagem === filtros.status;
    const matchNumeroChamado =
      !numeroChamadoTermo ||
      String(triagem.numero_chamado || "").toLowerCase().includes(numeroChamadoTermo);
    const matchDataInicial = !filtros.dataInicial || (triagem.data || "") >= filtros.dataInicial;
    const matchDataFinal = !filtros.dataFinal || (triagem.data || "") <= filtros.dataFinal;
    const matchComLink = !filtros.apenasComLink || Boolean(String(triagem.link || "").trim());
    const matchComObservacoes =
      !filtros.apenasComObservacoes || Boolean(String(triagem.observacoes || "").trim());

    return (
      matchBusca &&
      matchOperador &&
      matchMotivo &&
      matchDefeito &&
      matchStatus &&
      matchNumeroChamado &&
      matchDataInicial &&
      matchDataFinal &&
      matchComLink &&
      matchComObservacoes
    );
  });
}
