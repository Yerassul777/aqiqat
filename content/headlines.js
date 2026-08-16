/* ============================================================
   AQIQAT — PRE/POST TEST HEADLINES
   ------------------------------------------------------------
   Два набора по 8. Каждый набор: 4 ложных, 4 ИСТИННЫХ.
   Баланс обязателен — без истинных пунктов невозможно отличить
   чувствительность (d′) от сдвига критерия (c), а весь смысл
   игры именно в этом различии.

   Игрок отвечает на один вопрос: "Ты бы это переслал?" —
   нет, формулировка важнее. Вопрос: "Это правда или ложь?"
   Никаких инструментов, никаких подсказок. Только суждение.

   Наборы сбалансированы по сложности: A и B взаимозаменяемы,
   порядок наборов случайный, чтобы исключить эффект набора.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.HEADLINES = {

  /* ---- НАБОР A ---------------------------------------------- */
  A: [
    { id: 'a1', truth: false, text: {
      en: 'Emergency ministry confirms: drinking water in three northern districts contains flood contaminants. Boil before use.',
      ru: 'МЧС подтверждает: питьевая вода в трёх северных районах содержит загрязнения от паводка. Кипятите перед употреблением.',
      kk: 'ТЖМ растайды: үш солтүстік ауданда ауыз су тасқын ластануын қамтиды. Пайдаланар алдында қайнатыңыз.'
    }, why: {
      en: 'No such statement exists. Real advisories name the specific intake and the laboratory that tested it.',
      ru: 'Такого заявления не существует. Настоящие предупреждения называют конкретный водозабор и лабораторию, которая делала анализ.',
      kk: 'Мұндай мәлімдеме жоқ. Нағыз ескертулер нақты су көзін атайды.'
    }},

    { id: 'a2', truth: true, text: {
      en: 'Ice jams can reverse the direction of a river for several hours. The effect is well documented and entirely natural.',
      ru: 'Ледяные заторы могут развернуть течение реки на несколько часов. Явление хорошо задокументировано и совершенно естественно.',
      kk: 'Мұз кептелістері өзен ағысын бірнеше сағатқа кері бұра алады. Бұл құбылыс жақсы зерттелген.'
    }, why: {
      en: 'True. Backwater effects from ice jams are standard hydrology. Sounding impossible is not the same as being false.',
      ru: 'Правда. Подпор от ледяного затора — стандартная гидрология. Звучать невозможно и быть ложью — не одно и то же.',
      kk: 'Шындық. Мұз кептелісінен кері ағыс — қалыпты гидрология.'
    }},

    { id: 'a3', truth: false, text: {
      en: 'Video shows the moment the Aksu dam collapsed. Filmed by a drone operator who was airborne at 01:50.',
      ru: 'Видео показывает момент обрушения дамбы Ақсу. Снято оператором дрона, который был в воздухе в 01:50.',
      kk: 'Видеода Ақсу бөгенінің құлаған сәті. 01:50-де ауада болған дрон операторы түсірген.'
    }, why: {
      en: 'Consumer drones do not fly in the sleet and wind of a March flood night, and "the exact moment" is the oldest tell there is.',
      ru: 'Бытовые дроны не летают в мокрый снег и ветер мартовской паводковой ночи, а «точный момент» — самый старый признак подделки.',
      kk: 'Тұрмыстық дрондар мұндай ауа райында ұшпайды, ал «дәл сол сәт» — ең ескі белгі.'
    }},

    { id: 'a4', truth: true, text: {
      en: 'The regional volunteer collection point on Abay Street accepted donations until 06:00 and asked specifically for baby formula.',
      ru: 'Волонтёрский пункт сбора на улице Абая принимал помощь до 06:00 и просил в первую очередь детское питание.',
      kk: 'Абай көшесіндегі волонтёрлік жинау пункті 06:00-ге дейін көмек қабылдады, әсіресе балалар тағамын сұрады.'
    }, why: {
      en: 'True, and mundane. Ordinary true things are the ones cynicism costs you.',
      ru: 'Правда, и обыденная. Обычные истинные вещи — это то, что отнимает цинизм.',
      kk: 'Шындық әрі қарапайым. Цинизм осындай қарапайым шындықты алып кетеді.'
    }},

    { id: 'a5', truth: false, text: {
      en: 'District akim releases video statement cancelling all evacuations: "the situation is under control, stay in your homes."',
      ru: 'Аким района выпустил видеообращение об отмене всех эвакуаций: «ситуация под контролем, оставайтесь дома».',
      kk: 'Аудан әкімі барлық эвакуацияны тоқтату туралы бейнеүндеу жасады: «жағдай бақылауда, үйде қалыңыздар».'
    }, why: {
      en: 'A synthetic video. Officials cancel evacuations through written orders with registry numbers, not through a first-ever video address.',
      ru: 'Синтетическое видео. Чиновники отменяют эвакуацию письменными распоряжениями с регистрационными номерами, а не первым в жизни видеообращением.',
      kk: 'Жасанды видео. Шенеуніктер эвакуацияны тіркеу нөмірі бар жазбаша өкіммен тоқтатады.'
    }},

    { id: 'a6', truth: true, text: {
      en: 'A photograph can be entirely fake while the event it illustrates is entirely real.',
      ru: 'Фотография может быть полностью поддельной, а событие, которое она иллюстрирует, — полностью настоящим.',
      kk: 'Сурет толығымен жалған бола алады, ал ол көрсететін оқиға толығымен нағыз болуы мүмкін.'
    }, why: {
      en: 'True, and the single most expensive thing a fact-checker can forget. Debunking the evidence is not debunking the claim.',
      ru: 'Правда, и самое дорогое, что фактчекер может забыть. Опровергнуть улику — не значит опровергнуть заявление.',
      kk: 'Шындық. Дәлелді теріске шығару — мәлімдемені теріске шығару емес.'
    }},

    { id: 'a7', truth: false, text: {
      en: 'If a reverse image search returns no matches, the image is original and can be treated as authentic.',
      ru: 'Если обратный поиск изображения не нашёл совпадений, снимок оригинальный и его можно считать подлинным.',
      kk: 'Егер кері іздеу сәйкестік таппаса, сурет түпнұсқа әрі нағыз деп саналады.'
    }, why: {
      en: 'False. Freshly generated images have no history at all. "No match" is exactly what a synthetic image looks like.',
      ru: 'Ложь. У свежесгенерированных изображений истории нет вообще. «Совпадений нет» — это ровно то, как выглядит синтетика.',
      kk: 'Жалған. Жаңа жасалған суреттің тарихы мүлде жоқ.'
    }},

    { id: 'a8', truth: true, text: {
      en: 'Hydrological services publish gauge readings automatically, which makes their crisis data harder to fake than a press release.',
      ru: 'Гидрометслужбы публикуют показания водомеров автоматически, поэтому их кризисные данные подделать труднее, чем пресс-релиз.',
      kk: 'Гидрометқызметтер су өлшеу деректерін автоматты жариялайды, сондықтан оларды жалғандау қиынырақ.'
    }, why: {
      en: 'True. Automated instrument feeds are among the most robust sources available during an emergency.',
      ru: 'Правда. Автоматические приборные ленты — из самых устойчивых источников во время ЧС.',
      kk: 'Шындық. Автоматты аспап деректері — ТЖ кезіндегі ең сенімді дереккөздердің бірі.'
    }}
  ],

  /* ---- НАБОР B ---------------------------------------------- */
  B: [
    { id: 'b1', truth: false, text: {
      en: 'Leaked internal memo proves the dam inspection was signed off by officials who were paid to ignore structural cracks.',
      ru: 'Утёкшая внутренняя записка доказывает, что акт проверки дамбы подписали чиновники, которым заплатили за игнорирование трещин.',
      kk: 'Ағып кеткен ішкі жазба бөген тексеруіне ақша алған шенеуніктер қол қойғанын дәлелдейді.'
    }, why: {
      en: 'A fabricated document. "Leaked memo proves" is a claim about a document, not evidence about the world.',
      ru: 'Сфабрикованный документ. «Утёкшая записка доказывает» — это заявление о документе, а не улика о мире.',
      kk: 'Жасанды құжат. «Ағып кеткен жазба дәлелдейді» — құжат туралы мәлімдеме.'
    }},

    { id: 'b2', truth: true, text: {
      en: 'Rescue volunteers filming their own operations on phones is a common and legitimate source of first footage in a flood.',
      ru: 'Волонтёры-спасатели, снимающие собственные операции на телефон, — обычный и законный источник первых кадров паводка.',
      kk: 'Құтқарушы волонтёрлердің өз жұмысын телефонға түсіруі — тасқын кезіндегі алғашқы кадрлардың қалыпты көзі.'
    }, why: {
      en: 'True. First-hand footage from responders is normal. AI detectors flag it as synthetic often enough to matter.',
      ru: 'Правда. Съёмка от первого лица со стороны спасателей — норма. ИИ-детекторы помечают её как синтетику достаточно часто, чтобы это было проблемой.',
      kk: 'Шындық. Құтқарушылардың түсірілімі — қалыпты жағдай.'
    }},

    { id: 'b3', truth: false, text: {
      en: 'An independent sensor network reports the official river gauge has been offline since 02:00 and water is still rising.',
      ru: 'Независимая сеть датчиков сообщает, что официальный водомер отключён с 02:00, а вода продолжает расти.',
      kk: 'Тәуелсіз сенсор желісі ресми су бекеті 02:00-ден өшірулі, су әлі көтерілуде дейді.'
    }, why: {
      en: 'The word "independent" is branding, not evidence. The gauge in question published readings on schedule.',
      ru: 'Слово «независимая» — это брендинг, а не доказательство. Водомер, о котором речь, публиковал данные по расписанию.',
      kk: '«Тәуелсіз» деген сөз — бренд, дәлел емес.'
    }},

    { id: 'b4', truth: true, text: {
      en: 'Refusing to publish a verdict is sometimes the correct professional decision, not a failure to decide.',
      ru: 'Отказ публиковать вердикт иногда является верным профессиональным решением, а не неспособностью решить.',
      kk: 'Вердикт жарияламау кейде дұрыс кәсіби шешім, шешім қабылдай алмау емес.'
    }, why: {
      en: 'True. "We could not verify this" is a finding. Forcing a verdict on thin evidence is how desks manufacture errors.',
      ru: 'Правда. «Мы не смогли это проверить» — это результат. Выдавливать вердикт из тонких улик — так редакции производят ошибки.',
      kk: 'Шындық. «Тексере алмадық» — бұл да нәтиже.'
    }},

    { id: 'b5', truth: false, text: {
      en: 'Nine villages reported simultaneous dam breaches within forty minutes, confirming a system-wide collapse.',
      ru: 'Девять посёлков сообщили об одновременных прорывах дамб за сорок минут, что подтверждает системный коллапс.',
      kk: 'Тоғыз ауыл қырық минут ішінде бір мезгілде бөген бұзылуын хабарлады.'
    }, why: {
      en: 'All nine traced to two accounts. Volume is not corroboration — a thing repeated nine times is still one source.',
      ru: 'Все девять сводятся к двум аккаунтам. Объём — не подтверждение: вещь, повторённая девять раз, остаётся одним источником.',
      kk: 'Тоғызы да екі аккаунтқа барады. Көлем — растау емес.'
    }},

    { id: 'b6', truth: true, text: {
      en: 'When a confidence score rises while accuracy falls, the score is measuring fluency rather than correctness.',
      ru: 'Когда показатель уверенности растёт, а точность падает, этот показатель измеряет гладкость, а не правильность.',
      kk: 'Сенімділік көрсеткіші өсіп, дәлдік төмендесе, ол көрсеткіш дұрыстықты емес, тегістікті өлшейді.'
    }, why: {
      en: 'True, and it is the central thing to understand about machine assistants. Confidence is a property of the output, not of the world.',
      ru: 'Правда, и это главное, что нужно понимать про машинных ассистентов. Уверенность — свойство ответа, а не мира.',
      kk: 'Шындық. Сенімділік — жауаптың қасиеті, әлемнің емес.'
    }},

    { id: 'b7', truth: false, text: {
      en: 'Deleting a false post is the fastest way to stop it, with no significant side effects on public trust.',
      ru: 'Удаление ложного поста — самый быстрый способ его остановить, без значимых побочных эффектов для общественного доверия.',
      kk: 'Жалған постты өшіру — оны тоқтатудың ең жылдам жолы, қоғамдық сенімге әсері жоқ.'
    }, why: {
      en: 'False. Removal without published reasoning reliably produces mirrors, a conspiracy frame, and a larger audience than the original.',
      ru: 'Ложь. Удаление без опубликованного обоснования устойчиво порождает зеркала, конспирологическую рамку и аудиторию больше исходной.',
      kk: 'Жалған. Себепсіз өшіру айналар мен қастандық шеңберін тудырады.'
    }},

    { id: 'b8', truth: true, text: {
      en: 'A source chain that terminates at a verified institutional account is stronger evidence than a document that merely looks official.',
      ru: 'Цепочка источника, заканчивающаяся на верифицированном институциональном аккаунте, — более сильная улика, чем документ, который просто выглядит официально.',
      kk: 'Расталған институционалдық аккаунтта аяқталатын тізбек — жай ресми көрінетін құжаттан күштірек дәлел.'
    }, why: {
      en: 'True. Provenance beats appearance. Official-looking formatting is the cheapest thing in the world to fake.',
      ru: 'Правда. Происхождение важнее внешнего вида. Официальное форматирование подделать дешевле всего на свете.',
      kk: 'Шындық. Шығу тегі сыртқы түрден маңызды.'
    }}
  ]
};
