import { NextPage } from "next"
import { useRouter } from "next/router"
import * as React from "react"

const ssrInProgress = typeof window === 'undefined'

const HomePage: NextPage = () => {
    const router = useRouter()

    const token = !ssrInProgress && localStorage.getItem('token')
    const userId = !ssrInProgress && localStorage.getItem('userId')

    React.useEffect(() => {
        if (token && userId) {
            router.replace("/dashboard")
        } else {
            router.replace("/login")
        }
    }, [router, token, userId])

    return null
}

export default HomePage
