
CREATE POLICY "Super admin can view all establishments"
ON public.estabelecimentos FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can update all establishments"
ON public.estabelecimentos FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));
