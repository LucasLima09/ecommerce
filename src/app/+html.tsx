import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import type { ReactNode } from "react";

// why: o preenchimento automático do Safari/Chrome pinta o campo de amarelo/azul e troca a cor do texto;
// o box-shadow interno mantém o fundo e o texto escuro dos campos do app (branco).
const cssAutofill = `
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset;
  -webkit-text-fill-color: #171717;
  caret-color: #171717;
  transition: background-color 9999s ease-out 0s;
  font-size: 16px;
  font-family: inherit;
}
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset;
}
input:-webkit-autofill::first-line {
  font-size: 16px;
  font-family: inherit;
}
/* why: o foco já é mostrado pela borda escura do campo inteiro; o contorno padrão do navegador desenharia um segundo retângulo dentro dele. */
input:focus, input:focus-visible { outline: none; }
body { background-color: #F7F7F4; }
`;

export default function Root({ children }: { children: ReactNode }) {
    // invariant: headNodes e bodyNodes precisam ser renderizados; sem bodyNodes a página não hidrata.
    const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

    return (
        <html lang="pt-BR" {...htmlAttributes}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
                <ScrollViewStyleReset />
                <style dangerouslySetInnerHTML={{ __html: cssAutofill }} />
                {headNodes}
            </head>
            <body {...bodyAttributes}>
                {children}
                {bodyNodes}
            </body>
        </html>
    );
}
