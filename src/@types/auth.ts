export type SignInCredential = {
    email: string
    password: string
}

export type AuthLoginResponse = {
    tokenType: string
    roleType: string
    expiresIn: number
    accessToken: string
    refreshToken: string
}

export type ApiPermission = {
    subject: string
    action: string[]
}

export type ApiRole = {
    _id: string
    name: string
    isActive: boolean
    type: string
    permissions: ApiPermission[] | number
}

export type ApiCountry = {
    _id: string
    name: string
    alpha2Code: string
    phoneCode: string[]
    timeZone: string
    currency: string
}

export type UserProfile = {
    _id: string
    name: string
    username: string
    email: string
    status: string
    gender?: string
    role: ApiRole
    country?: ApiCountry
    verification?: { email: boolean; mobileNumber: boolean }
    passwordExpired?: string
    passwordCreated?: string
    signUpDate?: string
    signUpFrom?: string
}

export type ApiResponse<T> = {
    statusCode: number
    message: string
    _metadata?: Record<string, unknown>
    data: T
}

export type SignUpResponse = {
    status: string
    message: string
}

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    newPassword: string
    confirmPassword: string
    token: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refreshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
