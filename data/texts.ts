// data/texts.ts

export type TextLevel = "A1" | "A2" | "B1" | "B2"
export type TextTopic = "daily" | "travel" | "work" | "nature" | "culture" | "health" | "family"

export interface SlovakText {
  id: string
  title: string
  level: TextLevel
  topic: TextTopic
  content: string
  translation: string
  wordCount: number
}

export const texts: SlovakText[] = [
  // ========== A1 ==========
  {
    id: "a1-daily-1",
    title: "Môj deň",
    level: "A1",
    topic: "daily",
    content: "Ráno vstávam o siedmej. Umývam si zuby a obliekam sa. Na raňajky jem chlieb s maslom a pijem čaj. Potom idem do práce.",
    translation: "Утром я встаю в семь. Чищу зубы и одеваюсь. На завтрак я ем хлеб с маслом и пью чай. Затем иду на работу.",
    wordCount: 28,
  },
  {
    id: "a1-family-1",
    title: "Moja rodina",
    level: "A1",
    topic: "family",
    content: "Moja rodina je malá. Mám otca, mamu a jednu sestru. Moja sestra sa volá Lucia. Má desať rokov. Chodí do školy.",
    translation: "Моя семья маленькая. У меня есть папа, мама и одна сестра. Мою сестру зовут Луция. Ей десять лет. Она ходит в школу.",
    wordCount: 24,
  },
  {
    id: "a1-travel-1",
    title: "Cesta do školy",
    level: "A1",
    topic: "travel",
    content: "Do školy chodím autobusom. Autobus je veľký a žltý. Cesta trvá dvadsať minút. V aute počúvam hudbu.",
    translation: "В школу я езжу на автобусе. Автобус большой и жёлтый. Дорога занимает двадцать минут. В машине я слушаю музыку.",
    wordCount: 20,
  },
  {
    id: "a1-nature-1",
    title: "V parku",
    level: "A1",
    topic: "nature",
    content: "Rád chodím do parku. V parku sú stromy a kvety. ľudia tam behajú a deti sa hrajú. Je tam veľa zelene.",
    translation: "Я люблю ходить в парк. В парке есть деревья и цветы. Люди там бегают, а дети играют. Там много зелени.",
    wordCount: 22,
  },

  // ========== A2 ==========
  {
    id: "a2-daily-1",
    title: "Víkendový program",
    level: "A2",
    topic: "daily",
    content: "Cez víkend rád spím dlhšie. Okolo deviatej vstávam a idem na prechádzku. Potom navštívim kaviareň a čítam knihu. Večer pozerám film.",
    translation: "В выходные я люблю спать дольше. Около девяти встаю и иду на прогулку. Затем посещаю кафе и читаю книгу. Вечером смотрю фильм.",
    wordCount: 32,
  },
  {
    id: "a2-travel-1",
    title: "Výlet k jazeru",
    level: "A2",
    topic: "travel",
    content: "Minulý týždeň sme išli k jazeru. Voda bola teplá a plávali sme. Na brehu sme opekali klobásy. Bol to krásny deň.",
    translation: "На прошлой неделе мы ездили к озеру. Вода была тёплой, и мы плавали. На берегу жарили колбаски. Был прекрасный день.",
    wordCount: 28,
  },
  {
    id: "a2-work-1",
    title: "Moja práca",
    level: "A2",
    topic: "work",
    content: "Pracujem v kancelárii. Každý deň odpovedám na emaily a volám zákazníkom. Moja práca je zaujímavá, ale niekedy unavujúca.",
    translation: "Я работаю в офисе. Каждый день отвечаю на электронные письма и звоню клиентам. Моя работа интересная, но иногда утомительная.",
    wordCount: 26,
  },
  {
    id: "a2-health-1",
    title: "U lekára",
    level: "A2",
    topic: "health",
    content: "Cítil som sa zle, preto som išiel k lekárovi. Lekár mi zmeral teplotu a povedal, že mám chrípku. Dal mi lieky a poslal ma domov.",
    translation: "Я плохо себя чувствовал, поэтому пошёл к врачу. Врач измерил мне температуру и сказал, что у меня грипп. Дал мне лекарства и отправил домой.",
    wordCount: 32,
  },
  {
    id: "a2-culture-1",
    title: "Mestské múzeum",
    level: "A2",
    topic: "culture",
    content: "V sobotu som navštívil mestské múzeum. Videl som obrazy známych maliarov a staré mince. Bolo to poučné.",
    translation: "В субботу я посетил городской музей. Я видел картины известных художников и старые монеты. Было познавательно.",
    wordCount: 22,
  },

  // ========== B1 ==========
  {
    id: "b1-work-1",
    title: "Dôležitý projekt",
    level: "B1",
    topic: "work",
    content: "Pracujeme na novom projekte už tri mesiace. Musíme splniť termín do konca mesiaca. Minulý týždeň sme mali dôležité stretnutie s klientom. Verím, že uspejeme.",
    translation: "Мы работаем над новым проектом уже три месяца. Мы должны уложиться в срок до конца месяца. На прошлой неделе у нас была важная встреча с клиентом. Я верю, что у нас получится.",
    wordCount: 36,
  },
  {
    id: "b1-travel-1",
    title: "Cesta do Vysokých Tatier",
    level: "B1",
    topic: "travel",
    content: "Počas letných prázdnin sme sa vybrali na výlet do Vysokých Tatier. Ubytovali sme sa v horskom hoteli. Každý deň sme chodili na túry. Výhľady boli úchvatné.",
    translation: "Во время летних каникул мы отправились в поездку в Высокие Татры. Мы остановились в горном отеле. Каждый день мы ходили в походы. Виды были захватывающие.",
    wordCount: 30,
  },
  {
    id: "b1-nature-1",
    title: "Ochrana životného prostredia",
    level: "B1",
    topic: "nature",
    content: "Znečistenie ovzdušia a vody je vážny problém. Každý z nás môže prispieť k ochrane prírody – triediť odpad, šetriť vodou a používať ekologické tašky.",
    translation: "Загрязнение воздуха и воды – серьёзная проблема. Каждый из нас может внести вклад в защиту природы – сортировать отходы, экономить воду и использовать эко-сумки.",
    wordCount: 30,
  },
  {
    id: "b1-culture-1",
    title: "Slovenské ľudové tradície",
    level: "B1",
    topic: "culture",
    content: "Na Slovensku je bohatá ľudová kultúra. Medzi typické tradície patrí výroba keramiky, vyšívanie krojov a folklórne festivaly. Ľudové piesne sa odovzdávajú z generácie na generáciu.",
    translation: "В Словакии богатая народная культура. К типичным традициям относятся изготовление керамики, вышивка костюмов и фольклорные фестивали. Народные песни передаются из поколения в поколение.",
    wordCount: 32,
  },
  {
    id: "b1-health-1",
    title: "Zdravý životný štýl",
    level: "B1",
    topic: "health",
    content: "Pravidelný pohyb a vyvážená strava sú základom zdravia. Odporúča sa jesť veľa ovocia a zeleniny, piť dostatok vody a vyhýbať sa stresu.",
    translation: "Регулярная физическая активность и сбалансированное питание – основа здоровья. Рекомендуется есть много фруктов и овощей, пить достаточно воды и избегать стресса.",
    wordCount: 28,
  },

  // ========== B2 ==========
  {
    id: "b2-work-1",
    title: "Kariérny rast a vzdelávanie",
    level: "B2",
    topic: "work",
    content: "V dnešnej dobe je celoživotné vzdelávanie nevyhnutné pre udržanie konkurencieschopnosti na trhu práce. Firmy oceňujú zamestnancov, ktorí sa neustále zdokonaľujú a učia nové technológie.",
    translation: "В наше время непрерывное образование необходимо для поддержания конкурентоспособности на рынке труда. Компании ценят сотрудников, которые постоянно совершенствуются и изучают новые технологии.",
    wordCount: 34,
  },
  {
    id: "b2-travel-1",
    title: "Dobrodružstvo v cudzine",
    level: "B2",
    topic: "travel",
    content: "Cestovanie po Európe mi otvorilo oči. Spoznal som rôzne kultúry, ochutnal miestne jedlá a naučil sa základy niekoľkých jazykov. Najviac ma ovplyvnil pobyt v Španielsku.",
    translation: "Путешествия по Европе открыли мне глаза. Я познакомился с разными культурами, попробовал местные блюда и выучил основы нескольких языков. Больше всего на меня повлияло пребывание в Испании.",
    wordCount: 36,
  },
  {
    id: "b2-nature-1",
    title: "Klimatické zmeny",
    level: "B2",
    topic: "nature",
    content: "Globálne otepľovanie spôsobuje extrémne výkyvy počasia. Vedci varujú, že ak neprijmeme opatrenia, následky budú katastrofálne. Je potrebné znížiť emisie skleníkových plynov a prejsť na obnoviteľné zdroje.",
    translation: "Глобальное потепление вызывает экстремальные колебания погоды. Учёные предупреждают: если мы не примем меры, последствия будут катастрофическими. Необходимо сократить выбросы парниковых газов и перейти на возобновляемые источники.",
    wordCount: 38,
  },
  {
    id: "b2-culture-1",
    title: "Vplyv internetu na kultúru",
    level: "B2",
    topic: "culture",
    content: "Internet zásadne zmenil spôsob, akým konzumujeme kultúru. Streamovacie služby umožňujú prístup k filmom a hudbe z celého sveta. Tradičné médiá však zápasia s poklesom záujmu.",
    translation: "Интернет кардинально изменил способ потребления культуры. Стриминговые сервисы обеспечивают доступ к фильмам и музыке со всего мира. Однако традиционные СМИ борются со снижением интереса.",
    wordCount: 32,
  },
  {
    id: "b2-health-1",
    title: "Duševné zdravie v digitálnom veku",
    level: "B2",
    topic: "health",
    content: "Nadmerné používanie sociálnych sietí môže viesť k úzkosti a depresiám. Odborníci odporúčajú obmedziť čas strávený na obrazovke a venovať sa aktivitám offline, ako je šport či meditácia.",
    translation: "Чрезмерное использование социальных сетей может привести к тревоге и депрессии. Специалисты рекомендуют ограничить время, проводимое перед экраном, и заниматься офлайн-активностями, такими как спорт или медитация.",
    wordCount: 34,
  },
]