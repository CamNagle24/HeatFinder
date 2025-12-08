import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://apnuvwcjtkatigxmdyvv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbnV2d2NqdGthdGlneG1keXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDkzODgsImV4cCI6MjA3ODcyNTM4OH0.-9KOjQ8zNSaZ_XFwFN0Tfmn4QgFWAknNC3P_bVvV6Pc'
)
