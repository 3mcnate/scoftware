import { Database } from "@/types/database.types";
import { PostgrestError, PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { UseQueryOptions } from "@tanstack/react-query";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type PostgrestUseQueryOptions<Result> = Omit<UseQueryOptions<PostgrestSingleResponse<Result>, PostgrestError>, 'queryKey' | 'queryFn'>