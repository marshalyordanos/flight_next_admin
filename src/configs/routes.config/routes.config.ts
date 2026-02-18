import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/home': {
        key: 'home',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/roles': {
        key: 'roles',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/roles/create': {
        key: 'rolesCreate',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/roles/[id]/edit': {
        key: 'rolesEdit',
        authority: [],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/page': {
        key: 'page',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/users/user-list': {
        key: 'users.userList',
        authority: [],
    },
    '/users/user-edit/[slug]': {
        key: 'users.userEdit',
        authority: [],
        meta: {
            header: {
                title: 'Edit user',
                description: 'Manage user details and preferences.',
                contained: true,
            },
            footer: false,
        },
        dynamicRoute: true,
    },
    '/users/user-create': {
        key: 'users.userCreate',
        authority: [],
        meta: {
            header: {
                title: 'Create user',
                description: 'Add new users to the system.',
                contained: true,
            },
            footer: false,
        },
    },
    '/users/user-create-sales-agent': {
        key: 'users.userCreateSalesAgent',
        authority: [],
        meta: {
            header: {
                title: 'Create sales agent',
                description: 'Add new sales agent to the system.',
                contained: true,
            },
            footer: false,
        },
    },
    '/users/user-details/[slug]': {
        key: 'users.userDetails',
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true,
    },
    '/profile': {
        key: 'profile',
        authority: [],
        meta: {
            header: {
                title: 'Profile',
                description: 'Manage your profile',
                contained: true,
            },
        },
    },
    '/configuration': {
        key: 'configuration',
        authority: [],
        meta: {
            header: {
                title: 'Configuration',
                description: 'Manage markup rate and tax rate',
                contained: true,
            },
        },
    },
    '/booking': {
        key: 'booking',
        authority: [],
        meta: {
            header: {
                title: 'Booking',
                description: 'Manage bookings and reservations',
                contained: true,
            },
        },
    },
}

export const publicRoutes: Routes = {}

export const authRoutes = authRoute
