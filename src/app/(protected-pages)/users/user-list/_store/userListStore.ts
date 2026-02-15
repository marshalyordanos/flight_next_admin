import { create } from 'zustand'
import type { User, Filter } from '../types'

export const initialFilterData: Filter = {
    query: '',
    orderBy: 'createdAt',
    orderDirection: 'asc',
    roleType: [],


}

export type UserListState = {
    initialLoading: boolean
    userList: User[]
    filterData: Filter
    selectedUser: Partial<User>[]
}

type UserListAction = {
    setUserList: (userList: User[]) => void
    setFilterData: (payload: Filter) => void
    setSelectedUser: (checked: boolean, user: User) => void
    setSelectAllUser: (user: User[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: UserListState = {
    initialLoading: true,
    userList: [],
    filterData: initialFilterData,
    selectedUser: [],
}

export const useUserListStore = create<UserListState & UserListAction>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedUser: (checked, row) =>
        set((state) => {
            const prevData = state.selectedUser
            if (checked) {
                return { selectedUser: [...prevData, ...[row]] }
            } else {
                if (prevData.some((prevUser) => row._id === prevUser._id)) {
                    return {
                        selectedUser: prevData.filter(
                            (prevUser) => prevUser._id !== row._id,
                        ),
                    }
                }
                return { selectedUser: prevData }
            }
        }),
    setSelectAllUser: (row) => set(() => ({ selectedUser: row })),
    setUserList: (userList) => set(() => ({ userList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
