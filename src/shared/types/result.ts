export interface ResultOf<T> {
    isSuccessful: boolean;
    value?: T | null;
    errorMessage?: string | null;
    statusCode: number;
}

export interface Result {
    isSuccessful: boolean;
    errorMessage?: string | null;
    statusCode: number;
}