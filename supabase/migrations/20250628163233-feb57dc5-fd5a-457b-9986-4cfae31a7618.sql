
-- Add missing columns to trial_requests table
ALTER TABLE public.trial_requests 
ADD COLUMN contact_person TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN software_type TEXT,
ADD COLUMN message TEXT;
