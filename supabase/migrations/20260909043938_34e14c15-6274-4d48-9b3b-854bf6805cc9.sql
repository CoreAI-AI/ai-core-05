CREATE TABLE public.app_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.app_feedback TO anon, authenticated;
GRANT SELECT ON public.app_feedback TO authenticated;
GRANT ALL ON public.app_feedback TO service_role;

ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
ON public.app_feedback FOR INSERT TO anon, authenticated
WITH CHECK (char_length(message) BETWEEN 1 AND 500);

CREATE POLICY "Admins can read feedback"
ON public.app_feedback FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));