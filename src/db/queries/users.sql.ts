
export const UsersSQL = {
    upsertMirror: `
    INSERT INTO users (supabase_user_id, user_email, user_name, user_phnNo, is_email_verified)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_email)
    DO UPDATE SET
      supabase_user_id = EXCLUDED.supabase_user_id,
      user_name = COALESCE(EXCLUDED.user_name, users.user_name),
      user_phnNo = COALESCE(EXCLUDED.user_phnNo, users.user_phnNo),
      is_email_verified = EXCLUDED.is_email_verified,
      updated_at = CURRENT_TIMESTAMP
    RETURNING uuid, user_email, user_name, is_email_verified, referral_code, supabase_user_id, role
  `,
    findBySupabaseId: `
    SELECT * FROM users WHERE supabase_user_id = $1 LIMIT 1
  `,
    findByEmail: `
    SELECT * FROM users WHERE user_email = $1 LIMIT 1
  `,
};
