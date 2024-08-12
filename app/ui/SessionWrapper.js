"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default function SessionWrapper({ children }) {
    return (
        <SessionProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                {children}
            </LocalizationProvider>
        </SessionProvider>
    );
}