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
    title: "O'zbekistondan Rossiya maktabiga qabul: 2025–2026 federal talablari",
    description:
      "Hujjatlar ro'yxati, rus tili bo'yicha majburiy test, maktab moslashuvi muddatlari — 273-FZ va Minprosveshcheniya buyruqlari asosida.",
    isDraft: false,
    updatedAt: '2026-08-06',
    body: `## Nima uchun bu muhim

O'zbekistondan Rossiyaga ko'chgan yoki bolani Rossiya maktabiga topshirmoqchi bo'lgan oilalarda odatda ikkita asosiy savol tug'iladi: qanday hujjatlar kerak va bola rus tilini qanday darajada bilishi kerak. Maqola 2025–2026 o'quv yili uchun federal talablar bo'yicha yo'nalish beradi — aniq tafsilotlar mintaqa va maktabga qarab farq qiladi.

## 1-qadam — qabul uchun hujjatlar

Federal ro'yxat Minprosveshcheniya buyrug'i № 458 bilan belgilangan (keyingi tahrirlar № 171 va № 727).

Majburiy hujjatlar:
- Ariza va rus tili testiga rozilik
- Bolaning shaxsini tasdiqlovchi hujjat (chet el fuqarosi pasporti yoki o'rnini bosuvchi hujjat)
- Qarindoshlik yoki vakil vakolati haqida hujjat (tug'ilish haqida guvohnoma; vasiy uchun — tegishli hujjat)
- Bolaning va uning vakilining Rossiyada qonuniy turishi haqida hujjatlar (YShIH, YShIB, amal qilayotgan viza yoki migratsiya kartasi — statusga qarab)
- Xavfli yuqumli kasalliklar yo'qligi to'g'risida tibbiy xulosa — bu oddiy maktab tibbiy kartasi 026/u bilan bir xil emas
- 10-sinfga qabul qilishda — umumiy asosiy ta'lim to'g'risida attestat (agar attestat rus va muvaffaqiyatli GIA dan keyin olingan bo'lsa, u til testini ham o'rnini bosadi)
- Rus tilida bo'lmagan barcha hujjatlarning tasdiqlangan tarjimasi

Qonunda nazarda tutilganda:
- Bolaning daktiloskopik ro'yxatdan o'tkazilganligini tasdiqlash — yoshi va migratsiya statusiga qarab qo'llaniladi

Faqat mavjud bo'lganda (maxsus olib kelish shart emas):
- Chet elda rus tilini o'rganganlik haqida hujjatlar (2–11 sinflar uchun)
- Ota-onaning INN, bolaning SNILS
- Ota-onaning mehnat faoliyati to'g'risida hujjatlar

Maktab tibbiy hamrohlik uchun so'rashi mumkin, lekin yo'qligi uchun qabulni rad etishga haqi yo'q:
- Emlash sertifikati
- OMS polisi
- 026/u shaklidagi tibbiy karta

Maktab federal ro'yxatdan tashqari hujjatlarni talab qilishi mumkin emas — bu № 458 buyrug'ining 27-bandi bilan to'g'ridan-to'g'ri taqiqlangan. Mintaqaviy hujjatlar marshrutlash va topshirish shaklini belgilaydi, lekin majburiy ro'yxatni kengaytira olmaydi.

## 2-qadam — rus tili bo'yicha test

2025-yil 1-apreldan boshlab (federal qonun № 544-FZ, Minprosveshcheniya buyrug'i № 170) chet el fuqarosi davlat yoki munitsipal maktabga birinchi marta qabul qilinganda rus tili bo'yicha test majburiy.

Nimalarni bilish kerak:
- Test bepul
- Uni tanlangan maktab emas, balki mintaqaviy ta'lim boshqarmasi tomonidan maxsus tayinlangan test maktabi o'tkazadi
- Topshiriqlar sinflar bo'yicha farqlanadi va bolaning o'qituvchini tushunish, og'zaki va yozma javob berish, o'quv matni bilan ishlash qobiliyatini tekshiradi
- 1-sinfda — og'zaki test (dialog, qisqa monolog, eshitish orqali tushunish, asosiy leksika va grammatika)
- Keyingi sinflarda — FIPI tomonidan aniq sinf uchun belgilangan spetsifikatsiya bo'yicha og'zaki va yozma topshiriqlar
- Natija 3 ish kuni ichida maktabga uzatiladi
- Muvaffaqiyatsizlikda qayta urinish — 3 oydan oldin emas
- Minimal o'tish bali Rosobrnadzor tomonidan belgilanadi (2026-yilda yakuniy shkalada 3 ball — 1-sinf uchun 10 ta boshlang'ich balldan 9 ga to'g'ri keladi)

Test kerak emas, agar:
- bola bir rus maktabidan boshqasiga belgilangan tartibda ko'chirilsa
- bola 10-sinfga muvaffaqiyatli GIA dan keyin olingan rus attestati bilan qabul qilinsa
- bola № 727 buyrug'ida ko'rsatilgan alohida toifalarga kirsa

O'zbekiston fuqaroligi o'zi istisno emas.

## 3-qadam — moslashuv va qo'llab-quvvatlash

Minprosveshcheniya ma'lumotlariga ko'ra, tashkil etilgan qo'llab-quvvatlash bilan dastlabki maktab moslashuvi odatda bir o'quv yili atrofida davom etadi. Bu maktab dasturi uchun ko'rsatkich, akademik til uchun emas.

Bilim lingvistikasi bo'yicha tadqiqotlar akademik rus tili uchun 4 yildan 7 yilgacha vaqt ko'rsatadi. Kundalik erkin muloqot bolaning matematika, atrofimizdagi olam fanidan masalalarni yoki yozma ko'rsatmalarni tushunishini kafolatlamaydi.

Nima yordam beradi:
- Nafaqat tilni, balki fanlar bo'yicha oldingi bilimlarni ham kirish diagnostikasi
- Chet tili sifatida rus tilining intensiv kursi
- Oddiy sinf bilan qo'shimcha til mashg'ulotlarini birlashtirish
- Zarurat bo'lsa individual o'quv rejasi
- Repetitorlik va psixologik qo'llab-quvvatlash
- Vizual tayanch, nutq modellari, maktab leksikasini oldindan tushuntirish
- To'garaklar va tengdoshlar bilan qo'shma faoliyatda ishtirok
- Uyda ona tilini saqlash — Minprosveshcheniya faqat rus tiliga o'tishni talab qilishni tavsiya etmaydi

## Xulosa

Federal qabul tartibi hozir ancha rasmiylashtirilgan: hujjatlar — yopiq ro'yxat bo'yicha, rus tili — shaffof shkala bilan majburiy test orqali. Aniq maktablar ro'yxati va test o'tkazish muddatlari mintaqa tomonidan belgilanadi. Hujjat topshirishdan oldin mintaqaviy portal yoki tanlangan maktab bilan aniqlashtirish kerak — oxirgi muddatlar va topshirish shakllari farq qilishi mumkin.

Ishonchli manbalar: 273-FZ (ta'lim to'g'risida), 544-FZ (2024-yil 28-dekabr), Minprosveshcheniya buyruqlari № 458 (2020), № 170 (2025), № 171 (2025), № 727 (2025), FIPI spetsifikatsiyalari, Rosobrnadzor buyrug'i № 510 (2025-yil 5-mart).`,
  },
  {
    slug: 'podgotovka-k-rossiyskoy-shkole',
    locale: 'ru',
    translationSlug: 'bolani-rossiya-maktabiga-tayyorlash',
    title: 'Подготовка к российской школе из Узбекистана: федеральные требования 2025–2026',
    description:
      'Документы для зачисления, обязательное тестирование по русскому языку, сроки адаптации — по 273-ФЗ и приказам Минпросвещения.',
    isDraft: false,
    updatedAt: '2026-08-06',
    body: `## Почему это важно

Когда семья из Узбекистана переезжает в Россию или хочет оформить ребёнка в российскую школу, у родителей обычно два вопроса: какие документы нужны и на каком уровне ребёнок должен владеть русским языком. Эта статья даёт направление по федеральным требованиям 2025–2026 учебного года — конкретные детали зависят от региона и школы.

## Шаг 1 — документы для зачисления

Федеральный перечень установлен приказом Минпросвещения № 458 (в действующих редакциях приказов № 171 и № 727).

Обязательные:
- Заявление о приёме и согласие на тестирование по русскому языку
- Документ, удостоверяющий личность ребёнка (паспорт иностранного гражданина или заменяющий документ)
- Документ о родстве или полномочиях представителя (свидетельство о рождении; для опекуна — соответствующий документ)
- Документы о законности пребывания в России самого ребёнка и его представителя (ВНЖ, РВП, действующая виза или миграционная карта — в зависимости от статуса)
- Медицинское заключение об отсутствии опасных инфекционных заболеваний — это не то же самое, что общая школьная медицинская карта по форме 026/у
- При приёме в 10-й класс — аттестат об основном общем образовании (если аттестат российский и получен после успешной ГИА, он же заменяет языковой тест)
- Заверенный перевод на русский всех документов, составленных не на русском языке

Когда предусмотрено законом:
- Подтверждение дактилоскопической регистрации ребёнка — применимость зависит от возраста и миграционного статуса

Только при наличии (получать специально ради подачи не требуется):
- Документы об изучении русского языка за рубежом (для 2–11 классов)
- ИНН родителя, СНИЛС ребёнка
- Документы о трудовой деятельности родителя

Школа может попросить для медицинского сопровождения, но не вправе отказать в зачислении из-за их отсутствия:
- Прививочный сертификат
- Полис ОМС
- Медицинская карта по форме 026/у

Школа не может требовать документы сверх федерального перечня — это прямо запрещено пунктом 27 приказа № 458. Региональные акты определяют маршрутизацию и форму подачи, но не могут расширять обязательный список.

## Шаг 2 — тестирование по русскому языку

С 1 апреля 2025 года (федеральный закон № 544-ФЗ, приказ Минпросвещения № 170) тестирование по русскому языку обязательно при первичном поступлении иностранного гражданина в государственную или муниципальную школу.

Что нужно знать:
- Тест бесплатный
- Его проводит не выбранная школа, а специально назначенная региональным органом управления образованием тестирующая школа
- Задания различаются по классам и проверяют, сможет ли ребёнок понимать учителя, отвечать устно и письменно, работать с учебным текстом
- В 1-м классе — устный тест (диалог, короткий монолог, понимание на слух, базовая лексика и грамматика)
- В последующих классах — устные и письменные задания по спецификации ФИПИ для конкретного класса
- Результат передаётся в школу в течение 3 рабочих дней
- При неуспехе повторная попытка — не раньше чем через 3 месяца
- Минимальный проходной балл устанавливает Рособрнадзор (в 2026 году это 3 балла по итоговой шкале — для 1-го класса соответствует 9 из 10 первичных)

Тест не нужен, если:
- ребёнок переводится из одной российской школы в другую по установленному порядку
- ребёнок поступает в 10-й класс с российским аттестатом, полученным после успешной ГИА
- ребёнок относится к отдельным категориям, перечисленным в приказе № 727

Просто гражданство Узбекистана исключением не является.

## Шаг 3 — адаптация и поддержка

По данным Минпросвещения, при организованной поддержке первичная школьная адаптация обычно занимает около одного учебного года. Это ориентир для школьной программы, не для академического языка.

Исследования билингвизма дают более длинный срок для академического русского — от 4 до 7 лет. Свободное бытовое общение не гарантирует, что ребёнок понимает формулировки задач по математике, формулировки письменных инструкций или язык учебника по окружающему миру.

Что помогает:
- Входная диагностика не только языка, но и предыдущих знаний по предметам
- Интенсивный курс русского как иностранного / неродного
- Сочетание обычного класса с дополнительными языковыми занятиями
- Индивидуальный учебный план при необходимости
- Тьюторское и психологическое сопровождение
- Визуальные опоры, речевые модели, предварительное объяснение школьной лексики
- Участие в кружках и совместной деятельности со сверстниками
- Сохранение родного языка дома — Минпросвещения не рекомендует требовать перехода только на русский

## Вывод

Федеральный порядок приёма сейчас довольно формализован: документы — по закрытому перечню, русский язык — через обязательное тестирование с прозрачной шкалой. Конкретный список школ для подачи и тестирования, а также сроки приёма устанавливает регион. Перед подачей стоит свериться с региональным порталом или выбранной школой — крайние сроки и формы подачи могут различаться.

Источники: 273-ФЗ «Об образовании в РФ», 544-ФЗ от 28.12.2024, приказы Минпросвещения № 458 (2020), № 170 (04.03.2025), № 171 (04.03.2025), № 727 (08.10.2025), спецификации ФИПИ для тестирования иностранных граждан, приказ Рособрнадзора № 510 от 05.03.2025.`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}