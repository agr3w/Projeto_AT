import { useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { AlertContext } from "./AlertContextObject";

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlertState({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertState((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const contextValue = useMemo(
    () => ({
      showAlert,
    }),
    [],
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={alertState.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}
