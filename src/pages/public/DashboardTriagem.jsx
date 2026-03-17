import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  FormControl,
  Grid,
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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  const [triagens, setTriagens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [operadorFilter, setOperadorFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let triagensLocalStorage = [];

    try {
      triagensLocalStorage = JSON.parse(localStorage.getItem("triagens_at") || "[]");
      if (!Array.isArray(triagensLocalStorage)) {
        triagensLocalStorage = [];
      }
    } catch {
      triagensLocalStorage = [];
    }

    setTriagens(triagensLocalStorage);
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
              </TableRow>
            </TableHead>

            <TableBody>
              {triagensFiltradas.length > 0 ? (
                triagensFiltradas.map((triagem) => (
                  <TableRow key={triagem.id || `${triagem.codigoRastreio}-${triagem.data}`}>
                    <TableCell>{triagem.data || "-"}</TableCell>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
