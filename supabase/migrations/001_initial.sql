-- ============================================================
-- Rus Maktabi LMS — начальная схема БД
-- ============================================================

-- Расширение для UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- ПОЛЬЗОВАТЕЛИ
-- ============================================================
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique,
  phone       text,
  name        text not null default '',
  role        text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  country     text default 'UZ',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Пользователь видит свой профиль"
  on public.users for select using (auth.uid() = id);

create policy "Пользователь редактирует свой профиль"
  on public.users for update using (auth.uid() = id);

create policy "Admins видят всех"
  on public.users for select
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Автосоздание записи при регистрации
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, phone)
  values (
    new.id,
    new.email,
    new.phone
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- КУРСЫ
-- ============================================================
create table public.courses (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text not null unique,
  description text,
  price_uzs   integer not null default 0,  -- в сумах
  price_rub   integer not null default 0,  -- в рублях
  language    text not null default 'ru' check (language in ('ru', 'uz', 'en')),
  thumbnail   text,
  status      text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at  timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Опубликованные курсы видят все"
  on public.courses for select using (status = 'published');

create policy "Admins управляют курсами"
  on public.courses for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- МОДУЛИ
-- ============================================================
create table public.modules (
  id        uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title     text not null,
  "order"   integer not null default 0
);

alter table public.modules enable row level security;

create policy "Модули видят все (опубликованный курс)"
  on public.modules for select
  using (exists (
    select 1 from public.courses c
    where c.id = course_id and c.status = 'published'
  ));

create policy "Admins управляют модулями"
  on public.modules for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- УРОКИ
-- ============================================================
create table public.lessons (
  id             uuid primary key default uuid_generate_v4(),
  module_id      uuid not null references public.modules(id) on delete cascade,
  title          text not null,
  content_md     text,
  video_url      text,
  video_provider text default 'youtube' check (video_provider in ('youtube', 'bunny')),
  duration_min   integer default 0,
  "order"        integer not null default 0,
  is_free        boolean not null default false
);

alter table public.lessons enable row level security;

-- Бесплатные уроки — всем; платные — только enrolled
create policy "Бесплатные уроки видят все"
  on public.lessons for select using (is_free = true);

create policy "Платные уроки — только записанным студентам"
  on public.lessons for select
  using (
    is_free = true
    or exists (
      select 1 from public.enrollments e
      join public.modules m on m.id = module_id
      where e.user_id = auth.uid()
        and e.course_id = m.course_id
        and e.status = 'active'
    )
  );

create policy "Admins управляют уроками"
  on public.lessons for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- ЗАПИСИ (ENROLLMENTS)
-- ============================================================
create table public.enrollments (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  course_id  uuid not null references public.courses(id) on delete cascade,
  paid_at    timestamptz,
  amount     integer,       -- в минимальных единицах валюты
  currency   text default 'UZS' check (currency in ('UZS', 'RUB', 'USD')),
  status     text not null default 'pending' check (status in ('pending', 'active', 'expired', 'refunded')),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Студент видит свои записи"
  on public.enrollments for select using (auth.uid() = user_id);

create policy "Admins видят все записи"
  on public.enrollments for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- ПРОГРЕСС ПО УРОКАМ
-- ============================================================
create table public.lesson_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Студент управляет своим прогрессом"
  on public.lesson_progress for all using (auth.uid() = user_id);

-- ============================================================
-- ПЛАТЕЖИ
-- ============================================================
create table public.payments (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  amount      integer not null,
  currency    text not null check (currency in ('UZS', 'RUB', 'USD')),
  provider    text not null check (provider in ('payme', 'yookassa', 'manual')),
  external_id text,          -- ID транзакции от провайдера
  status      text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at  timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Студент видит свои платежи"
  on public.payments for select using (auth.uid() = user_id);

create policy "Admins видят все платежи"
  on public.payments for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- ИНДЕКСЫ
-- ============================================================
create index on public.modules (course_id, "order");
create index on public.lessons (module_id, "order");
create index on public.enrollments (user_id, status);
create index on public.lesson_progress (user_id, lesson_id);
create index on public.payments (user_id, status);
create index on public.payments (external_id);

-- ============================================================
-- SEED: первый Admin (заменить на реальный email после регистрации)
-- ============================================================
-- UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
