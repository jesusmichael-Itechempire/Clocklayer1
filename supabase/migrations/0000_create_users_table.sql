-- Create the users table
CREATE TABLE public.users (
    id uuid NOT NULL,
    name text,
    username text,
    profile_picture text,
    phone text,
    referral_code text,
    referred_by uuid,
    points integer DEFAULT 0,
    has_completed_zealy_tasks boolean DEFAULT false,
    zealy_id text,
    zealy_xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_referral_code_key UNIQUE (referral_code),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT users_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.users (id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Grant permissions to the authenticator role
-- This is necessary for PostgREST to interact with the table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.users TO authenticated;
GRANT SELECT ON TABLE public.users TO anon;

-- RLS Policies
-- 1. Enable select for all users (anon and authenticated)
CREATE POLICY "Enable select for all users"
ON public.users
FOR SELECT
USING (true);

-- 2. Enable insert for authenticated users
CREATE POLICY "Enable insert for authenticated users"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Enable update for users to update their own profile
CREATE POLICY "Enable update for users to update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
