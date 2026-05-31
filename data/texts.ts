export type TextLevel = "A1" | "A2" | "B1" | "B2" | "C1"
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
  // ========== A1 (10 textov, 40-70 slov) ==========
  {
    id: "a1-pozdravy-1",
    title: "Prvé stretnutie",
    level: "A1",
    topic: "pozdravy",
    content: "Ahoj! Volám sa Peter. Mám 25 rokov. Som z Bratislavy. Hovorím po slovensky a trochu po anglicky. Rád spoznávam nových ľudí. Ako sa voláš ty? Odkiaľ si? Teší ma, že ťa spoznávam. Dúfam, že sa ešte stretneme.",
    translation: "Привет! Меня зовут Петер. Мне 25 лет. Я из Братиславы. Я говорю по-словацки и немного по-английски. Я люблю знакомиться с новыми людьми. Как тебя зовут? Откуда ты? Приятно познакомиться. Надеюсь, мы ещё встретимся.",
    wordCount: 42,
    questions: [
      { text: "Ako sa volá osoba v texte?", options: ["Peter", "Ján", "Martin", "Tomáš"], correct: 0 },
      { text: "Koľko má rokov?", options: ["20", "25", "30", "35"], correct: 1 },
      { text: "Odkiaľ je?", options: ["Z Košíc", "Z Bratislavy", "Z Prahy", "Z Viedne"], correct: 1 }
    ]
  },
  {
    id: "a1-rodina-1",
    title: "Moja rodina",
    level: "A1",
    topic: "rodina",
    content: "Moja rodina je malá. Mám mamu, otca a sestru. Mama sa volá Eva. Je učiteľka. Otec sa volá Jozef. Pracuje v banke. Sestra Zuzka má 12 rokov. Chodí do školy. Bývame v malom dome. Večer spolu večeriame a rozprávame sa.",
    translation: "Моя семья маленькая. У меня есть мама, папа и сестра. Маму зовут Ева. Она учительница. Папу зовут Йозеф. Он работает в банке. Сестре Зузке 12 лет. Она ходит в школу. Мы живём в маленьком доме. Вечером мы вместе ужинаем и разговариваем.",
    wordCount: 48,
    questions: [
      { text: "Ako sa volá mama?", options: ["Zuzana", "Eva", "Jana", "Mária"], correct: 1 },
      { text: "Kde pracuje otec?", options: ["V škole", "V nemocnici", "V banke", "V obchode"], correct: 2 },
      { text: "Koľko rokov má sestra?", options: ["10", "12", "14", "16"], correct: 1 }
    ]
  },
  {
    id: "a1-jedlo-1",
    title: "Moje obľúbené jedlo",
    level: "A1",
    topic: "jedlo",
    content: "Moje obľúbené jedlo je pizza. Mám rád pizzu so šunkou a syrom. Pijem k nej čistú vodu alebo džús. Obedujem o 12:00. Na raňajky jem chlieb s maslom a čaj. Večer jem ľahké jedlo, napríklad šalát. Slovenské jedlo, ako halušky, mi tiež chutí.",
    translation: "Моё любимое блюдо – пицца. Я люблю пиццу с ветчиной и сыром. К ней я пью воду или сок. Я обедаю в 12:00. На завтрак я ем хлеб с маслом и чай. Вечером я ем лёгкую еду, например салат. Словацкое блюдо, такое как галушки, мне тоже нравится.",
    wordCount: 51,
    questions: [
      { text: "Aké jedlo má autor rád?", options: ["Halušky", "Pizzu", "Polievku", "Rezeň"], correct: 1 },
      { text: "Čo pije k pizzi?", options: ["Mlieko", "Pivo", "Vodu alebo džús", "Kávu"], correct: 2 }
    ]
  },
  {
    id: "a1-cestovanie-1",
    title: "Na stanici",
    level: "A1",
    topic: "cestovanie",
    content: "Idem do Prahy vlakom. Lístok si kupujem na stanici. Vlak odchádza o 10:15. Cesta trvá asi 4 hodiny. Na stanici je veľa ľudí. Kúpim si aj občerstvenie – vodu a sendvič. Rád cestujem vlakom, pretože je pohodlný.",
    translation: "Я еду в Прагу на поезде. Билет покупаю на вокзале. Поезд отправляется в 10:15. Дорога занимает около 4 часов. На вокзале много людей. Я куплю также закуску – воду и сэндвич. Я люблю путешествовать на поезде, потому что это удобно.",
    wordCount: 45,
    questions: [
      { text: "Kam autor cestuje?", options: ["Do Prahy", "Do Viedne", "Do Bratislavy", "Do Budapešti"], correct: 0 },
      { text: "Ako cestuje?", options: ["Autobusom", "Vlakom", "Lietadlom", "Autom"], correct: 1 }
    ]
  },
  {
    id: "a1-praca-1",
    title: "Moja práca",
    level: "A1",
    topic: "praca",
    content: "Pracujem v kancelárii. Som asistent. Prácu začínam o 8:00 a končím o 16:00. Pracujem s počítačom a dokumentmi. Kolegovia sú milí. Cez obed mám prestávku 30 minút. Páči sa mi moja práca, pretože je zaujímavá.",
    translation: "Я работаю в офисе. Я ассистент. Я начинаю работу в 8:00 и заканчиваю в 16:00. Я работаю с компьютером и документами. Коллеги хорошие. В обед у меня перерыв 30 минут. Мне нравится моя работа, потому что она интересная.",
    wordCount: 47,
    questions: [
      { text: "Kde autor pracuje?", options: ["V škole", "V kancelárii", "V obchode", "V nemocnici"], correct: 1 },
      { text: "Ako dlho pracuje?", options: ["6 hodín", "7 hodín", "8 hodín", "9 hodín"], correct: 2 }
    ]
  },
  {
    id: "a1-zdravie-1",
    title: "U lekára",
    level: "A1",
    topic: "zdravie",
    content: "Bolí ma hrdlo a mám teplotu. Idem k lekárovi. Lekár mi povedal, aby som pil veľa čaju a odpočíval. Predpísal mi lieky. V lekárni si vyzdvihnem sirup proti kašľu. Dúfam, že budem čoskoro zdravý.",
    translation: "У меня болит горло и температура. Я иду к врачу. Врач сказал мне пить много чая и отдыхать. Он выписал мне лекарства. В аптеке я заберу сироп от кашля. Надеюсь, скоро буду здоров.",
    wordCount: 43,
    questions: [
      { text: "Čo autora bolí?", options: ["Hlava", "Hrdlo", "Zub", "Ucho"], correct: 1 },
      { text: "Čo mu odporučil lekár?", options: ["Piť kávu", "Piť čaj a odpočívať", "Bežať", "Jesť sladkosti"], correct: 1 }
    ]
  },
  {
    id: "a1-priroda-1",
    title: "V parku",
    level: "A1",
    topic: "priroda",
    content: "Rád chodím do parku. Je tam veľa stromov a kvetov. Vtáky spievajú. Ľudia behajú alebo sedia na lavičkách. S priateľmi si zahráme futbal. V lete park rozvoniava lipou. Je to pekné miesto na relax.",
    translation: "Я люблю ходить в парк. Там много деревьев и цветов. Поют птицы. Люди бегают или сидят на скамейках. С друзьями мы играем в футбол. Летом парк пахнет липой. Это хорошее место для отдыха.",
    wordCount: 44,
    questions: [
      { text: "Čo je v parku?", options: ["Len tráva", "Stromy a kvety", "Iba autá", "Budovy"], correct: 1 },
      { text: "Čo robia vtáky?", options: ["Spia", "Spievajú", "Jedia", "Behajú"], correct: 1 }
    ]
  },
  {
    id: "a1-kultura-1",
    title: "V kine",
    level: "A1",
    topic: "kultura",
    content: "V sobotu idem s kamarátmi do kina. Pozeráme slovenský film. Lístky stoja 8 eur. Kupujeme aj pukance a nápoj. Film sa začína o 18:00. Kino je blízko nášho domu. Po filme si dáme zmrzlinu. Mám rád kultúrne podujatia.",
    translation: "В субботу я иду с друзьями в кино. Мы смотрим словацкий фильм. Билеты стоят 8 евро. Мы также покупаем попкорн и напиток. Фильм начинается в 18:00. Кинотеатр рядом с нашим домом. После фильма мы едим мороженое. Я люблю культурные мероприятия.",
    wordCount: 49,
    questions: [
      { text: "Kam ide v sobotu?", options: ["Do divadla", "Do kina", "Do múzea", "Do parku"], correct: 1 },
      { text: "Koľko stoja lístky?", options: ["5 eur", "7 eur", "8 eur", "10 eur"], correct: 2 }
    ]
  },
  {
    id: "a1-technologia-1",
    title: "Môj mobil",
    level: "A1",
    topic: "technologia",
    content: "Mám nový mobil. Je čierny. Používam ho na telefonovanie a písanie správ. Aj na internete čítam správy. Fotím ním pekné miesta. Cez aplikáciu si kúpim lístky na vlak. Večer si pustím hudbu. Technológie uľahčujú život.",
    translation: "У меня новый мобильный телефон. Он чёрный. Я использую его для звонков и сообщений. Также в интернете читаю новости. Я фотографирую им красивые места. Через приложение покупаю билеты на поезд. Вечером включаю музыку. Технологии облегчают жизнь.",
    wordCount: 46,
    questions: [
      { text: "Na čo používa mobil?", options: ["Len na hry", "Na telefonovanie a písanie správ", "Len na prácu", "Na varenie"], correct: 1 },
      { text: "Čo večer robí?", options: ["Pozerá film", "Počúva hudbu", "Číta knihu", "Behá"], correct: 1 }
    ]
  },
  {
    id: "a1-zvyky-1",
    title: "Narodeniny",
    level: "A1",
    topic: "zvyky",
    content: "Dnes mám narodeniny. Mám 20 rokov. Moja rodina mi blahoželá. Dávajú mi darčeky. Mama pečie tortu. Je čokoládová. Večer prídu kamaráti. Budeme tancovať a spievať. Narodeniny sú môj obľúbený deň.",
    translation: "Сегодня у меня день рождения. Мне 20 лет. Моя семья меня поздравляет. Дарят подарки. Мама печёт торт. Он шоколадный. Вечером придут друзья. Будем танцевать и петь. День рождения – мой любимый день.",
    wordCount: 40,
    questions: [
      { text: "Aký deň je dnes?", options: ["Vianoce", "Narodeniny", "Veľká noc", "Nový rok"], correct: 1 },
      { text: "Akú tortu mama pečie?", options: ["Jahodovú", "Čokoládovú", "Vanilkovú", "Orechovú"], correct: 1 }
    ]
  },
  // ========== A2 (10 textov, 60-100 slov) ==========
  {
    id: "a2-pozdravy-1",
    title: "Zoznámenie cez internet",
    level: "A2",
    topic: "pozdravy",
    content: "Ahoj, volám sa Miška. Mám 28 rokov a rada čítam knihy. Cez sociálnu sieť som našla skupinu ľudí, ktorí sa učia po slovensky. Veľmi ma to baví. Každý týždeň si píšeme správy alebo si voláme. Je to zábavné a zároveň sa zlepšujem. Ak chceš, môžeš sa pridať!",
    translation: "Привет, меня зовут Мишка. Мне 28 лет, и я люблю читать книги. Через соцсеть я нашла группу людей, изучающих словацкий. Мне это очень нравится. Каждую неделю мы переписываемся или звоним друг другу. Это весело, и одновременно я совершенствуюсь. Если хочешь, можешь присоединиться!",
    wordCount: 61,
    questions: [
      { text: "Ako sa volá dievča?", options: ["Miška", "Zuzka", "Katka", "Lenka"], correct: 0 },
      { text: "Čo rada robí?", options: ["Číta knihy", "Pozerá televíziu", "Cvičí", "Varí"], correct: 0 },
      { text: "Ako sa učí po slovensky?", options: ["Súkromne", "V skupine cez internet", "V škole", "Sama z kníh"], correct: 1 }
    ]
  },
  {
    id: "a2-rodina-1",
    title: "Rodinná oslava",
    level: "A2",
    topic: "rodina",
    content: "Minulú nedeľu sme oslavovali babkine narodeniny. Zišla sa celá rodina. Strýko priniesol gitaru a hral slovenské ľudové piesne. Teta napiekla výborné koláče. Deti sa hrali v záhrade, kým dospelí rozprávali príbehy. Bolo veselo. Večer sme zapálili sviečky a zaspievali „Veľa šťastia“. Babka mala slzy v očiach.",
    translation: "В прошлое воскресенье мы праздновали день рождения бабушки. Собралась вся семья. Дядя принёс гитару и играл словацкие народные песни. Тётя испекла отличные пироги. Дети играли в саду, пока взрослые рассказывали истории. Было весело. Вечером мы зажгли свечи и спели «Многая лета». У бабушки были слёзы на глазах.",
    wordCount: 68,
    questions: [
      { text: "Koho oslavovali?", options: ["Mamu", "Babku", "Sestru", "Tetu"], correct: 1 },
      { text: "Čo hral strýko?", options: ["Na husle", "Na gitaru", "Na klavír", "Na flautu"], correct: 1 },
      { text: "Čo robili deti?", options: ["Pozerali televíziu", "Hrali sa v záhrade", "Spali", "Pomáhali v kuchyni"], correct: 1 }
    ]
  },
  {
    id: "a2-jedlo-1",
    title: "Recept na bryndzové halušky",
    level: "A2",
    topic: "jedlo",
    content: "Bryndzové halušky sú národné jedlo Slovákov. Potrebujeme zemiaky, múku, soľ a bryndzu. Zemiaky očistíme a nastrúhame. Pridáme múku, vajce a soľ, urobíme cesto. Halušky hodíme do vriacej vody a keď vyplávajú, sú hotové. Na panvici opečieme slaninu. Halušky zmiešame s bryndzou a posypeme slaninou. Dobrú chuť!",
    translation: "Брынзовые галушки – национальное блюдо словаков. Нам нужны картофель, мука, соль и брынза. Картофель чистим и трём на тёрке. Добавляем муку, яйцо и соль, делаем тесто. Галушки бросаем в кипящую воду, когда они всплывут – готовы. На сковороде обжариваем бекон. Галушки смешиваем с брынзой и посыпаем беконом. Приятного аппетита!",
    wordCount: 82,
    questions: [
      { text: "Aké jedlo recept popisuje?", options: ["Pirohy", "Bryndzové halušky", "Palacinky", "Rezeň"], correct: 1 },
      { text: "Čím sa posýpajú halušky?", options: ["S cukrom", "S bryndzou a slaninou", "S ovocím", "S omáčkou"], correct: 1 },
      { text: "Kedy sú halušky hotové?", options: ["Keď zčervenajú", "Keď vyplávajú", "Keď sa rozpustia", "Keď zhustnú"], correct: 1 }
    ]
  },
  {
    id: "a2-cestovanie-1",
    title: "Výlet na hrad",
    level: "A2",
    topic: "cestovanie",
    content: "Cez víkend sme sa vybrali na hrad Devín. Je blízko Bratislavy. Išli sme autobusom. Hrad stojí na skale nad sútokom Dunaja a Moravy. Prezreli sme si múzeum a vystúpili na vyhliadkovú vežu. Výhľad na rieku a Rakúsko bol nádherný. Urobili sme veľa fotiek. Unavení, ale spokojní sme sa vrátili večer domov.",
    translation: "На выходных мы поехали в замок Девин. Он рядом с Братиславой. Мы ехали на автобусе. Замок стоит на скале над слиянием Дуная и Моравы. Мы посмотрели музей и поднялись на смотровую башню. Вид на реку и Австрию был прекрасный. Мы сделали много фотографий. Усталые, но довольные, вечером вернулись домой.",
    wordCount: 74,
    questions: [
      { text: "Kam išli na výlet?", options: ["Na hrad Devín", "Do Tatier", "Do kúpeľov", "Do Prahy"], correct: 0 },
      { text: "Ako cestovali?", options: ["Pešo", "Autom", "Autobusom", "Na bicykli"], correct: 2 },
      { text: "Čo videli z veže?", options: ["More", "Dunaj a Moravu", "Jazero", "Hory"], correct: 1 }
    ]
  },
  {
    id: "a2-praca-1",
    title: "Brigáda v lete",
    level: "A2",
    topic: "praca",
    content: "Minulé leto som brigádoval v knižnici. Pomáhal som triediť knihy, registrovať čitateľov a organizovať podujatia. Práca nebola ťažká, ale musel som byť pozorný. Naučil som sa lepšie komunikovať s ľuďmi. Zarobil som si nejaké peniaze, z ktorých som si kúpil nový telefón. Táto skúsenosť sa mi páčila.",
    translation: "Прошлым летом я подрабатывал в библиотеке. Я помогал сортировать книги, регистрировать читателей и организовывать мероприятия. Работа была не тяжёлой, но нужно было быть внимательным. Я научился лучше общаться с людьми. Заработал немного денег, на которые купил новый телефон. Этот опыт мне понравился.",
    wordCount: 64,
    questions: [
      { text: "Kde brigádoval?", options: ["V obchode", "V knižnici", "V kaviarni", "V parku"], correct: 1 },
      { text: "Čo si kúpil za zarobené peniaze?", options: ["Knihu", "Telefón", "Oblečenie", "Počítač"], correct: 1 },
      { text: "Ako hodnotí svoju brigádu?", options: ["Negatívne", "Nezaujímavo", "Páčila sa mu", "Nudne"], correct: 2 }
    ]
  },
  {
    id: "a2-zdravie-1",
    title: "Zdravá raňajky",
    level: "A2",
    topic: "zdravie",
    content: "Zdravé raňajky sú dôležité. Zvyknem si pripraviť ovsenú kašu s ovocím. Pridávam banán, jahody a med. Pijem k tomu bylinkový čaj alebo čerstvú šťavu. Niekedy si dám aj celozrnný chlieb so syrom. Vďaka takým raňajkám mám energiu na celé doobedie. Odporúčam to každému.",
    translation: "Здоровый завтрак важен. Я обычно готовлю овсяную кашу с фруктами. Добавляю банан, клубнику и мёд. Пью к этому травяной чай или свежий сок. Иногда ем цельнозерновой хлеб с сыром. Благодаря такому завтраку у меня энергия на всё утро. Рекомендую каждому.",
    wordCount: 67,
    questions: [
      { text: "Čo si zvykne pripraviť na raňajky?", options: ["Vajcia", "Ovsenú kašu", "Polievku", "Palacinky"], correct: 1 },
      { text: "Čo pije k raňajkám?", options: ["Kávu", "Mlieko", "Bylinkový čaj alebo šťavu", "Pivo"], correct: 2 }
    ]
  },
  {
    id: "a2-priroda-1",
    title: "V záhrade",
    level: "A2",
    topic: "priroda",
    content: "Moja stará mama má krásnu záhradu. Pestuje tam zeleninu: mrkvu, paradajky a uhorky. Okolo plotu rastú kvety – ruže a levanduľa. Rád jej pomáham polievať a zbierať plody. V lete v záhrade cítim svieži vzduch a počúvam bzukot včiel. Je to úžasný relax.",
    translation: "У моей бабушки красивый огород. Она выращивает там овощи: морковь, помидоры и огурцы. Вокруг забора растут цветы – розы и лаванда. Я люблю помогать ей поливать и собирать урожай. Летом в огороде чувствую свежий воздух и слушаю жужжание пчёл. Это отличный отдых.",
    wordCount: 64,
    questions: [
      { text: "Čo pestuje stará mama?", options: ["Len kvety", "Zeleninu a kvety", "Iba stromy", "Trávu"], correct: 1 },
      { text: "Ako pomáha autor?", options: ["Polieva a zbiera plody", "Kope jamu", "Pozerá televíziu", "Varí"], correct: 0 }
    ]
  },
  {
    id: "a2-kultura-1",
    title: "Návšteva múzea",
    level: "A2",
    topic: "kultura",
    content: "Včera sme boli v Slovenskom národnom múzeu. Výstava bola o histórii remesiel. Videli sme staré nástroje, kroje a keramiku. Sprievodca rozprával pútavé príbehy. Najviac sa mi páčila časť o hrnčiarstve. Na konci sme si mohli vyskúšať prácu na hrnčiarskom kruhu. Bol to skvelý zážitok.",
    translation: "Вчера мы были в Словацком национальном музее. Выставка была об истории ремёсел. Мы видели старые инструменты, народные костюмы и керамику. Экскурсовод рассказывал увлекательные истории. Больше всего мне понравилась часть о гончарстве. В конце мы могли попробовать работу на гончарном круге. Это был отличный опыт.",
    wordCount: 68,
    questions: [
      { text: "O čom bola výstava?", options: ["O technológiách", "O histórii remesiel", "O športe", "O zvieratách"], correct: 1 },
      { text: "Čo si mohli vyskúšať na konci?", options: ["Maľovanie", "Prácu na hrnčiarskom kruhu", "Spev", "Tanec"], correct: 1 }
    ]
  },
  {
    id: "a2-technologia-1",
    title: "Nakupovanie online",
    level: "A2",
    topic: "technologia",
    content: "Čoraz viac ľudí nakupuje online. Ja si takto objednávam oblečenie a knihy. Je to pohodlné – nemusím chodiť do obchodov. Tovar mi doručia domov. Platím kartou alebo pri dobierke. Treba však byť opatrný, aby sme nenatrafili na podvodné stránky. Vždy kontrolujem recenzie.",
    translation: "Всё больше людей покупают онлайн. Я так заказываю одежду и книги. Это удобно – не нужно ходить по магазинам. Товар доставляют на дом. Я плачу картой или наложенным платежом. Однако нужно быть осторожным, чтобы не попасть на мошеннические сайты. Я всегда проверяю отзывы.",
    wordCount: 62,
    questions: [
      { text: "Čo autor nakupuje online?", options: ["Elektroniku", "Oblečenie a knihy", "Potraviny", "Nábytok"], correct: 1 },
      { text: "Prečo je to pohodlné?", options: ["Lebo je to lacné", "Netreba chodiť do obchodov", "Lebo tovar je zadarmo", "Lebo to doručia hneď"], correct: 1 }
    ]
  },
  {
    id: "a2-zvyky-1",
    title: "Veľkonočné tradície",
    level: "A2",
    topic: "zvyky",
    content: "Na Slovensku je Veľká noc plná zvykov. Na Kvetnú nedeľu svätia ratolesti. Na Zelený štvrtok sa jedia zelené jedlá. Veľkonočný pondelok chlapci oblievajú dievčatá vodou a šibú korbáčom, aby boli zdravé. Za odmenu dostanú maľované vajíčka alebo sladkosti. Tieto zvyky sú živé najmä na vidieku.",
    translation: "В Словакии Пасха полна обычаев. В Вербное воскресенье освящают веточки. В Зелёный четверг едят зелёные блюда. В пасхальный понедельник парни обливают девушек водой и хлещут плетёной веткой, чтобы они были здоровы. В награду получают крашеные яйца или сладости. Эти обычаи живы особенно в сельской местности.",
    wordCount: 72,
    questions: [
      { text: "Čo robia chlapci na Veľkonočný pondelok?", options: ["Maľujú vajíčka", "Oblievajú dievčatá a šibú", "Spievajú", "Tancujú"], correct: 1 },
      { text: "Čo dostanú za odmenu?", options: ["Peniaze", "Maľované vajíčka", "Koláč", "Oblečenie"], correct: 1 }
    ]
  },
  // ========== B1 (10 textov, 100-150 slov) ==========
  {
    id: "b1-pozdravy-1",
    title: "Prvý deň v práci",
    level: "B1",
    topic: "praca",
    content: "Nástup do novej práce býva stresujúci. Ráno som prišiel o pol hodiny skôr, aby som sa zorientoval. Kolegovia ma srdečne privítali. Ukázali mi kanceláriu a vysvetlili, ako funguje firemný systém. Cez obed sme sa rozprávali o záľubách. Dozvedel som sa, že viacerí majú radi turistiku, čo ma potešilo. Na konci dňa som cítil úľavu a tešil sa na ďalší deň.",
    translation: "Первый день в новой работе бывает стрессовым. Утром я пришёл на полчаса раньше, чтобы сориентироваться. Коллеги меня тепло встретили. Показали офис и объяснили, как работает система компании. В обед мы разговаривали о хобби. Я узнал, что многие любят походы, чему я обрадовался. В конце дня я почувствовал облегчение и ждал следующего дня.",
    wordCount: 89,
    questions: [
      { text: "Prečo prišiel skôr?", options: ["Lebo meškal", "Aby sa zorientoval", "Lebo chcel zapôsobiť", "Lebo nevedel prísť neskôr"], correct: 1 },
      { text: "Čo zistil o kolegoch?", options: ["Mali radi turistiku", "Nemali ho radi", "Boli nepriateľskí", "Všetci boli mladí"], correct: 0 },
      { text: "Ako sa cítil na konci dňa?", options: ["Unavene a smutne", "Úľavu a tešil sa", "Nahnevane", "Ľahostajne"], correct: 1 }
    ]
  },
  {
    id: "b1-cestovanie-1",
    title: "Dovolenka na Slovensku",
    level: "B1",
    topic: "cestovanie",
    content: "Tento rok sme sa rozhodli spoznávať Slovensko. Začali sme vo Vysokých Tatrách, kde sme absolvovali túru na Zelené pleso. Počasie prialo, výhľady boli dychberúce. Potom sme navštívili Oravský hrad, ktorý je jedným z najkrajších na Slovensku. V malebnom mestečku Levoča sme videli najvyšší drevený oltár na svete. Každý región mal svoju atmosféru. Naša dovolenka bola plná zážitkov.",
    translation: "В этом году мы решили узнавать Словакию. Начали с Высоких Татр, где совершили поход к Зелёному плесу. Погода благоприятствовала, виды захватывали дух. Потом посетили Оравский замок, один из красивейших в Словакии. В живописном городке Левоча увидели самый высокий деревянный алтарь в мире. Каждый регион имел свою атмосферу. Наш отпуск был полон впечатлений.",
    wordCount: 96,
    questions: [
      { text: "Kde začali dovolenku?", options: ["V Nízkych Tatrách", "Vysokých Tatrách", "V Bratislave", "V Košiciach"], correct: 1 },
      { text: "Čo videli v Levoči?", options: ["Najvyšší drevený oltár", "Hrad", "Sochu", "Kostol"], correct: 0 },
      { text: "Aký bol výlet?", options: ["Nudný", "Plný zážitkov", "Krátky", "Nepríjemný"], correct: 1 }
    ]
  },
  {
    id: "b1-zdravie-1",
    title: "Výhody joggingu",
    level: "B1",
    topic: "zdravie",
    content: "Jogging je jednou z najdostupnejších foriem pohybu. Stačí si obuť tenisky a vyraziť von. Pravidelné behanie posilňuje srdce, spaľuje kalórie a zlepšuje náladu vďaka endorfínom. Ja behám trikrát do týždňa. Najradšej mám ranný beh, keď je vzduch čerstvý. Po behu sa cítim plný energie. Odporúčam každému, aby si to aspoň vyskúšal.",
    translation: "Бег трусцой – одна из самых доступных форм движения. Достаточно надеть кроссовки и выйти на улицу. Регулярный бег укрепляет сердце, сжигает калории и улучшает настроение благодаря эндорфинам. Я бегаю три раза в неделю. Больше всего люблю утренний бег, когда воздух свежий. После бега я чувствую себя полным энергии. Рекомендую каждому хотя бы попробовать.",
    wordCount: 90,
    questions: [
      { text: "Čo posilňuje pravidelné behanie?", options: ["Svaly nôh", "Srdce", "Pľúca", "Kosti"], correct: 1 },
      { text: "Ako často autor behá?", options: ["Denne", "Trikrát do týždňa", "Raz za mesiac", "Len cez víkend"], correct: 1 }
    ]
  },
  {
    id: "b1-technologia-1",
    title: "Vplyv sociálnych sietí",
    level: "B1",
    topic: "technologia",
    content: "Sociálne siete spájajú ľudí, ale prinášajú aj riziká. Môžeme byť v kontakte s priateľmi na celom svete. Na druhej strane nás môžu pripraviť o čas a vyvolať pocity menejcennosti. Ja sa snažím obmedziť ich používanie. Vypínam si notifikácie a určujem si časový limit. Takto si chránim svoju koncentráciu a osobný život.",
    translation: "Социальные сети объединяют людей, но несут и риски. Мы можем быть на связи с друзьями по всему миру. С другой стороны, они могут отнимать время и вызывать чувство неполноценности. Я стараюсь ограничивать их использование. Отключаю уведомления и устанавливаю лимит времени. Так я защищаю свою концентрацию и личную жизнь.",
    wordCount: 80,
    questions: [
      { text: "Aký pozitívny aspekt majú sociálne siete?", options: ["Zvyšujú čas", "Spájajú ľudí", "Znižujú koncentráciu", "Vyvolávajú stres"], correct: 1 },
      { text: "Ako autor obmedzuje ich používanie?", options: ["Máže účet", "Vypína notifikácie a dáva si limit", "Používa len jednu sieť", "Vôbec ich nepoužíva"], correct: 1 }
    ]
  },
  {
    id: "b1-jedlo-1",
    title: "Tradičná slovenská kuchyňa",
    level: "B1",
    topic: "jedlo",
    content: "Slovenská kuchyňa je výdatná a chutná. Okrem bryndzových halušiek poznáme aj kapustnicu, parené buchty, lokše či zemiakové placky. Základ tvorí mäso, zemiaky a kapusta. V reštauráciách dnes nájdeme aj moderné variácie. Ja osobne milujem pirohy plnené bryndzou a slaninkou. Slovenská kuchyňa síce nie je diétna, ale určite stojí za ochutnanie.",
    translation: "Словацкая кухня сытная и вкусная. Помимо брынзовых галушек мы знаем также капустный суп, вареники на пару, лепёшки или картофельные оладьи. Основу составляют мясо, картофель и капуста. В ресторанах сегодня можно найти и современные вариации. Лично я обожаю вареники с брынзой и беконом. Словацкая кухня хоть и не диетическая, но определённо стоит того, чтобы её попробовать.",
    wordCount: 92,
    questions: [
      { text: "Čo tvorí základ slovenskej kuchyne?", options: ["Ryby", "Mäso, zemiaky, kapusta", "Cestoviny", "Ovocie"], correct: 1 },
      { text: "Čo autor miluje?", options: ["Halušky", "Pirohy plnené bryndzou", "Polievku", "Zákusky"], correct: 1 }
    ]
  },
  {
    id: "b1-priroda-1",
    title: "Tatranský národný park",
    level: "B1",
    topic: "priroda",
    content: "Tatranský národný park je najstarší na Slovensku. Rozprestiera sa na severe krajiny. Je domovom kamzíkov, svišťov a orlov. Turisti sem prichádzajú kvôli vysokohorským túram, lyžovaniu a čistému vzduchu. Treba však dodržiavať pravidlá, aby sme chránili prírodu. Odpad si nosíme so sebou a nerušíme zvieratá.",
    translation: "Татранский национальный парк – старейший в Словакии. Он простирается на севере страны. Является домом для серн, сурков и орлов. Туристы приезжают сюда ради высокогорных походов, катания на лыжах и чистого воздуха. Однако нужно соблюдать правила, чтобы защищать природу. Мусор уносим с собой и не беспокоим животных.",
    wordCount: 86,
    questions: [
      { text: "Ktorý park je najstarší?", options: ["Pieninský", "Tatranský", "Nízke Tatry", "Malá Fatra"], correct: 1 },
      { text: "Aké zvieratá tam žijú?", options: ["Medvede a vlky", "Kamzíky, svište, orly", "Líšky a zajace", "Veveričky"], correct: 1 }
    ]
  },
  {
    id: "b1-historia-1",
    title: "Žilina – mesto histórie",
    level: "B1",
    topic: "historia",
    content: "Žilina je jedno z najstarších slovenských miest. Prvá písomná zmienka pochádza z roku 1208. V historickom centre nájdeme Marianske námestie s typickými meštianskymi domami. Dominantou je Kostol svätého Pavla a Budatínsky hrad. Mesto je známe aj vďaka automobilke KIA. Spája tak históriu s moderným priemyslom.",
    translation: "Жилина – один из старейших словацких городов. Первое письменное упоминание относится к 1208 году. В историческом центре находится Марианская площадь с типичными мещанскими домами. Доминантой является костёл Святого Павла и Будатинский замок. Город известен также благодаря автомобильному заводу KIA. Так он сочетает историю с современной промышленностью.",
    wordCount: 84,
    questions: [
      { text: "Z ktorého roku je prvá zmienka o Žiline?", options: ["1208", "1300", "1100", "1400"], correct: 0 },
      { text: "Čo je dominantou mesta?", options: ["Kostol sv. Pavla a hrad", "Len námestie", "Automobilka", "Park"], correct: 0 }
    ]
  },
  {
    id: "b1-kultura-1",
    title: "Folklórny festival",
    level: "B1",
    topic: "kultura",
    content: "Folklórne festivaly na Slovensku sú plné hudby, tanca a farieb. Najväčší je Východná, ktorá sa koná každé leto. Vystupujú tu súbory z celého sveta. Návštevníci môžu vidieť ľudové kroje, ochutnať tradičné jedlá a zapojiť sa do tancov. Takéto podujatia udržiavajú tradície pri živote a spájajú generácie.",
    translation: "Фольклорные фестивали в Словакии полны музыки, танцев и красок. Крупнейший – Выходна, который проходит каждое лето. Здесь выступают коллективы со всего мира. Посетители могут увидеть народные костюмы, попробовать традиционные блюда и присоединиться к танцам. Такие мероприятия поддерживают традиции и объединяют поколения.",
    wordCount: 82,
    questions: [
      { text: "Ktorý festival je najväčší?", options: ["Východná", "Detva", "Myjava", "Terchová"], correct: 0 },
      { text: "Čo môžu návštevníci robiť?", options: ["Len pozerať", "Zapojiť sa do tancov", "Len jesť", "Len spať"], correct: 1 }
    ]
  },
  {
    id: "b1-sport-1",
    title: "Obľúbené športy na Slovensku",
    level: "B1",
    topic: "sport",
    content: "Na Slovensku je najpopulárnejší hokej a futbal. Zápasy priťahujú tisíce fanúšikov. Okrem toho mnohí ľudia rekreačne lyžujú, korčuľujú alebo hrajú tenis. V posledných rokoch rastie záujem o cyklistiku a beh. Slovensko má výborné podmienky na vonkajšie športy vďaka horám a nížinám.",
    translation: "В Словакии самые популярные хоккей и футбол. Матчи привлекают тысячи болельщиков. Кроме того, многие люди катаются на лыжах, коньках или играют в теннис. В последние годы растёт интерес к велоспорту и бегу. Словакия имеет отличные условия для уличных видов спорта благодаря горам и равнинам.",
    wordCount: 78,
    questions: [
      { text: "Aké sú dva najpopulárnejšie športy?", options: ["Basketbal a volejbal", "Hokej a futbal", "Tenis a plávanie", "Lyžovanie a cyklistika"], correct: 1 },
      { text: "Prečo má Slovensko dobré podmienky na vonkajšie športy?", options: ["Lebo je malé", "Vďaka horám a nížinám", "Lebo má štadióny", "Lebo je lacné"], correct: 1 }
    ]
  },
  {
    id: "b1-zvyky-1",
    title: "Sviatok svätého Mikuláša",
    level: "B1",
    topic: "zvyky",
    content: "Šiesteho decembra chodí po Slovensku Mikuláš. Deti mu recitujú básničky alebo spievajú pesničky. Za odmenu dostanú sladkosti a ovocie. Mikuláša sprevádza anjel a čert, ktorý straší neposlušné deti. Tento zvyk pochádza z kresťanskej tradície a je obľúbený dodnes. V mnohých mestách sa konajú sprievody.",
    translation: "Шестого декабря по Словакии ходит Микулаш. Дети ему читают стихи или поют песни. В награду получают сладости и фрукты. Микулаша сопровождают ангел и чёрт, который пугает непослушных детей. Этот обычай происходит из христианской традиции и популярен до сих пор. Во многих городах проходят шествия.",
    wordCount: 86,
    questions: [
      { text: "Kedy chodí Mikuláš?", options: ["25. decembra", "6. decembra", "1. januára", "24. decembra"], correct: 1 },
      { text: "Kto sprevádza Mikuláša?", options: ["Len čert", "Anjel a čert", "Len anjel", "Nikto"], correct: 1 }
    ]
  },
  // ========== B2 (10 textov, 200-350 slov) ==========
  {
    id: "b2-cestovanie-1",
    title: "Objavovanie slovenských jaskýň",
    level: "B2",
    topic: "cestovanie",
    content: `Slovensko je krajina bohatá na jaskyne. Je ich tu vyše 6 000, pričom väčšina sa nachádza v Slovenskom krase a Nízkych Tatrách. Medzi najznámejšie patrí Demänovská jaskyňa slobody, ktorá láka návštevníkov svojou krasovou výzdobou. Ochtinská aragonitová jaskyňa je svetovou raritou – jej steny zdobia útvary tvorené aragonitom. Jaskyne ponúkajú jedinečné mikroklima a útočisko pre vzácne netopiere. Prehliadky so sprievodcom trvajú zvyčajne hodinu a sú bezpečné aj pre rodiny s deťmi. Pri návšteve treba dodržiavať teplotné obmedzenia a zákaz dotýkania sa kvapľov.`,
    translation: `Словакия – страна, богатая пещерами. Их здесь более 6 000, причём большинство находится в Словацком красе и Низких Татрах. Среди самых известных – Демьяновская пещера свободы, которая привлекает посетителей своими карстовыми образованиями. Охтинская арагонитовая пещера – мировая редкость: её стены украшают образования из арагонита. Пещеры предлагают уникальный микроклимат и убежище для редких летучих мышей. Экскурсии с гидом обычно длятся час и безопасны даже для семей с детьми. При посещении нужно соблюдать температурные ограничения и запрет на прикосновение к сталактитам.`,
    wordCount: 220,
    questions: [
      { text: "Koľko jaskýň je na Slovensku?", options: ["500", "1 200", "Viac ako 6 000", "10 000"], correct: 2 },
      { text: "Čím je výnimočná Ochtinská aragonitová jaskyňa?", options: ["Jazerom", "Aragonitovou výzdobou", "Ľadovou výzdobou", "Dĺžkou"], correct: 1 },
      { text: "Čo treba dodržiavať pri návšteve?", options: ["Hlasno rozprávať", "Teplotné obmedzenia a nedotýkať sa kvapľov", "Behať", "Fotiť s bleskom"], correct: 1 }
    ]
  },
  {
    id: "b2-historia-1",
    title: "Veľká Morava",
    level: "B2",
    topic: "historia",
    content: `Veľká Morava bol prvý stabilný štátny útvar na našom území. Vznikla v 9. storočí pod vedením kniežaťa Pribinu a neskôr Rastislava. Práve Rastislav pozval byzantských misionárov Konštantína a Metoda, ktorí vytvorili písmo hlaholiku a priniesli kresťanstvo. Veľká Morava sa stala centrom vzdelanosti a remesiel. Z tohto obdobia pochádzajú mnohé archeologické nálezy – šperky, meče a základy kostolov. Ríša zanikla pod nájazdmi Maďarov, ale jej odkaz pretrval v slovenskej kultúre a jazyku.`,
    translation: `Великая Моравия была первым стабильным государственным образованием на нашей территории. Она возникла в IX веке под руководством князя Прибины, а затем Ростислава. Именно Ростислав пригласил византийских миссионеров Константина и Мефодия, которые создали глаголицу и принесли христианство. Великая Моравия стала центром образованности и ремёсел. Из этого периода происходят многие археологические находки – украшения, мечи и фундаменты церквей. Империя пала под набегами венгров, но её наследие сохранилось в словацкой культуре и языке.`,
    wordCount: 190,
    questions: [
      { text: "Koho pozval Rastislav?", options: ["Cyrila a Metoda", "Františka a Jozefa", "Ľudovíta Štúra", "Jánošíka"], correct: 0 },
      { text: "Aké písmo vytvorili?", options: ["Latinku", "Azburu", "Hlaholiku", "Cyriliku"], correct: 2 }
    ]
  },
  {
    id: "b2-praca-1",
    title: "Práca na diaľku",
    level: "B2",
    topic: "praca",
    content: `Práca na diaľku, známa aj ako home office, sa po pandémii stala bežnou súčasťou života. Mnohé firmy zistili, že produktivita zamestnancov neklesá, ak majú vhodné podmienky. Výhodou je úspora času a peňazí na cestovaní. Na druhej strane sa stierajú hranice medzi pracovným a súkromným životom. Ľudia často pracujú dlhšie, trpia izoláciou a chýba im osobný kontakt s kolegami. Preto je dôležité nastaviť si pevný režim, vyhradiť si pracovný kútik a udržiavať virtuálne porady.`,
    translation: `Удалённая работа, также известная как хоум-офис, после пандемии стала обычной частью жизни. Многие компании обнаружили, что продуктивность сотрудников не падает, если у них подходящие условия. Преимуществом является экономия времени и денег на дорогу. С другой стороны, стираются границы между работой и личной жизнью. Люди часто работают дольше, страдают от изоляции, им не хватает личного контакта с коллегами. Поэтому важно установить твёрдый режим, выделить рабочий уголок и поддерживать виртуальные совещания.`,
    wordCount: 230,
    questions: [
      { text: "Aká výhoda home office sa uvádza?", options: ["Lepšia strava", "Úspora času a peňazí na cestovaní", "Viac dovolenky", "Menej práce"], correct: 1 },
      { text: "Čo sa neodporúča?", options: ["Mať pevný režim", "Stierať hranice", "Pracovať dlhšie", "Chodiť do kancelárie"], correct: 1 }
    ]
  },
  {
    id: "b2-technologia-1",
    title: "Umelá inteligencia v medicíne",
    level: "B2",
    topic: "technologia",
    content: `Umelá inteligencia (AI) prináša revolúciu do zdravotníctva. Dokáže analyzovať röntgenové snímky rýchlejšie a presnejšie ako človek. Pomáha pri diagnostike rakoviny, plánovaní liečby a objavovaní nových liekov. Algoritmy sa učia z obrovského množstva dát. Avšak AI nenahrádza lekára, slúži ako podporný nástroj. Je potrebné zabezpečiť ochranu osobných údajov pacientov. V budúcnosti môžeme očakávať ešte tesnejšiu integráciu technológií do liečby.`,
    translation: `Искусственный интеллект (ИИ) производит революцию в здравоохранении. Он способен анализировать рентгеновские снимки быстрее и точнее человека. Помогает в диагностике рака, планировании лечения и открытии новых лекарств. Алгоритмы учатся на огромных массивах данных. Однако ИИ не заменяет врача, а служит вспомогательным инструментом. Необходимо обеспечить защиту персональных данных пациентов. В будущем можно ожидать ещё более тесной интеграции технологий в лечение.`,
    wordCount: 220,
    questions: [
      { text: "Aké výhody prináša AI v medicíne?", options: ["Len rýchlosť", "Presnejšia diagnostika a analýza snímok", "Zníženie platov lekárov", "Menej liekov"], correct: 1 },
      { text: "Čo je potrebné zabezpečiť?", options: ["Ochranu osobných údajov", "Vypnutie počítačov", "Menšie nemocnice", "Zvýšenie daní"], correct: 0 }
    ]
  },
  {
    id: "b2-zdravie-1",
    title: "Význam spánku",
    level: "B2",
    topic: "zdravie",
    content: `Spánok je základný pilier zdravia. Počas spánku mozog spracúva informácie, telo regeneruje a posilňuje sa imunita. Nedostatok spánku vedie k poruchám sústredenia, obezite a vyššiemu riziku chronických chorôb. Dospelý človek potrebuje 7-9 hodín kvalitného spánku denne. Dôležitá je aj spánková hygiena: pravidelný režim, tma a ticho v spálni, obmedzenie modrého svetla pred spaním. Zdriemnutie počas dňa by nemalo presiahnuť 20-30 minút.`,
    translation: `Сон – основной столп здоровья. Во время сна мозг обрабатывает информацию, тело восстанавливается и укрепляется иммунитет. Недостаток сна ведёт к нарушениям концентрации, ожирению и повышенному риску хронических заболеваний. Взрослому человеку необходимо 7-9 часов качественного сна в сутки. Важна также гигиена сна: регулярный режим, темнота и тишина в спальне, ограничение синего света перед сном. Дневной сон не должен превышать 20-30 минут.`,
    wordCount: 200,
    questions: [
      { text: "Koľko hodín spánku potrebuje dospelý?", options: ["5-6", "7-9", "10-12", "4-5"], correct: 1 },
      { text: "Čo patrí k spánkovej hygiene?", options: ["Jasné svetlo", "Pravidelný režim a tma", "Hlasná hudba", "Práca v posteli"], correct: 1 }
    ]
  },
  {
    id: "b2-priroda-1",
    title: "Ochrana biodiverzity",
    level: "B2",
    topic: "priroda",
    content: `Biodiverzita, teda rozmanitosť života na Zemi, je nenahraditeľná. Každý druh má svoju úlohu v ekosystéme. Na Slovensku máme chránené územia NATURA 2000, ktoré chránia vzácne biotopy. Ohrozené sú napríklad sysle, dropy alebo niektoré druhy orchideí. Ľudská činnosť – výrub lesov, pesticídy, znečistenie – ohrozuje túto krehkú rovnováhu. Každý môže prispieť: výsadbou stromov, obmedzením chemikálií a podporou ekologického poľnohospodárstva.`,
    translation: `Биоразнообразие, то есть разнообразие жизни на Земле, незаменимо. Каждый вид выполняет свою роль в экосистеме. В Словакии есть охраняемые территории NATURA 2000, которые защищают редкие биотопы. Под угрозой находятся, например, суслики, дрофы или некоторые виды орхидей. Человеческая деятельность – вырубка лесов, пестициды, загрязнение – угрожает этому хрупкому равновесию. Каждый может внести вклад: посадкой деревьев, ограничением химикатов и поддержкой экологического сельского хозяйства.`,
    wordCount: 210,
    questions: [
      { text: "Čo znamená biodiverzita?", options: ["Len počet stromov", "Rozmanitosť života", "Kvalita vody", "Teplota vzduchu"], correct: 1 },
      { text: "Ako môže jednotlivec pomôcť?", options: ["Výsadbou stromov a obmedzením chemikálií", "Väčšou spotrebou", "Výrubom lesov", "Znečisťovaním"], correct: 0 }
    ]
  },
  {
    id: "b2-kultura-1",
    title: "Divadlo ako zrkadlo spoločnosti",
    level: "B2",
    topic: "kultura",
    content: `Divadlo od nepamäti slúžilo nielen na zábavu, ale aj na kritiku spoločnosti. Slovenské divadlá ako Slovenské národné divadlo či Divadlo Andreja Bagara uvádzajú klasické aj moderné hry. Herci stelesňujú postavy, ktoré reflektujú aktuálne problémy. Návšteva divadla je intímny zážitok, pri ktorom sa divák priamo spája s emóciami na javisku. V poslednom období rastie obľuba alternatívnych a pouličných divadiel. Je to znak, že kultúra stále žije.`,
    translation: `Театр с незапамятных времён служил не только развлечению, но и критике общества. Словацкие театры, такие как Словацкий национальный театр или Театр Андрея Багара, ставят классические и современные пьесы. Актёры воплощают персонажей, отражающих актуальные проблемы. Посещение театра – это интимный опыт, при котором зритель непосредственно соединяется с эмоциями на сцене. В последнее время растёт популярность альтернативных и уличных театров. Это знак того, что культура всё ещё жива.`,
    wordCount: 190,
    questions: [
      { text: "Aké divadlá sa spomínajú?", options: ["SND a Divadlo A. Bagara", "Len malé divadlá", "Len zahraničné", "Len operné"], correct: 0 },
      { text: "Čo rastie v poslednom období?", options: ["Počet kín", "Obľuba alternatívnych divadiel", "Ceny lístkov", "Záujem o operu"], correct: 1 }
    ]
  },
  {
    id: "b2-sport-1",
    title: "Hokejová horúčka",
    level: "B2",
    topic: "sport",
    content: `Ľadový hokej je na Slovensku národným športom číslo jeden. Počas majstrovstiev sveta sa ulice vyprázdnia a ľudia hromadne sledujú zápasy. Slovensko vychovalo množstvo hokejových legiend ako Peter Bondra, Marián Hossa či Zdeno Chára. Úspechy reprezentácie spájajú národ a vytvárajú nezabudnuteľné momenty. Mladí hráči sa od útleho veku venujú tréningu. Slovenské štadióny, aj keď menšie, ponúkajú výbornú atmosféru. Hokej je viac než šport – je to súčasť slovenskej identity.`,
    translation: `Хоккей с шайбой – национальный вид спорта номер один в Словакии. Во время чемпионатов мира улицы пустеют, и люди массово смотрят матчи. Словакия воспитала множество хоккейных легенд, таких как Петер Бондра, Мариан Госса или Здено Хара. Успехи сборной объединяют нацию и создают незабываемые моменты. Молодые игроки с раннего возраста посвящают себя тренировкам. Словацкие стадионы, хоть и небольшие, предлагают отличную атмосферу. Хоккей – больше чем спорт, это часть словацкой идентичности.`,
    wordCount: 210,
    questions: [
      { text: "Ktorí hokejisti sú spomenutí?", options: ["Bondra, Hossa, Chára", "Šatan, Pálffy", "Len brankári", "Len obrancovia"], correct: 0 },
      { text: "Čo robí hokej pre Slovákov?", options: ["Je to len zábava", "Je súčasťou identity", "Je to len biznis", "Je to nepodstatné"], correct: 1 }
    ]
  },
  {
    id: "b2-zvyky-1",
    title: "Svadobné tradície",
    level: "B2",
    topic: "zvyky",
    content: `Slovenské svadby sú bohaté na zvyky. Už pred obradom sa koná „pýtanie“, kedy ženích žiada rodičov nevesty o ruku. Počas obradu sa novomanželia delia o chlieb a soľ. Po svadbe nasleduje veselica s ľudovou hudbou, tancom a tradičnými jedlami. Typické je „odobieranie nevesty“, kedy družbovia bránia nevestu a ženích musí splniť úlohy. Zvyky sa líšia podľa regiónov. Napriek moderným trendom si mnohé páry tieto tradície zachovávajú.`,
    translation: `Словацкие свадьбы богаты обычаями. Уже перед церемонией происходит «сватание», когда жених просит у родителей невесты её руки. Во время церемонии молодожёны делятся хлебом и солью. После свадьбы следует гулянье с народной музыкой, танцами и традиционными блюдами. Типично «отбирание невесты», когда дружки защищают невесту, а жених должен выполнить задания. Обычаи различаются по регионам. Несмотря на современные тенденции, многие пары сохраняют эти традиции.`,
    wordCount: 200,
    questions: [
      { text: "Čo je „pýtanie“?", options: ["Platenie účtu", "Žiadosť o ruku", "Výber jedla", "Tanec"], correct: 1 },
      { text: "Čím sa delia novomanželia?", options: ["Ovocím", "Chlebom a soľou", "Vínom", "Koláčmi"], correct: 1 }
    ]
  },
  {
    id: "b2-technologia-2",
    title: "Elektromobilita na Slovensku",
    level: "B2",
    topic: "technologia",
    content: `Elektrické autá pomaly dobývajú slovenské cesty. Hoci je ich podiel zatiaľ nízky, záujem rastie. Výhodou sú nízke prevádzkové náklady a nulové emisie v mieste prevádzky. Problémom zostáva nedostatočná sieť nabíjacích staníc, najmä na vidieku. Vláda podporuje kúpu dotáciami. Slovensko je významným výrobcom áut, takže sa očakáva nárast výroby elektrických modelov priamo u nás. Prechod na elektromobilitu je nevyhnutný pre ochranu klímy.`,
    translation: `Электромобили постепенно завоёвывают словацкие дороги. Хотя их доля пока невелика, интерес растёт. Преимущества – низкие эксплуатационные расходы и нулевые выбросы в месте эксплуатации. Проблемой остаётся недостаточная сеть зарядных станций, особенно в сельской местности. Правительство поддерживает покупку дотациями. Словакия – крупный производитель автомобилей, поэтому ожидается рост выпуска электромоделей непосредственно у нас. Переход на электромобильность необходим для защиты климата.`,
    wordCount: 190,
    questions: [
      { text: "Aký je hlavný problém elektromobility na Slovensku?", options: ["Vysoké dane", "Nedostatok nabíjacích staníc", "Nízka rýchlosť", "Hluk"], correct: 1 },
      { text: "Čo ponúka vláda?", options: ["Zákaz starých áut", "Dotácie na kúpu", "Bezplatné parkovanie", "Lacnejšie palivo"], correct: 1 }
    ]
  },
  // ========== C1 (10 textov, 300-500 slov) ==========
  {
    id: "c1-historia-1",
    title: "Slovenské národné obrodenie",
    level: "C1",
    topic: "historia",
    content: `Slovenské národné obrodenie bolo kľúčovým obdobím formovania moderného slovenského národa. Prebiehalo v 18. a 19. storočí v kontexte maďarizácie a nemeckého vplyvu. Bernolákovci kodifikovali prvý spisovný jazyk – bernolákovčinu, no napokon sa presadila štúrovská slovenčina z roku 1843. Ľudovít Štúr, Jozef Miloslav Hurban a Michal Miloslav Hodža patrili medzi vedúce osobnosti. Obrodenie zahŕňalo aj zbieranie ľudovej slovesnosti a básnickú tvorbu. Toto hnutie položilo základy národnej identity, ktorá prežila aj silný maďarizačný tlak. Dnes si týchto dejateľov pripomíname ako otcov národa.`,
    translation: `Словацкое национальное возрождение было ключевым периодом формирования современной словацкой нации. Оно проходило в XVIII и XIX веках в контексте мадьяризации и немецкого влияния. Бернолаковцы кодифицировали первый литературный язык – бернолаковщину, однако в итоге утвердился штуровский словацкий язык 1843 года. Людовит Штур, Йозеф Милослав Гурбан и Михал Милослав Годжа были ведущими личностями. Возрождение включало также сбор народного творчества и поэтическое творчество. Это движение заложило основы национальной идентичности, которая пережила сильное давление мадьяризации. Сегодня мы чтим этих деятелей как отцов нации.`,
    wordCount: 280,
    questions: [
      { text: "Ktorý jazyk sa napokon presadil?", options: ["Bernolákovčina", "Štúrovská slovenčina", "Čeština", "Latinčina"], correct: 1 },
      { text: "Kto boli hlavní predstavitelia?", options: ["Štúr, Hurban, Hodža", "Len Štúr", "Len Hurban", "Bernolák a Fándly"], correct: 0 }
    ]
  },
  {
    id: "c1-kultura-1",
    title: "Vplyv globalizácie na lokálnu kultúru",
    level: "C1",
    topic: "kultura",
    content: `Globalizácia so sebou prináša rozširovanie rovnakých kultúrnych vzorcov – fast food, hollywoodske filmy, anglický jazyk. Na jednej strane to uľahčuje komunikáciu medzi národmi, na druhej strane ohrozuje lokálne tradície. Mnohé slovenské zvyky, ako výroba fujary či modrotlač, sa vytrácajú. Mladá generácia často neovláda ľudové piesne a preferuje globálne trendy. Našťastie sa objavujú iniciatívy, ktoré sa snažia oživiť dedičstvo – festivaly, workshopy a digitálne archívy. Je nevyhnutné nájsť rovnováhu medzi otvorenosťou svetu a ochranou vlastnej identity.`,
    translation: `Глобализация приносит с собой распространение одинаковых культурных образцов – фастфуд, голливудские фильмы, английский язык. С одной стороны, это облегчает общение между народами, с другой – угрожает местным традициям. Многие словацкие обычаи, такие как изготовление фуяры или синепечать, исчезают. Молодое поколение часто не знает народных песен и предпочитает глобальные тренды. К счастью, появляются инициативы, стремящиеся возродить наследие – фестивали, мастер-классы и цифровые архивы. Необходимо найти баланс между открытостью миру и защитой собственной идентичности.`,
    wordCount: 240,
    questions: [
      { text: "Čo ohrozuje lokálne tradície podľa textu?", options: ["Vzdelávanie", "Globalizácia", "Cestovanie", "Šport"], correct: 1 },
      { text: "Aké iniciatívy sa spomínajú?", options: ["Festivaly a workshopy", "Zákazy", "Dane", "Kolonizácia"], correct: 0 }
    ]
  },
  {
    id: "c1-technologia-1",
    title: "Kybernetická bezpečnosť v ére digitalizácie",
    level: "C1",
    topic: "technologia",
    content: `S rastúcou digitalizáciou štátnej správy, bankovníctva a zdravotníctva rastie aj význam kybernetickej bezpečnosti. Hackerské útoky môžu ochromiť kritickú infraštruktúru, ukradnúť citlivé údaje alebo poškodiť reputáciu. Slovensko prijalo viaceré legislatívne opatrenia, vrátane zákona o kybernetickej bezpečnosti. Firmy investujú do bezpečnostných auditov a školení zamestnancov. Najslabším článkom však často býva ľudský faktor – nepozornosť pri otváraní podvodných e-mailov. Prevencia spočíva v kombinácii technických riešení a neustáleho vzdelávania.`,
    translation: `С ростом цифровизации государственного управления, банков и здравоохранения растёт и значение кибербезопасности. Хакерские атаки могут парализовать критическую инфраструктуру, украсть конфиденциальные данные или нанести ущерб репутации. Словакия приняла ряд законодательных мер, включая закон о кибербезопасности. Компании инвестируют в аудит безопасности и обучение сотрудников. Однако самым слабым звеном часто является человеческий фактор – невнимательность при открытии фишинговых писем. Профилактика заключается в сочетании технических решений и непрерывного образования.`,
    wordCount: 280,
    questions: [
      { text: "Čo je najslabším článkom kyberbezpečnosti?", options: ["Technológie", "Ľudský faktor", "Zákony", "Počasie"], correct: 1 },
      { text: "Čo Slovensko prijalo?", options: ["Zákon o kybernetickej bezpečnosti", "Nové dane", "Zákaz internetu", "Povinné heslá"], correct: 0 }
    ]
  },
  {
    id: "c1-zdravie-1",
    title: "Psychické zdravie na pracovisku",
    level: "C1",
    topic: "zdravie",
    content: `Stres, vyhorenie a úzkosť sú čoraz častejšie javy v modernom zamestnaní. Dlhé hodiny, vysoké nároky a neistota vedú k poklesu produktivity a nárastu absencie. Zamestnávatelia by mali vytvárať podporné prostredie: ponúkať flexibilný pracovný čas, poskytovať psychologické poradenstvo a podporovať work-life balance. Na Slovensku je táto téma stále stigmatizovaná, hoci sa situácia pomaly zlepšuje. Zamestnanci by sa nemali báť vyhľadať odbornú pomoc. Psychické zdravie je rovnako dôležité ako fyzické.`,
    translation: `Стресс, выгорание и тревожность – всё более частые явления в современной работе. Долгие часы, высокие требования и неопределённость ведут к снижению продуктивности и росту отсутствия на работе. Работодатели должны создавать поддерживающую среду: предлагать гибкий график, предоставлять психологическое консультирование и поощрять баланс работы и личной жизни. В Словакии эта тема всё ещё стигматизирована, хотя ситуация медленно улучшается. Сотрудники не должны бояться обращаться за профессиональной помощью. Психическое здоровье так же важно, как и физическое.`,
    wordCount: 270,
    questions: [
      { text: "Čo vedie k poklesu produktivity?", options: ["Dovolenky", "Stres a vyhorenie", "Menej práce", "Viac času"], correct: 1 },
      { text: "Čo by mali zamestnávatelia ponúkať?", options: ["Psychologické poradenstvo a flexibilný čas", "Len vyššie platy", "Menej práce", "Viac dovolenky"], correct: 0 }
    ]
  },
  {
    id: "c1-priroda-1",
    title: "Klimatická zmena a jej dôsledky pre strednú Európu",
    level: "C1",
    topic: "priroda",
    content: `Klimatická zmena sa prejavuje aj v miernom pásme. Na Slovensku pozorujeme častejšie vlny horúčav, suchá a prívalové zrážky. Poľnohospodári hlásia nižšie výnosy, lesy trpia premnožením kôrovcov. Horské ľadovce v Tatrách prakticky zmizli. Opatrenia zahŕňajú obmedzovanie emisií skleníkových plynov, prechod na obnoviteľné zdroje a adaptáciu miest na zmenené podmienky. Dôležitá je aj osveta verejnosti. Každý jednotlivec môže prispieť zmenou správania – menej lietať, používať MHD, znižovať odpad.`,
    translation: `Изменение климата проявляется и в умеренном поясе. В Словакии мы наблюдаем более частые волны жары, засухи и ливневые осадки. Сельское хозяйство сообщает о снижении урожайности, леса страдают от размножения короедов. Горные ледники в Татрах практически исчезли. Меры включают ограничение выбросов парниковых газов, переход на возобновляемые источники и адаптацию городов к изменившимся условиям. Важна также просветительская работа с общественностью. Каждый человек может внести вклад, изменив поведение – меньше летать, пользоваться общественным транспортом, сокращать отходы.`,
    wordCount: 290,
    questions: [
      { text: "Čo zmizlo v Tatrách?", options: ["Jazerá", "Ľadovce", "Lesy", "Zvieratá"], correct: 1 },
      { text: "Aké opatrenia sa spomínajú?", options: ["Prechod na obnoviteľné zdroje", "Väčšia výroba áut", "Výrub lesov", "Zvyšovanie emisií"], correct: 0 }
    ]
  },
  {
    id: "c1-cestovanie-1",
    title: "Udržateľný turizmus",
    level: "C1",
    topic: "cestovanie",
    content: `Masový turizmus má negatívne dopady na životné prostredie a miestne komunity. Udržateľný turizmus sa snaží minimalizovať škody a prinášať prospech regiónom. Na Slovensku sa rozvíjajú ekofarmy, agroturistika a pomalé cestovanie. Turisti môžu spoznávať krajinu pešo, na bicykli, ubytovať sa v penziónoch a nakupovať lokálne produkty. Takýto prístup podporuje ekonomiku a chráni prírodu. Dôležité je plánovať cesty tak, aby sme nepreťažovali populárne destinácie.`,
    translation: `Массовый туризм негативно влияет на окружающую среду и местные сообщества. Устойчивый туризм стремится минимизировать вред и приносить пользу регионам. В Словакии развиваются экофермы, агротуризм и медленные путешествия. Туристы могут знакомиться со страной пешком, на велосипеде, останавливаться в пансионатах и покупать местные продукты. Такой подход поддерживает экономику и защищает природу. Важно планировать поездки так, чтобы не перегружать популярные направления.`,
    wordCount: 260,
    questions: [
      { text: "Čo je cieľom udržateľného turizmu?", options: ["Minimalizovať škody a prinášať prospech", "Maximalizovať zisk", "Zvýšiť počet turistov", "Postaviť viac hotelov"], correct: 0 },
      { text: "Čo môžu turisti robiť?", options: ["Nakupovať lokálne produkty", "Len ležať na pláži", "Ničiť prírodu", "Cestovať len lietadlom"], correct: 0 }
    ]
  },
  {
    id: "c1-praca-1",
    title: "Budúcnosť zamestnania v ére automatizácie",
    level: "C1",
    topic: "praca",
    content: `Automatizácia a robotizácia menia charakter práce. Rutinné manuálne a administratívne pozície zanikajú, zatiaľ čo rastie dopyt po kreatívnych a technických zručnostiach. Spoločnosť čelí výzve rekvalifikácie obrovského množstva ľudí. Vlády a firmy investujú do vzdelávacích programov. Na Slovensku je potenciál najmä v IT sektore a priemysle 4.0. Jednotlivci by mali byť flexibilní a ochotní celoživotne sa vzdelávať. Budúcnosť práce bude vyžadovať adaptabilitu a kombináciu vedomostí z viacerých odborov.`,
    translation: `Автоматизация и роботизация меняют характер труда. Рутинные ручные и административные должности исчезают, в то время как растёт спрос на творческие и технические навыки. Общество сталкивается с вызовом переквалификации огромного количества людей. Правительства и компании инвестируют в образовательные программы. В Словакии потенциал особенно в ИТ-секторе и индустрии 4.0. Люди должны быть гибкими и готовыми учиться всю жизнь. Будущее работы потребует адаптивности и сочетания знаний из нескольких областей.`,
    wordCount: 270,
    questions: [
      { text: "Čo zaniká pod vplyvom automatizácie?", options: ["Kreatívne pozície", "Rutinné pozície", "Všetky pozície", "Len IT pozície"], correct: 1 },
      { text: "Čo je potrebné pre budúcnosť práce?", options: ["Len fyzická sila", "Adaptabilita a celoživotné vzdelávanie", "Stagnácia", "Jedna zručnosť"], correct: 1 }
    ]
  },
  {
    id: "c1-sport-1",
    title: "Doping a etika v športe",
    level: "C1",
    topic: "sport",
    content: `Doping predstavuje vážny etický problém v súťažnom športe. Športovci pod tlakom výsledkov siahajú po zakázaných látkach, čím ohrozujú svoje zdravie a podkopávajú férovosť. Antidopingové agentúry vykonávajú kontroly a udeľujú tresty. Verejnosť však často vníma len odhalené prípady. Dôležitá je prevencia a výchova mladých športovcov k čistému športu. Slovensko sa zapája do medzinárodných programov. Etické hodnoty by mali byť nad túžbou po víťazstve za každú cenu.`,
    translation: `Допинг представляет серьёзную этическую проблему в соревновательном спорте. Спортсмены под давлением результатов прибегают к запрещённым веществам, подвергая опасности своё здоровье и подрывая честность. Антидопинговые агентства проводят проверки и налагают наказания. Однако общественность часто видит лишь раскрытые случаи. Важны профилактика и воспитание молодых спортсменов в духе чистого спорта. Словакия участвует в международных программах. Этические ценности должны быть выше желания победить любой ценой.`,
    wordCount: 260,
    questions: [
      { text: "Čo spôsobuje doping?", options: ["Ohrozuje zdravie a férovosť", "Zlepšuje výkon bez rizika", "Je legálny", "Pomáha všetkým"], correct: 0 },
      { text: "Čo je dôležité pri výchove športovcov?", options: ["Tresty", "Prevencia a výchova k čistému športu", "Ignorácia", "Zákaz športu"], correct: 1 }
    ]
  },
  {
    id: "c1-jedlo-1",
    title: "Trend zdravej výživy a alternatívne stravovanie",
    level: "C1",
    topic: "jedlo",
    content: `Zdravá výživa už dávno nie je len módnou záležitosťou. Rastie počet ľudí, ktorí sa stravujú vegetariánsky, vegánsky alebo obmedzujú príjem spracovaných potravín. Na Slovensku pribúdajú obchody s bio potravinami a reštaurácie ponúkajú rastlinné alternatívy. Odborníci zdôrazňujú potrebu vyváženého pomeru makroživín a dostatku vitamínov. Alternatívne smery, ako prerušovaný pôst, majú svojich priaznivcov. Dôležité je, aby každý našiel spôsob stravovania, ktorý mu vyhovuje a je udržateľný.`,
    translation: `Здоровое питание уже давно не просто модное увлечение. Растёт число людей, которые питаются вегетариански, вегански или ограничивают потребление обработанных продуктов. В Словакии появляются магазины с органическими продуктами, а рестораны предлагают растительные альтернативы. Специалисты подчёркивают необходимость сбалансированного соотношения макронутриентов и достатка витаминов. Альтернативные направления, такие как интервальное голодание, имеют своих сторонников. Важно, чтобы каждый нашёл способ питания, который ему подходит и является устойчивым.`,
    wordCount: 240,
    questions: [
      { text: "Aké stravovanie rastie na Slovensku?", options: ["Len mäsité", "Vegetariánske a vegánske", "Len rýchle občerstvenie", "Len tradičné"], correct: 1 },
      { text: "Čo zdôrazňujú odborníci?", options: ["Len chudnutie", "Vyvážený pomer makroživín", "Cvičenie", "Spánok"], correct: 1 }
    ]
  },
  {
    id: "c1-zvyky-1",
    title: "Význam rituálov v modernom živote",
    level: "C1",
    topic: "zvyky",
    content: `Rituály, hoci často vnímané ako prežitok minulosti, majú v modernej spoločnosti stále miesto. Narodeninové oslavy, nedeľné rodinné obedy či svadobné obrady poskytujú pocit kontinuity a bezpečia. Psychológovia upozorňujú, že rituály pomáhajú zvládať stres a posilňujú sociálne väzby. V digitálnom veku vznikajú aj nové rituály – napríklad spoločné sledovanie seriálov alebo online stretnutia. Dôležité je, aby sme si ich zachovali a prispôsobili súčasnosti. Bez nich by život stratil mnoho zo svojej hĺbky a zmyslu.`,
    translation: `Ритуалы, хотя часто воспринимаются как пережиток прошлого, всё ещё имеют место в современном обществе. Дни рождения, воскресные семейные обеды или свадебные церемонии дают ощущение непрерывности и безопасности. Психологи отмечают, что ритуалы помогают справляться со стрессом и укрепляют социальные связи. В цифровую эпоху возникают и новые ритуалы – например, совместный просмотр сериалов или онлайн-встречи. Важно сохранять их и адаптировать к настоящему. Без них жизнь потеряла бы много глубины и смысла.`,
    wordCount: 230,
    questions: [
      { text: "Čo poskytujú rituály podľa textu?", options: ["Len zábavu", "Pocit kontinuity a bezpečia", "Strach", "Neistotu"], correct: 1 },
      { text: "Čo vzniká v digitálnom veku?", options: ["Staré rituály zanikajú", "Nové rituály ako spoločné sledovanie seriálov", "Nič sa nemení", "Len formálne obrady"], correct: 1 }
    ]
  }
]