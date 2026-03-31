import { memo } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DateRangeFilters from "../filters/DateRangeFilters";

const DashboardFilters = memo(function DashboardFilters({
  filtros,
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
}) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Buscar por Codigo de Rastreio ou MAC Address"
            value={filtros.searchTerm}
            onChange={(event) => setFiltro("searchTerm", event.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={operadorOptions}
            value={filtros.operador}
            onChange={(_, newValue) => setFiltro("operador", newValue)}
            renderInput={(params) => <TextField {...params} label="Operador" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              value={filtros.status}
              onChange={(event) => setFiltro("status", event.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={motivoFilterOptions}
            value={filtros.motivo}
            onChange={(_, newValue) => setFiltro("motivo", newValue)}
            renderInput={(params) => <TextField {...params} label="Motivo" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={defeitoFilterOptions}
            value={filtros.defeito}
            onChange={(_, newValue) => setFiltro("defeito", newValue)}
            renderInput={(params) => <TextField {...params} label="Defeito" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Numero do Chamado"
            value={filtros.numeroChamado}
            onChange={(event) => setFiltro("numeroChamado", event.target.value)}
          />
        </Grid>

        <DateRangeFilters
          dataInicial={filtros.dataInicial}
          dataFinal={filtros.dataFinal}
          onDataInicialChange={(value) => setFiltro("dataInicial", value)}
          onDataFinalChange={(value) => setFiltro("dataFinal", value)}
          hasRangeInvalido={hasRangeInvalido}
          actionColumnMd={0}
        />

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: { xs: 0.5, md: 1.5 } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filtros.apenasComLink}
                  onChange={(event) => setFiltro("apenasComLink", event.target.checked)}
                />
              }
              label="Apenas com link"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filtros.apenasComObservacoes}
                  onChange={(event) => setFiltro("apenasComObservacoes", event.target.checked)}
                />
              }
              label="Apenas com observacoes"
            />
            <Button
              variant="contained"
              color={hasFiltrosAtivos ? "secondary" : "primary"}
              onClick={handleAplicarFiltros}
              disabled={hasRangeInvalido || !hasAlteracoesNaoAplicadas}
            >
              Aplicar filtros
            </Button>
            <Button variant="outlined" onClick={handleLimparFiltros}>
              Limpar filtros
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Chip
          size="small"
          color={hasFiltrosAtivos ? "secondary" : "default"}
          variant={hasFiltrosAtivos ? "filled" : "outlined"}
          label={
            hasFiltrosAtivos
              ? `Filtros ativos: ${quantidadeFiltrosAtivos}`
              : "Sem filtros ativos"
          }
        />
        {hasAlteracoesNaoAplicadas && (
          <Typography variant="caption" color="text.secondary">
            Existem alteracoes pendentes. Clique em Aplicar filtros.
          </Typography>
        )}
      </Box>
    </Paper>
  );
});

export default DashboardFilters;
