"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4">
            <div className="bg-black border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-md text-center w-full max-w-md sm:max-w-xl overflow-hidden">
                <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
                    404
                </h1>
                <p>Uh-oh! 🚧 This page is missing. 🚀 'Go Home' to get back.</p>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center justify-center bg-black border border-gray-700 px-3 py-3 sm:px-4 sm:py-4 rounded-full shadow-md hover:bg-gray-900 w-3/4 sm:w-auto"
                    >
                        <span className="text-sm sm:text-base">Go Home</span>
                    </button>
                </div>
            </div>
        </div>
    );
}