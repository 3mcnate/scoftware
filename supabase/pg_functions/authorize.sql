create or replace function public.get_role_code(r user_role)
returns int as $$
begin
	return case r
		when 'participant' then 0
		when 'guide' then 1
		when 'admin' then 2
		when 'superadmin' then 3
	end;
end;
$$ language plpgsql
set search_path = '';


create or replace function public.authorize(
	authorized_role public.user_role
)
returns boolean 
security definer
as $$
declare
	urole public.user_role;
begin

	select "role" from public.roles into urole where user_id = (select auth.uid());
	return public.get_role_code(urole) >= public.get_role_code(authorized_role);

end;
$$ language plpgsql
set search_path = '';

grant execute on function public.authorize to authenticated;
grant execute on function public.authorize to public;
grant execute on function public.authorize to anon;