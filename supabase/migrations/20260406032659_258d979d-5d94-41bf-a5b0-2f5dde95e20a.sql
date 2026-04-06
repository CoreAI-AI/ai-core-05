-- Drop and recreate the insert policy for group_chats to target authenticated role
DROP POLICY IF EXISTS "Users can create groups" ON public.group_chats;
CREATE POLICY "Users can create groups"
ON public.group_chats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Also fix select policy to allow creator to see group right after creation
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.group_chats;
CREATE POLICY "Users can view groups they are members of"
ON public.group_chats
FOR SELECT
TO authenticated
USING (is_group_member(id, auth.uid()) OR auth.uid() = created_by);

-- Fix group_members insert policy for authenticated
DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;
CREATE POLICY "Group admins can add members"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) OR is_group_admin(group_id, auth.uid()));

-- Fix group_members select
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
CREATE POLICY "Users can view members of their groups"
ON public.group_members
FOR SELECT
TO authenticated
USING (is_group_member(group_id, auth.uid()) OR auth.uid() = user_id);

-- Fix group_members delete
DROP POLICY IF EXISTS "Group admins can remove members" ON public.group_members;
CREATE POLICY "Group admins can remove members"
ON public.group_members
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR is_group_admin(group_id, auth.uid()));

-- Fix group_messages policies
DROP POLICY IF EXISTS "Users can send messages to their groups" ON public.group_messages;
CREATE POLICY "Users can send messages to their groups"
ON public.group_messages
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) AND is_group_member(group_id, auth.uid()));

DROP POLICY IF EXISTS "Users can view messages in their groups" ON public.group_messages;
CREATE POLICY "Users can view messages in their groups"
ON public.group_messages
FOR SELECT
TO authenticated
USING (is_group_member(group_id, auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.group_messages;
CREATE POLICY "Users can delete their own messages"
ON public.group_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix group_chats update/delete
DROP POLICY IF EXISTS "Group admins can update groups" ON public.group_chats;
CREATE POLICY "Group admins can update groups"
ON public.group_chats
FOR UPDATE
TO authenticated
USING (is_group_admin(id, auth.uid()));

DROP POLICY IF EXISTS "Group admins can delete groups" ON public.group_chats;
CREATE POLICY "Group admins can delete groups"
ON public.group_chats
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);