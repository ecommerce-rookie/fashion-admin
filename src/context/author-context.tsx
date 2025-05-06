import React, { createContext, useContext, useEffect, useState } from "react";
import authorMiddleware from "@/services/middleware/author-middleware";
import { AuthorLogin } from "@/services/type/user-type";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

type AuthorContextType = {
    author: AuthorLogin | null;
    isAuthorActive: boolean;
    refreshAuthor: () => Promise<void>;
    isLoading: boolean;
};

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

export function AuthorProvider({ children }: { children: React.ReactNode }) {
    const [author, setAuthor] = useState<AuthorLogin | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    const { reset } = useAuthStore((state) => state.auth)


    const handleSignOut = async () => {
        try {
            // Reset auth state locally (clear tokens and user data)
            reset()

            // Show a success message
            toast.success('Signed out successfully.')

            // Navigate directly to the login page
            navigate({ to: '/sign-in', replace: true })
        } catch {
            toast.error('Error signing out. Please try again.')
        }
    }

    // Reset the middleware when the component first mounts
    useEffect(() => {
        // Reset middleware state to ensure clean operation after login/logout cycles
        authorMiddleware.reset();
    }, []);

    useEffect(() => {
        // Register logout handler to automatically logout when author status is invalid
        authorMiddleware.registerLogoutHandler(async () => {
            try {
                await handleSignOut();
            } catch {
                toast.error("Logout failed. Please try again.");
                // If redirection fails, try to force a page reload as fallback
                window.location.href = "/";
            }
        });

        // Start periodic checks when the component mounts on non-auth routes
        authorMiddleware.startPeriodicCheck();

        // Subscribe to author changes
        const unsubscribe = authorMiddleware.subscribe((updatedAuthor) => {
            setAuthor(updatedAuthor);
        });

        // Clean up the subscription and stop checks when component unmounts
        return () => {
            unsubscribe();
            authorMiddleware.stopPeriodicCheck();
        };
    }, []);

    const refreshAuthor = async () => {

        setIsLoading(true);
        try {
            await authorMiddleware.forceCheck();
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        author,
        isAuthorActive: authorMiddleware.isAuthorActive(),
        refreshAuthor,
        isLoading
    };

    return <AuthorContext.Provider value={value}>{children}</AuthorContext.Provider>;
}

export const useAuthor = () => {
    const context = useContext(AuthorContext);
    if (context === undefined) {
        throw new Error("useAuthor must be used within an AuthorProvider");
    }
    return context;
};