import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { buscarEstatisticas, getFriendlyApiErrorMessage } from "../../../services/api";
import {
  EMPTY_STATS,
  formatarPeriodoAtivoLabel,
  isPeriodoInvalido,
  mapDefeitosBarData,
  mapEvolucaoDiasData,
  normalizeStats,
} from "../utils/statsUtils";

export function usePainelGestorController() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [stats, setStats] = useState(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [isFiltrando, setIsFiltrando] = useState(false);

  const hasRangeInvalido = useMemo(
    () => isPeriodoInvalido(dataInicial, dataFinal),
    [dataInicial, dataFinal],
  );

  const carregarEstatisticas = useCallback(async (filtros = {}) => {
    setIsFiltrando(true);

    try {
      const data = await buscarEstatisticas(filtros);

      if (!data?.success) {
        showAlert(data?.message || "Nao foi possivel carregar as estatisticas.", "error");
        setStats(EMPTY_STATS);
        return;
      }

      setStats(normalizeStats(data.data));
    } catch (error) {
      console.error("[PainelGestor] Erro tecnico ao buscar estatisticas:", {
        error,
        message: error?.message,
      });
      showAlert(
        getFriendlyApiErrorMessage(
          error,
          "Nao foi possivel carregar as estatisticas no momento.",
        ),
        "error",
      );
      setStats(EMPTY_STATS);
    } finally {
      setIsFiltrando(false);
    }
  }, [showAlert]);

  useEffect(() => {
    carregarEstatisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAplicarFiltros = useCallback(() => {
    if (hasRangeInvalido) {
      showAlert("Periodo invalido: a data inicial nao pode ser maior que a data final.", "warning");
      return;
    }

    carregarEstatisticas({ dataInicial, dataFinal });
  }, [carregarEstatisticas, dataFinal, dataInicial, hasRangeInvalido, showAlert]);

  const handleLimparFiltros = useCallback(() => {
    setDataInicial("");
    setDataFinal("");
    carregarEstatisticas();
  }, [carregarEstatisticas]);

  const defeitosBarData = useMemo(() => {
    if (!stats) {
      return { labels: [], values: [] };
    }

    return mapDefeitosBarData(stats);
  }, [stats]);

  const evolucaoDiasData = useMemo(() => {
    if (!stats) {
      return { labels: [], values: [] };
    }

    return mapEvolucaoDiasData(stats);
  }, [stats]);

  const periodoAtivoLabel = useMemo(
    () => formatarPeriodoAtivoLabel(dataInicial, dataFinal),
    [dataInicial, dataFinal],
  );

  return {
    isLoading: !stats,
    stats,
    dataInicial,
    dataFinal,
    isFiltrando,
    hasRangeInvalido,
    defeitosBarData,
    evolucaoDiasData,
    periodoAtivoLabel,
    setDataInicial,
    setDataFinal,
    handleAplicarFiltros,
    handleLimparFiltros,
    goToDashboard: () => navigate("/dashboard"),
  };
}
