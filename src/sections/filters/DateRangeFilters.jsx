import { Box, Button, Grid, TextField } from "@mui/material";

export default function DateRangeFilters({
  dataInicial,
  dataFinal,
  onDataInicialChange,
  onDataFinalChange,
  hasRangeInvalido,
  showActions = false,
  onApply,
  onClear,
  applyLabel = "Aplicar filtros",
  clearLabel = "Limpar",
  disableApply = false,
  disableClear = false,
  isApplying = false,
  actionAlign = { xs: "flex-start", md: "flex-end" },
  actionColumnMd = 6,
}) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          label="Data Inicial"
          type="date"
          value={dataInicial}
          onChange={(event) => onDataInicialChange(event.target.value)}
          error={hasRangeInvalido}
          helperText={hasRangeInvalido ? "A data inicial deve ser menor ou igual a data final." : ""}
          inputProps={{ max: dataFinal || undefined }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          label="Data Final"
          type="date"
          value={dataFinal}
          onChange={(event) => onDataFinalChange(event.target.value)}
          error={hasRangeInvalido}
          helperText={hasRangeInvalido ? "A data final deve ser maior ou igual a data inicial." : ""}
          inputProps={{ min: dataInicial || undefined }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {showActions && (
        <Grid size={{ xs: 12, md: actionColumnMd }}>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: actionAlign }}>
            <Button variant="contained" onClick={onApply} disabled={disableApply}>
              {isApplying ? "Aplicando..." : applyLabel}
            </Button>
            <Button variant="outlined" onClick={onClear} disabled={disableClear}>
              {clearLabel}
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
