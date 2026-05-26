"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { words } from "./../data/words"

// Строим карту переводов из words.ts
const translationMap = new Map<string, string>()

words.forEach(word => {
  const key = word.slovak.toLowerCase().replace(/[.,!?;:()\-"']/g, "")
  if (!translationMap.has(key)) {
    translationMap.set(key, word.russian)
  }
})

// Расширенный словарь для всех слов из текстов A1-B2
const extendedTranslations: [string, string][] = [
  ["som", "я есть / являюсь"],
  ["si", "ты есть / являешься"],
  ["je", "он/она/оно есть / является"],
  ["sme", "мы есть / являемся"],
  ["ste", "вы есть / являетесь"],
  ["sú", "они есть / являются"],
  ["a", "и"],
  ["ale", "но"],
  ["že", "что"],
  ["to", "это"],
  ["na", "на, в (направление)"],
  ["do", "в, до"],
  ["z", "из, с"],
  ["po", "по, после"],
  ["pre", "для"],
  ["so", "с (инструменталь)"],
  ["ku", "к"],
  ["od", "от"],
  ["kde", "где"],
  ["kedy", "когда"],
  ["prečo", "почему"],
  ["čo", "что"],
  ["ktorý", "который"],
  ["ten", "тот"],
  ["tento", "этот"],
  ["veľmi", "очень"],
  ["trochu", "немного"],
  ["teraz", "сейчас"],
  ["potom", "потом"],
  ["dnes", "сегодня"],
  ["zajtra", "завтра"],
  ["včera", "вчера"],
  ["tu", "здесь"],
  ["tam", "там"],
  ["už", "уже"],
  ["ešte", "ещё"],
  ["len", "только"],
  ["aj", "также"],
  ["tak", "так"],
  ["kto", "кто"],
  ["aký", "какой"],
  ["preto", "поэтому"],
  ["lebo", "потому что"],
  ["hneď", "сразу"],
  ["spolu", "вместе"],
  ["okolo", "вокруг"],
  ["medzi", "между"],
  ["vedľa", "рядом"],
  ["blízko", "близко"],
  ["ďaleko", "далеко"],
  ["často", "часто"],
  ["zriedka", "редко"],
  ["vždy", "всегда"],
  ["nikdy", "никогда"],
  ["niekedy", "иногда"],
  ["možno", "возможно"],
  ["určite", "определённо"],
  ["samozrejme", "конечно"],
  ["pravdepodobne", "вероятно"],
  ["napríklad", "например"],
  ["hlavne", "главным образом"],
  ["najmä", "особенно"],
  ["aspoň", "по крайней мере"],
  ["teda", "итак"],
  ["vtedy", "тогда"],
  ["odvtedy", "с тех пор"],
  ["potiaľ", "до сих пор"],
  ["byť", "быть"],
  ["mať", "иметь"],
  ["ísť", "идти"],
  ["chodiť", "ходить"],
  ["cestovať", "путешествовать"],
  ["pozerať", "смотреть"],
  ["navštíviť", "посетить"],
  ["objednať", "заказать"],
  ["platiť", "платить"],
  ["stáť", "стоять / стоить"],
  ["pracovať", "работать"],
  ["študovať", "учиться"],
  ["učiť sa", "учиться (самому)"],
  ["rozprávať sa", "разговаривать"],
  ["tráviť čas", "проводить время"],
  ["odhlásiť sa", "зарегистрироваться (на рейс)"],
  ["odovzdať", "сдать"],
  ["vyzerať", "выглядеть"],
  ["pomôcť", "помочь"],
  ["cítiť sa", "чувствовать себя"],
  ["veriť", "верить"],
  ["dúfať", "надеяться"],
  ["chutiť", "нравиться (о еде)"],
  ["variť", "готовить"],
  ["prať", "стирать"],
  ["upraviť", "прибрать"],
  ["spať", "спать"],
  ["bežať", "бежать"],
  ["letieť", "лететь"],
  ["plávať", "плавать"],
  ["sedieť", "сидеть"],
  ["ležať", "лежать"],
  ["otvoriť", "открыть"],
  ["zavrieť", "закрыть"],
  ["začať", "начать"],
  ["skončiť", "закончить"],
  ["robiť", "делать"],
  ["urobiť", "сделать"],
  ["písať", "писать"],
  ["napísať", "написать"],
  ["čítať", "читать"],
  ["prečítať", "прочитать"],
  ["jesť", "есть"],
  ["zjesť", "съесть"],
  ["piť", "пить"],
  ["vypiť", "выпить"],
  ["chcieť", "хотеть"],
  ["môcť", "мочь"],
  ["musieť", "долженствовать"],
  ["vedieť", "знать / уметь"],
  ["poznať", "знать (кого-то)"],
  ["rozumieť", "понимать"],
  ["počuť", "слышать"],
  ["počúvať", "слушать"],
  ["vidieť", "видеть"],
  ["pozerať sa", "смотреть на"],
  ["dotknúť sa", "тронуть"],
  ["cítiť", "чувствовать"],
  ["myslieť", "думать"],
  ["báť sa", "бояться"],
  ["smiať sa", "смеяться"],
  ["plakať", "плакать"],
  ["usmievať sa", "улыбаться"],
  ["chlieb", "хлеб"],
  ["mlieko", "молоко"],
  ["voda", "вода"],
  ["káva", "кофе"],
  ["čaj", "чай"],
  ["účet", "счёт"],
  ["reštaurácia", "ресторан"],
  ["priateľ", "друг"],
  ["priatelia", "друзья"],
  ["kapustnica", "капустный суп"],
  ["vyprážaný syr", "жареный сыр"],
  ["obsluha", "обслуживание"],
  ["vlak", "поезд"],
  ["cestovanie", "путешествие"],
  ["okno", "окно"],
  ["mesiac", "месяц"],
  ["Vysoké Tatry", "Высокие Татры"],
  ["výhľad", "вид (пейзаж)"],
  ["letisko", "аэропорт"],
  ["batožina", "багаж"],
  ["kontrola pasov", "паспортный контроль"],
  ["Praha", "Прага"],
  ["dovolenka", "отпуск"],
  ["rodina", "семья"],
  ["matka", "мать"],
  ["mama", "мама"],
  ["otec", "отец"],
  ["brat", "брат"],
  ["sestra", "сестра"],
  ["lekárka", "врач (женщина)"],
  ["obchod", "магазин"],
  ["škola", "школа"],
  ["čas", "время"],
  ["deň", "день"],
  ["ráno", "утро"],
  ["večer", "вечер"],
  ["noc", "ночь"],
  ["práca", "работа"],
  ["kariéra", "карьера"],
  ["firma", "фирма"],
  ["programátor", "программист"],
  ["manažér", "менеджер"],
  ["tím", "команда"],
  ["pohovor", "собеседование"],
  ["otázka", "вопрос"],
  ["odpoveď", "ответ"],
  ["ekológia", "экология"],
  ["odpad", "отходы"],
  ["plast", "пластик"],
  ["sklo", "стекло"],
  ["papier", "бумага"],
  ["kontajner", "контейнер"],
  ["planéta", "планета"],
  ["zdravie", "здоровье"],
  ["lekár", "врач"],
  ["teplota", "температура"],
  ["hlava", "голова"],
  ["liek", "лекарство"],
  ["príroda", "природа"],
  ["les", "лес"],
  ["prechádzka", "прогулка"],
  ["vták", "птица"],
  ["spev", "пение"],
  ["ihličie", "хвоя"],
  ["jeseň", "осень"],
  ["list", "лист"],
  ["farba", "цвет"],
  ["zoo", "зоопарк"],
  ["lev", "лев"],
  ["tiger", "тигр"],
  ["opica", "обезьяна"],
  ["slon", "слон"],
  ["tučniak", "пингвин"],
  ["zvieratá", "животные"],
  ["priestor", "пространство"],
  ["digitálna budúcnosť", "цифровое будущее"],
  ["umelá inteligencia", "искусственный интеллект"],
  ["automatizácia", "автоматизация"],
  ["zručnosť", "навык"],
  ["konkurencieschopný", "конкурентоспособный"],
  ["vzdelávanie", "образование"],
  ["celoživotný", "пожизненный"],
  ["tradícia", "традиция"],
  ["zvyk", "обычай"],
  ["fašiangy", "масленица"],
  ["máj", "майское дерево"],
  ["vinobranie", "сбор винограда"],
  ["komunita", "сообщество"],
  ["generácia", "поколение"],
  ["hrad", "замок"],
  ["Bratislavský hrad", "Братиславский замок"],
  ["dominanta", "доминанта"],
  ["hlavné mesto", "столица"],
  ["kopec", "холм"],
  ["Dunaj", "Дунай"],
  ["korunovácia", "коронация"],
  ["uhorský kráľ", "венгерский король"],
  ["dobrý", "хороший"],
  ["pekný", "красивый"],
  ["milý", "милый"],
  ["pohodlný", "удобный"],
  ["úžasný", "потрясающий"],
  ["stresujúci", "напряжённый"],
  ["zaujímavý", "интересный"],
  ["dôležitý", "важный"],
  ["žltý", "жёлтый"],
  ["zelený", "зелёный"],
  ["modrý", "синий"],
  ["vážny", "серьёзный"],
  ["tichý", "тихий"],
  ["pokojný", "спокойный"],
  ["vtipný", "смешной"],
  ["spokojný", "довольный"],
  ["ľudový", "народный"],
  ["zdravý", "здоровый"],
  ["pravidelný", "регулярный"],
  ["rýchly", "быстрый"],
  ["pomalý", "медленный"],
  ["studený", "холодный"],
  ["teplý", "тёплый"],
  ["nový", "новый"],
  ["starý", "старый"],
  ["mladý", "молодой"],
  ["šťastný", "счастливый"],
  ["smutný", "грустный"],
  ["nahnevaný", "злой"],
  ["unavený", "уставший"],
  ["nervózny", "нервный"],
]

extendedTranslations.forEach(([slovak, russian]) => {
  const key = slovak.toLowerCase().replace(/[.,!?;:()\-"']/g, "")
  if (!translationMap.has(key)) {
    translationMap.set(key, russian)
  }
})

function getTranslation(word: string): string | undefined {
  const normalized = word.toLowerCase().replace(/[.,!?;:()\-"']/g, "")
  return translationMap.get(normalized)
}

type InteractiveTextProps = {
  text: string
}

export default function InteractiveText({ text }: InteractiveTextProps) {
  const [wordsArray, setWordsArray] = useState<string[]>([])

  useEffect(() => {
    const tokens = text.split(/(\s+)/).filter(t => t.trim().length > 0)
    setWordsArray(tokens)
  }, [text])

  const handleWordClick = (word: string) => {
    const translation = getTranslation(word)
    alert(translation ? `${word} → ${translation}` : `Перевод для "${word}" не найден.`)
  }

  const isWord = (token: string) => /[a-zA-ZáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]/.test(token)

  return (
    <div className="leading-relaxed text-gray-800 dark:text-gray-200">
      {wordsArray.map((token, idx) => {
        if (isWord(token)) {
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(249, 115, 22, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              onClick={() => handleWordClick(token)}
              className="cursor-pointer rounded-md px-0.5 transition-all inline-block font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
              title={`Нажми для перевода (${token})`}
            >
              {token}
            </motion.button>
          )
        } else {
          // Обычный текст (пробелы, знаки препинания)
          return (
            <span key={idx} className="text-gray-800 dark:text-gray-200">
              {token}
            </span>
          )
        }
      })}
    </div>
  )
}