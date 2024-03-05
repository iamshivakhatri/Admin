"use client";

import { useEffect, useState } from "react";


import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = ()=>{
    const [isMounted, setIsmounted] = useState(false);

    useEffect(()=>{
        setIsmounted(true);
    },[]);

    if (!isMounted) return null;

    return(
        <>
        <StoreModal />
        </>
    );

};