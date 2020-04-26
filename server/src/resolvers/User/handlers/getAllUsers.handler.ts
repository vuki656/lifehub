import { getRepository } from 'typeorm'
import { UserEntity } from '../../../entities/user'

export const getAllUsersHandler = () => {
    return getRepository(UserEntity).find()
}
