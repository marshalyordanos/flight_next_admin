import BookingListSearch from './BookingListSearch'
import BookingListTableFilter from './BookingListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const BookingListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            search: query,
            page: '1',
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <BookingListSearch onInputChange={handleInputChange} />
            <BookingListTableFilter />
        </div>
    )
}

export default BookingListTableTools
