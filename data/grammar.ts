import { type Word } from "./words"

export interface GrammarWord extends Word {
  hint?: string
}

export const grammarTasks: GrammarWord[] = [
  // ==========================================
  // ⚙️ Глагол "Byť" (быть) – оставляем существующие
  // ==========================================
  { 
    slovak: "Ja som študent", 
    russian: "Я (есть) студент", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) в настоящем времени:**\n• **Ja som** (Я есть)\n• Ty si (Ты есть)\n• On/Ona/Ono je (Он/Она/Оно есть)"
  },
  { 
    slovak: "Ty si unavený", 
    russian: "Ты (есть) уставший", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) в настоящем времени:**\n• Ja som (Я есть)\n• **Ty si** (Ты есть)\n• On/Ona/Ono je (Он/Она/Оно есть)"
  },
  { 
    slovak: "On je lekár", 
    russian: "Он (есть) врач", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) в настоящем времени:**\n• Ja som (Я есть)\n• Ty si (Ты есть)\n• **On je** (Он есть)"
  },
  { 
    slovak: "My sme tu", 
    russian: "Мы (есть) здесь", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) во множественном числе:**\n• **My sme** (Мы есть)\n• Vy ste (Вы есть)\n• Oni sú (Они есть)"
  },
  { 
    slovak: "Vy ste doma", 
    russian: "Вы (есть) дома", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) во множественном числе:**\n• My sme (Мы есть)\n• **Vy ste** (Вы есть)\n• Oni sú (Они есть)"
  },
  { 
    slovak: "Oni sú v meste", 
    russian: "Они (есть) в городе", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A1",
    hint: "**Глагол Byť (Быть) во множественном числе:**\n• My sme (Мы есть)\n• Vy ste (Вы есть)\n• **Oni sú** (Они есть)"
  },
  { 
    slovak: "Nie som chorý", 
    russian: "Я не болен (Отрицание)", 
    category: "⚙️ Глагол 'Byť'", 
    level: "A2",
    hint: "**Отрицание с глаголом Byť:**\nПросто добавь частицу **Nie** перед глаголом:\n• **Nie som** (Я не есть)\n• Nie si (Ты не есть)"
  },

  // ==========================================
  // ⚙️ Глагол "Mať" (иметь) – оставляем существующие
  // ==========================================
  { 
    slovak: "Mám otázku", 
    russian: "У меня есть (я имею) вопрос", 
    category: "⚙️ Глагол 'Mať'", 
    level: "A1",
    hint: "**Глагол Mať (Иметь):**\nВ форме *я* отбрасывается окончание инфинитива и добавляется **-ám**:\n• **Ja mám**\n• Ty máš\n• On/Ona má"
  },
  { 
    slovak: "Máš čas?", 
    russian: "У тебя есть (ты имеешь) время?", 
    category: "⚙️ Глагол 'Mať'", 
    level: "A1",
    hint: "**Глагол Mať (Иметь):**\nДля формы *ты* добавляется окончание **-áš**:\n• **Ty máš**"
  },
  { 
    slovak: "Oni majú byt", 
    russian: "У них есть (они имеют) квартира", 
    category: "⚙️ Глагол 'Mať'", 
    level: "A1",
    hint: "**Глагол Mať (Иметь) для формы 'Они' (Oni):**\nВсегда получает окончание **-ajú**:\n• Oni **majú**"
  },
  { 
    slovak: "Nemám peniaze", 
    russian: "У меня нет денег", 
    category: "⚙️ Глагол 'Mať'", 
    level: "A2",
    hint: "**Отрицание с обычными глаголами:**\nЧастица **ne-** пишется *слитно* с глаголом:\n• **Nemám** (Не имею)\n• Nemáš (Не имеешь)"
  },

  // ==========================================
  // ⚙️ Род и окончания (A2-B1) – оставляем существующие
  // ==========================================
  { 
    slovak: "To je dobrý muž", 
    russian: "Это хороший мужчина", 
    category: "⚙️ Род и окончания", 
    level: "A2",
    hint: "**Мужской род прилагательных:**\nВ именительном падеже почти всегда заканчивается на долгую **-ý**:\n• dobr**ý** muž\n• pekn**ý** dom"
  },
  { 
    slovak: "To je dobrá žena", 
    russian: "Это хорошая женщина", 
    category: "⚙️ Род и окончания", 
    level: "A2",
    hint: "**Женский род прилагательных:**\nВ именительном падеже почти всегда заканчивается на долгую **-á**:\n• dobr**á** žena\n• pekn**á** ulica"
  },
  { 
    slovak: "To je dobré mesto", 
    russian: "Это хороший город", 
    category: "⚙️ Род и окончания", 
    level: "A2",
    hint: "**Средний род прилагательных:**\nВ именительном падеже почти всегда заканчивается на долгую **-é**:\n• dobr**é** mesto\n• pekn**é** auto"
  },

  // ==========================================
  // ⚙️ НОВЫЕ ГРАММАТИЧЕСКИЕ ТЕМЫ
  // ==========================================

  // ---------- Падежи (Nominatív, Akuzatív) ----------
  {
    slovak: "Vidím pekný dom",
    russian: "Я вижу красивый дом (винительный падеж)",
    category: "⚙️ Падежи (Akuzatív)",
    level: "B1",
    hint: "**Винительный падеж (koho? čo?):**\nДля мужских неодушевлённых и средних – форма совпадает с именительным.\n• Vidím pekný dom – (koho? čo?) dom."
  },
  {
    slovak: "Mám novú knihu",
    russian: "У меня есть новая книга (винительный падеж)",
    category: "⚙️ Падежи (Akuzatív)",
    level: "B1",
    hint: "**Винительный падеж женского рода:**\nОкончание **-u** (koho? čo? knihu)."
  },
  {
    slovak: "Bez otca nemôžem ísť",
    russian: "Без отца я не могу идти (родительный падеж)",
    category: "⚙️ Падежи (Genitív)",
    level: "B1",
    hint: "**Родительный падеж (bez koho? bez čoho?):**\n• bez otca (муж.род)\n• bez matky (жен.род)"
  },
  {
    slovak: "Dávam darček sestre",
    russian: "Я даю подарок сестре (дательный падеж)",
    category: "⚙️ Падежи (Datív)",
    level: "B1",
    hint: "**Дательный падеж (komu? čomu?):**\n• sestre (жен.род, окончание -e)\n• bratovi (муж.род, окончание -ovi)"
  },

  // ---------- Будущее время (budúci čas) ----------
  {
    slovak: "Budem študovať slovenčinu",
    russian: "Я буду учить словацкий язык",
    category: "⚙️ Будущее время",
    level: "A2",
    hint: "**Будущее время образуется с помощью вспомогательного глагола 'byť' в будущем времени + инфинитив:**\n• budem + študovať\n• budeš + študovať\n• bude + študovať"
  },
  {
    slovak: "Zajtra pôjdem do práce",
    russian: "Завтра я пойду на работу (глагол движения)",
    category: "⚙️ Будущее время",
    level: "A2",
    hint: "**Некоторые глаголы имеют особую форму будущего времени:**\n• ísť → pôjdem (я пойду)\n• mať → budem mať (я буду иметь)"
  },

  // ---------- Модальные глаголы ----------
  {
    slovak: "Môžem otvoriť okno?",
    russian: "Можно мне открыть окно?",
    category: "⚙️ Модальные глаголы",
    level: "A2",
    hint: "**Модальный глагол môcť (мочь):**\n• ja môžem\n• ty môžeš\n• on môže\nПосле модального глагола инфинитив ставится в конце."
  },
  {
    slovak: "Musím sa učiť",
    russian: "Я должен учиться",
    category: "⚙️ Модальные глаголы",
    level: "B1",
    hint: "**Musieť (должен):**\n• ja musím\n• ty musíš\n• on musí"
  },
  {
    slovak: "Chcem si kúpiť auto",
    russian: "Я хочу купить машину",
    category: "⚙️ Модальные глаголы",
    level: "A2",
    hint: "**Chcieť (хотеть):**\n• ja chcem\n• ty chceš\n• on chce"
  },

  // ---------- Условное наклонение (podmieňovací spôsob) ----------
  {
    slovak: "Keby som mal peniaze, kúpil by som dom",
    russian: "Если бы у меня были деньги, я бы купил дом",
    category: "⚙️ Условные предложения",
    level: "B2",
    hint: "**Условные предложения (Keby + minulý čas, + by + minulý čas):**\n• Keby som mal – если бы я имел\n• kúpil by som – я бы купил"
  },
  {
    slovak: "Rád by som si dal kávu",
    russian: "Я хотел бы выпить кофе (вежливая форма)",
    category: "⚙️ Условные предложения",
    level: "B1",
    hint: "**Вежливая просьба с 'by som':**\n• rád by som – я бы хотел\n• mohli by ste – вы могли бы"
  },

  // ---------- Предлоги (A2-B1) ----------
  {
    slovak: "Kniha je na stole",
    russian: "Книга на столе",
    category: "⚙️ Предлоги",
    level: "A2",
    hint: "**Предлог 'na' + местный падеж:**\n• na stole (на столе)\n• na stene (на стене)"
  },
  {
    slovak: "Idem do školy",
    russian: "Я иду в школу",
    category: "⚙️ Предлоги",
    level: "A2",
    hint: "**Предлог 'do' + родительный падеж (направление):**\n• do školy\n• do mesta"
  },
  {
    slovak: "Bývam na Slovensku",
    russian: "Я живу в Словакии",
    category: "⚙️ Предлоги",
    level: "B1",
    hint: "**Предлог 'na' с названиями стран (кроме некоторых):**\n• na Slovensku\n• na Ukrajine\n• ale: v Česku, v Poľsku"
  },
]