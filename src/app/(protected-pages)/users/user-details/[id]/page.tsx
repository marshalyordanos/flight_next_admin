import UserDetails from './_components/UserDetails'
import NoUserFound from '@/assets/svg/NoUserFound'
import getUser from '@/server/actions/getUser'
import isEmpty from 'lodash/isEmpty'
import Container from '@/components/shared/Container'

export default async function Page(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const data = await getUser({ id: params.id })

    if (!data || isEmpty(data)) {
        return (
            <Container>
                <div className="h-full flex flex-col items-center justify-center py-16">
                    <NoUserFound height={280} width={280} />
                    <h2 className="mt-4">No user found!</h2>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <UserDetails data={data} />
        </Container>
    )
}
