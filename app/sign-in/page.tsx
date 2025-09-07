import { SignIn } from "../components/sign-in"

const page = ({ searchParams }: { searchParams: { error?: string, message?: string } }) => {
    return (
        <SignIn searchParams={searchParams} />
    )
}

export default page