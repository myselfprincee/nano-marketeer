import SignUpPage from "./sign-up"

const page = ({ searchParams }: { searchParams: { error?: string, message?: string } }) => {
    return (
        <SignUpPage searchParams={searchParams} />
    )
}

export default page