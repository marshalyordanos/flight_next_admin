'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DataTable, { type ColumnDef } from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { roleService } from '@/services/role/roleService'
import type { Role } from '@/@types/role'
import { PiPlus, PiPencilSimple, PiTrash, PiPower, PiProhibit } from 'react-icons/pi'

const TYPE_Badge: Record<string, string> = {
    ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300/40',
    SUPER_ADMIN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-300/40',
    SUB_ADMIN: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border border-teal-300/40',
    SALES_AGENT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-300/40',
    USER: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300 border border-gray-300/40',
}
const STATUS_Badge = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700',
    inactive: 'bg-gray-50 text-gray-400 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700',
}

const RolesPage = () => {
    const router = useRouter()
    const [data, setData] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 20,
        total: 0,
        totalPage: 1,
    })
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [toggleActiveTarget, setToggleActiveTarget] = useState<{ role: Role; action: 'activate' | 'deactivate' } | null>(null)

    // fetchRoles now bakes in pagination
    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await roleService.getList({
                page: pagination.page,
                perPage: pagination.perPage,
                orderBy: 'createdAt',
                orderDirection: 'asc',
            })
            // Set data and bake in pagination
            setData(Array.isArray(res.data) ? res.data : [])
            const meta = res._metadata?.pagination as
                | { total: number; totalPage: number }
                | undefined
            if (meta) {
                setPagination((p) => ({
                    ...p,
                    total: meta.total,
                    totalPage: meta.totalPage,
                }))
            } else if (Array.isArray(res.data)) {
                // fallback in case: estimate page count from length
                setPagination((p) => ({
                    ...p,
                    total: res.data.length,
                    totalPage: 1,
                }))
            }
        } catch (err) {
            console.error('Failed to fetch roles:', err)
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.perPage])

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    const handleDelete = async () => {
        if (!deleteTarget) return
        setActionLoading(deleteTarget._id)
        try {
            await roleService.delete(deleteTarget._id)
            setDeleteTarget(null)
            fetchRoles()
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setActionLoading(null)
        }
    }

    // Toggle Active with confirmation dialog
    const handleToggleActive = async () => {
        if (!toggleActiveTarget) return
        const { role, action } = toggleActiveTarget
        setActionLoading(role._id)
        try {
            if (action === 'deactivate') {
                await roleService.setInactive(role._id)
            } else {
                await roleService.setActive(role._id)
            }
            setToggleActiveTarget(null)
            fetchRoles()
        } catch (err) {
            console.error('Toggle failed:', err)
        } finally {
            setActionLoading(null)
        }
    }

    const permissionCount = (role: Role) =>
        Array.isArray(role.permissions)
            ? role.permissions.length
            : (role.permissions as number) ?? 0

    const formatType = (type: string) => {
        // Capitalize and replace underscores
        const view = type
            ? type
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : '-'
        return view
    }

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge
                style={{padding: '0.25rem 0.5rem',borderRadius: '0.5rem'}}

                    className={TYPE_Badge[row.original.type as string] || 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-200 border'}
                >
                    {formatType(row.original.type)}
                </Badge>
            ),
        },
        {
            accessorKey: 'permissions',
            header: 'Permissions',
            cell: ({ row }) => (
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    {permissionCount(row.original)} permission{permissionCount(row.original) !== 1 ? 's' : ''}
                </span>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                

                style={{padding: '0.25rem 0.5rem',borderRadius: '0.5rem'}}                    className={
                        row.original.isActive
                            ? STATUS_Badge.active
                            : STATUS_Badge.inactive
                    }
                >
                    <span className="inline-flex items-center gap-1">
                        {row.original.isActive ? (
                            <>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                                Active
                            </>
                        ) : (
                            <>
                                <span className="h-2 w-2 rounded-full bg-gray-400 inline-block"></span>
                                Inactive
                            </>
                        )}
                    </span>
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const role = row.original
                const isBusy = actionLoading === role._id
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="xs"
                            variant="plain"
                            icon={<PiPencilSimple />}
                            onClick={() =>
                                router.push(`/roles/${role._id}/edit`)
                            }
                            disabled={isBusy}
                        />
                        <Button
                            size="xs"
                            variant="plain"
                            icon={
                                role.isActive ? (
                                    <PiProhibit />
                                ) : (
                                    <PiPower />
                                )
                            }
                            className={role.isActive
                                ? "text-yellow-600 hover:text-yellow-700"
                                : "text-green-600 hover:text-green-700"}
                            onClick={() =>
                                setToggleActiveTarget({
                                    role,
                                    action: role.isActive ? 'deactivate' : 'activate',
                                })
                            }
                            loading={isBusy}
                        />
                        <Button
                            size="xs"
                            variant="plain"
                            className="text-red-600 hover:text-red-700"
                            icon={<PiTrash />}
                            onClick={() => setDeleteTarget(role)}
                            disabled={isBusy}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <>
            <Card
                header={{
                    content: (
                        <div className="flex items-center justify-between w-full">
                            <h4 className="font-semibold">Roles</h4>
                            <Link href="/roles/create">
                                <Button size="sm" icon={<PiPlus />}>
                                    Add Role
                                </Button>
                            </Link>
                        </div>
                    ),
                }}
            >
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    noData={!loading && data.length === 0}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.page,
                        pageSize: pagination.perPage,
                    }}
                    onPaginationChange={(page) =>
                        setPagination((p) => ({ ...p, page }))
                    }
                />
            </Card>

            {/* Delete dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                type="danger"
                title="Delete Role"
            >
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{deleteTarget?.name}</strong>? This action cannot be
                    undone.
                </p>
            </ConfirmDialog>

            {/* Confirm activate/inactivate dialog */}
            <ConfirmDialog
                isOpen={!!toggleActiveTarget}
                onClose={() => setToggleActiveTarget(null)}
                onConfirm={handleToggleActive}
                type={toggleActiveTarget?.action === 'deactivate' ? 'danger' : 'success'}
                title={toggleActiveTarget?.action === 'deactivate' ? 'Deactivate Role' : 'Activate Role'}
            >
                <p>
                    Are you sure you want to{' '}
                    <strong>{toggleActiveTarget?.action === 'deactivate' ? 'deactivate' : 'activate'}</strong>{' '}
                    the role <strong>{toggleActiveTarget?.role.name}</strong>?
                </p>
            </ConfirmDialog>
        </>
    )
}

export default RolesPage
