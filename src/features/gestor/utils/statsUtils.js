export const EMPTY_STATS = {
  resumo: { total: 0, finalizados: 0, pendentes: 0 },
  defeitos: [],
  dias: [],
};

export function normalizeStats(payload) {
  return {
    resumo: {
      total: Number(payload?.resumo?.total || 0),
      finalizados: Number(payload?.resumo?.finalizados || 0),
      pendentes: Number(payload?.resumo?.pendentes || 0),
    },
    defeitos: Array.isArray(payload?.defeitos) ? payload.defeitos : [],
    dias: Array.isArray(payload?.dias) ? payload.dias : [],
  };
}

export function mapDefeitosBarData(stats) {
  const labels = stats.defeitos.map((item) => item.defeito || "Nao informado");
  const values = stats.defeitos.map((item) => Number(item.quantidade || 0));
  return { labels, values };
}

export function mapEvolucaoDiasData(stats) {
  const labels = stats.dias.map((item) => item.data || "-");
  const values = stats.dias.map((item) => Number(item.quantidade || 0));
  return { labels, values };
}

export function formatarPeriodoAtivoLabel(dataInicial, dataFinal) {
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
}

export function isPeriodoInvalido(dataInicial, dataFinal) {
  return Boolean(dataInicial && dataFinal && dataInicial > dataFinal);
}
