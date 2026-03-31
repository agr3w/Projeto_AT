import { useMemo, useState } from "react";

const filtrosPadrao = {
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

const areFiltrosIguais = (a, b) => (
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

export function useDashboardFilters() {
  const [filtrosDigitados, setFiltrosDigitados] = useState(filtrosPadrao);
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosPadrao);

  const hasRangeInvalido = useMemo(
    () => Boolean(filtrosDigitados.dataInicial && filtrosDigitados.dataFinal && filtrosDigitados.dataInicial > filtrosDigitados.dataFinal),
    [filtrosDigitados.dataInicial, filtrosDigitados.dataFinal],
  );

  const hasAlteracoesNaoAplicadas = useMemo(
    () => !areFiltrosIguais(filtrosDigitados, filtrosAplicados),
    [filtrosDigitados, filtrosAplicados],
  );

  const quantidadeFiltrosAtivos = useMemo(() => {
    let total = 0;

    if (filtrosAplicados.searchTerm.trim()) total += 1;
    if (filtrosAplicados.operador) total += 1;
    if (filtrosAplicados.status) total += 1;
    if (filtrosAplicados.motivo) total += 1;
    if (filtrosAplicados.defeito) total += 1;
    if (filtrosAplicados.numeroChamado.trim()) total += 1;
    if (filtrosAplicados.dataInicial) total += 1;
    if (filtrosAplicados.dataFinal) total += 1;
    if (filtrosAplicados.apenasComLink) total += 1;
    if (filtrosAplicados.apenasComObservacoes) total += 1;

    return total;
  }, [filtrosAplicados]);

  const hasFiltrosAtivos = quantidadeFiltrosAtivos > 0;

  const setFiltro = (key, value) => {
    setFiltrosDigitados((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const aplicarFiltros = () => {
    if (hasRangeInvalido) {
      return false;
    }

    setFiltrosAplicados(filtrosDigitados);
    return true;
  };

  const limparFiltros = () => {
    setFiltrosDigitados(filtrosPadrao);
    setFiltrosAplicados(filtrosPadrao);
  };

  return {
    filtrosDigitados,
    filtrosAplicados,
    hasRangeInvalido,
    hasAlteracoesNaoAplicadas,
    quantidadeFiltrosAtivos,
    hasFiltrosAtivos,
    setFiltro,
    aplicarFiltros,
    limparFiltros,
  };
}
