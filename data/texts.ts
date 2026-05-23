export type TextLevel = "A1" | "A2" | "B1" | "B2"
export type TextTopic = 
  | "pozdravy" | "rodina" | "jedlo" | "cestovanie" | "praca" 
  | "zdravie" | "priroda" | "kultura" | "ekologia" | "technologia" | "zvyky"

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
  // A1
  {
    id: "pozdravy-1",
    title: "Prvé kroky: Pozdravy",
    level: "A1",
    topic: "pozdravy",
    content: "Ahoj! Volám sa Jana. Som zo Slovenska. Ako sa voláš? Teší ma, že ťa spoznávam.",
    translation: "Привет! Меня зовут Яна. Я из Словакии. Как тебя зовут? Рада познакомиться.",
    wordCount: 12,
  },
  {
    id: "pozdravy-2",
    title: "V obchode",
    level: "A1",
    topic: "pozdravy",
    content: "Dobrý deň. Prosím si chlieb a mlieko. Koľko to stojí? Dve eurá, prosím. Ďakujem. Dovidenia.",
    translation: "Добрый день. Пожалуйста, хлеб и молоко. Сколько это стоит? Два евро, пожалуйста. Спасибо. До свидания.",
    wordCount: 15,
  },
  {
    id: "moja-rodina",
    title: "Moja rodina",
    level: "A1",
    topic: "rodina",
    content: "Mám mamu, otca a jedného brata. Moja mama je lekárka. Otec pracuje v obchode. Brat chodí do školy. Rád s nimi trávim čas.",
    translation: "У меня есть мама, папа и один брат. Моя мама – врач. Папа работает в магазине. Брат ходит в школу. Я люблю проводить с ними время.",
    wordCount: 22,
  },
  // A2
  {
    id: "v-restauracii",
    title: "V reštaurácii",
    level: "A2",
    topic: "jedlo",
    content: "Včera som bol v reštaurácii s priateľmi. Objednal som si kapustnicu a vyprážaný syr. Účet bol 15 eur. Obsluha bola milá.",
    translation: "Вчера я был в ресторане с друзьями. Я заказал капустный суп и жареный сыр. Счёт был 15 евро. Обслуживание было приятным.",
    wordCount: 18,
  },
  {
    id: "cestovanie-1",
    title: "Cestovanie vlakom",
    level: "A2",
    topic: "cestovanie",
    content: "Najradšej cestujem vlakom. Vlak je pohodlný a môžem sa pozerať z okna. Minulý mesiac som navštívil Vysoké Tatry. Výhľady boli úžasné.",
    translation: "Больше всего я люблю путешествовать на поезде. Поезд удобный, и я могу смотреть в окно. В прошлом месяце я посетил Высокие Татры. Виды были потрясающие.",
    wordCount: 25,
  },
  {
    id: "cestovanie-2",
    title: "Letisko",
    level: "A2",
    topic: "cestovanie",
    content: "Na letisku je veľa ľudí. Musím sa odhlásiť a odovzdať batožinu. Potom pôjdem na kontrolu pasov. Lietam do Prahy. Teším sa na dovolenku.",
    translation: "В аэропорту много людей. Я должен зарегистрироваться и сдать багаж. Затем я пойду на паспортный контроль. Я лечу в Прагу. Жду отпуска.",
    wordCount: 22,
  },
  // B1
  {
    id: "praca-1",
    title: "Práca a kariéra",
    level: "B1",
    topic: "praca",
    content: "Pracujem ako programátor vo veľkej firme. Moja práca je zaujímavá, ale niekedy stresujúca. Chcel by som sa v budúcnosti stať manažérom tímov.",
    translation: "Я работаю программистом в большой компании. Моя работа интересная, но иногда напряжённая. В будущем я хотел бы стать тимлидом.",
    wordCount: 20,
  },
  {
    id: "praca-2",
    title: "Pracovný pohovor",
    level: "B1",
    topic: "praca",
    content: "Zajtra mám pracovný pohovor. Som trochu nervózny, ale pripravil som sa. Prečítal som si informácie o firme a nacvičil som odpovede na otázky. Verím, že to dopadne dobre.",
    translation: "Завтра у меня собеседование. Я немного нервничаю, но подготовился. Я прочитал информацию о компании и потренировался отвечать на вопросы. Верю, что всё пройдёт хорошо.",
    wordCount: 28,
  },
  {
    id: "ekologia",
    title: "Ekológia a triedenie odpadu",
    level: "B1",
    topic: "ekologia",
    content: "Triedenie odpadu je dôležité pre našu planétu. Plast patrí do žltého kontajnera, sklo do zeleného a papier do modrého. Každý z nás môže pomôcť.",
    translation: "Сортировка отходов важна для нашей планеты. Пластик относится в жёлтый контейнер, стекло – в зелёный, бумага – в синий. Каждый из нас может помочь.",
    wordCount: 28,
  },
  {
    id: "zdravie-1",
    title: "U lekára",
    level: "B1",
    topic: "zdravie",
    content: "Cítim sa zle. Bolí ma hlava a mám teplotu. Potrebujem sa objednať k lekárovi. Dúfam, že to nie je nič vážne.",
    translation: "Я плохо себя чувствую. У меня болит голова и температура. Мне нужно записаться к врачу. Надеюсь, это ничего серьёзного.",
    wordCount: 18,
  },
  {
    id: "priroda-1",
    title: "V lese",
    level: "B1",
    topic: "priroda",
    content: "Rád chodím na prechádzky do lesa. Je tam ticho a pokoj. Počujem spev vtákov a vôňu ihličia. Najkrajšie je na jeseň, keď listy menia farby.",
    translation: "Я люблю ходить на прогулки в лес. Там тихо и спокойно. Я слышу пение птиц и запах хвои. Красивее всего осенью, когда листья меняют цвет.",
    wordCount: 25,
  },
  {
    id: "priroda-2",
    title: "Zvieratá v ZOO",
    level: "B1",
    topic: "priroda",
    content: "V nedeľu sme boli v zoo. Videli sme levy, tigre, opice a slony. Najviac sa mi páčili tučniaky, boli vtipné. Zvieratá vyzerali spokojne a mali veľa priestoru.",
    translation: "В воскресенье мы были в зоопарке. Мы видели львов, тигров, обезьян и слонов. Больше всего мне понравились пингвины, они были смешные. Животные выглядели довольными, и у них было много пространства.",
    wordCount: 26,
  },
  // B2
  {
    id: "digitalna-buducnost",
    title: "Digitálna budúcnosť",
    level: "B2",
    topic: "technologia",
    content: "Umelá inteligencia a automatizácia menia svet práce. Ľudia sa musia učiť nové zručnosti, aby zostali konkurencieschopní. Vzdelávanie bude celoživotné.",
    translation: "Искусственный интеллект и автоматизация меняют мир труда. Людям приходится учиться новым навыкам, чтобы оставаться конкурентоспособными. Образование станет непрерывным.",
    wordCount: 24,
  },
  {
    id: "kultura-1",
    title: "Slovenské tradície",
    level: "B2",
    topic: "zvyky",
    content: "Na Slovensku sa zachovalo mnoho ľudových zvykov, napríklad fašiangy, stavanie májov či vinobranie. Tieto tradície spájajú komunity a odovzdávajú sa z generácie na generáciu.",
    translation: "В Словакии сохранилось много народных обычаев, например, масленица, установка майских деревьев или сбор винограда. Эти традиции объединяют сообщества и передаются из поколения в поколение.",
    wordCount: 28,
  },
  {
    id: "zdravie-2",
    title: "Zdravý životný štýl",
    level: "B2",
    topic: "zdravie",
    content: "Zdravá strava a pravidelný pohyb sú základom dobrého zdravia. Snažím sa jesť veľa ovocia a zeleniny, vyhýbať sa cukru a každý deň prejsť aspoň 10 000 krokov. Cítim sa potom lepšie.",
    translation: "Здоровое питание и регулярная физическая активность – основа хорошего здоровья. Я стараюсь есть много фруктов и овощей, избегать сахара и проходить не менее 10 000 шагов в день. После этого я чувствую себя лучше.",
    wordCount: 30,
  },
  {
    id: "kultura-2",
    title: "Bratislavský hrad",
    level: "B2",
    topic: "kultura",
    content: "Bratislavský hrad je dominantou hlavného mesta. Stojí na kopci nad Dunajom. Z hradu je nádherný výhľad na mesto. V minulosti bol korunovačným miestom uhorských kráľov.",
    translation: "Братиславский замок – доминанта столицы. Он стоит на холме над Дунаем. С замка открывается прекрасный вид на город. В прошлом он был местом коронации венгерских королей.",
    wordCount: 24,
  },
  // дополнительные тексты из предыдущих версий
  {
    id: "na-navsteve",
    title: "Na návšteve u priateľov",
    level: "A2",
    topic: "rodina",
    content: "Včera som bol na návšteve u svojich priateľov. Privítali ma milo. Pili sme kávu a rozprávali sa o zážitkoch z dovolenky. Večer sme pozerali film. Bolo to príjemné popoludnie.",
    translation: "Вчера я был в гостях у своих друзей. Они встретили меня тепло. Мы пили кофе и разговаривали о впечатлениях от отпуска. Вечером смотрели фильм. Был приятный вечер.",
    wordCount: 24,
  },
  {
    id: "moj-den",
    title: "Môj deň",
    level: "A1",
    topic: "zvyky",
    content: "Ráno vstávam o siedmej. Umývam sa, obliekam a raňajkujem. Potom idem do práce. Po práci sa vraciam domov, varím večeru a pozerám televíziu. O desiatej idem spať.",
    translation: "Утром я встаю в семь. Умываюсь, одеваюсь и завтракаю. Потом иду на работу. После работы возвращаюсь домой, готовлю ужин и смотрю телевизор. В десять ложусь спать.",
    wordCount: 28,
  },
]