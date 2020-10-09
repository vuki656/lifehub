import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import validator from 'validator'

import { ContextType } from '../../global/types/context.type'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET = process.env.JWT_SECRET!

export const authChecker: AuthChecker<ContextType> = async(resolverData): Promise<boolean> => {
    const authPayload = resolverData.context.token

    if (!authPayload) {
        return false
    }

    const [tokenFormat, token] = authPayload.split(' ')

    if (tokenFormat !== 'Bearer') {
        return false
    }

    if (!validator.isJWT(token)) {
        return false
    }

    verify(token, SECRET, (error) => {
        if (error) {
            return false
        }
    })

    return true
}
