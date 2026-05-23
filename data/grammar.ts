import { type Word } from "./words"

export interface GrammarWord extends Word {
  hint?: string
}

export const grammarTasks: GrammarWord[] = [
  // ==========================================
  // Глагол "Byť" (быть) – A1
  // ==========================================
  { slovak: "Ja som študent", russian: "Я студент", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "Ja som" },
  { slovak: "Ty si unavený", russian: "Ты уставший", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "Ty si" },
  { slovak: "On je lekár", russian: "Он врач", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "On je" },
  { slovak: "My sme doma", russian: "Мы дома", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "My sme" },
  { slovak: "Vy ste priatelia", russian: "Вы друзья", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "Vy ste" },
  { slovak: "Oni sú v práci", russian: "Они на работе", category: "⚙️ Глагол 'Byť'", level: "A1", hint: "Oni sú" },
  { slovak: "Nie som chorý", russian: "Я не болен", category: "⚙️ Глагол 'Byť'", level: "A2", hint: "Nie som" },

  // ==========================================
  // Глагол "Mať" (иметь) – A1-A2
  // ==========================================
  { slovak: "Mám otázku", russian: "У меня есть вопрос", category: "⚙️ Глагол 'Mať'", level: "A1", hint: "Mám" },
  { slovak: "Máš čas?", russian: "У тебя есть время?", category: "⚙️ Глагол 'Mať'", level: "A1", hint: "Máš" },
  { slovak: "Má auto", russian: "У него есть машина", category: "⚙️ Глагол 'Mať'", level: "A1", hint: "Má" },
  { slovak: "Máme peniaze", russian: "У нас есть деньги", category: "⚙️ Глагол 'Mať'", level: "A1", hint: "Máme" },
  { slovak: "Máte deti?", russian: "У вас есть дети?", category: "⚙️ Глагол 'Mať'", level: "A2", hint: "Máte" },
  { slovak: "Nemám problém", russian: "У меня нет проблемы", category: "⚙️ Глагол 'Mať'", level: "A2", hint: "Nemám" },

  // ==========================================
  // Прилагательные – род и окончания (A2)
  // ==========================================
  { slovak: "To je pekný dom", russian: "Это красивый дом", category: "⚙️ Род и окончания", level: "A2", hint: "муж.род -ý" },
  { slovak: "To je pekná ulica", russian: "Это красивая улица", category: "⚙️ Род и окончания", level: "A2", hint: "жен.род -á" },
  { slovak: "To je pekné mesto", russian: "Это красивый город (ср.род)", category: "⚙️ Род и окончания", level: "A2", hint: "ср.род -é" },
  { slovak: "To je veľký strom", russian: "Это большое дерево", category: "⚙️ Род и окончания", level: "A2", hint: "муж.род -ý" },
  { slovak: "To je veľká láska", russian: "Это большая любовь", category: "⚙️ Род и окончания", level: "A2", hint: "жен.род -á" },

  // ==========================================
  // Падежи – Nominatív, Akuzatív, Genitív, Datív, Lokál, Inštrumentál (B1-B2)
  // ==========================================
  { slovak: "Kto je to? To je môj brat.", russian: "Кто это? Это мой брат.", category: "⚙️ Падежи (Nominatív)", level: "A2", hint: "Nominatív – кто? что?" },
  { slovak: "Čo je to? To je nové auto.", russian: "Что это? Это новая машина.", category: "⚙️ Падежи (Nominatív)", level: "A2", hint: "Nominatív" },
  { slovak: "Vidím pekný dom.", russian: "Я вижу красивый дом.", category: "⚙️ Падежи (Akuzatív)", level: "B1", hint: "Akuzatív – koho? čo?" },
  { slovak: "Čítam zaujímavú knihu.", russian: "Я читаю интересную книгу.", category: "⚙️ Падежи (Akuzatív)", level: "B1", hint: "žen.rod -ú" },
  { slovak: "Bez otca nemôžem ísť.", russian: "Без отца я не могу идти.", category: "⚙️ Падежи (Genitív)", level: "B1", hint: "bez koho? čoho?" },
  { slovak: "Potrebujem liter mlieka.", russian: "Мне нужен литр молока.", category: "⚙️ Падежи (Genitív)", level: "B1", hint: "číselné vyjadrenie množstva" },
  { slovak: "Dávam darček sestre.", russian: "Даю подарок сестре.", category: "⚙️ Падежи (Datív)", level: "B1", hint: "komu? čomu? sestre" },
  { slovak: "Pomôžem kamarátovi.", russian: "Помогу другу.", category: "⚙️ Падежи (Datív)", level: "B1", hint: "kamarátovi" },
  { slovak: "Kniha je na stole.", russian: "Книга на столе.", category: "⚙️ Падежи (Lokál)", level: "B1", hint: "na stole" },
  { slovak: "Žijeme v Bratislave.", russian: "Мы живём в Братиславе.", category: "⚙️ Падежи (Lokál)", level: "B1", hint: "v Bratislave" },
  { slovak: "Idem so sestrou.", russian: "Иду с сестрой.", category: "⚙️ Падежи (Inštrumentál)", level: "B1", hint: "s kým? s čím?" },
  { slovak: "Píšem perom.", russian: "Пишу ручкой.", category: "⚙️ Падежи (Inštrumentál)", level: "B1", hint: "pomocou čoho" },

  // ==========================================
  // Préteritum (прошедшее время) – A2
  // ==========================================
  { slovak: "Včera som pracoval.", russian: "Вчера я работал.", category: "⚙️ Préteritum", level: "A2", hint: "pracoval" },
  { slovak: "Minulý rok som bol v Prahe.", russian: "В прошлом году я был в Праге.", category: "⚙️ Préteritum", level: "A2", hint: "bol" },
  { slovak: "Už som to urobil.", russian: "Я уже это сделал.", category: "⚙️ Préteritum", level: "A2", hint: "urobil" },
  { slovak: "Čítali sme knihu.", russian: "Мы читали книгу.", category: "⚙️ Préteritum", level: "A2", hint: "Čítali" },

  // ==========================================
  // Budúci čas (будущее время) – B1
  // ==========================================
  { slovak: "Zajtra budem študovať.", russian: "Завтра я буду учиться.", category: "⚙️ Budúci čas", level: "B1", hint: "budem + infinitív" },
  { slovak: "O rok pôjdem na vysokú školu.", russian: "Через год я пойду в университет.", category: "⚙️ Budúci čas", level: "B1", hint: "pôjdem (ísť)" },
  { slovak: "Čoskoro príde jar.", russian: "Скоро придёт весна.", category: "⚙️ Budúci čas", level: "B1", hint: "príde" },
  { slovak: "Nebudem sa báť.", russian: "Я не буду бояться.", category: "⚙️ Budúci čas", level: "B1", hint: "nebudem + infinitív" },

  // ==========================================
  // Модальные глаголы – A2-B1
  // ==========================================
  { slovak: "Môžem ísť von?", russian: "Могу я выйти на улицу?", category: "⚙️ Modálne slovesá", level: "A2", hint: "môcť – možnosť" },
  { slovak: "Chcem si kúpiť auto.", russian: "Хочу купить машину.", category: "⚙️ Modálne slovesá", level: "A2", hint: "chcieť – túžba" },
  { slovak: "Musím sa učiť.", russian: "Я должен учиться.", category: "⚙️ Modálne slovesá", level: "B1", hint: "musieť – povinnosť" },
  { slovak: "Smieš vstúpiť.", russian: "Ты можешь войти (разрешено).", category: "⚙️ Modálne slovesá", level: "B1", hint: "smieť – dovolenie" },
  { slovak: "Nemôžem spať.", russian: "Я не могу спать.", category: "⚙️ Modálne slovesá", level: "B1", hint: "zápor" },

  // ==========================================
  // Stupňovanie prídavných mien (сравнение прилагательных) – B1
  // ==========================================
  { slovak: "Brat je starší ako ja.", russian: "Брат старше меня.", category: "⚙️ Stupňovanie", level: "B1", hint: "starší" },
  { slovak: "Táto kniha je zaujímavejšia.", russian: "Эта книга интереснее.", category: "⚙️ Stupňovanie", level: "B1", hint: "zaujímavejšia" },
  { slovak: "Najkrajšie kvety sú v záhrade.", russian: "Самые красивые цветы в саду.", category: "⚙️ Stupňovanie", level: "B1", hint: "Najkrajšie (superlatív)" },
  { slovak: "Auto je rýchlejšie ako bicykel.", russian: "Машина быстрее велосипеда.", category: "⚙️ Stupňovanie", level: "B1", hint: "rýchlejšie ako" },

  // ==========================================
  // Zámená (местоимения) – A2
  // ==========================================
  { slovak: "To je môj dom.", russian: "Это мой дом.", category: "⚙️ Zámená", level: "A2", hint: "môj" },
  { slovak: "Tvoja práca je dobrá.", russian: "Твоя работа хорошая.", category: "⚙️ Zámená", level: "A2", hint: "tvoja" },
  { slovak: "Jeho auto je nové.", russian: "Его машина новая.", category: "⚙️ Zámená", level: "A2", hint: "jeho" },
  { slovak: "Našli sme ich stratený kľúč.", russian: "Мы нашли их потерянный ключ.", category: "⚙️ Zámená", level: "B1", hint: "ich" },

  // ==========================================
  // Spojky (союзы) – B1-B2
  // ==========================================
  { slovak: "Počkám, kým sa vrátiš.", russian: "Подожду, пока вернёшься.", category: "⚙️ Spojky", level: "B1", hint: "kým" },
  { slovak: "Zavolám ti, len čo prídem.", russian: "Позвоню тебе, как только приду.", category: "⚙️ Spojky", level: "B2", hint: "len čo" },
  { slovak: "Ospravedlňujem sa, lebo som meškal.", russian: "Извиняюсь, потому что опоздал.", category: "⚙️ Spojky", level: "B1", hint: "lebo" },
  { slovak: "Chcem ísť von, hoci prší.", russian: "Хочу выйти на улицу, хотя идёт дождь.", category: "⚙️ Spojky", level: "B2", hint: "hoci" },

  // ==========================================
  // Príčastia (причастия) – B2
  // ==========================================
  { slovak: "Usmievajúc sa, pozdravil.", russian: "Улыбаясь, поздоровался.", category: "⚙️ Príčastia", level: "B2", hint: "Usmievajúc sa" },
  { slovak: "Napísaný list leží na stole.", russian: "Написанное письмо лежит на столе.", category: "⚙️ Príčastia", level: "B2", hint: "Napísaný" },
  { slovak: "Uvarená káva vychladla.", russian: "Сваренный кофе остыл.", category: "⚙️ Príčastia", level: "B2", hint: "Uvarená" },

  // ==========================================
  // НОВЫЕ ОБЪЕДИНЁННЫЕ КАТЕГОРИИ (с достаточным количеством заданий)
  // ==========================================

  // ---------- Reflexívne slovesá (sa/si) – A2-B1 (8 заданий) ----------
  { slovak: "Umývam sa každé ráno.", russian: "Я умываюсь каждое утро.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "A2", hint: "sa – seba, sebe" },
  { slovak: "Češem sa pred zrkadlom.", russian: "Я причёсываюсь перед зеркалом.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "A2", hint: "češať sa" },
  { slovak: "Učíme sa po slovensky.", russian: "Мы учим словацкий (учимся).", category: "⚙️ Reflexívne slovesá (sa/si)", level: "A2", hint: "učiť sa" },
  { slovak: "Kúpil som si nový telefón.", russian: "Я купил себе новый телефон.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "B1", hint: "si – pre seba" },
  { slovak: "Dávam si pozor na ceste.", russian: "Я осторожен на дороге.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "B1", hint: "dávať si pozor" },
  { slovak: "Pamätám si tvoje meno.", russian: "Я помню твоё имя.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "B1", hint: "pamätať si" },
  { slovak: "Obul som sa a vyšiel.", russian: "Я обулся и вышел.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "B1", hint: "obuť sa" },
  { slovak: "Zvyknem si na nové prostredie.", russian: "Я привыкаю к новой среде.", category: "⚙️ Reflexívne slovesá (sa/si)", level: "B2", hint: "zvyknúť si" },

  // ---------- Slovesá pohybu s predponami – B1-B2 (10 заданий) ----------
  { slovak: "Prídem o piatej.", russian: "Я приду в пять.", category: "⚙️ Slovesá pohybu (predpony)", level: "B1", hint: "prísť (dokonavý)" },
  { slovak: "Odídeš zajtra?", russian: "Ты уедешь завтра?", category: "⚙️ Slovesá pohybu (predpony)", level: "B1", hint: "odísť" },
  { slovak: "Prešli sme celý park.", russian: "Мы прошли через весь парк.", category: "⚙️ Slovesá pohybu (predpony)", level: "B1", hint: "prejsť" },
  { slovak: "Vybehol som na autobus.", russian: "Я выбежал на автобус.", category: "⚙️ Slovesá pohybu (predpony)", level: "B2", hint: "vybehnúť" },
  { slovak: "Dobehol do cieľa.", russian: "Добежал до финиша.", category: "⚙️ Slovesá pohybu (predpony)", level: "B2", hint: "dobehnúť" },
  { slovak: "Vletel do miestnosti.", russian: "Влетел в комнату.", category: "⚙️ Slovesá pohybu (predpony)", level: "B2", hint: "vletieť" },
  { slovak: "Odplával z brehu.", russian: "Отплыл от берега.", category: "⚙️ Slovesá pohybu (predpony)", level: "B2", hint: "odplávať" },
  { slovak: "Vystúpil z autobusu.", russian: "Вышел из автобуса.", category: "⚙️ Slovesá pohybu (predpony)", level: "B1", hint: "vystúpiť" },
  { slovak: "Došiel domov.", russian: "Дошёл домой.", category: "⚙️ Slovesá pohybu (predpony)", level: "B1", hint: "dojsť" },
  { slovak: "Preletel cez oceán.", russian: "Перелетел через океан.", category: "⚙️ Slovesá pohybu (predpony)", level: "B2", hint: "preletieť" },

  // ---------- Vidové dvojice – B1-B2 (12 заданий) ----------
  { slovak: "Robiť / urobiť", russian: "делать / сделать", category: "⚙️ Vidové dvojice", level: "B1", hint: "dokonavý = urobiť" },
  { slovak: "Písať / napísať", russian: "писать / написать", category: "⚙️ Vidové dvojice", level: "B1", hint: "napísať" },
  { slovak: "Čítať / prečítať", russian: "читать / прочитать", category: "⚙️ Vidové dvojice", level: "B1", hint: "prečítať" },
  { slovak: "Jesť / zjesť", russian: "есть / съесть", category: "⚙️ Vidové dvojice", level: "B1", hint: "zjesť" },
  { slovak: "Piť / vypiť", russian: "пить / выпить", category: "⚙️ Vidové dvojice", level: "B1", hint: "vypiť" },
  { slovak: "Otvárať / otvoriť", russian: "открывать / открыть", category: "⚙️ Vidové dvojice", level: "B1", hint: "otvoriť" },
  { slovak: "Zatvárať / zavrieť", russian: "закрывать / закрыть", category: "⚙️ Vidové dvojice", level: "B1", hint: "zavrieť" },
  { slovak: "Začínať / začať", russian: "начинать / начать", category: "⚙️ Vidové dvojice", level: "B1", hint: "začať" },
  { slovak: "Končiť / skončiť", russian: "заканчивать / закончить", category: "⚙️ Vidové dvojice", level: "B1", hint: "skončiť" },
  { slovak: "Berať / vziať", russian: "брать / взять", category: "⚙️ Vidové dvojice", level: "B1", hint: "vziať" },
  { slovak: "Dávať / dať", russian: "давать / дать", category: "⚙️ Vidové dvojice", level: "B1", hint: "dať" },
  { slovak: "Chytať / chytiť", russian: "ловить / поймать", category: "⚙️ Vidové dvojice", level: "B1", hint: "chytiť" },

  // ---------- Imperatív (rozkazovací spôsob) – A2-B1 (8 заданий) ----------
  { slovak: "Počkajte chvíľu!", russian: "Подождите минуту!", category: "⚙️ Imperatív", level: "A2", hint: "rozkaz pre vy" },
  { slovak: "Poď sem!", russian: "Иди сюда!", category: "⚙️ Imperatív", level: "A2", hint: "poď (ty)" },
  { slovak: "Povedz to ešte raz.", russian: "Скажи это ещё раз.", category: "⚙️ Imperatív", level: "A2", hint: "povedz (ty)" },
  { slovak: "Zavolajte neskôr.", russian: "Позвоните позже.", category: "⚙️ Imperatív", level: "A2", hint: "zavolajte" },
  { slovak: "Napíš list!", russian: "Напиши письмо!", category: "⚙️ Imperatív", level: "A2", hint: "napíš" },
  { slovak: "Poďme do kina!", russian: "Пойдём в кино!", category: "⚙️ Imperatív", level: "B1", hint: "poďme (my)" },
  { slovak: "Nehnevaj sa!", russian: "Не сердись!", category: "⚙️ Imperatív", level: "B1", hint: "negatívny rozkaz" },
  { slovak: "Nerob hluk!", russian: "Не шуми!", category: "⚙️ Imperatív", level: "B1", hint: "nerob" },

  // ---------- Negácia – A2-B1 (6 заданий) ----------
  { slovak: "Nekupujem to.", russian: "Я не покупаю это.", category: "⚙️ Negácia", level: "A2", hint: "nie + sloveso" },
  { slovak: "Neboli sme doma.", russian: "Мы не были дома.", category: "⚙️ Negácia", level: "A2", hint: "neboli" },
  { slovak: "Nikdy neklame.", russian: "Никогда не лжёт.", category: "⚙️ Negácia", level: "B1", hint: "nikdy + nie" },
  { slovak: "Neviem nič.", russian: "Я ничего не знаю.", category: "⚙️ Negácia", level: "B1", hint: "zdvojený zápor" },
  { slovak: "Nikto neprišiel.", russian: "Никто не пришёл.", category: "⚙️ Negácia", level: "B1", hint: "nikto + nie" },
  { slovak: "Nikde nie je pokoj.", russian: "Нигде нет покоя.", category: "⚙️ Negácia", level: "B1", hint: "nikde + nie" },

  // ---------- Podmieňovacie vety (reálne a nereálne) – B1-C1 (12 заданий) ----------
  { slovak: "Ak prší, ostanem doma.", russian: "Если пойдёт дождь, я останусь дома.", category: "⚙️ Podmieňovacie vety", level: "B1", hint: "ak + prítomný čas" },
  { slovak: "Keby som vedel, povedal by som ti.", russian: "Если бы я знал, сказал бы тебе.", category: "⚙️ Podmieňovacie vety", level: "B2", hint: "keby + minulý čas, by som + minulý čas" },
  { slovak: "Ak budeš študovať, spravíš skúšku.", russian: "Если будешь учиться, сдашь экзамен.", category: "⚙️ Podmieňovacie vety", level: "B1", hint: "ak + budúci čas" },
  { slovak: "Keby nepršalo, išli by sme na výlet.", russian: "Если бы не шёл дождь, мы бы пошли на экскурсию.", category: "⚙️ Podmieňovacie vety", level: "B2", hint: "keby + minulý čas, by sme + minulý čas" },
  { slovak: "Ak sa budeš učiť, uspeješ.", russian: "Если будешь учиться, добьёшься успеха.", category: "⚙️ Podmieňovacie vety", level: "B1", hint: "ak + budúci čas" },
  { slovak: "Keby som mal peniaze, kúpil by som auto.", russian: "Если бы у меня были деньги, купил бы машину.", category: "⚙️ Podmieňovacie vety", level: "B2", hint: "keby som mal" },
  { slovak: "Ak prídeš neskoro, nečakáme.", russian: "Если придёшь поздно, не ждём.", category: "⚙️ Podmieňovacie vety", level: "B1", hint: "ak + prítomný čas" },
  { slovak: "Keby som ťa nepoznal, neveril by som ti.", russian: "Если бы я тебя не знал, не поверил бы.", category: "⚙️ Podmieňovacie vety", level: "C1", hint: "keby + minulý čas, by + minulý čas" },
  { slovak: "Ak by si chcel, pomôžem ti.", russian: "Если бы ты хотел, я помогу тебе.", category: "⚙️ Podmieňovacie vety", level: "C1", hint: "ak by + minulý čas" },
  { slovak: "Keby nebolo teba, neviem, čo by som robil.", russian: "Если бы не ты, не знаю, что бы я делал.", category: "⚙️ Podmieňovacie vety", level: "C1", hint: "keby nebolo + Gen." },

  // ---------- Zložité spojky (napriek tomu, že, hoci, keďže, pokiaľ) – B2-C1 (10 заданий) ----------
  { slovak: "Išiel von, hoci pršalo.", russian: "Вышел на улицу, хотя шёл дождь.", category: "⚙️ Zložité spojky", level: "B2", hint: "hoci – hoci aj" },
  { slovak: "Keďže nemám čas, neprídem.", russian: "Поскольку у меня нет времени, я не приду.", category: "⚙️ Zložité spojky", level: "B2", hint: "keďže – pretože" },
  { slovak: "Pokiaľ sa budeš učiť, uspeješ.", russian: "Пока будешь учиться, добьёшься успеха.", category: "⚙️ Zložité spojky", level: "B2", hint: "pokiaľ – za predpokladu, že" },
  { slovak: "Napriek tomu, že meškal, prišiel.", russian: "Несмотря на то, что опаздывал, пришёл.", category: "⚙️ Zložité spojky", level: "C1", hint: "napriek tomu, že – protiklad" },
  { slovak: "Hneď ako príde, zavolám ti.", russian: "Как только придёт, позвоню тебе.", category: "⚙️ Zložité spojky", level: "B2", hint: "hneď ako" },
  { slovak: "Kým si spal, ja som pracoval.", russian: "Пока ты спал, я работал.", category: "⚙️ Zložité spojky", level: "B1", hint: "kým" },
  { slovak: "Čím viac sa učíš, tým viac vieš.", russian: "Чем больше учишься, тем больше знаешь.", category: "⚙️ Zložité spojky", level: "B2", hint: "čím... tým" },
  { slovak: "Aj keď je to ťažké, skúsim to.", russian: "Даже если это трудно, попробую.", category: "⚙️ Zložité spojky", level: "B2", hint: "aj keď" },

  // ---------- Číslovky (všetky typy) – A2-B2 (12 заданий) ----------
  { slovak: "Bývam na prvom poschodí.", russian: "Я живу на первом этаже.", category: "⚙️ Číslovky", level: "B1", hint: "prvý, -á, -é (radová)" },
  { slovak: "Je to dvojnásobný majster.", russian: "Он двукратный чемпион.", category: "⚙️ Číslovky", level: "B1", hint: "dvojnásobný (druhová)" },
  { slovak: "Už som ti to povedal trikrát.", russian: "Я уже сказал тебе это трижды.", category: "⚙️ Číslovky", level: "B1", hint: "trikrát (násobná)" },
  { slovak: "Prišiel päťdesiaty hosť.", russian: "Пришёл пятидесятый гость.", category: "⚙️ Číslovky", level: "B1", hint: "päťdesiaty (radová)" },
  { slovak: "Dvojitá porcia.", russian: "Двойная порция.", category: "⚙️ Číslovky", level: "B1", hint: "dvojitý (druhová)" },
  { slovak: "Stokrát ďakujem.", russian: "Сто раз спасибо.", category: "⚙️ Číslovky", level: "B2", hint: "stokrát (násobná)" },
  { slovak: "Mám dvoch psov.", russian: "У меня две собаки (одуш.).", category: "⚙️ Číslovky", level: "B1", hint: "dvoch (akuzatív)" },
  { slovak: "Kúpil som dve jablká.", russian: "Я купил два яблока (неодуш.).", category: "⚙️ Číslovky", level: "B1", hint: "dve jablká" },
  { slovak: "Bolo nás päť.", russian: "Нас было пятеро.", category: "⚙️ Číslovky", level: "B1", hint: "päť" },
  { slovak: "Prvý máj je sviatok.", russian: "Первое мая – праздник.", category: "⚙️ Číslovky", level: "A2", hint: "Prvý (radová)" },
  { slovak: "Tretíkrát som sa spýtal.", russian: "В третий раз я спросил.", category: "⚙️ Číslovky", level: "B2", hint: "tretíkrát" },
  { slovak: "Štvornásobný olympijský víťaz.", russian: "Четырёхкратный олимпийский чемпион.", category: "⚙️ Číslovky", level: "B2", hint: "štvornásobný" },

  // ---------- Predložky (všetky pády) – B1-B2 (12 заданий) ----------
  { slovak: "Kniha leží na stole.", russian: "Книга лежит на столе.", category: "⚙️ Predložky", level: "B1", hint: "na + Lokál" },
  { slovak: "Idem do školy.", russian: "Иду в школу.", category: "⚙️ Predložky", level: "B1", hint: "do + Genitív" },
  { slovak: "Som z Ruska.", russian: "Я из России.", category: "⚙️ Predložky", level: "B1", hint: "z + Genitív" },
  { slovak: "Počkaj pred domom.", russian: "Подожди перед домом.", category: "⚙️ Predložky", level: "B1", hint: "pred + Inštrumentál" },
  { slovak: "Za domom je záhrada.", russian: "За домом сад.", category: "⚙️ Predložky", level: "B1", hint: "za + Inštrumentál" },
  { slovak: "Ďakujem za pomoc.", russian: "Спасибо за помощь.", category: "⚙️ Predložky", level: "B1", hint: "za + Akuzatív" },
  { slovak: "Teším sa na víkend.", russian: "Радуюсь выходным.", category: "⚙️ Predložky", level: "B1", hint: "na + Akuzatív (očakávanie)" },
  { slovak: "Hovorili sme o tebe.", russian: "Мы говорили о тебе.", category: "⚙️ Predložky", level: "B1", hint: "o + Lokál" },
  { slovak: "Po večeri ideme spať.", russian: "После ужина идём спать.", category: "⚙️ Predložky", level: "B1", hint: "po + Lokál (čas)" },
  { slovak: "Medzi domami je park.", russian: "Между домами парк.", category: "⚙️ Predložky", level: "B2", hint: "medzi + Inštrumentál" },
  { slovak: "Okrem teba nikto neprišiel.", russian: "Кроме тебя никто не пришёл.", category: "⚙️ Predložky", level: "B2", hint: "okrem + Genitív" },
  { slovak: "Vďaka tebe som uspel.", russian: "Благодаря тебе я добился успеха.", category: "⚙️ Predložky", level: "B2", hint: "vďaka + Datív" },

  // ---------- Tvorenie prídavných mien od podstatných – B2 (10 заданий) ----------
  { slovak: "lesný dom", russian: "лесной дом", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "lesný (les + ný)" },
  { slovak: "vodný šport", russian: "водный спорт", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "vodný" },
  { slovak: "domáca úloha", russian: "домашнее задание", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "domáci" },
  { slovak: "cestovný lístok", russian: "дорожный билет", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "cestovný" },
  { slovak: "pracovný stôl", russian: "рабочий стол", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "pracovný" },
  { slovak: "slnečné počasie", russian: "солнечная погода", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "slnečný" },
  { slovak: "horský vzduch", russian: "горный воздух", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "horský" },
  { slovak: "rodinný dom", russian: "семейный дом", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "rodinný" },
  { slovak: "školská lavica", russian: "школьная парта", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "školský" },
  { slovak: "zdravotná starostlivosť", russian: "медицинская помощь", category: "⚙️ Tvorenie adjektív", level: "B2", hint: "zdravotný" },

  // ---------- Príslovkové určenia (času, miesta, spôsobu) – A2-B1 (12 заданий) ----------
  { slovak: "Včera som bol v kine.", russian: "Вчера я был в кино.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "času" },
  { slovak: "Zajtra pôjdem na výlet.", russian: "Завтра пойду на экскурсию.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "času" },
  { slovak: "Tu je teplo.", russian: "Здесь тепло.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "miesta" },
  { slovak: "Tam je chladno.", russian: "Там холодно.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "miesta" },
  { slovak: "Rýchlo utekal.", russian: "Быстро убегал.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "spôsobu" },
  { slovak: "Pomaly kráčal.", russian: "Медленно шёл.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "spôsobu" },
  { slovak: "Dnes je pekne.", russian: "Сегодня красиво.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "času" },
  { slovak: "Vpravo je pošta.", russian: "Справа почта.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "miesta" },
  { slovak: "Spieva nahlas.", russian: "Поёт громко.", category: "⚙️ Príslovkové určenia", level: "A2", hint: "spôsobu" },
  { slovak: "Často chodím do posilňovne.", russian: "Часто хожу в спортзал.", category: "⚙️ Príslovkové určenia", level: "B1", hint: "častotnosti" },
  { slovak: "Už som to urobil.", russian: "Я уже это сделал.", category: "⚙️ Príslovkové určenia", level: "B1", hint: "času" },
  { slovak: "Všade bolo plno ľudí.", russian: "Везде было полно людей.", category: "⚙️ Príslovkové určenia", level: "B1", hint: "miesta" },

  // ==========================================
  // Úroveň C1 – komplexné vety (pôvodné aj nové) – 10 заданий
  // ==========================================
  { slovak: "Keby som bol vedel, nebol by som išiel.", russian: "Если бы я знал, я бы не пошёл.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "keby som bol vedel" },
  { slovak: "Po tom, čo som zjedol, som si ľahol.", russian: "После того как я поел, я прилёг.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "Po tom, čo" },
  { slovak: "Nech by sa stalo čokoľvek, nezabudnem.", russian: "Что бы ни случилось, я не забуду.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "Nech by sa stalo" },
  { slovak: "Nedá sa s ním hovoriť.", russian: "С ним невозможно говорить.", category: "⚙️ C1 – neosobné konštrukcie", level: "C1", hint: "Nedá sa + infinitív" },
  { slovak: "Sotva som stihol prísť, keď začalo pršať.", russian: "Едва я успел прийти, как начался дождь.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "Sotva... keď" },
  { slovak: "Či už chceš, alebo nie, musíš to urobiť.", russian: "Хочешь ты или нет, ты должен это сделать.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "Či už... alebo" },
  { slovak: "Aj keby pršalo, pôjdem von.", russian: "Даже если будет дождь, я выйду на улицу.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "aj keby – ústupok" },
  { slovak: "Hrozí, že prídu neskoro.", russian: "Грозит, что они опоздают.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "hrozí, že" },
  { slovak: "Nečakal som, že ťa uvidím.", russian: "Я не ожидал, что тебя увижу.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "nečakal som, že" },
  { slovak: "Namiesto toho, aby pracoval, spal.", russian: "Вместо того чтобы работать, он спал.", category: "⚙️ C1 – komplexné vety", level: "C1", hint: "namiesto toho, aby" },
]