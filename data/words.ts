export type LanguageLevel = "A1" | "A2" | "B1"

export type Word = {
  slovak: string
  russian: string
  category: string
  level: LanguageLevel
}

export const words: Word[] = [
  // ==========================================
  // 💬 КАТЕГОРИЯ: Разговорные фразы (База)
  // ==========================================
  { slovak: "Ahoj", russian: "Привет", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Dobrý deň", russian: "Добрый день", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Ďakujem", russian: "Спасибо", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Prosím", russian: "Пожалуйста", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Ako sa máš?", russian: "Как дела?", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Dobre", russian: "Хорошо", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Teší ma", russian: "Приятно познакомиться", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Dovidenia", russian: "До свидания", category: "💬 Разговорные фразы", level: "A1" },
  { slovak: "Prepáčte", russian: "Извините", category: "💬 Разговорные фразы", level: "A1" },
  
  { slovak: "Nerozumiem", russian: "Я не понимаю", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Hovoríte po anglicky?", russian: "Вы говорите по-английски?", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Ako sa to povie po slovensky?", russian: "Как это сказать по-словацки?", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Môžete mi pomôcť?", russian: "Вы можете мне помочь?", category: "💬 Разговорные фразы", level: "A2" },
  
  { slovak: "Čo si o tom myslíš?", russian: "Что ты об этом думаешь?", category: "💬 Разговорные фразы", level: "B1" },
  { slovak: "Podľa môjho názoru", russian: "По моему мнению", category: "💬 Разговорные фразы", level: "B1" },
  { slovak: "Môžete to zopakovať, prosím?", russian: "Можете это повторить, пожалуйста?", category: "💬 Разговорные фразы", level: "B1" },

  // ==========================================
  // 🍎 КАТЕГОРИЯ: Еда и рестораны
  // ==========================================
  { slovak: "Chlieb", russian: "Хлеб", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Voda", russian: "Вода", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Káva", russian: "Кофе", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Čaj", russian: "Чай", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Mlieko", russian: "Молоко", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Raňajky", russian: "Завтрак", category: "🍎 Еда и рестораны", level: "A1" },
  
  { slovak: "Účet, prosím", russian: "Счет, пожалуйста", category: "🍎 Еда и рестораны", level: "A2" },
  { slovak: "Dám si kávu", russian: "Я буду кофе", category: "🍎 Еда и рестораны", level: "A2" },
  { slovak: "Jedálny lístok", russian: "Меню", category: "🍎 Еда и рестораны", level: "A2" },
  { slovak: "Máte voľný stôl?", russian: "У вас есть свободный столик?", category: "🍎 Еда и рестораны", level: "A2" },
  
  { slovak: "Chutilo mi to veľmi", russian: "Мне это очень понравилось", category: "🍎 Еда и рестораны", level: "B1" },
  { slovak: "Som allergies na orechy", russian: "У меня аллергия на орехи", category: "🍎 Еда и рестораны", level: "B1" },
  { slovak: "Môžem dostať pohár vody z vodovodu?", russian: "Можно мне стакан воды из-под крана?", category: "🍎 Еда и рестораны", level: "B1" },

  // ==========================================
  // 🛒 КАТЕГОРИЯ: Покупки и деньги
  // ==========================================
  { slovak: "Obchod", russian: "Магазин", category: "🛒 Покупки и деньги", level: "A1" },
  { slovak: "Peniaze", russian: "Деньги", category: "🛒 Покупки и деньги", level: "A1" },
  { slovak: "Taška", russian: "Сумка", category: "🛒 Покупки и деньги", level: "A1" },
  
  { slovak: "Koľko to stojí?", russian: "Сколько это стоит?", category: "🛒 Покупки и деньги", level: "A2" },
  { slovak: "Môžem platiť kartou?", russian: "Можно заплатить картой?", category: "🛒 Покупки и деньги", level: "A2" },
  { slovak: "Kde je pokladňa?", russian: "Где касса?", category: "🛒 Покупки и деньги", level: "A2" },
  { slovak: "To je príliš drahé", russian: "Это слишком дорого", category: "🛒 Покупки и деньги", level: "A2" },
  
  { slovak: "Máte na to nejakú zľavu?", russian: "У вас есть на это какая-то скидка?", category: "🛒 Покупки и деньги", level: "B1" },
  { slovak: "Potrebujem bloček od nákupu", russian: "Мне нужен чек от покупки", category: "🛒 Покупки и деньги", level: "B1" },
  { slovak: "Chcem to vrátiť alebo vymeniť", russian: "Я хочу это вернуть или обменять", category: "🛒 Покупки и деньги", level: "B1" },

  // ==========================================
  // 🏠 КАТЕГОРИЯ: Жилье и аренда
  // ==========================================
  { slovak: "Dom", russian: "Дом", category: "🏠 Жилье и аренда", level: "A1" },
  { slovak: "Byt", russian: "Квартира", category: "🏠 Жилье и аренда", level: "A1" },
  { slovak: "Kľúč", russian: "Ключ", category: "🏠 Жилье и аренда", level: "A1" },
  { slovak: "Izba", russian: "Комната", category: "🏠 Жилье и аренда", level: "A1" },
  
  { slovak: "Hľadám podnájom", russian: "Я ищу жилье в аренду", category: "🏠 Жилье и аренда", level: "A2" },
  { slovak: "Kde sú tu toalety?", russian: "Где здесь туалет?", category: "🏠 Жилье и аренда", level: "A2" },
  { slovak: "Nájomné zahŕňa energie", russian: "Арендная плата включает коммуналку", category: "🏠 Жилье и аренда", level: "A2" },
  
  { slovak: "Podpísali sme nájomnú zmluvu", russian: "Мы подписали договор аренды", category: "🏠 Жилье и аренда", level: "B1" },
  { slovak: "Kaucia je vo výške jedného nájmu", russian: "Залог составляет размер одной месячной аренды", category: "🏠 Жилье и аренда", level: "B1" },
  { slovak: "Nefunguje internet v obývačke", russian: "Не работает internet в гостиной", category: "🏠 Жилье и аренда", level: "B1" },

  // ==========================================
  // ✈️ КАТЕГОРИЯ: Город и транспорт
  // ==========================================
  { slovak: "Mesto", russian: "Город", category: "✈️ Город и транспорт", level: "A1" },
  { slovak: "Ulica", russian: "Улица", category: "✈️ Город и транспорт", level: "A1" },
  { slovak: "Auto", russian: "Машина", category: "✈️ Город и транспорт", level: "A1" },
  
  { slovak: "Kde je autobusová stanica?", russian: "Где автобусный вокзал?", category: "✈️ Город и транспорт", level: "A2" },
  { slovak: "Kde si môžem kúpiť lístok?", russian: "Где я могу купить билет?", category: "✈️ Город и транспорт", level: "A2" },
  { slovak: "Choďte stále rovno", russian: "Идите всё время прямо", category: "✈️ Город и транспорт", level: "A2" },
  { slovak: "Stratil som sa", russian: "Я потерялся", category: "✈️ Город и транспорт", level: "A2" },
  
  { slovak: "Tento vlak má meškanie", russian: "Этот поезд задерживается", category: "✈️ Город и транспорт", level: "B1" },
  { slovak: "Musím prestúpiť na ďalšej zastávke", russian: "Мне нужно пересесть на следующей остановке", category: "✈️ Город и транспорт", level: "B1" },
  { slovak: "Kde nájdem stanovište taxíkov?", russian: "Где мне найти стоянку такси?", category: "✈️ Город и транспорт", level: "B1" },

  // ==========================================
  // 💼 КАТЕГОРИЯ: Работа и учеба
  // ==========================================
  { slovak: "Práca", russian: "Работа", category: "💼 Работа и учеба", level: "A1" },
  { slovak: "Škola", russian: "Школа", category: "💼 Работа и учеба", level: "A1" },
  { slovak: "Kolega", russian: "Коллега", category: "💼 Работа и учеба", level: "A1" },
  
  { slovak: "Hľadám novú prácu", russian: "Я ищу новую работу", category: "💼 Работа и учеба", level: "A2" },
  { slovak: "Mám dnes veľa úloh", russian: "У меня сегодня много задач", category: "💼 Работа и учеба", level: "A2" },
  { slovak: "Kedy končí pracovná doba?", russian: "Когда заканчивается рабочее время?", category: "💼 Работа и учеба", level: "A2" },
  
  { slovak: "Zajtra mám pracovný pohovor", russian: "Завтра у меня собеседование", category: "💼 Работа и учеба", level: "B1" },
  { slovak: "Súhlasím s vaším názorom", russian: "Я согласен с вашим мнением", category: "💼 Работа и учеба", level: "B1" },
  { slovak: "Musíme poslaть životopis", russian: "Нам нужно отправить резюме", category: "💼 Работа и учеба", level: "B1" },

  // ==========================================
  // 🏥 КАТЕГОРИЯ: Здоровье и медицина
  // ==========================================
  { slovak: "Lekár", russian: "Врач", category: "🏥 Здоровье и медицина", level: "A1" },
  { slovak: "Lekáreň", russian: "Аптека", category: "🏥 Здоровье и медицина", level: "A1" },
  { slovak: "Nemocnica", russian: "Больница", category: "🏥 Здоровье и медицина", level: "A1" },
  
  { slovak: "Bolí ma hlava", russian: "У меня болит голова", category: "🏥 Здоровье и медицина", level: "A2" },
  { slovak: "Mám vysokú teplotu", russian: "У меня высокая температура", category: "🏥 Здоровье и медицина", level: "A2" },
  { slovak: "Potrebujem lieky proti bolesti", russian: "Мне нужны обезболивающие лекарства", category: "🏥 Здоровье и медицина", level: "A2" },
  
  { slovak: "Musím sa objednať k lekárovi", russian: "Мне нужно записаться на прием к врачу", category: "🏥 Здоровье и медицина", level: "B1" },
  { slovak: "Máte predpis na tento liek?", russian: "У вас есть рецепт на это лекарство?", category: "🏥 Здоровье и медицина", level: "B1" },
  { slovak: "Cítim sa zle už dva dni", russian: "Я чувствую себя плохо уже два дня", category: "🏥 Здоровье и медицина", level: "B1" },

  // ==========================================
  // 📦 КАТЕГОРИЯ: Почта, Банк и Документы
  // ==========================================
  { slovak: "Pas", russian: "Паспорт", category: "📦 Почта, Банк и Документы", level: "A1" },
  { slovak: "Pošta", russian: "Почта", category: "📦 Почта, Банк и Документы", level: "A1" },
  { slovak: "Banka", russian: "Банк", category: "📦 Почта, Банк и Документы", level: "A1" },
  { slovak: "Podpis", russian: "Подпись", category: "📦 Почта, Банк и Документы", level: "A1" },
  
  { slovak: "Tu je môj pas", russian: "Вот мой паспорт", category: "📦 Почта, Банк и Документы", level: "A2" },
  { slovak: "Chcem si otvoriť účet", russian: "Я хочу открыть счет", category: "📦 Почта, Банк и Документы", level: "A2" },
  { slovak: "Potrebujem poslať balík", russian: "Мне нужно отправить посылку", category: "📦 Почта, Банк и Документы", level: "A2" },
  { slovak: "Kde je cudzinecká polícia?", russian: "Где полиция по делам иностранцев?", category: "📦 Почта, Банк и Документы", level: "A2" },
  
  { slovak: "Vyplňte toto tlačivo, prosím", russian: "Заполните этот бланк, пожалуйста", category: "📦 Почта, Банк и Документы", level: "B1" },
  { slovak: "Potrebujem potvrdenie o pobyte", russian: "Мне нужно подтверждение о проживании", category: "📦 Почта, Банк и Документы", level: "B1" },
  { slovak: "Zablokujte moju bankovú kartu", russian: "Заблокируйте мою банковскую карту", category: "📦 Почта, Банк и Документы", level: "B1" }
]