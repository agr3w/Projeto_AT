import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { useAuth } from "../../auth";
import { getFriendlyApiErrorMessage, testarConexao } from "../../../services/api";
import {
  applyTriagensFilters,
  buildTriagemSearchBlob,
  isTriagemFinalizada,
} from "../utils/filterUtils";
import { useDashboardFilters } from "./useDashboardFilters";
import { useTriagensData } from "./useTriagensData";
import { useDashboardTriagemColumns } from "./useDashboardTriagemColumns";

export function useDashboardTriagemController() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const {
    triagens,
    isLoadingTriagens,
    carregarTriagens,
    excluirTriagemPorId,
    atualizarTriagemPorId,
  } = useTriagensData();

  const {
    filtrosDigitados,
    filtrosAplicados,
    hasRangeInvalido,
    hasAlteracoesNaoAplicadas,
    quantidadeFiltrosAtivos,
    hasFiltrosAtivos,
    setFiltro,
    aplicarFiltros,
    limparFiltros,
  } = useDashboardFilters();

  const carregarTriagensComFeedback = useCallback(async () => {
    try {
      const resultado = await carregarTriagens();

      if (!resultado?.success) {
        showAlert(resultado?.message || "Nao foi possivel carregar as triagens.", "error");
      }
    } catch (error) {
      console.error("[DashboardTriagem] Erro tecnico ao listar triagens:", {
        error,
        message: error?.message,
      });
      showAlert(
        getFriendlyApiErrorMessage(
          error,
          "Nao foi possivel carregar as triagens no momento.",
        ),
        "error",
      );
    }
  }, [carregarTriagens, showAlert]);

  useEffect(() => {
    carregarTriagensComFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const shouldRunApiHealthcheck =
      import.meta.env.DEV ||
      String(import.meta.env.VITE_ENABLE_API_HEALTHCHECK).toLowerCase() === "true";

    if (!shouldRunApiHealthcheck) {
      return;
    }

    const testarAPI = async () => {
      try {
        const dados = await testarConexao();
        console.log("RESPOSTA DO SERVIDOR PHP:", dados);
      } catch (erro) {
        console.error("[DashboardTriagem] Erro tecnico ao testar conexao:", {
          erro,
          message: erro?.message,
        });
        showAlert(
          getFriendlyApiErrorMessage(
            erro,
            "Nao foi possivel validar a conexao com o servidor.",
          ),
          "warning",
        );
      }
    };

    testarAPI();
  }, [showAlert]);

  const triagensIndexadas = useMemo(() => {
    return triagens.map((triagem) => {
      const codigo = String(triagem.codigo_rastreio || "").toLowerCase();
      return {
        ...triagem,
        _searchBlob: buildTriagemSearchBlob(triagem) || codigo,
      };
    });
  }, [triagens]);

  const operadorOptions = useMemo(() => {
    const operadores = triagens
      .map((triagem) => triagem.operador_nome)
      .filter((operador) => Boolean(operador && operador.trim()));

    return Array.from(new Set(operadores));
  }, [triagens]);

  const motivoFilterOptions = useMemo(() => {
    const motivos = triagens
      .map((triagem) => triagem.motivo)
      .filter((motivo) => Boolean(motivo && motivo.trim()));

    return Array.from(new Set(motivos));
  }, [triagens]);

  const defeitoFilterOptions = useMemo(() => {
    const defeitos = triagens
      .map((triagem) => triagem.defeito)
      .filter((defeito) => Boolean(defeito && defeito.trim()));

    return Array.from(new Set(defeitos));
  }, [triagens]);

  const filtroResultado = useMemo(() => {
    const start = performance.now();

    const data = applyTriagensFilters(triagensIndexadas, filtrosAplicados);

    return {
      data,
      tempoMs: Math.round((performance.now() - start) * 100) / 100,
    };
  }, [triagensIndexadas, filtrosAplicados]);

  const triagensFiltradas = filtroResultado.data;
  const filtroTempoMs = filtroResultado.tempoMs;

  const handleAplicarFiltros = useCallback((overrides = {}) => {
    const applied = aplicarFiltros(overrides);

    if (!applied) {
      showAlert("A data inicial nao pode ser maior que a data final.", "warning");
    }
  }, [aplicarFiltros, showAlert]);

  const handleLimparFiltros = useCallback(() => {
    limparFiltros();
  }, [limparFiltros]);

  const handleDelete = useCallback(async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este registro?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const data = await excluirTriagemPorId(id);

      if (!data?.success) {
        showAlert(data?.message || "Nao foi possivel excluir o registro.", "error");
        return;
      }

      showAlert(data?.message || "Registro excluido com sucesso.", "success");
      await carregarTriagensComFeedback();
    } catch (error) {
      console.error("[DashboardTriagem] Erro tecnico ao excluir triagem:", {
        error,
        message: error?.message,
      });
      showAlert(
        getFriendlyApiErrorMessage(
          error,
          "Nao foi possivel excluir a triagem no momento.",
        ),
        "error",
      );
    }
  }, [carregarTriagensComFeedback, excluirTriagemPorId, showAlert]);

  const handleEdit = useCallback((triagem) => {
    if (!triagem?.id) {
      showAlert("Registro sem ID. Nao foi possivel abrir a edicao.", "error");
      return;
    }

    navigate(`/editar/${triagem.id}`);
  }, [navigate, showAlert]);

  const processRowUpdate = useCallback(async (newRow, oldRow) => {
    try {
      const payload = {};
      const novoFinalizado = newRow.status === "Finalizado";
      const finalizadoAnterior = oldRow.status === "Finalizado";

      if (novoFinalizado !== finalizadoAnterior) {
        payload.finalizado = novoFinalizado;
      }

      if (newRow.observacoes !== oldRow.observacoes) {
        payload.observacoes = newRow.observacoes;
      }

      if (newRow.motivo !== oldRow.motivo) {
        payload.motivo = newRow.motivo;
      }

      if (newRow.defeito !== oldRow.defeito) {
        payload.defeito = newRow.defeito;
      }

      if (newRow.numero_chamado !== oldRow.numero_chamado) {
        payload.numero_chamado = newRow.numero_chamado;
      }

      if (Object.keys(payload).length === 0) {
        return oldRow;
      }

      const data = await atualizarTriagemPorId(newRow.id, payload);

      if (!data?.success) {
        throw new Error(data?.message || "Nao foi possivel atualizar a triagem.");
      }

      showAlert(data?.message || "Campo atualizado rapidamente!", "success");
      await carregarTriagensComFeedback();

      return {
        ...newRow,
        finalizado: novoFinalizado ? 1 : 0,
        status: novoFinalizado ? "Finalizado" : "Pendente",
      };
    } catch (error) {
      console.error("[DashboardTriagem] Erro tecnico na edicao rapida:", {
        error,
        message: error?.message,
      });
      throw error;
    }
  }, [atualizarTriagemPorId, carregarTriagensComFeedback, showAlert]);

  const handleProcessRowUpdateError = useCallback(() => {
    showAlert("Nao foi possivel salvar a edicao rapida.", "error");
  }, [showAlert]);

  const columns = useDashboardTriagemColumns({
    handleEdit,
    handleDelete,
  });

  const rows = useMemo(
    () =>
      triagensFiltradas.map((triagem) => ({
        ...triagem,
        status: isTriagemFinalizada(triagem) ? "Finalizado" : "Pendente",
      })),
    [triagensFiltradas],
  );

  const totalFinalizadas = useMemo(
    () => rows.filter((row) => row.status === "Finalizado").length,
    [rows],
  );

  const totalPendentes = useMemo(
    () => rows.filter((row) => row.status === "Pendente").length,
    [rows],
  );

  return {
    headerProps: {
      isAdmin: user?.role === "admin",
      onOpenManagerPanel: () => navigate("/admin"),
      onOpenNewTriagem: () => navigate("/triagem"),
    },
    filtersProps: {
      filtros: filtrosDigitados,
      setFiltro,
      operadorOptions,
      motivoFilterOptions,
      defeitoFilterOptions,
      hasRangeInvalido,
      hasFiltrosAtivos,
      hasAlteracoesNaoAplicadas,
      quantidadeFiltrosAtivos,
      handleAplicarFiltros,
      handleLimparFiltros,
    },
    gridProps: {
      rows,
      columns,
      totalFinalizadas,
      totalPendentes,
      totalRegistros: triagens.length,
      filtroTempoMs,
      processRowUpdate,
      onProcessRowUpdateError: handleProcessRowUpdateError,
      isLoading: isLoadingTriagens,
    },
  };
}
