import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  conteudoOptions,
  defeitoOptions,
  motivoOptions,
  operadorOptions,
} from "../../data/triagemOptions";

const steps = ["Identificacao", "Equipamento", "Diagnostico", "Conclusao"];

const createInitialFormData = () => ({
  data: "",
  codigoRastreio: "",
  equipamentos: [{ conteudo: "", quantidade: 1, macAddress: "" }],
  operador: "",
  motivo: "",
  defeito: "",
  numeroChamado: "",
  observacoes: "",
  link: "",
  finalizado: false,
});

export default function TriagemStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(createInitialFormData());

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
      const triagemComId = {
        ...formData,
        id: Date.now(),
      };

      let triagensSalvas = [];

      try {
        triagensSalvas = JSON.parse(localStorage.getItem("triagens_at") || "[]");
        if (!Array.isArray(triagensSalvas)) {
          triagensSalvas = [];
        }
      } catch {
        triagensSalvas = [];
      }

      triagensSalvas.push(triagemComId);
      localStorage.setItem("triagens_at", JSON.stringify(triagensSalvas));

      alert("Triagem salva com sucesso!");
      setFormData(createInitialFormData());
      setActiveStep(0);
      return;
    }

    setActiveStep((previous) => previous + 1);
  };

  const handleBack = () => {
    setActiveStep((previous) => previous - 1);
  };

  const handleAddEquipamento = () => {
    setFormData((previous) => ({
      ...previous,
      equipamentos: [
        ...previous.equipamentos,
        { conteudo: "", quantidade: 1, macAddress: "" },
      ],
    }));
  };

  const handleRemoveEquipamento = (index) => {
    setFormData((previous) => ({
      ...previous,
      equipamentos: previous.equipamentos.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleEquipamentoChange = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      equipamentos: previous.equipamentos.map((equipamento, itemIndex) =>
        itemIndex === index
          ? {
              ...equipamento,
              [field]: value,
            }
          : equipamento,
      ),
    }));
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {formData.equipamentos.map((equipamento, index) => (
              <Grid
                key={index}
                container
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Grid size={{ xs: 12, md: 5 }}>
                  <Autocomplete
                    freeSolo
                    options={conteudoOptions}
                    value={equipamento.conteudo}
                    onChange={(_, newValue) => {
                      handleEquipamentoChange(index, "conteudo", newValue ?? "");
                    }}
                    onInputChange={(_, newInputValue) => {
                      handleEquipamentoChange(index, "conteudo", newInputValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Conteudo" />}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantidade"
                    value={equipamento.quantidade}
                    inputProps={{ min: 1 }}
                    onChange={(event) =>
                      handleEquipamentoChange(
                        index,
                        "quantidade",
                        Number(event.target.value) > 0 ? Number(event.target.value) : 1,
                      )
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="MAC Address"
                    value={equipamento.macAddress}
                    onChange={(event) =>
                      handleEquipamentoChange(index, "macAddress", event.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 1 }}>
                  <IconButton
                    color="error"
                    aria-label="Remover equipamento"
                    onClick={() => handleRemoveEquipamento(index)}
                    disabled={formData.equipamentos.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Box>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddEquipamento}>
                Adicionar Equipamento
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                freeSolo
                options={operadorOptions}
                value={formData.operador}
                onChange={(_, newValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    operador: newValue ?? "",
                  }));
                }}
                onInputChange={(_, newInputValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    operador: newInputValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Operador" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                freeSolo
                options={motivoOptions}
                value={formData.motivo}
                onChange={(_, newValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    motivo: newValue ?? "",
                  }));
                }}
                onInputChange={(_, newInputValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    motivo: newInputValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Motivo" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                freeSolo
                options={defeitoOptions}
                value={formData.defeito}
                onChange={(_, newValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    defeito: newValue ?? "",
                  }));
                }}
                onInputChange={(_, newInputValue) => {
                  setFormData((previous) => ({
                    ...previous,
                    defeito: newInputValue,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Defeito" />}
              />
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
