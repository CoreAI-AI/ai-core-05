-- 1. Add UPDATE policy on group_members (prevent role escalation)
CREATE POLICY "Only group admins can update member roles"
ON public.group_members FOR UPDATE
TO authenticated
USING (
  public.is_group_admin(group_id, auth.uid())
)
WITH CHECK (
  public.is_group_admin(group_id, auth.uid())
);

-- 2. Add admin SELECT policies for admin dashboard stats
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all chats"
ON public.chats FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all images"
ON public.generated_images FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all feedback"
ON public.message_feedback FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add UPDATE policy on documents storage bucket
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Remove generated_images from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.generated_images;