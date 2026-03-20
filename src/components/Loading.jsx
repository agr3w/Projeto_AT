import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        Carregando módulo...
      </Typography>
    </Box>
  );
}
