-- ESEGUI QUESTO FILE DOPO 01_schema.sql
-- Tutti i prezzi sono SOLO DATI DEMO.

insert into public.stores (
  id, name, website_url, return_days, warranty_months, shipping_notes
) values
  ('00000000-0000-0000-0000-000000000001', 'MediaWorld', 'https://www.mediaworld.it', 14, 24, '2-4 giorni'),
  ('00000000-0000-0000-0000-000000000002', 'Unieuro', 'https://www.unieuro.it', 14, 24, '3-5 giorni'),
  ('00000000-0000-0000-0000-000000000003', 'Zalando', 'https://www.zalando.it', 30, 24, '2-5 giorni'),
  ('00000000-0000-0000-0000-000000000004', 'OVS', 'https://www.ovs.it', 30, 24, '3-6 giorni')
on conflict (id) do update set
  name = excluded.name,
  website_url = excluded.website_url,
  return_days = excluded.return_days,
  warranty_months = excluded.warranty_months,
  shipping_notes = excluded.shipping_notes;

insert into public.products (
  id, brand, name, category, description
) values
  ('10000000-0000-0000-0000-000000000001', 'Sony', 'WH-CH520', 'Elettronica', 'Cuffie wireless leggere con autonomia elevata.'),
  ('10000000-0000-0000-0000-000000000002', 'JBL', 'Tune 510BT', 'Elettronica', 'Cuffie Bluetooth compatte per uso quotidiano.'),
  ('10000000-0000-0000-0000-000000000003', 'Nike', 'Sneaker Demo', 'Abbigliamento', 'Prodotto dimostrativo per testare il confronto anche nella moda.'),
  ('10000000-0000-0000-0000-000000000004', 'OVS', 'Giacca Demo', 'Abbigliamento', 'Prodotto dimostrativo per testare categorie differenti.')
on conflict (id) do update set
  brand = excluded.brand,
  name = excluded.name,
  category = excluded.category,
  description = excluded.description;

insert into public.offers (
  product_id, store_id, price, shipping_cost, availability, product_url
) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',39.99,0,'Disponibile','https://www.mediaworld.it'),
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',42.99,4.99,'Disponibile','https://www.unieuro.it'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',34.99,0,'Disponibile','https://www.mediaworld.it'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002',32.99,4.99,'Disponibile','https://www.unieuro.it'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003',79.99,0,'Disponibile','https://www.zalando.it'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004',84.99,3.90,'Disponibile','https://www.ovs.it'),
  ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000003',59.99,0,'Disponibile','https://www.zalando.it'),
  ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000004',54.99,3.90,'Disponibile','https://www.ovs.it')
on conflict (product_id, store_id) do update set
  price = excluded.price,
  shipping_cost = excluded.shipping_cost,
  availability = excluded.availability,
  product_url = excluded.product_url,
  updated_at = now();

