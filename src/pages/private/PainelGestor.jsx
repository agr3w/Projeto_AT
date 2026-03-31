import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BarChart, LineChart } from "@mui/x-charts";
import Loading from "../../components/ui/Loading";
import { usePainelGestorController } from "../../features/gestor";
import { DateRangeFilters } from "../../features/shared";

export default function PainelGestor() {
  const {
    isLoading,
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
    goToDashboard,
  } = usePainelGestorController();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Painel Gerencial
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analise consolidada das triagens registradas no sistema.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goToDashboard}
          >
            Voltar ao Dashboard
          </Button>
        </Box>
      </Box>

      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <DateRangeFilters
          dataInicial={dataInicial}
          dataFinal={dataFinal}
          onDataInicialChange={setDataInicial}
          onDataFinalChange={setDataFinal}
          hasRangeInvalido={hasRangeInvalido}
          showActions
          onApply={handleAplicarFiltros}
          onClear={handleLimparFiltros}
          disableApply={hasRangeInvalido || isFiltrando}
          disableClear={isFiltrando}
          isApplying={isFiltrando}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mb: 2,
          px: 2,
          py: 1.2,
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "#f8fbff",
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {periodoAtivoLabel}
        </Typography>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        <Box>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total de Triagens
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {stats.resumo.total}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Finalizadas
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {stats.resumo.finalizados}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pendentes
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {stats.resumo.pendentes}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
        <Box>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Defeitos Mais Comuns
            </Typography>
            {defeitosBarData.labels.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: "band", data: defeitosBarData.labels }]}
                series={[{ data: defeitosBarData.values, label: "Quantidade" }]}
                height={320}
              />
            ) : (
              <Typography color="text.secondary">
                Sem dados no periodo selecionado.
              </Typography>
            )}
          </Paper>
        </Box>

        <Box>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Evolucao Diaria
            </Typography>
            {evolucaoDiasData.labels.length > 0 ? (
              <LineChart
                xAxis={[{ scaleType: "point", data: evolucaoDiasData.labels }]}
                series={[
                  {
                    data: evolucaoDiasData.values,
                    label: "Triagens",
                  },
                ]}
                height={320}
              />
            ) : (
              <Typography color="text.secondary">
                Sem dados no periodo selecionado.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
