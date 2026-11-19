import { User } from './entities/user.entity';

export type PublicUser = Pick<
  User,
  'id' | 'username' | 'avatarUrl' | 'coins' | 'createdAt'
>;

export type UserProfile = PublicUser & Pick<User, 'email'>;

export function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    coins: user.coins,
    createdAt: user.createdAt,
  };
}

export function toProfile(user: User): UserProfile {
  return { ...toPublic(user), email: user.email };
}
