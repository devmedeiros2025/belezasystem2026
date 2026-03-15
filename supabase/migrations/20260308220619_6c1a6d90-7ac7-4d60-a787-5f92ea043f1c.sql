
ALTER TABLE public.estabelecimentos 
ADD COLUMN trial_expires_at timestamptz DEFAULT (now() + interval '3 days');
