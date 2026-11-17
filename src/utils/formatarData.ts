// invariant: a API manda datas em ISO (ex.: "2026-11-16T14:30:00.000Z").
export function formatarData(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
