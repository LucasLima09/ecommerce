// invariant: a API manda preços em centavos (4990 = R$ 49,90).
export function formatarPreco(centavos: number) {
    return (centavos / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
