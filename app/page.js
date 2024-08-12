"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { RingLoader } from "react-spinners";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        await signIn("google");
        setIsLoading(false);
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4">
            <div className="bg-black border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-md text-center w-full max-w-md sm:max-w-xl overflow-hidden">
                <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
                    Task Management System
                </h1>
                <div className="flex justify-center">
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-black border border-gray-700 px-3 py-3 sm:px-4 sm:py-4 rounded-full shadow-md hover:bg-gray-900 w-3/4 sm:w-auto"
                    >
                        {isLoading ? (
                            <RingLoader
                                loading={isLoading}
                                color="#FFFFFF"
                                size={15}
                            />
                        ) : (
                            <>
                                <img
                                    src="https://authjs.dev/img/providers/google.svg"
                                    alt="Google logo"
                                    className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                                />
                                <span className="text-sm sm:text-base">Sign in with Google</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}