export interface LoginResponse {
    jwtToken?: string,
    additionalStepsNecessary?: string,
    error?: string,
    succeeded: boolean
}