import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BarChart, PieChart } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";

const safeParseTriagens = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("triagens_at") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getModa = (values) => {
  const contador = values.reduce((acc, valor) => {
    const key = valor && String(valor).trim() ? String(valor).trim() : "Nao informado";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(contador);
  if (entries.length === 0) {
    return "-";
  }

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
};

const isWithinRange = (dateString, startDate, endDate) => {
  if (!dateString) {
    return false;
  }

  if (startDate && dateString < startDate) {
    return false;
  }

  if (endDate && dateString > endDate) {
    return false;
  }

  return true;
};

export default function PainelGestor() {
  const navigate = useNavigate();
  const [triagens, setTriagens] = useState(safeParseTriagens);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    const syncTriagens = () => {
      setTriagens(safeParseTriagens());
    };

    window.addEventListener("storage", syncTriagens);
    window.addEventListener("focus", syncTriagens);

    return () => {
      window.removeEventListener("storage", syncTriagens);
      window.removeEventListener("focus", syncTriagens);
    };
  }, []);

  const triagensFiltradas = useMemo(() => {
    return triagens.filter((triagem) =>
      isWithinRange(triagem.data, dataInicial, dataFinal),
    );
  }, [triagens, dataInicial, dataFinal]);

  const totalEquipamentos = useMemo(() => {
    return triagensFiltradas.reduce((acc, triagem) => {
      const totalTriagem = (triagem.equipamentos || []).reduce((sum, item) => {
        const quantidade = Number(item.quantidade) || 0;
        return sum + quantidade;
      }, 0);

      return acc + totalTriagem;
    }, 0);
  }, [triagensFiltradas]);

  const motivoMaisComum = useMemo(
    () => getModa(triagensFiltradas.map((item) => item.motivo)),
    [triagensFiltradas],
  );

  const defeitoMaisComum = useMemo(
    () => getModa(triagensFiltradas.map((item) => item.defeito)),
    [triagensFiltradas],
  );

  const defeitoBarData = useMemo(() => {
    const counts = triagensFiltradas.reduce((acc, triagem) => {
      const key = triagem.defeito && triagem.defeito.trim() ? triagem.defeito : "Nao informado";
      const equipamentosTriagem = (triagem.equipamentos || []).reduce((sum, item) => {
        const quantidade = Number(item.quantidade) || 0;
        return sum + quantidade;
      }, 0);

      acc[key] = (acc[key] || 0) + equipamentosTriagem;
      return acc;
    }, {});

    const labels = Object.keys(counts);
    const values = labels.map((label) => counts[label]);

    return { labels, values };
  }, [triagensFiltradas]);

  const motivosPieData = useMemo(() => {
    const counts = triagensFiltradas.reduce((acc, triagem) => {
      const key = triagem.motivo && triagem.motivo.trim() ? triagem.motivo : "Nao informado";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([label, value], index) => ({
      id: index,
      value,
      label,
    }));
  }, [triagensFiltradas]);

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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={dataInicial}
              onChange={(event) => setDataInicial(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={dataFinal}
              onChange={(event) => setDataFinal(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total de Triagens
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {triagensFiltradas.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total de Equipamentos
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {totalEquipamentos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Motivo Mais Comum
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {motivoMaisComum}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Defeito Mais Comum
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {defeitoMaisComum}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Equipamentos com Defeito por Tipo
            </Typography>
            {defeitoBarData.labels.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: "band", data: defeitoBarData.labels }]}
                series={[{ data: defeitoBarData.values, label: "Equipamentos" }]}
                height={320}
              />
            ) : (
              <Typography color="text.secondary">
                Sem dados no periodo selecionado.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Distribuicao de Motivos
            </Typography>
            {motivosPieData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: motivosPieData,
                    innerRadius: 45,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 4,
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
        </Grid>
      </Grid>
    </Container>
  );
}
