export interface Article {
  slug: string
  locale: 'uz' | 'ru'
  /** slug of the sibling translation, if one exists */
  translationSlug?: string
  title: string
  description: string
  /** Draft content has not been fact-checked yet — kept unpublished/noindex until reviewed */
  isDraft: boolean
  updatedAt: string
  body: string
}

export const articles: Article[] = [
  {
    slug: 'bolani-rossiya-maktabiga-tayyorlash',
    locale: 'uz',
    translationSlug: 'podgotovka-k-rossiyskoy-shkole',
    title: "O'zbekistonlik bola Rossiya maktabiga qanday tayyorlanadi?",
    description:
      "O'zbekistondan Rossiya maktabiga qabul uchun kerakli hujjatlar, til tayyorgarligi va bosqichlar haqida qisqa qo'llanma.",
    isDraft: true,
    updatedAt: '2026-08-03',
    body: `## Nima uchun bu muhim?

Oila Rossiyaga ko'chib o'tayotganda yoki bolani u yerdagi maktabga topshirmoqchi bo'lganda, ota-onalar odatda ikkita savol bilan duch keladi: qanday hujjatlar kerak va bola rus tilini qanday darajada bilishi kerak. Bu maqola umumiy yo'nalishni ko'rsatadi — aniq talablar maktab va mintaqaga qarab farq qilishi mumkin.

### 1-bosqich — hujjatlarni tayyorlash

- Bolaning tug'ilganlik haqida guvohnomasi (tarjimasi bilan)
- Avvalgi maktabdan tabel/ma'lumotnoma
- Ota-onaning pasporti va ro'yxatdan o'tish hujjatlari
- Tibbiy ma'lumotnoma (vaksinatsiya jadvali)

Aniq ro'yxat maktab va viloyatga qarab farqlanishi mumkin — hujjatlarni topshirishdan oldin tanlangan maktab bilan bevosita bog'lanish tavsiya etiladi.

### 2-bosqich — til darajasini baholash

Ko'pchilik maktablar bolani sinfga joylashtirishdan oldin rus tili darajasini tekshiradi. Kundalik muloqot va darsxona lug'atini bilish katta ahamiyatga ega — ayniqsa boshlang'ich sinflarda.

### 3-bosqich — moslashuv davri

Yangi maktab, yangi til muhiti — bolaga moslashish uchun vaqt kerak. Intensiv tayyorgarlik bu davrni qisqartirishga yordam beradi, lekin har bir bola individual.

## Xulosa

Tayyorgarlik qanchalik erta boshlansa, moslashuv shunchalik yengil kechadi. Aniq talablarni albatta tanlangan maktab bilan tasdiqlang.`,
  },
  {
    slug: 'podgotovka-k-rossiyskoy-shkole',
    locale: 'ru',
    translationSlug: 'bolani-rossiya-maktabiga-tayyorlash',
    title: 'Как ребёнку из Узбекистана подготовиться к поступлению в российскую школу',
    description:
      'Краткое руководство: какие документы нужны и как оценивается уровень языка при переходе в российскую школу из Узбекистана.',
    isDraft: true,
    updatedAt: '2026-08-03',
    body: `## Почему это важно

Когда семья переезжает в Россию или хочет оформить ребёнка в местную школу, у родителей обычно возникает два вопроса: какие документы нужны и на каком уровне ребёнок должен владеть русским языком. Эта статья даёт общее направление — точные требования зависят от конкретной школы и региона.

### Шаг 1 — документы

- Свидетельство о рождении ребёнка (с переводом)
- Табель/справка из предыдущей школы
- Паспорт родителя и документы о регистрации
- Медицинская справка (карта прививок)

Точный список может отличаться в зависимости от школы и региона — перед подачей документов рекомендуется уточнить требования напрямую в выбранной школе.

### Шаг 2 — оценка уровня языка

Многие школы проверяют уровень русского языка перед зачислением в класс. Важны бытовое общение и школьная лексика — особенно в начальных классах.

### Шаг 3 — период адаптации

Новая школа, новая языковая среда — ребёнку нужно время на адаптацию. Интенсивная подготовка может сократить этот период, но каждый ребёнок индивидуален.

## Вывод

Чем раньше начата подготовка, тем легче проходит адаптация. Точные требования обязательно уточняйте у выбранной школы.`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}
