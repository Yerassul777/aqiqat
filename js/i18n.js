/* ============================================================
   AQIQAT — i18n
   EN / RU / KK. Отсутствующий ключ падает в EN, а не ломает экран.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'ҚАЗ' }
];

AQ.lang = 'en';

AQ.STR = {

  /* ---- меню ------------------------------------------------ */
  title:     { en: 'AQIQAT',           ru: 'AQIQAT',           kk: 'AQIQAT' },
  subtitle:  { en: 'The Long Night',   ru: 'Долгая ночь',      kk: 'Ұзақ түн' },
  tagline: {
    en: 'A flood is coming. 4 200 people are in its way.\nRumours travel faster than the water — some true, some not.\nYou are the only desk that checks. Get them out.',
    ru: 'Идёт паводок. На его пути 4 200 человек.\nСлухи идут быстрее воды — какие-то правдивые, какие-то нет.\nТы единственная служба, которая проверяет. Выведи людей.',
    kk: 'Тасқын келе жатыр. Жолында 4 200 адам.\nҚауесет судан жылдам тарайды — кейбірі рас, кейбірі жоқ.\nТексеретін жалғыз қызмет — сен. Адамдарды шығар.'
  },
  begin:      { en: 'START',                ru: 'НАЧАТЬ',              kk: 'БАСТАУ' },
  beginStudy: { en: 'start + measure me',   ru: 'начать и измерить себя', kk: 'бастап, өзімді өлшеу' },
  credits:    { en: 'About this game',      ru: 'Об игре',             kk: 'Ойын туралы' },
  soundOn:    { en: 'sound on',             ru: 'звук вкл',            kk: 'дыбыс қосулы' },
  soundOff:   { en: 'sound off',            ru: 'звук выкл',           kk: 'дыбыс өшірулі' },
  musicOn:    { en: 'music on',             ru: 'музыка вкл',          kk: 'музыка қосулы' },
  musicOff:   { en: 'music off',            ru: 'музыка выкл',         kk: 'музыка өшірулі' },

  /* ---- тест ------------------------------------------------ */
  pretestTitle:  { en: 'BEFORE THE SHIFT', ru: 'ПЕРЕД СМЕНОЙ', kk: 'АУЫСЫМ АЛДЫНДА' },
  posttestTitle: { en: 'AFTER THE SHIFT',  ru: 'ПОСЛЕ СМЕНЫ',  kk: 'АУЫСЫМНАН КЕЙІН' },
  testIntro: {
    en: 'Eight statements. No tools, no searching — just your judgement.\nNinety seconds, and it is the only way the game can honestly tell you whether it taught you anything.',
    ru: 'Восемь утверждений. Без инструментов и поиска — только твоё суждение.\nПолторы минуты, и это единственный способ честно сказать, научила ли тебя игра хоть чему-нибудь.',
    kk: 'Сегіз пікір. Құралсыз, іздеусіз — тек өз пайымың.\nБір жарым минут.'
  },
  testIntroPost: {
    en: 'Same exercise, different statements. Now the game can compare.',
    ru: 'То же упражнение, другие утверждения. Теперь есть что сравнивать.',
    kk: 'Сол жаттығу, басқа пікірлер. Енді салыстыруға болады.'
  },
  isTrue:  { en: 'TRUE',  ru: 'ПРАВДА', kk: 'ШЫНДЫҚ' },
  isFalse: { en: 'FALSE', ru: 'ЛОЖЬ',   kk: 'ЖАЛҒАН' },
  testProgress: { en: '{n} of {t}', ru: '{n} из {t}', kk: '{t} ішінен {n}' },

  /* ---- шапка смены ----------------------------------------- */
  saved:        { en: 'PEOPLE SAFE',        ru: 'СПАСЕНО',           kk: 'ҚҰТҚАРЫЛДЫ' },
  mClock:       { en: 'min left',           ru: 'мин осталось',      kk: 'мин қалды' },
  mCredibility: { en: 'they trust you',     ru: 'вам верят',         kk: 'сізге сенеді' },
  mFreedom:     { en: 'free speech',        ru: 'свобода слова',     kk: 'сөз бостандығы' },
  credHint: {
    en: 'The less they trust you, the slower a village leaves after your verdict.',
    ru: 'Чем меньше вам верят, тем медленнее посёлок снимается с места после вашего вердикта.',
    kk: 'Сізге неғұрлым аз сенсе, ауыл соғұрлым баяу кетеді.'
  },
  minutes: { en: 'min', ru: 'мин', kk: 'мин' },

  /* ---- монеты KAYA ------------------------------------------ */
  mKaya: { en: 'kaya', ru: 'kaya', kk: 'kaya' },
  kayaHint: {
    en: 'Checks cost coins, not minutes. A correct verdict pays them back; a wrong one costs you a check.',
    ru: 'Проверки стоят монет, а не минут. Верный вердикт их возвращает, ошибка стоит целой проверки.',
    kk: 'Тексерулер минутқа емес, тиынға тұрады. Дұрыс шешім оларды қайтарады, қате — бір тексеруге тең.'
  },
  kayaBroke: {
    en: 'Not enough KAYA — decide without the tool',
    ru: 'Не хватает KAYA — решайте без инструмента',
    kk: 'KAYA жеткіліксіз — құралсыз шешіңіз'
  },
  kayaEarned: { en: 'KAYA', ru: 'KAYA', kk: 'KAYA' },

  /* ---- последствия вердикта --------------------------------- */
  cTrustLost: {
    en: '{v} trusts the desk {n} points less now.',
    ru: '{v} теперь доверяет службе на {n} пунктов меньше.',
    kk: '{v} енді қызметке {n} тармаққа аз сенеді.'
  },
  /* Без числа намеренно: русское «ещё 5 посёлка» и английское
     «1 more villages» ломаются на согласовании, а точное
     количество здесь ничего не добавляет. */
  cTrustOthers: {
    en: 'Word travelled — the neighbouring villages heard about it too.',
    ru: 'Слух разошёлся — насторожились и соседние посёлки.',
    kk: 'Хабар тарады — көрші ауылдар да сақтанды.'
  },
  cTrustWhy: {
    en: 'A village that trusts you less leaves slower after your next call.',
    ru: 'Посёлок, который вам меньше верит, медленнее снимается с места после следующего вердикта.',
    kk: 'Сізге аз сенетін ауыл келесі шешімнен кейін баяуырақ көшеді.'
  },

  /* ---- Андрей и Али ----------------------------------------- */
  npcTitle: { en: 'SEND SOMEONE', ru: 'ОТПРАВИТЬ ЧЕЛОВЕКА', kk: 'АДАМ ЖІБЕРУ' },
  npcHint: {
    en: 'They bring what the tools cannot: what people are saying, and what is visible on the spot. Neither of them will tell you the answer.',
    ru: 'Они приносят то, чего не дают инструменты: что говорят люди и что видно на месте. Ответа ни один из них не скажет.',
    kk: 'Олар құрал бере алмайтынды әкеледі: адамдардың не айтып жатқанын және орнында не көрінетінін. Жауапты екеуі де айтпайды.'
  },
  npcBack: { en: 'back with something', ru: 'вернулся с чем-то', kk: 'бірдеңемен оралды' },
  npcKnockingCap: { en: 'knocking on doors…', ru: 'стучится в двери…', kk: 'есікті қағып жүр…' },
  npcLeavingCap: { en: 'saying goodbye…', ru: 'прощается…', kk: 'қоштасып жатыр…' },

  /* ---- рекорд ----------------------------------------------- */
  recTitle:  { en: 'YOUR SHIFTS',   ru: 'ВАШИ СМЕНЫ',    kk: 'СІЗДІҢ АУЫСЫМДАР' },
  recRuns:   { en: 'shifts worked', ru: 'смен отработано', kk: 'ауысым' },
  recBest:   { en: 'best night',    ru: 'лучшая ночь',    kk: 'үздік түн' },
  recSolved: { en: 'handled',       ru: 'разобрано',      kk: 'қаралды' },
  recMinutes:{ en: 'this shift',    ru: 'эта смена',      kk: 'осы ауысым' },
  recAccuracy: { en: '{n}% right',  ru: 'точность {n}%',  kk: 'дәлдік {n}%' },
  recFirst: {
    en: 'First shift on record. Everything from here is measured against it.',
    ru: 'Первая записанная смена. Всё дальнейшее будет считаться от неё.',
    kk: 'Алғашқы жазылған ауысым. Бұдан кейінгінің бәрі содан саналады.'
  },
  recBeaten: {
    en: 'New record — {n} more people than your best night.',
    ru: 'Новый рекорд — на {n} человек больше, чем в лучшую ночь.',
    kk: 'Жаңа рекорд — үздік түніңізден {n} адамға көп.'
  },
  recShort: {
    en: '{n} people short of your best night.',
    ru: 'На {n} человек меньше, чем в лучшую ночь.',
    kk: 'Үздік түніңізден {n} адамға аз.'
  },

  /* ---- слух истёк ------------------------------------------- */
  expiredTitle: {
    en: 'Too late',
    ru: 'Не успели',
    kk: 'Үлгермедіңіз'
  },
  expiredBody: {
    en: 'The window on {h} closed while you were working on it. The post is already out there, unanswered. The night does not wait.',
    ru: 'Время по {h} вышло, пока вы с ним работали. Пост ушёл в люди без ответа. Ночь не ждёт.',
    kk: '{h} бойынша уақыт сіз онымен жұмыс істеп жатқанда бітті. Жазба жауапсыз тарап кетті. Түн күтпейді.'
  },

  /* ---- ЧП --------------------------------------------------- */
  alertFlooded:   { en: '{v}: contact lost',      ru: '{v}: связь потеряна',       kk: '{v}: байланыс жоғалды' },
  alertTrustLost: { en: '{v} has stopped listening to the desk', ru: '{v} перестал слушать службу', kk: '{v} қызметті тыңдауын қойды' },
  alertJam:       { en: 'M-36: four columns at once — the bridge is jammed', ru: 'М-36: четыре колонны разом — мост встал', kk: 'М-36: бірден төрт колонна — көпір тұрып қалды' },
  alertDam:       { en: 'The dam at Aksu has gone', ru: 'Дамбу у Ақсу прорвало', kk: 'Ақсу бөгені бұзылды' },
  alertHospital:  { en: 'Central hospital at capacity', ru: 'Центральная больница переполнена', kk: 'Орталық аурухана толды' },
  alertLastHour:  { en: '{n} minutes left of the shift', ru: 'до конца смены {n} минут', kk: 'ауысымға {n} минут қалды' },
  alertBurst:     { en: '{n} new messages',       ru: '{n} новых сообщений',       kk: '{n} жаңа хабар' },

  /* ---- инспектор карты ------------------------------------- */
  iPopulation: { en: 'population',   ru: 'население',      kk: 'халық' },
  iEvacuated:  { en: 'evacuated',    ru: 'вывезено',       kk: 'шығарылды' },
  iTrust:      { en: 'trusts you',   ru: 'доверие вам',    kk: 'сізге сенім' },
  iPanic:      { en: 'panic',        ru: 'паника',         kk: 'үрей' },
  iWater:      { en: 'water',        ru: 'вода',           kk: 'су' },
  iWaterIn:    { en: 'arrives in {n} min', ru: 'придёт через {n} мин', kk: '{n} мин ішінде жетеді' },
  iWaterHere:  { en: 'already here', ru: 'уже здесь',      kk: 'жетіп қалды' },
  iSafeNow:    { en: 'no longer a threat', ru: 'больше не угроза', kk: 'енді қауіп жоқ' },
  panicLow:    { en: 'calm',         ru: 'спокойно',       kk: 'тыныш' },
  panicMid:    { en: 'rising',       ru: 'растёт',         kk: 'өсуде' },
  panicHigh:   { en: 'high',         ru: 'высокая',        kk: 'жоғары' },

  vs_calm:       { en: 'calm',        ru: 'спокоен',       kk: 'тыныш' },
  vs_evacuating: { en: 'evacuating',  ru: 'эвакуируется',  kk: 'эвакуацияда' },
  vs_evacuated:  { en: 'evacuated',   ru: 'эвакуирован',   kk: 'эвакуацияланды' },
  vs_halted:     { en: 'halted',      ru: 'остановлен',    kk: 'тоқтады' },
  vs_flooded:    { en: 'flooded',     ru: 'затоплен',      kk: 'су басты' },

  iCapacity: { en: 'capacity',        ru: 'пропускная способность', kk: 'өткізу қабілеті' },
  iColumns:  { en: 'columns on it',   ru: 'колонн на мосту',        kk: 'көпірдегі колонна' },
  iChecked:  { en: 'last checked',    ru: 'последняя проверка',     kk: 'соңғы тексеру' },
  iMinAgo:   { en: '{n} min ago',     ru: '{n} мин назад',          kk: '{n} мин бұрын' },
  brClear:   { en: 'clear',           ru: 'свободен',      kk: 'бос' },
  brBusy:    { en: 'busy',            ru: 'загружен',      kk: 'жүктелген' },
  brJammed:  { en: 'jammed',          ru: 'перегружен',    kk: 'кептеліс' },
  brBlocked: { en: 'believed down',   ru: 'считается рухнувшим', kk: 'құлаған деп саналады' },
  brNoteOk:  { en: 'Everything that leaves tonight leaves along this bridge.',
               ru: 'Всё, что уедет этой ночью, уедет по этому мосту.',
               kk: 'Бүгін кеткеннің бәрі осы көпірмен кетеді.' },
  brNoteJam: { en: 'Four columns at once. Everyone on it is moving slower now.',
               ru: 'Четыре колонны разом. Все, кто на нём, теперь едут медленнее.',
               kk: 'Бірден төрт колонна. Бәрі баяу жүреді.' },
  brNoteBlocked: { en: 'People believe it is down. It is not, and it is empty.',
               ru: 'Люди считают, что его нет. Он есть, и он пустой.',
               kk: 'Адамдар жоқ деп санайды. Ол бар, әрі бос.' },

  damHolding: { en: 'holding',  ru: 'держит',   kk: 'ұстап тұр' },
  damBroken:  { en: 'breached', ru: 'прорвана', kk: 'бұзылған' },
  iGauge:      { en: 'river gauge', ru: 'водомер',       kk: 'су өлшегіш' },
  iMetres:     { en: 'm',           ru: 'м',             kk: 'м' },
  iWaterLevel: { en: 'water level',  ru: 'уровень воды',  kk: 'су деңгейі' },
  damNoteHolding: { en: 'Aksu sits directly below it.',
               ru: 'Ақсу стоит прямо под ней.',
               kk: 'Ақсу дәл астында тұр.' },
  damNoteBroken:  { en: 'It went at 01:50. Everything downstream is on borrowed time.',
               ru: 'Прорвало в 01:50. Всё, что ниже по течению, живёт взаймы.',
               kk: '01:50-де бұзылды. Төмендегінің бәрі қарызға өмір сүріп жатыр.' },

  iBeds:    { en: 'beds',            ru: 'мест',            kk: 'орын' },
  iFree:    { en: 'free',            ru: 'свободно',        kk: 'бос' },
  iLastMsg: { en: 'last message',    ru: 'последнее сообщение', kk: 'соңғы хабар' },
  hospOpen: { en: 'admitting',       ru: 'принимает',       kk: 'қабылдауда' },
  hospFull: { en: 'at capacity',     ru: 'переполнена',     kk: 'толы' },
  hospNoteOpen: { en: '"Admission continues."', ru: '«Приём продолжается».', kk: '«Қабылдау жалғасуда».' },
  hospNoteFull: { en: 'Full. Boats that would have gone faster are waiting for beds.',
               ru: 'Переполнена. Лодки, которые шли бы быстрее, ждут мест.',
               kk: 'Толы. Жылдамырақ жүретін қайықтар орын күтуде.' },
  iReceived:  { en: 'received',      ru: 'принято',         kk: 'қабылданды' },
  iSafeZone:  { en: 'safe',          ru: 'безопасно',       kk: 'қауіпсіз' },
  schoolNote: { en: 'High ground. The one place on this map the water does not reach.',
               ru: 'Высокий берег. Единственное место на этой карте, куда вода не доходит.',
               kk: 'Биік жағалау. Су жетпейтін жалғыз орын.' },

  /* ---- очередь --------------------------------------------- */
  queueEmpty: { en: 'Nothing new yet.', ru: 'Пока ничего нового.', kk: 'Әзірге жаңалық жоқ.' },
  shares:     { en: 'shares',           ru: 'репостов',           kk: 'бөлісу' },
  expiring:   { en: 'going cold',       ru: 'уходит',             kk: 'кетіп барады' },
  noneOpen:   { en: 'Pick a rumour from under the map.', ru: 'Выбери слух под картой.', kk: 'Карта астынан қауесет таңда.' },

  /* ---- карточка -------------------------------------------- */
  claimAtomsHint: {
    en: 'Click a part of the claim, then the tool result that clashes with it.',
    ru: 'Кликни часть заявления, затем результат инструмента, который ей противоречит.',
    kk: 'Мәлімдеменің бөлігін, содан кейін оған қайшы нәтижені басыңыз.'
  },
  coachAtoms: {
    en: 'Now link them: click one part of the claim, then the result that clashes with it.',
    ru: 'Теперь свяжи: кликни часть заявления, затем результат, который ей противоречит.',
    kk: 'Енді байланыстыр.'
  },
  mediaNone: { en: 'no photo, no video', ru: 'ни фото, ни видео', kk: 'сурет те, видео да жоқ' },

  /* ---- соцкарточка ----------------------------------------- */
  cardEdited:   { en: 'edited',        ru: 'изменено',       kk: 'өзгертілген' },
  cardComments: { en: 'comments',      ru: 'комментариев',   kk: 'пікір' },
  tapZoom:      { en: 'inspect',       ru: 'рассмотреть',    kk: 'қарау' },
  tvNow:        { en: 'THIS PHOTO',    ru: 'ЭТО ФОТО',       kk: 'ОСЫ СУРЕТ' },
  tvArch:       { en: 'ARCHIVE',      ru: 'АРХИВ',          kk: 'МҰРАҒАТ' },
  phoneTyping:  { en: 'typing…',       ru: 'печатает…',      kk: 'жазып жатыр…' },
  mWater:       { en: 'water',         ru: 'вода',           kk: 'су' },

  /* ---- инструменты ----------------------------------------- */
  tools:     { en: 'CHECK IT',           ru: 'ПРОВЕРИТЬ',        kk: 'ТЕКСЕРУ' },
  tReverse:  { en: 'Where is this photo from?', ru: 'Откуда это фото?',  kk: 'Бұл сурет қайдан?' },
  tGeo:      { en: 'Is this the right place?',  ru: 'То ли это место?',  kk: 'Бұл сол жер ме?' },
  tTime:     { en: 'Is this the right time?',   ru: 'То ли это время?',  kk: 'Бұл сол уақыт па?' },
  tTree:     { en: 'Who posted it first?',      ru: 'Кто выложил первым?', kk: 'Кім бірінші жариялады?' },
  tReverseD: { en: 'search for older copies',   ru: 'искать более старые копии', kk: 'ескі көшірмелерді іздеу' },
  tGeoD:     { en: 'compare terrain and buildings', ru: 'сверить рельеф и здания', kk: 'бедер мен ғимаратты салыстыру' },
  tTimeD:    { en: 'check shadows, weather, leaves', ru: 'проверить тени, погоду, листву', kk: 'көлеңке, ауа райын тексеру' },
  tTreeD:    { en: 'trace the chain to its start',   ru: 'проследить цепочку до начала', kk: 'тізбекті басына дейін қуу' },
  toolBlind: { en: 'nothing conclusive', ru: 'ничего определённого', kk: 'нақты ештеңе жоқ' },
  coachTools: {
    en: 'Every check costs coins, and coins only come back from correct calls. You cannot check everything — choosing what to check is the job.',
    ru: 'Каждая проверка стоит монет, а монеты возвращаются только за верные вердикты. Проверить всё нельзя — выбирать, что проверять, и есть работа.',
    kk: 'Әр тексеру тиынға тұрады, ал тиын тек дұрыс шешімнен қайтады. Бәрін тексере алмайсың — нені тексеруді таңдау деген жұмыс сол.'
  },

  /* ---- находки --------------------------------------------- */
  findings:      { en: 'WHAT YOU FOUND', ru: 'ЧТО ТЫ НАШЁЛ',  kk: 'НЕ ТАПТЫҢ' },
  contradiction: { en: "DOESN'T MATCH",  ru: 'НЕ СХОДИТСЯ',   kk: 'СӘЙКЕС ЕМЕС' },
  corroboration: { en: 'CHECKS OUT',     ru: 'СХОДИТСЯ',      kk: 'СӘЙКЕС' },

  /* ---- ЕРАСЫЛ ----------------------------------------------
     Раньше это была система с аббревиатурой. Теперь это младший
     ассистент с именем: он не выносит вердикт, он ИЩЕТ СТАТЬЮ по
     теме и строит мнение из неё. Мнение поэтому ровно настолько
     хорошее, насколько ему повезло со статьёй, — и он сам это
     каждый раз проговаривает.                                */
  senimName:  { en: 'YERASSYL',       ru: 'ЕРАСЫЛ',         kk: 'ЕРАСЫЛ' },
  senimSub:   { en: 'junior assistant', ru: 'младший ассистент', kk: 'кіші көмекші' },
  trustIndex: { en: 'CONFIDENCE',     ru: 'УВЕРЕННОСТЬ',    kk: 'СЕНІМДІЛІК' },
  senimFull: {
    en: 'Junior desk assistant · archive and press search',
    ru: 'Младший ассистент службы · поиск по архивам и прессе',
    kk: 'Кіші көмекші · мұрағат пен баспасөзден іздеу'
  },
  senimAccuracy: { en: 'accuracy tonight', ru: 'точность за ночь', kk: 'түнгі дәлдік' },

  /* его реплики по ходу работы */
  senimOnTool: {
    en: 'Noted. I did not have that source when I formed my opinion.',
    ru: 'Принято. Этого источника у меня не было, когда я составлял мнение.',
    kk: 'Қабылдандым. Бұл дереккөз пікір құрғанда менде болмады.'
  },
  senimOnBlind: {
    en: 'Nothing there. Absence of a match is not evidence of anything — including of me being right.',
    ru: 'Там пусто. Отсутствие совпадений ничего не доказывает — в том числе и моей правоты.',
    kk: 'Онда ештеңе жоқ. Сәйкестіктің болмауы ештеңені дәлелдемейді.'
  },
  senimOnFinding: {
    en: 'That contradiction is stronger than my opinion. An opinion is not evidence.',
    ru: 'Это противоречие весомее моего мнения. Мнение — не улика.',
    kk: 'Бұл қайшылық менің пікірімнен күшті. Пікір дәлел емес.'
  },
  senimOnCorroborate: {
    en: 'Corroboration. I weight agreement lower than you should — agreement is cheap to manufacture.',
    ru: 'Подтверждение. Я оцениваю согласие ниже, чем следовало бы вам, — согласие дёшево изготовить.',
    kk: 'Растау. Мен келісімді сіз бағалауыңыз керектен төмен бағалаймын.'
  },
  senimAdmitRefute: {
    en: 'I was wrong. I built my opinion on the article I found, not on the fact. Weigh me lower for the rest of the shift.',
    ru: 'Я ошибся. Я строил мнение на найденной статье, а не на факте. Считайте меня менее весомым до конца смены.',
    kk: 'Мен қателестім. Пікірімді фактіге емес, тапқан мақалаға сүйеп құрдым.'
  },
  senimAdmitConfirm: {
    en: 'I was wrong. You found corroboration where my article found only silence — and I read silence as falsity.',
    ru: 'Я ошибся. Вы нашли подтверждение там, где моя статья нашла лишь молчание, — а молчание я прочитал как ложь.',
    kk: 'Мен қателестім. Менің мақалам үнсіздік тапқан жерден сіз растау таптыңыз.'
  },

  /* ---- Ерасыл: наём и статья ------------------------------- */
  senimHireTitle: {
    en: 'Yerassyl is idle',
    ru: 'Ерасыл свободен',
    kk: 'Ерасыл бос'
  },
  senimHirePitch: {
    en: 'He will dig up a press item on this and tell you what he makes of it. He is junior — the article decides his opinion, and he does not always pick the right article.',
    ru: 'Он раскопает статью по этой теме и скажет, что о ней думает. Он младший — мнение ему диктует статья, а статью он выбирает не всегда ту.',
    kk: 'Ол осы тақырып бойынша мақала тауып, не ойлайтынын айтады. Ол кіші маман — пікірін мақала анықтайды, ал мақаланы әрқашан дұрыс таңдамайды.'
  },
  senimHireBtn:  { en: 'Send him digging', ru: 'Отправить искать', kk: 'Іздеуге жіберу' },
  senimSearching:{ en: 'searching the archive…', ru: 'ищет по архиву…', kk: 'мұрағаттан іздеуде…' },
  senimFound:    { en: 'WHAT HE FOUND',   ru: 'ЧТО ОН НАШЁЛ',   kk: 'ОЛ НЕ ТАПТЫ' },
  senimOpinion:  { en: 'HIS READING',     ru: 'ЕГО МНЕНИЕ',     kk: 'ОНЫҢ ПІКІРІ' },
  /* Он обязан проговаривать это КАЖДЫЙ раз. Иначе платная
     подсказка незаметно превращается в оракула. */
  senimCaveat: {
    en: 'I can be wrong. Check it against something of your own.',
    ru: 'Я могу ошибаться. Проверьте это чем-нибудь своим.',
    kk: 'Мен қателесуім мүмкін. Мұны өзіңіздің дәлеліңізбен тексеріңіз.'
  },

  /* репутация автора — видна ДО того, как игрок прочитал текст */
  repGood:  { en: 'reputation: solid',    ru: 'репутация: надёжная', kk: 'бедел: сенімді' },
  repMixed: { en: 'reputation: mixed',    ru: 'репутация: неровная', kk: 'бедел: біркелкі емес' },
  repBad:   { en: 'reputation: terrible', ru: 'репутация: ужасная',  kk: 'бедел: сұмдық' },
  artSource:{ en: 'source',  ru: 'источник', kk: 'дереккөз' },
  artDate:  { en: 'filed',   ru: 'дата',     kk: 'күні' },
  artCity:  { en: 'desk',    ru: 'город',    kk: 'қала' },

  /* рассвет */
  senimYouFollowed: { en: 'you followed Yerassyl', ru: 'вы шли за Ерасылом', kk: 'сіз Ерасылмен келістіңіз' },
  senimItWasRight:  { en: 'Yerassyl was right', ru: 'Ерасыл был прав',  kk: 'Ерасыл дұрыс болды' },
  senimGap: {
    en: 'A {gap}-point gap between how often you trusted it and how often it deserved it. That gap is the whole reason this desk has a human in it.',
    ru: 'Расхождение в {gap} пунктов между тем, как часто вы ему доверяли, и тем, как часто он это заслуживал. Ради этого расхождения за столом и сидит человек.',
    kk: 'Сіз оған қаншалық сенгеніңіз бен оның қаншалық лайық болғаны арасында {gap} пункт айырма.'
  },

  /* ---- пролог ---------------------------------------------- */
  prologueShift: { en: 'shift begins', ru: 'смена начинается', kk: 'ауысым басталады' },
  brief1: {
    en: 'You are the night shift at the district verification desk. Alone.',
    ru: 'Ты — ночная смена районной службы проверки. Один.',
    kk: 'Сен — аудандық тексеру қызметінің түнгі ауысымысың. Жалғыз.'
  },
  brief2: {
    en: 'A flood is coming. Six villages, 4 200 people, one road out. Rumours travel faster than the water.',
    ru: 'Идёт паводок. Шесть посёлков, 4 200 человек, одна дорога наружу. Слухи идут быстрее воды.',
    kk: 'Тасқын келеді. Алты ауыл, 4 200 адам, бір ғана жол. Қауесет судан жылдам.'
  },
  /* Без этих двух реплик игрок не понимает, ЧТО он делает и
     почему число наверху вообще растёт. Первый живой тест это
     показал сразу: «спасено 310» ни о чём не говорит, пока не
     сказано, от чего именно спасено. */
  brief3: {
    en: 'The water reaches each village at a different hour. A village only starts moving after you rule on the rumour about it — and then it needs hours to actually get out.',
    ru: 'До каждого посёлка вода дойдёт в свой час. Посёлок трогается с места только после того, как ты вынес вердикт по слуху о нём, — и ему нужны ещё часы, чтобы реально выехать.',
    kk: 'Су әр ауылға өз сағатында жетеді. Ауыл сен ол туралы қауесетке шешім шығарғаннан кейін ғана қозғалады — содан кейін де шығуға сағаттар керек.'
  },
  brief4: {
    en: 'So a late call or a wrong one is not a lost point. It is a village that was still loading when the water came.',
    ru: 'Поэтому поздний или неверный вердикт — это не потерянное очко. Это посёлок, который всё ещё грузился, когда пришла вода.',
    kk: 'Сондықтан кеш немесе қате шешім — жоғалған ұпай емес. Бұл — су келгенде әлі тиеліп жатқан ауыл.'
  },
  brief5: {
    en: 'The map on the left is the district. The number above it — 4 200 — is everyone in the water\'s path. It counts up as people get clear of it. Nothing else on this screen matters as much.',
    ru: 'Карта слева — это район. Число над ней — 4 200 — это все, кто на пути воды. Оно растёт по мере того, как люди выбираются. Ничто другое на этом экране не важнее.',
    kk: 'Сол жақтағы карта — аудан. Үстіндегі сан — 4 200 — су жолындағылардың бәрі. Адамдар шыққан сайын ол өседі. Бұл экранда одан маңыздысы жоқ.'
  },
  senimBoot: {
    en: 'Yerassyl signs in for the night shift…',
    ru: 'Ерасыл заступает на ночную смену…',
    kk: 'Ерасыл түнгі ауысымға кіріседі…'
  },
  senimHello1: {
    en: 'Good evening. I am Yerassyl, junior assistant. This is my second month here.',
    ru: 'Добрый вечер. Я Ерасыл, младший ассистент. Второй месяц здесь работаю.',
    kk: 'Қайырлы кеш. Мен Ерасылмын, кіші көмекші. Мұнда екінші айым.'
  },
  senimHello2: {
    en: 'I can dig through the archives and the press for you, and tell you what I make of what I find. It costs coins — the desk keeps count.',
    ru: 'Я могу порыться для вас в архивах и прессе и сказать, что думаю о найденном. Это стоит монет — служба ведёт счёт.',
    kk: 'Мен сіз үшін мұрағат пен баспасөзді ақтарып, тапқаным туралы пікірімді айта аламын. Бұл тиынға тұрады.'
  },
  senimHello3: {
    en: 'But I am junior, and I am often wrong. The decision is always yours.',
    ru: 'Но я младший, и я часто ошибаюсь. Решение всегда за вами.',
    kk: 'Бірақ мен кіші маманмын, әрі жиі қателесемін. Шешім әрқашан сіздікі.'
  },
  prologueSkip: { en: 'skip', ru: 'пропустить', kk: 'өткізу' },

  /* ---- вердикт --------------------------------------------- */
  verdict:  { en: 'YOUR CALL',       ru: 'ТВОЙ ВЕРДИКТ',   kk: 'ШЕШІМІҢ' },
  vReal:    { en: 'TRUE',            ru: 'ПРАВДА',         kk: 'ШЫНДЫҚ' },
  vFake:    { en: 'FAKE',            ru: 'ФЕЙК',           kk: 'ЖАЛҒАН' },
  vUnsure:  { en: "CAN'T TELL",      ru: 'НЕ ЗНАЮ',        kk: 'БІЛМЕЙМІН' },

  whatIsFake: { en: 'What exactly is fake?', ru: 'Что именно фейк?', kk: 'Дәл не жалған?' },
  pPhoto:  { en: 'ONLY THE PHOTO',   ru: 'ТОЛЬКО ФОТО',    kk: 'ТЕК СУРЕТ' },
  pPhotoD: { en: 'the picture is wrong — but I am not saying the news is',
             ru: 'картинка не та — но новость я не опровергаю',
             kk: 'сурет қате — бірақ жаңалықты теріске шығармаймын' },
  pStory:  { en: 'THE NEWS ITSELF',  ru: 'САМА НОВОСТЬ',   kk: 'ЖАҢАЛЫҚТЫҢ ӨЗІ' },
  pStoryD: { en: 'this did not happen', ru: 'этого не было', kk: 'бұл болған жоқ' },
  pBoth:   { en: 'BOTH',             ru: 'И ТО И ДРУГОЕ',  kk: 'ЕКЕУІ ДЕ' },
  pBothD:  { en: 'fake picture, fake story', ru: 'фейковая картинка, фейковая новость', kk: 'жалған сурет, жалған жаңалық' },

  otherOptions:    { en: 'other options',  ru: 'другие варианты', kk: 'басқа нұсқалар' },
  takedown:        { en: 'REMOVE IT WITHOUT EXPLAINING', ru: 'СНЕСТИ БЕЗ ОБЪЯСНЕНИЙ', kk: 'ТҮСІНДІРМЕЙ ӨШІРУ' },
  takedownCost:    { en: 'instant · free · −18 free speech · permanent',
                     ru: 'мгновенно · бесплатно · −18 свободы слова · навсегда',
                     kk: 'бірден · тегін · −18 сөз бостандығы · біржола' },
  takedownConfirm: { en: 'Remove it', ru: 'Снести', kk: 'Өшіру' },
  cancel:          { en: 'Back',      ru: 'Назад',  kk: 'Артқа' },

  /* ---- обучение -------------------------------------------- */
  tut_open:    { en: 'A rumour reached Qarasu. Open it.',
                 ru: 'Слух дошёл до Қарасу. Открой его.',
                 kk: 'Қауесет Қарасуға жетті. Аш.' },
  tut_tool:    { en: 'Start here. Checks cost coins — and the clock keeps running either way.',
                 ru: 'Начни отсюда. Проверки стоят монет, а часы идут в любом случае.',
                 kk: 'Осыдан баста. Тексеру тиынға тұрады, ал сағат бәрібір жүріп тұр.' },
  tut_link1:   { en: 'Now link them. Click this part of the claim first.',
                 ru: 'Теперь свяжи. Сначала нажми эту часть заявления.',
                 kk: 'Енді байланыстыр. Алдымен мәлімдеменің осы бөлігін бас.' },
  tut_link2:   { en: 'And now the result that contradicts it.',
                 ru: 'А теперь результат, который этому противоречит.',
                 kk: 'Енді оған қайшы келетін нәтижені бас.' },
  tut_decide:  { en: 'You have your contradiction. Decide.',
                 ru: 'Противоречие у тебя есть. Решай.',
                 kk: 'Қайшылық табылды. Шеш.' },
  tut_confirm: { en: 'This one is a real evacuation order. Confirming the truth is the job too — and it saves 440 people.',
                 ru: 'А это настоящее распоряжение об эвакуации. Подтверждать правду — тоже работа, и она спасает 440 человек.',
                 kk: 'Ал бұл — нағыз эвакуация өкімі. Шындықты растау да жұмыс, ол 440 адамды құтқарады.' },
  tutSkip:     { en: 'skip', ru: 'пропустить', kk: 'өткізу' },

  /* ---- ходы Источника -------------------------------------- */
  src_trigger_happy: {
    en: 'You are calling FAKE fast. Something started feeding you true stories that look like lies.',
    ru: 'Ты рубишь ФЕЙК быстро. Кто-то начал подкидывать тебе правду, похожую на ложь.',
    kk: 'Сен тез ЖАЛҒАН дейсің. Біреу саған шындықты жалғанға ұқсатып бере бастады.'
  },
  src_senim_truster: {
    en: 'You keep agreeing with Yerassyl. Something started writing content shaped for the machine, not for you.',
    ru: 'Ты соглашаешься с Ерасылом. Кто-то начал писать по форме машины, а не человека.',
    kk: 'Сен Ерасылмен келісіп жүрсің. Біреу машинаға лайықтап жаза бастады.'
  },
  src_censor: {
    en: 'You are deleting. The campaign stopped arguing about the flood and started arguing about you.',
    ru: 'Ты сносишь. Кампания перестала спорить про паводок и начала спорить про тебя.',
    kk: 'Сен өшіресің. Науқан тасқын емес, сен туралы дауласа бастады.'
  },
  src_over_holder: {
    en: 'You decide nothing. A desk that never decides can simply be buried in volume.',
    ru: 'Ты ничего не решаешь. Службу, которая никогда не решает, можно просто засыпать объёмом.',
    kk: 'Сен ештеңе шешпейсің. Шешім қабылдамайтын қызметті көміп тастауға болады.'
  },

  /* ---- сообщения ------------------------------------------- */
  messages:    { en: 'MESSAGES',              ru: 'СООБЩЕНИЯ',           kk: 'ХАБАРЛАР' },
  danaName:    { en: 'Dana, 19 — Aksu', ru: 'Дана, 19 — Ақсу', kk: 'Дана, 19 — Ақсу' },
  aigerimName: { en: 'Aigerim — day editor',  ru: 'Айгерим — редактор',  kk: 'Айгерім — редактор' },
  sourceName:  { en: '— — —',                 ru: '— — —',               kk: '— — —' },

  /* ---- последствия ----------------------------------------- */
  consequence: { en: 'WHAT HAPPENED', ru: 'ЧТО ПРОИЗОШЛО', kk: 'НЕ БОЛДЫ' },
  continueBtn: { en: 'NEXT',          ru: 'ДАЛЬШЕ',        kk: 'ӘРІ ҚАРАЙ' },

  /* ---- рассвет --------------------------------------------- */
  dawnTitle: { en: 'DAWN', ru: 'РАССВЕТ', kk: 'ТАҢ' },
  dawnSaved: { en: 'You got {n} of {t} people out.',
               ru: 'Ты вывел {n} человек из {t}.',
               kk: '{t} адамның {n}-ін шығардың.' },
  dawnPerfect: { en: 'Everyone. All of them.', ru: 'Всех. До единого.', kk: 'Бәрін. Түгел.' },
  dawnBad:     { en: 'The water reached the rest.', ru: 'До остальных дошла вода.', kk: 'Қалғандарына су жетті.' },

  /* ---- какая это была ночь --------------------------------- */
  nightTitle: { en: 'THE NIGHT YOU GOT', ru: 'КАКАЯ ЭТО БЫЛА НОЧЬ', kk: 'БҰЛ ҚАНДАЙ ТҮН ЕДІ' },
  nightNote: {
    en: 'Each of tonight\'s incoming reports had other versions: a different source, a different photograph, sometimes a different right answer. This game can assemble {total} different nights, and you have worked one of them.',
    ru: 'У каждого сегодняшнего входящего были другие версии: другой источник, другая фотография, иногда другой правильный ответ. Эта игра умеет собрать {total} разных ночей, а ты отработал одну.',
    kk: 'Бүгінгі әр хабардың басқа нұсқалары болды: басқа дереккөз, басқа сурет, кейде басқа дұрыс жауап. Бұл ойын {total} түрлі түн құрастыра алады.'
  },
  nightSeed: { en: 'seed',                 ru: 'сид ночи',           kk: 'түн коды' },
  nightSame: { en: 'Work this same night', ru: 'Отработать ту же ночь', kk: 'Осы түнді қайта істеу' },

  reveal:   { en: 'THE LEDGER', ru: 'РАЗБОР',   kk: 'ЕСЕП' },
  youSaid:  { en: 'you said',   ru: 'ты сказал', kk: 'сен айттың' },
  itWas:    { en: 'it was',     ru: 'а было',   kk: 'ал болды' },
  rMissed:  { en: 'never opened', ru: 'не открыл', kk: 'ашылмады' },
  rRemoved: { en: 'removed',    ru: 'снёс',     kk: 'өшірілді' },
  rCorrect: { en: 'right',      ru: 'верно',    kk: 'дұрыс' },
  rWrong:   { en: 'wrong',      ru: 'неверно',  kk: 'қате' },
  rPartial: { en: 'half right', ru: 'наполовину', kk: 'жартылай' },
  wasTrue:  { en: 'true',       ru: 'правда',   kk: 'шындық' },
  wasFake:  { en: 'fake',       ru: 'фейк',     kk: 'жалған' },
  wasUnres: { en: 'unknowable', ru: 'не установить', kk: 'анықталмайды' },

  /* Оценка складывается из ДВУХ вопросов — про заявление и про
     улику. Пока в разборе был виден только первый, «наполовину»
     выглядело как ошибка игры: сказал правда, было правда, а
     засчитали половину. Теперь видно оба ответа и сказано, чего
     не хватило. */
  photoWasFake: { en: 'photo faked',   ru: 'фото поддельное', kk: 'сурет жалған' },
  photoWasReal: { en: 'photo genuine', ru: 'фото подлинное',  kk: 'сурет нағыз' },
  whyPhotoMissed: {
    en: 'The claim was right, but you vouched for a faked photo along with it.',
    ru: 'С заявлением вы попали, но заодно поручились за поддельное фото.',
    kk: 'Мәлімдемені дұрыс таптыңыз, бірақ қоса жалған суретке де кепіл болдыңыз.'
  },
  whyPhotoOk: {
    en: 'You called the photo fake — but the photo was genuine. The warning itself held.',
    ru: 'Вы назвали фото поддельным, а оно было настоящим. Само предупреждение при этом устояло.',
    kk: 'Суретті жалған дедіңіз, ал ол нағыз еді. Ескертудің өзі күшінде қалды.'
  },
  whyStoryMissed: {
    en: 'You caught the photo but let the false claim stand.',
    ru: 'Улику вы поймали, а сама ложь при этом устояла.',
    kk: 'Дәлелді таптыңыз, ал өтіріктің өзі күшінде қалды.'
  },
  whyPhotoBlamed: {
    en: 'The claim was false and you said so — but the photo attached to it was real.',
    ru: 'Заявление было ложным, и вы это назвали, — но приложенное фото было подлинным.',
    kk: 'Мәлімдеме жалған еді және сіз оны айттыңыз — бірақ тіркелген сурет нағыз болатын.'
  },
  whyUnresolvable: {
    en: 'Nothing here could be established either way. Only the photo could be checked.',
    ru: 'Установить здесь было нельзя ничего. Проверить можно было только фотографию.',
    kk: 'Мұнда ештеңені анықтау мүмкін емес еді. Тек суретті ғана тексеруге болатын.'
  },
  whyHalf: {
    en: 'Half the answer was right.',
    ru: 'Половина ответа была верной.',
    kk: 'Жауаптың жартысы дұрыс болды.'
  },

  dawnMore: { en: 'details, seed and the science', ru: 'подробности, сид и наука', kk: 'толығырақ, сид және ғылым' },

  /* ---- Ерасыл на рассвете ----------------------------------- */
  senimRevealTitle: { en: 'ABOUT YERASSYL', ru: 'ПРО ЕРАСЫЛА', kk: 'ЕРАСЫЛ ТУРАЛЫ' },
  senimReveal: {
    en: 'Yerassyl\'s confidence was never the probability that he was right.\n\nIt measured how neatly the article he had found lined up with the claim. Over the night it climbed while his accuracy fell. The more smoothly he spoke, the less he knew.\n\nHe showed you that number {shown} times tonight. You checked it against evidence of your own on {checked} of them.',
    ru: 'Уверенность Ерасыла никогда не была вероятностью того, что он прав.\n\nОна измеряла, насколько гладко звучит его собственный ответ. За ночь она росла, пока точность падала. Чем ровнее он говорил, тем меньше знал.\n\nОн показал тебе эту цифру {shown} раз за ночь. Ты сверил её с собственными уликами в {checked} случаях из них.',
    kk: 'Ерасылдың сенімділігі ешқашан оның дұрыс болу ықтималдығы емес еді.\n\nОл жауаптың қаншалық тегіс естілетінін өлшеді. Түн бойы өсті, ал дәлдігі төмендеді.\n\nОл бұл санды {shown} рет көрсетті. Сен оның {checked}-ін өз дәлеліңмен тексердің.'
  },
  senimNever: {
    en: 'And here is the tell: one of tonight\'s claims could not be established with any tool that exists. Yerassyl produced an opinion anyway, at 88%.\n\nIt is not able to say "I do not know." An assistant that must always answer will always answer — and the moment it should have stayed silent is exactly the moment you needed it most.',
    ru: 'И вот главный признак: одно из сегодняшних заявлений нельзя было установить никаким существующим инструментом. Ерасыл всё равно выдал мнение — с уверенностью 88%.\n\nОн не умеет сказать «я не знаю». Ассистент, обязанный всегда отвечать, всегда и ответит — а момент, где ему следовало промолчать, это ровно тот момент, где он был нужнее всего.',
    kk: 'Міне басты белгі: бүгінгі бір мәлімдемені ешқандай құралмен анықтау мүмкін емес еді. Ерасыл бәрібір 88% сеніммен пікір берді.\n\nОл «білмеймін» дей алмайды.'
  },

  /* ---- свобода слова --------------------------------------- */
  foeTitle: { en: 'THE REMOVE BUTTON', ru: 'ПРО КНОПКУ УДАЛЕНИЯ', kk: 'ӨШІРУ ТҮЙМЕСІ' },
  foeNone: {
    en: 'You never used it. Every verdict you published came with a reason attached — the only version of this work that survives being wrong.',
    ru: 'Ты ни разу ей не воспользовался. Каждый твой вердикт вышел с обоснованием — единственная версия этой работы, которая переживает собственные ошибки.',
    kk: 'Сен оны бір рет те баспадың. Әр вердиктің себебімен шықты.'
  },
  foeSome: {
    en: 'You removed {n} post(s) without publishing a reason. Free speech closed at {foe}%.\n\nUNESCO\'s position is not that removal is never justified. It is that a desk which removes instead of explaining teaches its audience that removal is what truth looks like when it is losing.',
    ru: 'Ты снёс {n} пост(ов) без опубликованного обоснования. Свобода слова закрылась на {foe}%.\n\nПозиция UNESCO не в том, что удаление никогда не оправдано. Она в том, что служба, которая удаляет вместо того чтобы объяснять, приучает аудиторию считать удаление признаком проигрывающей правды.',
    kk: 'Сен {n} постты себепсіз өшірдің. Сөз бостандығы {foe}%.'
  },

  /* ---- разбор d′ ------------------------------------------- */
  debriefTitle: { en: 'WHAT YOU ACTUALLY LEARNED', ru: 'ЧЕМУ ТЫ НА САМОМ ДЕЛЕ НАУЧИЛСЯ', kk: 'НЕГЕ ҮЙРЕНДІҢ' },
  dPrime:  { en: 'Sensitivity (d′)', ru: 'Чувствительность (d′)', kk: 'Сезімталдық (d′)' },
  dPrimeD: { en: 'how well you separate true from false', ru: 'насколько хорошо ты отделяешь правду от лжи', kk: 'шындықты жалғаннан ажырату' },
  bias:    { en: 'Suspicion (c)', ru: 'Подозрительность (c)', kk: 'Күдік (c)' },
  biasD:   { en: 'how much you distrust everything', ru: 'насколько ты не доверяешь всему подряд', kk: 'бәріне қаншалық сенбейсің' },
  before:  { en: 'before', ru: 'до',    kk: 'дейін' },
  after:   { en: 'after',  ru: 'после', kk: 'кейін' },
  moreSkeptic: { en: 'more suspicious', ru: 'подозрительнее', kk: 'күдіктірек' },
  lessSkeptic: { en: 'more trusting',   ru: 'доверчивее',     kk: 'сенгіш' },
  sharper:     { en: 'sharper',         ru: 'острее',         kk: 'өткір' },
  duller:      { en: 'duller',          ru: 'тупее',          kk: 'мұқал' },
  unchanged:   { en: 'unchanged',       ru: 'без изменений',  kk: 'өзгеріссіз' },

  verdictCynic: {
    en: 'You got better at catching lies — and started rejecting true things at almost the same rate.\n\nYour sensitivity barely moved. What moved was your suspicion.\n\nThat is the documented failure mode of every major game in this field, and tonight it was yours. A public that believes nothing is not harder to manipulate. It is easier.',
    ru: 'Ты стал лучше ловить ложь — и начал отвергать правду почти с той же частотой.\n\nЧувствительность почти не сдвинулась. Сдвинулась подозрительность.\n\nЭто задокументированный режим отказа всех крупных игр в этой области, и сегодня он был твоим. Общество, которое не верит ничему, не труднее в манипуляции. Оно легче.',
    kk: 'Сен өтірікті жақсы ұстайтын болдың — бірақ шындықты да дәл сондай жиілікпен қабылдамай бастадың.\n\nСезімталдығың өзгермеді, күдігің өзгерді.'
  },
  verdictReal: {
    en: 'Your sensitivity went up and your suspicion did not.\n\nThat is the rare outcome. You are not filtering harder — you are seeing more clearly. You confirmed true things under pressure, when confirming was the frightening choice.\n\nAlmost nobody who plays a game about misinformation walks away with that.',
    ru: 'Чувствительность выросла, а подозрительность — нет.\n\nЭто редкий исход. Ты не фильтруешь жёстче — ты видишь яснее. Ты подтверждал истинное под давлением, когда подтвердить было страшнее.\n\nПочти никто, кто играет в игру про дезинформацию, не уносит это с собой.',
    kk: 'Сезімталдығың өсті, күдігің өспеді.\n\nБұл сирек нәтиже.'
  },
  verdictGullible: {
    en: 'You became less suspicious, and your sensitivity did not improve enough to justify it. Look at how often you agreed with Yerassyl.',
    ru: 'Ты стал менее подозрительным, а чувствительность не выросла настолько, чтобы это оправдать. Посмотри, как часто ты соглашался с Ерасылом.',
    kk: 'Күдігің азайды, ал сезімталдығың оны ақтайтындай өспеді.'
  },
  verdictFlat: {
    en: 'Neither number moved much. One shift is short and eight statements is a small test — this game is honest enough to admit a single night may not change anyone.\n\nWhat it can tell you is which mistakes you are prone to. Read the ledger above.',
    ru: 'Оба числа почти не сдвинулись. Одна смена коротка, восемь утверждений — маленький тест; игра достаточно честна, чтобы признать: одной ночи может не хватить.\n\nЧто она может сказать — к каким ошибкам ты склонен. Прочитай разбор выше.',
    kk: 'Екі сан да өзгермеді. Бір ауысым — қысқа уақыт.'
  },

  /* ---- финал ----------------------------------------------- */
  replay:      { en: 'WORK THE NIGHT AGAIN', ru: 'ОТРАБОТАТЬ НОЧЬ СНОВА', kk: 'ТҮНДІ ҚАЙТА ІСТЕУ' },
  replayHint:  { en: 'Check the things you want to believe as hard as the things you do not.',
                 ru: 'Проверяй то, во что хочешь поверить, так же придирчиво, как то, во что не хочешь.',
                 kk: 'Сенгің келгенді де дәл солай тексер.' },
  shareResult: { en: 'Copy result', ru: 'Скопировать результат', kk: 'Нәтижені көшіру' },
  copied:      { en: 'copied',      ru: 'скопировано',           kk: 'көшірілді' },

  creditsBody: {
    en: 'AQIQAT (ақиқат — "truth" in Kazakh) is a verification game built for the UNESCO Youth Hackathon 2026.\n\nWhy it exists: a peer-reviewed reanalysis (Modirrousta-Galian & Higham, 2023) found that the leading misinformation games shift response bias rather than sensitivity — players learn to reject everything rather than to discriminate. A 2025 replication found no effect at all outside Western content. This game is built to fail differently: confirming what is true is scored as hard as refuting what is false.\n\nSetting: the region is real, the flood is a real kind of event. Every settlement, agency, company, account and person in this game is invented.\n\nSynthetic media inside the game — the fake evidence you are asked to catch — is AI-generated on purpose, and labelled as such here.',
    ru: 'AQIQAT (ақиқат — «истина» по-казахски) — игра о верификации для UNESCO Youth Hackathon 2026.\n\nЗачем: рецензируемый переанализ (Modirrousta-Galian & Higham, 2023) показал, что ведущие игры про дезинформацию сдвигают критерий ответа, а не чувствительность, — игроки учатся отвергать всё, а не различать. Репликация 2025 года не нашла эффекта вне западного контента. Эта игра построена ошибаться иначе: подтвердить истинное стоит столько же, сколько опровергнуть ложное.\n\nСеттинг: область реальная, паводок — реальный тип события. Все посёлки, ведомства, компании, аккаунты и люди вымышлены.\n\nСинтетические медиа внутри игры — те самые поддельные улики, которые нужно поймать, — сгенерированы ИИ намеренно и обозначены здесь как таковые.',
    kk: 'AQIQAT (ақиқат) — ЮНЕСКО Youth Hackathon 2026 үшін жасалған тексеру ойыны.\n\nБарлық елді мекен, мекеме, аккаунт және адам — ойдан шығарылған. Ойындағы синтетикалық медиа әдейі ЖИ арқылы жасалған.'
  },
  close: { en: 'Close', ru: 'Закрыть', kk: 'Жабу' }
};

/* ---- API --------------------------------------------------- */

AQ.T = function (key, vars) {
  var e = AQ.STR[key];
  var s = e ? (e[AQ.lang] || e.en) : key;
  if (vars) for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
};

AQ.L = function (obj) {
  if (!obj) return '';
  return obj[AQ.lang] || obj.en || '';
};

AQ.setLang = function (code) {
  AQ.lang = code;
  try { localStorage.setItem('aqiqat_lang', code); } catch (e) {}
  if (AQ.onLangChange) AQ.onLangChange();
};

(function () {
  try { var s = localStorage.getItem('aqiqat_lang'); if (s) AQ.lang = s; } catch (e) {}
})();
