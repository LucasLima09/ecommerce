import { useState } from "react";

// why: hover só existe com mouse (web/desktop); no celular os eventos nunca disparam e `hover` fica false.
// hoverProps encaixa em Pressable (onHoverIn/onHoverOut); pointerProps em View (onPointerEnter/onPointerLeave).
export function useHover() {
    const [hover, setHover] = useState(false);

    return {
        hover,
        hoverProps: { onHoverIn: () => setHover(true), onHoverOut: () => setHover(false) },
        pointerProps: { onPointerEnter: () => setHover(true), onPointerLeave: () => setHover(false) },
    };
}
