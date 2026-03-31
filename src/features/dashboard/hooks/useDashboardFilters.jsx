import { useCallback, useMemo, useState } from "react";
import {
  areFiltrosIguais,
  contarFiltrosAtivos,
  DASHBOARD_FILTER_DEFAULTS,
  hasRangeInvalido as hasRangeInvalidoByFilters,
} from "../utils/filterUtils";

export function useDashboardFilters() {
  const [filtrosDigitados, setFiltrosDigitados] = useState(DASHBOARD_FILTER_DEFAULTS);
  const [filtrosAplicados, setFiltrosAplicados] = useState(DASHBOARD_FILTER_DEFAULTS);

  const hasRangeInvalido = useMemo(
    () => hasRangeInvalidoByFilters(filtrosDigitados),
    [filtrosDigitados],
  );

  const hasAlteracoesNaoAplicadas = useMemo(
    () => !areFiltrosIguais(filtrosDigitados, filtrosAplicados),
    [filtrosDigitados, filtrosAplicados],
  );

  const quantidadeFiltrosAtivos = useMemo(() => {
    return contarFiltrosAtivos(filtrosAplicados);
  }, [filtrosAplicados]);

  const hasFiltrosAtivos = quantidadeFiltrosAtivos > 0;

  const setFiltro = useCallback((key, value) => {
    setFiltrosDigitados((previous) => ({
      ...(previous[key] === value
        ? previous
        : {
            ...previous,
            [key]: value,
          }),
    }));
  }, []);

  const aplicarFiltros = useCallback((overrides = {}) => {
    const filtrosParaAplicar = {
      ...filtrosDigitados,
      ...overrides,
    };

    const rangeInvalido = hasRangeInvalidoByFilters(filtrosParaAplicar);

    if (rangeInvalido) {
      return false;
    }

    setFiltrosDigitados(filtrosParaAplicar);
    setFiltrosAplicados(filtrosParaAplicar);
    return true;
  }, [filtrosDigitados]);

  const limparFiltros = useCallback(() => {
    setFiltrosDigitados(DASHBOARD_FILTER_DEFAULTS);
    setFiltrosAplicados(DASHBOARD_FILTER_DEFAULTS);
  }, []);

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
