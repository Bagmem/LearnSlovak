export type LanguageLevel = "A1" | "A2" | "B1" | "B2"

export type Word = {
  slovak: string
  russian: string
  category: string
  level: LanguageLevel
  hint?: string
}

export const words: Word[] = [
  // ==========================================
  // 💬 РАЗГОВОРНЫЕ ФРАЗЫ (существующие + новые)
  // ==========================================
  { slovak: "Ahoj", russian: "Привет", category: "💬 Разговорные фразы", level: "A1", hint: "Ахой" },
  { slovak: "Dobrý deň", russian: "Добрый день", category: "💬 Разговорные фразы", level: "A1", hint: "Добры день" },
  { slovak: "Ďakujem", russian: "Спасибо", category: "💬 Разговорные фразы", level: "A1", hint: "Дьякуйем" },
  { slovak: "Prosím", russian: "Пожалуйста", category: "💬 Разговорные фразы", level: "A1", hint: "Просим" },
  { slovak: "Ako sa máš?", russian: "Как дела?", category: "💬 Разговорные фразы", level: "A1", hint: "Ако са маш?" },
  { slovak: "Dobre", russian: "Хорошо", category: "💬 Разговорные фразы", level: "A1", hint: "Добре" },
  { slovak: "Teší ma", russian: "Приятно познакомиться", category: "💬 Разговорные фразы", level: "A1", hint: "Теши ма" },
  { slovak: "Dovidenia", russian: "До свидания", category: "💬 Разговорные фразы", level: "A1", hint: "Довидения" },
  { slovak: "Prepáčte", russian: "Извините", category: "💬 Разговорные фразы", level: "A1", hint: "Препачте" },
  { slovak: "Nerozumiem", russian: "Я не понимаю", category: "💬 Разговорные фразы", level: "A2", hint: "Нерозумием" },
  { slovak: "Hovoríte po anglicky?", russian: "Вы говорите по-английски?", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Ako sa to povie po slovensky?", russian: "Как это сказать по-словацки?", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Môžete mi pomôcť?", russian: "Вы можете мне помочь?", category: "💬 Разговорные фразы", level: "A2" },
  { slovak: "Čo si o tom myslíš?", russian: "Что ты об этом думаешь?", category: "💬 Разговорные фразы", level: "B1" },
  { slovak: "Podľa môjho názoru", russian: "По моему мнению", category: "💬 Разговорные фразы", level: "B1" },
  { slovak: "Môžete to zopakovať, prosím?", russian: "Можете это повторить, пожалуйста?", category: "💬 Разговорные фразы", level: "B1" },
  // --- новые фразы для повседневного общения ---
  { slovak: "Môžem ísť na toaletu?", russian: "Можно мне выйти в туалет?", category: "💬 Разговорные фразы", level: "A2", hint: "Можем исть на тоалету?" },
  { slovak: "Nemám čas", russian: "У меня нет времени", category: "💬 Разговорные фразы", level: "A2", hint: "Немам час" },
  { slovak: "Som z Ruska", russian: "Я из России", category: "💬 Разговорные фразы", level: "A2", hint: "Сом з Руска" },
  { slovak: "Učím sa po slovensky", russian: "Я учу словацкий", category: "💬 Разговорные фразы", level: "A2", hint: "Учим са по словенски" },
  { slovak: "Môžeme sa dohodnúť?", russian: "Можем ли мы договориться?", category: "💬 Разговорные фразы", level: "B1", hint: "Можеме са догоднуть?" },
  { slovak: "To je zaujímavé", russian: "Это интересно", category: "💬 Разговорные фразы", level: "B1", hint: "То йе зауйимаве" },
  { slovak: "Prajem vám pekný deň", russian: "Желаю вам хорошего дня", category: "💬 Разговорные фразы", level: "B1", hint: "Прайем вам пекны день" },
  { slovak: "Nech sa páči", russian: "Пожалуйста (при подаче/предложении)", category: "💬 Разговорные фразы", level: "B2", hint: "Нех са пачи" },

  // ==========================================
  // 🍎 ЕДА И РЕСТОРАНЫ (существующие + новые фразы)
  // ==========================================
  { slovak: "Chlieb", russian: "Хлеб", category: "🍎 Еда и рестораны", level: "A1", hint: "Хлиеп" },
  { slovak: "Voda", russian: "Вода", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Káva", russian: "Кофе", category: "🍎 Еда и рестораны", level: "A1", hint: "Ка:ва" },
  { slovak: "Čaj", russian: "Чай", category: "🍎 Еда и рестораны", level: "A1" },
  { slovak: "Mlieko", russian: "Молоко", category: "🍎 Еда и рестораны", level: "A1", hint: "Млиеко" },
  { slovak: "Raňajky", russian: "Завтрак", category: "🍎 Еда и рестораны", level: "A1", hint: "Раняйки" },
  { slovak: "Účet, prosím", russian: "Счет, пожалуйста", category: "🍎 Еда и рестораны", level: "A2", hint: "Учет просим" },
  { slovak: "Dám si kávu", russian: "Я буду кофе", category: "🍎 Еда и рестораны", level: "A2", hint: "Дам си каву" },
  { slovak: "Jedálny lístok", russian: "Меню", category: "🍎 Еда и рестораны", level: "A2", hint: "Едалны листок" },
  { slovak: "Máte voľný stôl?", russian: "У вас есть свободный столик?", category: "🍎 Еда и рестораны", level: "A2", hint: "Мате вольны стол?" },
  { slovak: "Chutilo mi to veľmi", russian: "Мне это очень понравилось", category: "🍎 Еда и рестораны", level: "B1" },
  { slovak: "Som alergický na orechy", russian: "У меня аллергия на орехи", category: "🍎 Еда и рестораны", level: "B1" },
  { slovak: "Môžem dostať pohár vody z vodovodu?", russian: "Можно мне стакан воды из-под крана?", category: "🍎 Еда и рестораны", level: "B1" },
  // --- новые фразы про еду ---
  { slovak: "Raňajkujem doma", russian: "Я завтракаю дома", category: "🍎 Еда и рестораны", level: "A2", hint: "Раняйкуем дома" },
  { slovak: "Ideme na večeru", russian: "Идём на ужин", category: "🍎 Еда и рестораны", level: "A2", hint: "Идеме на вечеру" },
  { slovak: "Dajte si pozor na alergény", russian: "Осторожнее с аллергенами", category: "🍎 Еда и рестораны", level: "B1", hint: "Дайтэ си позор на алергены" },
  { slovak: "Chcem niečo ľahké", russian: "Я хочу что-то лёгкое", category: "🍎 Еда и рестораны", level: "B1", hint: "Хцем нечо лахке" },

  // ==========================================
  // 🛒 ПОКУПКИ И ДЕНЬГИ (существующие + новые)
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
  // --- новые фразы о покупках ---
  { slovak: "Idem nakupovať", russian: "Я иду за покупками", category: "🛒 Покупки и деньги", level: "A2", hint: "Идем накуповать" },
  { slovak: "Môžem si to vyskúšať?", russian: "Можно это примерить?", category: "🛒 Покупки и деньги", level: "A2", hint: "Можем си то выскушшать?" },
  { slovak: "Hľadám darček pre mamu", russian: "Ищу подарок для мамы", category: "🛒 Покупки и деньги", level: "B1", hint: "Глядам дарчек пре маму" },
  { slovak: "Potrebujem niečo lacnejšie", russian: "Мне нужно что-то подешевле", category: "🛒 Покупки и деньги", level: "B1", hint: "Потребуем нечо лацнейше" },

  // ==========================================
  // 🏠 ЖИЛЬЁ И АРЕНДА (существующие + новые)
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
  { slovak: "Nefunguje internet v obývačke", russian: "Не работает интернет в гостиной", category: "🏠 Жилье и аренда", level: "B1" },
  // --- новые фразы про жильё ---
  { slovak: "Chcel by som si prenajať byt", russian: "Я хотел бы снять квартиру", category: "🏠 Жилье и аренда", level: "B1", hint: "Хцел бы сом си пренаять быт" },
  { slovak: "Je k dispozícii parkovanie?", russian: "Есть ли парковка?", category: "🏠 Жилье и аренда", level: "B1", hint: "Йе к диспозиции паркованье?" },

  // ==========================================
  // ✈️ ГОРОД И ТРАНСПОРТ (существующие + новые)
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
  // --- новые фразы про транспорт ---
  { slovak: "Cestujem vlakom", russian: "Я путешествую поездом", category: "✈️ Город и транспорт", level: "A2", hint: "Цестуйем влаком" },
  { slovak: "Ktorý autobus ide na hlavnú stanicu?", russian: "Какой автобус идёт на главный вокзал?", category: "✈️ Город и транспорт", level: "B1", hint: "Кторы аутобус иде на главну станицу?" },

  // ==========================================
  // 💼 РАБОТА И УЧЁБА (существующие + новые)
  // ==========================================
  { slovak: "Práca", russian: "Работа", category: "💼 Работа и учеба", level: "A1" },
  { slovak: "Škola", russian: "Школа", category: "💼 Работа и учеба", level: "A1" },
  { slovak: "Kolega", russian: "Коллега", category: "💼 Работа и учеба", level: "A1" },
  { slovak: "Hľadám novú prácu", russian: "Я ищу новую работу", category: "💼 Работа и учеба", level: "A2" },
  { slovak: "Mám dnes veľa úloh", russian: "У меня сегодня много задач", category: "💼 Работа и учеба", level: "A2" },
  { slovak: "Kedy končí pracovná doba?", russian: "Когда заканчивается рабочее время?", category: "💼 Работа и учеба", level: "A2" },
  { slovak: "Zajtra mám pracovný pohovor", russian: "Завтра у меня собеседование", category: "💼 Работа и учеба", level: "B1" },
  { slovak: "Súhlasím s vaším názorom", russian: "Я согласен с вашим мнением", category: "💼 Работа и учеба", level: "B1" },
  { slovak: "Musíme poslať životopis", russian: "Нам нужно отправить резюме", category: "💼 Работа и учеба", level: "B1" },
  // --- новые фразы про работу и учёбу ---
  { slovak: "Mám vysokoškolské vzdelanie", russian: "У меня высшее образование", category: "💼 Работа и учеба", level: "B1", hint: "Мам высокошкольске взделане" },
  { slovak: "Pracujem v kancelárii", russian: "Я работаю в офисе", category: "💼 Работа и учеба", level: "A2", hint: "Працуйем в канцелярии" },

  // ==========================================
  // 🏥 ЗДОРОВЬЕ И МЕДИЦИНА (существующие + новые)
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
  // --- новые фразы про здоровье ---
  { slovak: "Zavolajte sanitku", russian: "Вызовите скорую помощь", category: "🏥 Здоровье и медицина", level: "A2", hint: "Заволяйте саннитку" },
  { slovak: "Potrebujem zubného lekára", russian: "Мне нужен зубной врач", category: "🏥 Здоровье и медицина", level: "B1", hint: "Потребуем зубнего лекара" },

  // ==========================================
  // 📦 ПОЧТА, БАНК И ДОКУМЕНТЫ (существующие + новые)
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
  { slovak: "Zablokujte moju bankovú kartu", russian: "Заблокируйте мою банковскую карту", category: "📦 Почта, Банк и Документы", level: "B1" },
  // --- новые фразы для бюрократии ---
  { slovak: "Chcem si vybaviť občiansky preukaz", russian: "Я хочу оформить удостоверение личности", category: "📦 Почта, Банк и Документы", level: "B2", hint: "Хцем си выбавить обчански преукас" },

  // ==========================================
  // 🏠 СЕМЬЯ И ОТНОШЕНИЯ (новая категория)
  // ==========================================
  { slovak: "moja rodina", russian: "моя семья", category: "🏠 Семья и отношения", level: "A1", hint: "мойа родина" },
  { slovak: "matka", russian: "мама", category: "🏠 Семья и отношения", level: "A1", hint: "матка" },
  { slovak: "otec", russian: "папа", category: "🏠 Семья и отношения", level: "A1", hint: "отец" },
  { slovak: "brat", russian: "брат", category: "🏠 Семья и отношения", level: "A1", hint: "брат" },
  { slovak: "sestra", russian: "сестра", category: "🏠 Семья и отношения", level: "A1", hint: "сестра" },
  { slovak: "starý rodič", russian: "дедушка или бабушка", category: "🏠 Семья и отношения", level: "A2", hint: "стары родич" },
  { slovak: "manžel", russian: "муж", category: "🏠 Семья и отношения", level: "A2", hint: "манжел" },
  { slovak: "manželka", russian: "жена", category: "🏠 Семья и отношения", level: "A2", hint: "манжелка" },
  { slovak: "dieťa", russian: "ребёнок", category: "🏠 Семья и отношения", level: "A2", hint: "дье́тя" },
  { slovak: "priateľ", russian: "друг", category: "🏠 Семья и отношения", level: "A2", hint: "приятель" },
  { slovak: "priateľka", russian: "подруга", category: "🏠 Семья и отношения", level: "A2", hint: "приятелька" },
  // фразы о семье
  { slovak: "Bývam s rodičmi", russian: "Я живу с родителями", category: "🏠 Семья и отношения", level: "A2", hint: "Бывам с родичми" },
  { slovak: "Mám dvoch súrodencov", russian: "У меня двое братьев/сестёр", category: "🏠 Семья и отношения", level: "B1", hint: "Мам двох суроденцов" },

  // ==========================================
  // ⚽ ХОББИ И СПОРТ (новая категория)
  // ==========================================
  { slovak: "šport", russian: "спорт", category: "⚽ Хобби и спорт", level: "A2" },
  { slovak: "futbal", russian: "футбол", category: "⚽ Хобби и спорт", level: "A2" },
  { slovak: "hokej", russian: "хоккей", category: "⚽ Хобби и спорт", level: "A2" },
  { slovak: "plávanie", russian: "плавание", category: "⚽ Хобби и спорт", level: "B1" },
  { slovak: "bicykel", russian: "велосипед", category: "⚽ Хобби и спорт", level: "A2" },
  { slovak: "hudba", russian: "музыка", category: "⚽ Хобби и спорт", level: "A2" },
  { slovak: "čítanie kníh", russian: "чтение книг", category: "⚽ Хобби и спорт", level: "A2", hint: "читанье книг" },
  { slovak: "maľovanie", russian: "рисование", category: "⚽ Хобби и спорт", level: "B1" },
  // фразы о хобби
  { slovak: "Rád pozerám filmy", russian: "Я люблю смотреть фильмы", category: "⚽ Хобби и спорт", level: "A2", hint: "Рад позерам филмы" },
  { slovak: "Chodím do posilňovne", russian: "Я хожу в тренажёрный зал", category: "⚽ Хобби и спорт", level: "B1", hint: "Ходим до посилёвне" },

  // ==========================================
  // 🌦 ПОГОДА И ПРИРОДА (новая категория)
  // ==========================================
  { slovak: "počasie", russian: "погода", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "slnko", russian: "солнце", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "dážď", russian: "дождь", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "sneh", russian: "снег", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "vietor", russian: "ветер", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "hora", russian: "гора", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "les", russian: "лес", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "rieka", russian: "река", category: "🌦 Погода и природа", level: "A2" },
  { slovak: "jazero", russian: "озеро", category: "🌦 Погода и природа", level: "B1" },
  // фразы о погоде
  { slovak: "Dnes je pekne", russian: "Сегодня красиво", category: "🌦 Погода и природа", level: "A2", hint: "Днес йе пекне" },
  { slovak: "Prší ako z krhle", russian: "Льёт как из ведра", category: "🌦 Погода и природа", level: "B1", hint: "Прши ако з кргле" },

  // ==========================================
  // 😊 ЭМОЦИИ И ЧУВСТВА (новая категория)
  // ==========================================
  { slovak: "šťastný", russian: "счастливый", category: "😊 Эмоции и чувства", level: "A2" },
  { slovak: "smutný", russian: "грустный", category: "😊 Эмоции и чувства", level: "A2" },
  { slovak: "unavený", russian: "уставший", category: "😊 Эмоции и чувства", level: "A2" },
  { slovak: "nervózny", russian: "нервный", category: "😊 Эмоции и чувства", level: "B1" },
  { slovak: "báť sa", russian: "бояться", category: "😊 Эмоции и чувства", level: "B1" },
  { slovak: "milovať", russian: "любить", category: "😊 Эмоции и чувства", level: "B1" },
  { slovak: "nenávidieť", russian: "ненавидеть", category: "😊 Эмоции и чувства", level: "B1" },
  // фразы про чувства
  { slovak: "Teším sa na víkend", russian: "Я радуюсь выходным", category: "😊 Эмоции и чувства", level: "B1", hint: "Тешим са на викенд" },
  { slovak: "Je mi to ľúto", russian: "Мне жаль", category: "😊 Эмоции и чувства", level: "B1", hint: "Йе ми то люто" },

  // ==========================================
  // 🚀 УРОВЕНЬ B2 (продвинутые фразы для всех категорий)
  // ==========================================
  { slovak: "Môžem vás požiadať o láskavosť?", russian: "Могу я попросить вас об одолжении?", category: "💬 Разговорные фразы", level: "B2" },
  { slovak: "Bolo by možné...", russian: "Было бы возможно...", category: "💬 Разговорные фразы", level: "B2" },
  { slovak: "V žiadnom prípade", russian: "Ни в коем случае", category: "💬 Разговорные фразы", level: "B2" },
  { slovak: "zbytočne sa obávať", russian: "напрасно беспокоиться", category: "💬 Разговорные фразы", level: "B2" },
  { slovak: "Rozumiem tomu", russian: "Я понимаю это", category: "💬 Разговорные фразы", level: "B2" },
  // Деловые фразы B2
  { slovak: "Dovoľte mi predstaviť sa", russian: "Позвольте представиться", category: "💼 Работа и учеба", level: "B2" },
  { slovak: "Termín je posunutý na budúci týždeň", russian: "Срок перенесён на следующую неделю", category: "💼 Работа и учеба", level: "B2" },
]