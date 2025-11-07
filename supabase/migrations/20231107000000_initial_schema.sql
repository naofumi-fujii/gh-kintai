-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    clock_out TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_clock_in ON public.attendance_records(clock_in DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only view their own records
CREATE POLICY "Users can view own attendance records"
    ON public.attendance_records
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own attendance records"
    ON public.attendance_records
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own records
CREATE POLICY "Users can update own attendance records"
    ON public.attendance_records
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
