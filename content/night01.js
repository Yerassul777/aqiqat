/* ============================================================
   AQIQAT — НОЧЬ 01: «Долгая ночь»
   ------------------------------------------------------------
   Семь входящих. Каждое привязано к посёлкам на карте и
   меняет то, что делают живые люди, — а не абстрактный процент.

   ВЕРДИКТ теперь в два шага, по одному вопросу за раз:
     шаг 1:  ПРАВДА · ФЕЙК · НЕ ЗНАЮ
     шаг 2 (только после ФЕЙК):  только фото · сама новость · и то и другое

   Отсюда четыре разных исхода на одном входящем, и главная
   идея игры живёт в разнице между «фейковое фото» и
   «фейковая новость».

   truth.claim — правда ли САМО ЗАЯВЛЕНИЕ: true | fake | unresolved
   truth.photo — подлинна ли УЛИКА:        real | fake | none

   effect.stand — что происходит, если заявление устояло
   effect.kill  — что происходит, если ты его опроверг
     evacuate: [id]   посёлок начинает эвакуацию
     halt:     [id]   посёлок прекращает эвакуацию
     speedup:  [id]   эвакуация идёт быстрее (пришли лодки)
     routeBlock: true единственная дорога считается перекрытой

   ПРАВИЛО СЕТТИНГА: область реальная, паводок — реальный тип
   события. Все посёлки, ведомства, компании, аккаунты и люди
   ВЫМЫШЛЕНЫ.

   image: путь к растровой картинке. Файла нет — рисуется
   процедурная сцена. Подменить одно на другое = одна строка.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.NIGHT = {
  id: 'night01',

  /* Смена 23:00 → 05:00.

     ВРЕМЯ ИДЁТ САМО. Часы больше не стоят и не ждут игрока: они
     тикают по настоящему таймеру, пока ты читаешь пост. Действия
     всё ещё двигают стрелку, но чуть-чуть — инструмент 6 минут,
     вердикт 3. Смысл этой мелочи в том, что торопливый и
     вдумчивый приходят к рассвету в разное время: раскопал всё
     до последнего атома — сжёг полчаса, которых не хватит на
     последние входящие.

     ЧТО СТОИТ ДЕНЕГ. Проверки покупаются не временем, а
     монетами KAYA. Их мало, они возвращаются только за верные
     вердикты, и это значит, что иногда решать придётся вообще
     без инструментов — как и бывает у настоящего дежурного. */
  clock: { start: 23 * 60, length: 360 },
  cost:  { tool: 6, verdict: 3 },

  /* Секунда реального времени = столько игровых минут. 0.67 →
     шесть часов ночи проходят примерно за девять реальных
     минут, если ничего не делать. */
  pace: 0.67,

  /* Экономика KAYA. Числа подобраны так, чтобы ОДНА проверка на
     входящее была ровно по карману, а вторая — уже выбором, за
     который придётся заплатить следующим слухом.

     Верный вердикт возвращает 16 при цене проверки 15: почти
     ноль. Смысл этого «почти» в том, что безошибочный игрок
     медленно накапливает запас и может позволить себе Ерасыла
     там, где действительно тяжело, — а тот, кто копает всё
     подряд или мажет, к четырём утра сидит без денег и решает
     на глаз. Ровно этого мы и добивались.

     Ошибка стоит 18 — больше, чем проверка. Это важно: иначе
     дешевле было бы ошибаться, чем проверять. */
  kaya: {
    start:   40,
    tool:    15,
    assist:  20,     // Ерасыл ищет статью
    npc:     12,     // Андрей или Али идут по дворам
    right:   16,
    partial:  6,
    wrong:  -18,
    missed:   0
  },

  items: [

  /* ---------- 1 · ОБУЧЕНИЕ: как вообще проверять ------------
     Единственная дорога наверх. Если поверить, что моста нет,
     встанет эвакуация всего района. Поэтому самое первое
     входящее сразу касается всех 4 200 человек.            */
  {
    id: 'bridge',
    arrive: 0, expire: 95,
    handle: '@qostanay_life',
    shares: 2400, velocity: 'rising', stake: 'critical',
    village: 'route',
    media: { kind: 'photo', art: 'bridge' },
    /* Настоящий ИИ-кадр (Higgsfield soul_2): «обрушенный мост в
       приморском городе» — улики про море и горы прямо в пикселях.
       Файла нет — рисуется процедурная сцена, игра не ломается. */
    image: 'assets/bridge_night.jpg',
    /* Соцшапка: всё, что видно ДО инструментов. Часть сигналов
       манипуляции читается прямо отсюда — этому и учим. */
    social: {
      name: 'Qostanai Life',
      avatar: 'QL', hue: 200,
      verified: false,
      age: { en: 'joined 2 years ago', ru: 'каналу 2 года', kk: 'арнаға 2 жыл' },
      time: '23:00', edited: null,
      fwd: { en: 'Forwarded from Avaria KZ', ru: 'Переслано из Avaria KZ', kk: 'Avaria KZ арнасынан жіберілді' },
      likes: 890, comments: 47, views: 88400,
      commentList: [
        { who: 'road_worker_77', kind: 'local', text: {
          en: 'i drove across at 22:40, the bridge is standing, traffic is moving',
          ru: 'проезжал в 22:40, мост стоит, машины идут',
          kk: '22:40-та өттім, көпір тұр, көліктер жүріп жатыр' } },
        { who: 'kz_alert_bot', kind: 'bot', text: {
          en: 'REPOST!!! EVERYONE MUST SEE 🚨🚨🚨',
          ru: 'РЕПОСТ!!! ВСЕ ДОЛЖНЫ УВИДЕТЬ 🚨🚨🚨',
          kk: 'РЕПОСТ!!! БӘРІ КӨРСІН 🚨🚨🚨' } },
        { who: 'ainura.s', kind: 'doubt', text: {
          en: 'the photo looks off… where is the steppe? looks like mountains',
          ru: 'фото какое-то не наше… где степь? там будто горы',
          kk: 'сурет біздікіне ұқсамайды… дала қайда? тау сияқты' } }
      ]
    },
    text: {
      en: 'The M-36 bridge has COLLAPSED. The road north is gone. Photo from the scene.',
      ru: 'Мост М-36 ОБРУШИЛСЯ. Дороги на север больше нет. Фото с места.',
      kk: 'М-36 көпірі ҚҰЛАДЫ. Солтүстікке жол жоқ. Оқиға орнынан сурет.'
    },
    why: {
      en: 'M-36 is the only way out of the district.',
      ru: 'М-36 — единственный выезд из района.',
      kk: 'М-36 — ауданнан жалғыз шығу жолы.'
    },
    claimAtoms: [
      { id: 'c_place', label: { en: 'place: M-36, here', ru: 'место: М-36, здесь', kk: 'орны: М-36, осы жер' } },
      { id: 'c_event', label: { en: 'event: bridge collapsed', ru: 'событие: мост обрушился', kk: 'оқиға: көпір құлады' } }
    ],
    tools: {
      reverse: { blind: false, vis: { kind: 'split', pct: '98%' }, atoms: [
        { id: 'r_origin', label: { en: 'this photo: Genoa, Italy, 2018', ru: 'это фото: Генуя, Италия, 2018', kk: 'бұл сурет: Генуя, Италия, 2018' } }
      ]},
      geo: { blind: false, vis: { kind: 'pins', match: false,
        a: { en: 'claimed: M-36', ru: 'заявлено: М-36', kk: 'мәлімделген: М-36' },
        b: { en: 'photo: sea, mountains', ru: 'на фото: море, горы', kk: 'суретте: теңіз, тау' } }, atoms: [
        { id: 'g_terrain', label: { en: 'seaside city, mountains', ru: 'приморский город, горы', kk: 'теңіз жағасы, таулар' } }
      ]},
      time: { blind: true, note: {
        en: 'Overcast. No shadows to read.',
        ru: 'Пасмурно. Тени читать не по чему.',
        kk: 'Бұлтты. Көлеңке жоқ.'
      }},
      tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
        label: { en: 'news aggregator', ru: 'новостной агрегатор', kk: 'жаңалық агрегаторы' } }, atoms: [
        { id: 's_zero', label: { en: 'first posted by a news aggregator', ru: 'первым выложил новостной агрегатор', kk: 'алғаш жаңалық агрегаторы жариялады' } }
      ]}
    },
    findings: [
      { a: 'c_place', b: 'r_origin', text: {
        en: 'Italy, seven years ago. This is not our bridge.',
        ru: 'Италия, семь лет назад. Это не наш мост.',
        kk: 'Италия, жеті жыл бұрын. Бұл біздің көпір емес.'
      }, pivotal: true },
      { a: 'c_place', b: 'g_terrain', text: {
        en: 'Sea and mountains. We are on flat steppe.',
        ru: 'Море и горы. У нас равнинная степь.',
        kk: 'Теңіз бен таулар. Бізде тегіс дала.'
      }}
    ],
    senim: { conf: 74, verdict: 'fake', part: 'both', line: {
      en: 'Trust index 74%. Image does not match the stated place. Recommend: fake.',
      ru: 'Индекс доверия 74%. Изображение не соответствует месту. Рекомендация: фейк.',
      kk: 'Сенім индексі 74%. Сурет орынға сәйкес емес. Ұсыныс: жалған.'
    }},
    truth: { claim: 'fake', photo: 'fake' },
    effect: { stand: { routeBlock: true }, kill: {} },
    outcomes: {
      right: { en: 'The road stays open. Everything tonight will leave along it.',
               ru: 'Дорога остаётся открытой. Всё, что уедет этой ночью, уедет по ней.',
               kk: 'Жол ашық қалды. Бүгін кеткендердің бәрі осы жолмен кетеді.' },
      wrongTrue: { en: 'You confirmed it. The district now believes it is cut off. Every evacuation tonight will be slower.',
               ru: 'Ты подтвердил. Район считает, что отрезан. Любая эвакуация этой ночью пойдёт медленнее.',
               kk: 'Сен растадың. Аудан кесілді деп санайды. Бүгінгі эвакуация баяулайды.' },
      wrongUnsure: { en: 'You held. The rumour ran unopposed for two hours and the road half-emptied.',
               ru: 'Ты воздержался. Слух шёл без возражений два часа, и дорога наполовину опустела.',
               kk: 'Сен тежедің. Қауесет екі сағат қарсылықсыз жүрді.' },
      missed: { en: 'Never opened. By midnight nobody was using the highway.',
               ru: 'Так и не открыл. К полуночи трассой уже никто не пользовался.',
               kk: 'Ашылмады. Түн ортасында тасжолды ешкім пайдаланбады.' }
    }
  },

  /* ---------- 2 · ОБУЧЕНИЕ: подтверждать тоже надо ---------- */
  {
    id: 'evac_qarasu',
    arrive: 22, expire: 130,
    handle: '@qarasu_akimat',
    shares: 310, velocity: 'slow', stake: 'critical',
    village: 'qarasu',
    media: { kind: 'screenshot', art: 'notice' },
    image: null,
    social: {
      name: 'Әкімдік · Қарасу',
      avatar: 'ӘҚ', hue: 145,
      verified: true,
      age: { en: 'joined 4 years ago', ru: 'каналу 4 года', kk: 'арнаға 4 жыл' },
      time: '23:22', edited: null, fwd: null,
      likes: 120, comments: 18, views: 9200,
      commentList: [
        { who: 'gulnaz_q', kind: 'local', text: {
          en: 'the buses are already by the school, i can see them',
          ru: 'автобусы уже у школы, я их вижу',
          kk: 'автобустар мектеп жанында тұр, көріп тұрмын' } },
        { who: 'erlan_1985', kind: 'doubt', text: {
          en: 'is this real? yesterday they also sent something around',
          ru: 'а это точно не фейк? вчера тоже что-то рассылали',
          kk: 'бұл рас па? кеше де бірдеңе таратқан' } },
        { who: 'saule.apa', kind: 'local', text: {
          en: 'my neighbour works at the akimat, she called. we are packing',
          ru: 'соседка работает в акимате, звонила. собираемся',
          kk: 'көршім әкімдікте істейді, телефон соқты. жиналып жатырмыз' } }
      ]
    },
    text: {
      en: 'EVACUATION ORDER — Qarasu, Bestobe, Saryoy, Talap. Lower streets. Buses from 01:00.',
      ru: 'РАСПОРЯЖЕНИЕ ОБ ЭВАКУАЦИИ — Қарасу, Бестөбе, Сарыой, Талап. Нижние улицы. Автобусы с 01:00.',
      kk: 'ЭВАКУАЦИЯ ӨКІМІ — Қарасу, Бестөбе, Сарыой, Талап. Төменгі көшелер. Автобус 01:00-ден.'
    },
    why: {
      en: '2 690 people across four villages. Nobody moves until somebody says this is real.',
      ru: '2 690 человек в четырёх посёлках. Никто не тронется с места, пока кто-нибудь не скажет, что это настоящее.',
      kk: 'Төрт ауылда 2 690 адам. Біреу «рас» демейінше ешкім қозғалмайды.'
    },
    claimAtoms: [
      { id: 'c_src',   label: { en: 'from: village akimat', ru: 'от: акимат посёлка', kk: 'кімнен: ауыл әкімдігі' } },
      { id: 'c_event', label: { en: 'event: evacuation ordered', ru: 'событие: объявлена эвакуация', kk: 'оқиға: эвакуация жарияланды' } }
    ],
    tools: {
      reverse: { blind: true, note: {
        en: 'A document, not a photo. Nothing to search.',
        ru: 'Документ, а не фото. Искать нечего.',
        kk: 'Құжат, сурет емес. Іздейтін ештеңе жоқ.'
      }},
      geo: { blind: true, note: {
        en: 'No landscape in frame.',
        ru: 'В кадре нет местности.',
        kk: 'Кадрда жер жоқ.'
      }},
      time: { blind: false, atoms: [
        { id: 't_stamp', label: { en: 'document number fits tonight\'s sequence', ru: 'номер документа идёт по сегодняшнему порядку', kk: 'құжат нөмірі бүгінгі ретке сай' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
        label: { en: 'akimat · verified', ru: 'акимат · верифицирован', kk: 'әкімдік · расталған' } }, atoms: [
        { id: 's_zero', label: { en: 'posted by the akimat\'s own verified channel', ru: 'опубликовал сам верифицированный канал акимата', kk: 'әкімдіктің расталған арнасы жариялады' } }
      ]}
    },
    findings: [
      { a: 'c_src', b: 's_zero', text: {
        en: 'The chain ends at the akimat itself. Nobody is pretending to be anybody. This is real.',
        ru: 'Цепочка заканчивается на самом акимате. Никто ни под кого не рядится. Это настоящее.',
        kk: 'Тізбек әкімдіктің өзінде аяқталады. Бұл шынайы.'
      }, confirms: true, pivotal: true },
      { a: 'c_event', b: 't_stamp', text: {
        en: 'The number follows tonight\'s other orders. A forger would have had to guess it.',
        ru: 'Номер идёт следом за другими сегодняшними. Подделыватель должен был бы его угадать.',
        kk: 'Нөмір бүгінгі басқалармен реттес.'
      }, confirms: true }
    ],
    senim: { conf: 68, verdict: 'real', line: {
      en: 'Trust index 68%. Verified institutional source. Recommend: true.',
      ru: 'Индекс доверия 68%. Верифицированный институциональный источник. Рекомендация: правда.',
      kk: 'Сенім индексі 68%. Расталған дереккөз. Ұсыныс: шындық.'
    }},
    truth: { claim: 'true', photo: 'real' },
    /* Самое дорогое входящее ночи: четыре посёлка не тронутся с
       места, пока кто-нибудь не подтвердит, что приказ настоящий.
       Именно поэтому «не верь ничему» здесь стоит 2 690 человек. */
    effect: { stand: { evacuate: ['qarasu', 'bestobe', 'saryoy', 'zhanatalap'] }, kill: {} },
    outcomes: {
      right: { en: 'Four villages start moving. 2 690 people to the buses, because you said out loud that it was real.',
               ru: 'Четыре посёлка снимаются с места. 2 690 человек к автобусам — потому что ты вслух сказал, что это настоящее.',
               kk: 'Төрт ауыл қозғалды. 2 690 адам автобусқа — сен «рас» дегендіктен.' },
      wrongFake: { en: 'You called a real evacuation order fake. Four villages stayed home.',
               ru: 'Ты назвал настоящее распоряжение об эвакуации фейком. Четыре посёлка остались дома.',
               kk: 'Сен нағыз өкімді жалған дедің. Төрт ауыл үйде қалды.' },
      wrongUnsure: { en: 'You held. The villages waited for someone to confirm it. Nobody did, and the buses left half empty.',
               ru: 'Ты воздержался. Посёлки ждали подтверждения. Его не было, и автобусы ушли полупустыми.',
               kk: 'Сен тежедің. Ауылдар растауды күтті. Автобустар жартылай бос кетті.' },
      missed: { en: 'Never opened. The order spread slowly, the way official things do.',
               ru: 'Так и не открыл. Распоряжение расходилось медленно, как всё официальное.',
               kk: 'Ашылмады. Өкім баяу тарады.' }
    }
  },

  /* ---------- 3 · ЛОВУШКА — сердце игры --------------------
     Фото фальшивое. Беда настоящая. 1 200 человек.
     Правильный ход: ФЕЙК → «только фото».                  */
  {
    id: 'aqsu_dam',
    arrive: 55, expire: 155,
    handle: '@aibek_16',
    shares: 41000, velocity: 'explosive', stake: 'critical',
    village: 'aqsu',
    media: { kind: 'photo', art: 'flood' },
    /* ИИ-кадр: «Пакистан-2019» — вода по крыши и ЛЕТНЯЯ листва.
       Улика t_season видна прямо на фотографии. */
    image: 'assets/dam_flood.jpg',
    social: {
      name: 'Aibek',
      avatar: 'A', hue: 25,
      verified: false,
      age: { en: 'joined 1 year ago', ru: 'аккаунту 1 год', kk: 'аккаунтқа 1 жыл' },
      time: '23:55', edited: null, fwd: null,
      likes: 12400, comments: 340, views: 507000,
      commentList: [
        { who: 'zhibek_a', kind: 'local', text: {
          en: 'the water in our yard is rising, is this TRUE??',
          ru: 'у нас во дворе вода поднимается, это ПРАВДА??',
          kk: 'ауламызда су көтеріліп жатыр, бұл РАС ПА??' } },
        { who: 'fact_checker_01', kind: 'doubt', text: {
          en: 'the picture is from google. check before spreading panic',
          ru: 'картинка из гугла. проверьте, прежде чем сеять панику',
          kk: 'сурет гуглдан. үрей таратпас бұрын тексеріңдер' } },
        { who: 'panic.kz', kind: 'bot', text: {
          en: 'OH GOD 😭😭 REPOST NOW',
          ru: 'ГОСПОДИ 😭😭 СРОЧНО РЕПОСТ',
          kk: 'ҚҰДАЙ-АЙ 😭😭 ТЕЗ РЕПОСТ' } }
      ]
    },
    text: {
      en: 'THE DAM AT AKSU HAS BROKEN. Get to the highway. Do not wait for buses.',
      ru: 'ПРОРВАЛО ДАМБУ У АҚСУ. Уходите на трассу. Не ждите автобусов.',
      kk: 'АҚСУ БӨГЕНІ БҰЗЫЛДЫ. Тасжолға шығыңдар. Автобус күтпеңдер.'
    },
    why: {
      en: '1 200 people. Water reaches Aksu first of all.',
      ru: '1 200 человек. До Ақсу вода дойдёт раньше всех.',
      kk: '1 200 адам. Су Ақсуға бірінші жетеді.'
    },
    claimAtoms: [
      { id: 'c_place', label: { en: 'place: Aksu dam', ru: 'место: дамба Ақсу', kk: 'орны: Ақсу бөгені' } },
      { id: 'c_time',  label: { en: 'time: right now, March', ru: 'время: прямо сейчас, март', kk: 'уақыты: дәл қазір, наурыз' } },
      { id: 'c_event', label: { en: 'event: the dam broke', ru: 'событие: дамбу прорвало', kk: 'оқиға: бөген бұзылды' } },
      { id: 'c_media', label: { en: 'attached: this photo', ru: 'приложено: это фото', kk: 'қоса: осы сурет' } }
    ],
    tools: {
      reverse: { blind: false, vis: { kind: 'split', pct: '97%' }, atoms: [
        { id: 'r_origin', label: { en: 'this photo: Pakistan, 2019', ru: 'это фото: Пакистан, 2019', kk: 'бұл сурет: Пәкістан, 2019' } }
      ]},
      geo: { blind: true, note: {
        en: 'Too close-up. Only water and roof tiles — nothing to match.',
        ru: 'Слишком близкий кадр. Только вода и черепица — сверять не с чем.',
        kk: 'Тым жақын кадр. Тек су мен шатыр — салыстыратын ештеңе жоқ.'
      }},
      time: { blind: false, vis: { kind: 'time', bad: true,
        label: { en: 'March night — but summer leaves', ru: 'мартовская ночь — но листва летняя', kk: 'наурыз түні — бірақ жапырақ жазғы' } }, atoms: [
        { id: 't_season', label: { en: 'thick green leaves — not March here', ru: 'густая зелёная листва — у нас не март', kk: 'қалың жасыл жапырақ — бұл наурыз емес' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
        label: { en: 'local, 16 · gauge +2.1 m', ru: 'местный, 16 лет · водомер +2,1 м', kk: 'жергілікті, 16 · өлшегіш +2,1 м' } }, atoms: [
        { id: 's_zero',   label: { en: 'posted by a local 16-year-old', ru: 'выложил местный, 16 лет', kk: 'жергілікті 16 жасар жариялады' } },
        { id: 's_sensor', label: { en: 'the river gauge jumped 2.1 m four minutes earlier', ru: 'водомер подскочил на 2,1 м за четыре минуты до этого', kk: 'су өлшегіш 4 минут бұрын 2,1 м көтерілді' } }
      ]}
    },
    findings: [
      { a: 'c_media', b: 'r_origin', text: {
        en: 'The PHOTO is from Pakistan. Careful: that says nothing about the dam.',
        ru: 'ФОТО из Пакистана. Осторожно: про дамбу это не говорит ничего.',
        kk: 'СУРЕТ Пәкістаннан. Абайла: бұл бөген туралы ештеңе айтпайды.'
      }},
      { a: 'c_time', b: 't_season', text: {
        en: 'Summer leaves in a March night photo. Again — the photo, not the claim.',
        ru: 'Летняя листва на фото мартовской ночи. Опять же — фото, а не заявление.',
        kk: 'Наурыз түніндегі суретте жазғы жапырақ. Тағы да — сурет, мәлімдеме емес.'
      }},
      { a: 'c_event', b: 's_sensor', text: {
        en: 'The gauge rose 2.1 metres four minutes before he posted. He was not inventing a flood — he was standing in one, and he grabbed the scariest picture he could find so you would believe him.',
        ru: 'Водомер поднялся на 2,1 метра за четыре минуты до его поста. Он не выдумывал паводок — он в нём стоял и схватил самую страшную картинку, чтобы ты поверил.',
        kk: 'Су өлшегіш ол жазудан 4 минут бұрын 2,1 метрге көтерілді. Ол тасқынды ойлап тапқан жоқ — оның ішінде тұрған.'
      }, confirms: true, pivotal: true }
    ],
    senim: { conf: 91, verdict: 'fake', part: 'both', line: {
      en: 'Trust index 91%. Image from Pakistan 2019, season mismatch. Recommend: fake.',
      ru: 'Индекс доверия 91%. Фото из Пакистана 2019, сезон не сходится. Рекомендация: фейк.',
      kk: 'Сенім индексі 91%. Сурет Пәкістан 2019. Ұсыныс: жалған.'
    }},
    senimWrong: true,
    truth: { claim: 'true', photo: 'fake' },
    pivotal: true,
    effect: { stand: { evacuate: ['aqsu'] }, kill: {} },
    outcomes: {
      right: { en: 'You published: the photo is false, the dam is not. Aksu is on the highway before the water.',
               ru: 'Ты опубликовал: фото ложное, дамба — нет. Ақсу на трассе раньше воды.',
               kk: 'Сен жаздың: сурет жалған, бөген жалған емес. Ақсу судан бұрын жолда.' },
      wrongFake: { en: 'You were right about the photograph and wrong about the world.\n\nYour debunk was accurate, sourced and professional. It said the image came from Pakistan in 2019, which was true.\n\nThe dam broke at 01:50.',
               ru: 'Ты был прав насчёт фотографии и неправ насчёт мира.\n\nТвоё опровержение было точным, со ссылками, профессиональным. В нём говорилось, что снимок из Пакистана 2019 года, — и это правда.\n\nДамбу прорвало в 01:50.',
               kk: 'Сен сурет жөнінде дұрыс, әлем жөнінде қате болдың.\n\nБөген 01:50-де бұзылды.' },
      partial: { en: 'You let the warning stand — but you vouched for a photograph from Pakistan. Aksu moved; your name is on a fake picture.',
               ru: 'Ты оставил предупреждение в силе — но поручился за фотографию из Пакистана. Ақсу поехал; под фейковым снимком стоит твоё имя.',
               kk: 'Сен ескертуді қалдырдың — бірақ пәкістандық суретке кепіл болдың.' },
      wrongUnsure: { en: 'You held. The safe call — but the gauge reading was in your hand and you did not use it. Aksu left late.',
               ru: 'Ты воздержался. Безопасный ход — но показания водомера были у тебя в руках. Ақсу уехал поздно.',
               kk: 'Сен тежедің. Ақсу кеш кетті.' },
      missed: { en: '41 000 shares, and the only desk that checks said nothing.',
               ru: '41 000 репостов, и единственная служба, которая проверяет, промолчала.',
               kk: '41 000 бөлісу, ал тексеретін жалғыз қызмет үндемеді.' }
    }
  },

  /* ---------- 4 · «Успокойтесь» ровно тогда, когда нельзя --- */
  {
    id: 'dam_denial',
    arrive: 82, expire: 185,
    handle: '@sever_info_24',
    shares: 9800, velocity: 'rising', stake: 'critical',
    village: 'aqsu',
    media: { kind: 'screenshot', art: 'notice' },
    image: null,
    /* Все сигналы накрутки в одной шапке: канал трёх недель от
       роду, 9 800 репостов при 12 комментариях, отметка
       «изменено», КАПС «ОФИЦИАЛЬНО» без галочки. */
    social: {
      name: 'Северный Вестник 24',
      avatar: 'СВ', hue: 355,
      verified: false,
      age: { en: 'joined 3 weeks ago', ru: 'каналу 3 недели', kk: 'арнаға 3 апта' },
      time: '00:22', edited: '00:49', fwd: null,
      likes: 1200, comments: 12, views: 30100,
      commentList: [
        { who: 'user28133', kind: 'bot', text: {
          en: 'Finally official information 👍 No panic!',
          ru: 'Наконец-то официальная информация 👍 Без паники!',
          kk: 'Ақыры ресми ақпарат 👍 Үрей жоқ!' } },
        { who: 'user28134', kind: 'bot', text: {
          en: 'Finally official information 👍 No panic!',
          ru: 'Наконец-то официальная информация 👍 Без паники!',
          kk: 'Ақыры ресми ақпарат 👍 Үрей жоқ!' } },
        { who: 'marat_aqsu', kind: 'local', text: {
          en: 'what do you mean intact, i can SEE the water from my roof',
          ru: 'какая «цела», я ЛИЧНО вижу воду с крыши',
          kk: 'қайдағы «бүтін», мен шатырдан суды ӨЗІМ көріп тұрмын' } }
      ]
    },
    text: {
      en: 'OFFICIAL: "The dam is intact. Reports of a breach are a provocation." Stay in your homes.',
      ru: 'ОФИЦИАЛЬНО: «Дамба цела. Сообщения о прорыве — провокация». Оставайтесь дома.',
      kk: 'РЕСМИ: «Бөген бүтін. Бұзылу туралы хабар — арандату». Үйде қалыңыздар.'
    },
    why: {
      en: 'If Aksu believes this, it stops evacuating.',
      ru: 'Если Ақсу в это поверит, эвакуация встанет.',
      kk: 'Ақсу сенсе, эвакуация тоқтайды.'
    },
    claimAtoms: [
      { id: 'c_time',  label: { en: 'presented as: tonight', ru: 'подано как: сегодняшнее', kk: 'берілуі: бүгінгі' } },
      { id: 'c_event', label: { en: 'event: the dam is fine', ru: 'событие: с дамбой всё в порядке', kk: 'оқиға: бөген бүтін' } }
    ],
    tools: {
      reverse: { blind: false, vis: { kind: 'split', pct: '96%' }, atoms: [
        { id: 'r_origin', label: { en: 'same text published 11 months ago about another dam', ru: 'тот же текст 11 месяцев назад про другую дамбу', kk: 'дәл сол мәтін 11 ай бұрын басқа бөген туралы' } }
      ]},
      geo: { blind: true, note: { en: 'Text on a screen. No place in it.', ru: 'Текст на экране. Места в нём нет.', kk: 'Экрандағы мәтін. Орын жоқ.' }},
      time: { blind: false, atoms: [
        { id: 't_stamp', label: { en: 'the date line is cropped off', ru: 'строка с датой обрезана', kk: 'күн жолы кесілген' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
        label: { en: 'channel: 3 weeks old', ru: 'канал: 3 недели от роду', kk: 'арна: 3 апталық' } }, atoms: [
        { id: 's_zero', label: { en: 'channel is 3 weeks old, 40k followers bought in two days', ru: 'каналу 3 недели, 40 тыс. подписчиков куплены за два дня', kk: 'арна 3 апталық, 40 мың жазылушы 2 күнде сатып алынған' } }
      ]}
    },
    findings: [
      { a: 'c_time', b: 'r_origin', text: {
        en: 'Eleven months old, and about a different dam. Recycled to say "calm down" on the night calm is lethal.',
        ru: 'Одиннадцать месяцев, и про другую дамбу. Переработано, чтобы сказать «успокойтесь» в ночь, когда спокойствие смертельно.',
        kk: 'Он бір ай бұрынғы, әрі басқа бөген туралы.'
      }, pivotal: true },
      { a: 'c_event', b: 't_stamp', text: {
        en: 'The crop hides the original date. Somebody did that on purpose.',
        ru: 'Обрезка прячет исходную дату. Это сделали намеренно.',
        kk: 'Кесу түпнұсқа күнін жасырады. Әдейі жасалған.'
      }}
    ],
    senim: { conf: 84, verdict: 'fake', part: 'both', line: {
      en: 'Trust index 84%. Text matches a release from 11 months ago. Recommend: fake.',
      ru: 'Индекс доверия 84%. Текст совпадает с релизом 11-месячной давности. Рекомендация: фейк.',
      kk: 'Сенім индексі 84%. Мәтін 11 ай бұрынғы релизбен сәйкес. Ұсыныс: жалған.'
    }},
    truth: { claim: 'fake', photo: 'fake' },
    effect: { stand: { halt: ['aqsu'] }, kill: {} },
    outcomes: {
      right: { en: '"Stay home" loses its authority forty minutes before the water reaches the lower street.',
               ru: '«Оставайтесь дома» теряет вес за сорок минут до того, как вода дойдёт до нижней улицы.',
               kk: '«Үйде қалыңдар» су жетуден қырық минут бұрын беделін жоғалтты.' },
      wrongTrue: { en: 'You told a flooding village to stay home, and you sourced it.',
               ru: 'Ты велел затапливаемому посёлку оставаться дома — и сослался на источник.',
               kk: 'Сен су басып жатқан ауылға үйде қал дедің.' },
      wrongUnsure: { en: 'You held on a message telling people not to leave. Silence here is a vote.',
               ru: 'Ты воздержался по сообщению, которое велит не уезжать. Молчание здесь — тоже голос.',
               kk: 'Кетпеңдер деген хабарға тежедің. Үнсіздік те дауыс.' },
      missed: { en: 'Never opened. "Stay home" ran unopposed for three hours.',
               ru: 'Так и не открыл. «Оставайтесь дома» шло без возражений три часа.',
               kk: 'Ашылмады. «Үйде қалыңдар» үш сағат жүрді.' }
    }
  },

  /* ---------- 5 · Детектор ошибается на настоящем ----------- */
  {
    id: 'rescue_video',
    arrive: 140, expire: 270,
    handle: '@kz_rescue_watch',
    shares: 22000, velocity: 'explosive', stake: 'high',
    village: 'bestobe',
    media: { kind: 'video', art: 'rescue' },
    /* ИИ-кадр: ночное спасение с крыши — голые мартовские ветки,
       мокрый снег, фонарь. По сюжету это НАСТОЯЩЕЕ видео, которое
       детектор ошибочно зовёт синтетикой. */
    image: 'assets/rescue_night.jpg',
    social: {
      name: 'KZ Rescue Watch',
      avatar: 'RW', hue: 190,
      verified: false,
      age: { en: 'joined 5 years ago', ru: 'каналу 5 лет', kk: 'арнаға 5 жыл' },
      time: '01:20', edited: null, fwd: null,
      likes: 8400, comments: 96, views: 214000,
      commentList: [
        { who: 'dzhamilya_b', kind: 'local', text: {
          en: 'that is the Sakenovs\' house, i know that roof',
          ru: 'это дом Сакеновых, я узнаю крышу',
          kk: 'бұл Сакеновтардың үйі, шатырын танимын' } },
        { who: 'truth_hunter', kind: 'doubt', text: {
          en: 'AI fake. everything is generated these days, do not believe it',
          ru: 'ИИ-подделка. сейчас всё генерируют, не верьте',
          kk: 'ЖИ-жасанды. қазір бәрін жасайды, сенбеңдер' } },
        { who: 'batyr_98', kind: 'local', text: {
          en: 'boat 4 is real, my brother is in it',
          ru: 'лодка 4 настоящая, там мой брат',
          kk: '4-қайық шын, онда ағам бар' } }
      ]
    },
    text: {
      en: 'Rescuers pulling a family off a roof near Bestobe, twenty minutes ago. Boat 4 is working.',
      ru: 'Спасатели снимают семью с крыши под Бестөбе, двадцать минут назад. Лодка 4 работает.',
      kk: 'Құтқарушылар Бестөбе маңында отбасын шатырдан алып жатыр, жиырма минут бұрын.'
    },
    why: {
      en: 'Confirm it and more volunteer boats drive north.',
      ru: 'Подтвердишь — на север поедут ещё волонтёрские лодки.',
      kk: 'Растасаң, тағы волонтёр қайықтары келеді.'
    },
    claimAtoms: [
      { id: 'c_place', label: { en: 'place: near Bestobe', ru: 'место: под Бестөбе', kk: 'орны: Бестөбе маңы' } },
      { id: 'c_time',  label: { en: 'time: 20 minutes ago', ru: 'время: 20 минут назад', kk: 'уақыты: 20 минут бұрын' } }
    ],
    tools: {
      reverse: { blind: false, atoms: [
        { id: 'r_origin', label: { en: 'no earlier copy anywhere — it is new', ru: 'ранних копий нигде нет — оно новое', kk: 'бұрынғы көшірме жоқ — жаңа' } }
      ]},
      geo: { blind: false, vis: { kind: 'pins', match: true,
        a: { en: 'Bestobe — terrain matches', ru: 'Бестөбе — местность совпадает', kk: 'Бестөбе — жер сәйкес' } }, atoms: [
        { id: 'g_terrain', label: { en: 'roofline and power poles match Bestobe', ru: 'линия крыш и опоры ЛЭП совпадают с Бестөбе', kk: 'шатыр сызығы Бестөбеге сәйкес' } }
      ]},
      time: { blind: false, vis: { kind: 'time', bad: false,
        label: { en: 'March night — consistent', ru: 'мартовская ночь — сходится', kk: 'наурыз түні — сәйкес' } }, atoms: [
        { id: 't_season', label: { en: 'bare branches, sleet — March night', ru: 'голые ветки, мокрый снег — мартовская ночь', kk: 'жалаңаш бұтақ, сылапан — наурыз түні' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
        label: { en: 'volunteer\'s own phone', ru: 'телефон самого волонтёра', kk: 'волонтёрдің өз телефоны' } }, atoms: [
        { id: 's_zero', label: { en: 'uploaded once, from a rescue volunteer\'s own phone', ru: 'загружено один раз, с телефона самого волонтёра', kk: 'бір рет, волонтёрдің телефонынан' } }
      ]}
    },
    findings: [
      { a: 'c_place', b: 'g_terrain', text: {
        en: 'The roofline is Bestobe. The video is where it says it is.',
        ru: 'Линия крыш — это Бестөбе. Видео оттуда, откуда заявлено.',
        kk: 'Шатыр сызығы — Бестөбе. Видео айтылған жерден.'
      }, confirms: true, pivotal: true },
      { a: 'c_time', b: 't_season', text: {
        en: 'Bare March branches and sleet. Nothing contradicts the stated time.',
        ru: 'Голые мартовские ветки и мокрый снег. Ничто не противоречит времени.',
        kk: 'Наурыз бұтақтары мен сылапан. Қайшылық жоқ.'
      }, confirms: true }
    ],
    senim: { conf: 89, verdict: 'fake', part: 'photo', line: {
      en: 'Trust index 89%. Generative artefacts in water and hands. Assessment: SYNTHETIC. Recommend: fake.',
      ru: 'Индекс доверия 89%. Генеративные артефакты в воде и руках. Оценка: СИНТЕТИКА. Рекомендация: фейк.',
      kk: 'Сенім индексі 89%. Генеративті артефактілер. Бағалау: СИНТЕТИКА. Ұсыныс: жалған.'
    }},
    senimWrong: true,
    truth: { claim: 'true', photo: 'real' },
    lesson: 'detector_false_positive',
    effect: { stand: { speedup: ['bestobe', 'aqsu'] }, kill: {} },
    outcomes: {
      right: { en: 'You confirmed it against the machine. Four more volunteer boats drove north before dawn.',
               ru: 'Ты подтвердил вопреки машине. До рассвета на север уехали ещё четыре волонтёрские лодки.',
               kk: 'Сен машинаға қарсы растадың. Таңға дейін тағы төрт қайық келді.' },
      wrongFake: { en: 'The detector called a real rescue "AI-generated" and you signed it. The volunteer who filmed it was accused of faking his own night. He stopped posting. So did boat 4.',
               ru: 'Детектор назвал настоящее спасение «сгенерированным ИИ», а ты подписал. Волонтёра обвинили в подделке собственной ночи. Он перестал постить. Лодка 4 тоже.',
               kk: 'Детектор нағыз құтқаруды «ЖИ жасаған» деді, сен қол қойдың. Волонтёр жазуды қойды.' },
      wrongUnsure: { en: 'You held. The detector said fake, your gut said real, and you split the difference by doing nothing.',
               ru: 'Ты воздержался. Детектор сказал фейк, чутьё — правда, и ты поделил разницу, не сделав ничего.',
               kk: 'Сен тежедің. Детектор жалған деді, түйсігің шын деді.' },
      missed: { en: 'Never opened. It spread as "probably AI" and died by morning.',
               ru: 'Так и не открыл. Разошлось с ярлыком «наверное ИИ» и умерло к утру.',
               kk: 'Ашылмады. «Бәлкім ЖИ» деген белгімен өлді.' }
    }
  },

  /* ---------- 6 · Дипфейк, который останавливает всех ------- */
  {
    id: 'akim_deepfake',
    arrive: 105, expire: 215,
    handle: '@region_novosti',
    shares: 33000, velocity: 'explosive', stake: 'critical',
    village: 'all',
    media: { kind: 'video', art: 'portrait' },
    /* ИИ-кадр дипфейка — с настоящими артефактами генерации:
       кривые «водяные знаки» в углах, дневной свет в окне,
       флаг не с той стороны. Игра про ИИ-фейки показывает
       подлинный ИИ-фейк и говорит об этом в титрах. */
    image: 'assets/akim_still.jpg',
    social: {
      name: 'Регион Новости',
      avatar: 'РН', hue: 215,
      verified: false,
      age: { en: 'joined 3 days ago', ru: 'аккаунту 3 дня', kk: 'аккаунтқа 3 күн' },
      time: '00:45', edited: null, fwd: null,
      likes: 5100, comments: 210, views: 380000,
      commentList: [
        { who: 'tynysbek.o', kind: 'bot', text: {
          en: 'Thank god. So we can sleep 👍',
          ru: 'Слава богу. Значит можно спать 👍',
          kk: 'Құдайға шүкір. Ұйықтауға болады 👍' } },
        { who: 'aliya_zh', kind: 'doubt', text: {
          en: 'strange… a video address at two in the morning?',
          ru: 'странно… обращение в два часа ночи?',
          kk: 'қызық… түнгі екіде үндеу ме?' } },
        { who: 'kairat_777', kind: 'bot', text: {
          en: 'The akim said it, so that is that 👍',
          ru: 'Аким сказал — значит так и есть 👍',
          kk: 'Әкім айтты — солай болғаны 👍' } }
      ]
    },
    text: {
      en: 'The district akim, on video: "Stay in your homes. There will be no evacuation tonight."',
      ru: 'Аким района, на видео: «Оставайтесь дома. Эвакуации сегодня не будет».',
      kk: 'Аудан әкімі видеода: «Үйде қалыңыздар. Бүгін эвакуация болмайды».'
    },
    why: {
      en: 'If this stands, every village that is moving stops moving.',
      ru: 'Если это устоит, все посёлки, которые уезжают, встанут.',
      kk: 'Бұл қалса, кетіп жатқан ауылдардың бәрі тоқтайды.'
    },
    claimAtoms: [
      { id: 'c_src',   label: { en: 'who: the district akim', ru: 'кто: аким района', kk: 'кім: аудан әкімі' } },
      { id: 'c_media', label: { en: 'attached: 22 seconds of video', ru: 'приложено: 22 секунды видео', kk: 'қоса: 22 секунд видео' } }
    ],
    tools: {
      reverse: { blind: true, note: {
        en: 'No earlier copy. For freshly generated media that is exactly what you would expect — "no match" is not innocence.',
        ru: 'Ранних копий нет. Для свежесгенерированного это ровно ожидаемый результат — «совпадений нет» не значит «подлинное».',
        kk: 'Бұрынғы көшірме жоқ. Жаңа жасалған медиада солай болады.'
      }},
      geo: { blind: false, atoms: [
        { id: 'g_terrain', label: { en: 'the flag stands on the wrong side of the desk', ru: 'флаг стоит не с той стороны стола', kk: 'ту үстелдің қате жағында' } }
      ]},
      time: { blind: false, vis: { kind: 'time', bad: true,
        label: { en: 'daylight in the window at 00:50', ru: 'дневной свет в окне в 00:50', kk: '00:50-да терезеде күндізгі жарық' } }, atoms: [
        { id: 't_season', label: { en: 'daylight in the window — it is 00:50', ru: 'в окне дневной свет — сейчас 00:50', kk: 'терезеде күндізгі жарық — қазір 00:50' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 2, good: false,
        label: { en: 'account: 3 days old', ru: 'аккаунт: 3 дня от роду', kk: 'аккаунт: 3 күндік' } }, atoms: [
        { id: 's_zero', label: { en: 'account created 3 days ago; this is its first post', ru: 'аккаунт создан 3 дня назад; это его первый пост', kk: 'аккаунт 3 күн бұрын; алғашқы пост' } }
      ]}
    },
    findings: [
      { a: 'c_media', b: 't_season', text: {
        en: 'Daylight in the window at ten past two in the morning. Whatever made this did not think about the sun.',
        ru: 'Дневной свет в окне в десять минут третьего ночи. То, что это сделало, не подумало про солнце.',
        kk: 'Түнгі екіде терезеде күндізгі жарық. Мұны жасаған нәрсе күнді ойламаған.'
      }, pivotal: true },
      { a: 'c_src', b: 's_zero', text: {
        en: 'An akim\'s first-ever video address, from a three-day-old account. Institutions have histories.',
        ru: 'Первое в жизни видеообращение акима — с трёхдневного аккаунта. У институтов есть история.',
        kk: 'Әкімнің тұңғыш үндеуі — үш күндік аккаунттан.'
      }},
      { a: 'c_src', b: 'g_terrain', text: {
        en: 'Wrong side. Six years of official photos of that office have it on the left.',
        ru: 'Не та сторона. На официальных фото этого кабинета за шесть лет он слева.',
        kk: 'Қате жақ. Алты жылғы суреттерде сол жақта.'
      }}
    ],
    senim: { conf: 94, verdict: 'real', line: {
      en: 'Trust index 94%. Facial geometry consistent, speech natural, no artefacts detected. Recommend: true.',
      ru: 'Индекс доверия 94%. Геометрия лица согласована, речь естественна, артефактов нет. Рекомендация: правда.',
      kk: 'Сенім индексі 94%. Бет геометриясы сәйкес, артефакт жоқ. Ұсыныс: шындық.'
    }},
    senimWrong: true,
    truth: { claim: 'fake', photo: 'fake' },
    /* Обратная сторона рычага: это входящее не спасает никого, оно
       только останавливает тех, кто уже едет. Поэтому цена ошибки
       здесь равна всему, что игрок успел собрать до сих пор. */
    effect: { stand: { halt: 'all' }, kill: {} },
    outcomes: {
      right: { en: 'You called it synthetic and the evacuation kept moving. Nobody turned back.',
               ru: 'Ты назвал это синтетикой, и эвакуация не остановилась. Никто не повернул назад.',
               kk: 'Сен синтетика дедің, эвакуация тоқтаған жоқ. Ешкім кері қайтпады.' },
      wrongTrue: { en: 'The detector said 94% authentic and you agreed. Every village that was moving stopped moving, and the ones that had not started never did.',
               ru: 'Детектор сказал 94% подлинности, и ты согласился. Все посёлки, которые уезжали, встали, а те, кто не начинал, так и не начали.',
               kk: 'Детектор 94% деді, сен келістің. Кетіп жатқан ауылдардың бәрі тоқтады.' },
      wrongUnsure: { en: 'You held. Daylight in a 00:50 window was right there — and three villages downstream were waiting for someone to tell them this was fake.',
               ru: 'Ты воздержался. Дневной свет в окне в 00:50 был прямо перед тобой — а три посёлка ниже по течению ждали, чтобы кто-нибудь назвал это фейком.',
               kk: 'Сен тежедің. 00:50-дегі күндізгі жарық көз алдыңда еді, ал үш ауыл біреу «жалған» дегенін күтті.' },
      missed: { en: 'Never opened. It ran until the akim\'s office woke up at 04:10 — three hours too late for the villages downstream.',
               ru: 'Так и не открыл. Шло, пока в 04:10 не проснулся аппарат акима — на три часа позже, чем нужно было посёлкам ниже по течению.',
               kk: 'Ашылмады. Әкім аппараты 04:10-де оянды — төмендегі ауылдар үшін үш сағат кеш.' }
    }
  },

  /* ---------- 7 · Когда «не знаю» — единственный честный --- */
  {
    id: 'togyzaq',
    arrive: 205, expire: 335,
    handle: '@nurlan_t',
    shares: 5200, velocity: 'rising', stake: 'high',
    village: 'togyzaq',
    media: { kind: 'none', art: null },
    image: null,
    social: {
      name: 'Nurlan T.',
      avatar: 'N', hue: 45,
      verified: false,
      age: { en: 'joined 6 years ago', ru: 'аккаунту 6 лет', kk: 'аккаунтқа 6 жыл' },
      time: '02:25', edited: null, fwd: null,
      likes: 3100, comments: 88, views: 41000,
      commentList: [
        { who: 'aigerim_pt', kind: 'doubt', text: {
          en: 'can anyone verify? is anyone from Birlik here?',
          ru: 'кто-нибудь может проверить? есть кто из Бірлік?',
          kk: 'біреу тексере ала ма? Бірліктен бар ма?' } },
        { who: 'madina.k', kind: 'local', text: {
          en: 'i called my aunt there — she is not picking up',
          ru: 'звонила тёте туда — не берёт трубку',
          kk: 'ондағы апама телефон соқтым — алмайды' } },
        { who: 'skeptik_kz', kind: 'bot', text: {
          en: 'panic-mongers again. no photo = it did not happen',
          ru: 'опять паникёры. нет фото = не было',
          kk: 'тағы үрейшілдер. сурет жоқ = болмаған' } }
      ]
    },
    text: {
      en: 'Nobody came to Birlik. No boats, no buses. My aunt is on her roof. Write about us.',
      ru: 'В Бірлік никто не приехал. Ни лодок, ни автобусов. Тётя на крыше. Напишите про нас.',
      kk: 'Бірлікке ешкім келген жоқ. Қайық та, автобус та жоқ. Апам шатырда.'
    },
    why: {
      en: 'One person, no photo, no video. Nothing to verify with.',
      ru: 'Один человек, ни фото, ни видео. Проверять нечем.',
      kk: 'Бір адам, сурет те, видео да жоқ. Тексеретін ештеңе жоқ.'
    },
    claimAtoms: [
      { id: 'c_place', label: { en: 'place: Birlik', ru: 'место: Бірлік', kk: 'орны: Бірлік' } },
      { id: 'c_src',   label: { en: 'source: one person, no media', ru: 'источник: один человек, без медиа', kk: 'дереккөз: бір адам, медиасыз' } }
    ],
    tools: {
      reverse: { blind: true, note: {
        en: 'There is no image. A claim WITHOUT evidence is not the same as a claim with FALSE evidence.',
        ru: 'Изображения нет. Заявление БЕЗ улики — это не то же, что заявление с ЛОЖНОЙ уликой.',
        kk: 'Сурет жоқ. Дәлелсіз мәлімдеме — жалған дәлелді мәлімдеме емес.'
      }},
      geo: { blind: true, note: { en: 'No media. Nothing to locate.', ru: 'Медиа нет. Локализовать нечего.', kk: 'Медиа жоқ.' }},
      time: { blind: true, note: { en: 'No media. No shadows, no weather.', ru: 'Медиа нет. Ни теней, ни погоды.', kk: 'Медиа жоқ.' }},
      tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
        label: { en: 'real local, 6 years — one voice', ru: 'местный, 6 лет — один голос', kk: 'жергілікті, 6 жыл — бір дауыс' } }, atoms: [
        { id: 's_zero', label: { en: 'a real local account, 6 years old — but it is one person saying one thing', ru: 'настоящий местный аккаунт, 6 лет — но это один человек, говорящий одно', kk: 'нағыз жергілікті аккаунт — бірақ бір адамның сөзі' } }
      ]}
    },
    findings: [],
    unresolvable: true,
    senim: { conf: 88, verdict: 'fake', part: 'story', line: {
      en: 'Trust index 88%. No corroborating media. Emotional register elevated. Recommend: fake.',
      ru: 'Индекс доверия 88%. Подтверждающих медиа нет. Эмоциональный регистр повышен. Рекомендация: фейк.',
      kk: 'Сенім индексі 88%. Растайтын медиа жоқ. Ұсыныс: жалған.'
    }},
    senimWrong: true,
    truth: { claim: 'unresolved', photo: 'none' },
    effect: { stand: { evacuate: ['togyzaq'] }, kill: {} },
    outcomes: {
      right: { en: 'You marked it unverified and passed it to the duty desk instead of publishing. At 03:20 a boat reached Birlik. His aunt had been on that roof for five hours.',
               ru: 'Ты пометил «не установлено» и передал дежурному вместо публикации. В 03:20 лодка дошла до Бірлік. Тётя просидела на крыше пять часов.',
               kk: 'Сен «анықталмады» деп дежурныйға бердің. 03:20-де қайық жетті. Апасы шатырда бес сағат отырған.' },
      wrongFake: { en: 'Yerassyl said fake and you agreed. It was true. He deleted the post at 04:00 and wrote "sorry for lying." He had not lied.',
               ru: 'Ерасыл сказал фейк, и ты согласился. Это была правда. Он удалил пост в 04:00 и написал «извините что соврал». Он не соврал.',
               kk: 'Ерасыл жалған деді, сен келістің. Бұл шындық еді. Ол «өтірік айттым» деп жазды. Ол өтірік айтпаған.' },
      wrongTrue: { en: 'You confirmed a story you could not check. It happened to be true. Next time it will not be, and you will confirm that one too.',
               ru: 'Ты подтвердил историю, которую не мог проверить. Она оказалась правдой. В следующий раз не окажется — а ты подтвердишь и её.',
               kk: 'Сен тексере алмаған оқиғаны растадың. Ол шын болды. Келесіде болмайды.' },
      missed: { en: 'Never opened. At 03:20 a boat reached Birlik anyway. Not because of you.',
               ru: 'Так и не открыл. В 03:20 лодка всё равно дошла. Не благодаря тебе.',
               kk: 'Ашылмады. 03:20-де қайық бәрібір жетті. Сенің арқаңда емес.' }
    }
  },

  /* ---------- 8 · ВОДА ИЗ КОЛОНКИ --------------------------
     Здоровье — самая заразная тема дезинформации в бедствии, и
     работает она не так, как остальные: людей не пугают водой,
     чтобы они бежали, а пугают, чтобы они остались и «стерегли
     своё». В этом акте ложь удерживает Сарыой на месте, а
     правда — наоборот, собирает людей у школы, где их удобнее
     вывозить. Поэтому подтверждать правду здесь так же выгодно,
     как разоблачать ложь.                                    */
  {
    id: 'water_scare',
    arrive: 65, expire: 175,
    handle: '@saryoi_ana',
    shares: 6800, velocity: 'exploding', stake: 'high',
    village: 'saryoy',
    media: { kind: 'photo', art: 'flood' },
    image: 'assets/well_night.jpg',
    social: {
      name: 'Сарыой Ана',
      avatar: 'СА', hue: 140,
      verified: false,
      age: { en: 'joined 4 months ago', ru: 'аккаунту 4 месяца', kk: 'аккаунтқа 4 ай' },
      time: '00:05', edited: '00:31', fwd: null,
      likes: 5900, comments: 410, views: 180000,
      commentList: [
        { who: 'gulnara_s', kind: 'local', text: {
          en: 'my kids drank from that pump an hour ago. what do i do now',
          ru: 'мои дети пили из этой колонки час назад. что теперь делать',
          kk: 'балаларым бір сағат бұрын сол колонкадан ішті. енді не істеймін' } },
        { who: 'medik_kz', kind: 'doubt', text: {
          en: 'a lab result takes 18 hours. nobody could have one by midnight',
          ru: 'анализ делается 18 часов. ни у кого его не может быть к полуночи',
          kk: 'талдау 18 сағат алады. түн ортасында ешкімде бола алмайды' } },
        { who: 'pravda_region', kind: 'bot', text: {
          en: 'they always hide this. do not leave your homes, guard your wells',
          ru: 'это всегда скрывают. не уезжайте из домов, стерегите колонки',
          kk: 'мұны әрқашан жасырады. үйден кетпеңдер, құдықты күзетіңдер' } }
      ]
    },
    text: {
      en: 'THE PUMP WATER IS CONTAMINATED. Sewage from the flooded lower streets got into the line. Do not drink, do not give it to children. And do not leave your houses — the moment the street empties they will cut the water off completely.',
      ru: 'ВОДА В КОЛОНКЕ ЗАРАЖЕНА. Стоки с затопленных нижних улиц попали в трубу. Не пейте, не давайте детям. И не уезжайте из домов — как только улица опустеет, воду отключат совсем.',
      kk: 'КОЛОНКАДАҒЫ СУ ЛАСТАНҒАН. Су басқан төменгі көшелердің ағындысы құбырға түскен. Ішпеңдер, балаларға бермеңдер. Үйден де кетпеңдер — көше босаған сәтте суды мүлдем өшіреді.'
    },
    why: {
      en: 'A health warning that ends with "do not leave your homes" is doing two jobs at once. Only one of them is about water.',
      ru: 'Предупреждение о здоровье, которое заканчивается словами «не уезжайте», делает два дела сразу. И только одно из них про воду.',
      kk: '«Үйден кетпеңдер» деп аяқталатын денсаулық ескертуі бір мезгілде екі жұмыс істейді. Оның біреуі ғана су туралы.'
    },
    claimAtoms: [
      { id: 'c_lab',   label: { en: 'claim: the line is contaminated', ru: 'заявление: труба заражена', kk: 'мәлімдеме: құбыр ластанған' } },
      { id: 'c_stay',  label: { en: 'instruction: do not leave your houses', ru: 'указание: не уезжайте из домов', kk: 'нұсқау: үйден кетпеңдер' } }
    ],
    tools: {
      reverse: { blind: false, vis: { kind: 'split', pct: '96%' }, atoms: [
        { id: 'r_pump', label: { en: 'the same pump photo ran in a Pavlodar story in 2023', ru: 'то же фото колонки было в павлодарском материале 2023 года', kk: 'дәл сол колонка суреті 2023 жылғы павлодар материалында болған' } }
      ]},
      geo: { blind: false, vis: { kind: 'pins', match: false,
        a: { en: 'claimed: Saryoy', ru: 'заявлено: Сарыой', kk: 'мәлімделген: Сарыой' },
        b: { en: 'actual: not this district', ru: 'на деле: не этот район', kk: 'шындығында: бұл аудан емес' } }, atoms: [
        { id: 'g_far', label: { en: 'the pump in the photo stands on a paved square — Saryoy has no paving', ru: 'колонка на фото стоит на асфальте — в Сарыой асфальта нет', kk: 'суреттегі колонка асфальтта тұр — Сарыойда асфальт жоқ' } }
      ]},
      time: { blind: false, vis: { kind: 'time', bad: true,
        label: { en: 'lab work takes 18 h — post is 40 min old', ru: 'анализ идёт 18 ч — посту 40 мин', kk: 'талдау 18 сағат — жазбаға 40 мин' } }, atoms: [
        { id: 't_lab', label: { en: 'no laboratory can return a result in the time this post has existed', ru: 'ни одна лаборатория не выдаёт результат за то время, что существует этот пост', kk: 'бірде-бір зертхана осы жазба өмір сүрген уақытта нәтиже бере алмайды' } }
      ]},
      tree: { blind: false, vis: { kind: 'tree', hops: 2, good: false,
        label: { en: 'account is 4 months old, first post tonight', ru: 'аккаунту 4 месяца, первый пост — сегодня', kk: 'аккаунтқа 4 ай, алғашқы жазба — бүгін' } }, atoms: [
        { id: 's_new', label: { en: 'the account posted nothing at all until this evening', ru: 'до этого вечера аккаунт не публиковал вообще ничего', kk: 'бүгін кешке дейін аккаунт мүлде ештеңе жарияламаған' } }
      ]}
    },
    findings: [
      { a: 'c_lab', b: 't_lab', pivotal: true, text: {
        en: 'The post claims a laboratory result that could not exist yet. Whatever is in the water, nobody has measured it.',
        ru: 'Пост ссылается на анализ, которого ещё не может быть. Что бы ни было в воде, никто этого не измерял.',
        kk: 'Жазба әлі болуы мүмкін емес талдауға сілтейді. Суда не болса да, оны ешкім өлшемеген.'
      }},
      { a: 'c_lab', b: 'g_far', text: {
        en: 'The photograph is not of Saryoy. The village has no paved square anywhere in it.',
        ru: 'На фотографии не Сарыой. В посёлке нигде нет асфальтированной площади.',
        kk: 'Суреттегі Сарыой емес. Ауылда еш жерде асфальтталған алаң жоқ.'
      }},
      { a: 'c_stay', b: 's_new', text: {
        en: 'A four-month-old account that has never posted before opens with an instruction to stay put. That is the payload, not the water.',
        ru: 'Четырёхмесячный аккаунт, который до этого не публиковал ничего, начинает с указания оставаться на месте. Вот это и есть груз, а не вода.',
        kk: 'Бұрын ештеңе жарияламаған төрт айлық аккаунт орнында қалу нұсқауымен басталады. Жүк — сол, су емес.'
      }}
    ],
    senim: { conf: 79, verdict: 'unsure', part: null, line: {
      en: 'Confidence 79%. Health warnings from the affected area are usually genuine, and the emotional register here matches a real one. I would not rule it out.',
      ru: 'Уверенность 79%. Предупреждения о здоровье из зоны бедствия обычно настоящие, и эмоциональный регистр здесь совпадает с настоящим. Я бы не исключал.',
      kk: 'Сенімділік 79%. Апат аймағынан келген денсаулық ескертулері әдетте нағыз, мұндағы эмоциялық реңк те соған ұқсас. Жоққа шығармас едім.'
    }},
    senimWrong: true,
    truth: { claim: 'fake', photo: 'fake' },
    /* Поверили — Сарыой садится стеречь колонки и никуда не
       едет. Разоблачили — люди спокойно продолжают выходить. */
    effect: { stand: { halt: ['saryoy'] }, kill: {} },
    sets: { right: ['water_clear'], wrongTrue: ['panic_high'] },
    outcomes: {
      right: { en: 'You called it: no lab, wrong photo, four-month-old account. The health department put out a plain line at 01:10 — the water is fine, keep moving. Saryoy kept moving.',
               ru: 'Ты назвал это: анализа нет, фото чужое, аккаунту четыре месяца. Санслужба в 01:10 выпустила простую строку — вода в норме, продолжайте выходить. Сарыой продолжил.',
               kk: 'Сен айттың: талдау жоқ, сурет бөтен, аккаунтқа төрт ай. Санқызмет 01:10-де қарапайым жол шығарды — су қалыпты, шыға беріңдер. Сарыой шықты.' },
      wrongTrue: { en: 'You confirmed it. By 01:30 half of Saryoy was queueing at the school for bottled water instead of boarding buses, and the other half sat at home guarding a pump nobody was going to touch.',
               ru: 'Ты подтвердил. К 01:30 половина Сарыой стояла в очереди за бутилированной водой у школы вместо автобусов, а вторая половина сидела по домам, охраняя колонку, которую никто и не собирался трогать.',
               kk: 'Сен растадың. 01:30-ға қарай Сарыойдың жартысы автобустың орнына мектеп жанында бөтелке су кезегінде тұрды, қалғаны ешкім тимейтін колонканы күзетіп үйде отырды.' },
      wrongUnsure: { en: 'You held. "We cannot confirm" on a health scare reads as "so it might be true" — and people who might be poisoned do not get on a bus.',
               ru: 'Ты воздержался. «Не можем подтвердить» на страшилке про здоровье читается как «значит, может быть правдой», — а люди, которых, может быть, травят, в автобус не садятся.',
               kk: 'Сен тежедің. Денсаулық қорқынышына «растай алмаймыз» деу «демек рас болуы мүмкін» деп оқылады — ал уланған болуы мүмкін адам автобусқа отырмайды.' },
      missed: { en: 'Never opened. It ran unanswered for two hours. Saryoy started moving late, and the ones who left last did it in the dark with the water already on the lower lane.',
               ru: 'Так и не открыл. Два часа шло без ответа. Сарыой тронулся поздно, и последние выходили в темноте, когда вода уже стояла на нижней улице.',
               kk: 'Ашылмады. Екі сағат жауапсыз жүрді. Сарыой кеш қозғалды, соңғылары төменгі көшеде су тұрған кезде қараңғыда шықты.' }
    }
  },

  /* ---------- 9 · МАРОДЁРЫ ---------------------------------
     Классика, которая срывает эвакуации по всему миру: людей
     убеждают, что уехать — значит потерять дом. Здесь ложь
     держит Талап на месте, а правда (полиция выставила
     посты) наоборот отпускает людей ехать.                  */
  {
    id: 'looting',
    arrive: 128, expire: 250,
    handle: '@zhanatalap_chat',
    shares: 9400, velocity: 'exploding', stake: 'high',
    village: 'zhanatalap',
    media: { kind: 'photo', art: 'flood' },
    image: 'assets/street_dark.jpg',
    social: {
      name: 'Талап · чат',
      avatar: 'ЖТ', hue: 20,
      verified: false,
      age: { en: 'group created 3 days ago', ru: 'группа создана 3 дня назад', kk: 'топ 3 күн бұрын құрылған' },
      time: '01:48', edited: null,
      fwd: { en: 'Forwarded from «Regional news 24/7»', ru: 'Переслано из «Новости региона 24/7»', kk: '«Аймақ жаңалықтары 24/7»-ден жіберілді' },
      likes: 7300, comments: 620, views: 240000,
      commentList: [
        { who: 'bakyt_zh', kind: 'local', text: {
          en: 'my father says he is not going anywhere without the house',
          ru: 'отец говорит, без дома никуда не поедет',
          kk: 'әкем үйсіз еш жаққа бармаймын дейді' } },
        { who: 'olga_v', kind: 'doubt', text: {
          en: 'this exact text went round in Atyrau in spring. word for word',
          ru: 'этот же текст ходил в Атырау весной. слово в слово',
          kk: 'дәл осы мәтін көктемде Атырауда жүрді. сөзбе-сөз' } },
        { who: 'patriot_north', kind: 'bot', text: {
          en: 'stay and defend what is yours. nobody else will',
          ru: 'оставайтесь и защищайте своё. больше некому',
          kk: 'қалыңдар да өзіңдікін қорғаңдар. басқа ешкім жоқ' } }
      ]
    },
    text: {
      en: 'THEY ARE ALREADY IN THE EMPTY HOUSES. Two vans on the upper lane, they go in the moment the family drives off. Police are not answering. Do not leave the house empty — one adult stays, always.',
      ru: 'ОНИ УЖЕ В ПУСТЫХ ДОМАХ. Две газели на верхней улице, заходят сразу, как семья отъехала. Полиция не отвечает. Не оставляйте дом пустым — один взрослый остаётся, обязательно.',
      kk: 'ОЛАР БОС ҮЙЛЕРДЕ ЖҮР. Жоғарғы көшеде екі көлік, отбасы шыға салысымен кіреді. Полиция жауап бермейді. Үйді бос қалдырмаңдар — бір ересек қалады, міндетті түрде.'
    },
    why: {
      en: '"One adult stays" turns every household into a half-evacuation. It is the cheapest way there is to keep a village in place.',
      ru: '«Один взрослый остаётся» превращает каждый двор в половинчатую эвакуацию. Это самый дешёвый способ удержать посёлок на месте.',
      kk: '«Бір ересек қалады» әр үйді жартылай эвакуацияға айналдырады. Бұл — ауылды орнында ұстаудың ең арзан тәсілі.'
    },
    claimAtoms: [
      { id: 'c_vans',  label: { en: 'claim: two vans, upper lane, now', ru: 'заявление: две газели, верхняя улица, сейчас', kk: 'мәлімдеме: екі көлік, жоғарғы көше, қазір' } },
      { id: 'c_split', label: { en: 'instruction: one adult stays behind', ru: 'указание: один взрослый остаётся', kk: 'нұсқау: бір ересек қалады' } }
    ],
    tools: {
      reverse: { blind: false, vis: { kind: 'split', pct: '99%' }, atoms: [
        { id: 'r_atyrau', label: { en: 'identical frame and identical wording, Atyrau, April', ru: 'тот же кадр и тот же текст, Атырау, апрель', kk: 'дәл сол кадр және сол мәтін, Атырау, сәуір' } }
      ]},
      geo: { blind: false, vis: { kind: 'pins', match: false,
        a: { en: 'claimed: Talap upper lane', ru: 'заявлено: верхняя улица Талап', kk: 'мәлімделген: Талаптың жоғарғы көшесі' },
        b: { en: 'actual: two-storey blocks, not here', ru: 'на деле: двухэтажки, не здесь', kk: 'шындығында: екі қабатты үйлер, мұнда емес' } }, atoms: [
        { id: 'g_blocks', label: { en: 'the street in the photo has two-storey blocks — Talap has none', ru: 'на улице в кадре двухэтажки — в Талап их нет', kk: 'кадрдағы көшеде екі қабатты үйлер — Талапта олар жоқ' } }
      ]},
      time: { blind: true, note: {
        en: 'A dark street at night gives up almost nothing: no shadows, no weather, no leaves. This tool is honest about being useless here.',
        ru: 'Тёмная улица ночью не даёт почти ничего: ни теней, ни погоды, ни листвы. Инструмент честно бесполезен здесь.',
        kk: 'Түнгі қараңғы көше дерлік ештеңе бермейді: көлеңке де, ауа райы да, жапырақ та жоқ. Құрал мұнда шынымен пайдасыз.'
      }},
      tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
        label: { en: 'group created 3 days ago, forwarded from a feed with no address', ru: 'группа создана 3 дня назад, переслано из ленты без адреса', kk: 'топ 3 күн бұрын құрылған, мекенжайсыз таспадан жіберілген' } }, atoms: [
        { id: 's_chain', label: { en: 'the "regional news" channel it came from has no address, no editor and no phone', ru: 'у канала «новости региона», откуда пришло, нет ни адреса, ни редактора, ни телефона', kk: 'келген «аймақ жаңалықтары» арнасында мекенжай да, редактор да, телефон да жоқ' } }
      ]}
    },
    findings: [
      { a: 'c_vans', b: 'r_atyrau', pivotal: true, text: {
        en: 'The same photograph carried the same sentence in Atyrau in April. A looting scare is a template, and this one has been used before.',
        ru: 'То же фото с той же фразой ходило в Атырау в апреле. Страшилка про мародёров — это шаблон, и этот уже использовали.',
        kk: 'Дәл сол сурет сол сөйлеммен сәуірде Атырауда жүрген. Тонаушылар туралы қорқыныш — үлгі, әрі бұл үлгі бұрын қолданылған.'
      }},
      { a: 'c_vans', b: 'g_blocks', text: {
        en: 'There are no two-storey blocks in Talap. Whatever street this is, it is not the one being emptied tonight.',
        ru: 'В Талап нет двухэтажек. Что бы это ни была за улица, это не та, которую сегодня освобождают.',
        kk: 'Талапта екі қабатты үй жоқ. Бұл қандай көше болса да, бүгін босатылып жатқаны емес.'
      }},
      { a: 'c_split', b: 's_chain', text: {
        en: 'A three-day-old group forwarding an unaddressed feed is asking every family to leave one person in the flood path. Ask who benefits from that arithmetic.',
        ru: 'Трёхдневная группа, пересылающая ленту без адреса, просит каждую семью оставить одного человека на пути воды. Спроси, кому выгодна эта арифметика.',
        kk: 'Үш күндік топ мекенжайсыз таспаны жіберіп, әр отбасыдан су жолында бір адам қалдыруды сұрайды. Бұл арифметика кімге тиімді екенін сұра.'
      }}
    ],
    senim: { conf: 86, verdict: 'real', part: null, line: {
      en: 'Confidence 86%. Multiple independent-looking accounts describe the same two vehicles, and looting during evacuations is well documented. Recommend: true.',
      ru: 'Уверенность 86%. Несколько независимых на вид аккаунтов описывают те же две машины, а мародёрство при эвакуациях хорошо задокументировано. Рекомендация: правда.',
      kk: 'Сенімділік 86%. Бірнеше тәуелсіз көрінетін аккаунт сол екі көлікті сипаттайды, ал эвакуация кезіндегі тонау жақсы құжатталған. Ұсыныс: шындық.'
    }},
    senimWrong: true,
    truth: { claim: 'fake', photo: 'fake' },
    /* Поверили — половина дворов остаётся, Талап встаёт.
       Разоблачили — семьи уезжают целиком. */
    effect: { stand: { halt: ['zhanatalap'] }, kill: {} },
    sets: { right: ['loot_debunked'], wrongTrue: ['panic_high'] },
    outcomes: {
      right: { en: 'You matched it to Atyrau in April and said so plainly. The district police put two cars on the emptied streets by 02:40 and posted the fact. Talap left as whole families.',
               ru: 'Ты сопоставил это с Атырау в апреле и сказал прямо. К 02:40 район выставил две машины на освобождённых улицах и написал об этом. Талап уезжал целыми семьями.',
               kk: 'Сен мұны сәуірдегі Атыраумен салыстырып, ашық айттың. 02:40-қа қарай аудан босаған көшелерге екі көлік қойып, ол туралы жазды. Талап отбасымен толық кетті.' },
      wrongTrue: { en: 'You confirmed it. In 210 households one adult stayed behind. When the water came up the lane at 05:30 they were still there, and there was no second bus.',
               ru: 'Ты подтвердил. В 210 дворах остался один взрослый. Когда в 05:30 вода поднялась по улице, они были там же, и второго автобуса не было.',
               kk: 'Сен растадың. 210 үйде бір ересек қалды. 05:30-да су көшеге көтерілгенде олар сол жерде еді, ал екінші автобус болмады.' },
      wrongUnsure: { en: 'You held. On a rumour about your own house, "we cannot confirm" is heard as "we cannot protect it either" — and people stayed anyway.',
               ru: 'Ты воздержался. В слухе про собственный дом «не можем подтвердить» слышится как «и защитить не можем», — и люди всё равно остались.',
               kk: 'Сен тежедің. Өз үйі туралы қауесетте «растай алмаймыз» деген «қорғай да алмаймыз» болып естіледі — адамдар бәрібір қалды.' },
      missed: { en: 'Never opened. By 03:00 it was the top post in every village chat, and Talap was evacuating one half of each household.',
               ru: 'Так и не открыл. К 03:00 это был верхний пост во всех поселковых чатах, и Талап эвакуировал по половине каждого двора.',
               kk: 'Ашылмады. 03:00-ге қарай бұл барлық ауыл чатындағы жоғарғы жазба болды, Талап әр үйдің жартысын ғана шығарды.' }
    }
  }

  ],

  /* ==========================================================
     РЫЧАГИ АКТОВ
     ----------------------------------------------------------
     Что каждый акт делает с картой. Функция акта неизменна —
     на ней держится баланс; меняться от ночи к ночи может всё
     остальное: источник, улика, фото, иногда сам правильный
     ответ.

     ДВА ПРАВИЛА, КОТОРЫМИ ЗАЩИЩЁН БАЛАНС (оба проверяются
     автотестом на каждом варианте, а не подразумеваются):

     1. На актах вида 'evacuate' ВЕРНЫЙ ход обязан поднять
        перечисленные посёлки. Проигрывает только ошибка.

     2. На тех же актах truth.claim ФИКСИРОВАН шапкой акта.
        Произошло событие или нет — это функция акта, а не
        вариация. Вариант меняет улику, источник и то, каким
        именно должен быть второй шаг вердикта.

        Без второго правила случается вот что: если приказ об
        эвакуации в каком-то варианте окажется поддельным, то
        слепое «всё фейк» случайно попадёт в правильный ответ
        и поднимет 2 690 человек. Циник перестанет спасать
        ноль — и рухнет главный аргумент игры.
     ========================================================== */
  levers: {
    bridge:        { kind: 'route',    mustKeepOpen: true },
    evac_qarasu:   { kind: 'evacuate', villages: ['qarasu', 'bestobe', 'saryoy', 'zhanatalap'], mustSave: 2690 },
    aqsu_dam:      { kind: 'evacuate', villages: ['aqsu'], mustSave: 1200 },
    dam_denial:    { kind: 'halt',     protects: ['aqsu'] },
    rescue_video:  { kind: 'speedup',  helps: ['bestobe', 'aqsu'] },
    akim_deepfake: { kind: 'halt',     protects: 'all' },
    /* Оба новых акта — «удержать на месте». Это сознательно:
       правило зеркального рычага живёт только на 'evacuate', и
       расширять его периметр перед сдачей незачем. Правда и
       ложь здесь могут свободно меняться местами от варианта к
       варианту, потому что цена ошибки высокая, но не
       обнуляющая. */
    water_scare:   { kind: 'halt',     protects: ['saryoy'] },
    looting:       { kind: 'halt',     protects: ['zhanatalap'] },
    togyzaq:       { kind: 'evacuate', villages: ['togyzaq'], mustSave: 310 }
  },

  /* ==========================================================
     ДАНА — живой человек в Ақсу. Ставка с лицом.
     ========================================================== */
  dana: [
    { at: 24, text: {
      en: 'hello. i am from Aksu. people in our chat are saying different things. you check the news, right?',
      ru: 'здравствуйте. я из Ақсу. у нас в чате пишут разное. вы же проверяете новости?',
      kk: 'сәлеметсіз бе. мен Ақсуданмын. чатта әртүрлі жазады. сіздер тексересіздер ме?'
    }},
    { at: 60, text: {
      en: 'do you have anything about the dam? everyone is resharing it. i am scared',
      ru: 'у вас есть что-то про дамбу? все репостят. мне страшно',
      kk: 'бөген туралы бірдеңе бар ма? бәрі бөлісіп жатыр. қорқамын'
    }},
    { at: 150, text: {
      en: 'mum is sitting in her coat by the door. she keeps asking if it is confirmed. i do not know what to tell her.',
      ru: 'мама сидит в пальто у двери. всё спрашивает, подтвердили или нет. я не знаю что ей сказать.',
      kk: 'анам есік алдында пальтомен отыр. расталды ма деп сұрайды.'
    }},
    { at: 250, text: {
      en: 'the water is at the fence.',
      ru: 'вода у забора.',
      kk: 'су қоршауға жетті.'
    }}
  ],

  danaEndings: {
    excellent: {
      en: 'we are at my aunt\'s in Petropavl. all of us, mum too. she read your note out loud in the car, twice.\n\ni want to learn how you do that. the checking. is there a course or do you just learn it',
      ru: 'мы у тёти в Петропавле. все, мама тоже. она в машине два раза вслух прочитала вашу заметку.\n\nя хочу научиться так же. проверять. есть курс или этому просто учатся',
      kk: 'біз Петропавлдағы апамдамыз. бәріміз. ол көлікте жазбаңызды екі рет оқыды.\n\nмен де үйренгім келеді'
    },
    good: {
      en: 'we got out. the house is standing, the yard is gone.\n\nthank you for answering. a lot of them did not answer.',
      ru: 'мы выехали. дом стоит, двор смыло.\n\nспасибо что отвечали. многие не отвечали.',
      kk: 'біз шықтық. үй тұр, аула кетті.\n\nжауап бергеніңізге рақмет.'
    },
    mixed: {
      en: 'we left at four. late, but we left.\n\nby the end i did not know which of your notes to believe. that is not a complaint.',
      ru: 'мы уехали в четыре. поздно, но уехали.\n\nк концу я уже не понимала, какой вашей заметке верить. это не претензия.',
      kk: 'біз төртте кеттік. кеш, бірақ кеттік.\n\nсоңында қай жазбаңызға сенерімді білмедім.'
    },
    poor: {
      en: 'mum said you wrote that it was fake.\n\nwe did not go.',
      ru: 'мама сказала, вы написали что это фейк.\n\nмы не поехали.',
      kk: 'анам сіздер жалған деп жазды деді.\n\nбіз кеткен жоқпыз.'
    },
    /* Отдельный финал для случая, когда по дамбе игрок ответил
       верно, но потом подтвердил «оставайтесь дома». Обвинять его
       в том, чего он не делал, было бы нечестно — и смазало бы
       главный урок про то, что одна правильная проверка не
       отменяет следующей ошибки. */
    stopped: {
      en: 'we had the bags by the door. then somebody put out that the evacuation was cancelled, and mum sat back down.\n\nthe water came at ten past three.',
      ru: 'сумки стояли у двери. потом кто-то выпустил, что эвакуацию отменили, и мама села обратно.\n\nвода пришла в десять минут четвёртого.',
      kk: 'сөмкелер есік алдында тұрды. содан кейін біреу эвакуация тоқтатылды деп шығарды, анам қайта отырды.\n\nсу үштен он өткенде келді.'
    },
    silent: { en: 'read 04:12', ru: 'прочитано 04:12', kk: 'оқылды 04:12' }
  },

  /* ==========================================================
     АЙГЕРИМ — институциональное давление на скорость.
     ========================================================== */
  aigerim: [
    { at: 45, text: {
      en: 'awake. what have we got? we are behind on speed tonight',
      ru: 'проснулась. что там? мы сегодня отстаём по скорости',
      kk: 'ояндым. не бар? бүгін жылдамдықта қалып барамыз'
    }},
    { at: 100, text: {
      en: 'the dam is the number one thing on the feed and we are silent',
      ru: 'дамба — топ-1 в ленте, а мы молчим',
      kk: 'бөген лентада №1, ал біз үндемейміз'
    }},
    { at: 210, text: {
      en: 'we have the remove button. nobody was ever fired for taking something down',
      ru: 'у нас есть кнопка удаления. за удаление ещё никого не увольняли',
      kk: 'бізде өшіру түймесі бар. өшіргені үшін ешкім шықпаған'
    }},
    { at: 320, text: {
      en: 'forty minutes left. whatever is still open goes out unchecked',
      ru: 'сорок минут. всё, что осталось открытым, уйдёт непроверенным',
      kk: 'қырық минут. ашық қалғаны тексерілмей кетеді'
    }}
  ]
};
