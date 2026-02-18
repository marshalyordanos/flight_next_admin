import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from 'react'
import type { Booking } from '../_store/bookingListStore'

interface BookingListProviderProps {
    children: ReactNode
    bookingList: Booking[]
}

interface BookingListContextType {
    bookingList: Booking[]
    setBookingList: Dispatch<SetStateAction<Booking[]>>
}

export const BookingListContext = createContext<BookingListContextType>({
    bookingList: [],
    setBookingList: () => {},
})

export const useBookingList = () => useContext(BookingListContext)

const BookingListProvider: React.FC<BookingListProviderProps> = ({
    children,
    bookingList: initialList,
}) => {
    const [bookingList, setBookingList] = useState<Booking[]>(initialList || [])
    return (
        <BookingListContext.Provider value={{ bookingList, setBookingList }}>
            {children}
        </BookingListContext.Provider>
    )
}

export default BookingListProvider
