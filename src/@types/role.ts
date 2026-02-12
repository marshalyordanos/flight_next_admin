export type RolePermission = {
    subject: string
    action: string[]
}

export type RoleType =
    | 'ADMIN'
    | 'SUPER_ADMIN'
    | 'SUB_ADMIN'
    | 'SALES_AGENT'
    | 'USER'

export type Role = {
    _id: string
    deleted?: boolean
    createdAt: string
    updatedAt: string
    name: string
    isActive: boolean
    type: RoleType
    permissions: RolePermission[] | number
}

export type RoleListParams = {
    page?: number
    perPage?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    search?: string
}

export type CreateRolePayload = {
    name: string
    type: RoleType
    permissions: RolePermission[]
    description?: string
}

export type UpdateRolePayload = {
    type?: RoleType
    permissions?: RolePermission[]
    description?: string
}
