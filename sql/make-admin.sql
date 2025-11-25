-- make-admin.sql
-- Usage: replace 'admin@example.com' and 'Admin Name' then run in Supabase SQL editor.
-- This script finds the auth user by email, then inserts or updates a row
-- in public.users to set role = 'admin'. It avoids requiring you to paste a UUID.

DO $$
DECLARE
  uid uuid;
  admin_email text := 'admin@example.com';
  admin_name text := 'Admin Name';
  admin_college text := 'Admin College';
  admin_year integer := 0;
  admin_branch text := 'Unknown';
  admin_phone text := '';
  admin_gfg text := '';
  admin_linkedin text := '';
  admin_instagram text := '';
  admin_daily_posts bigint := 0;
BEGIN
  -- Replace the values above with your admin email/name before running.
  SELECT id INTO uid FROM auth.users WHERE email = admin_email;
  IF uid IS NULL THEN
    RAISE NOTICE 'No auth user found with that email: %', admin_email;
  ELSE
    IF EXISTS (SELECT 1 FROM public.users WHERE auth_uid = uid) THEN
      UPDATE public.users
      SET role = 'admin',
          full_name = COALESCE(full_name, admin_name),
          college = COALESCE(college, admin_college),
          year = COALESCE(year, admin_year),
          branch = COALESCE(branch, admin_branch),
          phone = COALESCE(phone, admin_phone),
          gfg_username = COALESCE(gfg_username, admin_gfg),
          linkedin_url = COALESCE(linkedin_url, admin_linkedin),
          instagram_url = COALESCE(instagram_url, admin_instagram),
          daily_posts_count = COALESCE(daily_posts_count, admin_daily_posts),
          email = COALESCE(email, admin_email)
      WHERE auth_uid = uid;
      RAISE NOTICE 'Updated existing users row for % to admin', uid;
    ELSE
      -- Insert a new users row; omit uuid/created_at to let DB defaults apply if present.
      INSERT INTO public.users (
        auth_uid, full_name, role, college, year, branch, phone,
        gfg_username, linkedin_url, instagram_url, daily_posts_count, program_read, email
      )
      VALUES (
        uid, admin_name, 'admin', admin_college, admin_year, admin_branch, admin_phone,
        admin_gfg, admin_linkedin, admin_instagram, admin_daily_posts, false, admin_email
      );
      RAISE NOTICE 'Inserted new users row for % as admin', uid;
    END IF;
  END IF;
END $$;

-- Quick read-only alternative: show the auth user's id so you can copy it
-- SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- NOTES:
-- 1) Replace 'admin@example.com' with the admin's email, and 'Admin Name' with
--    the display name you want shown in the `users` table.
-- 2) Run this in the Supabase SQL editor (it runs as the DB owner so RLS won't block it).
-- 3) If your `users` table uses different column names, update the column list accordingly.
