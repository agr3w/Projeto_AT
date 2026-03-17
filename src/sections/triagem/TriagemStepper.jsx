import { useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  conteudoOptions,
  defeitoOptions,
  motivoOptions,
  operadorOptions,
} from "../../data/triagemOptions";

const steps = ["Identificacao", "Equipamento", "Diagnostico", "Conclusao"];

const initialFormData = {
  data: "",
  codigoRastreio: "",
  conteudo: "",
  macAddress: "",
  operador: "",
  motivo: "",
  defeito: "",
  numeroChamado: "",
  observacoes: "",
  link: "",
  finalizado: false,
};

export default function TriagemStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  const isLastStep = useMemo(() => activeStep === steps.length - 1, [activeStep]);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      console.log("Triagem salva:", formData);
      return;
    }

    setActiveStep((previous) => previous + 1);
  };

  const handleBack = () => {
    setActiveStep((previous) => previous - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={formData.data}
                onChange={handleChange("data")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Codigo de Rastreio"
                value={formData.codigoRastreio}
                onChange={handleChange("codigoRastreio")}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="conteudo-label">Conteudo</InputLabel>
                <Select
                  labelId="conteudo-label"
                  label="Conteudo"
                  value={formData.conteudo}
                  onChange={handleChange("conteudo")}
                >
                  {conteudoOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="MAC Address"
                value={formData.macAddress}
                onChange={handleChange("macAddress")}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="operador-label">Operador</InputLabel>
                <Select
                  labelId="operador-label"
                  label="Operador"
                  value={formData.operador}
                  onChange={handleChange("operador")}
                >
                  {operadorOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="motivo-label">Motivo</InputLabel>
                <Select
                  labelId="motivo-label"
                  label="Motivo"
                  value={formData.motivo}
                  onChange={handleChange("motivo")}
                >
                  {motivoOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="defeito-label">Defeito</InputLabel>
                <Select
                  labelId="defeito-label"
                  label="Defeito"
                  value={formData.defeito}
                  onChange={handleChange("defeito")}
                >
                  {defeitoOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Numero do Chamado"
                value={formData.numeroChamado}
                onChange={handleChange("numeroChamado")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Link"
                value={formData.link}
                onChange={handleChange("link")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Observacoes"
                value={formData.observacoes}
                onChange={handleChange("observacoes")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.finalizado}
                    onChange={handleChange("finalizado")}
                  />
                }
                label="Finalizado"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Triagem de Equipamentos
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>{renderStepContent()}</Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          gap: 2,
        }}
      >
        <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
          Voltar
        </Button>

        <Button variant="contained" onClick={handleNext}>
          {isLastStep ? "Salvar Triagem" : "Avancar"}
        </Button>
      </Box>
    </Paper>
  );
}
