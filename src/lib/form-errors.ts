export function getErrorMessage(error: unknown): string {
    if (!error) return ""
    if (typeof error === "string") return error

    if (typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === "string") return message
    }

    return "Data tidak valid"
}