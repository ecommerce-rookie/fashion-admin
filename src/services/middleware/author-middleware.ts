import { getAuthor } from "../api/user-api";
import { AuthorLogin, UserStatus } from "../type/user-type";
import { toast } from "sonner";

// Interval in milliseconds (30 minutes)
const CHECK_INTERVAL = 30 * 60 * 1000;

type LogoutHandler = () => void;

class AuthorMiddleware {
    private intervalId: number | null = null;
    private author: AuthorLogin | null = null;
    private lastFetchTime: number = 0;
    private subscribers: Array<(author: AuthorLogin | null) => void> = [];
    private logoutHandler: LogoutHandler | null = null;

    constructor() {
        // No initial fetch in constructor to prevent fetches on auth pages
    }

    // Reset middleware state after logout/login cycles
    reset(): void {
        this.stopPeriodicCheck();
        this.author = null;
        this.lastFetchTime = 0;
        this.notifySubscribers();
    }

    private async fetchAuthor(): Promise<void> {
        try {
            const response = await getAuthor();
            this.author = response.data ?? null;
            this.lastFetchTime = Date.now();

            // Check status and logout if needed
            if (this.author && !this.isAuthorActive() && this.logoutHandler) {
                toast.error("Your account is no longer active. You will be logged out.");
                // Small delay to allow the toast to be visible before logout
                setTimeout(() => {
                    if (this.logoutHandler) this.logoutHandler();
                }, 1500);
            }

            this.notifySubscribers();
        } catch {
            toast.error("Failed to verify user status. Please try again.");
            this.author = null;
            this.notifySubscribers();
        }
    }

    registerLogoutHandler(handler: LogoutHandler): void {
        this.logoutHandler = handler;
        // Don't stop periodic checks here
    }

    startPeriodicCheck(): void {
        // Always stop existing checks before starting new ones
        this.stopPeriodicCheck();

        // Force an immediate fetch
        this.fetchAuthor();

        // Start interval
        this.intervalId = window.setInterval(() => {
            this.fetchAuthor();
        }, CHECK_INTERVAL);
    }

    stopPeriodicCheck(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    getAuthorData(): AuthorLogin | null {
        // If we haven't fetched in the last 30 minutes, fetch again
        if (!this.lastFetchTime || Date.now() - this.lastFetchTime > CHECK_INTERVAL) {
            this.fetchAuthor();
        }
        return this.author;
    }

    // Force an immediate check of the author status
    forceCheck(): Promise<void> {
        return this.fetchAuthor();
    }

    // Subscribe to author changes
    subscribe(callback: (author: AuthorLogin | null) => void): () => void {
        this.subscribers.push(callback);

        // Immediately notify with current value
        if (this.author !== null) {
            callback(this.author);
        }

        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.author));
    }

    isAuthorActive(): boolean {
        if (!this.author) return false;

        return this.author.status !== UserStatus[UserStatus.Banned] &&
            this.author.status !== UserStatus[UserStatus.Deleted];
    }
}

// Singleton instance
const authorMiddleware = new AuthorMiddleware();
export default authorMiddleware;