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

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await roleService.getList({
                page: pagination.page,
                perPage: pagination.perPage,
                orderBy: 'createdAt',
                orderDirection: 'asc',
            })
            setData(res.data)
            const meta = res._metadata?.pagination as
                | { total: number; totalPage: number }
                | undefined
            if (meta) {
                setPagination((p) => ({
                    ...p,
                    total: meta.total,
                    totalPage: meta.totalPage,
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

    const handleToggleActive = async (role: Role) => {
        setActionLoading(role._id)
        try {
            if (role.isActive) {
                await roleService.setInactive(role._id)
            } else {
                await roleService.setActive(role._id)
            }
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
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {row.original.type}
                </Badge>
            ),
        },
        {
            accessorKey: 'permissions',
            header: 'Permissions',
            cell: ({ row }) => (
                <span className="text-gray-600 dark:text-gray-400">
                    {permissionCount(row.original)} permission(s)
                </span>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }
                >
                    {row.original.isActive ? 'Active' : 'Inactive'}
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
                            onClick={() => handleToggleActive(role)}
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
        </>
    )
}

export default RolesPage
