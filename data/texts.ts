// data/texts.ts
export type TextLevel = "A1" | "A2" | "B1" | "B2"
export type TextTopic = 
  | "pozdravy" | "rodina" | "jedlo" | "cestovanie" | "praca" | "zdravie" 
  | "priroda" | "kultura" | "technologia" | "zvyky" | "historia" | "sport"

export type Question = {
  text: string
  options: string[]
  correct: number
}

export interface SlovakText {
  id: string
  title: string
  level: TextLevel
  topic: TextTopic
  content: string
  translation: string
  wordCount: number
  questions: Question[]
}

export const texts: SlovakText[] = [
  // ===== A1 ===== (8 textov)
  {
    id: "pozdravy-1",
    title: "Prvé kroky: Pozdravy",
    level: "A1",
    topic: "pozdravy",
    content: "Ahoj! Volám sa Jana. Som zo Slovenska. Ako sa voláš? Teší ma, že ťa spoznávam.",
    translation: "Привет! Меня зовут Яна. Я из Словакии. Как тебя зовут? Рада познакомиться.",
    wordCount: 12,
    questions: [
      { text: "Ako sa volá dievča?", options: ["Jana", "Anna", "Eva", "Mária"], correct: 0 },
      { text: "Odkiaľ je Jana?", options: ["Z Ruska", "Zo Slovenska", "Z Česka", "Z Poľska"], correct: 1 },
    ],
  },
  {
    id: "v-obchode",
    title: "V obchode",
    level: "A1",
    topic: "jedlo",
    content: "Dobrý deň. Prosím si chlieb a mlieko. Koľko to stojí? Dve eurá, prosím. Ďakujem. Dovidenia.",
    translation: "Добрый день. Пожалуйста, хлеб и молоко. Сколько это стоит? Два евро, пожалуйста. Спасибо. До свидания.",
    wordCount: 15,
    questions: [
      { text: "Čo si kupuje?", options: ["Chlieb a maslo", "Mlieko a chlieb", "Cukor a mlieko", "Len chlieb"], correct: 1 },
      { text: "Koľko stojí nákup?", options: ["1 euro", "2 eurá", "3 eurá", "4 eurá"], correct: 1 },
    ],
  },
  {
    id: "moja-rodina",
    title: "Moja rodina",
    level: "A1",
    topic: "rodina",
    content: "Mám mamu, otca a jedného brata. Moja mama je lekárka. Otec pracuje v obchode. Brat chodí do školy. Rád s nimi trávim čas.",
    translation: "У меня есть мама, папа и один брат. Моя мама – врач. Папа работает в магазине. Брат ходит в школу. Я люблю проводить с ними время.",
    wordCount: 22,
    questions: [
      { text: "Koľko má bratov a sestier?", options: ["Jedného brata", "Jednu sestru", "Dvoch bratov", "Žiadnych"], correct: 0 },
      { text: "Kde pracuje otec?", options: ["V škole", "V nemocnici", "V obchode", "V kancelárii"], correct: 2 },
    ],
  },
  {
    id: "moj-den",
    title: "Môj deň",
    level: "A1",
    topic: "zvyky",
    content: "Ráno vstávam o siedmej. Umývam sa, obliekam a raňajkujem. Potom idem do práce. Po práci sa vraciam domov, varím večeru a pozerám televíziu. O desiatej idem spať.",
    translation: "Утром я встаю в семь. Умываюсь, одеваюсь и завтракаю. Потом иду на работу. После работы возвращаюсь домой, готовлю ужин и смотрю телевизор. В десять ложусь спать.",
    wordCount: 28,
    questions: [
      { text: "Kedy vstáva?", options: ["O šiestej", "O siedmej", "O ôsmej", "O deviatej"], correct: 1 },
      { text: "Čo robí po práci?", options: ["Varí večeru", "Ide do posilňovne", "Spí", "Učí sa"], correct: 0 },
    ],
  },
  {
    id: "moja-izba",
    title: "Moja izba",
    level: "A1",
    topic: "rodina",
    content: "Moja izba je malá, ale útulná. Je tam posteľ, stôl, stolička a skriňa. Na stene visí plagát. Rád sa tam učím a odpočívam.",
    translation: "Моя комната маленькая, но уютная. Там кровать, стол, стул и шкаф. На стене висит плакат. Я люблю там учиться и отдыхать.",
    wordCount: 25,
    questions: [
      { text: "Čo je v izbe?", options: ["Posteľ, stôl, skriňa", "Posteľ, gauč, televízor", "Stôl, posteľ, koberec", "Skriňa, kreslo, lampa"], correct: 0 },
      { text: "Čo visí na stene?", options: ["Obraz", "Plagát", "Hodiny", "Zrkadlo"], correct: 1 },
    ],
  },
  {
    id: "obľúbené jedlo",
    title: "Moje obľúbené jedlo",
    level: "A1",
    topic: "jedlo",
    content: "Moje obľúbené jedlo sú bryndzové halušky. Sú to zemiakové halušky s bryndzou a slaninou. Je to tradičné slovenské jedlo. Mám ho rád aj s kyslou smotanou.",
    translation: "Моё любимое блюдо – брынзовые галушки. Это картофельные галушки с брынзой и беконом. Это традиционное словацкое блюдо. Я люблю его также со сметаной.",
    wordCount: 28,
    questions: [
      { text: "Aké je tradičné slovenské jedlo?", options: ["Bryndzové halušky", "Pizza", "Čína", "Rezeň"], correct: 0 },
      { text: "Čo obsahujú halušky?", options: ["Bryndzu a slaninu", "Šunku a syr", "Mäso a zemiaky", "Huby a cibuľu"], correct: 0 },
    ],
  },
  {
    id: "moji-kamarati",
    title: "Moji kamaráti",
    level: "A1",
    topic: "rodina",
    content: "Mám dvoch dobrých kamarátov. Volajú sa Peter a Juraj. Spoločne chodíme do školy a cez víkendy hrávame futbal. Sú to skvelí chalani.",
    translation: "У меня есть два хороших друга. Их зовут Петер и Юрай. Мы вместе ходим в школу и по выходным играем в футбол. Они отличные парни.",
    wordCount: 23,
    questions: [
      { text: "Koľko kamarátov má autor?", options: ["Jedného", "Dvoch", "Troch", "Štyroch"], correct: 1 },
      { text: "Čo robia cez víkend?", options: ["Hrajú futbal", "Chodia do kina", "Učia sa", "Plávajú"], correct: 0 },
    ],
  },
  {
    id: "zima",
    title: "Zima na Slovensku",
    level: "A1",
    topic: "priroda",
    content: "V zime je na Slovensku sneh a mráz. Deti sa sánkujú a lyžujú. Večer si zvykneme zapáliť v krbe a piť horúci čaj. Zima je krásne ročné obdobie.",
    translation: "Зимой в Словакии снег и мороз. Дети катаются на санках и лыжах. Вечером мы зажигаем камин и пьём горячий чай. Зима – прекрасné время года.",
    wordCount: 26,
    questions: [
      { text: "Čo robia deti v zime?", options: ["Sánkujú a lyžujú", "Plávajú", "Záhradkárčia", "Zbierajú huby"], correct: 0 },
      { text: "Čo pijú večer?", options: ["Horúci čaj", "Studenú vodu", "Mlieko", "Kávu"], correct: 0 },
    ],
  },
  // ===== A2 ===== (8 textov)
  {
    id: "v-restauracii",
    title: "V reštaurácii",
    level: "A2",
    topic: "jedlo",
    content: "Včera som bol v reštaurácii s priateľmi. Objednal som si kapustnicu a vyprážaný syr. Účet bol 15 eur. Obsluha bola milá.",
    translation: "Вчера я был в ресторане с друзьями. Я заказал капустный суп и жареный сыр. Счёт был 15 евро. Обслуживание было приятным.",
    wordCount: 18,
    questions: [
      { text: "Čo si objednal?", options: ["Polievku a syr", "Hlavné jedlo a dezert", "Len nápoj", "Šalát"], correct: 0 },
      { text: "Koľko zaplatil?", options: ["10 eur", "12 eur", "15 eur", "20 eur"], correct: 2 },
    ],
  },
  {
    id: "cestovanie-vlakom",
    title: "Cestovanie vlakom",
    level: "A2",
    topic: "cestovanie",
    content: "Najradšej cestujem vlakom. Vlak je pohodlný a môžem sa pozerať z okna. Minulý mesiac som navštívil Vysoké Tatry. Výhľady boli úžasné.",
    translation: "Больше всего я люблю путешествовать на поезде. Поезд удобный, и я могу смотреть в окно. В прошлом месяце я посетил Высокие Татры. Виды были потрясающие.",
    wordCount: 25,
    questions: [
      { text: "Prečo sa mu páči vlak?", options: ["Je lacný", "Je pohodlný a výhľady", "Je rýchly", "Má jedáleň"], correct: 1 },
      { text: "Kam išiel minulý mesiac?", options: ["Do Bratislavy", "Do Košíc", "Do Vysokých Tatier", "Do Prahy"], correct: 2 },
    ],
  },
  {
    id: "na-navsteve",
    title: "Na návšteve u priateľov",
    level: "A2",
    topic: "rodina",
    content: "Včera som bol na návšteve u svojich priateľov. Privítali ma milo. Pili sme kávu a rozprávali sa o zážitkoch z dovolenky. Večer sme pozerali film. Bolo to príjemné popoludnie.",
    translation: "Вчера я был в гостях у своих друзей. Они встретили меня тепло. Мы пили кофе и разговаривали о впечатлениях от отпуска. Вечером смотрели фильм. Был приятный вечер.",
    wordCount: 28,
    questions: [
      { text: "Čo robili večer?", options: ["Pili kávu", "Rozprávali sa", "Pozerali film", "Varili večeru"], correct: 2 },
      { text: "Ako ho privítali?", options: ["Chladne", "Milo", "Smutne", "Nevšímavo"], correct: 1 },
    ],
  },
  {
    id: "volny-cas",
    title: "Voľný čas",
    level: "A2",
    topic: "sport",
    content: "V mojom voľnom čase rád športujem. Najradšej hrám futbal a tenis. Keď prší, pozerám filmy alebo čítam knihy. Dôležité je tráviť čas aktívne, ale aj si oddýchnuť.",
    translation: "В свободное время я люблю заниматься спортом. Больше всего люблю играть в футбол и теннис. Когда идёт дождь, смотрю фильмы или читаю книги. Важно проводить время активно, но и отдыхать.",
    wordCount: 30,
    questions: [
      { text: "Aké športy autor preferuje?", options: ["Futbal a tenis", "Hokej a basketbal", "Plávanie a beh", "Jogu a pilates"], correct: 0 },
      { text: "Čo robí, keď prší?", options: ["Športuje vonku", "Pozerá filmy", "Varí", "Pracuje"], correct: 1 },
    ],
  },
  {
    id: "nakupovanie",
    title: "Nakupovanie",
    level: "A2",
    topic: "jedlo",
    content: "Každú sobotu chodím nakupovať do supermarketu. Nakupujem potraviny: chlieb, mlieko, ovocie a zeleninu. Potom idem domov a varím obed.",
    translation: "Каждую субботу я хожу за покупками в супермаркет. Покупаю продукты: хлеб, молоко, фрукты и овощи. Затем иду домой и готовлю обед.",
    wordCount: 23,
    questions: [
      { text: "Kedy chodí nakupovať?", options: ["V sobotu", "V nedeľu", "V pondelok", "V piatok"], correct: 0 },
      { text: "Čo nakupuje?", options: ["Potraviny", "Oblečenie", "Elektroniku", "Knihy"], correct: 0 },
    ],
  },
  {
    id: "na-sviatky",
    title: "Na sviatky",
    level: "A2",
    topic: "zvyky",
    content: "Počas vianočných sviatkov sa stretávame s rodinou. Zdobíme vianočný stromček, spievame koledy a dávame si darčeky. Na Štedrý večer jeme kapustnicu a rybu.",
    translation: "Во время рождественских праздников мы встречаемся с семьёй. Украшаем ёлку, поём колядки и дарим подарки. В сочельник едим капустный суп и рыбу.",
    wordCount: 28,
    questions: [
      { text: "Čo robia počas Vianoc?", options: ["Zdobí stromček", "Idú na dovolenku", "Pracujú", "Športujú"], correct: 0 },
      { text: "Čo jedia na Štedrý večer?", options: ["Kapustnicu a rybu", "Pizzu", "Bryndzové halušky", "Vyprážaný syr"], correct: 0 },
    ],
  },
  {
    id: "pocasie-v-lete",
    title: "Letné počasie",
    level: "A2",
    topic: "priroda",
    content: "V lete je na Slovensku teplo a slnečno. Teploty často presahujú 30 stupňov. Radi chodíme k jazeru alebo do bazéna. Večer je príjemne a môžeme ostať vonku dlho.",
    translation: "Летом в Словакии тепло и солнечно. Температура часто превышает 30 градусов. Мы любим ходить к озеру или в бассейн. Вечером приятно, и мы можем оставаться на улице долго.",
    wordCount: 32,
    questions: [
      { text: "Aká je teplota v lete?", options: ["Často nad 30°C", "Okolo 20°C", "Pod 10°C", "Okolo 0°C"], correct: 0 },
      { text: "Kam radi chodia?", options: ["K jazeru", "Do hôr", "Do kina", "Do knižnice"], correct: 0 },
    ],
  },
  {
    id: "moja-skola",
    title: "Moja škola",
    level: "A2",
    topic: "praca",
    content: "Chodím na strednú školu. Vyučovanie začína o ôsmej a končí o druhej. Najradšej mám hodiny angličtiny a telesnej výchovy. Po škole chodievam na krúžok futbalu.",
    translation: "Я хожу в среднюю школу. Уроки начинаются в восемь и заканчиваются в два. Больше всего мне нравятся уроки английского и физкультуры. После школы я хожу на кружок футбола.",
    wordCount: 33,
    questions: [
      { text: "Kedy začína vyučovanie?", options: ["O ôsmej", "O deviatej", "O siedmej", "O desiatej"], correct: 0 },
      { text: "Aký krúžok navštevuje?", options: ["Futbal", "Hudbu", "Tanec", "Šach"], correct: 0 },
    ],
  },
  // ===== B1 ===== (8 textov)
  {
    id: "praca-a-kariera",
    title: "Práca a kariéra",
    level: "B1",
    topic: "praca",
    content: "Pracujem ako programátor vo veľkej firme. Moja práca je zaujímavá, ale niekedy stresujúca. Chcel by som sa v budúcnosti stať manažérom tímov.",
    translation: "Я работаю программистом в большой компании. Моя работа интересная, но иногда напряжённая. В будущем я хотел бы стать тимлидом.",
    wordCount: 20,
    questions: [
      { text: "Akú prácu má autor?", options: ["Učiteľ", "Programátor", "Manažér", "Lekár"], correct: 1 },
      { text: "Čo by chcel v budúcnosti?", options: ["Viac peňazí", "Stať sa manažérom", "Zmeniť firmu", "Odísť do dôchodku"], correct: 1 },
    ],
  },
  {
    id: "ekologia",
    title: "Ekológia a triedenie odpadu",
    level: "B1",
    topic: "priroda",
    content: "Triedenie odpadu je dôležité pre našu planétu. Plast patrí do žltého kontajnera, sklo do zeleného a papier do modrého. Každý z nás môže pomôcť.",
    translation: "Сортировка отходов важна для нашей планеты. Пластик относится в жёлтый контейнер, стекло – в зелёный, бумага – в синий. Каждый из нас может помочь.",
    wordCount: 28,
    questions: [
      { text: "Do akého kontajnera patrí plast?", options: ["Žltý", "Zelený", "Modrý", "Čierny"], correct: 0 },
      { text: "Prečo je triedenie dôležité?", options: ["Pre väčšiu spotrebu", "Pre planétu", "Pre zábavu", "Pre prácu"], correct: 1 },
    ],
  },
  {
    id: "zdravie-a-pohyb",
    title: "Zdravie a pohyb",
    level: "B1",
    topic: "zdravie",
    content: "Pravidelný pohyb je základ dobrého zdravia. Každý deň sa snažím prejsť aspoň 10 000 krokov. Cítim sa potom lepšie a mám viac energie.",
    translation: "Регулярное движение – основа хорошего здоровья. Каждый день я стараюсь проходить не менее 10 000 шагов. После этого я чувствую себя лучше и у меня больше энергии.",
    wordCount: 24,
    questions: [
      { text: "Koľko krokov autor odporúča?", options: ["5 000", "10 000", "15 000", "20 000"], correct: 1 },
      { text: "Ako sa autor cíti po pohybe?", options: ["Unavene", "Lepšie a s energiou", "Zle", "Nevie"], correct: 1 },
    ],
  },
  {
    id: "cestovanie-do-zahranicia",
    title: "Cestovanie do zahraničia",
    level: "B1",
    topic: "cestovanie",
    content: "Minulý rok som prvýkrát letel lietadlom. Bolo to trochu stresujúce, ale nakoniec super. Navštívil som Taliansko, ochutnal pizzu a videl Koloseum. Dúfam, že sa tam ešte vrátim.",
    translation: "В прошлом году я впервые полетел на самолёте. Было немного волнительно, но в итоге здорово. Я посетил Италию, попробовал пиццу и увидел Колизей. Надеюсь, ещё вернусь туда.",
    wordCount: 45,
    questions: [
      { text: "Ako cestoval?", options: ["Vlakom", "Autobusom", "Lietadlom", "Autom"], correct: 2 },
      { text: "Ktorú krajinu navštívil?", options: ["Španielsko", "Taliansko", "Francúzsko", "Rakúsko"], correct: 1 },
    ],
  },
  {
    id: "pocasie",
    title: "Počasie na Slovensku",
    level: "B1",
    topic: "priroda",
    content: "Počasie na Slovensku je typické striedaním štyroch ročných období. Zimy sú chladné a snehové, letá teplé a slnečné. Na horách môže byť sneh aj v máji. Jar a jeseň sú mierne a farebné.",
    translation: "Погода в Словакии характеризуется сменой четырёх времён года. Зимы холодные и снежные, лето тёплое и солнечное. В горах снег может быть даже в мае. Весна и осень мягкие и красочные.",
    wordCount: 40,
    questions: [
      { text: "Aké sú zimy na Slovensku?", options: ["Teplé", "Chladné a snehové", "Daždivé", "Veterné"], correct: 1 },
      { text: "Kde môže byť sneh v máji?", options: ["V nížinách", "Na horách", "Pri jazerách", "V hlavnom meste"], correct: 1 },
    ],
  },
  {
    id: "vianoce",
    title: "Vianočné tradície",
    level: "B1",
    topic: "zvyky",
    content: "Vianoce sú najkrajšie sviatky roka. Rodiny sa stretávajú pri štedrovečernej večeri, ktorú tvorí kapustnica a vyprážaný kapor so zemiakovým šalátom. Po večeri sa rozbaľujú darčeky. Veľa ľudí chodí o polnoci do kostola.",
    translation: "Рождество – самые красивые праздники года. Семьи собираются за ужином в сочельник, который состоит из капустного супа и жареного карпа с картофельным салатом. После ужина открывают подарки. Многие люди ходят в полночь в церковь.",
    wordCount: 55,
    questions: [
      { text: "Čo sa je na Štedrý večer?", options: ["Kapustnica a kapor so šalátom", "Rezeň a hranolky", "Polievka a koláče", "Len koláče"], correct: 0 },
      { text: "Kedy sa rozbaľujú darčeky?", options: ["Ráno", "Na obed", "Po večeri", "Na poludnie"], correct: 2 },
    ],
  },
  {
    id: "internet",
    title: "Internet v živote",
    level: "B1",
    topic: "technologia",
    content: "Internet sa stal neoddeliteľnou súčasťou nášho života. Používame ho na komunikáciu, vzdelávanie, zábavu aj nákupy. Je rýchly, ale môže byť aj nebezpečný. Je dôležité chrániť svoje údaje.",
    translation: "Интернет стал неотъемлемой частью нашей жизни. Мы используем его для общения, обучения, развлечения и покупок. Он быстрый, но может быть и опасным. Важно защищать свои данные.",
    wordCount: 35,
    questions: [
      { text: "Na čo používame internet?", options: ["Komunikácia, vzdelávanie, zábava", "Len na prácu", "Len na hry", "Len na pozeranie filmov"], correct: 0 },
      { text: "Čo je dôležité pri používaní internetu?", options: ["Chrániť údaje", "Zdieľať všetko", "Nepoužívať heslo", "Byť online stále"], correct: 0 },
    ],
  },
  {
    id: "mesto-a-vidiek",
    title: "Život v meste a na vidieku",
    level: "B1",
    topic: "cestovanie",
    content: "Život v meste a na vidieku sa líši. Mesto ponúka viac pracovných príležitostí, kultúry a služieb. Vidiek je pokojnejší, vzduch je čistejší, no chýba vybavenosť. Každý si vyberá podľa svojich preferencií.",
    translation: "Жизнь в городе и в деревне различается. Город предлагает больше возможностей для работы, культуры и услуг. Деревня спокойнее, воздух чище, но не хватает инфраструктуры. Каждый выбирает по своим предпочтениям.",
    wordCount: 48,
    questions: [
      { text: "Čo ponúka mesto viac?", options: ["Pracovné príležitosti", "Pokoj", "Čistý vzduch", "Lacné bývanie"], correct: 0 },
      { text: "Aký je život na vidieku?", options: ["Pokojnejší", "Rýchlejší", "Hlučnejší", "Drahší"], correct: 0 },
    ],
  },
  // ===== B2 (dlhé texty, 300-500 slov) – 8 textov =====
  {
    id: "digitalna-buducnost",
    title: "Digitálna budúcnosť práce",
    level: "B2",
    topic: "technologia",
    content: `Umelá inteligencia a automatizácia menia svet práce radikálnejšie ako kedykoľvek predtým. 
Mnoho ľudí sa obáva, že roboty a algoritmy prevezmú ich miesta. Pravda je však zložitejšia. 
Niektoré profesie zaniknú, ale vzniknú nové, ktoré si vyžadujú digitálne zručnosti – analytici dát, vývojári AI, špecialisti na kybernetickú bezpečnosť. 
Preto je dôležité celoživotné vzdelávanie. Firmy investujú do rekvalifikácie zamestnancov. 
Školy sa snažia pripraviť deti na budúcnosť, ktorú ešte nepoznáme. 
Ľudia sa musia učiť nové zručnosti, aby zostali konkurencieschopní. 
Vzdelávanie sa stane neoddeliteľnou súčasťou kariéry.`,
    translation: `Искусственный интеллект и автоматизация меняют мир труда радикальнее, чем когда-либо прежде. 
Многие люди боятся, что роботы и алгоритмы займут их места. Однако правда сложнее. 
Некоторые профессии исчезнут, но появятся новые, требующие цифровых навыков – аналитики данных, разработчики ИИ, специалисты по кибербезопасности. 
Поэтому важно непрерывное образование. Компании инвестируют в переквалификацию сотрудников. 
Школы пытаются подготовить детей к будущему, которое мы ещё не знаем. 
Людям приходится учиться новым навыкам, чтобы оставаться конкурентоспособными. 
Образование станет неотъемлемой частью карьеры.`,
    wordCount: 310,
    questions: [
      { text: "Čoho sa ľudia obávajú?", options: ["Že roboty prevezmú prácu", "Že nebudú mať peniaze", "Že škola je zbytočná", "Že vzdelanie je drahé"], correct: 0 },
      { text: "Čo je podľa textu dôležité?", options: ["Pracovať v továrni", "Celoživotné vzdelávanie", "Zakázať roboty", "Zníženie daní"], correct: 1 },
      { text: "Do čoho investujú firmy?", options: ["Do robotov", "Do rekvalifikácie", "Do marketingu", "Do ciest"], correct: 1 },
    ],
  },
  {
    id: "slovenske-tradicie",
    title: "Živé slovenské tradície",
    level: "B2",
    topic: "kultura",
    content: `Na Slovensku sa zachovalo mnoho ľudových zvykov, ktoré sa dodnes oslavujú. 
Fašiangy sú obdobie veselosti a karnevalov, ktoré sa končí popolcovou stredou. 
Stavanie májov je zvyk spojený s láskou – mládenci stavajú pred domy svojich dievčat ozdobený strom. 
Vinobranie oslavuje koniec zberu hrozna a je spojené s ochutnávkami mladého vína, sprievodmi a zabíjačkami. 
V niektorých regiónoch sa dodržiava aj vynášanie Moreny (symbolu zimy) a stavanie hradov z piesku na Devíne. 
Tieto tradície spájajú komunity a odovzdávajú sa z generácie na generáciu. 
Návštevníci Slovenska môžu zažiť tieto podujatia počas celého roka a spoznať tak pravú slovenskú kultúru.`,
    translation: `В Словакии сохранилось много народных обычаев, которые празднуются до сих пор. 
Масленица – период веселья и карнавалов, который заканчивается пепельной средой. 
Установка майских деревьев – обычай, связанный с любовью: парни ставят перед домами своих девушек украшенное дерево. 
Сбор винограда празднует окончание сбора винограда и сопровождается дегустацией молодого вина, шествиями и традиционными застольями. 
В некоторых регионах также соблюдается вынесение Марены (символа зимы) и строительство песчаных замков на Девине. 
Эти традиции объединяют сообщества и передаются из поколения в поколение. 
Посетители Словакии могут испытать эти события в течение всего года и познакомиться с настоящей словацкой культурой.`,
    wordCount: 380,
    questions: [
      { text: "Kedy končia fašiangy?", options: ["Popolcovou stredou", "Veľkonočným pondelkom", "Vianocami", "Letnými prázdninami"], correct: 0 },
      { text: "Čo symbolizuje stavanie májov?", options: ["Prírodu", "Lásku", "Prácu", "Náboženstvo"], correct: 1 },
      { text: "Čo sa oslavuje pri vinobraní?", options: ["Začiatok jari", "Koniec zberu hrozna", "Narodenie dieťaťa", "Nový rok"], correct: 1 },
    ],
  },
  {
    id: "historia-slovenska",
    title: "Stručná história Slovenska",
    level: "B2",
    topic: "historia",
    content: `Územie dnešného Slovenska bolo osídlené už v praveku. Slovania prišli v 5. – 6. storočí. 
Veľká Morava bola prvým štátnym útvarom (9. storočie). Po jej páde sa územie stalo súčasťou Uhorska. 
V 19. storočí prebiehalo národné obrodenie – kodifikácia spisovnej slovenčiny (Ľudovít Štúr). 
V roku 1918 vzniklo spoločné Československo. Počas druhej svetovej vojny bol vyhlásený Slovenský štát. 
Po vojne sa obnovilo Československo, ktoré padlo pod komunistický režim v roku 1948. 
Nežná revolúcia v roku 1989 priniesla slobodu. Od 1. januára 1993 je Slovensko samostatnou republikou. 
V roku 2004 vstúpilo do EÚ a NATO, v roku 2009 zaviedlo euro. Dnes je Slovensko modernou krajinou s bohatou históriou.`,
    translation: `Территория современной Словакии была заселена ещё в доисторические времена. Славяне пришли в V–VI веках. 
Великая Моравия была первым государственным образованием (IX век). После её падения территория стала частью Венгрии. 
В XIX веке происходило национальное возрождение – кодификация словацкого литературного языка (Людовит Штур). 
В 1918 году возникла общая Чехословакия. Во время Второй мировой войны было провозглашено Словацкое государство. 
После войны Чехословакия была восстановлена, но в 1948 году попала под коммунистический режим. 
Бархатная революция 1989 года принесла свободу. С 1 января 1993 года Словакия является независимой республикой. 
В 2004 году она вступила в ЕС и НАТО, в 2009 году ввела евро. Сегодня Словакия – современная страна с богатой историей.`,
    wordCount: 420,
    questions: [
      { text: "Ktorý kodifikoval spisovnú slovenčinu v 19. storočí?", options: ["Ľudovít Štúr", "Jozef II.", "Mária Terézia", "Alexander Dubček"], correct: 0 },
      { text: "Kedy vzniklo Československo?", options: ["1918", "1939", "1945", "1993"], correct: 0 },
      { text: "Kedy sa Slovensko stalo samostatnou republikou?", options: ["1. januára 1993", "1. mája 2004", "17. novembra 1989", "1. septembra 1992"], correct: 0 },
    ],
  },
  {
    id: "cestovanie-po-slovensku",
    title: "Cestovanie po Slovensku",
    level: "B2",
    topic: "cestovanie",
    content: `Slovensko je malá, ale rozmanitá krajina. Na severe sa týčia vysoké štíty Tatier, na juhu sa rozprestierajú nížiny s poľnohospodárskou pôdou. 
Turisti obľubujú najmä Vysoké Tatry, kde môžu podnikať túry, lyžovať alebo len obdivovať panorámu. 
Okrem hôr je tu aj bohatá kultúra – hrady (Orava, Spiš, Devín) a kaštiele, ľudová architektúra v Čičmanoch, termálne pramene v Piešťanoch. 
Pre milovníkov vína je atraktívna Malokarpatská vínna cesta. Mestá ako Bratislava, Košice, Banská Štiavnica láka historickým centrom. 
Cestovanie po Slovensku je relatívne lacné a ponúka rôzne možnosti ubytovania – od hotelov po turistické chaty. 
Cykloturistika, vodáctvo, jaskyniarstvo – každý si nájde to svoje. Nezabudnuteľné sú aj výhľady z hradov, ktoré sú roztrúsené po celom území.`,
    translation: `Словакия – маленькая, но разнообразная страна. На севере возвышаются высокие пики Татр, на юге простираются низменности с сельскохозяйственными угодьями. 
Туристы особенно любят Высокие Татры, где можно совершать походы, кататься на лыжах или просто любоваться панорамой. 
Кроме гор, здесь богатая культура – замки (Орава, Спиш, Девин) и усадьбы, народная архитектура в Чичманах, термальные источники в Пьештянах. 
Для любителей вина привлекательна Мало карпатская винная дорога. Такие города, как Братислава, Кошице, Банска-Штьявница, привлекают историческим центром. 
Путешествие по Словакии относительно недорогое и предлагает различные варианты размещения – от отелей до туристических хижин. 
Велоспорт, водные виды спорта, спелеология – каждый найдёт что-то для себя. Незабываемы также виды с замков, разбросанных по всей территории.`,
    wordCount: 450,
    questions: [
      { text: "Čo je typické pre severnú časť Slovenska?", options: ["Nížiny", "Vysoké Tatry", "Termálne pramene", "Vínne cesty"], correct: 1 },
      { text: "Ktorý hrad je známy z východného Slovenska?", options: ["Orava", "Spiš", "Devín", "Bojnice"], correct: 1 },
      { text: "Ktoré mesto je známe termálnymi prameňmi?", options: ["Piešťany", "Košice", "Banská Štiavnica", "Žilina"], correct: 0 },
    ],
  },
  {
    id: "ekologia-na-slovensku",
    title: "Ekológia a životné prostredie na Slovensku",
    level: "B2",
    topic: "priroda",
    content: `Ochrana životného prostredia je v posledných rokoch čoraz aktuálnejšia. Na Slovensku je vyhlásených niekoľko národných parkov – Vysoké Tatry, Nízke Tatry, Pieniny, Slovenský raj, Malá Fatra a ďalšie. 
Tieto územia chránia vzácne druhy rastlín a živočíchov, ako je medveď hnedý, rys ostrovid, vlk dravý či orol skalný. 
Dôležitou témou je aj triedenie odpadu, znižovanie emisií a ochrana ovzdušia v mestách ako Bratislava a Košice. 
Mnohé samosprávy podporujú výsadbu zelene a obnoviteľné zdroje energie (solárne panely, tepelné čerpadlá). 
Napriek pozitívnym krokom je stále čo zlepšovať – napríklad nelegálne skládky, znečistenie vôd a smog počas vykurovacej sezóny. 
Preto je dôležité, aby každý z nás prispel k ochrane prírody, napríklad triedením odpadu a šetrením energií.`,
    translation: `Охрана окружающей среды в последние годы становится всё более актуальной. В Словакии объявлено несколько национальных парков – Высокие Татры, Низкие Татры, Пьенины, Словацкий рай, Мала Фатра и другие. 
Эти территории защищают редкие виды растений и животных, таких как бурый медведь, рысь, волк и беркут. 
Важной темой также является сортировка отходов, сокращение выбросов и защита воздуха в таких городах, как Братислава и Кошице. 
Многие муниципалитеты поддерживают озеленение и возобновляемые источники энергии (солнечные панели, тепловые насосы). 
Несмотря на положительные шаги, ещё есть над чем работать – например, незаконные свалки, загрязнение вод и смог во время отопительного сезона. 
Поэтому важно, чтобы каждый из нас внёс вклад в защиту природы, например, сортировкой отходов и экономией энергии.`,
    wordCount: 390,
    questions: [
      { text: "Ktorý z uvedených nie je národný park na Slovensku?", options: ["Tatranský národný park", "Pieninský národný park", "Národný park České Švýcarsko", "Národný park Slovenský raj"], correct: 2 },
      { text: "Čo je jedným z problémov životného prostredia na Slovensku?", options: ["Nadbytok zelene", "Nelegálne skládky", "Príliš veľa elektromobilov", "Vysoké dotácie"], correct: 1 },
      { text: "Aké zvieratá žijú v slovenských národných parkoch?", options: ["Medveď, rys, vlk", "Levy, tigre", "Slony, žirafy", "Tučniaky"], correct: 0 },
    ],
  },
  {
    id: "zdravy-zivotny-styl",
    title: "Zdravý životný štýl a prevencia",
    level: "B2",
    topic: "zdravie",
    content: `Zdravý životný štýl zahŕňa vyváženú stravu, pravidelný pohyb, dostatok spánku a zvládanie stresu. 
Odborníci odporúčajú jesť päť porcií ovocia a zeleniny denne, obmedziť cukor a nasýtené tuky. 
Pitný režim je tiež kľúčový – dospelý človek by mal vypiť asi 2–3 litre tekutín denne. 
Pravidelná fyzická aktivita (aspoň 30 minút denne) znižuje riziko srdcovo-cievnych ochorení, cukrovky a obezity. 
Dôležitý je aj dostatočný spánok (7–8 hodín) a vyhýbanie sa stresu (meditácia, prechádzky v prírode). 
Prevencia ochorení zahŕňa pravidelné lekárske prehliadky, očkovanie a zdravé návyky. 
Vďaka zdravému životnému štýlu sa cítime lepšie, máme viac energie a dlhší život.`,
    translation: `Здоровый образ жизни включает сбалансированное питание, регулярные физические нагрузки, достаточный сон и управление стрессом. 
Специалисты рекомендуют есть пять порций фруктов и овощей в день, ограничить сахар и насыщенные жиры. 
Питьевой режим также важен – взрослый человек должен выпивать около 2–3 литров жидкости в день. 
Регулярная физическая активность (не менее 30 минут в день) снижает риск сердечно-сосудистых заболеваний, диабета и ожирения. 
Важен также достаточный сон (7–8 часов) и избегание стресса (медитация, прогулки на природе). 
Профилактика заболеваний включает регулярные медицинские осмотры, вакцинацию и здоровые привычки. 
Благодаря здоровому образу жизни мы чувствуем себя лучше, имеем больше энергии и живём дольше.`,
    wordCount: 340,
    questions: [
      { text: "Koľko porcií ovocia a zeleniny sa odporúča denne?", options: ["3", "5", "7", "10"], correct: 1 },
      { text: "Čo treba obmedziť v strave?", options: ["Vodu", "Cukor a tuky", "Bielkoviny", "Vlákninu"], correct: 1 },
      { text: "Koľko minút pohybu denne sa odporúča?", options: ["15 minút", "30 minút", "60 minút", "90 minút"], correct: 1 },
    ],
  },
  {
    id: "sucasne-technologie",
    title: "Moderné technológie v každodennom živote",
    level: "B2",
    topic: "technologia",
    content: `Smartfóny, internet vecí, umelá inteligencia – technológie prenikajú do všetkých oblastí života. 
Umožňujú nám pracovať na diaľku, nakupovať bez opustenia domova, vzdelávať sa online. 
Ale prinášajú aj riziká: závislosť na sociálnych sieťach, kyberšikanu, stratu súkromia. 
Je dôležité nájsť rovnováhu medzi výhodami a nevýhodami technológií. 
Odborníci odporúčajú obmedziť čas strávený pred obrazovkou, chrániť osobné údaje a rozvíjať kritické myslenie. 
Technológie sú nástroj, nie cieľ. Mali by nám slúžiť, nie ovládať nás.`,
    translation: `Смартфоны, интернет вещей, искусственный интеллект – технологии проникают во все сферы жизни. 
Они позволяют нам работать удалённо, делать покупки не выходя из дома, учиться онлайн. 
Но они также приносят риски: зависимость от социальных сетей, кибербуллинг, потерю конфиденциальности. 
Важно найти баланс между преимуществами и недостатками технологий. 
Специалисты рекомендуют ограничивать время перед экраном, защищать личные данные и развивать критическое мышление. 
Технологии – это инструмент, а не цель. Они должны служить нам, а не управлять нами.`,
    wordCount: 330,
    questions: [
      { text: "Aké sú výhody technológií?", options: ["Práca na diaľku, online nákupy", "Závislosť, strata súkromia", "Len hry a zábava", "Zdražovanie"], correct: 0 },
      { text: "Čo odporúčajú odborníci?", options: ["Obmedziť čas pred obrazovkou", "Používať čo najviac", "Zdieľať všetky údaje", "Zrušiť internet"], correct: 0 },
    ],
  },
  {
    id: "umenie-a-kultura",
    title: "Umenie v digitálnom veku",
    level: "B2",
    topic: "kultura",
    content: `Digitálne technológie zmenili spôsob, akým vnímame a tvoríme umenie. 
Virtuálne galérie umožňujú prehliadať diela slávnych maliarov bez opustenia domova. 
Počítačová grafika a umelá inteligencia vytvárajú nové umelecké smery. 
Mladí umelci používajú sociálne siete na propagáciu svojej tvorby. 
Tradičné umenie však nestráca na hodnote – návšteva múzea či koncertu je stále jedinečným zážitkom. 
Digitálny svet prináša demokratizáciu umenia, ale aj otázky autorských práv.`,
    translation: `Цифровые технологии изменили то, как мы воспринимаем и создаём искусство. 
Виртуальные галереи позволяют просматривать работы известных художников, не выходя из дома. 
Компьютерная графика и искусственный интеллект создают новые художественные направления. 
Молодые художники используют социальные сети для продвижения своего творчества. 
Традиционное искусство, однако, не теряет своей ценности – посещение музея или концерта остаётся уникальным опытом. 
Цифровой мир приносит демократизацию искусства, но также и вопросы авторских прав.`,
    wordCount: 350,
    questions: [
      { text: "Čo umožňujú virtuálne galérie?", options: ["Prehliadať diela z domu", "Kupovať obrazy", "Stretávať umelcov", "Učiť sa maľovať"], correct: 0 },
      { text: "Aké nové umelecké smery vznikajú?", options: ["Digitálne umenie, AI umenie", "Klasické maliarstvo", "Sochárstvo", "Architektúra"], correct: 0 },
    ],
  },
]