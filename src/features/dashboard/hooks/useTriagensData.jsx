import { useCallback, useState } from "react";
import { atualizarTriagem, excluirTriagem, listarTriagens } from "../../../services/api";

export function useTriagensData() {
  const [triagens, setTriagens] = useState([]);
  const [isLoadingTriagens, setIsLoadingTriagens] = useState(false);

  const carregarTriagens = useCallback(async () => {
    setIsLoadingTriagens(true);

    try {
      const data = await listarTriagens();

      if (!data?.success) {
        return {
          success: false,
          message: data?.message || "Nao foi possivel carregar as triagens.",
        };
      }

      setTriagens(Array.isArray(data.data) ? data.data : []);
      return { success: true };
    } finally {
      setIsLoadingTriagens(false);
    }
  }, []);

  const excluirTriagemPorId = useCallback(async (id) => {
    return excluirTriagem(id);
  }, []);

  const atualizarTriagemPorId = useCallback(async (id, payload) => {
    return atualizarTriagem(id, payload);
  }, []);

  return {
    triagens,
    isLoadingTriagens,
    carregarTriagens,
    excluirTriagemPorId,
    atualizarTriagemPorId,
  };
}
