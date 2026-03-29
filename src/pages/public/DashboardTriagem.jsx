import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/useAlert";
import { useAuth } from "../../contexts/useAuth";
import { defeitoOptions, motivoOptions } from "../../data/triagemOptions";

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
  const { user, logout } = useAuth();

  const getTriagensDoStorage = () => {
    try {
      const triagensLocalStorage = JSON.parse(
        localStorage.getItem("triagens_at") || "[]",
      );

      if (!Array.isArray(triagensLocalStorage)) {
        return [];
      }

      let houveAjusteDeId = false;
      const baseId = Date.now();
      const triagensComId = triagensLocalStorage.map((triagem, index) => {
        if (
          triagem.id !== undefined &&
          triagem.id !== null &&
          triagem.id !== ""
        ) {
          return triagem;
        }

        houveAjusteDeId = true;
        return {
          ...triagem,
          id: baseId + index,
        };
      });

      if (houveAjusteDeId) {
        localStorage.setItem("triagens_at", JSON.stringify(triagensComId));
      }

      return triagensComId;
    } catch {
      return [];
    }
  };

  const [triagens, setTriagens] = useState(() => {
    return getTriagensDoStorage();
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [operadorFilter, setOperadorFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  // TESTE DE CONEXÃO COM O PHP
  useEffect(() => {
    const testarAPI = async () => {
      try {
        const resposta = await fetch("http://localhost/api-triagem/teste.php");
        const dados = await resposta.json();
        console.log("RESPOSTA DO SERVIDOR PHP:", dados);
        // Opcional: Você pode até disparar o showAlert aqui para ver na tela!
        // showAlert(dados.mensagem, "success");
      } catch (erro) {
        console.error("Erro ao conectar com o PHP:", erro);
      }
    };

    testarAPI();
  }, []);

  const operadorOptions = useMemo(() => {
    const operadores = triagens
      .map((triagem) => triagem.operador)
      .filter((operador) => Boolean(operador && operador.trim()));

    return Array.from(new Set(operadores));
  }, [triagens]);

  const triagensFiltradas = useMemo(() => {
    return triagens.filter((triagem) => {
      const termo = searchTerm.trim().toLowerCase();
      const codigo = (triagem.codigoRastreio || "").toLowerCase();
      const macs = (triagem.equipamentos || [])
        .map((equipamento) => (equipamento.macAddress || "").toLowerCase())
        .join(" ");

      const matchBusca =
        !termo || codigo.includes(termo) || macs.includes(termo);
      const matchOperador =
        !operadorFilter || triagem.operador === operadorFilter;
      const statusTriagem = triagem.finalizado ? "Finalizado" : "Pendente";
      const matchStatus = !statusFilter || statusTriagem === statusFilter;

      return matchBusca && matchOperador && matchStatus;
    });
  }, [triagens, searchTerm, operadorFilter, statusFilter]);

  const formatDateBr = (dateString) => {
    if (!dateString || !dateString.includes("-")) {
      return dateString || "-";
    }

    return dateString.split("-").reverse().join("/");
  };

  const handleDelete = useCallback((id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este registro?",
    );

    if (!confirmar) {
      return;
    }

    const triagensAtualizadas = triagens.filter((triagem) => triagem.id !== id);
    setTriagens(triagensAtualizadas);
    localStorage.setItem("triagens_at", JSON.stringify(triagensAtualizadas));
    showAlert("Registro excluido com sucesso.", "success");
  }, [triagens, showAlert]);

  const handleEdit = useCallback((triagem) => {
    if (!triagem?.id) {
      showAlert("Registro sem ID. Nao foi possivel abrir a edicao.", "error");
      return;
    }

    navigate(`/editar/${triagem.id}`);
  }, [navigate, showAlert]);

  const processRowUpdate = (newRow) => {
    const triagemAtualizada = {
      ...newRow,
      finalizado: newRow.status === "Finalizado",
    };

    delete triagemAtualizada.status;

    const triagensAtualizadas = triagens.map((triagem) =>
      String(triagem.id) === String(newRow.id)
        ? { ...triagem, ...triagemAtualizada }
        : triagem,
    );

    setTriagens(triagensAtualizadas);
    localStorage.setItem("triagens_at", JSON.stringify(triagensAtualizadas));
    showAlert("Campo atualizado rapidamente!", "success");

    return {
      ...newRow,
      finalizado: triagemAtualizada.finalizado,
      status: triagemAtualizada.finalizado ? "Finalizado" : "Pendente",
    };
  };

  const handleProcessRowUpdateError = () => {
    showAlert("Nao foi possivel salvar a edicao rapida.", "error");
  };

  const columns = useMemo(
    () => [
      {
        field: "data",
        headerName: "Data",
        width: 120,
        valueFormatter: (value) => formatDateBr(value),
      },
      {
        field: "codigoRastreio",
        headerName: "Rastreio",
        minWidth: 170,
        flex: 1,
      },
      {
        field: "operador",
        headerName: "Operador",
        minWidth: 150,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: operadorOptions,
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
        field: "numeroChamado",
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
        valueGetter: (_, row) => (row.finalizado ? "Finalizado" : "Pendente"),
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
    [operadorOptions, handleEdit, handleDelete],
  );

  const rows = useMemo(
    () =>
      triagensFiltradas.map((triagem) => ({
        ...triagem,
        status: triagem.finalizado ? "Finalizado" : "Pendente",
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

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Dashboard de Triagem
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {user?.role === "admin" && (
              <Button
                color="secondary"
                variant="contained"
                startIcon={<BarChartIcon />}
                onClick={() => navigate("/admin")}
              >
                Acessar Painel Gestor
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/triagem")}
            >
              Nova Triagem
            </Button>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="Buscar por Codigo de Rastreio ou MAC Address"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={operadorOptions}
                value={operadorFilter}
                onChange={(_, newValue) => setOperadorFilter(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Operador" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Box
          sx={{ display: "flex", gap: 1, mb: 1.5, mt: 0.5, flexWrap: "wrap" }}
        >
          <Chip
            size="small"
            color="success"
            label={`Finalizadas: ${totalFinalizadas}`}
            variant="filled"
          />
          <Chip
            size="small"
            color="warning"
            label={`Pendentes: ${totalPendentes}`}
            variant="outlined"
          />
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.row.status === "Finalizado"
                ? "row-finalizado"
                : "row-pendente"
            }
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            sx={{
              minHeight: 520,
              border: 0,
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#EDF2F7",
                color: "text.primary",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
              },
              "& .MuiDataGrid-row": {
                transition: "background-color 120ms ease",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                bgcolor: "#fafafa",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#f0f7ff",
              },
              "& .MuiDataGrid-row.row-finalizado": {
                boxShadow: "inset 4px 0 0 #2e7d32",
              },
              "& .MuiDataGrid-row.row-pendente": {
                boxShadow: "inset 4px 0 0 #ed6c02",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #dbe8f7",
                bgcolor: "#f4f8fd",
              },
            }}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
