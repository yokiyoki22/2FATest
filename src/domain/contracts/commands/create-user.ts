export interface CreateUserCommand{
    fullName: string,
    email: string,
    password: string,
    passwordConfirm: string,
    enable2fa: boolean
}