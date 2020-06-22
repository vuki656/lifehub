import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import validator from 'validator'

import { ContextType } from '../../global/types/context.type'

const SECRET = process.env.JWT_SECRET!

export const authChecker: AuthChecker<ContextType> = async (resolverData): Promise<boolean> => {
    const [format, token] = resolverData.context.token.split(' ')

    if (format !== 'Bearer') {
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
