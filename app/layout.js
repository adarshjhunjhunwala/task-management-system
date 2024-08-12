import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'material-icons/iconfont/material-icons.css';
import SessionWrapper from "./ui/SessionWrapper";
import "./globals.css";
import Loading from "./loading";

export const metadata = {
    title: "Sign in - Task Management System"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <SessionWrapper>
                <body>
                    <Suspense fallback={<Loading />}>
                        {children}
                        <ToastContainer theme="dark" />
                    </Suspense>
                </body>
            </SessionWrapper>
        </html>
    );
}