import { UsersRepo, type UsersRepoType } from "../db/repositories/users.repo.js";
import { AppError } from "../core/errors.js";

const Users: UsersRepoType = UsersRepo;

export const UserService = {
    async me(supabaseId: string) {
        const local = await Users.findBySupabaseId(supabaseId);
        if (!local) throw AppError.notFound("User not found");
        return local;
    },
};
