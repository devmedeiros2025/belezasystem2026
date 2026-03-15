
CREATE POLICY "Super admin can insert establishments"
ON public.estabelecimentos FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
