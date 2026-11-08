export const SENHA_MIN = 6;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email: string): string | undefined {
    const valor = email.trim();
    if (!valor) return "Informe seu e-mail.";
    if (!EMAIL_REGEX.test(valor)) return "E-mail inválido.";
}

export function validarSenha(senha: string, { minimo = true } = {}): string | undefined {
    if (!senha) return "Informe sua senha.";
    if (minimo && senha.length < SENHA_MIN) return `A senha deve ter no mínimo ${SENHA_MIN} caracteres.`;
}

export function validarConfirmacaoSenha(senha: string, confirmacao: string): string | undefined {
    if (!confirmacao) return "Confirme sua senha.";
    if (senha !== confirmacao) return "As senhas não coincidem.";
}
