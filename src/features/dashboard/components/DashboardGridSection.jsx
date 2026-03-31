import { memo } from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DashboardGridSection = memo(function DashboardGridSection({
  rows,
  columns,
  totalFinalizadas,
  totalPendentes,
  totalRegistros,
  filtroTempoMs,
  processRowUpdate,
  onProcessRowUpdateError,
  isLoading = false,
}) {
  return (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
        Filtro executado em {filtroTempoMs} ms sobre {totalRegistros} registros.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 1.5, mt: 0.5, flexWrap: "wrap" }}>
        <Chip
          size="small"
          color="success"
          label={`Finalizadas: ${totalFinalizadas}`}
          variant="filled"
        />
        <Chip
          size="small"
          color="warning"
          label={`Pendentes: ${totalPendentes}`}
          variant="outlined"
        />
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.row.status === "Finalizado"
              ? "row-finalizado"
              : "row-pendente"
          }
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          sx={{
            minHeight: 520,
            border: 0,
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#EDF2F7",
              color: "text.primary",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },
            "& .MuiDataGrid-row": {
              transition: "background-color 120ms ease",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              bgcolor: "#fafafa",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "#f0f7ff",
            },
            "& .MuiDataGrid-row.row-finalizado": {
              boxShadow: "inset 4px 0 0 #2e7d32",
            },
            "& .MuiDataGrid-row.row-pendente": {
              boxShadow: "inset 4px 0 0 #ed6c02",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #dbe8f7",
              bgcolor: "#f4f8fd",
            },
          }}
        />
      </Paper>
    </>
  );
});

export default DashboardGridSection;
