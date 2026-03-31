import { useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import DateRangeFilters from "../../sections/filters/DateRangeFilters";
import { buscarEstatisticas, getFriendlyApiErrorMessage } from "../../services/api";
import { useAlert } from "../../hooks/useAlert";

export default function PainelGestor() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [stats, setStats] = useState(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [isFiltrando, setIsFiltrando] = useState(false);

  const hasRangeInvalido = useMemo(() => {
    return Boolean(dataInicial && dataFinal && dataInicial > dataFinal);
  }, [dataInicial, dataFinal]);

  const carregarEstatisticas = async (filtros = {}) => {
    setIsFiltrando(true);
    try {
      const data = await buscarEstatisticas(filtros);

      if (!data?.success) {
        showAlert(data?.message || "Nao foi possivel carregar as estatisticas.", "error");
        setStats({ resumo: { total: 0, finalizados: 0, pendentes: 0 }, defeitos: [], dias: [] });
        return;
      }

      setStats({
        resumo: {
          total: Number(data?.data?.resumo?.total || 0),
          finalizados: Number(data?.data?.resumo?.finalizados || 0),
          pendentes: Number(data?.data?.resumo?.pendentes || 0),
        },
        defeitos: Array.isArray(data?.data?.defeitos) ? data.data.defeitos : [],
        dias: Array.isArray(data?.data?.dias) ? data.data.dias : [],
      });
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
      setStats({ resumo: { total: 0, finalizados: 0, pendentes: 0 }, defeitos: [], dias: [] });
    } finally {
      setIsFiltrando(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAplicarFiltros = () => {
    if (hasRangeInvalido) {
      showAlert("Periodo invalido: a data inicial nao pode ser maior que a data final.", "warning");
      return;
    }

    carregarEstatisticas({ dataInicial, dataFinal });
  };

  const handleLimparFiltros = () => {
    setDataInicial("");
    setDataFinal("");
    carregarEstatisticas();
  };

  const defeitosBarData = useMemo(() => {
    if (!stats) {
      return { labels: [], values: [] };
    }

    const labels = stats.defeitos.map((item) => item.defeito || "Nao informado");
    const values = stats.defeitos.map((item) => Number(item.quantidade || 0));

    return { labels, values };
  }, [stats]);

  const evolucaoDiasData = useMemo(() => {
    if (!stats) {
      return { labels: [], values: [] };
    }

    const labels = stats.dias.map((item) => item.data || "-");
    const values = stats.dias.map((item) => Number(item.quantidade || 0));

    return { labels, values };
  }, [stats]);

  const periodoAtivoLabel = useMemo(() => {
    const formatar = (dataIso) => {
      if (!dataIso || !dataIso.includes("-")) {
        return dataIso || "-";
      }

      return dataIso.split("-").reverse().join("/");
    };

    if (dataInicial && dataFinal) {
      return `Periodo: ${formatar(dataInicial)} ate ${formatar(dataFinal)}`;
    }

    if (dataInicial) {
      return `Periodo: a partir de ${formatar(dataInicial)}`;
    }

    if (dataFinal) {
      return `Periodo: ate ${formatar(dataFinal)}`;
    }

    return "Periodo: geral (sem filtro)";
  }, [dataInicial, dataFinal]);

  if (!stats) {
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
            onClick={() => navigate("/dashboard")}
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
