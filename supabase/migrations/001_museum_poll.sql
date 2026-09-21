create table if not exists public.poll_totals (
  poll_id text not null,
  option_id text not null check (option_id in ('a', 'b')),
  vote_count bigint not null default 0 check (vote_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (poll_id, option_id)
);

create table if not exists public.poll_voters (
  poll_id text not null,
  visitor_id uuid not null,
  option_id text not null check (option_id in ('a', 'b')),
  created_at timestamptz not null default now(),
  primary key (poll_id, visitor_id)
);

insert into public.poll_totals (poll_id, option_id, vote_count)
values ('which-set-2026', 'a', 0), ('which-set-2026', 'b', 0)
on conflict (poll_id, option_id) do nothing;

alter table public.poll_totals enable row level security;
alter table public.poll_voters enable row level security;

drop policy if exists "Public poll totals are readable" on public.poll_totals;
create policy "Public poll totals are readable"
on public.poll_totals for select
to anon, authenticated
using (true);

create or replace function public.cast_vote(
  p_poll_id text,
  p_option_id text,
  p_visitor_id uuid
)
returns table (option_id text, vote_count bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_rows integer;
begin
  if p_poll_id <> 'which-set-2026' then
    raise exception 'Unknown poll';
  end if;

  if p_option_id not in ('a', 'b') then
    raise exception 'Invalid poll option';
  end if;

  insert into public.poll_voters (poll_id, visitor_id, option_id)
  values (p_poll_id, p_visitor_id, p_option_id)
  on conflict (poll_id, visitor_id) do nothing;
  get diagnostics inserted_rows = row_count;

  if inserted_rows = 1 then
    insert into public.poll_totals as totals (poll_id, option_id, vote_count)
    values (p_poll_id, p_option_id, 1)
    on conflict (poll_id, option_id) do update
    set vote_count = totals.vote_count + 1,
        updated_at = now();
  end if;

  return query
  select totals.option_id, totals.vote_count
  from public.poll_totals totals
  where totals.poll_id = p_poll_id
  order by totals.option_id;
end;
$$;

revoke all on public.poll_totals from anon, authenticated;
grant select on public.poll_totals to anon, authenticated;
revoke all on public.poll_voters from anon, authenticated;
grant execute on function public.cast_vote(text, text, uuid) to anon, authenticated;

alter publication supabase_realtime add table public.poll_totals;
