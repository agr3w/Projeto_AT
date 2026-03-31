import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Box,
  Chip,
  Container,
  CssBaseline,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardFilters } from "../../hooks/useDashboardFilters";
import { defeitoOptions, motivoOptions } from "../../data/triagemOptions";
import DashboardHeaderActions from "../../sections/dashboard/DashboardHeaderActions";
import DashboardFilters from "../../sections/dashboard/DashboardFilters";
import DashboardGridSection from "../../sections/dashboard/DashboardGridSection";
import {
  atualizarTriagem,
  excluirTriagem,
  getFriendlyApiErrorMessage,
  listarTriagens,
  testarConexao,
} from "../../services/api";

const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#004b87",
    },
    secondary: {
      main: "#0080ff",
    },
  },
});

export default function DashboardTriagem() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const [triagens, setTriagens] = useState([]);
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

  const isTriagemFinalizada = useCallback((triagem) => {
    const value = triagem?.finalizado;
    return value === true || value === 1 || value === "1" || value === "t";
  }, []);

  const carregarTriagens = useCallback(async () => {
    try {
      const data = await listarTriagens();

      if (!data?.success) {
        showAlert(data?.message || "Nao foi possivel carregar as triagens.", "error");
        return;
      }

      setTriagens(Array.isArray(data.data) ? data.data : []);
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
  }, [showAlert]);

  useEffect(() => {
    carregarTriagens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Teste automatico de conexao: so roda em desenvolvimento
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

  const triagensFiltradas = useMemo(() => {
    return triagens.filter((triagem) => {
      const termo = filtrosAplicados.searchTerm.trim().toLowerCase();
      const codigo = (triagem.codigo_rastreio || "").toLowerCase();
      const macs = (triagem.equipamentos || [])
        .map((equipamento) => (equipamento.mac_address || "").toLowerCase())
        .join(" ");

      const matchBusca =
        !termo || codigo.includes(termo) || macs.includes(termo);
      const matchOperador =
        !filtrosAplicados.operador || triagem.operador_nome === filtrosAplicados.operador;
      const matchMotivo = !filtrosAplicados.motivo || triagem.motivo === filtrosAplicados.motivo;
      const matchDefeito = !filtrosAplicados.defeito || triagem.defeito === filtrosAplicados.defeito;
      const statusTriagem = isTriagemFinalizada(triagem) ? "Finalizado" : "Pendente";
      const matchStatus = !filtrosAplicados.status || statusTriagem === filtrosAplicados.status;
      const matchNumeroChamado =
        !filtrosAplicados.numeroChamado ||
        String(triagem.numero_chamado || "")
          .toLowerCase()
          .includes(filtrosAplicados.numeroChamado.trim().toLowerCase());
      const matchDataInicial = !filtrosAplicados.dataInicial || (triagem.data || "") >= filtrosAplicados.dataInicial;
      const matchDataFinal = !filtrosAplicados.dataFinal || (triagem.data || "") <= filtrosAplicados.dataFinal;
      const matchComLink = !filtrosAplicados.apenasComLink || Boolean(String(triagem.link || "").trim());
      const matchComObservacoes =
        !filtrosAplicados.apenasComObservacoes || Boolean(String(triagem.observacoes || "").trim());

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
  }, [
    triagens,
    filtrosAplicados,
    isTriagemFinalizada,
  ]);

  const handleAplicarFiltros = () => {
    const applied = aplicarFiltros();

    if (!applied) {
      showAlert("A data inicial nao pode ser maior que a data final.", "warning");
    }
  };

  const handleLimparFiltros = () => {
    limparFiltros();
  };

  const formatDateBr = (dateString) => {
    if (!dateString || !dateString.includes("-")) {
      return dateString || "-";
    }

    return dateString.split("-").reverse().join("/");
  };

  const handleDelete = useCallback(async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este registro?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const data = await excluirTriagem(id);

      if (!data?.success) {
        showAlert(data?.message || "Nao foi possivel excluir o registro.", "error");
        return;
      }

      showAlert(data?.message || "Registro excluido com sucesso.", "success");
      await carregarTriagens();
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
  }, [carregarTriagens, showAlert]);

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

      const data = await atualizarTriagem(newRow.id, payload);

      if (!data?.success) {
        throw new Error(data?.message || "Nao foi possivel atualizar a triagem.");
      }

      showAlert(data?.message || "Campo atualizado rapidamente!", "success");
      await carregarTriagens();

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
  }, [carregarTriagens, showAlert]);

  const handleProcessRowUpdateError = useCallback(() => {
    showAlert("Nao foi possivel salvar a edicao rapida.", "error");
  }, [showAlert]);

  const columns = useMemo(
    () => [
      {
        field: "data",
        headerName: "Data",
        width: 120,
        valueFormatter: (value) => formatDateBr(value),
      },
      {
        field: "codigo_rastreio",
        headerName: "Rastreio",
        minWidth: 170,
        flex: 1,
      },
      {
        field: "operador_nome",
        headerName: "Operador",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "motivo",
        headerName: "Motivo",
        minWidth: 160,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: motivoOptions,
      },
      {
        field: "defeito",
        headerName: "Defeito",
        minWidth: 160,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: defeitoOptions,
      },
      {
        field: "numero_chamado",
        headerName: "Numero do Chamado",
        minWidth: 170,
        flex: 1,
        editable: true,
      },
      {
        field: "observacoes",
        headerName: "Observacoes",
        minWidth: 220,
        flex: 1.2,
        editable: true,
      },
      {
        field: "link",
        headerName: "Link",
        minWidth: 220,
        flex: 1,
        editable: true,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 140,
        flex: 0.8,
        editable: true,
        type: "singleSelect",
        valueOptions: ["Pendente", "Finalizado"],
        valueGetter: (_, row) => (isTriagemFinalizada(row) ? "Finalizado" : "Pendente"),
        renderCell: (params) => {
          const isFinalizado = params.value === "Finalizado";

          return (
            <Chip
              size="small"
              label={isFinalizado ? "Finalizado" : "Pendente"}
              color={isFinalizado ? "success" : "warning"}
              variant={isFinalizado ? "outlined" : "filled"}
            />
          );
        },
      },
      {
        field: "acoes",
        headerName: "Acoes",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 120,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              color="primary"
              aria-label="Editar triagem"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              aria-label="Excluir triagem"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleEdit, handleDelete, isTriagemFinalizada],
  );

  const rows = useMemo(
    () =>
      triagensFiltradas.map((triagem) => ({
        ...triagem,
        status: isTriagemFinalizada(triagem) ? "Finalizado" : "Pendente",
      })),
    [triagensFiltradas, isTriagemFinalizada],
  );

  const totalFinalizadas = useMemo(
    () => rows.filter((row) => row.status === "Finalizado").length,
    [rows],
  );

  const totalPendentes = useMemo(
    () => rows.filter((row) => row.status === "Pendente").length,
    [rows],
  );

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DashboardHeaderActions
          isAdmin={user?.role === "admin"}
          onOpenManagerPanel={() => navigate("/admin")}
          onOpenNewTriagem={() => navigate("/triagem")}
        />

        <DashboardFilters
          filtros={filtrosDigitados}
          setFiltro={setFiltro}
          operadorOptions={operadorOptions}
          motivoFilterOptions={motivoFilterOptions}
          defeitoFilterOptions={defeitoFilterOptions}
          hasRangeInvalido={hasRangeInvalido}
          hasFiltrosAtivos={hasFiltrosAtivos}
          hasAlteracoesNaoAplicadas={hasAlteracoesNaoAplicadas}
          quantidadeFiltrosAtivos={quantidadeFiltrosAtivos}
          handleAplicarFiltros={handleAplicarFiltros}
          handleLimparFiltros={handleLimparFiltros}
        />

        <DashboardGridSection
          rows={rows}
          columns={columns}
          totalFinalizadas={totalFinalizadas}
          totalPendentes={totalPendentes}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </Container>
    </ThemeProvider>
  );
}
