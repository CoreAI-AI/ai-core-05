REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_group_admin(uuid, uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_waitlist_count() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_waitlist_position(text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated;