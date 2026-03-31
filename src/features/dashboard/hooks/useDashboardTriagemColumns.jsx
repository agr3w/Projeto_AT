import { useMemo } from "react";
import { Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { defeitoOptions, motivoOptions } from "../../../data/triagemOptions";

const formatDateBr = (dateString) => {
  if (!dateString || !dateString.includes("-")) {
    return dateString || "-";
  }

  return dateString.split("-").reverse().join("/");
};

export function useDashboardTriagemColumns({ handleEdit, handleDelete }) {
  return useMemo(
    () => [
      {
        field: "data",
        headerName: "Data",
        width: 120,
        valueFormatter: (value) => formatDateBr(value),
      },
      {
        field: "codigo_rastreio",
        headerName: "Rastreio",
        minWidth: 170,
        flex: 1,
      },
      {
        field: "operador_nome",
        headerName: "Operador",
        minWidth: 150,
        flex: 1,
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
        field: "numero_chamado",
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
    [handleEdit, handleDelete],
  );
}
