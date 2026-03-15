
-- Auto-assign 'admin' role for new users if no roles exist yet, otherwise 'colaborador'
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_any_users boolean;
BEGIN
  -- Check if there are any existing roles
  SELECT EXISTS(SELECT 1 FROM public.user_roles LIMIT 1) INTO has_any_users;
  
  -- First user gets admin, subsequent users get colaborador
  IF has_any_users THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'colaborador');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-assign role
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
