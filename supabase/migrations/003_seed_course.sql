-- Seed: Rus tili intensivi course with modules and lessons
-- Video URLs use YouTube embed IDs (replace with real lesson videos)

WITH course AS (
  INSERT INTO public.courses (title, slug, description, price_uzs, price_rub, language, status)
  VALUES (
    'Rus tili intensivi — maktabga tayyorlov',
    'rus-tili-intensivi',
    '4 haftada Rossiya maktabiga tayyor bo''ling. Professional o''qituvchilar, individual dastur va natija kafolati. 97% o''quvchilarimiz maktabga qabul qilingan.',
    2400000,
    25000,
    'ru',
    'published'
  )
  RETURNING id
),

-- Module 1: Azbuka
m1 AS (
  INSERT INTO public.modules (course_id, title, "order")
  SELECT id, 'Azbuka va talaffuz', 1 FROM course
  RETURNING id
),

-- Module 2: Conversation
m2 AS (
  INSERT INTO public.modules (course_id, title, "order")
  SELECT id, 'Maktabda so''zlashuv', 2 FROM course
  RETURNING id
),

-- Module 3: Grammar
m3 AS (
  INSERT INTO public.modules (course_id, title, "order")
  SELECT id, 'Grammatika asoslari', 3 FROM course
  RETURNING id
),

-- Module 1 lessons
l1 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m1.id, 'Rus alifbosi — 33 harf', 'oHg5SJYRHA0', 'youtube', 12, 1, true,
    E'## Rus alifbosi\n\nBu darsda biz rus tilining 33 harfini o''rganamiz.\n\n**Unlı harflar:** А, Е, Ё, И, О, У, Ы, Э, Ю, Я\n\n**Undosh harflar:** Б, В, Г, Д, Ж, З, К, Л, М, Н, П, Р, С, Т, Ф, Х, Ц, Ч, Ш, Щ\n\n**Belgilar:** Ъ, Ь'
  FROM m1
  RETURNING id
),
l2 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m1.id, 'Talaffuz mashqi — unlilar', 'oHg5SJYRHA0', 'youtube', 15, 2, false,
    E'## Unli harflar talaffuzi\n\nА, О, У, Э, И, Ы — har birini to''g''ri talaffuz qilishni o''rganamiz.'
  FROM m1
  RETURNING id
),
l3 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m1.id, 'Birinchi so''zlar — 20 ta asosiy so''z', 'oHg5SJYRHA0', 'youtube', 18, 3, false,
    E'## Birinchi 20 ta so''z\n\n- Привет — Salom\n- Спасибо — Rahmat\n- Пожалуйста — Marhamat\n- Да — Ha\n- Нет — Yo''q\n- Школа — Maktab\n- Учитель — O''qituvchi\n- Урок — Dars'
  FROM m1
  RETURNING id
),

-- Module 2 lessons
l4 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m2.id, 'Tanishish — «Меня зовут...»', 'oHg5SJYRHA0', 'youtube', 14, 1, true,
    E'## Tanishish\n\nBu darsda o''zingizni tanishtirish gaplarini o''rganamiz:\n\n- Меня зовут Sardor. — Mening ismim Sardor.\n- Мне 10 лет. — Menga 10 yosh.\n- Я из Узбекистана. — Men O''zbekistondan.'
  FROM m2
  RETURNING id
),
l5 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m2.id, 'Maktabda — darsxonada dialog', 'oHg5SJYRHA0', 'youtube', 16, 2, false,
    E'## Maktabda muloqot\n\n- Можно войти? — Kirsa bo''ladimi?\n- Я не понимаю. — Men tushunmayapman.\n- Повторите, пожалуйста. — Iltimos, takrorlang.'
  FROM m2
  RETURNING id
),
l6 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m2.id, 'Sanlar va vaqt — числа и время', 'oHg5SJYRHA0', 'youtube', 20, 3, false,
    E'## Sanlar\n\nОдин, два, три... — 1, 2, 3...\n\n## Vaqt\n- Который час? — Soat necha?\n- Сейчас три часа. — Hozir soat uchda.'
  FROM m2
  RETURNING id
),

-- Module 3 lessons
l7 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m3.id, 'Rod va son — Rod va ko''plik', 'oHg5SJYRHA0', 'youtube', 22, 1, true,
    E'## Grammatik jinsi (Rod)\n\nRus tilida 3 ta jins bor:\n- Мужской (erkak) — стол, учитель\n- Женский (ayol) — школа, книга\n- Средний (o''rta) — окно, место'
  FROM m3
  RETURNING id
),
l8 AS (
  INSERT INTO public.lessons (module_id, title, video_url, video_provider, duration_min, "order", is_free, content_md)
  SELECT m3.id, 'Kelishiklar — падежи', 'oHg5SJYRHA0', 'youtube', 25, 2, false,
    E'## Rus tilida 6 ta kelishik\n\n1. Именительный — Kim? Nima?\n2. Родительный — Kimning? Nimaning?\n3. Дательный — Kimga? Nimaga?\n4. Винительный — Kimni? Nimani?\n5. Творительный — Kim bilan?\n6. Предложный — Kim haqida?'
  FROM m3
  RETURNING id
)

SELECT 'Course seeded successfully' AS result;
