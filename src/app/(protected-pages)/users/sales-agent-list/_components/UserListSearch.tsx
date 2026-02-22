'use client'

import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import Input from '@/components/ui/Input'
import { TbSearch } from 'react-icons/tb'
import type { Ref } from 'react'

type UserListSearchProps = {
    search?: string
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const UserListSearch = (props: UserListSearchProps) => {
    const { search, onInputChange, ref } = props
    const [localValue, setLocalValue] = useState(search ?? '')
    const debouncedOnInputChange = useMemo(
        () => debounce((v: string) => onInputChange(v), 500),
        [onInputChange],
    )

    useEffect(() => {
        setLocalValue(search ?? '')
    }, [search])

    useEffect(
        () => () => debouncedOnInputChange.cancel(),
        [debouncedOnInputChange],
    )

    return (
        <Input
            ref={ref}
            value={localValue}
            onChange={(e) => {
                const v = e.target.value
                setLocalValue(v)
                debouncedOnInputChange(v)
            }}
            placeholder="Search by name or email..."
            suffix={<TbSearch className="text-lg" />}
        />
    )
}

export default UserListSearch
