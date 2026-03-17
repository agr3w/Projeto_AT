import { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/useAlert";

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
  const [triagens, setTriagens] = useState(() => {
    try {
      const triagensLocalStorage = JSON.parse(localStorage.getItem("triagens_at") || "[]");
      return Array.isArray(triagensLocalStorage) ? triagensLocalStorage : [];
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [operadorFilter, setOperadorFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

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

      const matchBusca = !termo || codigo.includes(termo) || macs.includes(termo);
      const matchOperador = !operadorFilter || triagem.operador === operadorFilter;
      const statusTriagem = triagem.finalizado ? "Finalizado" : "Pendente";
      const matchStatus = !statusFilter || statusTriagem === statusFilter;

      return matchBusca && matchOperador && matchStatus;
    });
  }, [triagens, searchTerm, operadorFilter, statusFilter]);

  const getTotalEquipamentos = (equipamentos) => {
    if (!Array.isArray(equipamentos) || equipamentos.length === 0) {
      return 0;
    }

    return equipamentos.reduce((total, equipamento) => {
      const quantidade = Number(equipamento.quantidade) || 0;
      return total + quantidade;
    }, 0);
  };

  const formatDateBr = (dateString) => {
    if (!dateString || !dateString.includes("-")) {
      return dateString || "-";
    }

    return dateString.split("-").reverse().join("/");
  };

  const handleDelete = (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este registro?");

    if (!confirmar) {
      return;
    }

    const triagensAtualizadas = triagens.filter((triagem) => triagem.id !== id);
    setTriagens(triagensAtualizadas);
    localStorage.setItem("triagens_at", JSON.stringify(triagensAtualizadas));
    showAlert("Registro excluido com sucesso.", "success");
  };

  const handleEdit = (triagem) => {
    if (!triagem?.id) {
      showAlert("Registro sem ID. Nao foi possivel abrir a edicao.", "error");
      return;
    }

    navigate(`/editar/${triagem.id}`);
  };

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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/triagem")}
          >
            Nova Triagem
          </Button>
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
                renderInput={(params) => <TextField {...params} label="Operador" />}
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

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>Data</TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>
                  Codigo de Rastreio
                </TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>
                  Operador
                </TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>Motivo</TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>
                  Equipamentos
                </TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: 700 }}>
                  Acoes
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {triagensFiltradas.length > 0 ? (
                triagensFiltradas.map((triagem) => (
                  <TableRow key={triagem.id || `${triagem.codigoRastreio}-${triagem.data}`}>
                    <TableCell>{formatDateBr(triagem.data)}</TableCell>
                    <TableCell>{triagem.codigoRastreio || "-"}</TableCell>
                    <TableCell>{triagem.operador || "-"}</TableCell>
                    <TableCell>{triagem.motivo || "-"}</TableCell>
                    <TableCell>{getTotalEquipamentos(triagem.equipamentos)}</TableCell>
                    <TableCell>
                      <Chip
                        label={triagem.finalizado ? "Finalizado" : "Pendente"}
                        color={triagem.finalizado ? "success" : "warning"}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="Editar triagem"
                        onClick={() => handleEdit(triagem)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="Excluir triagem"
                        onClick={() => handleDelete(triagem.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    Nenhuma triagem encontrada para os filtros informados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
}
