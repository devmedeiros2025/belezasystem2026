
-- Super admin can manage all profiles (update and delete)
CREATE POLICY "Super admin can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admin can manage all user_roles
CREATE POLICY "Super admin can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));
