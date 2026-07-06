import { useState } from "react";

export function useRename() {

    const [open, setOpen] = useState(false);

    const [item, setItem] = useState(null);

    const [loading, setLoading] = useState(false);

    const show = (item) => {
        setItem(item);
        setOpen(true);
    };

    const hide = () => {
        setItem(null);
        setOpen(false);
    };

    return {

        open,

        item,

        loading,

        setLoading,

        show,

        hide,
    };
}