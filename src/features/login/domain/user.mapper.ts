import { UserModel } from '@/features/login/services/user.model'
import { User } from '@/features/login/domain/user'

export function mapUserToUserModel(model: UserModel): User {
    return {
        id: model.id,
        name: model.name,
        createdAt: model.createdAt,
        email: model.email,
        token: model.token,
        profileImageUrl: model.profileImageUrl,
    }
}
