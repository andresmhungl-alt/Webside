-- Create tables
create table public.stores (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  image_url text,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

create table public.products (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.stores enable row level security;
alter table public.products enable row level security;

-- Policies for Stores
create policy "Public stores are viewable by everyone" on public.stores
  for select using (true); 

create policy "Users can insert their own store" on public.stores
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own store" on public.stores
  for update using (auth.uid() = user_id);

create policy "Users can delete their own store" on public.stores
  for delete using (auth.uid() = user_id);

-- Policies for Products
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Users can insert products into their own store" on public.products
  for insert with check (
    exists (
      select 1 from public.stores
      where id = products.store_id and user_id = auth.uid()
    )
  );

create policy "Users can update products in their own store" on public.products
  for update using (
    exists (
      select 1 from public.stores
      where id = products.store_id and user_id = auth.uid()
    )
  );

create policy "Users can delete products in their own store" on public.products
  for delete using (
    exists (
      select 1 from public.stores
      where id = products.store_id and user_id = auth.uid()
    )
  );

-- Storage Bucket for Product Images
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Give public access to product images" on storage.objects
  for select using ( bucket_id = 'products' );

create policy "Users can upload product images" on storage.objects
  for insert with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Storage Bucket for Store Images
insert into storage.buckets (id, name, public) values ('stores', 'stores', true);

create policy "Give public access to store images" on storage.objects
  for select using ( bucket_id = 'stores' );

create policy "Users can upload store images" on storage.objects
  for insert with check ( bucket_id = 'stores' and auth.role() = 'authenticated' );
