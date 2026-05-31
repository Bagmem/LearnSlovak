import { type Word } from "./words"

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1"

// Старый формат
export interface GrammarWord extends Word {
  hint?: string
}

export const grammarTasks: GrammarWord[] = [
  { slovak: "Ja som študent", russian: "Я студент", category: "Глагол 'Byť'", level: "A1", hint: "som" },
  { slovak: "Ty si unavený", russian: "Ты уставший", category: "Глагол 'Byť'", level: "A1", hint: "si" },
  { slovak: "On je lekár", russian: "Он врач", category: "Глагол 'Byť'", level: "A1", hint: "je" },
  { slovak: "Ona je učiteľka", russian: "Она учительница", category: "Глагол 'Byť'", level: "A1", hint: "je" },
  { slovak: "My sme doma", russian: "Мы дома", category: "Глагол 'Byť'", level: "A1", hint: "sme" },
  { slovak: "Vy ste priatelia", russian: "Вы друзья", category: "Глагол 'Byť'", level: "A1", hint: "ste" },
  { slovak: "Oni sú v práci", russian: "Они на работе", category: "Глагол 'Byť'", level: "A1", hint: "sú" },
  { slovak: "To je môj brat", russian: "Это мой брат", category: "Глагол 'Byť'", level: "A1", hint: "ukazovacie" },
  { slovak: "Nie som chorý", russian: "Я не болен", category: "Глагол 'Byť'", level: "A2", hint: "nie som – zápor" },
  { slovak: "Kde si?", russian: "Где ты?", category: "Глагол 'Byť'", level: "A2", hint: "otázka" },
  { slovak: "Mám otázku", russian: "У меня есть вопрос", category: "Глагол 'Mať'", level: "A1", hint: "mám" },
  { slovak: "Máš čas?", russian: "У тебя есть время?", category: "Глагол 'Mať'", level: "A1", hint: "máš" },
  { slovak: "Má auto", russian: "У него есть машина", category: "Глагол 'Mať'", level: "A1", hint: "má" },
  { slovak: "Máme peniaze", russian: "У нас есть деньги", category: "Глагол 'Mať'", level: "A1", hint: "máme" },
  { slovak: "Máte deti?", russian: "У вас есть дети?", category: "Глагол 'Mať'", level: "A2", hint: "máte" },
  { slovak: "Nemám problém", russian: "У меня нет проблемы", category: "Глагол 'Mať'", level: "A2", hint: "nemám" },
]

// Новый формат упражнений
export type GrammarExerciseType = "fill-blank" | "choose-form" | "build-sentence"

export interface GrammarExercise {
  id: string
  type: GrammarExerciseType
  category: string
  level: LanguageLevel
  sentence: string
  correctAnswer: string
  options?: string[]
  words?: string[]
  explanation: string
  hint?: string
}

export const grammarExercises: GrammarExercise[] = [
  // ========== Глагол "Byť" (A1) – расширено до 12 заданий ==========
  { id: "byt-a1-1", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "Ja ___ študent.", correctAnswer: "som", explanation: "Ja som – Я есть." },
  { id: "byt-a1-2", type: "choose-form", category: "Глагол 'Byť'", level: "A1", sentence: "Ty ___ unavený.", correctAnswer: "si", options: ["som", "si", "je", "sme"], explanation: "Ty si – Ты есть." },
  { id: "byt-a1-3", type: "build-sentence", category: "Глагол 'Byť'", level: "A1", sentence: "Мы дома.", correctAnswer: "My sme doma", words: ["doma", "My", "sme"], explanation: "My sme doma." },
  { id: "byt-a1-4", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "Ona ___ lekárka.", correctAnswer: "je", explanation: "Ona je – Она есть." },
  { id: "byt-a1-5", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "My ___ v škole.", correctAnswer: "sme", explanation: "My sme – Мы есть." },
  { id: "byt-a1-6", type: "choose-form", category: "Глагол 'Byť'", level: "A1", sentence: "Oni ___ v práci.", correctAnswer: "sú", options: ["som", "sú", "sme", "je"], explanation: "Oni sú – Они есть." },
  { id: "byt-a1-7", type: "build-sentence", category: "Глагол 'Byť'", level: "A1", sentence: "Вы учителя.", correctAnswer: "Vy ste učitelia", words: ["učitelia", "ste", "Vy"], explanation: "Vy ste učitelia." },
  { id: "byt-a1-8", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "To ___ môj kamarát.", correctAnswer: "je", explanation: "To je – Это есть." },
  { id: "byt-a1-9", type: "choose-form", category: "Глагол 'Byť'", level: "A1", sentence: "Kto ___ ty?", correctAnswer: "si", options: ["som", "si", "je", "sú"], explanation: "Kto si?" },
  { id: "byt-a1-10", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "Ako ___ ty?", correctAnswer: "si", explanation: "Ako si?" },
  { id: "byt-a1-11", type: "build-sentence", category: "Глагол 'Byť'", level: "A1", sentence: "Я студент.", correctAnswer: "Ja som študent", words: ["študent", "Ja", "som"], explanation: "Ja som študent." },
  { id: "byt-a1-12", type: "fill-blank", category: "Глагол 'Byť'", level: "A1", sentence: "Vy ___ dobrí priatelia.", correctAnswer: "ste", explanation: "Vy ste." },

  // ========== Глагол "Mať" (A1) – расширено до 10 заданий ==========
  { id: "mat-a1-1", type: "fill-blank", category: "Глагол 'Mať'", level: "A1", sentence: "Ja ___ auto.", correctAnswer: "mám", explanation: "Ja mám." },
  { id: "mat-a1-2", type: "choose-form", category: "Глагол 'Mať'", level: "A1", sentence: "Ty ___ veľa priateľov.", correctAnswer: "máš", options: ["mám", "máš", "má", "máme"], explanation: "Ty máš." },
  { id: "mat-a1-3", type: "build-sentence", category: "Глагол 'Mať'", level: "A1", sentence: "У меня есть вопрос.", correctAnswer: "Mám otázku", words: ["otázku", "Mám"], explanation: "Mám otázku." },
  { id: "mat-a1-4", type: "fill-blank", category: "Глагол 'Mať'", level: "A1", sentence: "Ona ___ brata.", correctAnswer: "má", explanation: "Ona má." },
  { id: "mat-a1-5", type: "choose-form", category: "Глагол 'Mať'", level: "A1", sentence: "My ___ čas.", correctAnswer: "máme", options: ["mám", "máš", "má", "máme"], explanation: "My máme." },
  { id: "mat-a1-6", type: "fill-blank", category: "Глагол 'Mať'", level: "A1", sentence: "Vy ___ pekný byt.", correctAnswer: "máte", explanation: "Vy máte." },
  { id: "mat-a1-7", type: "build-sentence", category: "Глагол 'Mať'", level: "A1", sentence: "У тебя есть время?", correctAnswer: "Máš čas?", words: ["Máš", "čas?"], explanation: "Máš čas?" },
  { id: "mat-a1-8", type: "fill-blank", category: "Глагол 'Mať'", level: "A1", sentence: "Oni ___ veľký dom.", correctAnswer: "majú", explanation: "Oni majú." },
  { id: "mat-a1-9", type: "choose-form", category: "Глагол 'Mať'", level: "A1", sentence: "Ja ___ hlad.", correctAnswer: "mám", options: ["mám", "máš", "má"], explanation: "Mám hlad." },
  { id: "mat-a1-10", type: "fill-blank", category: "Глагол 'Mať'", level: "A1", sentence: "Ty ___ pravdu.", correctAnswer: "máš", explanation: "Máš pravdu." },

  // ========== Род и окончания (A2) – расширено до 9 заданий ==========
  { id: "rod-a2-1", type: "choose-form", category: "Род и окончания", level: "A2", sentence: "To je pekn___ dom.", correctAnswer: "ý", options: ["ý", "á", "é"], explanation: "Mužský rod -ý." },
  { id: "rod-a2-2", type: "fill-blank", category: "Род и окончания", level: "A2", sentence: "To je pekn___ ulica.", correctAnswer: "á", explanation: "Ženský rod -á." },
  { id: "rod-a2-3", type: "build-sentence", category: "Род и окончания", level: "A2", sentence: "Это красивое место.", correctAnswer: "To je pekné miesto", words: ["pekné", "je", "To", "miesto"], explanation: "Stredný rod -é." },
  { id: "rod-a2-4", type: "choose-form", category: "Род и окончания", level: "A2", sentence: "Je to vysok___ chlapec.", correctAnswer: "ý", options: ["ý", "á", "é"], explanation: "Mužský rod." },
  { id: "rod-a2-5", type: "fill-blank", category: "Род и окончания", level: "A2", sentence: "To je širok___ rieka.", correctAnswer: "á", explanation: "Ženský rod." },
  { id: "rod-a2-6", type: "build-sentence", category: "Род и окончания", level: "A2", sentence: "Это старое здание.", correctAnswer: "To je stará budova", words: ["stará", "je", "To", "budova"], explanation: "Ženský rod, stará budova." },
  { id: "rod-a2-7", type: "fill-blank", category: "Род и окончания", level: "A2", sentence: "Mám rád tepl___ čaj.", correctAnswer: "ý", explanation: "Teplý čaj." },
  { id: "rod-a2-8", type: "choose-form", category: "Род и окончания", level: "A2", sentence: "To je pekn___ dievča.", correctAnswer: "é", options: ["ý", "á", "é"], explanation: "Stredný rod dievča." },
  { id: "rod-a2-9", type: "fill-blank", category: "Род и окончания", level: "A2", sentence: "Je to studen___ voda.", correctAnswer: "á", explanation: "Studená voda." },

  // ========== Падежи – Nominatív (A2) – расширено до 3 заданий ==========
  { id: "pad-nom-a2-1", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "Kto je to? To ___ môj brat.", correctAnswer: "je", explanation: "Nominatív." },
  { id: "pad-nom-a2-2", type: "build-sentence", category: "Падежи (Nominatív)", level: "A2", sentence: "Это новая машина.", correctAnswer: "To je nové auto", words: ["nové", "je", "To", "auto"], explanation: "Nominatív." },
  { id: "pad-nom-a2-3", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je to? Je to môj pes.", correctAnswer: "Čo", options: ["Kto", "Čo", "Kde"], explanation: "Čo je to?" },

  // ========== Падежи – Akuzatív (B1) – 8 заданий ==========
  { id: "pad-aku-b1-1", type: "fill-blank", category: "Падежи (Akuzatív)", level: "B1", sentence: "Vidím vysok___ dom.", correctAnswer: "ý", explanation: "Akuzatív muž. rodu." },
  { id: "pad-aku-b1-2", type: "choose-form", category: "Падежи (Akuzatív)", level: "B1", sentence: "Čítam zaujímav___ knihu.", correctAnswer: "ú", options: ["ú", "á", "é"], explanation: "Ženský rod -ú." },
  { id: "pad-aku-b1-3", type: "build-sentence", category: "Падежи (Akuzatív)", level: "B1", sentence: "Я вижу красивый дом.", correctAnswer: "Vidím pekný dom", words: ["pekný", "Vidím", "dom"], explanation: "Akuzatív bez predložky." },
  { id: "pad-aku-b1-4", type: "fill-blank", category: "Падежи (Akuzatív)", level: "B1", sentence: "Kúpil som si nov___ mobil.", correctAnswer: "ý", explanation: "Mužský rod neživ." },
  { id: "pad-aku-b1-5", type: "choose-form", category: "Падежи (Akuzatív)", level: "B1", sentence: "Čakám na ___ autobus.", correctAnswer: "svoj", options: ["svoj", "svojho", "svojom"], explanation: "Akuzatív privlastňovacieho zámena." },
  { id: "pad-aku-b1-6", type: "fill-blank", category: "Падежи (Akuzatív)", level: "B1", sentence: "Vidím tvoj___ matku.", correctAnswer: "u", explanation: "Tvoju matku." },
  { id: "pad-aku-b1-7", type: "choose-form", category: "Падежи (Akuzatív)", level: "B1", sentence: "Počúvam dobr___ hudbu.", correctAnswer: "ú", options: ["ú", "á", "é"], explanation: "Dobrú hudbu." },
  { id: "pad-aku-b1-8", type: "build-sentence", category: "Падежи (Akuzatív)", level: "B1", sentence: "Я жду автобус.", correctAnswer: "Čakám na autobus", words: ["na", "Čakám", "autobus"], explanation: "Čakať na + Akuzatív." },

  // ========== Падежи – Genitív (B1) – 7 заданий ==========
  { id: "pad-gen-b1-1", type: "fill-blank", category: "Падежи (Genitív)", level: "B1", sentence: "Potrebujem liter mliek___.", correctAnswer: "a", explanation: "Genitív." },
  { id: "pad-gen-b1-2", type: "build-sentence", category: "Падежи (Genitív)", level: "B1", sentence: "Без отца я не могу идти.", correctAnswer: "Bez otca nemôžem ísť", words: ["otca", "Bez", "nemôžem", "ísť"], explanation: "Bez + Genitív." },
  { id: "pad-gen-b1-3", type: "choose-form", category: "Падежи (Genitív)", level: "B1", sentence: "Bojím sa t___.", correctAnswer: "my", options: ["ma", "me", "my"], explanation: "Genitív po báť sa." },
  { id: "pad-gen-b1-4", type: "fill-blank", category: "Падежи (Genitív)", level: "B1", sentence: "To je kniha môjho brat___.", correctAnswer: "a", explanation: "Brat – Genitív." },
  { id: "pad-gen-b1-5", type: "fill-blank", category: "Падежи (Genitív)", level: "B1", sentence: "Nemám dosť peňaz___.", correctAnswer: "í", explanation: "Peniaze – Genitív plurálu." },
  { id: "pad-gen-b1-6", type: "choose-form", category: "Падежи (Genitív)", level: "B1", sentence: "Bez ___ sa nedá žiť.", correctAnswer: "vody", options: ["voda", "vody", "vodu"], explanation: "Bez vody – Genitív." },
  { id: "pad-gen-b1-7", type: "build-sentence", category: "Падежи (Genitív)", level: "B1", sentence: "Страх темноты.", correctAnswer: "Strach z tmy", words: ["z", "Strach", "tmy"], explanation: "Strach z + Genitív." },

  // ========== Падежи – Datív (B1) – 7 заданий ==========
  { id: "pad-dat-b1-1", type: "fill-blank", category: "Падежи (Datív)", level: "B1", sentence: "Dávam darček sestr___.", correctAnswer: "e", explanation: "Datív." },
  { id: "pad-dat-b1-2", type: "choose-form", category: "Падежи (Datív)", level: "B1", sentence: "Pomôžem kamarát___.", correctAnswer: "ovi", options: ["ovi", "a", "om"], explanation: "Kamarátovi." },
  { id: "pad-dat-b1-3", type: "build-sentence", category: "Падежи (Datív)", level: "B1", sentence: "Я дал книгу учителю.", correctAnswer: "Dal som knihu učiteľovi", words: ["som", "knihu", "Dal", "učiteľovi"], explanation: "Datív komu? učiteľovi." },
  { id: "pad-dat-b1-4", type: "fill-blank", category: "Падежи (Datív)", level: "B1", sentence: "Vďaka teb___ som to zvládol.", correctAnswer: "e", explanation: "Vďaka + Datív." },
  { id: "pad-dat-b1-5", type: "fill-blank", category: "Падежи (Datív)", level: "B1", sentence: "Idem k lekár___.", correctAnswer: "ovi", explanation: "K lekárovi." },
  { id: "pad-dat-b1-6", type: "choose-form", category: "Падежи (Datív)", level: "B1", sentence: "Dôverujem svoj___ priateľovi.", correctAnswer: "mu", options: ["ho", "mu", "om"], explanation: "Dôverovať + Datív." },
  { id: "pad-dat-b1-7", type: "build-sentence", category: "Падежи (Datív)", level: "B1", sentence: "Я помогаю маме.", correctAnswer: "Pomáham mame", words: ["mame", "Pomáham"], explanation: "Pomáhať + Datív." },

  // ========== Падежи – Lokál (B1) – 7 заданий ==========
  { id: "pad-lok-b1-1", type: "fill-blank", category: "Падежи (Lokál)", level: "B1", sentence: "Kniha je na stol___.", correctAnswer: "e", explanation: "Lokál." },
  { id: "pad-lok-b1-2", type: "build-sentence", category: "Падежи (Lokál)", level: "B1", sentence: "Мы живём в Братиславе.", correctAnswer: "Žijeme v Bratislave", words: ["v", "Bratislave", "Žijeme"], explanation: "Lokál." },
  { id: "pad-lok-b1-3", type: "choose-form", category: "Падежи (Lokál)", level: "B1", sentence: "Rozprávali sme ___ o tebe.", correctAnswer: "o", options: ["o", "na", "v"], explanation: "O + Lokál." },
  { id: "pad-lok-b1-4", type: "fill-blank", category: "Падежи (Lokál)", level: "B1", sentence: "Bývam v Bratislav___.", correctAnswer: "e", explanation: "V Bratislave." },
  { id: "pad-lok-b1-5", type: "fill-blank", category: "Падежи (Lokál)", level: "B1", sentence: "V ___ je teplo.", correctAnswer: "izbe", explanation: "V izbe." },
  { id: "pad-lok-b1-6", type: "choose-form", category: "Падежи (Lokál)", level: "B1", sentence: "Premýšľam ___ tebe.", correctAnswer: "o", options: ["o", "na", "v"], explanation: "Premýšľať o + Lokál." },
  { id: "pad-lok-b1-7", type: "build-sentence", category: "Падежи (Lokál)", level: "B1", sentence: "Книга на столе.", correctAnswer: "Kniha je na stole", words: ["je", "na", "stole", "Kniha"], explanation: "Na stole – Lokál." },

  // ========== Падежи – Inštrumentál (B1) – 7 заданий ==========
  { id: "pad-ins-b1-1", type: "fill-blank", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Idem so sestr___.", correctAnswer: "ou", explanation: "So sestrou." },
  { id: "pad-ins-b1-2", type: "choose-form", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Píšem per___.", correctAnswer: "om", options: ["om", "a", "e"], explanation: "Perom." },
  { id: "pad-ins-b1-3", type: "build-sentence", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Я иду с другом.", correctAnswer: "Idem s priateľom", words: ["priateľom", "Idem", "s"], explanation: "S priateľom." },
  { id: "pad-ins-b1-4", type: "fill-blank", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Jazdím aut___.", correctAnswer: "om", explanation: "Autom." },
  { id: "pad-ins-b1-5", type: "fill-blank", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Hovorím so svoj___ šéfom.", correctAnswer: "ím", explanation: "So svojím šéfom." },
  { id: "pad-ins-b1-6", type: "choose-form", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Cestujem vlak___.", correctAnswer: "om", options: ["om", "a", "e"], explanation: "Vlakom." },
  { id: "pad-ins-b1-7", type: "build-sentence", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Я пишу ручкой.", correctAnswer: "Píšem perom", words: ["perom", "Píšem"], explanation: "Perom – Inštrumentál." },

  // ========== Прошедшее время (A2) – расширено до 9 заданий ==========
  { id: "past-a2-1", type: "fill-blank", category: "Прошедшее время", level: "A2", sentence: "Včera som (pracovať) ___.", correctAnswer: "pracoval", explanation: "Pracoval som." },
  { id: "past-a2-2", type: "choose-form", category: "Прошедшее время", level: "A2", sentence: "Ona (vrátiť sa) ___ neskoro.", correctAnswer: "vrátila sa", options: ["vrátil sa", "vrátila sa", "vrátilo sa"], explanation: "Ona sa vrátila." },
  { id: "past-a2-3", type: "build-sentence", category: "Прошедшее время", level: "A2", sentence: "Мы читали книгу.", correctAnswer: "Čítali sme knihu", words: ["sme", "knihu", "Čítali"], explanation: "Čítali sme knihu." },
  { id: "past-a2-4", type: "fill-blank", category: "Прошедшее время", level: "A2", sentence: "Včera (pršať) ___ celý deň.", correctAnswer: "pršalo", explanation: "Neosobné." },
  { id: "past-a2-5", type: "choose-form", category: "Прошедшее время", level: "A2", sentence: "Vy (ísť) ___ včera do školy?", correctAnswer: "ste išli", options: ["ste išli", "sme išli", "išli ste"], explanation: "Vy ste išli." },
  { id: "past-a2-6", type: "fill-blank", category: "Прошедшее время", level: "A2", sentence: "Ona (napísať) ___ list.", correctAnswer: "napísala", explanation: "Napísala." },
  { id: "past-a2-7", type: "choose-form", category: "Прошедшее время", level: "A2", sentence: "Deti ___ sa v parku.", correctAnswer: "hrali", options: ["hral", "hrala", "hrali"], explanation: "Deti sa hrali." },
  { id: "past-a2-8", type: "build-sentence", category: "Прошедшее время", level: "A2", sentence: "Вчера шёл дождь.", correctAnswer: "Včera pršalo", words: ["pršalo", "Včera"], explanation: "Pršalo – minulý čas." },
  { id: "past-a2-9", type: "fill-blank", category: "Прошедшее время", level: "A2", sentence: "My sme (byť) ___ doma.", correctAnswer: "boli", explanation: "My sme boli." },

  // ========== Будущее время (B1) – 9 заданий ==========
  { id: "fut-b1-1", type: "fill-blank", category: "Будущее время", level: "B1", sentence: "Zajtra (ja, byť) ___ študovať.", correctAnswer: "budem", explanation: "Budem študovať." },
  { id: "fut-b1-2", type: "choose-form", category: "Будущее время", level: "B1", sentence: "O rok (my) ___ na vysokú školu.", correctAnswer: "pôjdeme", options: ["pôjdem", "pôjdeš", "pôjdeme"], explanation: "Pôjdeme." },
  { id: "fut-b1-3", type: "build-sentence", category: "Будущее время", level: "B1", sentence: "Я не буду бояться.", correctAnswer: "Nebudem sa báť", words: ["sa", "báť", "Nebudem"], explanation: "Nebudem sa báť." },
  { id: "fut-b1-4", type: "fill-blank", category: "Будущее время", level: "B1", sentence: "O dva dni (my) ___ do Viedne.", correctAnswer: "pocestujeme", explanation: "Pocestujeme." },
  { id: "fut-b1-5", type: "choose-form", category: "Будущее время", level: "B1", sentence: "Zajtra (byť) ___ pekne.", correctAnswer: "bude", options: ["bude", "budú", "budeš"], explanation: "Bude pekne." },
  { id: "fut-b1-6", type: "build-sentence", category: "Будущее время", level: "B1", sentence: "Завтра будет хорошая погода.", correctAnswer: "Zajtra bude pekne", words: ["pekne", "Zajtra", "bude"], explanation: "Bude + príslovka." },
  { id: "fut-b1-7", type: "fill-blank", category: "Будущее время", level: "B1", sentence: "O mesiac (ja) ___ skúšku.", correctAnswer: "urobím", explanation: "Urobím – dokonavý vid." },
  { id: "fut-b1-8", type: "choose-form", category: "Будущее время", level: "B1", sentence: "O rok ___ lepšie po slovensky.", correctAnswer: "budem hovoriť", options: ["hovorím", "budem hovoriť", "hovoril som"], explanation: "Budem hovoriť." },
  { id: "fut-b1-9", type: "fill-blank", category: "Будущее время", level: "B1", sentence: "Čoskoro (prísť) ___ jar.", correctAnswer: "príde", explanation: "Príde." },

  // ========== Модальные глаголы (A2, B1) – 9 заданий ==========
  { id: "mod-a2-1", type: "fill-blank", category: "Модальные глаголы", level: "A2", sentence: "(Ja, môcť) ___ ísť von?", correctAnswer: "Môžem", explanation: "Môžem." },
  { id: "mod-b1-1", type: "choose-form", category: "Модальные глаголы", level: "B1", sentence: "Ty (musieť) ___ sa učiť.", correctAnswer: "musíš", options: ["musím", "musíš", "musí"], explanation: "Musíš." },
  { id: "mod-b1-2", type: "build-sentence", category: "Модальные глаголы", level: "B1", sentence: "Вы должны прийти раньше.", correctAnswer: "Mali by ste prísť skôr", words: ["prísť", "by", "ste", "skôr", "Mali"], explanation: "Mali by ste prísť skôr." },
  { id: "mod-b1-3", type: "fill-blank", category: "Модальные глаголы", level: "B1", sentence: "Ty (smieť) ___ vstúpiť.", correctAnswer: "smieš", explanation: "Smieš." },
  { id: "mod-a2-2", type: "fill-blank", category: "Модальные глаголы", level: "A2", sentence: "Ja (chcieť) ___ čaj.", correctAnswer: "chcem", explanation: "Chcem." },
  { id: "mod-b1-4", type: "choose-form", category: "Модальные глаголы", level: "B1", sentence: "My (môcť) ___ prísť neskôr.", correctAnswer: "môžeme", options: ["môžem", "môžeme", "môžete"], explanation: "Môžeme." },
  { id: "mod-b1-5", type: "fill-blank", category: "Модальные глаголы", level: "B1", sentence: "On (musieť) ___ odísť.", correctAnswer: "musí", explanation: "Musí." },
  { id: "mod-a2-3", type: "choose-form", category: "Модальные глаголы", level: "A2", sentence: "Ja ___ si kúpiť nový mobil.", correctAnswer: "chcem", options: ["chcem", "môžem", "musím"], explanation: "Chcem." },
  { id: "mod-b1-6", type: "build-sentence", category: "Модальные глаголы", level: "B1", sentence: "Ты должен это сделать.", correctAnswer: "Musíš to urobiť", words: ["to", "Musíš", "urobiť"], explanation: "Musíš + infinitív." },

  // ========== Степени сравнения (B1) – 9 заданий ==========
  { id: "stup-b1-1", type: "fill-blank", category: "Степени сравнения", level: "B1", sentence: "Brat je (starý) ___ ako ja.", correctAnswer: "starší", explanation: "Starší." },
  { id: "stup-b1-2", type: "choose-form", category: "Степени сравнения", level: "B1", sentence: "Toto je (dobrý) ___ reštaurácia.", correctAnswer: "najlepšia", options: ["lepšia", "najlepšia", "dobrá"], explanation: "Najlepšia." },
  { id: "stup-b1-3", type: "build-sentence", category: "Степени сравнения", level: "B1", sentence: "Машина быстрее велосипеда.", correctAnswer: "Auto je rýchlejšie ako bicykel", words: ["rýchlejšie", "ako", "je", "bicykel", "Auto"], explanation: "Komparatív + ako." },
  { id: "stup-b1-4", type: "fill-blank", category: "Степени сравнения", level: "B1", sentence: "Toto je (ťažký) ___ problém.", correctAnswer: "ťažší", explanation: "Ťažší." },
  { id: "stup-b1-5", type: "choose-form", category: "Степени сравнения", level: "B1", sentence: "Táto úloha je ___ ako prvá.", correctAnswer: "ľahšia", options: ["ľahká", "ľahšia", "najľahšia"], explanation: "Ľahšia." },
  { id: "stup-b1-6", type: "fill-blank", category: "Степени сравнения", level: "B1", sentence: "Toto je (zaujímavý) ___ film.", correctAnswer: "najzaujímavejší", explanation: "Superlatív." },
  { id: "stup-b1-7", type: "choose-form", category: "Степени сравнения", level: "B1", sentence: "Dnes je ___ ako včera.", correctAnswer: "teplejšie", options: ["teplo", "teplejšie", "najteplejšie"], explanation: "Teplejšie." },
  { id: "stup-b1-8", type: "fill-blank", category: "Степени сравнения", level: "B1", sentence: "Toto je (zlý) ___ výsledok.", correctAnswer: "horší", explanation: "Horší." },
  { id: "stup-b1-9", type: "build-sentence", category: "Степени сравнения", level: "B1", sentence: "Она самая красивая из всех.", correctAnswer: "Ona je najkrajšia zo všetkých", words: ["zo", "najkrajšia", "všetkých", "je", "Ona"], explanation: "Najkrajšia – superlatív." },

  // ========== Местоимения (A2, B1) – 9 заданий ==========
  { id: "pron-a2-1", type: "fill-blank", category: "Местоимения", level: "A2", sentence: "To je (môj) ___ dom.", correctAnswer: "môj", explanation: "Môj." },
  { id: "pron-b1-1", type: "choose-form", category: "Местоимения", level: "B1", sentence: "Vidím (on) ___.", correctAnswer: "ho", options: ["ho", "mu", "jeho"], explanation: "Ho." },
  { id: "pron-b1-2", type: "build-sentence", category: "Местоимения", level: "B1", sentence: "Дай мне это.", correctAnswer: "Daj mi to", words: ["to", "Daj", "mi"], explanation: "Daj mi to." },
  { id: "pron-b1-3", type: "fill-blank", category: "Местоимения", level: "B1", sentence: "Páči sa mi (tvoj) ___ sukňa.", correctAnswer: "tvoja", explanation: "Tvoja." },
  { id: "pron-a2-2", type: "fill-blank", category: "Местоимения", level: "A2", sentence: "To je (tvoj) ___ kniha.", correctAnswer: "tvoja", explanation: "Tvoja kniha." },
  { id: "pron-b1-4", type: "choose-form", category: "Местоимения", level: "B1", sentence: "Dám to (ty) ___.", correctAnswer: "tebe", options: ["teba", "tebe", "tebou"], explanation: "Datív tebe." },
  { id: "pron-b1-5", type: "fill-blank", category: "Местоимения", level: "B1", sentence: "Vidím (ona) ___.", correctAnswer: "ju", explanation: "Ju – akuzatív." },
  { id: "pron-a2-3", type: "choose-form", category: "Местоимения", level: "A2", sentence: "To je ___ dom.", correctAnswer: "jeho", options: ["jeho", "jej", "ich"], explanation: "Jeho dom." },
  { id: "pron-b1-6", type: "build-sentence", category: "Местоимения", level: "B1", sentence: "Я дал ему книгу.", correctAnswer: "Dal som mu knihu", words: ["mu", "som", "knihu", "Dal"], explanation: "Datív mu." },

  // ========== Союзы (B1, B2) – 9 заданий ==========
  { id: "spoj-b1-1", type: "fill-blank", category: "Союзы", level: "B1", sentence: "Nepríde, ___ je chorý.", correctAnswer: "pretože", explanation: "Pretože." },
  { id: "spoj-b2-1", type: "choose-form", category: "Союзы", level: "B2", sentence: "___ prší, ostanem doma.", correctAnswer: "Ak", options: ["Ak", "Keby", "Keď"], explanation: "Ak." },
  { id: "spoj-b2-2", type: "build-sentence", category: "Союзы", level: "B2", sentence: "Чем больше читаешь, тем больше знаешь.", correctAnswer: "Čím viac čítaš, tým viac vieš", words: ["tým", "viac", "čítaš,", "Čím", "viac", "vieš"], explanation: "Čím... tým." },
  { id: "spoj-b1-2", type: "fill-blank", category: "Союзы", level: "B1", sentence: "Počkám, ___ sa vrátiš.", correctAnswer: "kým", explanation: "Kým." },
  { id: "spoj-b2-3", type: "choose-form", category: "Союзы", level: "B2", sentence: "___ som unavený, pôjdem spať.", correctAnswer: "Keďže", options: ["Keďže", "Keby", "Hoci"], explanation: "Keďže." },
  { id: "spoj-b2-4", type: "fill-blank", category: "Союзы", level: "B2", sentence: "Išiel von, ___ pršalo.", correctAnswer: "hoci", explanation: "Hoci." },
  { id: "spoj-b1-3", type: "build-sentence", category: "Союзы", level: "B1", sentence: "Я останусь дома, потому что идёт дождь.", correctAnswer: "Ostanem doma, lebo prší", words: ["doma,", "lebo", "Ostanem", "prší"], explanation: "Lebo – потому что." },
  { id: "spoj-b2-5", type: "fill-blank", category: "Союзы", level: "B2", sentence: "___ sa vrátiš, zavolám ti.", correctAnswer: "Len čo", explanation: "Len čo." },
  { id: "spoj-b1-4", type: "choose-form", category: "Союзы", level: "B1", sentence: "Je chorý, ___ nepríde.", correctAnswer: "preto", options: ["preto", "pretože", "a"], explanation: "Preto." },

  // ========== Возвратные глаголы (A2, B1) – 9 заданий ==========
  { id: "ref-a2-1", type: "fill-blank", category: "Возвратные глаголы", level: "A2", sentence: "Umývam ___ každé ráno.", correctAnswer: "sa", explanation: "Sa." },
  { id: "ref-b1-1", type: "choose-form", category: "Возвратные глаголы", level: "B1", sentence: "Kúpil som ___ nový telefón.", correctAnswer: "si", options: ["sa", "si", "seba"], explanation: "Si." },
  { id: "ref-b1-2", type: "build-sentence", category: "Возвратные глаголы", level: "B1", sentence: "Я помню твоё имя.", correctAnswer: "Pamätám si tvoje meno", words: ["si", "tvoje", "Pamätám", "meno"], explanation: "Pamätať si." },
  { id: "ref-a2-2", type: "fill-blank", category: "Возвратные глаголы", level: "A2", sentence: "Ona sa ___ každý deň.", correctAnswer: "češe", explanation: "Češe sa." },
  { id: "ref-b1-3", type: "choose-form", category: "Возвратные глаголы", level: "B1", sentence: "My sme ___ nové auto.", correctAnswer: "kúpili si", options: ["kúpili sme", "kúpili si", "kúpili sa"], explanation: "Kúpili si." },
  { id: "ref-b1-4", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "Nesmiem ___ sťažovať.", correctAnswer: "sa", explanation: "Sťažovať sa." },
  { id: "ref-a2-3", type: "build-sentence", category: "Возвратные глаголы", level: "A2", sentence: "Я умываюсь каждый день.", correctAnswer: "Umývam sa každý deň", words: ["sa", "deň", "každý", "Umývam"], explanation: "Umývať sa." },
  { id: "ref-b1-5", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "Musím ___ pripraviť.", correctAnswer: "sa", explanation: "Pripraviť sa." },
  { id: "ref-a2-4", type: "choose-form", category: "Возвратные глаголы", level: "A2", sentence: "On ___ volá Peter.", correctAnswer: "sa", options: ["sa", "si"], explanation: "Volá sa." },

  // ========== Глаголы движения с приставками (B1, B2) – 9 заданий ==========
  { id: "poh-b1-1", type: "fill-blank", category: "Глаголы движения с приставками", level: "B1", sentence: "Vystúpil som z ___.", correctAnswer: "autobusu", explanation: "Z autobusu." },
  { id: "poh-b2-1", type: "choose-form", category: "Глаголы движения с приставками", level: "B2", sentence: "Dobehol som až do ___.", correctAnswer: "cieľa", options: ["cieľu", "cieľom", "cieľa"], explanation: "Do cieľa." },
  { id: "poh-b2-2", type: "build-sentence", category: "Глаголы движения с приставками", level: "B2", sentence: "Он перешёл через улицу.", correctAnswer: "Prešiel cez ulicu", words: ["cez", "Prešiel", "ulicu"], explanation: "Prejsť cez." },
  { id: "poh-b1-2", type: "fill-blank", category: "Глаголы движения с приставками", level: "B1", sentence: "Odišiel som ___ domu.", correctAnswer: "z", explanation: "Z domu." },
  { id: "poh-b2-3", type: "fill-blank", category: "Глаголы движения с приставками", level: "B2", sentence: "Vybehol som ___ autobus.", correctAnswer: "na", explanation: "Na autobus." },
  { id: "poh-b2-4", type: "choose-form", category: "Глаголы движения с приставками", level: "B2", sentence: "Preplávali sme cez ___.", correctAnswer: "jazero", options: ["jazeru", "jazerom", "jazero"], explanation: "Cez jazero." },
  { id: "poh-b1-3", type: "build-sentence", category: "Глаголы движения с приставками", level: "B1", sentence: "Я вышел из автобуса.", correctAnswer: "Vystúpil som z autobusu", words: ["z", "som", "autobusu", "Vystúpil"], explanation: "Vystúpiť z + Genitív." },
  { id: "poh-b2-5", type: "fill-blank", category: "Глаголы движения с приставками", level: "B2", sentence: "Prešli sme ___ park.", correctAnswer: "cez", explanation: "Cez park." },
  { id: "poh-b2-6", type: "choose-form", category: "Глаголы движения с приставками", level: "B2", sentence: "Došiel som až ___ konca.", correctAnswer: "do", options: ["do", "k", "na"], explanation: "Do konca." },

  // ========== Видовые пары (B1) – 9 заданий ==========
  { id: "vid-b1-1", type: "choose-form", category: "Видовые пары", level: "B1", sentence: "Musím (písať / napísať) list.", correctAnswer: "napísať", options: ["písať", "napísať"], explanation: "Dokonavý." },
  { id: "vid-b1-2", type: "fill-blank", category: "Видовые пары", level: "B1", sentence: "Chcem (čítať) ___ tú knihu.", correctAnswer: "prečítať", explanation: "Prečítať." },
  { id: "vid-b1-3", type: "build-sentence", category: "Видовые пары", level: "B1", sentence: "Она хочет выпить воды.", correctAnswer: "Ona chce vypiť vodu", words: ["vodu", "chce", "vypiť", "Ona"], explanation: "Vypiť." },
  { id: "vid-b1-4", type: "fill-blank", category: "Видовые пары", level: "B1", sentence: "Začínam (rozumieť) ___ po slovensky.", correctAnswer: "rozumieť", explanation: "Rozumieť – nedokonavý." },
  { id: "vid-b1-5", type: "fill-blank", category: "Видовые пары", level: "B1", sentence: "Musím (otvárať) ___ okno.", correctAnswer: "otvoriť", explanation: "Otvoriť." },
  { id: "vid-b1-6", type: "choose-form", category: "Видовые пары", level: "B1", sentence: "Chceš (jesť) ___ tortu?", correctAnswer: "zjesť", options: ["jesť", "zjesť"], explanation: "Zjesť." },
  { id: "vid-b1-7", type: "build-sentence", category: "Видовые пары", level: "B1", sentence: "Я должен закрыть дверь.", correctAnswer: "Musím zavrieť dvere", words: ["zavrieť", "Musím", "dvere"], explanation: "Zavrieť – dokonavý." },
  { id: "vid-b1-8", type: "fill-blank", category: "Видовые пары", level: "B1", sentence: "Každý deň (čítať) ___ noviny.", correctAnswer: "čítam", explanation: "Čítať – nedokonavý." },
  { id: "vid-b1-9", type: "choose-form", category: "Видовые пары", level: "B1", sentence: "Už som to (robiť) ___.", correctAnswer: "urobil", options: ["robil", "urobil"], explanation: "Urobiť – dokonavý." },

  // ========== Императив (A2, B1) – 9 заданий ==========
  { id: "imp-a2-1", type: "fill-blank", category: "Императив", level: "A2", sentence: "___ sem! (prísť)", correctAnswer: "Poď", explanation: "Poď." },
  { id: "imp-b1-1", type: "choose-form", category: "Императив", level: "B1", sentence: "___ hluk!", correctAnswer: "Nerob", options: ["Nerob", "Nerobte", "Nerobme"], explanation: "Nerob." },
  { id: "imp-b1-2", type: "build-sentence", category: "Императив", level: "B1", sentence: "Пойдём в кино!", correctAnswer: "Poďme do kina", words: ["do", "Poďme", "kina"], explanation: "Poďme." },
  { id: "imp-a2-2", type: "fill-blank", category: "Императив", level: "A2", sentence: "___ mi, prosím. (pomôcť)", correctAnswer: "Pomôž", explanation: "Pomôž." },
  { id: "imp-b1-3", type: "choose-form", category: "Императив", level: "B1", sentence: "___ sa! (báť)", correctAnswer: "Neboj", options: ["Boj", "Neboj", "Bojte"], explanation: "Neboj." },
  { id: "imp-b1-4", type: "fill-blank", category: "Императив", level: "B1", sentence: "___ mi to! (ukázať)", correctAnswer: "Ukáž", explanation: "Ukáž." },
  { id: "imp-a2-3", type: "build-sentence", category: "Императив", level: "A2", sentence: "Подождите минуту!", correctAnswer: "Počkajte chvíľu", words: ["chvíľu", "Počkajte"], explanation: "Počkajte – vy." },
  { id: "imp-b1-5", type: "fill-blank", category: "Императив", level: "B1", sentence: "___ si ruky! (umyť)", correctAnswer: "Umy", explanation: "Umy." },
  { id: "imp-a2-4", type: "choose-form", category: "Императив", level: "A2", sentence: "___ dvere! (zavrieť)", correctAnswer: "Zavri", options: ["Zavri", "Zavrite", "Zatvor"], explanation: "Zavri." },

  // ========== Отрицание (A2, B1) – 9 заданий ==========
  { id: "neg-a2-1", type: "fill-blank", category: "Отрицание", level: "A2", sentence: "Ja ___ kupujem.", correctAnswer: "ne", explanation: "Ne." },
  { id: "neg-b1-1", type: "choose-form", category: "Отрицание", level: "B1", sentence: "___ neprišiel.", correctAnswer: "Nikto", options: ["Nikto", "Nikdy", "Nič"], explanation: "Nikto." },
  { id: "neg-b1-2", type: "build-sentence", category: "Отрицание", level: "B1", sentence: "Я ничего не знаю.", correctAnswer: "Neviem nič", words: ["nič", "Neviem"], explanation: "Neviem nič." },
  { id: "neg-a2-2", type: "fill-blank", category: "Отрицание", level: "A2", sentence: "Oni ___ prišli.", correctAnswer: "ne", explanation: "Neprišli." },
  { id: "neg-b1-3", type: "choose-form", category: "Отрицание", level: "B1", sentence: "___ sa nestalo.", correctAnswer: "Nič", options: ["Nič", "Nikto", "Nikdy"], explanation: "Nič." },
  { id: "neg-b1-4", type: "fill-blank", category: "Отрицание", level: "B1", sentence: "Nikdy ___ neklamem.", correctAnswer: "ne", explanation: "Dvojitý zápor." },
  { id: "neg-a2-3", type: "build-sentence", category: "Отрицание", level: "A2", sentence: "Я не голоден.", correctAnswer: "Nie som hladný", words: ["som", "hladný", "Nie"], explanation: "Nie som." },
  { id: "neg-b1-5", type: "fill-blank", category: "Отрицание", level: "B1", sentence: "___ tu nie je.", correctAnswer: "Nikde", explanation: "Nikde." },
  { id: "neg-b1-6", type: "choose-form", category: "Отрицание", level: "B1", sentence: "___ som tam nebol.", correctAnswer: "Nikdy", options: ["Nikdy", "Nikto", "Nič"], explanation: "Nikdy." },

  // ========== Условные предложения (B1, B2, C1) – 9 заданий ==========
  { id: "cond-b1-1", type: "fill-blank", category: "Условные предложения", level: "B1", sentence: "___ prší, ostanem doma.", correctAnswer: "Ak", explanation: "Ak." },
  { id: "cond-b2-1", type: "choose-form", category: "Условные предложения", level: "B2", sentence: "Keby som ___ peniaze, kúpil by som auto.", correctAnswer: "mal", options: ["mám", "mal", "budem mať"], explanation: "Keby som mal." },
  { id: "cond-c1-1", type: "build-sentence", category: "Условные предложения", level: "C1", sentence: "Если бы не ты, не знаю, что бы я делал.", correctAnswer: "Keby nebolo teba, neviem, čo by som robil", words: ["neviem,", "čo", "teba,", "by", "som", "nebolo", "Keby", "robil"], explanation: "Keby nebolo teba." },
  { id: "cond-b1-2", type: "fill-blank", category: "Условные предложения", level: "B1", sentence: "Ak ___ čas, prídem.", correctAnswer: "budem mať", explanation: "Budem mať." },
  { id: "cond-b2-2", type: "choose-form", category: "Условные предложения", level: "B2", sentence: "Keby sme ___ vedeli, povedali by sme.", correctAnswer: "o tom", options: ["o tom", "o to", "o tomuto"], explanation: "Vedieť o + Lokál." },
  { id: "cond-c1-2", type: "build-sentence", category: "Условные предложения", level: "C1", sentence: "Если бы я мог, я бы помог.", correctAnswer: "Keby som mohol, pomohol by som", words: ["mohol,", "pomohol", "som", "by", "Keby"], explanation: "Keby som mohol." },
  { id: "cond-b1-3", type: "fill-blank", category: "Условные предложения", level: "B1", sentence: "___ bude pekne, pôjdeme von.", correctAnswer: "Ak", explanation: "Ak – reálna podmienka." },
  { id: "cond-b2-3", type: "choose-form", category: "Условные предложения", level: "B2", sentence: "Keby som ___ bohatý, cestoval by som.", correctAnswer: "bol", options: ["som", "bol", "budem"], explanation: "Keby som bol." },
  { id: "cond-c1-3", type: "fill-blank", category: "Условные предложения", level: "C1", sentence: "Keby ___ nepršalo, išli by sme na výlet.", correctAnswer: "včera", explanation: "Keby včera nepršalo." },

  // ========== Сложные союзы (B2, C1) – 9 заданий ==========
  { id: "comp-b2-1", type: "fill-blank", category: "Сложные союзы", level: "B2", sentence: "Išiel von, ___ pršalo.", correctAnswer: "hoci", explanation: "Hoci." },
  { id: "comp-c1-1", type: "choose-form", category: "Сложные союзы", level: "C1", sentence: "Napriek ___, že meškal, prišiel.", correctAnswer: "tomu", options: ["tomu", "tom", "to"], explanation: "Napriek tomu, že." },
  { id: "comp-c1-2", type: "build-sentence", category: "Сложные союзы", level: "C1", sentence: "Независимо от того, что случится, я с тобой.", correctAnswer: "Bez ohľadu na to, čo sa stane, som s tebou", words: ["sa", "stane,", "na", "som", "s", "tebou", "Bez", "ohľadu", "to,", "čo"], explanation: "Bez ohľadu na to." },
  { id: "comp-b2-2", type: "fill-blank", category: "Сложные союзы", level: "B2", sentence: "___ som unavený, dokončím to.", correctAnswer: "Hoci", explanation: "Hoci." },
  { id: "comp-c1-3", type: "choose-form", category: "Сложные союзы", level: "C1", sentence: "Bez ___, že by som vedel.", correctAnswer: "ohľadu na to", options: ["ohľadu na to", "ohľadom toho", "ohľadu toho"], explanation: "Bez ohľadu na to." },
  { id: "comp-b2-3", type: "fill-blank", category: "Сложные союзы", level: "B2", sentence: "Len ___ príde, zavolám ti.", correctAnswer: "čo", explanation: "Len čo." },
  { id: "comp-c1-4", type: "build-sentence", category: "Сложные союзы", level: "C1", sentence: "Несмотря на дождь, мы пошли гулять.", correctAnswer: "Napriek dažďu sme išli na prechádzku", words: ["na", "sme", "dažďu", "išli", "Napriek", "prechádzku"], explanation: "Napriek + Datív." },
  { id: "comp-b2-4", type: "choose-form", category: "Сложные союзы", level: "B2", sentence: "Počkám, ___ sa vrátiš.", correctAnswer: "kým", options: ["kým", "keď", "až"], explanation: "Kým." },
  { id: "comp-b2-5", type: "fill-blank", category: "Сложные союзы", level: "B2", sentence: "___ viac sa učíš, ___ viac vieš.", correctAnswer: "Čím, tým", explanation: "Čím... tým." },
  // ========== Вопросительные слова (A1) – 8 заданий ==========
  { id: "q-a1-1", type: "fill-blank", category: "Вопросительные слова", level: "A1", sentence: "___ sa voláš? (Как тебя зовут?)", correctAnswer: "Ako", explanation: "Ako – как." },
  { id: "q-a1-2", type: "choose-form", category: "Вопросительные слова", level: "A1", sentence: "___ je tvoje meno?", correctAnswer: "Aké", options: ["Ako", "Aké", "Kto"], explanation: "Aké – какое." },
  { id: "q-a1-3", type: "fill-blank", category: "Вопросительные слова", level: "A1", sentence: "___ bývaš? (Где ты живёшь?)", correctAnswer: "Kde", explanation: "Kde – где." },
  { id: "q-a1-4", type: "build-sentence", category: "Вопросительные слова", level: "A1", sentence: "Откуда ты? (Odkiaľ si?)", correctAnswer: "Odkiaľ si?", words: ["si?", "Odkiaľ"], explanation: "Odkiaľ – откуда." },
  { id: "q-a1-5", type: "fill-blank", category: "Вопросительные слова", level: "A1", sentence: "___ je to? (Кто это?)", correctAnswer: "Kto", explanation: "Kto – кто." },
  { id: "q-a1-6", type: "choose-form", category: "Вопросительные слова", level: "A1", sentence: "___ to stojí?", correctAnswer: "Koľko", options: ["Koľko", "Kde", "Čo"], explanation: "Koľko – сколько." },
  { id: "q-a1-7", type: "fill-blank", category: "Вопросительные слова", level: "A1", sentence: "___ je tvoj obľúbený film? (Какой твой любимый фильм?)", correctAnswer: "Aký", explanation: "Aký – какой." },
  { id: "q-a1-8", type: "build-sentence", category: "Вопросительные слова", level: "A1", sentence: "Что это?", correctAnswer: "Čo je to?", words: ["je", "Čo", "to?"], explanation: "Čo – что." },

  // ========== Множественное число существительных (A1) – 8 заданий ==========
  { id: "pl-a1-1", type: "fill-blank", category: "Множественное число", level: "A1", sentence: "Jeden dom, dva ___.", correctAnswer: "domy", explanation: "Dom → domy." },
  { id: "pl-a1-2", type: "choose-form", category: "Множественное число", level: "A1", sentence: "Jedna kniha, dve ___.", correctAnswer: "knihy", options: ["knihy", "knihy", "kníh"], explanation: "Kniha → knihy." },
  { id: "pl-a1-3", type: "fill-blank", category: "Множественное число", level: "A1", sentence: "Jedno auto, dve ___.", correctAnswer: "autá", explanation: "Auto → autá." },
  { id: "pl-a1-4", type: "build-sentence", category: "Множественное число", level: "A1", sentence: "Три стула. (Tri stoličky)", correctAnswer: "Tri stoličky", words: ["stoličky", "Tri"], explanation: "Stolička → stoličky." },
  { id: "pl-a1-5", type: "fill-blank", category: "Множественное число", level: "A1", sentence: "Mám dvoch ___ (брат).", correctAnswer: "bratov", explanation: "Brat → bratov (одуш.)." },
  { id: "pl-a1-6", type: "choose-form", category: "Множественное число", level: "A1", sentence: "Päť ___ (dieťa).", correctAnswer: "detí", options: ["detí", "dieťat", "deťom"], explanation: "Dieťa → detí." },
  { id: "pl-a1-7", type: "fill-blank", category: "Множественное число", level: "A1", sentence: "Dve ___ (žena).", correctAnswer: "ženy", explanation: "Žena → ženy." },
  { id: "pl-a1-8", type: "build-sentence", category: "Множественное число", level: "A1", sentence: "У меня две собаки.", correctAnswer: "Mám dvoch psov", words: ["psov", "dvoch", "Mám"], explanation: "Pes → psy/psov." },

  // ========== Предлоги места (A1) – 8 заданий ==========
  { id: "prep-a1-1", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Kniha je ___ stole.", correctAnswer: "na", explanation: "Na – на." },
  { id: "prep-a1-2", type: "choose-form", category: "Предлоги места", level: "A1", sentence: "Mačka je ___ stolom.", correctAnswer: "pod", options: ["pod", "na", "v"], explanation: "Pod – под." },
  { id: "prep-a1-3", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Bývam ___ Bratislave.", correctAnswer: "v", explanation: "V – в (город)." },
  { id: "prep-a1-4", type: "build-sentence", category: "Предлоги места", level: "A1", sentence: "Я перед домом.", correctAnswer: "Som pred domom", words: ["pred", "Som", "domom"], explanation: "Pred + Inštrumentál." },
  { id: "prep-a1-5", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Auto stojí ___ domom.", correctAnswer: "za", explanation: "Za – за." },
  { id: "prep-a1-6", type: "choose-form", category: "Предлоги места", level: "A1", sentence: "Som ___ škole.", correctAnswer: "v", options: ["v", "na", "do"], explanation: "V škole – в школе." },
  { id: "prep-a1-7", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Pes je ___ stole a skriňou.", correctAnswer: "medzi", explanation: "Medzi – между." },
  { id: "prep-a1-8", type: "build-sentence", category: "Предлоги места", level: "A1", sentence: "Книга на столе.", correctAnswer: "Kniha je na stole", words: ["je", "na", "stole", "Kniha"], explanation: "Na + Lokál." },

  // ========== Настоящее время правильных глаголов (A1) – 10 заданий ==========
  { id: "pres-a1-1", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "Ja (pracovať) ___ v kancelárii.", correctAnswer: "pracujem", explanation: "-jem." },
  { id: "pres-a1-2", type: "choose-form", category: "Настоящее время", level: "A1", sentence: "Ty (bývať) ___ v dome?", correctAnswer: "bývaš", options: ["bývam", "bývaš", "býva"], explanation: "-aš." },
  { id: "pres-a1-3", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "Ona (čítať) ___ knihu.", correctAnswer: "číta", explanation: "-a." },
  { id: "pres-a1-4", type: "build-sentence", category: "Настоящее время", level: "A1", sentence: "Мы играем в футбол.", correctAnswer: "My hráme futbal", words: ["futbal", "My", "hráme"], explanation: "-áme." },
  { id: "pres-a1-5", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "Vy (počúvať) ___ hudbu.", correctAnswer: "počúvate", explanation: "-ate." },
  { id: "pres-a1-6", type: "choose-form", category: "Настоящее время", level: "A1", sentence: "Oni (cestovať) ___ často.", correctAnswer: "cestujú", options: ["cestujú", "cestujeme", "cestujete"], explanation: "-ujú." },
  { id: "pres-a1-7", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "Ja (žiť) ___ na Slovensku.", correctAnswer: "žijem", explanation: "Žiť → žijem." },
  { id: "pres-a1-8", type: "build-sentence", category: "Настоящее время", level: "A1", sentence: "Она готовит ужин.", correctAnswer: "Ona varí večeru", words: ["večeru", "Ona", "varí"], explanation: "-í." },
  { id: "pres-a1-9", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "My (piť) ___ kávu.", correctAnswer: "pijeme", explanation: "Piť → pijeme." },
  { id: "pres-a1-10", type: "choose-form", category: "Настоящее время", level: "A1", sentence: "Deti (hrať sa) ___ v parku.", correctAnswer: "hrajú sa", options: ["hrá sa", "hrajú sa", "hrajú"], explanation: "Hrajú sa." },

  // ========== Личные местоимения (A1) – 6 заданий ==========
  { id: "pers-a1-1", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ som študent. (я)", correctAnswer: "Ja", explanation: "Ja." },
  { id: "pers-a1-2", type: "choose-form", category: "Личные местоимения", level: "A1", sentence: "___ je učiteľka. (она)", correctAnswer: "Ona", options: ["On", "Ona", "Ono"], explanation: "Ona." },
  { id: "pers-a1-3", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ sme priatelia. (мы)", correctAnswer: "My", explanation: "My." },
  { id: "pers-a1-4", type: "build-sentence", category: "Личные местоимения", level: "A1", sentence: "Они дома.", correctAnswer: "Oni sú doma", words: ["sú", "doma", "Oni"], explanation: "Oni – они (муж.)." },
  { id: "pers-a1-5", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ ste unavení. (вы)", correctAnswer: "Vy", explanation: "Vy." },
  { id: "pers-a1-6", type: "choose-form", category: "Личные местоимения", level: "A1", sentence: "___ je pekné. (оно)", correctAnswer: "Ono", options: ["Ona", "Ono", "To"], explanation: "Ono." },

  // ========== Указательные местоимения (A1) – 6 заданий ==========
  { id: "dem-a1-1", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ je môj dom. (этот)", correctAnswer: "Toto", explanation: "Toto – это (ср.род)." },
  { id: "dem-a1-2", type: "choose-form", category: "Указательные местоимения", level: "A1", sentence: "___ auto je nové.", correctAnswer: "Toto", options: ["Tento", "Táto", "Toto"], explanation: "Toto auto." },
  { id: "dem-a1-3", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ kniha je stará. (эта)", correctAnswer: "Táto", explanation: "Táto – эта." },
  { id: "dem-a1-4", type: "build-sentence", category: "Указательные местоимения", level: "A1", sentence: "Этот парень высокий.", correctAnswer: "Tento chlapec je vysoký", words: ["vysoký", "chlapec", "je", "Tento"], explanation: "Tento – этот (муж.)." },
  { id: "dem-a1-5", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ ženy sú v práci. (те)", correctAnswer: "Tie", explanation: "Tie – те." },
  { id: "dem-a1-6", type: "choose-form", category: "Указательные местоимения", level: "A1", sentence: "___ domy sú veľké.", correctAnswer: "Tie", options: ["Tieto", "Tie", "Tá"], explanation: "Tie domy." },

  // ========== Притяжательные прилагательные (A1) – 7 заданий ==========
  { id: "poss-a1-1", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ mama. (моя)", correctAnswer: "moja", explanation: "Moja mama." },
  { id: "poss-a1-2", type: "choose-form", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ otec. (твой)", correctAnswer: "tvoj", options: ["tvoj", "tvoja", "tvoje"], explanation: "Tvoj otec." },
  { id: "poss-a1-3", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ auto. (его)", correctAnswer: "jeho", explanation: "Jeho – его." },
  { id: "poss-a1-4", type: "build-sentence", category: "Притяжательные прилагательные", level: "A1", sentence: "Это её дом.", correctAnswer: "To je jej dom", words: ["je", "dom", "jej", "To"], explanation: "Jej – её." },
  { id: "poss-a1-5", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ kniha. (наша)", correctAnswer: "naša", explanation: "Naša kniha." },
  { id: "poss-a1-6", type: "choose-form", category: "Притяжательные прилагательные", level: "A1", sentence: "To sú ___ deti. (ваши)", correctAnswer: "vaše", options: ["vaša", "vaše", "váš"], explanation: "Vaše deti." },
  { id: "poss-a1-7", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ škola. (их)", correctAnswer: "ich", explanation: "Ich – их (неизм.)." },

  // ========== Цифры и числительные (A1) – 6 заданий ==========
  { id: "num-a1-1", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Mám ___ rokov. (25)", correctAnswer: "dvadsaťpäť", explanation: "25 – dvadsaťpäť." },
  { id: "num-a1-2", type: "choose-form", category: "Числительные", level: "A1", sentence: "Bývam na ___ poschodí. (первый)", correctAnswer: "prvom", options: ["prvom", "druhom", "tretím"], explanation: "Prvom – первый." },
  { id: "num-a1-3", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Koľko je ___ plus dva? (3)", correctAnswer: "tri", explanation: "Tri." },
  { id: "num-a1-4", type: "build-sentence", category: "Числительные", level: "A1", sentence: "Мне 30 лет.", correctAnswer: "Mám tridsať rokov", words: ["rokov", "tridsať", "Mám"], explanation: "Vek." },
  { id: "num-a1-5", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Dnes je ___ máj. (1.)", correctAnswer: "prvý", explanation: "Prvý máj." },
  { id: "num-a1-6", type: "choose-form", category: "Числительные", level: "A1", sentence: "Mám ___ sestier. (2)", correctAnswer: "dve", options: ["dva", "dve", "dvaja"], explanation: "Dve sestry." },
    // ========== Различие "vedieť" и "poznať" (A2) ==========
  { id: "ved-a2-1", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Ja ___ po slovensky. (умею говорить)", correctAnswer: "viem", explanation: "Vedieť – умение." },
  { id: "ved-a2-2", type: "choose-form", category: "Vedieť / Poznať", level: "A2", sentence: "Ty ___ môjho brata?", correctAnswer: "poznáš", options: ["vieš", "poznáš", "rozumieš"], explanation: "Poznať – быть знакомым." },
  { id: "ved-a2-3", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Ona ___ toto mesto.", correctAnswer: "pozná", explanation: "Pozná mesto." },
  { id: "ved-a2-4", type: "build-sentence", category: "Vedieť / Poznať", level: "A2", sentence: "Я знаю, где это.", correctAnswer: "Viem, kde to je", words: ["to", "kde", "je", "Viem,"], explanation: "Vedieť + vedľajšia veta." },
  { id: "ved-a2-5", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "My ___ dobrú reštauráciu.", correctAnswer: "poznáme", explanation: "Poznať." },
  { id: "ved-a2-6", type: "choose-form", category: "Vedieť / Poznať", level: "A2", sentence: "Vy ___ o tom?", correctAnswer: "viete", options: ["poznáte", "viete", "rozumiete"], explanation: "Vedieť o + Lokál." },
  { id: "ved-a2-7", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Oni ___ hrať tenis.", correctAnswer: "vedia", explanation: "Vedia – они умеют." },

  // ========== Союзы "a, ale, alebo" (A2) ==========
  { id: "conj-a2-1", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Mám brata ___ sestru.", correctAnswer: "a", explanation: "A – и." },
  { id: "conj-a2-2", type: "choose-form", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Chceš čaj ___ kávu?", correctAnswer: "alebo", options: ["a", "ale", "alebo"], explanation: "Alebo – или." },
  { id: "conj-a2-3", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Je unavený, ___ ide spať.", correctAnswer: "a", explanation: "A." },
  { id: "conj-a2-4", type: "build-sentence", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Я хочу пойти, но не могу.", correctAnswer: "Chcem ísť, ale nemôžem", words: ["ale", "nemôžem", "ísť,", "Chcem"], explanation: "Ale – но." },
  { id: "conj-a2-5", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Kúpiš si tričko ___ nohavice?", correctAnswer: "alebo", explanation: "Alebo." },

  // ========== Наречия частоты (A2) ==========
  { id: "adv-a2-1", type: "fill-blank", category: "Наречия частоты", level: "A2", sentence: "___ raňajkujem o siedmej. (обычно)", correctAnswer: "Zvyčajne", explanation: "Zvyčajne." },
  { id: "adv-a2-2", type: "choose-form", category: "Наречия частоты", level: "A2", sentence: "Chodím do kina ___.", correctAnswer: "niekedy", options: ["nikdy", "niekedy", "vždy"], explanation: "Niekedy – иногда." },
  { id: "adv-a2-3", type: "fill-blank", category: "Наречия частоты", level: "A2", sentence: "On ___ mešká. (никогда)", correctAnswer: "nikdy", explanation: "Nikdy." },
  { id: "adv-a2-4", type: "build-sentence", category: "Наречия частоты", level: "A2", sentence: "Я всегда пью кофе утром.", correctAnswer: "Vždy pijem kávu ráno", words: ["ráno", "kávu", "Vždy", "pijem"], explanation: "Vždy – всегда." },
  { id: "adv-a2-5", type: "fill-blank", category: "Наречия частоты", level: "A2", sentence: "___ chodíme na výlety. (часто)", correctAnswer: "Často", explanation: "Často." },
  { id: "adv-a2-6", type: "choose-form", category: "Наречия частоты", level: "A2", sentence: "___ športujem.", correctAnswer: "Pravidelne", options: ["Pravidelne", "Nikdy", "Včera"], explanation: "Pravidelne – регулярно." },

  // ========== Предлоги направления (A2) ==========
  { id: "dir-a2-1", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Idem ___ školy. (в)", correctAnswer: "do", explanation: "Do + Genitív." },
  { id: "dir-a2-2", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Ideme ___ lekára.", correctAnswer: "k", options: ["k", "do", "na"], explanation: "K + Datív." },
  { id: "dir-a2-3", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Poď ___ mnou.", correctAnswer: "so", explanation: "So mnou – со мной." },
  { id: "dir-a2-4", type: "build-sentence", category: "Предлоги направления", level: "A2", sentence: "Я еду в Прагу.", correctAnswer: "Idem do Prahy", words: ["Prahy", "do", "Idem"], explanation: "Do + Genitív (mestá)." },
  { id: "dir-a2-5", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Vráť sa ___ hodinu.", correctAnswer: "o", explanation: "O hodinu – через час." },
  { id: "dir-a2-6", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Idem ___ poštu.", correctAnswer: "na", options: ["na", "do", "k"], explanation: "Na poštu – на почту." },

  // ========== Порядковые числительные (A2) ==========
  { id: "ord-a2-1", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Bývam na ___ poschodí. (первый)", correctAnswer: "prvom", explanation: "Prvom." },
  { id: "ord-a2-2", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Dnes je ___ máj. (1.)", correctAnswer: "prvý", options: ["prvý", "druhý", "tretí"], explanation: "Prvý." },
  { id: "ord-a2-3", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Môj ___ brat sa volá Ján. (второй)", correctAnswer: "druhý", explanation: "Druhý." },
  { id: "ord-a2-4", type: "build-sentence", category: "Числительные (порядковые)", level: "A2", sentence: "Я родился 3-го марта.", correctAnswer: "Narodil som sa tretieho marca", words: ["sa", "marca", "som", "tretieho", "Narodil"], explanation: "Genitív dátumu." },
  { id: "ord-a2-5", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Prvý, druhý, ___, štvrtý.", correctAnswer: "tretí", explanation: "Tretí." },
  { id: "ord-a2-6", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Je pol ___ . (половина десятого)", correctAnswer: "desiatej", options: ["desať", "desiatej", "desiateho"], explanation: "Pol desiatej." },

  // ========== Предлоги времени (A2) ==========
  { id: "time-a2-1", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Vstávam ___ šiestej.", correctAnswer: "o", explanation: "O + čas." },
  { id: "time-a2-2", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Narodila som sa ___ máji.", correctAnswer: "v", options: ["v", "o", "na"], explanation: "V + mesiac." },
  { id: "time-a2-3", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Ideme tam ___ piatok.", correctAnswer: "v", explanation: "V piatok – в пятницу." },
  { id: "time-a2-4", type: "build-sentence", category: "Предлоги времени", level: "A2", sentence: "Урок начинается в 9:00.", correctAnswer: "Hodina začína o deviatej", words: ["o", "Hodina", "deviatej", "začína"], explanation: "O deviatej." },
  { id: "time-a2-5", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "V lete chodíme ___ dovolenku.", correctAnswer: "na", explanation: "Na dovolenku." },
  { id: "time-a2-6", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Vráti sa ___ týždeň.", correctAnswer: "o", options: ["o", "za", "po"], explanation: "O týždeň – через неделю." },

  // ========== Степени сравнения (A2) – дополнительно ==========
  { id: "cmp-a2-1", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "Pes je (malý) ___ ako mačka?", correctAnswer: "menší", explanation: "Malý → menší." },
  { id: "cmp-a2-2", type: "choose-form", category: "Степени сравнения (A2)", level: "A2", sentence: "Toto je ___ kvet.", correctAnswer: "najkrajší", options: ["krajší", "najkrajší", "krásny"], explanation: "Najkrajší." },
  { id: "cmp-a2-3", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "Dnes je (teplo) ___ ako včera.", correctAnswer: "teplejšie", explanation: "Teplejšie." },
  { id: "cmp-a2-4", type: "build-sentence", category: "Степени сравнения (A2)", level: "A2", sentence: "Она выше меня.", correctAnswer: "Ona je vyššia ako ja", words: ["ako", "ja", "vyššia", "je", "Ona"], explanation: "Vyššia – выше." },
  { id: "cmp-a2-5", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "To je (dobrý) ___ film.", correctAnswer: "najlepší", explanation: "Najlepší." },

  // ========== Прошедшее время – неправильные глаголы (A2) ==========
  { id: "irr-a2-1", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ja (ísť) ___ do obchodu.", correctAnswer: "šiel", explanation: "Ísť → šiel." },
  { id: "irr-a2-2", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ona (vidieť) ___ film.", correctAnswer: "videla", options: ["videla", "videli", "videl"], explanation: "Vidieť → videl/a." },
  { id: "irr-a2-3", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "My (jesť) ___ večeru.", correctAnswer: "jedli", explanation: "Jesť → jedli." },
  { id: "irr-a2-4", type: "build-sentence", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Я сказал правду.", correctAnswer: "Povedal som pravdu", words: ["som", "pravdu", "Povedal"], explanation: "Povedať → povedal." },
  { id: "irr-a2-5", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Oni (piť) ___ víno.", correctAnswer: "pili", explanation: "Piť → pili." },
  { id: "irr-a2-6", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ono (zavrieť) ___ dvere.", correctAnswer: "zavrelo", options: ["zavrelo", "zavrela", "zavreli"], explanation: "Zavrieť → zavrelo." },

  // ========== Возвратные глаголы (A2) – дополнительно ==========
  { id: "ref-a2-5", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Ona ___ oblieka.", correctAnswer: "sa", explanation: "Obliekať sa." },
  { id: "ref-a2-6", type: "choose-form", category: "Возвратные глаголы (A2)", level: "A2", sentence: "My ___ hráme.", correctAnswer: "sa", options: ["sa", "si", "se"], explanation: "Hrať sa." },
  { id: "ref-a2-7", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Umyvam ___ ruky.", correctAnswer: "si", explanation: "Umyvať si." },
  { id: "ref-a2-8", type: "build-sentence", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Я сажусь.", correctAnswer: "Posadím sa", words: ["sa", "Posadím"], explanation: "Posadiť sa." },
  { id: "ref-a2-9", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Musíme ___ ponáhľať.", correctAnswer: "sa", explanation: "Ponáhľať sa." },

  // ========== Модальные глаголы (A2) – расширено ==========
  { id: "mod-a2-4", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "Ja ___ tancovať. (умею)", correctAnswer: "viem", explanation: "Vedieť – умение." },
  { id: "mod-a2-5", type: "choose-form", category: "Модальные глаголы (A2)", level: "A2", sentence: "Ty ___ ísť domov.", correctAnswer: "môžeš", options: ["môžeš", "musíš", "chceš"], explanation: "Môcť – мочь." },
  { id: "mod-a2-6", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "On ___ sa učiť. (должен)", correctAnswer: "musí", explanation: "Musieť." },
  { id: "mod-a2-7", type: "build-sentence", category: "Модальные глаголы (A2)", level: "A2", sentence: "Ты хочешь есть?", correctAnswer: "Chceš jesť?", words: ["jesť?", "Chceš"], explanation: "Chcieť." },
  { id: "mod-a2-8", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "My ___ ísť von? (Môcť)", correctAnswer: "môžeme", explanation: "Môžeme." },
  { id: "mod-a2-9", type: "choose-form", category: "Модальные глаголы (A2)", level: "A2", sentence: "Vy ___ si kúpiť lístok.", correctAnswer: "musíte", options: ["musíte", "môžete", "chcete"], explanation: "Musieť." },

  // ========== Прилагательные и наречия (A2) ==========
  { id: "adj-a2-1", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Hovorí po slovensky veľmi ___.", correctAnswer: "dobre", explanation: "Dobre – хорошо." },
  { id: "adj-a2-2", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "Auto ide ___.", correctAnswer: "rýchlo", options: ["rýchly", "rýchlo", "rýchla"], explanation: "Rýchlo – быстро (наречие)." },
  { id: "adj-a2-3", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Toto je veľmi ___ dom.", correctAnswer: "starý", explanation: "Starý – старый." },
  { id: "adj-a2-4", type: "build-sentence", category: "Прилагательные и наречия", level: "A2", sentence: "Он медленно идёт.", correctAnswer: "On ide pomaly", words: ["pomaly", "ide", "On"], explanation: "Pomaly – медленно." },
  { id: "adj-a2-5", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Je to ___ jedlo. (вкусное)", correctAnswer: "chutné", explanation: "Chutné." },
  { id: "adj-a2-6", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "Spieva ___.", correctAnswer: "pekne", options: ["pekný", "pekne", "pekná"], explanation: "Pekne – красиво (наречие)." },
  { id: "adj-a2-7", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Toto je ___ taška. (тяжёлая)", correctAnswer: "ťažká", explanation: "Ťažká." },

  // ========== Сравнения "ako" и "než" (A2) ==========
  { id: "por-a2-1", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Brat je starší ___ ja.", correctAnswer: "ako", explanation: "Komparatív + ako." },
  { id: "por-a2-2", type: "choose-form", category: "Сравнения (ako / než)", level: "A2", sentence: "Mám radšej kávu ___ čaj.", correctAnswer: "než", options: ["ako", "než", "a"], explanation: "Radšej + než." },
  { id: "por-a2-3", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je vyšší ___ jeho otec.", correctAnswer: "ako", explanation: "Ako." },
  { id: "por-a2-4", type: "build-sentence", category: "Сравнения (ako / než)", level: "A2", sentence: "Я предпочитаю чай, а не кофе.", correctAnswer: "Mám radšej čaj než kávu", words: ["než", "čaj", "radšej", "kávu", "Mám"], explanation: "Radšej... než." },
  { id: "por-a2-5", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je to lepšie, ___ som čakal.", correctAnswer: "ako", explanation: "Lepšie ako." },

  // ========== Osobné zámená v akuzatíve (A2) ==========
  { id: "acc-a2-1", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Vidím ___. (его)", correctAnswer: "ho", explanation: "Ho – его." },
  { id: "acc-a2-2", type: "choose-form", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Počúvaš ___? (меня)", correctAnswer: "ma", options: ["ma", "mi", "mňa"], explanation: "Ma – меня." },
  { id: "acc-a2-3", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Čakám na ___. (тебя)", correctAnswer: "teba", explanation: "Teba – тебя (после предлога)." },
  { id: "acc-a2-4", type: "build-sentence", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Я её знаю.", correctAnswer: "Poznám ju", words: ["ju", "Poznám"], explanation: "Ju – её." },
  { id: "acc-a2-5", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Pozývam ___ (вас) na oslavu.", correctAnswer: "vás", explanation: "Vás – вас." },
  { id: "acc-a2-6", type: "choose-form", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Milujem ___ (их).", correctAnswer: "ich", options: ["ich", "im", "oni"], explanation: "Ich – их." },
    // ========== Дополнения для "Падежи – Nominatív (A2)" – сейчас 3, нужно минимум 8 ==========
  { id: "pad-nom-a2-4", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je to? To je moja kniha.", correctAnswer: "Čo", explanation: "Čo – что." },
  { id: "pad-nom-a2-5", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je tvoje obľúbené jedlo?", correctAnswer: "Aké", options: ["Ako", "Aké", "Kto"], explanation: "Aké – какое." },
  { id: "pad-nom-a2-6", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ sú to? To sú moji rodičia.", correctAnswer: "Kto", explanation: "Kto – кто." },
  { id: "pad-nom-a2-7", type: "build-sentence", category: "Падежи (Nominatív)", level: "A2", sentence: "Это хороший вопрос.", correctAnswer: "To je dobrá otázka", words: ["dobrá", "je", "To", "otázka"], explanation: "Nominatív – dobrá otázka." },
  { id: "pad-nom-a2-8", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ to je? Je to môj pes.", correctAnswer: "Čo", explanation: "Čo – что." },
  { id: "pad-nom-a2-9", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ dievča je tvoja sestra?", correctAnswer: "Ktoré", options: ["Ktorý", "Ktorá", "Ktoré"], explanation: "Ktoré – которое (ср.род)." },

  // ========== Дополнения для "Сравнения (ako / než) (A2)" – сейчас 5, нужно минимум 8 ==========
  { id: "por-a2-6", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je to horšie, ___ som si myslel.", correctAnswer: "ako", explanation: "Horšie ako." },
  { id: "por-a2-7", type: "choose-form", category: "Сравнения (ako / než)", level: "A2", sentence: "Radšej čítam knihy ___ pozerám televíziu.", correctAnswer: "než", options: ["ako", "než", "a"], explanation: "Radšej... než." },
  { id: "por-a2-8", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je šikovnejší ___ jeho brat.", correctAnswer: "ako", explanation: "Ako." },
  { id: "por-a2-9", type: "build-sentence", category: "Сравнения (ako / než)", level: "A2", sentence: "Я предпочитаю лето, а не зиму.", correctAnswer: "Mám radšej leto než zimu", words: ["než", "leto", "radšej", "zimu", "Mám"], explanation: "Radšej... než." },
  { id: "por-a2-10", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je to rovnaké ___ včera.", correctAnswer: "ako", explanation: "Rovnaké ako." },

  // ========== Дополнения для "Указательные местоимения (A1)" – сейчас 6, нужно минимум 8 ==========
  { id: "dem-a1-7", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ chlapec sa volá Peter. (этот)", correctAnswer: "Tento", explanation: "Tento – этот." },
  { id: "dem-a1-8", type: "choose-form", category: "Указательные местоимения", level: "A1", sentence: "___ žena je moja mama.", correctAnswer: "Táto", options: ["Tento", "Táto", "Toto"], explanation: "Táto – эта." },
  { id: "dem-a1-9", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ domy sú nové. (те)", correctAnswer: "Tie", explanation: "Tie – те." },
  { id: "dem-a1-10", type: "build-sentence", category: "Указательные местоимения", level: "A1", sentence: "Эта книга интересная.", correctAnswer: "Táto kniha je zaujímavá", words: ["je", "kniha", "zaujímavá", "Táto"], explanation: "Táto – эта." },
  { id: "dem-a1-11", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "To ___ môj kamarát.", correctAnswer: "je", explanation: "To je – это есть." },

  // ========== Дополнения для "Личные местоимения (A1)" – сейчас 6, нужно минимум 8 ==========
  { id: "pers-a1-7", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ sú deti. (они, ср.род)", correctAnswer: "Ony", explanation: "Ony – они (жен. и ср.род)." },
  { id: "pers-a1-8", type: "choose-form", category: "Личные местоимения", level: "A1", sentence: "___ si môj najlepší priateľ.", correctAnswer: "Ty", options: ["Ja", "Ty", "On"], explanation: "Ty." },
  { id: "pers-a1-9", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ hovorím po slovensky. (я)", correctAnswer: "Ja", explanation: "Ja." },
  { id: "pers-a1-10", type: "build-sentence", category: "Личные местоимения", level: "A1", sentence: "Вы очень умные.", correctAnswer: "Vy ste veľmi múdri", words: ["veľmi", "ste", "múdri", "Vy"], explanation: "Vy ste." },

  // ========== Дополнения для "Числительные (A1)" – сейчас 6, нужно минимум 8 ==========
  { id: "num-a1-7", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Mám ___ sestier. (2)", correctAnswer: "dve", explanation: "Dve sestry." },
  { id: "num-a1-8", type: "choose-form", category: "Числительные", level: "A1", sentence: "Koľko je ___ a tri? (5)", correctAnswer: "päť", options: ["päť", "šesť", "sedem"], explanation: "Päť." },
  { id: "num-a1-9", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Bývam na ___ poschodí. (второй)", correctAnswer: "druhom", explanation: "Druhom." },
  { id: "num-a1-10", type: "build-sentence", category: "Числительные", level: "A1", sentence: "У меня три брата.", correctAnswer: "Mám troch bratov", words: ["bratov", "Mám", "troch"], explanation: "Traja bratia (одуш.)." },
  { id: "num-a1-11", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Hodina trvá ___ minút. (60)", correctAnswer: "šesťdesiat", explanation: "Šesťdesiat." },

  // ========== Дополнения для "Союзы (a, ale, alebo) (A2)" – сейчас 5, нужно минимум 8 ==========
  { id: "conj-a2-6", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Chceš čaj, ___ nechceš kávu?", correctAnswer: "ale", explanation: "Ale – а, но." },
  { id: "conj-a2-7", type: "choose-form", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Môžeme ísť von, ___ prší.", correctAnswer: "ale", options: ["ale", "a", "alebo"], explanation: "Ale – но." },
  { id: "conj-a2-8", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Kúpim chlieb ___ mlieko.", correctAnswer: "a", explanation: "A – и." },
  { id: "conj-a2-9", type: "build-sentence", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Ты придёшь или останешься дома?", correctAnswer: "Prídeš alebo ostaneš doma?", words: ["doma?", "Prídeš", "ostaneš", "alebo"], explanation: "Alebo." },
  { id: "conj-a2-10", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Mám psa ___ nemám mačku.", correctAnswer: "ale", explanation: "Ale – но." },

  // ========== Дополнения для "Прилагательные и наречия (A2)" – сейчас 7, нужно минимум 10 ==========
  { id: "adj-a2-8", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Toto jedlo je ___. (солёное)", correctAnswer: "slané", explanation: "Slané." },
  { id: "adj-a2-9", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "Hovorí ___ po anglicky.", correctAnswer: "plynule", options: ["plynulý", "plynulo", "plynule"], explanation: "Plynule – бегло (наречие)." },
  { id: "adj-a2-10", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Je to ___ človek. (счастливый)", correctAnswer: "šťastný", explanation: "Šťastný." },
  { id: "adj-a2-11", type: "build-sentence", category: "Прилагательные и наречия", level: "A2", sentence: "Она красиво поёт.", correctAnswer: "Ona spieva krásne", words: ["krásne", "Ona", "spieva"], explanation: "Krásne – красиво." },
  { id: "adj-a2-12", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Auto ide veľmi ___. (быстро)", correctAnswer: "rýchlo", explanation: "Rýchlo." },
  { id: "adj-a2-13", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "To je veľmi ___ film.", correctAnswer: "nudný", options: ["nudný", "nudne", "nudná"], explanation: "Nudný – скучный (прил.)." },

  // ========== Дополнения для "Личные местоимения (Akuzatív) (A2)" – сейчас 6, нужно минимум 10 ==========
  { id: "acc-a2-7", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Vidíš ___? (нас)", correctAnswer: "nás", explanation: "Nás – нас." },
  { id: "acc-a2-8", type: "choose-form", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Milujem ___ (её).", correctAnswer: "ju", options: ["ju", "jej", "ona"], explanation: "Ju – её (Akuzatív)." },
  { id: "acc-a2-9", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Počkám na ___ (него).", correctAnswer: "neho", explanation: "Neho – него (после предлога)." },
  { id: "acc-a2-10", type: "build-sentence", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Я вас не понимаю.", correctAnswer: "Nerozumiem vám", words: ["vám", "Nerozumiem"], explanation: "Vám – вас (Datív, но часто путают – здесь для контраста оставляем, можно заменить на vás)." },
  // (заменим на правильное: "Vidím vás")
  { id: "acc-a2-11", type: "build-sentence", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Я вас вижу.", correctAnswer: "Vidím vás", words: ["vás", "Vidím"], explanation: "Vás – вас." },
  { id: "acc-a2-12", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Nepočujem ___ (тебя).", correctAnswer: "ťa", explanation: "Ťa – тебя (краткая форма)." },

  // ========== Дополнения для "Vedieť / Poznať (A2)" – сейчас 7, нужно минимум 10 ==========
  { id: "ved-a2-8", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Oni ___ odpoveď.", correctAnswer: "vedia", explanation: "Vedieť – знают." },
  { id: "ved-a2-9", type: "choose-form", category: "Vedieť / Poznať", level: "A2", sentence: "Ty ___ moju sestru?", correctAnswer: "poznáš", options: ["vieš", "poznáš", "rozumieš"], explanation: "Poznať." },
  { id: "ved-a2-10", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Ja ___ to mesto veľmi dobre.", correctAnswer: "poznám", explanation: "Poznám." },
  { id: "ved-a2-11", type: "build-sentence", category: "Vedieť / Poznať", level: "A2", sentence: "Ты знаешь, где это?", correctAnswer: "Vieš, kde to je?", words: ["je?", "Vieš,", "to", "kde"], explanation: "Vedieť + otázka." },
  { id: "ved-a2-12", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "My ___ o tom nič.", correctAnswer: "nevieme", explanation: "Vedieť – не знаем." },

  // ========== Дополнения для "Предлоги направления (A2)" – сейчас 6, нужно минимум 10 ==========
  { id: "dir-a2-7", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Poďte ___ mne!", correctAnswer: "ku", explanation: "Ku mne – ко мне." },
  { id: "dir-a2-8", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Idem ___ doktora.", correctAnswer: "k", options: ["k", "do", "na"], explanation: "K doktorovi – к врачу." },
  { id: "dir-a2-9", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Vraciam sa ___ školy.", correctAnswer: "zo", explanation: "Zo školy – из школы." },
  { id: "dir-a2-10", type: "build-sentence", category: "Предлоги направления", level: "A2", sentence: "Я иду на работу.", correctAnswer: "Idem do práce", words: ["do", "práce", "Idem"], explanation: "Do práce." },
  { id: "dir-a2-11", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Ideme ___ hory.", correctAnswer: "na", explanation: "Na hory – в горы." },
  { id: "dir-a2-12", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Poďte ___ nám!", correctAnswer: "k", options: ["k", "do", "na"], explanation: "K nám – к нам." },

  // ========== Дополнения для "Порядковые числительные (A2)" – сейчас 6, нужно минимум 10 ==========
  { id: "ord-a2-7", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Dnes je ___ decembra. (24.)", correctAnswer: "dvadsiateho štvrtého", explanation: "Dvadsiateho štvrtého." },
  { id: "ord-a2-8", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Som ___ v poradí.", correctAnswer: "piaty", options: ["päť", "piaty", "piati"], explanation: "Piaty – пятый." },
  { id: "ord-a2-9", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Bývam na ___ poschodí. (3.)", correctAnswer: "treťom", explanation: "Treťom." },
  { id: "ord-a2-10", type: "build-sentence", category: "Числительные (порядковые)", level: "A2", sentence: "Мой второй брат – учитель.", correctAnswer: "Môj druhý brat je učiteľ", words: ["učiteľ", "brat", "druhý", "je", "Môj"], explanation: "Druhý – второй." },
  { id: "ord-a2-11", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Je pol ___ . (половина двенадцатого)", correctAnswer: "dvanástej", explanation: "Pol dvanástej." },
  { id: "ord-a2-12", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Prvý, druhý, ___, štvrtý.", correctAnswer: "tretí", options: ["tretí", "tretia", "tretie"], explanation: "Tretí." },

  // ========== Дополнения для "Предлоги времени (A2)" – сейчас 6, нужно минимум 10 ==========
  { id: "time-a2-7", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Vrátim sa ___ hodinu.", correctAnswer: "o", explanation: "O hodinu – через час." },
  { id: "time-a2-8", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Narodila som sa ___ zime.", correctAnswer: "v", options: ["v", "o", "na"], explanation: "V zime – зимой." },
  { id: "time-a2-9", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Ideme tam ___ víkend.", correctAnswer: "cez", explanation: "Cez víkend – в выходные." },
  { id: "time-a2-10", type: "build-sentence", category: "Предлоги времени", level: "A2", sentence: "Я приду через пять минут.", correctAnswer: "Prídem o päť minút", words: ["päť", "Prídem", "o", "minút"], explanation: "O päť minút." },
  { id: "time-a2-11", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "___ lete je teplo.", correctAnswer: "V", explanation: "V lete – летом." },
  { id: "time-a2-12", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Vstávam ___ šiestej ráno.", correctAnswer: "o", options: ["o", "v", "na"], explanation: "O šiestej." },

  // ========== Дополнения для "Степени сравнения (A2) – дополнительно" – сейчас 5, нужно минимум 10 ==========
  { id: "cmp-a2-6", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "Táto taška je (ťažký) ___ ako tá.", correctAnswer: "ťažšia", explanation: "Ťažšia." },
  { id: "cmp-a2-7", type: "choose-form", category: "Степени сравнения (A2)", level: "A2", sentence: "Môj dom je ___ ako tvoj.", correctAnswer: "väčší", options: ["veľký", "väčší", "najväčší"], explanation: "Väčší." },
  { id: "cmp-a2-8", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "To je (zlý) ___ film, aký som kedy videl.", correctAnswer: "najhorší", explanation: "Najhorší." },
  { id: "cmp-a2-9", type: "build-sentence", category: "Степени сравнения (A2)", level: "A2", sentence: "Сегодня холоднее, чем вчера.", correctAnswer: "Dnes je chladnejšie ako včera", words: ["chladnejšie", "je", "ako", "včera", "Dnes"], explanation: "Chladnejšie – холоднее." },
  { id: "cmp-a2-10", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "To je (krásny) ___ miesto.", correctAnswer: "najkrajšie", explanation: "Najkrajšie." },
  { id: "cmp-a2-11", type: "choose-form", category: "Степени сравнения (A2)", level: "A2", sentence: "Ona je ___ žena na svete.", correctAnswer: "najkrajšia", options: ["krajšia", "najkrajšia", "krásna"], explanation: "Najkrajšia." },

  // ========== Дополнения для "Прошедшее время – неправильные глаголы (A2)" – сейчас 6, нужно минимум 10 ==========
  { id: "irr-a2-7", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "On (prísť) ___ neskoro.", correctAnswer: "prišiel", explanation: "Prísť → prišiel." },
  { id: "irr-a2-8", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "My (odísť) ___ ráno.", correctAnswer: "odišli sme", options: ["odišli sme", "odišiel som", "odišli ste"], explanation: "Odísť → odišli." },
  { id: "irr-a2-9", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ona (povedať) ___ to nahlas.", correctAnswer: "povedala", explanation: "Povedať → povedala." },
  { id: "irr-a2-10", type: "build-sentence", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Они пришли вовремя.", correctAnswer: "Oni prišli načas", words: ["načas", "prišli", "Oni"], explanation: "Prísť → prišli." },
  { id: "irr-a2-11", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ty (vziať) ___ si môj zošit?", correctAnswer: "vzal", explanation: "Vziať → vzal." },
  { id: "irr-a2-12", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ono (spadnúť) ___ zo stola.", correctAnswer: "spadlo", options: ["spadlo", "spadla", "spadli"], explanation: "Spadnúť → spadlo." },

  // ========== Дополнения для "Возвратные глаголы (A2) – дополнительно" – сейчас 5 (+4 = 9), доведём до 12 ==========
  { id: "ref-a2-10", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Musím ___ obuť.", correctAnswer: "sa", explanation: "Obuť sa." },
  { id: "ref-a2-11", type: "choose-form", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Ty ___ ešte nečesal?", correctAnswer: "si sa", options: ["si sa", "sa", "si"], explanation: "Česať sa." },
  { id: "ref-a2-12", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Deti ___ hrajú na dvore.", correctAnswer: "sa", explanation: "Hrať sa." },

  // ========== Дополнения для "Модальные глаголы (A2) – расширено" – сейчас 6 (+3 = 9), доведём до 12 ==========
  { id: "mod-a2-10", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "Ja ___ plávať. (умею)", correctAnswer: "viem", explanation: "Vedieť – уметь." },
  { id: "mod-a2-11", type: "choose-form", category: "Модальные глаголы (A2)", level: "A2", sentence: "My ___ ísť na prechádzku.", correctAnswer: "chceme", options: ["chceme", "môžeme", "musíme"], explanation: "Chcieť – хотеть." },
  { id: "mod-a2-12", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "Vy ___ počkať.", correctAnswer: "musíte", explanation: "Musieť." },
    // ==========================================
  // B2 / C1 – большой пакет
  // ==========================================

  // ========== Podmieňovací spôsob (условное наклонение) – B2 ==========
  { id: "cond-b2-4", type: "fill-blank", category: "Условные предложения", level: "B2", sentence: "Keby som ___ viac času, išiel by som tam.", correctAnswer: "mal", explanation: "Keby + minulý čas." },
  { id: "cond-b2-5", type: "choose-form", category: "Условные предложения", level: "B2", sentence: "___ si mi pomohol, dokončil by som to.", correctAnswer: "Keby", options: ["Keby", "Ak", "Keď"], explanation: "Keby – nereálna podmienka." },
  { id: "cond-b2-6", type: "fill-blank", category: "Условные предложения", level: "B2", sentence: "Ja by som na tvojom mieste ___.", correctAnswer: "počkal", explanation: "Kondicionál + minulý čas." },
  { id: "cond-b2-7", type: "build-sentence", category: "Условные предложения", level: "B2", sentence: "Если бы я знал, я бы пришёл.", correctAnswer: "Keby som vedel, prišiel by som", words: ["prišiel", "som", "by", "vedel,", "Keby"], explanation: "Keby + minulý, kondicionál." },
  { id: "cond-b2-8", type: "fill-blank", category: "Условные предложения", level: "B2", sentence: "Keby sme ___ lístky skôr, mali by sme lepšie miesta.", correctAnswer: "kúpili", explanation: "Kúpili – minulý čas." },
  { id: "cond-b2-9", type: "choose-form", category: "Условные предложения", level: "B2", sentence: "Býval by som šťastný, keby som ___ prácu.", correctAnswer: "mal", options: ["mám", "mal", "budem mať"], explanation: "Keby + minulý." },
  { id: "cond-c1-3", type: "fill-blank", category: "Условные предложения", level: "C1", sentence: "Keby ___ nepršalo, išli by sme na výlet.", correctAnswer: "včera", explanation: "Keby včera nepršalo." },
  { id: "cond-c1-4", type: "build-sentence", category: "Условные предложения", level: "C1", sentence: "Если бы ты меня послушал, ничего бы не случилось.", correctAnswer: "Keby si ma poslúchol, nič by sa nestalo", words: ["nestalo", "sa", "nič", "by", "poslúchol,", "ma", "si", "Keby"], explanation: "Keby + minulý, kondicionál." },
  { id: "cond-c1-5", type: "fill-blank", category: "Условные предложения", level: "C1", sentence: "Nebývať teba, ___ by som to zvládol.", correctAnswer: "neviem, či", explanation: "Nebývať + kondicionál." },
  { id: "cond-c1-6", type: "choose-form", category: "Условные предложения", level: "C1", sentence: "Čo by si robil, ___ si mal milión?", correctAnswer: "keby", options: ["keby", "ak", "keď"], explanation: "Keby – hypotetické." },

  // ========== Príčastia a prechodníky (B2/C1) ==========
  { id: "part-b2-1", type: "fill-blank", category: "Причастия", level: "B2", sentence: "List ___ včera ešte neprišiel.", correctAnswer: "napísaný", explanation: "Napísaný – пассивное причастие." },
  { id: "part-b2-2", type: "choose-form", category: "Причастия", level: "B2", sentence: "Dievča ___ prišlo neskoro.", correctAnswer: "usmievajúc sa", options: ["usmievajúc sa", "usmiaty", "usmievajúc"], explanation: "Usmievajúc sa – деепричастие." },
  { id: "part-b2-3", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Okno je ___. (открыто)", correctAnswer: "otvorené", explanation: "Otvorené – пассив." },
  { id: "part-c1-1", type: "build-sentence", category: "Причастия", level: "C1", sentence: "Сказав это, он ушёл.", correctAnswer: "Povediac to, odišiel", words: ["to,", "odišiel", "Povediac"], explanation: "Povediac – деепричастие." },
  { id: "part-b2-4", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Stôl je ___ . (накрыт)", correctAnswer: "prestretý", explanation: "Prestretý." },
  { id: "part-c1-2", type: "choose-form", category: "Причастия", level: "C1", sentence: "___ všetky možnosti, rozhodol sa.", correctAnswer: "Zvážiac", options: ["Zvážil", "Zvážiac", "Zvážený"], explanation: "Zvážiac – деепричастие." },
  { id: "part-b2-5", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Voda je ___. (вскипячена)", correctAnswer: "prevarená", explanation: "Prevarená." },
  { id: "part-c1-3", type: "fill-blank", category: "Причастия", level: "C1", sentence: "___ domácu úlohu, išiel von.", correctAnswer: "Dokončiac", explanation: "Dokončiac." },
  { id: "part-c1-4", type: "build-sentence", category: "Причастия", level: "C1", sentence: "Прочитав книгу, он заснул.", correctAnswer: "Prečítav knihu, zaspal", words: ["knihu,", "zaspal", "Prečítav"], explanation: "Prečítav – деепричастие." },
  { id: "part-c1-5", type: "fill-blank", category: "Причастия", level: "C1", sentence: "___ o tom, súhlasil.", correctAnswer: "Premýšľajúc", explanation: "Premýšľajúc." },

  // ========== Trpný rod (пассивный залог) – B2/C1 ==========
  { id: "pass-b2-1", type: "fill-blank", category: "Пассивный залог", level: "B2", sentence: "Tento dom bol ___ v roku 1990.", correctAnswer: "postavený", explanation: "Postavený – пассив." },
  { id: "pass-b2-2", type: "choose-form", category: "Пассивный залог", level: "B2", sentence: "List ___ odoslaný zajtra.", correctAnswer: "bude", options: ["bude", "je", "bol"], explanation: "Bude odoslaný." },
  { id: "pass-c1-1", type: "fill-blank", category: "Пассивный залог", level: "C1", sentence: "Hovorí sa, že práca ___ dokončená.", correctAnswer: "bola", explanation: "Bola dokončená." },
  { id: "pass-b2-3", type: "build-sentence", category: "Пассивный залог", level: "B2", sentence: "Дверь была закрыта.", correctAnswer: "Dvere boli zatvorené", words: ["zatvorené", "boli", "Dvere"], explanation: "Boli zatvorené." },
  { id: "pass-c1-2", type: "fill-blank", category: "Пассивный залог", level: "C1", sentence: "Problém ___ vyriešený do konca týždňa.", correctAnswer: "bude", explanation: "Bude vyriešený." },
  { id: "pass-b2-4", type: "choose-form", category: "Пассивный залог", level: "B2", sentence: "Mesto ___ založené v 13. storočí.", correctAnswer: "bolo", options: ["bolo", "bola", "boli"], explanation: "Bolo založené." },
  { id: "pass-c1-3", type: "fill-blank", category: "Пассивный залог", level: "C1", sentence: "Čakalo sa, že rozhodnutie ___ prijaté.", correctAnswer: "bude", explanation: "Bude prijaté." },
  { id: "pass-c1-4", type: "build-sentence", category: "Пассивный залог", level: "C1", sentence: "Говорят, что он был уволен.", correctAnswer: "Hovorí sa, že bol prepustený", words: ["prepustený", "sa,", "že", "bol", "Hovorí"], explanation: "Pasívna konštrukcia." },
  { id: "pass-c1-5", type: "fill-blank", category: "Пассивный залог", level: "C1", sentence: "Táto chyba ___ odstránená.", correctAnswer: "bola", explanation: "Bola odstránená." },

  // ========== Podmieňovacie spojky (B2/C1) ==========
  { id: "spoj-c1-1", type: "fill-blank", category: "Сложные союзы", level: "C1", sentence: "___ by som vedel, nepovedal by som to.", correctAnswer: "Keby", explanation: "Keby." },
  { id: "spoj-c1-2", type: "choose-form", category: "Сложные союзы", level: "C1", sentence: "V prípade, ___ to bude nutné, zavolajte.", correctAnswer: "že", options: ["že", "aby", "ak"], explanation: "V prípade, že." },
  { id: "spoj-c1-3", type: "fill-blank", category: "Сложные союзы", level: "C1", sentence: "Súhlasím, ___ to nie je ideálne.", correctAnswer: "hoci", explanation: "Hoci." },
  { id: "spoj-c1-4", type: "build-sentence", category: "Сложные союзы", level: "C1", sentence: "Несмотря на то, что он опоздал, его приняли.", correctAnswer: "Napriek tomu, že meškal, prijali ho", words: ["ho", "prijali", "meškal,", "že", "tomu,", "Napriek"], explanation: "Napriek tomu, že." },
  { id: "spoj-c1-5", type: "fill-blank", category: "Сложные союзы", level: "C1", sentence: "___ by som chcel, nemôžem prísť.", correctAnswer: "Aj keď", explanation: "Aj keď." },
  { id: "spoj-c1-6", type: "choose-form", category: "Сложные союзы", level: "C1", sentence: "Okrem ___, že je drahý, je aj nekvalitný.", correctAnswer: "toho", options: ["toho", "tomu", "tom"], explanation: "Okrem toho." },
  { id: "spoj-c1-7", type: "fill-blank", category: "Сложные союзы", level: "C1", sentence: "Beriem si dáždnik, ___ by pršalo.", correctAnswer: "pre prípad, že", explanation: "Pre prípad, že." },
  { id: "spoj-c1-8", type: "fill-blank", category: "Сложные союзы", level: "C1", sentence: "Zavolaj mi, ___ prídeš domov.", correctAnswer: "len čo", explanation: "Len čo." },

  // ========== Nepriame otázky (косвенные вопросы) – B2 ==========
  { id: "ind-b2-1", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Neviem, ___ príde.", correctAnswer: "kedy", explanation: "Kedy – когда." },
  { id: "ind-b2-2", type: "choose-form", category: "Косвенные вопросы", level: "B2", sentence: "Povedz mi, ___ si kúpil.", correctAnswer: "čo", options: ["čo", "kto", "kde"], explanation: "Čo – что." },
  { id: "ind-b2-3", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Zaujíma ma, ___ to stojí.", correctAnswer: "koľko", explanation: "Koľko – сколько." },
  { id: "ind-b2-4", type: "build-sentence", category: "Косвенные вопросы", level: "B2", sentence: "Я не знаю, где он живёт.", correctAnswer: "Neviem, kde býva", words: ["býva", "kde", "Neviem,"], explanation: "Nepriama otázka." },
  { id: "ind-b2-5", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Vieš, ___ sa to stalo?", correctAnswer: "prečo", explanation: "Prečo – почему." },
  { id: "ind-b2-6", type: "choose-form", category: "Косвенные вопросы", level: "B2", sentence: "Spýtam sa ho, ___ príde.", correctAnswer: "či", options: ["či", "kde", "čo"], explanation: "Či – ли (частица)." },
  { id: "ind-b2-7", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Nerozumiem, ___ to funguje.", correctAnswer: "ako", explanation: "Ako – как." },
  { id: "ind-b2-8", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Povedz mi, ___ si bol.", correctAnswer: "kde", explanation: "Kde – где." },

  // ========== Vzťažné vety (относительные придаточные) – B2/C1 ==========
  { id: "rel-b2-1", type: "fill-blank", category: "Относительные придаточные", level: "B2", sentence: "To je muž, ___ som videl včera.", correctAnswer: "ktorého", explanation: "Ktorý – который (Akuzatív)." },
  { id: "rel-b2-2", type: "choose-form", category: "Относительные придаточные", level: "B2", sentence: "Kniha, ___ čítam, je zaujímavá.", correctAnswer: "ktorú", options: ["ktorú", "ktorý", "ktorej"], explanation: "Ktorú – Akuzatív žen. rodu." },
  { id: "rel-c1-1", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "Človek, ___ dôveruješ, ťa nesklame.", correctAnswer: "ktorému", explanation: "Ktorému – Datív." },
  { id: "rel-b2-3", type: "build-sentence", category: "Относительные придаточные", level: "B2", sentence: "Это дом, который я купил.", correctAnswer: "To je dom, ktorý som kúpil", words: ["som", "dom,", "je", "ktorý", "kúpil", "To"], explanation: "Ktorý – relatívne zámeno." },
  { id: "rel-c1-2", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "Problém, ___ sa zaoberáme, je zložitý.", correctAnswer: "ktorým", explanation: "Ktorým – Inštrumentál." },
  { id: "rel-b2-4", type: "choose-form", category: "Относительные придаточные", level: "B2", sentence: "Mesto, ___ bývam, je Bratislava.", correctAnswer: "v ktorom", options: ["v ktorom", "ktoré", "ktorého"], explanation: "V ktorom – Lokál." },
  { id: "rel-c1-3", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "Dôvod, ___ som prišiel, je osobný.", correctAnswer: "pre ktorý", explanation: "Pre ktorý – Akuzatív s predložkou." },
  { id: "rel-c1-4", type: "build-sentence", category: "Относительные придаточные", level: "C1", sentence: "Женщина, с которой я говорил, была врачом.", correctAnswer: "Žena, s ktorou som hovoril, bola lekárka", words: ["lekárka", "s", "hovoril,", "bola", "som", "ktorou", "Žena,"], explanation: "S ktorou – Inštrumentál." },
  { id: "rel-b2-5", type: "fill-blank", category: "Относительные придаточные", level: "B2", sentence: "Auto, ___ stojí pred domom, je nové.", correctAnswer: "ktoré", explanation: "Ktoré – Nominatív." },

  // ========== Prefixálne slovesá (B2/C1) ==========
  { id: "pref-b2-1", type: "fill-blank", category: "Глаголы с приставками", level: "B2", sentence: "Musíš si ___ žiť nový život.", correctAnswer: "zariadiť", explanation: "Zariadiť – устроить." },
  { id: "pref-b2-2", type: "choose-form", category: "Глаголы с приставками", level: "B2", sentence: "___ robil som úlohu.", correctAnswer: "Vy", options: ["Vy", "Do", "Pre"], explanation: "Vyrobiť – произвести, но здесь Vypracovať? Контекст: Vypracoval som úlohu. Vybrať správnu prefix." },
  { id: "pref-c1-1", type: "fill-blank", category: "Глаголы с приставками", level: "C1", sentence: "Je ťažké ___ niesť túto stratu.", correctAnswer: "u", explanation: "Uniesť – унести, перенести." },
  { id: "pref-b2-3", type: "build-sentence", category: "Глаголы с приставками", level: "B2", sentence: "Он переписал тест.", correctAnswer: "Prepísal test", words: ["test", "Prepísal"], explanation: "Prepísať – переписать." },
  { id: "pref-c1-2", type: "fill-blank", category: "Глаголы с приставками", level: "C1", sentence: "___ váž si moje slová.", correctAnswer: "Z", explanation: "Zvážiť – взвесить, обдумать." },
  { id: "pref-b2-4", type: "choose-form", category: "Глаголы с приставками", level: "B2", sentence: "Pomohol mi ___ riešiť problém.", correctAnswer: "vy", options: ["vy", "do", "pre"], explanation: "Vyriešiť – решить." },
  { id: "pref-c1-3", type: "fill-blank", category: "Глаголы с приставками", level: "C1", sentence: "Musíme ___ čítať tento článok.", correctAnswer: "pre", explanation: "Prečítať – прочитать." },
  { id: "pref-c1-4", type: "build-sentence", category: "Глаголы с приставками", level: "C1", sentence: "Он выиграл соревнование.", correctAnswer: "Vyhral súťaž", words: ["súťaž", "Vyhral"], explanation: "Vyhrať – выиграть." },

  // ========== Slovosled (порядок слов) – B2 ==========
  { id: "word-b2-1", type: "fill-blank", category: "Порядок слов", level: "B2", sentence: "___ som sa dozvedel pravdu.", correctAnswer: "Včera", explanation: "Včera – наречие в начале." },
  { id: "word-b2-2", type: "choose-form", category: "Порядок слов", level: "B2", sentence: "Knihu, ___ som čítal, mi odporučil brat.", correctAnswer: "ktorú", options: ["ktorú", "ktorá", "ktorej"], explanation: "Vzťažné zámeno." },
  { id: "word-b2-3", type: "fill-blank", category: "Порядок слов", level: "B2", sentence: "___ mi to povedal, neveril som mu.", correctAnswer: "Keď", explanation: "Keď – союз." },
  { id: "word-b2-4", type: "build-sentence", category: "Порядок слов", level: "B2", sentence: "Я знаю, что ты прав.", correctAnswer: "Viem, že máš pravdu", words: ["pravdu", "máš", "Viem,", "že"], explanation: "Hlavná veta + vedľajšia." },
  { id: "word-b2-5", type: "fill-blank", category: "Порядок слов", level: "B2", sentence: "Nikdy ___ som to neurobil.", correctAnswer: "by", explanation: "Nikdy by som – порядок частиц." },
  { id: "word-b2-6", type: "choose-form", category: "Порядок слов", level: "B2", sentence: "Včera ___ som videl tvojho brata.", correctAnswer: "som", options: ["som", "si", "sa"], explanation: "Som – вспомогательный глагол на втором месте." },

  // ========== Konjunktív vyjadrený inak (B2/C1) ==========
  { id: "konj-c1-1", type: "fill-blank", category: "Сослагательное наклонение", level: "C1", sentence: "Nech sa ___ čokoľvek, budem pri tebe.", correctAnswer: "stane", explanation: "Nech sa stane." },
  { id: "konj-c1-2", type: "choose-form", category: "Сослагательное наклонение", level: "C1", sentence: "Kiež ___ viac času!", correctAnswer: "by som mal", options: ["by som mal", "mám", "budem mať"], explanation: "Kiež by som – želanie." },
  { id: "konj-c1-3", type: "fill-blank", category: "Сослагательное наклонение", level: "C1", sentence: "Či ___ alebo nie, musím to urobiť.", correctAnswer: "chcem", explanation: "Či chcem." },
  { id: "konj-c1-4", type: "build-sentence", category: "Сослагательное наклонение", level: "C1", sentence: "Что бы ни случилось, я с тобой.", correctAnswer: "Nech sa stane čokoľvek, som s tebou", words: ["som", "čokoľvek,", "s", "stane", "tebou", "sa", "Nech"], explanation: "Nech + kondicionál." },
  { id: "konj-b2-1", type: "fill-blank", category: "Сослагательное наклонение", level: "B2", sentence: "Keby ___ bolo na mne, urobil by som to inak.", correctAnswer: "to", explanation: "Keby to bolo na mne." },
  { id: "konj-c1-5", type: "fill-blank", category: "Сослагательное наклонение", level: "C1", sentence: "Bodaj ___ už prišla jar!", correctAnswer: "by", explanation: "Bodaj by – устаревшее, но C1." },

  // ========== Predložky s Genitívom a Datívom (B2) ==========
  { id: "prep-b2-1", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Okrem ___ nikto neprišiel.", correctAnswer: "teba", explanation: "Okrem + Genitív." },
  { id: "prep-b2-2", type: "choose-form", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Vďaka ___ som prežil.", correctAnswer: "tebe", options: ["teba", "tebe", "tebou"], explanation: "Vďaka + Datív." },
  { id: "prep-b2-3", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Urobil som to napriek ___.", correctAnswer: "tomu", explanation: "Napriek + Datív." },
  { id: "prep-b2-4", type: "build-sentence", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Благодаря погоде мы пошли гулять.", correctAnswer: "Vďaka počasiu sme išli na prechádzku", words: ["sme", "išli", "Vďaka", "počasiu", "na", "prechádzku"], explanation: "Vďaka + Datív." },
  { id: "prep-b2-5", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Bez ___ to nejde.", correctAnswer: "toho", explanation: "Bez + Genitív." },
  { id: "prep-b2-6", type: "choose-form", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Oproti ___ je to veľký rozdiel.", correctAnswer: "tomu", options: ["tomu", "toho", "tom"], explanation: "Oproti + Datív." },
  { id: "prep-b2-7", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Miesto ___ prišiel brat.", correctAnswer: "teba", explanation: "Miesto + Genitív." },
  { id: "prep-b2-8", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Susedia oproti ___ sú milí.", correctAnswer: "nám", explanation: "Oproti + Datív." },
    // ========== Дополнения для "Падежи – Nominatív (A2)" ==========
  { id: "pad-nom-a2-4", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je to? To je moja kniha.", correctAnswer: "Čo", explanation: "Čo – что." },
  { id: "pad-nom-a2-5", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je tvoje obľúbené jedlo?", correctAnswer: "Aké", options: ["Ako", "Aké", "Kto"], explanation: "Aké – какое." },
  { id: "pad-nom-a2-6", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ sú to? To sú moji rodičia.", correctAnswer: "Kto", explanation: "Kto – кто." },
  { id: "pad-nom-a2-7", type: "build-sentence", category: "Падежи (Nominatív)", level: "A2", sentence: "Это хороший вопрос.", correctAnswer: "To je dobrá otázka", words: ["dobrá", "je", "To", "otázka"], explanation: "Nominatív – dobrá otázka." },
  { id: "pad-nom-a2-8", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ to je? Je to môj pes.", correctAnswer: "Čo", explanation: "Čo – что." },
  { id: "pad-nom-a2-9", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ dievča je tvoja sestra?", correctAnswer: "Ktoré", options: ["Ktorý", "Ktorá", "Ktoré"], explanation: "Ktoré – которое (ср.род)." },

  // ========== Дополнения для "Сравнения (ako / než) (A2)" ==========
  { id: "por-a2-6", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je to horšie, ___ som si myslel.", correctAnswer: "ako", explanation: "Horšie ako." },
  { id: "por-a2-7", type: "choose-form", category: "Сравнения (ako / než)", level: "A2", sentence: "Radšej čítam knihy ___ pozerám televíziu.", correctAnswer: "než", options: ["ako", "než", "a"], explanation: "Radšej... než." },
  { id: "por-a2-8", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je šikovnejší ___ jeho brat.", correctAnswer: "ako", explanation: "Ako." },
  { id: "por-a2-9", type: "build-sentence", category: "Сравнения (ako / než)", level: "A2", sentence: "Я предпочитаю лето, а не зиму.", correctAnswer: "Mám radšej leto než zimu", words: ["než", "leto", "radšej", "zimu", "Mám"], explanation: "Radšej... než." },
  { id: "por-a2-10", type: "fill-blank", category: "Сравнения (ako / než)", level: "A2", sentence: "Je to rovnaké ___ včera.", correctAnswer: "ako", explanation: "Rovnaké ako." },

  // ========== Дополнения для "Указательные местоимения (A1)" ==========
  { id: "dem-a1-7", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ chlapec sa volá Peter. (этот)", correctAnswer: "Tento", explanation: "Tento – этот." },
  { id: "dem-a1-8", type: "choose-form", category: "Указательные местоимения", level: "A1", sentence: "___ žena je moja mama.", correctAnswer: "Táto", options: ["Tento", "Táto", "Toto"], explanation: "Táto – эта." },
  { id: "dem-a1-9", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "___ domy sú nové. (те)", correctAnswer: "Tie", explanation: "Tie – те." },
  { id: "dem-a1-10", type: "build-sentence", category: "Указательные местоимения", level: "A1", sentence: "Эта книга интересная.", correctAnswer: "Táto kniha je zaujímavá", words: ["je", "kniha", "zaujímavá", "Táto"], explanation: "Táto – эта." },
  { id: "dem-a1-11", type: "fill-blank", category: "Указательные местоимения", level: "A1", sentence: "To ___ môj kamarát.", correctAnswer: "je", explanation: "To je – это есть." },

  // ========== Дополнения для "Личные местоимения (A1)" ==========
  { id: "pers-a1-7", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ sú deti. (они, ср.род)", correctAnswer: "Ony", explanation: "Ony – они (жен. и ср.род)." },
  { id: "pers-a1-8", type: "choose-form", category: "Личные местоимения", level: "A1", sentence: "___ si môj najlepší priateľ.", correctAnswer: "Ty", options: ["Ja", "Ty", "On"], explanation: "Ty." },
  { id: "pers-a1-9", type: "fill-blank", category: "Личные местоимения", level: "A1", sentence: "___ hovorím po slovensky. (я)", correctAnswer: "Ja", explanation: "Ja." },
  { id: "pers-a1-10", type: "build-sentence", category: "Личные местоимения", level: "A1", sentence: "Вы очень умные.", correctAnswer: "Vy ste veľmi múdri", words: ["veľmi", "ste", "múdri", "Vy"], explanation: "Vy ste." },

  // ========== Дополнения для "Числительные (A1)" ==========
  { id: "num-a1-7", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Mám ___ sestier. (2)", correctAnswer: "dve", explanation: "Dve sestry." },
  { id: "num-a1-8", type: "choose-form", category: "Числительные", level: "A1", sentence: "Koľko je ___ a tri? (5)", correctAnswer: "päť", options: ["päť", "šesť", "sedem"], explanation: "Päť." },
  { id: "num-a1-9", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Bývam na ___ poschodí. (второй)", correctAnswer: "druhom", explanation: "Druhom." },
  { id: "num-a1-10", type: "build-sentence", category: "Числительные", level: "A1", sentence: "У меня три брата.", correctAnswer: "Mám troch bratov", words: ["bratov", "Mám", "troch"], explanation: "Traja bratia (одуш.)." },
  { id: "num-a1-11", type: "fill-blank", category: "Числительные", level: "A1", sentence: "Hodina trvá ___ minút. (60)", correctAnswer: "šesťdesiat", explanation: "Šesťdesiat." },

  // ========== Дополнения для "Союзы (a, ale, alebo) (A2)" ==========
  { id: "conj-a2-6", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Chceš čaj, ___ nechceš kávu?", correctAnswer: "ale", explanation: "Ale – а, но." },
  { id: "conj-a2-7", type: "choose-form", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Môžeme ísť von, ___ prší.", correctAnswer: "ale", options: ["ale", "a", "alebo"], explanation: "Ale – но." },
  { id: "conj-a2-8", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Kúpim chlieb ___ mlieko.", correctAnswer: "a", explanation: "A – и." },
  { id: "conj-a2-9", type: "build-sentence", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Ты придёшь или останешься дома?", correctAnswer: "Prídeš alebo ostaneš doma?", words: ["doma?", "Prídeš", "ostaneš", "alebo"], explanation: "Alebo." },
  { id: "conj-a2-10", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Mám psa ___ nemám mačku.", correctAnswer: "ale", explanation: "Ale – но." },

  // ========== Дополнения для "Прилагательные и наречия (A2)" ==========
  { id: "adj-a2-8", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Toto jedlo je ___. (солёное)", correctAnswer: "slané", explanation: "Slané." },
  { id: "adj-a2-9", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "Hovorí ___ po anglicky.", correctAnswer: "plynule", options: ["plynulý", "plynulo", "plynule"], explanation: "Plynule – бегло (наречие)." },
  { id: "adj-a2-10", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Je to ___ človek. (счастливый)", correctAnswer: "šťastný", explanation: "Šťastný." },
  { id: "adj-a2-11", type: "build-sentence", category: "Прилагательные и наречия", level: "A2", sentence: "Она красиво поёт.", correctAnswer: "Ona spieva krásne", words: ["krásne", "Ona", "spieva"], explanation: "Krásne – красиво." },
  { id: "adj-a2-12", type: "fill-blank", category: "Прилагательные и наречия", level: "A2", sentence: "Auto ide veľmi ___. (быстро)", correctAnswer: "rýchlo", explanation: "Rýchlo." },
  { id: "adj-a2-13", type: "choose-form", category: "Прилагательные и наречия", level: "A2", sentence: "To je veľmi ___ film.", correctAnswer: "nudný", options: ["nudný", "nudne", "nudná"], explanation: "Nudný – скучный (прил.)." },

  // ========== Дополнения для "Личные местоимения (Akuzatív) (A2)" ==========
  { id: "acc-a2-7", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Vidíš ___? (нас)", correctAnswer: "nás", explanation: "Nás – нас." },
  { id: "acc-a2-8", type: "choose-form", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Milujem ___ (её).", correctAnswer: "ju", options: ["ju", "jej", "ona"], explanation: "Ju – её (Akuzatív)." },
  { id: "acc-a2-9", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Počkám na ___ (него).", correctAnswer: "neho", explanation: "Neho – него (после предлога)." },
  { id: "acc-a2-10", type: "build-sentence", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Я вас вижу.", correctAnswer: "Vidím vás", words: ["vás", "Vidím"], explanation: "Vás – вас." },
  { id: "acc-a2-11", type: "fill-blank", category: "Личные местоимения (Akuzatív)", level: "A2", sentence: "Nepočujem ___ (тебя).", correctAnswer: "ťa", explanation: "Ťa – тебя (краткая форма)." },

  // ========== Дополнения для "Vedieť / Poznať (A2)" ==========
  { id: "ved-a2-8", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Oni ___ odpoveď.", correctAnswer: "vedia", explanation: "Vedieť – знают." },
  { id: "ved-a2-9", type: "choose-form", category: "Vedieť / Poznať", level: "A2", sentence: "Ty ___ moju sestru?", correctAnswer: "poznáš", options: ["vieš", "poznáš", "rozumieš"], explanation: "Poznať." },
  { id: "ved-a2-10", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "Ja ___ to mesto veľmi dobre.", correctAnswer: "poznám", explanation: "Poznám." },
  { id: "ved-a2-11", type: "build-sentence", category: "Vedieť / Poznať", level: "A2", sentence: "Ты знаешь, где это?", correctAnswer: "Vieš, kde to je?", words: ["je?", "Vieš,", "to", "kde"], explanation: "Vedieť + otázka." },
  { id: "ved-a2-12", type: "fill-blank", category: "Vedieť / Poznať", level: "A2", sentence: "My ___ o tom nič.", correctAnswer: "nevieme", explanation: "Vedieť – не знаем." },

  // ========== Дополнения для "Предлоги направления (A2)" ==========
  { id: "dir-a2-7", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Poďte ___ mne!", correctAnswer: "ku", explanation: "Ku mne – ко мне." },
  { id: "dir-a2-8", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Idem ___ doktora.", correctAnswer: "k", options: ["k", "do", "na"], explanation: "K doktorovi – к врачу." },
  { id: "dir-a2-9", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Vraciam sa ___ školy.", correctAnswer: "zo", explanation: "Zo školy – из школы." },
  { id: "dir-a2-10", type: "build-sentence", category: "Предлоги направления", level: "A2", sentence: "Я иду на работу.", correctAnswer: "Idem do práce", words: ["do", "práce", "Idem"], explanation: "Do práce." },
  { id: "dir-a2-11", type: "fill-blank", category: "Предлоги направления", level: "A2", sentence: "Ideme ___ hory.", correctAnswer: "na", explanation: "Na hory – в горы." },
  { id: "dir-a2-12", type: "choose-form", category: "Предлоги направления", level: "A2", sentence: "Poďte ___ nám!", correctAnswer: "k", options: ["k", "do", "na"], explanation: "K nám – к нам." },

  // ========== Дополнения для "Порядковые числительные (A2)" ==========
  { id: "ord-a2-7", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Dnes je ___ decembra. (24.)", correctAnswer: "dvadsiateho štvrtého", explanation: "Dvadsiateho štvrtého." },
  { id: "ord-a2-8", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Som ___ v poradí.", correctAnswer: "piaty", options: ["päť", "piaty", "piati"], explanation: "Piaty – пятый." },
  { id: "ord-a2-9", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Bývam na ___ poschodí. (3.)", correctAnswer: "treťom", explanation: "Treťom." },
  { id: "ord-a2-10", type: "build-sentence", category: "Числительные (порядковые)", level: "A2", sentence: "Мой второй брат – учитель.", correctAnswer: "Môj druhý brat je učiteľ", words: ["učiteľ", "brat", "druhý", "je", "Môj"], explanation: "Druhý – второй." },
  { id: "ord-a2-11", type: "fill-blank", category: "Числительные (порядковые)", level: "A2", sentence: "Je pol ___ . (половина двенадцатого)", correctAnswer: "dvanástej", explanation: "Pol dvanástej." },
  { id: "ord-a2-12", type: "choose-form", category: "Числительные (порядковые)", level: "A2", sentence: "Prvý, druhý, ___, štvrtý.", correctAnswer: "tretí", options: ["tretí", "tretia", "tretie"], explanation: "Tretí." },

  // ========== Дополнения для "Предлоги времени (A2)" ==========
  { id: "time-a2-7", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Vrátim sa ___ hodinu.", correctAnswer: "o", explanation: "O hodinu – через час." },
  { id: "time-a2-8", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Narodila som sa ___ zime.", correctAnswer: "v", options: ["v", "o", "na"], explanation: "V zime – зимой." },
  { id: "time-a2-9", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "Ideme tam ___ víkend.", correctAnswer: "cez", explanation: "Cez víkend – в выходные." },
  { id: "time-a2-10", type: "build-sentence", category: "Предлоги времени", level: "A2", sentence: "Я приду через пять минут.", correctAnswer: "Prídem o päť minút", words: ["päť", "Prídem", "o", "minút"], explanation: "O päť minút." },
  { id: "time-a2-11", type: "fill-blank", category: "Предлоги времени", level: "A2", sentence: "___ lete je teplo.", correctAnswer: "V", explanation: "V lete – летом." },
  { id: "time-a2-12", type: "choose-form", category: "Предлоги времени", level: "A2", sentence: "Vstávam ___ šiestej ráno.", correctAnswer: "o", options: ["o", "v", "na"], explanation: "O šiestej." },

  // ========== Дополнения для "Степени сравнения (A2)" ==========
  { id: "cmp-a2-6", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "Táto taška je (ťažký) ___ ako tá.", correctAnswer: "ťažšia", explanation: "Ťažšia." },
  { id: "cmp-a2-7", type: "choose-form", category: "Степени сравнения (A2)", level: "A2", sentence: "Môj dom je ___ ako tvoj.", correctAnswer: "väčší", options: ["veľký", "väčší", "najväčší"], explanation: "Väčší." },
  { id: "cmp-a2-8", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "To je (zlý) ___ film, aký som kedy videl.", correctAnswer: "najhorší", explanation: "Najhorší." },
  { id: "cmp-a2-9", type: "build-sentence", category: "Степени сравнения (A2)", level: "A2", sentence: "Сегодня холоднее, чем вчера.", correctAnswer: "Dnes je chladnejšie ako včera", words: ["chladnejšie", "je", "ako", "včera", "Dnes"], explanation: "Chladnejšie – холоднее." },
  { id: "cmp-a2-10", type: "fill-blank", category: "Степени сравнения (A2)", level: "A2", sentence: "To je (krásny) ___ miesto.", correctAnswer: "najkrajšie", explanation: "Najkrajšie." },
  { id: "cmp-a2-11", type: "choose-form", category: "Степени сравнения (A2)", level: "A2", sentence: "Ona je ___ žena na svete.", correctAnswer: "najkrajšia", options: ["krajšia", "najkrajšia", "krásna"], explanation: "Najkrajšia." },

  // ========== Дополнения для "Прошедшее время – неправильные глаголы (A2)" ==========
  { id: "irr-a2-7", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "On (prísť) ___ neskoro.", correctAnswer: "prišiel", explanation: "Prísť → prišiel." },
  { id: "irr-a2-8", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "My (odísť) ___ ráno.", correctAnswer: "odišli sme", options: ["odišli sme", "odišiel som", "odišli ste"], explanation: "Odísť → odišli." },
  { id: "irr-a2-9", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ona (povedať) ___ to nahlas.", correctAnswer: "povedala", explanation: "Povedať → povedala." },
  { id: "irr-a2-10", type: "build-sentence", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Они пришли вовремя.", correctAnswer: "Oni prišli načas", words: ["načas", "prišli", "Oni"], explanation: "Prísť → prišli." },
  { id: "irr-a2-11", type: "fill-blank", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ty (vziať) ___ si môj zošit?", correctAnswer: "vzal", explanation: "Vziať → vzal." },
  { id: "irr-a2-12", type: "choose-form", category: "Прошедшее время (неправильные глаголы)", level: "A2", sentence: "Ono (spadnúť) ___ zo stola.", correctAnswer: "spadlo", options: ["spadlo", "spadla", "spadli"], explanation: "Spadnúť → spadlo." },

  // ========== Дополнения для "Возвратные глаголы (A2)" ==========
  { id: "ref-a2-10", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Musím ___ obuť.", correctAnswer: "sa", explanation: "Obuť sa." },
  { id: "ref-a2-11", type: "choose-form", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Ty ___ ešte nečesal?", correctAnswer: "si sa", options: ["si sa", "sa", "si"], explanation: "Česať sa." },
  { id: "ref-a2-12", type: "fill-blank", category: "Возвратные глаголы (A2)", level: "A2", sentence: "Deti ___ hrajú na dvore.", correctAnswer: "sa", explanation: "Hrať sa." },

  // ========== Дополнения для "Модальные глаголы (A2)" ==========
  { id: "mod-a2-10", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "Ja ___ plávať. (умею)", correctAnswer: "viem", explanation: "Vedieť – уметь." },
  { id: "mod-a2-11", type: "choose-form", category: "Модальные глаголы (A2)", level: "A2", sentence: "My ___ ísť na prechádzku.", correctAnswer: "chceme", options: ["chceme", "môžeme", "musíme"], explanation: "Chcieť – хотеть." },
  { id: "mod-a2-12", type: "fill-blank", category: "Модальные глаголы (A2)", level: "A2", sentence: "Vy ___ počkať.", correctAnswer: "musíte", explanation: "Musieť." },
  // ========== Дополнения для "Падежи – Genitív (B1)" ==========
  { id: "pad-gen-b1-8", type: "fill-blank", category: "Падежи (Genitív)", level: "B1", sentence: "To je dom moj___ rodičov.", correctAnswer: "ich", explanation: "Genitív množného čísla." },
  { id: "pad-gen-b1-9", type: "choose-form", category: "Падежи (Genitív)", level: "B1", sentence: "Bez ___ sa nedá žiť.", correctAnswer: "lásky", options: ["láska", "lásky", "lásku"], explanation: "Bez + Genitív." },
  { id: "pad-gen-b1-10", type: "build-sentence", category: "Падежи (Genitív)", level: "B1", sentence: "Я ищу ключи от машины.", correctAnswer: "Hľadám kľúče od auta", words: ["od", "kľúče", "auta", "Hľadám"], explanation: "Od + Genitív." },

  // ========== Дополнения для "Падежи – Datív (B1)" ==========
  { id: "pad-dat-b1-8", type: "fill-blank", category: "Падежи (Datív)", level: "B1", sentence: "Kúpil som darček mami___ .", correctAnswer: "e", explanation: "Mamine – Datív po kúpiť." },
  { id: "pad-dat-b1-9", type: "choose-form", category: "Падежи (Datív)", level: "B1", sentence: "Poďakoval som svoj___ šéfovi.", correctAnswer: "mu", options: ["ho", "mu", "om"], explanation: "Svojmu šéfovi." },
  { id: "pad-dat-b1-10", type: "build-sentence", category: "Падежи (Datív)", level: "B1", sentence: "Я верю своему другу.", correctAnswer: "Verím svojmu priateľovi", words: ["priateľovi", "svojmu", "Verím"], explanation: "Veriť + Datív." },

  // ========== Дополнения для "Падежи – Lokál (B1)" ==========
  { id: "pad-lok-b1-8", type: "fill-blank", category: "Падежи (Lokál)", level: "B1", sentence: "Rozprávali sme ___ počasí.", correctAnswer: "o", explanation: "O + Lokál." },
  { id: "pad-lok-b1-9", type: "choose-form", category: "Падежи (Lokál)", level: "B1", sentence: "Bývam ___ Slovensku.", correctAnswer: "na", options: ["na", "v", "do"], explanation: "Na Slovensku." },
  { id: "pad-lok-b1-10", type: "build-sentence", category: "Падежи (Lokál)", level: "B1", sentence: "Мы говорили о тебе.", correctAnswer: "Hovorili sme o tebe", words: ["o", "sme", "tebe", "Hovorili"], explanation: "O + Lokál." },

  // ========== Дополнения для "Падежи – Inštrumentál (B1)" ==========
  { id: "pad-ins-b1-8", type: "fill-blank", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Ideme ___ autobusom.", correctAnswer: "s", explanation: "S + Inštrumentál (hromadná doprava)." },
  { id: "pad-ins-b1-9", type: "choose-form", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Píšem ___ perom.", correctAnswer: "tým", options: ["toho", "tomu", "tým"], explanation: "Tým perom." },
  { id: "pad-ins-b1-10", type: "build-sentence", category: "Падежи (Inštrumentál)", level: "B1", sentence: "Я езжу на работу автобусом.", correctAnswer: "Jazdím do práce autobusom", words: ["autobusom", "do", "Jazdím", "práce"], explanation: "Cestovať + Inštrumentál." },

  // ========== Дополнения для "Модальные глаголы (B1)" – сейчас 6, нужно 10 ==========
  { id: "mod-b1-7", type: "fill-blank", category: "Модальные глаголы", level: "B1", sentence: "Vy ___ zavolať zajtra. (Mali by ste)", correctAnswer: "mali by ste", explanation: "Mali by ste – вам следует." },
  { id: "mod-b1-8", type: "choose-form", category: "Модальные глаголы", level: "B1", sentence: "On ___ prísť včas.", correctAnswer: "musí", options: ["musí", "môže", "smie"], explanation: "Musí – должен." },
  { id: "mod-b1-9", type: "fill-blank", category: "Модальные глаголы", level: "B1", sentence: "Ja ___ ti pomôcť. (môcť)", correctAnswer: "môžem", explanation: "Môžem." },
  { id: "mod-b1-10", type: "build-sentence", category: "Модальные глаголы", level: "B1", sentence: "Ты можешь идти.", correctAnswer: "Môžeš ísť", words: ["ísť", "Môžeš"], explanation: "Môcť + infinitív." },

  // ========== Дополнения для "Местоимения (B1)" – сейчас 6, нужно 10 ==========
  { id: "pron-b1-7", type: "fill-blank", category: "Местоимения", level: "B1", sentence: "Pomôžem ___. (ей)", correctAnswer: "jej", explanation: "Jej – Datív." },
  { id: "pron-b1-8", type: "choose-form", category: "Местоимения", level: "B1", sentence: "Čakám na ___. (тебя)", correctAnswer: "teba", options: ["teba", "tebe", "ťa"], explanation: "Teba – после предлога." },
  { id: "pron-b1-9", type: "fill-blank", category: "Местоимения", level: "B1", sentence: "Kúpim ___ darček. (ему)", correctAnswer: "mu", explanation: "Mu – Datív." },
  { id: "pron-b1-10", type: "build-sentence", category: "Местоимения", level: "B1", sentence: "Я думаю о нём.", correctAnswer: "Myslím na neho", words: ["na", "Myslím", "neho"], explanation: "Na + Akuzatív (osobné zámeno)." },

  // ========== Дополнения для "Союзы (B1)" – сейчас 4, нужно 8 ==========
  { id: "spoj-b1-5", type: "fill-blank", category: "Союзы", level: "B1", sentence: "Počkám, ___ sa vrátiš. (пока)", correctAnswer: "kým", explanation: "Kým." },
  { id: "spoj-b1-6", type: "choose-form", category: "Союзы", level: "B1", sentence: "Nepríde, ___ je chorý.", correctAnswer: "pretože", options: ["pretože", "a", "ale"], explanation: "Pretože." },
  { id: "spoj-b1-7", type: "fill-blank", category: "Союзы", level: "B1", sentence: "Môžeš ísť, ___ chceš.", correctAnswer: "ak", explanation: "Ak – если." },
  { id: "spoj-b1-8", type: "build-sentence", category: "Союзы", level: "B1", sentence: "Я останусь дома, так как устал.", correctAnswer: "Ostanem doma, lebo som unavený", words: ["unavený", "lebo", "som", "doma,", "Ostanem"], explanation: "Lebo." },

  // ========== Дополнения для "Возвратные глаголы (B1)" – сейчас 5, нужно 8 ==========
  { id: "ref-b1-7", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "Musíme ___ pripraviť na skúšku.", correctAnswer: "sa", explanation: "Pripraviť sa." },
  { id: "ref-b1-8", type: "choose-form", category: "Возвратные глаголы", level: "B1", sentence: "Oni ___ zamilovali na prvý pohľad.", correctAnswer: "sa", options: ["sa", "si", "se"], explanation: "Zamilovať sa." },
  { id: "ref-b1-9", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "Nezabudni ___ vziať dáždnik.", correctAnswer: "si", explanation: "Vziať si." },

  // ========== Дополнения для "Глаголы движения с приставками (B1)" – сейчас 3, нужно 8 ==========
  { id: "poh-b1-4", type: "fill-blank", category: "Глаголы движения с приставками", level: "B1", sentence: "Došiel som ___ konca ulice.", correctAnswer: "na", explanation: "Na koniec." },
  { id: "poh-b1-5", type: "choose-form", category: "Глаголы движения с приставками", level: "B1", sentence: "Ona ___ z auta.", correctAnswer: "vystúpila", options: ["vystúpila", "vystúpil", "vystúpili"], explanation: "Vystúpiť." },
  { id: "poh-b1-6", type: "fill-blank", category: "Глаголы движения с приставками", level: "B1", sentence: "Prešli sme ___ most.", correctAnswer: "cez", explanation: "Cez most." },
  { id: "poh-b1-7", type: "build-sentence", category: "Глаголы движения с приставками", level: "B1", sentence: "Я перешёл улицу.", correctAnswer: "Prešiel som cez ulicu", words: ["cez", "som", "ulicu", "Prešiel"], explanation: "Prejsť cez." },
  { id: "poh-b1-8", type: "fill-blank", category: "Глаголы движения с приставками", level: "B1", sentence: "Vybehol som ___ kopca.", correctAnswer: "na", explanation: "Na kopec." },

  // ========== Дополнения для "Императив (B1)" – сейчас 5, нужно 8 ==========
  { id: "imp-b1-6", type: "fill-blank", category: "Императив", level: "B1", sentence: "___ to okamžite! (urobiť)", correctAnswer: "Urob", explanation: "Urob!" },
  { id: "imp-b1-7", type: "choose-form", category: "Императив", level: "B1", sentence: "___ mi to vysvetliť! (pomôcť)", correctAnswer: "Pomôž", options: ["Pomôž", "Pomôžte", "Pomôžme"], explanation: "Pomôž (ty)." },
  { id: "imp-b1-8", type: "fill-blank", category: "Императив", level: "B1", sentence: "___ si tú knihu! (vziať)", correctAnswer: "Vezmi", explanation: "Vezmi si." },

  // ========== Дополнения для "Порядок слов (B2)" – сейчас 6, нужно 8 ==========
  { id: "word-b2-7", type: "fill-blank", category: "Порядок слов", level: "B2", sentence: "___ sa učíš, tým viac vieš.", correctAnswer: "Čím", explanation: "Čím... tým." },
  { id: "word-b2-8", type: "choose-form", category: "Порядок слов", level: "B2", sentence: "Včera ___ som dostal list.", correctAnswer: "som", options: ["som", "si", "sa"], explanation: "Pomocné sloveso na druhom mieste." },

  // ========== Дополнения для "Косвенные вопросы (B2)" – сейчас 8, ок, можно ещё 2 ==========
  { id: "ind-b2-9", type: "fill-blank", category: "Косвенные вопросы", level: "B2", sentence: "Vysvetli mi, ___ to funguje.", correctAnswer: "ako", explanation: "Ako – как." },
  { id: "ind-b2-10", type: "choose-form", category: "Косвенные вопросы", level: "B2", sentence: "Nepovedal, ___ príde.", correctAnswer: "kedy", options: ["kedy", "kde", "čo"], explanation: "Kedy – когда." },

  // ========== Дополнения для "Сослагательное наклонение (B2/C1)" – сейчас 6, нужно 8 ==========
  { id: "konj-b2-2", type: "fill-blank", category: "Сослагательное наклонение", level: "B2", sentence: "Keby som ___ viac času, cestoval by som.", correctAnswer: "mal", explanation: "Keby som mal." },
  { id: "konj-c1-6", type: "choose-form", category: "Сослагательное наклонение", level: "C1", sentence: "Nech ___ čokoľvek, som pripravený.", correctAnswer: "sa stane", options: ["sa stane", "stane sa", "sa stalo"], explanation: "Nech sa stane." },

  // ========== Дополнения для "Предлоги с Genitív/Datív (B2)" – сейчас 8, ок, можно ещё 2 ==========
  { id: "prep-b2-9", type: "fill-blank", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Oproti ___ je to maličkosť.", correctAnswer: "tomu", explanation: "Oproti + Datív." },
  { id: "prep-b2-10", type: "choose-form", category: "Предлоги с Genitív/Datív", level: "B2", sentence: "Bez ___ by som to nedokázal.", correctAnswer: "teba", options: ["teba", "tebe", "tebou"], explanation: "Bez + Genitív." },
  // ========== Добивка для "Предлоги места (A1)" – сейчас 8, станет 12 ==========
  { id: "prep-a1-9", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Obraz visí ___ stene.", correctAnswer: "na", explanation: "Na stene – на стене." },
  { id: "prep-a1-10", type: "choose-form", category: "Предлоги места", level: "A1", sentence: "Kľúče sú ___ taške.", correctAnswer: "v", options: ["v", "na", "pod"], explanation: "V taške – в сумке." },
  { id: "prep-a1-11", type: "fill-blank", category: "Предлоги места", level: "A1", sentence: "Pes spí ___ stolom.", correctAnswer: "pod", explanation: "Pod stolom." },
  { id: "prep-a1-12", type: "build-sentence", category: "Предлоги места", level: "A1", sentence: "Кот под стулом.", correctAnswer: "Mačka je pod stoličkou", words: ["pod", "Mačka", "je", "stoličkou"], explanation: "Pod + Inštrumentál." },

  // ========== Добивка для "Настоящее время (A1)" – сейчас 10, станет 14 ==========
  { id: "pres-a1-11", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "On (variť) ___ večeru.", correctAnswer: "varí", explanation: "Varí." },
  { id: "pres-a1-12", type: "choose-form", category: "Настоящее время", level: "A1", sentence: "My ___ v Bratislave.", correctAnswer: "bývame", options: ["bývam", "bývame", "bývate"], explanation: "Bývame." },
  { id: "pres-a1-13", type: "fill-blank", category: "Настоящее время", level: "A1", sentence: "Ty (piť) ___ mlieko?", correctAnswer: "piješ", explanation: "Piješ." },
  { id: "pres-a1-14", type: "build-sentence", category: "Настоящее время", level: "A1", sentence: "Я работаю дома.", correctAnswer: "Ja pracujem doma", words: ["doma", "Ja", "pracujem"], explanation: "Pracujem." },

  // ========== Добивка для "Притяжательные прилагательные (A1)" – сейчас 7, станет 12 ==========
  { id: "poss-a1-8", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ kniha. (твоя)", correctAnswer: "tvoja", explanation: "Tvoja kniha." },
  { id: "poss-a1-9", type: "choose-form", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ stôl.", correctAnswer: "náš", options: ["náš", "naša", "naše"], explanation: "Náš stôl." },
  { id: "poss-a1-10", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ mesto. (их)", correctAnswer: "ich", explanation: "Ich – неизменяемое." },
  { id: "poss-a1-11", type: "build-sentence", category: "Притяжательные прилагательные", level: "A1", sentence: "Это моя мама.", correctAnswer: "To je moja mama", words: ["moja", "je", "mama", "To"], explanation: "Moja mama." },
  { id: "poss-a1-12", type: "fill-blank", category: "Притяжательные прилагательные", level: "A1", sentence: "To je ___ pero. (её)", correctAnswer: "jej", explanation: "Jej pero." },

  // ========== Добивка для "Союзы (a, ale, alebo) (A2)" – сейчас 10, станет 12 ==========
  { id: "conj-a2-11", type: "fill-blank", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Mám rada leto, ___ nie zimu.", correctAnswer: "ale", explanation: "Ale – но." },
  { id: "conj-a2-12", type: "build-sentence", category: "Союзы (a, ale, alebo)", level: "A2", sentence: "Он устал, но счастлив.", correctAnswer: "On je unavený, ale šťastný", words: ["ale", "unavený,", "je", "šťastný", "On"], explanation: "Ale." },

  // ========== Добивка для "Наречия частоты (A2)" – сейчас 6, станет 10 ==========
  { id: "adv-a2-7", type: "fill-blank", category: "Наречия частоты", level: "A2", sentence: "___ cestujem do zahraničia. (редко)", correctAnswer: "Málokedy", explanation: "Málokedy." },
  { id: "adv-a2-8", type: "choose-form", category: "Наречия частоты", level: "A2", sentence: "On ___ cvičí.", correctAnswer: "pravidelne", options: ["pravidelne", "niekedy", "včera"], explanation: "Pravidelne." },
  { id: "adv-a2-9", type: "fill-blank", category: "Наречия частоты", level: "A2", sentence: "___ chodím spať o desiatej. (обычно)", correctAnswer: "Obyčajne", explanation: "Obyčajne." },
  { id: "adv-a2-10", type: "build-sentence", category: "Наречия частоты", level: "A2", sentence: "Я никогда не курю.", correctAnswer: "Nikdy nefajčím", words: ["nefajčím", "Nikdy"], explanation: "Nikdy." },

  // ========== Добивка для "Предлоги направления (A2)" – сейчас 12, уже ок, пропускаем ==========

  // ========== Добивка для "Прилагательные и наречия (A2)" – сейчас 13, уже ок ==========

  // ========== Добивка для "Возвратные глаголы (B1)" – сейчас 8, станет 12 ==========
  { id: "ref-b1-10", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "On sa ___ celý deň. (učiť)", correctAnswer: "učil", explanation: "Učil sa." },
  { id: "ref-b1-11", type: "choose-form", category: "Возвратные глаголы", level: "B1", sentence: "My ___ na dovolenku.", correctAnswer: "tešíme sa", options: ["tešíme sa", "tešíme si", "teší sa"], explanation: "Tešiť sa." },
  { id: "ref-b1-12", type: "fill-blank", category: "Возвратные глаголы", level: "B1", sentence: "Poď, ___ sadneme.", correctAnswer: "sa", explanation: "Sadnúť si (rozprávkový variant)." },
  { id: "ref-b1-13", type: "build-sentence", category: "Возвратные глаголы", level: "B1", sentence: "Я тебе удивляюсь.", correctAnswer: "Čudujem sa ti", words: ["sa", "ti", "Čudujem"], explanation: "Čudovať sa + Datív." },

  // ========== Добивка для "Падежи – Nominatív (A2)" – сейчас 9, станет 12 ==========
  { id: "pad-nom-a2-10", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je hlavné mesto Slovenska?", correctAnswer: "Čo", explanation: "Čo – что." },
  { id: "pad-nom-a2-11", type: "choose-form", category: "Падежи (Nominatív)", level: "A2", sentence: "___ je tvoja mama?", correctAnswer: "Kto", options: ["Kto", "Čo", "Ako"], explanation: "Kto – кто." },
  { id: "pad-nom-a2-12", type: "fill-blank", category: "Падежи (Nominatív)", level: "A2", sentence: "___ sú tvoje topánky? (Где твои туфли?)", correctAnswer: "Kde", explanation: "Kde – где (Nominatív miesta)." },
  // ========== Добивка B2: Причастия (было 5, станет 10) ==========
  { id: "part-b2-6", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Mám ___ okno. (otvorený)", correctAnswer: "otvorené", explanation: "Otvorené – пассивное причастие ср.рода." },
  { id: "part-b2-7", type: "choose-form", category: "Причастия", level: "B2", sentence: "Videl som ___ knihu na stole.", correctAnswer: "ležiacu", options: ["ležiaca", "ležiacu", "ležiacej"], explanation: "Ležiacu – действительное причастие в аккузативе." },
  { id: "part-b2-8", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Dvere sú ___. (zamknúť)", correctAnswer: "zamknuté", explanation: "Zamknuté – пассив." },
  { id: "part-b2-9", type: "build-sentence", category: "Причастия", level: "B2", sentence: "Написанное письмо лежит на столе.", correctAnswer: "Napísaný list leží na stole", words: ["list", "na", "leží", "Napísaný", "stole"], explanation: "Napísaný – пассивное причастие." },
  { id: "part-b2-10", type: "fill-blank", category: "Причастия", level: "B2", sentence: "Dievča ___ do izby sa usmievalo.", correctAnswer: "vstúpiac", explanation: "Vstúpiac – деепричастие." },

  // ========== Добивка B2: Пассивный залог (было 4, станет 9) ==========
  { id: "pass-b2-5", type: "fill-blank", category: "Пассивный залог", level: "B2", sentence: "Táto budova ___ postavená v 19. storočí.", correctAnswer: "bola", explanation: "Bola postavená – жен.род." },
  { id: "pass-b2-6", type: "choose-form", category: "Пассивный залог", level: "B2", sentence: "Všetky úlohy ___ dokončené.", correctAnswer: "boli", options: ["bola", "boli", "bolo"], explanation: "Boli dokončené – множ.число." },
  { id: "pass-b2-7", type: "fill-blank", category: "Пассивный залог", level: "B2", sentence: "Okno ___ rozbité počas búrky.", correctAnswer: "bolo", explanation: "Bolo rozbité – ср.род." },
  { id: "pass-b2-8", type: "build-sentence", category: "Пассивный залог", level: "B2", sentence: "Этот мост был построен в прошлом году.", correctAnswer: "Tento most bol postavený minulý rok", words: ["bol", "minulý", "most", "postavený", "Tento", "rok"], explanation: "Bol postavený – пассив муж.рода." },
  { id: "pass-b2-9", type: "fill-blank", category: "Пассивный залог", level: "B2", sentence: "Jedlo ___ uvarené včera.", correctAnswer: "bolo", explanation: "Bolo uvarené." },

  // ========== Добивка C1: Сослагательное наклонение (было 6, станет 10) ==========
  { id: "konj-c1-7", type: "fill-blank", category: "Сослагательное наклонение", level: "C1", sentence: "Keby ___ o tom vedel, bol by mi povedal.", correctAnswer: "som", explanation: "Keby som o tom vedel." },
  { id: "konj-c1-8", type: "choose-form", category: "Сослагательное наклонение", level: "C1", sentence: "Bodaj ___ nikdy neodišiel!", correctAnswer: "by si", options: ["by si", "si", "by"], explanation: "Bodaj by si – выражение сожаления." },
  { id: "konj-c1-9", type: "fill-blank", category: "Сослагательное наклонение", level: "C1", sentence: "Nech sa ___ čokoľvek, vytrvám.", correctAnswer: "deje", explanation: "Nech sa deje čokoľvek." },
  { id: "konj-c1-10", type: "build-sentence", category: "Сослагательное наклонение", level: "C1", sentence: "Пусть он позвонит мне завтра.", correctAnswer: "Nech mi zajtra zavolá", words: ["zajtra", "Nech", "zavolá", "mi"], explanation: "Nech + 3-е лицо – побуждение." },

  // ========== Новая категория C1: Konjunktívne väzby s aby (6 заданий) ==========
  { id: "aby-c1-1", type: "fill-blank", category: "Конструкции с aby", level: "C1", sentence: "Povedal som mu, ___ prišiel včas.", correctAnswer: "aby", explanation: "Aby – чтобы." },
  { id: "aby-c1-2", type: "choose-form", category: "Конструкции с aby", level: "C1", sentence: "Zavolaj mi, ___ som nezabudol.", correctAnswer: "aby", options: ["aby", "že", "keby"], explanation: "Aby – цель." },
  { id: "aby-c1-3", type: "fill-blank", category: "Конструкции с aby", level: "C1", sentence: "Poprosil ma, ___ som mu pomohol.", correctAnswer: "aby", explanation: "Aby – просьба." },
  { id: "aby-c1-4", type: "build-sentence", category: "Конструкции с aby", level: "C1", sentence: "Я хочу, чтобы ты был счастлив.", correctAnswer: "Chcem, aby si bol šťastný", words: ["šťastný", "si", "Chcem,", "bol", "aby"], explanation: "Aby + minulý čas – желание." },
  { id: "aby-c1-5", type: "fill-blank", category: "Конструкции с aby", level: "C1", sentence: "Bojím sa, ___ sa niečo nestalo.", correctAnswer: "aby", explanation: "Aby – опасение." },
  { id: "aby-c1-6", type: "choose-form", category: "Конструкции с aby", level: "C1", sentence: "Pracujem tvrdo, ___ som mal lepší život.", correctAnswer: "aby", options: ["aby", "že", "keď"], explanation: "Aby – цель." },

  // ========== Новая категория C1: Slovosled vo vedľajších vetách (8 заданий) ==========
  { id: "slov-c1-1", type: "fill-blank", category: "Порядок слов в придаточных", level: "C1", sentence: "Povedal, že ___ príde zajtra.", correctAnswer: "on", explanation: "On – подлежащее после že." },
  { id: "slov-c1-2", type: "choose-form", category: "Порядок слов в придаточных", level: "C1", sentence: "Keď ___ príde, zavolám ti.", correctAnswer: "on", options: ["on", "príde on", "príde"], explanation: "On príde – порядок в придаточном." },
  { id: "slov-c1-3", type: "fill-blank", category: "Порядок слов в придаточных", level: "C1", sentence: "Kniha, ___ som čítal, bola skvelá.", correctAnswer: "ktorú", explanation: "Ktorú – vzťažné zámeno." },
  { id: "slov-c1-4", type: "build-sentence", category: "Порядок слов в придаточных", level: "C1", sentence: "Я знаю, что он прав.", correctAnswer: "Viem, že on má pravdu", words: ["pravdu", "on", "Viem,", "má", "že"], explanation: "Že + veta s vlastným podmetom." },
  { id: "slov-c1-5", type: "fill-blank", category: "Порядок слов в придаточных", level: "C1", sentence: "Myslím, že ___ si to vedel.", correctAnswer: "ty", explanation: "Ty si to vedel." },
  { id: "slov-c1-6", type: "choose-form", category: "Порядок слов в придаточных", level: "C1", sentence: "Hoci ___ pršalo, išli sme von.", correctAnswer: "vonku", options: ["vonku", "v", "na"], explanation: "Vonku pršalo – обстоятельство места." },
  { id: "slov-c1-7", type: "fill-blank", category: "Порядок слов в придаточных", level: "C1", sentence: "Čím viac sa učíš, ___ viac vieš.", correctAnswer: "tým", explanation: "Tým – čím... tým." },
  { id: "slov-c1-8", type: "build-sentence", category: "Порядок слов в придаточных", level: "C1", sentence: "Если бы я знал, я бы пришёл.", correctAnswer: "Keby som vedel, prišiel by som", words: ["prišiel", "som", "by", "vedel,", "Keby"], explanation: "Keby + minulý, kondicionál." },

  // ========== Добивка C1: Относительные придаточные (было 5, станет 10) ==========
  { id: "rel-c1-5", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "To je človek, ___ som včera stretol.", correctAnswer: "ktorého", explanation: "Ktorého – Akuzatív." },
  { id: "rel-c1-6", type: "choose-form", category: "Относительные придаточные", level: "C1", sentence: "Mesto, ___ som vyrastal, je malé.", correctAnswer: "v ktorom", options: ["v ktorom", "ktoré", "ktorého"], explanation: "V ktorom – Lokál." },
  { id: "rel-c1-7", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "Dôvod, ___ odišiel, je nejasný.", correctAnswer: "prečo", explanation: "Prečo – почему." },
  { id: "rel-c1-8", type: "build-sentence", category: "Относительные придаточные", level: "C1", sentence: "Проблема, о которой мы говорили, решена.", correctAnswer: "Problém, o ktorom sme hovorili, je vyriešený", words: ["o", "sme", "je", "hovorili,", "ktorom", "Problém,", "vyriešený"], explanation: "O ktorom – Lokál po predložke." },
  { id: "rel-c1-9", type: "fill-blank", category: "Относительные придаточные", level: "C1", sentence: "Žena, ___ som dal kvet, sa usmiala.", correctAnswer: "ktorej", explanation: "Ktorej – Datív." },
  { id: "rel-c1-10", type: "choose-form", category: "Относительные придаточные", level: "C1", sentence: "Film, ___ sme pozerali, bol dlhý.", correctAnswer: "ktorý", options: ["ktorý", "ktorého", "ktorému"], explanation: "Ktorý – Nominatív." },
]