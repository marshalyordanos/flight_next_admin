export type Role = {
    _id: string
    deleted: boolean
    createdAt: string
    updatedAt: string
    name: string
    isActive: boolean
    type: string // e.g. 'ADMIN', 'USER', 'SALES_AGENT', 'SUPER_ADMIN'
    permissions: number | number[] | { subject: string; action: string[] }[]
}

export type Country = {
    _id: string
    deleted?: boolean
    name: string
    alpha2Code: string
    phoneCode: string[]
    timeZone: string
    currency: string
}

export type User = {
    _id: string
    deleted?: boolean
    createdAt: string
    updatedAt: string
    name: string
    username: string
    email: string
    role: Role
    status: string // e.g. "ACTIVE"
    country: Country
    verification?: {
        email: boolean
        mobileNumber: boolean
    }
    passwordExpired?: string
    passwordCreated?: string
    signUpDate?: string
    signUpFrom?: string
    gender?: string
    commissionAmount?: number
    monthlySalesGoal?: number
    salesAgentRequest?: unknown | null
}

export type Filter = {
    query?: string
    orderBy?: string
    orderDirection?: string
}

export type GetUsersListResponse = {
    data: User[]
    statusCode: number
    message: string
    _metadata: {
        language: string
        timestamp: number
        timezone: string
        path: string
        version: string
        repoVersion: string
        pagination: {
            availableSearch: string[]
            page: number
            perPage: number
            orderBy: string
            orderDirection: string
            availableOrderBy: string[]
            availableOrderDirection: string[]
            total: number
            totalPage: number
        }
    }
}

export type GetUserDetailResponse = {
    data: User
    statusCode: number
    message: string
    _metadata: {
        language: string
        timestamp: number
        timezone: string
        path: string
        version: string
        repoVersion: string
    }
}
