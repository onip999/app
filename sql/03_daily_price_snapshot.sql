-- Registra automaticamente una rilevazione giornaliera dei prezzi correnti.
-- Il job viene eseguito ogni giorno alle 05:00 UTC (06:00/07:00 in Italia).

create extension if not exists pg_cron;

create or replace function public.snapshot_current_prices()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_rows integer;
begin
  insert into public.price_history (offer_id, price, shipping_cost, recorded_at)
  select o.id, o.price, o.shipping_cost, now()
  from public.offers o
  where not exists (
    select 1
    from public.price_history ph
    where ph.offer_id = o.id
      and ph.recorded_at >= date_trunc('day', now())
      and ph.recorded_at < date_trunc('day', now()) + interval '1 day'
  );

  get diagnostics inserted_rows = row_count;
  return inserted_rows;
end;
$$;

revoke all on function public.snapshot_current_prices() from public;
revoke all on function public.snapshot_current_prices() from anon;
revoke all on function public.snapshot_current_prices() from authenticated;

select cron.schedule(
  'daily-price-snapshot',
  '0 5 * * *',
  $$select public.snapshot_current_prices();$$
);

