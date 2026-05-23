// data/words.ts
export type LanguageLevel = "A1" | "A2" | "B1"

export type Word = {
  slovak: string
  russian: string
  category: string
  level: LanguageLevel
  hint?: string
  pronunciation?: string
}

export const words: Word[] = [
  // ==========================================
  // 💬 КАТЕГОРИЯ: Разговорные фразы (База)
  // ==========================================
  { slovak: "Ahoj", russian: "Привет", category: "💬 Разговорные фразы", level: "A1", hint: "Ахой (как 'ahoy')" },
  { slovak: "Dobrý deň", russian: "Добрый день", category: "💬 Разговорные фразы", level: "A1", hint: "Добрый день (ударение на ы)" },
  { slovak: "Ďakujem", russian: "Спасибо", category: "💬 Разговорные фразы", level: "A1", hint: "Дьякуйем — запомните через 'дякую'" },
  { slovak: "Prosím", russian: "Пожалуйста", category: "💬 Разговорные фразы", level: "A1", hint: "Просим — как просьба" },
  { slovak: "Ako sa máš?", russian: "Как дела?", category: "💬 Разговорные фразы", level: "A1", hint: "Ако са маш?" },
  { slovak: "Dobre", russian: "Хорошо", category: "💬 Разговорные фразы", level: "A1", hint: "Добре (как 'добро' — хорошо)" },
  { slovak: "Teší ma", russian: "Приятно познакомиться", category: "💬 Разговорные фразы", level: "A1", hint: "Теши ма" },
  { slovak: "Dovidenia", russian: "До свидания", category: "💬 Разговорные фразы", level: "A1", hint: "Довидения — похоже на 'до видения'" },
  { slovak: "Prepáčte", russian: "Извините", category: "💬 Разговорные фразы", level: "A1", hint: "Препачте" },
  
  { slovak: "Nerozumiem", russian: "Я не понимаю", category: "💬 Разговорные фразы", level: "A2", hint: "Нерозумием (не разумею)" },
  { slovak: "Hovoríte po anglicky?", russian: "Вы говорите по-английски?", category: "💬 Разговорные фразы", level: "A2", hint: "Говорите по английски?" },
  { slovak: "Ako sa to povie po slovensky?", russian: "Как это сказать по-словацки?", category: "💬 Разговорные фразы", level: "A2", hint: "Ако са то повье по словенски?" },
  { slovak: "Môžete mi pomôcť?", russian: "Вы можете мне помочь?", category: "💬 Разговорные фразы", level: "A2", hint: "Можете ми помогть?" },
  
  { slovak: "Čo si o tom myslíš?", russian: "Что ты об этом думаешь?", category: "💬 Разговорные фразы", level: "B1", hint: "Чо си о том мыслиш?" },
  { slovak: "Podľa môjho názoru", russian: "По моему мнению", category: "💬 Разговорные фразы", level: "B1", hint: "Подля мойго назору" },
  { slovak: "Môžete to zopakovať, prosím?", russian: "Можете это повторить, пожалуйста?", category: "💬 Разговорные фразы", level: "B1", hint: "Можете то зопаковать просим?" },

  // ==========================================
  // 🍎 КАТЕГОРИЯ: Еда и рестораны
  // ==========================================
  { slovak: "Chlieb", russian: "Хлеб", category: "🍎 Еда и рестораны", level: "A1", hint: "Хлиеп (похоже на 'хлеб')" },
  { slovak: "Voda", russian: "Вода", category: "🍎 Еда и рестораны", level: "A1", hint: "Вода — как в русском" },
  { slovak: "Káva", russian: "Кофе", category: "🍎 Еда и рестораны", level: "A1", hint: "Ка:ва" },
  { slovak: "Čaj", russian: "Чай", category: "🍎 Еда и рестораны", level: "A1", hint: "Чай" },
  { slovak: "Mlieko", russian: "Молоко", category: "🍎 Еда и рестораны", level: "A1", hint: "Млиеко" },
  { slovak: "Raňajky", russian: "Завтрак", category: "🍎 Еда и рестораны", level: "A1", hint: "Раняйки (ранний приём пищи)" },
  
  { slovak: "Účet, prosím", russian: "Счет, пожалуйста", category: "🍎 Еда и рестораны", level: "A2", hint: "Учет просим" },
  { slovak: "Dám si kávu", russian: "Я буду кофе", category: "🍎 Еда и рестораны", level: "A2", hint: "Дам си каву (дам себе кофе)" },
  { slovak: "Jedálny lístok", russian: "Меню", category: "🍎 Еда и рестораны", level: "A2", hint: "Едалны листок (лист с едой)" },
  { slovak: "Máte voľný stôl?", russian: "У вас есть свободный столик?", category: "🍎 Еда и рестораны", level: "A2", hint: "Мате вольны стол?" },
  
  { slovak: "Chutilo mi to veľmi", russian: "Мне это очень понравилось", category: "🍎 Еда и рестораны", level: "B1", hint: "Хутило ми то вельми" },
  { slovak: "Som allergies na orechy", russian: "У меня аллергия на орехи", category: "🍎 Еда и рестораны", level: "B1", hint: "Сом алергик на орехи" },
  { slovak: "Môžem dostať pohár vody z vodovodu?", russian: "Можно мне стакан воды из-под крана?", category: "🍎 Еда и рестораны", level: "B1", hint: "Можем достать пога́р воды з водоводу?" },

  // ==========================================
  // 🛒 КАТЕГОРИЯ: Покупки и деньги
  // ==========================================
  { slovak: "Obchod", russian: "Магазин", category: "🛒 Покупки и деньги", level: "A1", hint: "Обход (как 'обходить' магазины)" },
  { slovak: "Peniaze", russian: "Деньги", category: "🛒 Покупки и деньги", level: "A1", hint: "Пенязе (похоже на 'пенязи' — деньги)" },
  { slovak: "Taška", russian: "Сумка", category: "🛒 Покупки и деньги", level: "A1", hint: "Ташка (сумка)" },
  
  { slovak: "Koľko to stojí?", russian: "Сколько это стоит?", category: "🛒 Покупки и деньги", level: "A2", hint: "Колько то стои?" },
  { slovak: "Môžem platiť kartou?", russian: "Можно заплатить картой?", category: "🛒 Покупки и деньги", level: "A2", hint: "Можем платить картоу?" },
  { slovak: "Kde je pokladňa?", russian: "Где касса?", category: "🛒 Покупки и деньги", level: "A2", hint: "Кде е покладна?" },
  { slovak: "To je príliš drahé", russian: "Это слишком дорого", category: "🛒 Покупки и деньги", level: "A2", hint: "То е прилиш драге" },
  
  { slovak: "Máte na to nejakú zľavu?", russian: "У вас есть на это какая-то скидка?", category: "🛒 Покупки и деньги", level: "B1", hint: "Мате на то неяку зляву?" },
  { slovak: "Potrebujem bloček od nákupu", russian: "Мне нужен чек от покупки", category: "🛒 Покупки и деньги", level: "B1", hint: "Потребуем блочек од накупу" },
  { slovak: "Chcem to vrátiť alebo vymeniť", russian: "Я хочу это вернуть или обменять", category: "🛒 Покупки и деньги", level: "B1", hint: "Хцем то вратить алеbo вменить" },

  // ==========================================
  // 🏠 КАТЕГОРИЯ: Жилье и аренда
  // ==========================================
  { slovak: "Dom", russian: "Дом", category: "🏠 Жилье и аренда", level: "A1", hint: "Дом" },
  { slovak: "Byt", russian: "Квартира", category: "🏠 Жилье и аренда", level: "A1", hint: "Быт (как 'быт')" },
  { slovak: "Kľúč", russian: "Ключ", category: "🏠 Жилье и аренда", level: "A1", hint: "Ключ" },
  { slovak: "Izba", russian: "Комната", category: "🏠 Жилье и аренда", level: "A1", hint: "Изба (комната)" },
  
  { slovak: "Hľadám podnájom", russian: "Я ищу жилье в аренду", category: "🏠 Жилье и аренда", level: "A2", hint: "Глядам поднаём" },
  { slovak: "Kde sú tu toalety?", russian: "Где здесь туалет?", category: "🏠 Жилье и аренда", level: "A2", hint: "Кде су ту тоалеты?" },
  { slovak: "Nájomné zahŕňa energie", russian: "Арендная плата включает коммуналку", category: "🏠 Жилье и аренда", level: "A2", hint: "Наёмне заґрня енергие" },
  
  { slovak: "Podpísali sme nájomnú zmluvu", russian: "Мы подписали договор аренды", category: "🏠 Жилье и аренда", level: "B1", hint: "Подпісали с ме наёмну змулу" },
  { slovak: "Kaucia je vo výške jedného nájmu", russian: "Залог составляет размер одной месячной аренды", category: "🏠 Жилье и аренда", level: "B1", hint: "Кауция е во вышке едного наёму" },
  { slovak: "Nefunguje internet v obývačke", russian: "Не работает интернет в гостиной", category: "🏠 Жилье и аренда", level: "B1", hint: "Нефунгуе интернет в обывачке" },

  // ==========================================
  // ✈️ КАТЕГОРИЯ: Город и транспорт
  // ==========================================
  { slovak: "Mesto", russian: "Город", category: "✈️ Город и транспорт", level: "A1", hint: "Место (город как место)" },
  { slovak: "Ulica", russian: "Улица", category: "✈️ Город и транспорт", level: "A1", hint: "Улица" },
  { slovak: "Auto", russian: "Машина", category: "✈️ Город и транспорт", level: "A1", hint: "Ауто" },
  
  { slovak: "Kde je autobusová stanica?", russian: "Где автобусный вокзал?", category: "✈️ Город и транспорт", level: "A2", hint: "Кде е аутобусова станица?" },
  { slovak: "Kde si môžem kúpiť lístok?", russian: "Где я могу купить билет?", category: "✈️ Город и транспорт", level: "A2", hint: "Кде си можем купить листок?" },
  { slovak: "Choďte stále rovno", russian: "Идите всё время прямо", category: "✈️ Город и транспорт", level: "A2", hint: "Ходьте стале ровно" },
  { slovak: "Stratil som sa", russian: "Я потерялся", category: "✈️ Город и транспорт", level: "A2", hint: "Стратил сом са" },
  
  { slovak: "Tento vlak má meškanie", russian: "Этот поезд задерживается", category: "✈️ Город и транспорт", level: "B1", hint: "Тенто влак ма мешканье" },
  { slovak: "Musím prestúpiť na ďalšej zastávke", russian: "Мне нужно пересесть на следующей остановке", category: "✈️ Город и транспорт", level: "B1", hint: "Мусим преступить на дальшей заставке" },
  { slovak: "Kde nájdem stanovište taxíkov?", russian: "Где мне найти стоянку такси?", category: "✈️ Город и транспорт", level: "B1", hint: "Кде найдем становиште таксиков?" },

  // ==========================================
  // 💼 КАТЕГОРИЯ: Работа и учеба
  // ==========================================
  { slovak: "Práca", russian: "Работа", category: "💼 Работа и учеба", level: "A1", hint: "Праца (работа)" },
  { slovak: "Škola", russian: "Школа", category: "💼 Работа и учеба", level: "A1", hint: "Школа" },
  { slovak: "Kolega", russian: "Коллега", category: "💼 Работа и учеба", level: "A1", hint: "Колега" },
  
  { slovak: "Hľadám novú prácu", russian: "Я ищу новую работу", category: "💼 Работа и учеба", level: "A2", hint: "Глядам нову працу" },
  { slovak: "Mám dnes veľa úloh", russian: "У меня сегодня много задач", category: "💼 Работа и учеба", level: "A2", hint: "Мам днес веля улох" },
  { slovak: "Kedy končí pracovná doba?", russian: "Когда заканчивается рабочее время?", category: "💼 Работа и учеба", level: "A2", hint: "Кеди кончи працовна доба?" },
  
  { slovak: "Zajtra mám pracovný pohovor", russian: "Завтра у меня собеседование", category: "💼 Работа и учеба", level: "B1", hint: "Зайтра мам працовны поховор" },
  { slovak: "Súhlasím s vaším názorom", russian: "Я согласен с вашим мнением", category: "💼 Работа и учеба", level: "B1", hint: "Сугласим с вашим назором" },
  { slovak: "Musíme poslať životopis", russian: "Нам нужно отправить резюме", category: "💼 Работа и учеба", level: "B1", hint: "Мусиме послать животопис" },

  // ==========================================
  // 🏥 КАТЕГОРИЯ: Здоровье и медицина
  // ==========================================
  { slovak: "Lekár", russian: "Врач", category: "🏥 Здоровье и медицина", level: "A1", hint: "Лекарь" },
  { slovak: "Lekáreň", russian: "Аптека", category: "🏥 Здоровье и медицина", level: "A1", hint: "Лекарен" },
  { slovak: "Nemocnica", russian: "Больница", category: "🏥 Здоровье и медицина", level: "A1", hint: "Немоцница" },
  
  { slovak: "Bolí ma hlava", russian: "У меня болит голова", category: "🏥 Здоровье и медицина", level: "A2", hint: "Боли ма глава" },
  { slovak: "Mám vysokú teplotu", russian: "У меня высокая температура", category: "🏥 Здоровье и медицина", level: "A2", hint: "Мам высоку теплоту" },
  { slovak: "Potrebujem lieky proti bolesti", russian: "Мне нужны обезболивающие лекарства", category: "🏥 Здоровье и медицина", level: "A2", hint: "Потребуем льеки против болести" },
  
  { slovak: "Musím sa objednať k lekárovi", russian: "Мне нужно записаться на прием к врачу", category: "🏥 Здоровье и медицина", level: "B1", hint: "Мусим са объеднять к лекарови" },
  { slovak: "Máte predpis na tento liek?", russian: "У вас есть рецепт на это лекарство?", category: "🏥 Здоровье и медицина", level: "B1", hint: "Мате предпис на тенто льек?" },
  { slovak: "Cítim sa zle už dva dni", russian: "Я чувствую себя плохо уже два дня", category: "🏥 Здоровье и медицина", level: "B1", hint: "Цитим са зле уж два дни" },

  // ==========================================
  // 📦 КАТЕГОРИЯ: Почта, Банк и Документы
  // ==========================================
  { slovak: "Pas", russian: "Паспорт", category: "📦 Почта, Банк и Документы", level: "A1", hint: "Пас" },
  { slovak: "Pošta", russian: "Почта", category: "📦 Почта, Банк и Документы", level: "A1", hint: "Пошта" },
  { slovak: "Banka", russian: "Банк", category: "📦 Почта, Банк и Документы", level: "A1", hint: "Банка" },
  { slovak: "Podpis", russian: "Подпись", category: "📦 Почта, Банк и Документы", level: "A1", hint: "Подпис" },
  
  { slovak: "Tu je môj pas", russian: "Вот мой паспорт", category: "📦 Почта, Банк и Документы", level: "A2", hint: "Ту е мой пас" },
  { slovak: "Chcem si otvoriť účet", russian: "Я хочу открыть счет", category: "📦 Почта, Банк и Документы", level: "A2", hint: "Хцем си отворить учет" },
  { slovak: "Potrebujem poslať balík", russian: "Мне нужно отправить посылку", category: "📦 Почта, Банк и Документы", level: "A2", hint: "Потребуем послать балик" },
  { slovak: "Kde je cudzinecká polícia?", russian: "Где полиция по делам иностранцев?", category: "📦 Почта, Банк и Документы", level: "A2", hint: "Кде е цудзинецка полиция?" },
  
  { slovak: "Vyplňte toto tlačivo, prosím", russian: "Заполните этот бланк, пожалуйста", category: "📦 Почта, Банк и Документы", level: "B1", hint: "Выпньте тото тлачиво просим" },
  { slovak: "Potrebujem potvrdenie o pobyte", russian: "Мне нужно подтверждение о проживании", category: "📦 Почта, Банк и Документы", level: "B1", hint: "Потребуем потврденье о побьте" },
  { slovak: "Zablokujte moju bankovú kartu", russian: "Заблокируйте мою банковскую карту", category: "📦 Почта, Банк и Документы", level: "B1", hint: "Заблоккуйте мою банкову карту" }
]