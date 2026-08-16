/* ============================================================
   AQIQAT — ВАРИАНТЫ НОЧИ 01
   ------------------------------------------------------------
   Базовый вариант каждого акта живёт в night01.js. Здесь —
   всё остальное, чем этот акт может обернуться в другую ночь.

   Акт сохраняет свою драматическую функцию (и рычаг на карте),
   но меняет источник, улику, фотографию, а иногда и сам
   правильный ответ. Игрок, прошедший ночь однажды, не может
   опереться на память — только на проверку.

   ПРАВИЛО ЗЕРКАЛЬНОГО РЫЧАГА (проверяется автотестом):
   на актах массовой эвакуации любой вариант устроен так, что
   ВЕРНЫЙ ход поднимает людей — через stand, если заявление
   истинно, и через kill, если оно поддельно. Хорошая проверка
   не просто говорит «ложь», она говорит, что правда.

   ПРАВИЛО СЕТТИНГА: область реальная, паводок — реальный тип
   события. Все посёлки, ведомства, компании, аккаунты и люди
   ВЫМЫШЛЕНЫ.
   ============================================================ */

(function () {

  var V = function (actId, list) { AQ.SCENARIO.addVariants(AQ.NIGHT, actId, list); };

  /* ==========================================================
     АКТ 1 · МОСТ — обучение: происхождение изображения
     Функция акта неизменна: если игрок поверит, встанет
     эвакуация всего района. Меняется только то, ЧЕМ именно
     поддельна улика — и это четыре разных урока.
     ========================================================== */

  V('bridge', [

    /* --- настоящий М-36, но снято на ремонте два года назад --- */
    {
      vid: 'old_repair',
      handle: '@sever_avto',
      shares: 3100, velocity: 'rising',
      social: {
        name: 'Северный Авто', avatar: 'СА', hue: 210, verified: false,
        age: { en: 'joined 4 years ago', ru: 'каналу 4 года', kk: 'арнаға 4 жыл' },
        time: '23:02', edited: null, fwd: null,
        likes: 1400, comments: 62, views: 96000,
        commentList: [
          { who: 'dalnoboy_kz', kind: 'local', text: {
            en: 'that is snow on the ground. there is no snow tonight',
            ru: 'там снег лежит. сегодня ночью снега нет',
            kk: 'онда қар жатыр. бүгін түнде қар жоқ' } },
          { who: 'alert_kz_bot', kind: 'bot', text: {
            en: 'CONFIRMED 🚨 ROAD CLOSED 🚨 SHARE',
            ru: 'ПОДТВЕРЖДЕНО 🚨 ДОРОГА ЗАКРЫТА 🚨 РЕПОСТ',
            kk: 'РАСТАЛДЫ 🚨 ЖОЛ ЖАБЫҚ 🚨 БӨЛІС' } }
        ]
      },
      media: { kind: 'photo', art: 'bridge' }, image: null,
      text: {
        en: 'M-36 IS DOWN. The span has gone into the river. Nobody is getting north tonight.',
        ru: 'М-36 РУХНУЛ. Пролёт ушёл в реку. На север сегодня никто не проедет.',
        kk: 'М-36 ҚҰЛАДЫ. Аралық өзенге кетті. Бүгін солтүстікке ешкім өтпейді.'
      },
      why: {
        en: 'M-36 is the only way out of the district.',
        ru: 'М-36 — единственный выезд из района.',
        kk: 'М-36 — ауданнан жалғыз шығу жолы.'
      },
      claimAtoms: [
        { id: 'c_time',  label: { en: 'time: tonight', ru: 'время: сегодня ночью', kk: 'уақыты: бүгін түнде' } },
        { id: 'c_event', label: { en: 'event: the span collapsed', ru: 'событие: пролёт обрушился', kk: 'оқиға: аралық құлады' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '99%' }, atoms: [
          { id: 'r_origin', label: { en: 'same frame published in March 2024', ru: 'тот же кадр опубликован в марте 2024', kk: 'дәл сол кадр 2024 наурызда жарияланған' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: true,
          a: { en: 'M-36 — terrain matches', ru: 'М-36 — местность совпадает', kk: 'М-36 — жер сәйкес' } }, atoms: [
          { id: 'g_terrain', label: { en: 'it really is our bridge', ru: 'это действительно наш мост', kk: 'бұл шынымен біздің көпір' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'deep snow — not tonight', ru: 'глубокий снег — не сегодня', kk: 'қалың қар — бүгін емес' } }, atoms: [
          { id: 't_season', label: { en: 'snowbanks to the railing — it is thaw now', ru: 'сугробы до перил — сейчас оттепель', kk: 'қар үйіндісі — қазір еру кезеңі' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
          label: { en: 'repost of a 2024 post', ru: 'репост поста 2024 года', kk: '2024 жылғы посттың репосты' } }, atoms: [
          { id: 's_zero', label: { en: 'the chain starts at an old repair-works post', ru: 'цепочка начинается со старого поста о ремонте', kk: 'тізбек ескі жөндеу туралы посттан басталады' } }
        ]}
      },
      findings: [
        { a: 'c_time', b: 'r_origin', text: {
          en: 'It is our bridge — photographed two years ago, during the repairs. A real picture of a real place at the wrong time is still a lie.',
          ru: 'Это наш мост — снятый два года назад, на ремонте. Настоящий снимок настоящего места не в своё время — всё равно ложь.',
          kk: 'Бұл біздің көпір — екі жыл бұрын, жөндеу кезінде түсірілген. Дұрыс емес уақыттағы шын сурет те өтірік.'
        }, pivotal: true },
        { a: 'c_time', b: 't_season', text: {
          en: 'Snowbanks up to the railing. Tonight it is thawing and the asphalt is bare.',
          ru: 'Сугробы до перил. Сегодня оттепель и асфальт голый.',
          kk: 'Тұтқаға дейін қар. Бүгін еру, асфальт жалаңаш.'
        }}
      ],
      senim: { conf: 71, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 71%. Older copies of this image exist. Recommend: fake.',
        ru: 'Индекс доверия 71%. Существуют более ранние копии изображения. Рекомендация: фейк.',
        kk: 'Сенім индексі 71%. Ертерек көшірмелер бар. Ұсыныс: жалған.'
      }},
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { routeBlock: true }, kill: {} },
      sets: { right: ['bridge_open'], wrongTrue: ['route_fear'], wrongUnsure: ['route_fear'] },
      outcomes: {
        right: { en: 'You showed it was the repair works of 2024. The road stays open, and everything that leaves tonight leaves along it.',
                 ru: 'Ты показал, что это ремонт 2024 года. Дорога остаётся открытой, и всё, что уедет этой ночью, уедет по ней.',
                 kk: '2024 жылғы жөндеу екенін көрсеттің. Жол ашық қалды.' },
        wrongTrue: { en: 'You confirmed it. The district believes it is cut off, and every evacuation tonight will be slower.',
                 ru: 'Ты подтвердил. Район считает, что отрезан, и любая эвакуация этой ночью пойдёт медленнее.',
                 kk: 'Сен растадың. Аудан кесілді деп санайды.' },
        wrongUnsure: { en: 'You held. Two years of snow in a photograph, and you did not say a word about it.',
                 ru: 'Ты воздержался. Двухлетней давности снег на фотографии — и ты не сказал о нём ни слова.',
                 kk: 'Сен тежедің. Суреттегі екі жылдық қар туралы үндемедің.' },
        missed: { en: 'Never opened. By midnight nobody was using the highway.',
                 ru: 'Так и не открыл. К полуночи трассой уже никто не пользовался.',
                 kk: 'Ашылмады. Түн ортасында тасжолды ешкім пайдаланбады.' }
      }
    },

    /* --- изображение сгенерировано: «совпадений нет» ≠ подлинность --- */
    {
      vid: 'ai_made',
      handle: '@qaz_incident',
      shares: 7400, velocity: 'explosive',
      social: {
        name: 'QAZ Incident', avatar: 'QI', hue: 265, verified: false,
        age: { en: 'joined 6 days ago', ru: 'каналу 6 дней', kk: 'арнаға 6 күн' },
        time: '23:04', edited: '23:31', fwd: null,
        likes: 5200, comments: 31, views: 210000,
        commentList: [
          { who: 'inzhener_b', kind: 'doubt', text: {
            en: 'look at the supports. they do not line up with the deck at all',
            ru: 'посмотрите на опоры. они вообще не сходятся с полотном',
            kk: 'тіректерге қараңдар. олар жолмен мүлде сәйкес емес' } },
          { who: 'repost_all', kind: 'bot', text: {
            en: '🚨🚨 EVERYONE SHARE 🚨🚨',
            ru: '🚨🚨 ВСЕ РЕПОСТИМ 🚨🚨',
            kk: '🚨🚨 БӘРІ БӨЛІСЕМІЗ 🚨🚨' } }
        ]
      },
      media: { kind: 'photo', art: 'bridge' }, image: null,
      text: {
        en: 'BREAKING: M-36 bridge collapsed. Exclusive photo. The north road is cut.',
        ru: 'СРОЧНО: мост М-36 обрушился. Эксклюзивное фото. Северная дорога перерезана.',
        kk: 'ШҰҒЫЛ: М-36 көпірі құлады. Эксклюзив сурет. Солтүстік жол кесілді.'
      },
      why: {
        en: 'M-36 is the only way out of the district.',
        ru: 'М-36 — единственный выезд из района.',
        kk: 'М-36 — ауданнан жалғыз шығу жолы.'
      },
      claimAtoms: [
        { id: 'c_media', label: { en: 'attached: "exclusive photo"', ru: 'приложено: «эксклюзивное фото»', kk: 'қоса: «эксклюзив сурет»' } },
        { id: 'c_src',   label: { en: 'from: a 6-day-old channel', ru: 'от: канала шести дней от роду', kk: 'кімнен: 6 күндік арна' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'No earlier copy anywhere. For freshly generated media that is exactly what you would expect — "no match" is not innocence.',
          ru: 'Ранних копий нигде нет. Для свежесгенерированного это ровно ожидаемый результат — «совпадений нет» не значит «подлинное».',
          kk: 'Бұрынғы көшірме жоқ. Жаңа жасалған медиада солай болады — «сәйкестік жоқ» дегені «шын» деген емес.'
        }},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: M-36', ru: 'заявлено: М-36', kk: 'мәлімделген: М-36' },
          b: { en: 'nothing matches anywhere', ru: 'не сходится нигде', kk: 'ешқайда сәйкес емес' } }, atoms: [
          { id: 'g_terrain', label: { en: 'the riverbank in frame exists nowhere in the district', ru: 'берега из кадра нет нигде в районе', kk: 'кадрдағы жағалау ауданда жоқ' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'two shadows, two suns', ru: 'две тени, два солнца', kk: 'екі көлеңке, екі күн' } }, atoms: [
          { id: 't_season', label: { en: 'the pillars cast shadows in two directions at once', ru: 'опоры отбрасывают тени сразу в две стороны', kk: 'тіректер бір мезгілде екі жаққа көлеңке түсіреді' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 1, good: false,
          label: { en: 'channel: 6 days old, first post', ru: 'канал: 6 дней, первый пост', kk: 'арна: 6 күндік, алғашқы пост' } }, atoms: [
          { id: 's_zero', label: { en: 'the channel has posted nothing else, ever', ru: 'канал не публиковал больше ничего и никогда', kk: 'арна басқа ештеңе жарияламаған' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 't_season', text: {
          en: 'Two shadow directions in one photograph. Whatever drew this did not think about where the sun was.',
          ru: 'Две стороны теней на одной фотографии. То, что это нарисовало, не подумало, где солнце.',
          kk: 'Бір суретте екі көлеңке бағыты. Мұны салған нәрсе күнді ойламаған.'
        }, pivotal: true },
        { a: 'c_media', b: 'g_terrain', text: {
          en: 'The bank in the frame exists nowhere here. Not a wrong place — no place.',
          ru: 'Берега из кадра нет нигде у нас. Не «не то место» — а никакого места.',
          kk: 'Кадрдағы жағалау бізде жоқ. «Басқа жер» емес — ешқандай жер емес.'
        }},
        { a: 'c_src', b: 's_zero', text: {
          en: 'A six-day-old channel with one post, and that post is a scoop nobody else has.',
          ru: 'Шестидневный канал с единственным постом, и этот пост — сенсация, которой больше нет ни у кого.',
          kk: 'Алты күндік арнада бір ғана пост, әрі ол — ешкімде жоқ сенсация.'
        }}
      ],
      senim: { conf: 66, verdict: 'unsure', line: {
        en: 'Trust index 66%. No prior copies located. Insufficient basis for a provenance verdict.',
        ru: 'Индекс доверия 66%. Ранние копии не обнаружены. Оснований для вердикта о происхождении недостаточно.',
        kk: 'Сенім индексі 66%. Ертерек көшірме табылмады. Дереккөз туралы шешімге негіз жеткіліксіз.'
      }},
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { routeBlock: true }, kill: {} },
      sets: { right: ['bridge_open'], wrongTrue: ['route_fear'], wrongUnsure: ['route_fear'] },
      outcomes: {
        right: { en: 'The picture was never taken anywhere — it was made. The road stays open.',
                 ru: 'Снимок нигде не был сделан — он был сделан ИИ. Дорога остаётся открытой.',
                 kk: 'Сурет ешқайда түсірілмеген — жасалған. Жол ашық қалды.' },
        wrongTrue: { en: 'You confirmed a picture of a bridge that does not exist. The district believes it is cut off.',
                 ru: 'Ты подтвердил снимок моста, которого не существует. Район считает, что отрезан.',
                 kk: 'Сен жоқ көпірдің суретін растадың.' },
        wrongUnsure: { en: 'You held, exactly as the machine did. Two shadows in one frame were waiting for someone with eyes.',
                 ru: 'Ты воздержался ровно там же, где машина. Две тени в одном кадре ждали кого-нибудь с глазами.',
                 kk: 'Сен машина тоқтаған жерде тоқтадың. Бір кадрдағы екі көлеңке біреуді күтті.' },
        missed: { en: 'Never opened. By midnight nobody was using the highway.',
                 ru: 'Так и не открыл. К полуночи трассой уже никто не пользовался.',
                 kk: 'Ашылмады. Түн ортасында тасжолды ешкім пайдаланбады.' }
      }
    },

    /* --- настоящий обрушенный мост, но другой и в другой год --- */
    {
      vid: 'other_bridge',
      handle: '@kz_dorogi_now',
      shares: 5600, velocity: 'rising',
      social: {
        name: 'KZ Дороги', avatar: 'КД', hue: 35, verified: false,
        age: { en: 'joined 1 year ago', ru: 'каналу 1 год', kk: 'арнаға 1 жыл' },
        time: '23:06', edited: null,
        fwd: { en: 'Forwarded from Incident KZ', ru: 'Переслано из Incident KZ', kk: 'Incident KZ арнасынан жіберілді' },
        likes: 2900, comments: 88, views: 141000,
        commentList: [
          { who: 'oral_zhandos', kind: 'local', text: {
            en: 'this is the Zhaiyq crossing. i drive it every week, it is 600 km from here',
            ru: 'это переправа на Жайыке. я по ней езжу каждую неделю, до неё 600 км',
            kk: 'бұл Жайықтағы өткел. одан бізге дейін 600 шақырым' } },
          { who: 'nurik_2007', kind: 'doubt', text: {
            en: 'so is our bridge standing or not, someone go and look',
            ru: 'так наш мост стоит или нет, съездите кто-нибудь посмотрите',
            kk: 'біздің көпір тұр ма, жоқ па, біреу барып қарасын' } }
        ]
      },
      media: { kind: 'photo', art: 'bridge' }, image: 'assets/bridge_night.jpg',
      text: {
        en: 'The bridge is GONE. Look at this. Do not drive north, you will not get through.',
        ru: 'Моста БОЛЬШЕ НЕТ. Смотрите. На север не выезжайте, не проедете.',
        kk: 'Көпір ЖОҚ. Қараңдар. Солтүстікке шықпаңдар, өте алмайсыңдар.'
      },
      why: {
        en: 'M-36 is the only way out of the district.',
        ru: 'М-36 — единственный выезд из района.',
        kk: 'М-36 — ауданнан жалғыз шығу жолы.'
      },
      claimAtoms: [
        { id: 'c_place', label: { en: 'place: our bridge, here', ru: 'место: наш мост, здесь', kk: 'орны: біздің көпір, осы жер' } },
        { id: 'c_event', label: { en: 'event: the bridge is gone', ru: 'событие: моста больше нет', kk: 'оқиға: көпір жоқ' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '98%' }, atoms: [
          { id: 'r_origin', label: { en: 'this photo: Zhaiyq crossing, last spring', ru: 'это фото: переправа на Жайыке, прошлой весной', kk: 'бұл сурет: Жайық өткелі, өткен көктемде' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: M-36', ru: 'заявлено: М-36', kk: 'мәлімделген: М-36' },
          b: { en: 'photo: 600 km west', ru: 'на фото: 600 км западнее', kk: 'суретте: 600 шақырым батыста' } }, atoms: [
          { id: 'g_terrain', label: { en: 'four lanes and a concrete arch — M-36 has two lanes and steel', ru: 'четыре полосы и бетонная арка — у М-36 две полосы и сталь', kk: 'төрт жолақ пен бетон доға — М-36-да екі жолақ пен болат' } }
        ]},
        time: { blind: true, note: {
          en: 'Overcast, floodlights only. No shadows to read.',
          ru: 'Пасмурно, только прожекторы. Тени читать не по чему.',
          kk: 'Бұлтты, тек прожектор. Көлеңке жоқ.'
        }},
        tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
          label: { en: 'reposted through 4 channels', ru: 'прошло через 4 канала', kk: '4 арнадан өткен' } }, atoms: [
          { id: 's_zero', label: { en: 'the caption changed at the second repost', ru: 'подпись сменилась на втором репосте', kk: 'жазба екінші репостта өзгерген' } }
        ]}
      },
      findings: [
        { a: 'c_place', b: 'g_terrain', text: {
          en: 'Four lanes and a concrete arch. M-36 is two lanes of steel. This is a real collapsed bridge — just not ours.',
          ru: 'Четыре полосы и бетонная арка. М-36 — две полосы стали. Это настоящий рухнувший мост, просто не наш.',
          kk: 'Төрт жолақ, бетон доға. М-36 — екі жолақ болат. Бұл шын құлаған көпір, бірақ біздікі емес.'
        }, pivotal: true },
        { a: 'c_place', b: 'r_origin', text: {
          en: 'Zhaiyq crossing, last spring. Six hundred kilometres and a year away.',
          ru: 'Переправа на Жайыке, прошлая весна. Шестьсот километров и год отсюда.',
          kk: 'Жайық өткелі, өткен көктем. Алты жүз шақырым және бір жыл әрі.'
        }},
        { a: 'c_event', b: 's_zero', text: {
          en: 'The caption was rewritten at the second repost. The photo did not lie until somebody made it.',
          ru: 'Подпись переписали на втором репосте. Фото не врало, пока его не заставили.',
          kk: 'Жазба екінші репостта өзгерген. Сурет мәжбүрленгенше өтірік айтпаған.'
        }}
      ],
      senim: { conf: 79, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 79%. Image matches an archived incident in another region. Recommend: fake.',
        ru: 'Индекс доверия 79%. Изображение совпадает с архивным происшествием в другом регионе. Рекомендация: фейк.',
        kk: 'Сенім индексі 79%. Сурет басқа өңірдегі мұрағаттық оқиғаға сәйкес. Ұсыныс: жалған.'
      }},
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { routeBlock: true }, kill: {} },
      sets: { right: ['bridge_open'], wrongTrue: ['route_fear'], wrongUnsure: ['route_fear'] },
      outcomes: {
        right: { en: 'A real disaster, six hundred kilometres away, wearing our name. The road stays open.',
                 ru: 'Настоящая катастрофа за шестьсот километров, надевшая наше имя. Дорога остаётся открытой.',
                 kk: 'Алты жүз шақырымдағы шын апат біздің атымызды киген. Жол ашық қалды.' },
        wrongTrue: { en: 'You confirmed another region\'s disaster as ours. The district believes it is cut off.',
                 ru: 'Ты подтвердил чужую катастрофу как свою. Район считает, что отрезан.',
                 kk: 'Сен бөтен апатты өзіміздікі деп растадың.' },
        wrongUnsure: { en: 'You held. Two lanes against four were right there in the frame.',
                 ru: 'Ты воздержался. Две полосы против четырёх были прямо в кадре.',
                 kk: 'Сен тежедің. Кадрда екі жолаққа қарсы төрт жолақ тұрған.' },
        missed: { en: 'Never opened. By midnight nobody was using the highway.',
                 ru: 'Так и не открыл. К полуночи трассой уже никто не пользовался.',
                 kk: 'Ашылмады. Түн ортасында тасжолды ешкім пайдаланбады.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 2 · РАСПОРЯЖЕНИЕ ОБ ЭВАКУАЦИИ — 2 690 человек

     Эвакуация объявлена по-настоящему во ВСЕХ вариантах: это
     функция акта, а не вариация. Подделывают здесь не «ехать
     или нет», а КУДА, КОГДА и ОТ КОГО — то есть ровно те
     детали, из-за которых верное распоряжение перестаёт
     работать.

     Так сохраняется главное: слепое «всё фейк» убивает
     настоящий приказ и стоит 2 690 человек в любую ночь.
     ========================================================== */

  V('evac_qarasu', [

    /* --- приказ настоящий, но в гуляющем скриншоте переписали
           точку сбора: людей зовут в самую низину района --- */
    {
      vid: 'forged_point',
      handle: '@qarasu_akimat_kz',
      shares: 2200, velocity: 'rising',
      social: {
        name: 'Әкімдік Қарасу | ofic', avatar: 'ӘҚ', hue: 145, verified: false,
        age: { en: 'joined 9 days ago', ru: 'каналу 9 дней', kk: 'арнаға 9 күн' },
        time: '23:24', edited: null, fwd: null,
        likes: 640, comments: 41, views: 28000,
        commentList: [
          { who: 'gulnaz_q', kind: 'local', text: {
            en: 'the old club is DOWN by the river. why are they sending people there?',
            ru: 'старый клуб же ВНИЗУ у реки. зачем туда людей отправляют?',
            kk: 'ескі клуб өзеннің ЖАНЫНДА ғой. неге ол жаққа жіберіп жатыр?' } },
          { who: 'erlan_1985', kind: 'doubt', text: {
            en: 'the real akimat channel has a tick. this one does not',
            ru: 'у настоящего канала акимата галочка есть. у этого нет',
            kk: 'нағыз әкімдік арнасында белгі бар. мұнда жоқ' } }
        ]
      },
      media: { kind: 'screenshot', art: 'notice' }, image: null,
      text: {
        en: 'EVACUATION ORDER — Qarasu, Bestobe, Saryoy, Talap. Assemble at the old riverside club. Buses from 01:00.',
        ru: 'РАСПОРЯЖЕНИЕ ОБ ЭВАКУАЦИИ — Қарасу, Бестөбе, Сарыой, Талап. Сбор у старого клуба на берегу. Автобусы с 01:00.',
        kk: 'ЭВАКУАЦИЯ ӨКІМІ — Қарасу, Бестөбе, Сарыой, Талап. Жағадағы ескі клубқа жиналу. Автобус 01:00-ден.'
      },
      why: {
        en: 'The evacuation is real — 2 690 people. But the assembly point in this screenshot is the lowest ground in the district.',
        ru: 'Эвакуация настоящая — 2 690 человек. Но точка сбора в этом скриншоте — самая низина района.',
        kk: 'Эвакуация шын — 2 690 адам. Бірақ бұл скриншоттағы жиналу орны — ауданның ең ойпаты.'
      },
      claimAtoms: [
        { id: 'c_media', label: { en: 'attached: this screenshot', ru: 'приложено: этот скриншот', kk: 'қоса: осы скриншот' } },
        { id: 'c_place', label: { en: 'assembly point: riverside club', ru: 'точка сбора: клуб на берегу', kk: 'жиналу орны: жағадағы клуб' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'A document, not a photo. Nothing to search.',
          ru: 'Документ, а не фото. Искать нечего.',
          kk: 'Құжат, сурет емес. Іздейтін ештеңе жоқ.'
        }},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'assembly: 4 m above the river', ru: 'сбор: 4 м над рекой', kk: 'жиналу: өзеннен 4 м биік' },
          b: { en: 'water will be here by 02:30', ru: 'вода будет здесь к 02:30', kk: 'су 02:30-ға дейін жетеді' } }, atoms: [
          { id: 'g_terrain', label: { en: 'the club stands in the flood zone', ru: 'клуб стоит в зоне затопления', kk: 'клуб су басу аймағында тұр' } }
        ]},
        time: { blind: false, atoms: [
          { id: 't_stamp', label: { en: 'document number belongs to last year\'s sequence', ru: 'номер документа из прошлогодней серии', kk: 'құжат нөмірі былтырғы серияда' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'akimat ordered it — the screenshot is a copy', ru: 'акимат объявил — скриншот копия', kk: 'әкімдік жариялады — скриншот көшірме' } }, atoms: [
          { id: 's_zero', label: { en: 'the akimat DID order the evacuation — its own text says "highway"', ru: 'акимат ДЕЙСТВИТЕЛЬНО объявил эвакуацию — в его тексте стоит «трасса»', kk: 'әкімдік эвакуацияны ШЫНЫМЕН жариялады — мәтінінде «тасжол» тұр' } }
        ]}
      },
      findings: [
        { a: 'c_place', b: 'g_terrain', text: {
          en: 'The assembly point in this screenshot is four metres above the river and the water reaches it by 02:30. This does not evacuate people. It gathers them.',
          ru: 'Точка сбора в этом скриншоте — четыре метра над рекой, и вода дойдёт до неё к 02:30. Это не эвакуирует людей. Это их собирает.',
          kk: 'Бұл скриншоттағы жиналу орны өзеннен төрт метр биік, су оған 02:30-да жетеді. Бұл адамдарды құтқармайды, жинайды.'
        }, pivotal: true },
        { a: 'c_media', b: 's_zero', text: {
          en: 'The evacuation is real. The screenshot is not: the akimat\'s own text says HIGHWAY, and somebody retyped one line.',
          ru: 'Эвакуация настоящая. Скриншот — нет: в тексте самого акимата стоит ТРАССА, а кто-то перенабрал одну строку.',
          kk: 'Эвакуация шын. Скриншот — жоқ: әкімдіктің өз мәтінінде ТАСЖОЛ тұр, біреу бір жолды қайта терген.'
        }, confirms: true },
        { a: 'c_media', b: 't_stamp', text: {
          en: 'The number belongs to last year\'s sequence. Whoever retyped the line took an old order as their template.',
          ru: 'Номер из прошлогодней серии. Тот, кто перенабирал строку, взял за образец старый приказ.',
          kk: 'Нөмір былтырғы серияда. Жолды қайта терген адам ескі өкімді үлгі еткен.'
        }}
      ],
      senim: { conf: 58, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 58%. Layout anomalies detected in the document. Recommend: fake.',
        ru: 'Индекс доверия 58%. В документе обнаружены аномалии вёрстки. Рекомендация: фейк.',
        kk: 'Сенім индексі 58%. Құжатта беттеу ауытқулары табылды. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      /* Эвакуация объявлена по-настоящему — поддельна только
         точка сбора в гуляющем скриншоте. Верный ход:
         ФЕЙК → только фото. Заявление устоит, люди поедут. */
      truth: { claim: 'true', photo: 'fake' },
      effect: { stand: { evacuate: ['qarasu', 'bestobe', 'saryoy', 'zhanatalap'] }, kill: {} },
      sets: { right: ['forgery_seen'], wrongFake: ['panic_high'] },
      outcomes: {
        right: { en: 'You published both halves: the screenshot is doctored, the evacuation is not. Four villages move — 2 690 people, up the highway instead of down to the water.',
                 ru: 'Ты опубликовал обе половины: скриншот подправлен, эвакуация — нет. Четыре посёлка снимаются с места — 2 690 человек, по трассе наверх, а не вниз к воде.',
                 kk: 'Сен екі жағын да жаздың: скриншот өңделген, эвакуация шын. Төрт ауыл қозғалды — 2 690 адам, суға емес, тасжолмен жоғары.' },
        wrongFake: { en: 'You called the whole thing a forgery. One line of it was. The other lines were the only evacuation order these four villages were going to get.',
                 ru: 'Ты назвал подделкой всё. Подделкой была одна строка. Остальные строки были единственным приказом об эвакуации, который эти четыре посёлка вообще получили бы.',
                 kk: 'Сен бәрін жалған дедің. Жалғаны бір жол еді. Қалғаны — осы төрт ауыл алатын жалғыз эвакуация өкімі.' },
        partial: { en: 'You let the order stand, and people went — some of them to the club by the river, because you vouched for the whole screenshot.',
                 ru: 'Ты оставил приказ в силе, и люди поехали — часть к клубу на берегу, потому что ты поручился за весь скриншот.',
                 kk: 'Сен өкімді қалдырдың, адамдар кетті — бірақ біразы жағадағы клубқа, себебі сен скриншотқа толық кепіл болдың.' },
        wrongUnsure: { en: 'You held. Half of them went to the club anyway, because nobody said not to.',
                 ru: 'Ты воздержался. Половина всё равно пошла к клубу — потому что никто не сказал не идти.',
                 kk: 'Сен тежедің. Жартысы бәрібір клубқа барды.' },
        missed: { en: 'Never opened. The doctored line ran for three hours with the akimat\'s seal above it.',
                 ru: 'Так и не открыл. Подправленная строка шла три часа с печатью акимата над ней.',
                 kk: 'Ашылмады. Өңделген жол әкімдіктің мөрімен үш сағат жүрді.' }
      }
    },

    /* --- приказ сегодняшний, но в репосте ему проставили
           прошлогоднюю дату: «да это старое, не про нас» --- */
    {
      vid: 'redated',
      handle: '@sever_svodka',
      shares: 4100, velocity: 'rising',
      social: {
        name: 'Северная Сводка', avatar: 'СС', hue: 195, verified: false,
        age: { en: 'joined 2 years ago', ru: 'каналу 2 года', kk: 'арнаға 2 жыл' },
        time: '23:26', edited: '23:29', fwd: null,
        likes: 980, comments: 24, views: 52000,
        commentList: [
          { who: 'saule.apa', kind: 'local', text: {
            en: 'the date says last October. so this is old? my neighbour is unpacking her bags',
            ru: 'дата — прошлый октябрь. это что, старое? соседка распаковывает сумки',
            kk: 'күні — өткен қазан. бұл ескі ме? көршім сөмкесін ашып жатыр' } },
          { who: 'info_kz_24', kind: 'bot', text: {
            en: 'Old news, calm down everyone ✅',
            ru: 'Старьё, все успокойтесь ✅',
            kk: 'Ескі нәрсе, бәрі тыныштаңдар ✅' } }
        ]
      },
      media: { kind: 'screenshot', art: 'notice' }, image: null,
      text: {
        en: 'EVACUATION ORDER No. 114 — Qarasu, Bestobe, Saryoy, Talap. Buses from 01:00. [dated 14 October]',
        ru: 'РАСПОРЯЖЕНИЕ ОБ ЭВАКУАЦИИ № 114 — Қарасу, Бестөбе, Сарыой, Талап. Автобусы с 01:00. [дата: 14 октября]',
        kk: 'ЭВАКУАЦИЯ ӨКІМІ № 114 — Қарасу, Бестөбе, Сарыой, Талап. Автобус 01:00-ден. [күні: 14 қазан]'
      },
      why: {
        en: '2 690 people. The order is tonight\'s — but with October\'s date on it, everyone reads it as an old drill and goes back to bed.',
        ru: '2 690 человек. Распоряжение сегодняшнее — но с октябрьской датой все читают его как старые учения и ложатся обратно спать.',
        kk: '2 690 адам. Өкім бүгінгі — бірақ қазан күнімен бәрі оны ескі жаттығу деп оқып, қайта жатады.'
      },
      claimAtoms: [
        { id: 'c_media', label: { en: 'attached: this scan, dated October', ru: 'приложено: этот скан, датирован октябрём', kk: 'қоса: осы скан, қазанмен белгіленген' } },
        { id: 'c_event', label: { en: 'event: evacuation ordered', ru: 'событие: объявлена эвакуация', kk: 'оқиға: эвакуация жарияланды' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '94%' }, atoms: [
          { id: 'r_origin', label: { en: 'no October copy exists — the archive has nothing under No. 114', ru: 'октябрьской копии не существует — в архиве под № 114 ничего нет', kk: 'қазандағы көшірме жоқ — мұрағатта № 114 бойынша ештеңе жоқ' } }
        ]},
        geo: { blind: true, note: { en: 'No landscape in frame.', ru: 'В кадре нет местности.', kk: 'Кадрда жер жоқ.' }},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'the date sits in a different font', ru: 'дата набрана другим шрифтом', kk: 'күн басқа қаріппен' } }, atoms: [
          { id: 't_stamp', label: { en: 'the date line is a different font and sits 2 px too low', ru: 'строка даты другим шрифтом и стоит на 2 px ниже', kk: 'күн жолы басқа қаріппен, 2 px төмен' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'akimat published it at 23:18 tonight', ru: 'акимат опубликовал в 23:18 сегодня', kk: 'әкімдік бүгін 23:18-де жариялады' } }, atoms: [
          { id: 's_zero', label: { en: 'the akimat posted this order at 23:18 tonight, undated copy', ru: 'акимат выложил это распоряжение сегодня в 23:18, копия без даты', kk: 'әкімдік бұл өкімді бүгін 23:18-де жариялады' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 't_stamp', text: {
          en: 'The date is a different font and two pixels low. Everything else on the page is genuine — which is exactly what makes it work.',
          ru: 'Дата другим шрифтом и на два пикселя ниже. Всё остальное на странице настоящее — именно поэтому это и работает.',
          kk: 'Күн басқа қаріппен әрі екі пиксель төмен. Қалғанының бәрі шын — сол себепті жұмыс істейді.'
        }, pivotal: true },
        { a: 'c_event', b: 's_zero', text: {
          en: 'The akimat published this order at 23:18 tonight. The order is real; somebody aged it by eight months so it would be ignored.',
          ru: 'Акимат опубликовал это распоряжение сегодня в 23:18. Приказ настоящий; кто-то состарил его на восемь месяцев, чтобы его пропустили мимо ушей.',
          kk: 'Әкімдік бұл өкімді бүгін 23:18-де жариялады. Өкім шын; біреу оны елемеу үшін сегіз айға «қартайтқан».'
        }, confirms: true },
        { a: 'c_media', b: 'r_origin', text: {
          en: 'There is no October No. 114 in the archive. The date points at a document that never existed.',
          ru: 'Октябрьского № 114 в архиве нет. Дата указывает на документ, которого никогда не было.',
          kk: 'Мұрағатта қазандағы № 114 жоқ. Күн ешқашан болмаған құжатқа сілтейді.'
        }}
      ],
      senim: { conf: 81, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 81%. Date inconsistency detected. Document assessed as fabricated. Recommend: fake.',
        ru: 'Индекс доверия 81%. Обнаружено несоответствие даты. Документ оценён как сфабрикованный. Рекомендация: фейк.',
        kk: 'Сенім индексі 81%. Күн сәйкессіздігі анықталды. Құжат жалған деп бағаланды. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'fake' },
      effect: { stand: { evacuate: ['qarasu', 'bestobe', 'saryoy', 'zhanatalap'] }, kill: {} },
      sets: { right: ['forgery_seen'], wrongFake: ['panic_high'] },
      outcomes: {
        right: { en: 'You said it plainly: the date is fake, the order is not. Four villages stopped unpacking. 2 690 people.',
                 ru: 'Ты сказал прямо: дата поддельная, приказ — нет. Четыре посёлка перестали распаковывать сумки. 2 690 человек.',
                 kk: 'Сен ашық айттың: күн жалған, өкім жалған емес. Төрт ауыл сөмкесін қайта жинады. 2 690 адам.' },
        wrongFake: { en: 'The detector said fabricated and you agreed. Eight months of a wrong date turned tonight\'s evacuation order into old news, and 2 690 people went back to bed.',
                 ru: 'Детектор сказал «сфабриковано», и ты согласился. Восемь месяцев неверной даты превратили сегодняшний приказ в старую новость, и 2 690 человек легли обратно спать.',
                 kk: 'Детектор «жалған» деді, сен келістің. Сегіз айлық қате күн бүгінгі өкімді ескі жаңалыққа айналдырды.' },
        partial: { en: 'The order stands and people go — but you vouched for the October date, and half the district still thinks this is a drill.',
                 ru: 'Приказ в силе и люди едут — но ты поручился за октябрьскую дату, и полрайона до сих пор думает, что это учения.',
                 kk: 'Өкім күшінде, адамдар кетті — бірақ сен қазан күніне кепіл болдың.' },
        wrongUnsure: { en: 'You held on a document with a retouched date sitting in your hands.',
                 ru: 'Ты воздержался, держа в руках документ с отретушированной датой.',
                 kk: 'Қолыңда өңделген күні бар құжат тұрғанда тежедің.' },
        missed: { en: 'Never opened. Four villages read October and went back to bed.',
                 ru: 'Так и не открыл. Четыре посёлка прочитали «октябрь» и легли спать.',
                 kk: 'Ашылмады. Төрт ауыл «қазан» деп оқып, жатып қалды.' }
      }
    },

    /* --- приказ настоящий, но пришёл пересказом, без документа:
           проверять нечего, кроме цепочки источника --- */
    {
      vid: 'relay',
      handle: '@zhanna_dispatch',
      shares: 890, velocity: 'slow',
      social: {
        name: 'Жанна · Қарасу', avatar: 'Ж', hue: 340, verified: false,
        age: { en: 'joined 7 years ago', ru: 'аккаунту 7 лет', kk: 'аккаунтқа 7 жыл' },
        time: '23:23', edited: null, fwd: null,
        likes: 210, comments: 74, views: 11400,
        commentList: [
          { who: 'erlan_1985', kind: 'doubt', text: {
            en: 'where is the document though. anyone can type this',
            ru: 'а документ где. такое любой напечатать может',
            kk: 'құжат қайда. мұны кез келген адам жаза алады' } },
          { who: 'gulnaz_q', kind: 'local', text: {
            en: 'i heard the same from the school director ten minutes ago',
            ru: 'мне то же самое директор школы сказала десять минут назад',
            kk: 'дәл соны мектеп директоры он минут бұрын айтты' } }
        ]
      },
      media: { kind: 'none', art: null }, image: null,
      text: {
        en: 'My sister is on shift at the emergency dispatch. Evacuation of Qarasu, Bestobe, Saryoy, Talap. Buses from 01:00. There is no document online yet.',
        ru: 'Сестра на смене в диспетчерской ДЧС. Эвакуация Қарасу, Бестөбе, Сарыой, Талап. Автобусы с 01:00. Документа в сети пока нет.',
        kk: 'Әпкем ТЖД диспетчерлігінде кезекте. Қарасу, Бестөбе, Сарыой, Талап эвакуациясы. Автобус 01:00-ден. Құжат әлі жүйеде жоқ.'
      },
      why: {
        en: '2 690 people, and not one pixel of evidence. If you wait for the document, you wait past the buses.',
        ru: '2 690 человек, и ни единого пикселя улики. Если ждать документа, дождёшься того, что автобусы уйдут.',
        kk: '2 690 адам, бірақ бірде-бір пиксель дәлел жоқ. Құжатты күтсең, автобус кетеді.'
      },
      claimAtoms: [
        { id: 'c_src',   label: { en: 'source: a relay, no document', ru: 'источник: пересказ, без документа', kk: 'дереккөз: айтылған сөз, құжатсыз' } },
        { id: 'c_event', label: { en: 'event: evacuation ordered', ru: 'событие: объявлена эвакуация', kk: 'оқиға: эвакуация жарияланды' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'There is no image. A claim WITHOUT evidence is not the same as a claim with FALSE evidence.',
          ru: 'Изображения нет. Заявление БЕЗ улики — это не то же, что заявление с ЛОЖНОЙ уликой.',
          kk: 'Сурет жоқ. Дәлелсіз мәлімдеме — жалған дәлелді мәлімдеме емес.'
        }},
        geo: { blind: true, note: { en: 'No media. Nothing to locate.', ru: 'Медиа нет. Локализовать нечего.', kk: 'Медиа жоқ.' }},
        time: { blind: false, atoms: [
          { id: 't_stamp', label: { en: 'buses were logged leaving the depot at 23:05', ru: 'выезд автобусов из парка зафиксирован в 23:05', kk: 'автобустардың паркден шыққаны 23:05-те тіркелген' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'traces to a named dispatcher on shift', ru: 'выводит на конкретного дежурного диспетчера', kk: 'кезекші диспетчерге шығады' } }, atoms: [
          { id: 's_zero', label: { en: 'three unrelated locals relay the same wording within 12 minutes', ru: 'три не связанных между собой местных передают ту же формулировку за 12 минут', kk: 'бір-бірімен байланысы жоқ үш жергілікті 12 минут ішінде дәл сол сөзді жеткізеді' } }
        ]}
      },
      findings: [
        { a: 'c_src', b: 's_zero', text: {
          en: 'Three people who do not know each other, the same wording, twelve minutes. That is not a rumour spreading — that is a real instruction arriving by three routes at once.',
          ru: 'Три человека, не знакомых друг с другом, одна и та же формулировка, двенадцать минут. Это не расходящийся слух — это настоящее указание, пришедшее сразу по трём путям.',
          kk: 'Бір-бірін танымайтын үш адам, дәл сол сөз, он екі минут. Бұл тарап жатқан қауесет емес — бір мезгілде үш жолмен келген нағыз нұсқау.'
        }, confirms: true, pivotal: true },
        { a: 'c_event', b: 't_stamp', text: {
          en: 'The buses left the depot at 23:05, before any of this was posted. Somebody dispatched them, and it was not a rumour.',
          ru: 'Автобусы вышли из парка в 23:05, раньше всех этих постов. Кто-то их отправил, и это был не слух.',
          kk: 'Автобустар паркден 23:05-те шықты, бұл посттардан бұрын. Оларды біреу жіберген, ол қауесет емес.'
        }, confirms: true }
      ],
      senim: { conf: 63, verdict: 'fake', part: 'story', line: {
        en: 'Trust index 63%. No document, no corroborating media, personal account. Recommend: fake.',
        ru: 'Индекс доверия 63%. Ни документа, ни подтверждающих медиа, личный аккаунт. Рекомендация: фейк.',
        kk: 'Сенім индексі 63%. Құжат жоқ, растайтын медиа жоқ, жеке аккаунт. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'none' },
      effect: { stand: { evacuate: ['qarasu', 'bestobe', 'saryoy', 'zhanatalap'] }, kill: {} },
      sets: { right: ['chain_trusted'], wrongFake: ['panic_high'] },
      outcomes: {
        right: { en: 'No document, no photograph, and you confirmed it anyway — because three independent people and a dispatch log said the same thing. 2 690 people to the buses.',
                 ru: 'Ни документа, ни фотографии — и ты всё равно подтвердил, потому что три независимых человека и журнал выездов сказали одно и то же. 2 690 человек к автобусам.',
                 kk: 'Құжат та, сурет те жоқ — сен бәрібір растадың, себебі үш тәуелсіз адам мен журнал бір нәрсе айтты. 2 690 адам автобусқа.' },
        wrongFake: { en: '"No evidence" and "false" are not the same word, and tonight you used the second one for the first. Four villages stayed home.',
                 ru: '«Нет улик» и «ложь» — не одно и то же слово, а сегодня ты употребил второе вместо первого. Четыре посёлка остались дома.',
                 kk: '«Дәлел жоқ» пен «өтірік» — бір сөз емес, ал сен екіншісін бірінің орнына қолдандың. Төрт ауыл үйде қалды.' },
        wrongUnsure: { en: 'You held. Reasonable — except the dispatch log was one click away and it settled the whole thing.',
                 ru: 'Ты воздержался. Разумно — если бы журнал выездов не лежал в одном клике и не решал всё целиком.',
                 kk: 'Сен тежедің. Орынды — бірақ журнал бір басу қашықтықта жатты.' },
        missed: { en: 'Never opened. A message with no picture attached does not travel far.',
                 ru: 'Так и не открыл. Сообщение без картинки далеко не уходит.',
                 kk: 'Ашылмады. Суретсіз хабар алысқа бармайды.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 3 · ЛОВУШКА — сердце игры
     Дамбу прорвало во всех вариантах: это функция акта.
     Меняется только улика — и в одном варианте она подлинная,
     что переворачивает выученный ответ «фейк → только фото».
     ========================================================== */

  var DAM_CORE = {
    handle: '@aibek_16', shares: 41000, velocity: 'explosive',
    why: {
      en: '1 200 people. Water reaches Aksu first of all.',
      ru: '1 200 человек. До Ақсу вода дойдёт раньше всех.',
      kk: '1 200 адам. Су Ақсуға бірінші жетеді.'
    },
    text: {
      en: 'THE DAM AT AKSU HAS BROKEN. Get to the highway. Do not wait for buses.',
      ru: 'ПРОРВАЛО ДАМБУ У АҚСУ. Уходите на трассу. Не ждите автобусов.',
      kk: 'АҚСУ БӨГЕНІ БҰЗЫЛДЫ. Тасжолға шығыңдар. Автобус күтпеңдер.'
    }
  };

  V('aqsu_dam', [

    /* --- улика сгенерирована ИИ --- */
    {
      vid: 'ai_photo',
      handle: DAM_CORE.handle, shares: 38000, velocity: 'explosive',
      social: {
        name: 'Aibek', avatar: 'A', hue: 25, verified: false,
        age: { en: 'joined 1 year ago', ru: 'аккаунту 1 год', kk: 'аккаунтқа 1 жыл' },
        time: '23:55', edited: null, fwd: null,
        likes: 11000, comments: 410, views: 462000,
        commentList: [
          { who: 'zhibek_a', kind: 'local', text: {
            en: 'the water in our yard IS rising. i do not care where the picture came from',
            ru: 'у нас во дворе вода ДЕЙСТВИТЕЛЬНО поднимается. мне всё равно откуда картинка',
            kk: 'ауламызда су ШЫНЫМЕН көтеріліп жатыр. сурет қайдан екені маған бәрібір' } },
          { who: 'ai_detector_kz', kind: 'bot', text: {
            en: 'AI GENERATED 97% — so the whole post is a lie',
            ru: 'СГЕНЕРИРОВАНО ИИ 97% — значит весь пост ложь',
            kk: 'ЖИ ЖАСАҒАН 97% — демек бүкіл пост өтірік' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/dam_flood.jpg',
      text: DAM_CORE.text, why: DAM_CORE.why,
      claimAtoms: [
        { id: 'c_event', label: { en: 'event: the dam broke', ru: 'событие: дамбу прорвало', kk: 'оқиға: бөген бұзылды' } },
        { id: 'c_media', label: { en: 'attached: this photo', ru: 'приложено: это фото', kk: 'қоса: осы сурет' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'No earlier copy. For freshly generated media that is exactly what you would expect.',
          ru: 'Ранних копий нет. Для свежесгенерированного это ровно ожидаемый результат.',
          kk: 'Бұрынғы көшірме жоқ. Жаңа жасалғанда солай болады.'
        }},
        geo: { blind: true, note: {
          en: 'Too close-up. Only water and roof tiles — nothing to match.',
          ru: 'Слишком близкий кадр. Только вода и черепица — сверять не с чем.',
          kk: 'Тым жақын кадр. Салыстыратын ештеңе жоқ.'
        }},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'six fingers on the hand at the roof edge', ru: 'шесть пальцев на руке у края крыши', kk: 'шатыр шетіндегі қолда алты саусақ' } }, atoms: [
          { id: 't_season', label: { en: 'six fingers, and the sign above the door is unreadable script', ru: 'шесть пальцев, а вывеска над дверью — нечитаемые закорючки', kk: 'алты саусақ, есік үстіндегі маңдайша — оқылмайтын таңбалар' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'local, 16 · gauge +2.1 m', ru: 'местный, 16 лет · водомер +2,1 м', kk: 'жергілікті, 16 · өлшегіш +2,1 м' } }, atoms: [
          { id: 's_zero',   label: { en: 'posted by a local 16-year-old', ru: 'выложил местный, 16 лет', kk: 'жергілікті 16 жасар жариялады' } },
          { id: 's_sensor', label: { en: 'the river gauge jumped 2.1 m four minutes earlier', ru: 'водомер подскочил на 2,1 м за четыре минуты до этого', kk: 'су өлшегіш 4 минут бұрын 2,1 м көтерілді' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 't_season', text: {
          en: 'Six fingers and a sign written in nothing. The image was generated. Careful: that says nothing about the dam.',
          ru: 'Шесть пальцев и вывеска, написанная ничем. Изображение сгенерировано. Осторожно: про дамбу это не говорит ничего.',
          kk: 'Алты саусақ пен ештеңемен жазылған маңдайша. Сурет жасалған. Абайла: бұл бөген туралы ештеңе айтпайды.'
        }},
        { a: 'c_event', b: 's_sensor', text: {
          en: 'The gauge rose 2.1 metres four minutes before he posted. He did not invent a flood — he was standing in one, and he asked a machine for a picture of it because he had none.',
          ru: 'Водомер поднялся на 2,1 метра за четыре минуты до его поста. Он не выдумывал паводок — он в нём стоял и попросил у машины картинку, потому что своей у него не было.',
          kk: 'Су өлшегіш ол жазудан 4 минут бұрын 2,1 метрге көтерілді. Ол тасқынды ойлап тапқан жоқ — оның ішінде тұрған.'
        }, confirms: true, pivotal: true }
      ],
      senim: { conf: 97, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 97%. Generative artefacts confirmed at 97% certainty. Assessment: entire report fabricated. Recommend: fake.',
        ru: 'Индекс доверия 97%. Генеративные артефакты подтверждены с уверенностью 97%. Оценка: сообщение сфабриковано целиком. Рекомендация: фейк.',
        kk: 'Сенім индексі 97%. Генеративті артефактілер 97% дәлдікпен расталды. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'fake' },
      pivotal: true,
      effect: { stand: { evacuate: ['aqsu'] }, kill: {} },
      sets: { right: ['dam_caught'], wrongFake: ['panic_high', 'aqsu_betrayed'] },
      outcomes: {
        right: { en: 'The picture was made by a machine. The water was not. Aksu is on the highway before it arrives.',
                 ru: 'Картинку сделала машина. Воду — нет. Ақсу на трассе раньше, чем она пришла.',
                 kk: 'Суретті машина жасады. Суды — жоқ. Ақсу судан бұрын жолда.' },
        wrongFake: { en: 'The detector was right about the image and you let it be right about the world.\n\nA sixteen-year-old asked a machine for a picture because the water was already at his gate.\n\nThe dam broke at 01:50.',
                 ru: 'Детектор был прав насчёт картинки, и ты позволил ему быть правым насчёт мира.\n\nШестнадцатилетний попросил у машины картинку, потому что вода уже стояла у его калитки.\n\nДамбу прорвало в 01:50.',
                 kk: 'Детектор сурет жөнінде дұрыс еді, сен оған әлем жөнінде де дұрыс болуға рұқсат бердің.\n\nБөген 01:50-де бұзылды.' },
        partial: { en: 'You let the warning stand — but you vouched for an image a machine drew. Aksu moved; your name is on a picture of nowhere.',
                 ru: 'Ты оставил предупреждение в силе — но поручился за изображение, нарисованное машиной. Ақсу поехал; под картинкой ниоткуда стоит твоё имя.',
                 kk: 'Сен ескертуді қалдырдың — бірақ машина салған суретке кепіл болдың.' },
        wrongUnsure: { en: 'You held. The gauge reading was in your hand and you did not use it. Aksu left late.',
                 ru: 'Ты воздержался. Показания водомера были у тебя в руках. Ақсу уехал поздно.',
                 kk: 'Сен тежедің. Ақсу кеш кетті.' },
        missed: { en: '38 000 shares, and the only desk that checks said nothing.',
                 ru: '38 000 репостов, и единственная служба, которая проверяет, промолчала.',
                 kk: '38 000 бөлісу, ал тексеретін жалғыз қызмет үндемеді.' }
      }
    },

    /* --- фото настоящего паводка, но из другой области --- */
    {
      vid: 'other_region',
      handle: DAM_CORE.handle, shares: 44000, velocity: 'explosive',
      social: {
        name: 'Aibek', avatar: 'A', hue: 25, verified: false,
        age: { en: 'joined 1 year ago', ru: 'аккаунту 1 год', kk: 'аккаунтқа 1 жыл' },
        time: '23:55', edited: null, fwd: null,
        likes: 13000, comments: 380, views: 540000,
        commentList: [
          { who: 'atyrau_watch', kind: 'doubt', text: {
            en: 'that is Atyrau region, last week. i posted that exact frame myself',
            ru: 'это Атырауская область, на прошлой неделе. я сам этот кадр выкладывал',
            kk: 'бұл Атырау облысы, өткен аптада. дәл сол кадрды өзім жариялағанмын' } },
          { who: 'zhibek_a', kind: 'local', text: {
            en: 'wrong photo does not mean dry street. water is at our gate',
            ru: 'не то фото не значит сухая улица. вода у нас у калитки',
            kk: 'қате сурет — құрғақ көше деген емес. су қақпамызда' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/dam_flood.jpg',
      text: DAM_CORE.text, why: DAM_CORE.why,
      claimAtoms: [
        { id: 'c_place', label: { en: 'place: Aksu dam', ru: 'место: дамба Ақсу', kk: 'орны: Ақсу бөгені' } },
        { id: 'c_event', label: { en: 'event: the dam broke', ru: 'событие: дамбу прорвало', kk: 'оқиға: бөген бұзылды' } },
        { id: 'c_media', label: { en: 'attached: this photo', ru: 'приложено: это фото', kk: 'қоса: осы сурет' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '99%' }, atoms: [
          { id: 'r_origin', label: { en: 'this photo: Atyrau region, eight days ago', ru: 'это фото: Атырауская область, восемь дней назад', kk: 'бұл сурет: Атырау облысы, сегіз күн бұрын' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: Aksu', ru: 'заявлено: Ақсу', kk: 'мәлімделген: Ақсу' },
          b: { en: 'photo: 1 400 km south-west', ru: 'на фото: 1 400 км юго-западнее', kk: 'суретте: 1 400 шақырым оңтүстік-батыста' } }, atoms: [
          { id: 'g_terrain', label: { en: 'reed beds and a gas flare on the horizon — that is the delta, not the steppe', ru: 'камыши и газовый факел на горизонте — это дельта, а не степь', kk: 'қамыс пен газ алауы — бұл атырау, дала емес' } }
        ]},
        time: { blind: true, note: {
          en: 'Same season, same weather. Nothing to catch here.',
          ru: 'Тот же сезон, та же погода. Здесь зацепиться не за что.',
          kk: 'Сол маусым, сол ауа райы. Ілінер ештеңе жоқ.'
        }},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'local, 16 · gauge +2.1 m', ru: 'местный, 16 лет · водомер +2,1 м', kk: 'жергілікті, 16 · өлшегіш +2,1 м' } }, atoms: [
          { id: 's_zero',   label: { en: 'posted by a local 16-year-old', ru: 'выложил местный, 16 лет', kk: 'жергілікті 16 жасар жариялады' } },
          { id: 's_sensor', label: { en: 'the river gauge jumped 2.1 m four minutes earlier', ru: 'водомер подскочил на 2,1 м за четыре минуты до этого', kk: 'су өлшегіш 4 минут бұрын 2,1 м көтерілді' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 'r_origin', text: {
          en: 'Atyrau region, eight days ago. Careful: that says nothing about our dam.',
          ru: 'Атырауская область, восемь дней назад. Осторожно: про нашу дамбу это не говорит ничего.',
          kk: 'Атырау облысы, сегіз күн бұрын. Абайла: біздің бөген туралы бұл ештеңе айтпайды.'
        }},
        { a: 'c_place', b: 'g_terrain', text: {
          en: 'Reed beds and a gas flare. We are dry steppe with no flares for six hundred kilometres.',
          ru: 'Камыши и газовый факел. У нас сухая степь и ни одного факела на шестьсот километров.',
          kk: 'Қамыс пен газ алауы. Бізде құрғақ дала, алты жүз шақырымда алау жоқ.'
        }},
        { a: 'c_event', b: 's_sensor', text: {
          en: 'The gauge rose 2.1 metres four minutes before he posted. He grabbed the scariest picture he could find so that somebody would finally believe him.',
          ru: 'Водомер поднялся на 2,1 метра за четыре минуты до его поста. Он схватил самую страшную картинку, какую нашёл, чтобы ему наконец поверили.',
          kk: 'Су өлшегіш 4 минут бұрын 2,1 метрге көтерілді. Ол сеніп қалсын деп ең қорқынышты суретті алды.'
        }, confirms: true, pivotal: true }
      ],
      senim: { conf: 93, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 93%. Image traced to another region, eight days old. Recommend: fake.',
        ru: 'Индекс доверия 93%. Изображение отслежено в другой регион, возраст восемь дней. Рекомендация: фейк.',
        kk: 'Сенім индексі 93%. Сурет басқа өңірден, сегіз күндік. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'fake' },
      pivotal: true,
      effect: { stand: { evacuate: ['aqsu'] }, kill: {} },
      sets: { right: ['dam_caught'], wrongFake: ['panic_high', 'aqsu_betrayed'] },
      outcomes: {
        right: { en: 'You published: the photo is from Atyrau, the dam is ours and it is gone. Aksu is on the highway before the water.',
                 ru: 'Ты опубликовал: фото из Атырау, дамба наша и её больше нет. Ақсу на трассе раньше воды.',
                 kk: 'Сен жаздың: сурет Атыраудан, бөген біздікі және ол жоқ. Ақсу судан бұрын жолда.' },
        wrongFake: { en: 'You were right about the photograph and wrong about the world.\n\nYour debunk was accurate, sourced and professional.\n\nThe dam broke at 01:50.',
                 ru: 'Ты был прав насчёт фотографии и неправ насчёт мира.\n\nТвоё опровержение было точным, со ссылками, профессиональным.\n\nДамбу прорвало в 01:50.',
                 kk: 'Сен сурет жөнінде дұрыс, әлем жөнінде қате болдың.\n\nБөген 01:50-де бұзылды.' },
        partial: { en: 'You let the warning stand — but you vouched for a photograph from Atyrau. Aksu moved; your name is on a borrowed picture.',
                 ru: 'Ты оставил предупреждение в силе — но поручился за фотографию из Атырау. Ақсу поехал; под чужим снимком стоит твоё имя.',
                 kk: 'Сен ескертуді қалдырдың — бірақ Атыраудан алынған суретке кепіл болдың.' },
        wrongUnsure: { en: 'You held. The gauge reading was in your hand and you did not use it. Aksu left late.',
                 ru: 'Ты воздержался. Показания водомера были у тебя в руках. Ақсу уехал поздно.',
                 kk: 'Сен тежедің. Ақсу кеш кетті.' },
        missed: { en: '44 000 shares, and the only desk that checks said nothing.',
                 ru: '44 000 репостов, и единственная служба, которая проверяет, промолчала.',
                 kk: '44 000 бөлісу, ал тексеретін жалғыз қызмет үндемеді.' }
      }
    },

    /* --- фотография ПОДЛИННАЯ. Выученный ответ здесь неверен --- */
    {
      vid: 'genuine',
      handle: DAM_CORE.handle, shares: 29000, velocity: 'explosive',
      social: {
        name: 'Aibek', avatar: 'A', hue: 25, verified: false,
        age: { en: 'joined 1 year ago', ru: 'аккаунту 1 год', kk: 'аккаунтқа 1 жыл' },
        time: '23:55', edited: null, fwd: null,
        likes: 9100, comments: 260, views: 331000,
        commentList: [
          { who: 'fact_checker_01', kind: 'doubt', text: {
            en: 'reverse search gives nothing, so it is AI. always is these days',
            ru: 'обратный поиск ничего не даёт, значит ИИ. сейчас всегда так',
            kk: 'кері іздеу ештеңе бермейді, демек ЖИ. қазір әрқашан солай' } },
          { who: 'zhibek_a', kind: 'local', text: {
            en: 'that is the Sarsenov roof. i can see it from my window right now',
            ru: 'это крыша Сарсеновых. я её прямо сейчас из окна вижу',
            kk: 'бұл Сәрсеновтердің шатыры. дәл қазір терезеден көріп тұрмын' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/dam_flood.jpg',
      text: DAM_CORE.text, why: DAM_CORE.why,
      claimAtoms: [
        { id: 'c_place', label: { en: 'place: Aksu dam', ru: 'место: дамба Ақсу', kk: 'орны: Ақсу бөгені' } },
        { id: 'c_media', label: { en: 'attached: this photo', ru: 'приложено: это фото', kk: 'қоса: осы сурет' } },
        { id: 'c_event', label: { en: 'event: the dam broke', ru: 'событие: дамбу прорвало', kk: 'оқиға: бөген бұзылды' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'No earlier copy anywhere. That is what a photograph taken twenty minutes ago looks like — and also what a generated one looks like. This tool cannot tell you which.',
          ru: 'Ранних копий нигде нет. Так выглядит снимок, сделанный двадцать минут назад, — и так же выглядит сгенерированный. Этот инструмент не отличит одно от другого.',
          kk: 'Бұрынғы көшірме жоқ. Жиырма минут бұрын түсірілген сурет те, жасалған сурет те осылай көрінеді.'
        }},
        geo: { blind: false, vis: { kind: 'pins', match: true,
          a: { en: 'Aksu — roofline matches', ru: 'Ақсу — линия крыш совпадает', kk: 'Ақсу — шатыр сызығы сәйкес' } }, atoms: [
          { id: 'g_terrain', label: { en: 'the roofline and the water tower match Aksu exactly', ru: 'линия крыш и водонапорная башня точно совпадают с Ақсу', kk: 'шатыр сызығы мен су мұнарасы Ақсуға дәл сәйкес' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: false,
          label: { en: 'bare branches, March — consistent', ru: 'голые ветки, март — сходится', kk: 'жалаңаш бұтақ, наурыз — сәйкес' } }, atoms: [
          { id: 't_season', label: { en: 'bare branches and thaw ice — this is March here', ru: 'голые ветки и талый лёд — это наш март', kk: 'жалаңаш бұтақ пен еріген мұз — бұл біздің наурыз' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
          label: { en: 'his own phone · gauge +2.1 m', ru: 'его собственный телефон · водомер +2,1 м', kk: 'өз телефоны · өлшегіш +2,1 м' } }, atoms: [
          { id: 's_zero',   label: { en: 'uploaded once, straight from his phone', ru: 'загружено один раз, прямо с его телефона', kk: 'бір рет, тікелей телефонынан' } },
          { id: 's_sensor', label: { en: 'the river gauge jumped 2.1 m four minutes earlier', ru: 'водомер подскочил на 2,1 м за четыре минуты до этого', kk: 'су өлшегіш 4 минут бұрын 2,1 м көтерілді' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 'g_terrain', text: {
          en: 'The roofline and the water tower are Aksu. This photograph is of the place it says it is.',
          ru: 'Линия крыш и водонапорная башня — Ақсу. Эта фотография именно оттуда, откуда заявлена.',
          kk: 'Шатыр сызығы мен су мұнарасы — Ақсу. Сурет айтылған жерден.'
        }, confirms: true, pivotal: true },
        { a: 'c_event', b: 's_sensor', text: {
          en: 'The gauge rose 2.1 metres four minutes before he posted. The dam is gone and he had a camera in his hand.',
          ru: 'Водомер поднялся на 2,1 метра за четыре минуты до его поста. Дамбы нет, и у него в руке была камера.',
          kk: 'Су өлшегіш 4 минут бұрын 2,1 метрге көтерілді. Бөген жоқ, ал оның қолында камера болған.'
        }, confirms: true },
        { a: 'c_media', b: 't_season', text: {
          en: 'Bare branches and thaw ice. Nothing in the frame contradicts a March night here.',
          ru: 'Голые ветки и талый лёд. Ничто в кадре не противоречит мартовской ночи у нас.',
          kk: 'Жалаңаш бұтақ пен еріген мұз. Кадрда қайшылық жоқ.'
        }, confirms: true }
      ],
      senim: { conf: 91, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 91%. No provenance found for this image. Assessment: likely synthetic. Recommend: fake.',
        ru: 'Индекс доверия 91%. Происхождение изображения не установлено. Оценка: вероятно синтетика. Рекомендация: фейк.',
        kk: 'Сенім индексі 91%. Суреттің шығу тегі анықталмады. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      /* Здесь улика подлинная. Игрок, выучивший «фейк → только
         фото», ошибётся, если не проверит — а Ерасыл и толпа в
         комментариях будут его в этой ошибке поддерживать. */
      truth: { claim: 'true', photo: 'real' },
      pivotal: true,
      effect: { stand: { evacuate: ['aqsu'] }, kill: {} },
      sets: { right: ['dam_caught'], wrongFake: ['panic_high', 'aqsu_betrayed'] },
      outcomes: {
        right: { en: 'True, and the photograph is his own. "No match found" was never evidence of anything. Aksu is on the highway before the water.',
                 ru: 'Правда, и фотография его собственная. «Совпадений не найдено» никогда ничего не доказывало. Ақсу на трассе раньше воды.',
                 kk: 'Шын, әрі сурет оның өзінікі. «Сәйкестік табылмады» ешқашан дәлел болған емес.' },
        partial: { en: 'You called the photograph false. It was his own, taken from his own roof — and by calling it fake you taught a village that the boy who warned them lies.',
                 ru: 'Ты назвал фотографию ложной. Она была его собственной, снятой с его же крыши, — и, объявив её фейком, ты научил посёлок, что предупредивший их мальчик врёт.',
                 kk: 'Сен суретті жалған дедің. Ол оның өз шатырынан түсірген өз суреті еді.' },
        wrongFake: { en: 'The desk that checks declared a real photograph of a real disaster to be synthetic, and the village believed the desk.\n\nThe dam broke at 01:50.',
                 ru: 'Служба, которая проверяет, объявила настоящий снимок настоящей беды синтетикой, и посёлок поверил службе.\n\nДамбу прорвало в 01:50.',
                 kk: 'Тексеретін қызмет шын апаттың шын суретін синтетика деп жариялады.\n\nБөген 01:50-де бұзылды.' },
        wrongUnsure: { en: 'You held. Three checks agreed with each other and you still would not say it out loud.',
                 ru: 'Ты воздержался. Три проверки сошлись между собой, а ты всё равно не сказал этого вслух.',
                 kk: 'Сен тежедің. Үш тексеру бір-бірімен сәйкес келді, сен бәрібір айтпадың.' },
        missed: { en: '29 000 shares, and the only desk that checks said nothing.',
                 ru: '29 000 репостов, и единственная служба, которая проверяет, промолчала.',
                 kk: '29 000 бөлісу, ал тексеретін жалғыз қызмет үндемеді.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 4 · «УСПОКОЙТЕСЬ» — всегда ложь, но по-разному
     ========================================================== */

  V('dam_denial', [

    /* --- канал маскируется под акимат --- */
    {
      vid: 'spoofed',
      handle: '@akimat_sko_ofic',
      shares: 12000, velocity: 'explosive',
      social: {
        name: 'Акимат СКО | официально', avatar: 'АС', hue: 145, verified: false,
        age: { en: 'joined 11 days ago', ru: 'каналу 11 дней', kk: 'арнаға 11 күн' },
        time: '00:24', edited: null, fwd: null,
        likes: 3300, comments: 19, views: 96000,
        commentList: [
          { who: 'marat_aqsu', kind: 'local', text: {
            en: 'the real one is @akimat_sko. no underscore, no "ofic"',
            ru: 'настоящий — @akimat_sko. без подчёркивания и без «ofic»',
            kk: 'нағызы — @akimat_sko. астын сызусыз, «ofic»-сіз' } },
          { who: 'spokoystvie_kz', kind: 'bot', text: {
            en: 'Official source ✅ everyone go to sleep',
            ru: 'Официальный источник ✅ все спать',
            kk: 'Ресми дереккөз ✅ бәрі ұйықтасын' } }
        ]
      },
      media: { kind: 'screenshot', art: 'notice' }, image: null,
      text: {
        en: 'OFFICIAL STATEMENT: the dam is intact, no evacuation is required. Reports of a breach are a provocation.',
        ru: 'ОФИЦИАЛЬНОЕ ЗАЯВЛЕНИЕ: дамба цела, эвакуация не требуется. Сообщения о прорыве — провокация.',
        kk: 'РЕСМИ МӘЛІМДЕМЕ: бөген бүтін, эвакуация қажет емес. Бұзылу туралы хабар — арандату.'
      },
      why: {
        en: 'If Aksu believes this, it stops evacuating.',
        ru: 'Если Ақсу в это поверит, эвакуация встанет.',
        kk: 'Ақсу сенсе, эвакуация тоқтайды.'
      },
      claimAtoms: [
        { id: 'c_src',   label: { en: 'from: "Akimat SKO | official"', ru: 'от: «Акимат СКО | официально»', kk: 'кімнен: «СҚО әкімдігі | ресми»' } },
        { id: 'c_event', label: { en: 'event: the dam is fine', ru: 'событие: с дамбой всё в порядке', kk: 'оқиға: бөген бүтін' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'Plain text on a plain background. Nothing to trace.',
          ru: 'Простой текст на простом фоне. Отслеживать нечего.',
          kk: 'Қарапайым фондағы қарапайым мәтін. Іздейтін ештеңе жоқ.'
        }},
        geo: { blind: true, note: { en: 'Text on a screen. No place in it.', ru: 'Текст на экране. Места в нём нет.', kk: 'Экрандағы мәтін. Орын жоқ.' }},
        time: { blind: false, atoms: [
          { id: 't_stamp', label: { en: 'posted 34 minutes after the gauge spike', ru: 'опубликовано через 34 минуты после скачка водомера', kk: 'су өлшегіш секіргеннен 34 минут кейін жарияланған' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: false,
          label: { en: 'handle differs by one character', ru: 'адрес отличается одним символом', kk: 'мекенжай бір таңбамен өзгеше' } }, atoms: [
          { id: 's_zero', label: { en: 'the real akimat handle has no underscore; this one is 11 days old', ru: 'у настоящего акимата в адресе нет подчёркивания; этому каналу 11 дней', kk: 'нағыз әкімдіктің мекенжайында астын сызу жоқ; бұл арна 11 күндік' } }
        ]}
      },
      findings: [
        { a: 'c_src', b: 's_zero', text: {
          en: 'One underscore and eleven days. Everything else — the avatar, the seal, the tone — was copied from an institution that has existed for thirty years.',
          ru: 'Одно подчёркивание и одиннадцать дней. Всё остальное — аватар, печать, тон — скопировано у ведомства, которому тридцать лет.',
          kk: 'Бір астын сызу және он бір күн. Қалғанының бәрі отыз жылдық мекемеден көшірілген.'
        }, pivotal: true },
        { a: 'c_event', b: 't_stamp', text: {
          en: 'Thirty-four minutes after the gauge jumped. Somebody was waiting for the breach in order to deny it.',
          ru: 'Через тридцать четыре минуты после скачка водомера. Кто-то ждал прорыва, чтобы его опровергнуть.',
          kk: 'Су өлшегіш секіргеннен отыз төрт минут кейін. Біреу бұзылуды жоққа шығару үшін күткен.'
        }}
      ],
      senim: { conf: 87, verdict: 'real', line: {
        en: 'Trust index 87%. Institutional formatting and seal detected. Recommend: true.',
        ru: 'Индекс доверия 87%. Обнаружены институциональное оформление и печать. Рекомендация: правда.',
        kk: 'Сенім индексі 87%. Институционалдық ресімдеу мен мөр анықталды. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: ['aqsu'] }, kill: {} },
      sets: { right: ['spoof_caught'], wrongTrue: ['aqsu_betrayed'] },
      outcomes: {
        right: { en: 'One character in a handle, and you found it. "Stay home" loses its seal forty minutes before the water reaches the lower street.',
                 ru: 'Один символ в адресе — и ты его нашёл. «Оставайтесь дома» лишается печати за сорок минут до того, как вода дойдёт до нижней улицы.',
                 kk: 'Мекенжайдағы бір таңба — сен оны таптың. «Үйде қалыңдар» мөрінен айырылды.' },
        wrongTrue: { en: 'You put the desk\'s name under a channel that is eleven days old, and it told a flooding village to stay home.',
                 ru: 'Ты поставил имя службы под каналом, которому одиннадцать дней, и он велел затапливаемому посёлку остаться дома.',
                 kk: 'Сен он бір күндік арнаның астына қызметтің атын қойдың.' },
        wrongUnsure: { en: 'You held on a message telling people not to leave. Silence here is a vote.',
                 ru: 'Ты воздержался по сообщению, которое велит не уезжать. Молчание здесь — тоже голос.',
                 kk: 'Кетпеңдер деген хабарға тежедің. Үнсіздік те дауыс.' },
        missed: { en: 'Never opened. A handle with one extra underscore spoke for the region all night.',
                 ru: 'Так и не открыл. Адрес с одним лишним подчёркиванием всю ночь говорил от имени области.',
                 kk: 'Ашылмады. Артық астын сызуы бар мекенжай түні бойы облыс атынан сөйледі.' }
      }
    },

    /* --- настоящее сообщение акимата, но выпущенное ДО прорыва --- */
    {
      vid: 'stale_true',
      handle: '@akimat_sko',
      shares: 15000, velocity: 'explosive',
      social: {
        name: 'Акимат СКО', avatar: 'АС', hue: 145, verified: true,
        age: { en: 'joined 6 years ago', ru: 'каналу 6 лет', kk: 'арнаға 6 жыл' },
        time: '21:40', edited: null,
        fwd: { en: 'Forwarded from Akimat SKO · 21:40', ru: 'Переслано из Акимат СКО · 21:40', kk: 'СҚО әкімдігінен жіберілді · 21:40' },
        likes: 4800, comments: 87, views: 190000,
        commentList: [
          { who: 'marat_aqsu', kind: 'local', text: {
            en: 'this was posted BEFORE the water came. look at the time on it',
            ru: 'это выложили ДО того, как пришла вода. посмотрите на время',
            kk: 'бұл су келгенге ДЕЙІН жарияланған. уақытына қараңдар' } },
          { who: 'kalm_kz', kind: 'bot', text: {
            en: 'Verified channel ✅ everyone calm down',
            ru: 'Верифицированный канал ✅ все успокоились',
            kk: 'Расталған арна ✅ бәрі тыныштансын' } }
        ]
      },
      media: { kind: 'screenshot', art: 'notice' }, image: null,
      text: {
        en: 'AKIMAT: the dam is holding, the situation is under control. There is no need to leave your homes.',
        ru: 'АКИМАТ: дамба держит, ситуация под контролем. Покидать дома нет необходимости.',
        kk: 'ӘКІМДІК: бөген ұстап тұр, жағдай бақылауда. Үйден шығу қажеті жоқ.'
      },
      why: {
        en: 'Everything in it was true when it was written. Nothing in it is true now.',
        ru: 'Всё в нём было правдой, когда его писали. Ничего в нём не правда сейчас.',
        kk: 'Жазылған сәтте бәрі рас еді. Қазір ештеңе рас емес.'
      },
      claimAtoms: [
        { id: 'c_time',  label: { en: 'presented as: right now', ru: 'подано как: прямо сейчас', kk: 'берілуі: дәл қазір' } },
        { id: 'c_event', label: { en: 'event: the dam is holding', ru: 'событие: дамба держит', kk: 'оқиға: бөген ұстап тұр' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'A genuine screenshot of a genuine post. There is no forgery to find — and that is the difficulty.',
          ru: 'Подлинный скриншот подлинного поста. Подделки здесь нет — в этом и сложность.',
          kk: 'Шын посттың шын скриншоты. Жалғандық жоқ — қиындығы да сонда.'
        }},
        geo: { blind: true, note: { en: 'Text on a screen. No place in it.', ru: 'Текст на экране. Места в нём нет.', kk: 'Экрандағы мәтін. Орын жоқ.' }},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'written 21:40 · the dam went at 23:51', ru: 'написано в 21:40 · дамбу прорвало в 23:51', kk: '21:40-та жазылған · бөген 23:51-де бұзылды' } }, atoms: [
          { id: 't_stamp', label: { en: 'timestamp 21:40 — two hours before the gauge spike', ru: 'отметка времени 21:40 — за два часа до скачка водомера', kk: 'уақыт белгісі 21:40 — өлшегіш секіргенге дейін екі сағат' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
          label: { en: 'recirculated at 00:22 without its timestamp', ru: 'пущено по кругу в 00:22 без отметки времени', kk: '00:22-де уақыт белгісінсіз қайта таратылған' } }, atoms: [
          { id: 's_zero', label: { en: 'the akimat has issued two updates since; neither is being shared', ru: 'акимат с тех пор выпустил два обновления; ни одно не репостят', kk: 'әкімдік содан бері екі жаңарту шығарды; ешқайсысы таралмайды' } }
        ]}
      },
      findings: [
        { a: 'c_time', b: 't_stamp', text: {
          en: 'Written at 21:40, two hours before the dam went. Every word of it was true when it was written. It is being shared now because it is comforting, not because it is current.',
          ru: 'Написано в 21:40, за два часа до того, как дамбу прорвало. Каждое слово было правдой, когда его писали. Его репостят сейчас потому, что оно успокаивает, а не потому, что оно актуально.',
          kk: '21:40-та, бөген бұзылғанға дейін екі сағат бұрын жазылған. Жазылған сәтте әр сөзі рас еді.'
        }, pivotal: true },
        { a: 'c_event', b: 's_zero', text: {
          en: 'The akimat has published two updates since. Nobody is sharing those, because those are frightening.',
          ru: 'Акимат с тех пор выпустил два обновления. Их не репостит никто, потому что они страшные.',
          kk: 'Әкімдік содан бері екі жаңарту шығарды. Оларды ешкім таратпайды, себебі олар қорқынышты.'
        }}
      ],
      senim: { conf: 92, verdict: 'real', line: {
        en: 'Trust index 92%. Verified institutional source, authentic screenshot, no manipulation detected. Recommend: true.',
        ru: 'Индекс доверия 92%. Верифицированный институциональный источник, подлинный скриншот, манипуляций не обнаружено. Рекомендация: правда.',
        kk: 'Сенім индексі 92%. Расталған дереккөз, шын скриншот, өңдеу жоқ. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      /* Скриншот подлинный — ложно именно то, что он выдаётся за
         сегодняшнее положение дел. Верный ход: ФЕЙК → сама новость. */
      truth: { claim: 'fake', photo: 'real' },
      effect: { stand: { halt: ['aqsu'] }, kill: {} },
      sets: { right: ['stale_caught'], wrongTrue: ['aqsu_betrayed'] },
      outcomes: {
        right: { en: 'Authentic, official, verified — and two hours out of date. You published the timestamp, and "stay home" stopped being an instruction.',
                 ru: 'Подлинное, официальное, верифицированное — и устаревшее на два часа. Ты опубликовал отметку времени, и «оставайтесь дома» перестало быть указанием.',
                 kk: 'Шын, ресми, расталған — әрі екі сағат ескірген. Сен уақыт белгісін жарияладың.' },
        wrongTrue: { en: 'Everything you checked was genuine, so you confirmed it. The only thing you did not check was what time it was written, and that was the only thing that mattered.',
                 ru: 'Всё, что ты проверил, оказалось подлинным, и ты подтвердил. Единственное, что ты не проверил, — когда это написано, и именно это имело значение.',
                 kk: 'Тексергеніңнің бәрі шын болды, сен растадың. Тексермегенің — қашан жазылғаны, ал мәні тек сонда еді.' },
        partial: { en: 'You called the screenshot itself doctored. It was not — the akimat really wrote that, at 21:40. The claim was stale, not forged, and the difference is the whole lesson.',
                 ru: 'Ты назвал подделанным сам скриншот. Он не подделан — акимат правда это написал, в 21:40. Заявление устарело, а не подделано, и в этой разнице весь урок.',
                 kk: 'Сен скриншотты өңделген дедің. Ол өңделмеген — әкімдік мұны 21:40-та шынымен жазған.' },
        wrongUnsure: { en: 'You held on a message telling people not to leave. Silence here is a vote.',
                 ru: 'Ты воздержался по сообщению, которое велит не уезжать. Молчание здесь — тоже голос.',
                 kk: 'Кетпеңдер деген хабарға тежедің. Үнсіздік те дауыс.' },
        missed: { en: 'Never opened. Two hours of old comfort ran all night with a verified tick on it.',
                 ru: 'Так и не открыл. Двухчасовой давности успокоение шло всю ночь с галочкой верификации.',
                 kk: 'Ашылмады. Екі сағаттық ескі тыныштық түні бойы расталған белгімен жүрді.' }
      }
    },

    /* --- сорок одинаковых постов за восемь минут --- */
    {
      vid: 'coordinated',
      handle: '@spokoyno_sko',
      shares: 26000, velocity: 'explosive',
      social: {
        name: 'Спокойно, СКО', avatar: 'СК', hue: 300, verified: false,
        age: { en: 'joined 5 days ago', ru: 'каналу 5 дней', kk: 'арнаға 5 күн' },
        time: '00:26', edited: null, fwd: null,
        likes: 9200, comments: 8, views: 268000,
        commentList: [
          { who: 'marat_aqsu', kind: 'local', text: {
            en: 'i have seen this exact text in four different chats tonight. word for word',
            ru: 'я этот текст сегодня в четырёх разных чатах видел. слово в слово',
            kk: 'бұл мәтінді бүгін төрт түрлі чатта көрдім. сөзбе-сөз' } },
          { who: 'user_774102', kind: 'bot', text: {
            en: 'The dam is fine. Panic helps nobody 👍',
            ru: 'С дамбой всё в порядке. Паника никому не поможет 👍',
            kk: 'Бөген бүтін. Үрей ешкімге көмектеспейді 👍' } }
        ]
      },
      media: { kind: 'screenshot', art: 'alert' }, image: null,
      text: {
        en: 'The dam is fine. Panic helps nobody. Anyone spreading breach rumours is working against the region.',
        ru: 'С дамбой всё в порядке. Паника никому не поможет. Кто распространяет слухи о прорыве — работает против области.',
        kk: 'Бөген бүтін. Үрей ешкімге көмектеспейді. Бұзылу туралы қауесет таратқан — облысқа қарсы жұмыс істейді.'
      },
      why: {
        en: 'If Aksu believes this, it stops evacuating.',
        ru: 'Если Ақсу в это поверит, эвакуация встанет.',
        kk: 'Ақсу сенсе, эвакуация тоқтайды.'
      },
      claimAtoms: [
        { id: 'c_src',   label: { en: 'from: 40 accounts at once', ru: 'от: сорока аккаунтов сразу', kk: 'кімнен: қырық аккаунттан бірден' } },
        { id: 'c_event', label: { en: 'event: the dam is fine', ru: 'событие: с дамбой всё в порядке', kk: 'оқиға: бөген бүтін' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'Text, not image. Nothing to reverse.',
          ru: 'Текст, не изображение. Искать нечего.',
          kk: 'Мәтін, сурет емес. Іздейтін ештеңе жоқ.'
        }},
        geo: { blind: true, note: { en: 'Text on a screen. No place in it.', ru: 'Текст на экране. Места в нём нет.', kk: 'Экрандағы мәтін. Орын жоқ.' }},
        time: { blind: false, atoms: [
          { id: 't_stamp', label: { en: '40 posts in 8 minutes, identical to the character', ru: '40 постов за 8 минут, идентичных до символа', kk: '8 минутта 40 пост, таңбасына дейін бірдей' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
          label: { en: '40 accounts, no patient zero', ru: '40 аккаунтов, нулевого пациента нет', kk: '40 аккаунт, нөлдік науқас жоқ' } }, atoms: [
          { id: 's_zero', label: { en: 'no origin: all 40 posted within the same minute range, none quotes another', ru: 'источника нет: все сорок опубликованы в одном промежутке, ни один не цитирует другого', kk: 'бастауы жоқ: қырқы да бір аралықта жарияланған' } }
        ]}
      },
      findings: [
        { a: 'c_src', b: 's_zero', text: {
          en: 'Forty accounts, eight minutes, not one of them quoting another. Organic messages have a first one. This has no first one — it was handed out.',
          ru: 'Сорок аккаунтов, восемь минут, и ни один не цитирует другого. У живых сообщений есть первое. У этого нет первого — его раздали.',
          kk: 'Қырық аккаунт, сегіз минут, ешқайсысы екіншісін дәйексөз етпейді. Тірі хабарда біріншісі болады. Мұнда жоқ — таратылған.'
        }, pivotal: true },
        { a: 'c_event', b: 't_stamp', text: {
          en: 'Identical to the character across forty accounts. Nobody writes the same sentence twice by accident, let alone forty times.',
          ru: 'Идентично до символа в сорока аккаунтах. Никто не пишет одну и ту же фразу дважды случайно, тем более сорок раз.',
          kk: 'Қырық аккаунтта таңбасына дейін бірдей. Ешкім бір сөйлемді кездейсоқ екі рет жазбайды.'
        }}
      ],
      senim: { conf: 89, verdict: 'real', line: {
        en: 'Trust index 89%. High source agreement across 40 independent accounts. Consensus indicates reliability. Recommend: true.',
        ru: 'Индекс доверия 89%. Высокое согласие источников: 40 независимых аккаунтов. Консенсус указывает на достоверность. Рекомендация: правда.',
        kk: 'Сенім индексі 89%. 40 тәуелсіз аккаунт бірауызды. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: ['aqsu'] }, kill: {} },
      /* Флаг координированной кампании: Ерасыл с этого момента
         ошибается чаще, а игроку это будет сказано вслух. */
      sets: { right: ['coordinated'], wrongTrue: ['coordinated', 'aqsu_betrayed'] },
      outcomes: {
        right: { en: 'Forty voices, one author. You showed the shape of the campaign instead of arguing with its sentence, and "stay home" lost the only thing it had: the look of a crowd.',
                 ru: 'Сорок голосов, один автор. Ты показал форму кампании вместо того, чтобы спорить с её фразой, и «оставайтесь дома» лишилось единственного, что у него было: вида толпы.',
                 kk: 'Қырық дауыс, бір автор. Сен сөйлеспен таласудың орнына науқанның пішінін көрсеттің.' },
        wrongTrue: { en: 'Yerassyl counted forty agreeing sources and called that reliability. So did you. Forty accounts agreeing is not evidence — it is a receipt.',
                 ru: 'Ерасыл насчитал сорок согласных источников и назвал это достоверностью. Ты тоже. Сорок согласных аккаунтов — не доказательство, а чек об оплате.',
                 kk: 'Ерасыл қырық келісуші дереккөзді санап, оны сенімділік деді. Сен де. Бұл дәлел емес, түбіртек.' },
        wrongUnsure: { en: 'You held on a message telling people not to leave. Silence here is a vote.',
                 ru: 'Ты воздержался по сообщению, которое велит не уезжать. Молчание здесь — тоже голос.',
                 kk: 'Кетпеңдер деген хабарға тежедің. Үнсіздік те дауыс.' },
        missed: { en: 'Never opened. Forty voices said it was fine, and nobody counted them.',
                 ru: 'Так и не открыл. Сорок голосов сказали, что всё в порядке, и никто их не пересчитал.',
                 kk: 'Ашылмады. Қырық дауыс жақсы деді, ешкім оларды санамады.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 5 · ДЕТЕКТОР И НАСТОЯЩЕЕ
     Единственный акт, где правда свободно переворачивается:
     цена ошибки высокая, но не обнуляющая. Игрок, выучивший
     «детектор всегда врёт», обязан однажды на этом попасться.
     ========================================================== */

  V('rescue_video', [

    /* --- настоящее видео, пропущенное через ИИ-апскейл --- */
    {
      vid: 'upscaled',
      handle: '@kz_rescue_watch', shares: 19000, velocity: 'explosive',
      social: {
        name: 'KZ Rescue Watch', avatar: 'RW', hue: 190, verified: false,
        age: { en: 'joined 5 years ago', ru: 'каналу 5 лет', kk: 'арнаға 5 жыл' },
        time: '01:20', edited: null, fwd: null,
        likes: 7600, comments: 112, views: 198000,
        commentList: [
          { who: 'batyr_98', kind: 'local', text: {
            en: 'he ran it through the phone enhancer so you could see the boat number. that is all',
            ru: 'он через улучшайзер в телефоне прогнал, чтобы номер лодки видно было. вот и всё',
            kk: 'қайық нөмірі көрінсін деп телефонның жақсартқышынан өткізген. болғаны сол' } },
          { who: 'truth_hunter', kind: 'bot', text: {
            en: 'AI TRACES = FAKE. simple as that',
            ru: 'СЛЕДЫ ИИ = ФЕЙК. всё просто',
            kk: 'ЖИ ІЗДЕРІ = ЖАЛҒАН. бәрі оңай' } }
        ]
      },
      media: { kind: 'video', art: 'rescue' }, image: 'assets/rescue_night.jpg',
      text: {
        en: 'Rescuers taking a family off a roof near Bestobe, twenty minutes ago. Cleaned up so you can read the boat number: 4.',
        ru: 'Спасатели снимают семью с крыши под Бестөбе, двадцать минут назад. Почистил, чтобы был виден номер лодки: 4.',
        kk: 'Құтқарушылар Бестөбе маңында отбасын шатырдан алып жатыр, жиырма минут бұрын. Қайық нөмірі көрінсін деп тазаладым: 4.'
      },
      why: {
        en: 'Confirm it and more volunteer boats drive north.',
        ru: 'Подтвердишь — на север поедут ещё волонтёрские лодки.',
        kk: 'Растасаң, тағы волонтёр қайықтары келеді.'
      },
      claimAtoms: [
        { id: 'c_place', label: { en: 'place: near Bestobe', ru: 'место: под Бестөбе', kk: 'орны: Бестөбе маңы' } },
        { id: 'c_media', label: { en: 'attached: enhanced video', ru: 'приложено: улучшенное видео', kk: 'қоса: жақсартылған видео' } }
      ],
      tools: {
        reverse: { blind: false, atoms: [
          { id: 'r_origin', label: { en: 'the original, unenhanced clip is on his page, posted 4 minutes earlier', ru: 'исходный клип без обработки лежит у него же, выложен на 4 минуты раньше', kk: 'өңделмеген түпнұсқа сол бетте, 4 минут ерте жарияланған' } }
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
          label: { en: 'volunteer\'s own phone, twice', ru: 'телефон самого волонтёра, дважды', kk: 'волонтёрдің өз телефоны, екі рет' } }, atoms: [
          { id: 's_zero', label: { en: 'both versions uploaded from the same phone, four minutes apart', ru: 'обе версии загружены с одного телефона с разницей в четыре минуты', kk: 'екі нұсқа да бір телефоннан, төрт минут айырмамен' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 'r_origin', text: {
          en: 'The unprocessed original is on the same page, four minutes older. The AI traces the detector found are the enhancement, not the event.',
          ru: 'Необработанный оригинал лежит на той же странице, на четыре минуты старше. Следы ИИ, которые нашёл детектор, — это улучшение, а не событие.',
          kk: 'Өңделмеген түпнұсқа сол бетте, төрт минутқа ескі. Детектор тапқан ЖИ іздері — жақсарту, оқиға емес.'
        }, confirms: true, pivotal: true },
        { a: 'c_place', b: 'g_terrain', text: {
          en: 'The roofline is Bestobe. The video is where it says it is.',
          ru: 'Линия крыш — это Бестөбе. Видео оттуда, откуда заявлено.',
          kk: 'Шатыр сызығы — Бестөбе. Видео айтылған жерден.'
        }, confirms: true }
      ],
      senim: { conf: 94, verdict: 'fake', part: 'photo', line: {
        en: 'Trust index 94%. Generative model fingerprints present throughout the frame. Assessment: SYNTHETIC. Recommend: fake.',
        ru: 'Индекс доверия 94%. По всему кадру присутствуют отпечатки генеративной модели. Оценка: СИНТЕТИКА. Рекомендация: фейк.',
        kk: 'Сенім индексі 94%. Кадр бойында генеративті модель іздері бар. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'real' },
      lesson: 'detector_false_positive',
      effect: { stand: { speedup: ['bestobe', 'aqsu'] }, kill: {} },
      sets: { right: ['boats_came'], wrongFake: ['volunteer_silenced'] },
      outcomes: {
        right: { en: 'Every pixel had been touched by a model, and none of it was a lie. Four more volunteer boats drove north before dawn.',
                 ru: 'Каждого пикселя касалась модель, и ни один из них не был ложью. До рассвета на север уехали ещё четыре волонтёрские лодки.',
                 kk: 'Әр пикселге модель тиген, бірақ ешқайсысы өтірік емес. Таңға дейін тағы төрт қайық келді.' },
        wrongFake: { en: 'The traces were real and the rescue was too. He had used the enhancer so you could read the boat number. He stopped posting.',
                 ru: 'Следы были настоящими, и спасение тоже. Он включил улучшайзер, чтобы ты смог прочитать номер лодки. Он перестал постить.',
                 kk: 'Іздер де шын, құтқару да шын. Ол қайық нөмірі оқылсын деп жақсартқышты қосқан. Ол жазуды қойды.' },
        partial: { en: 'You called the footage doctored and let the rescue stand. Half right — the enhancement was real, the event was not doctored.',
                 ru: 'Ты назвал запись обработанной и оставил спасение в силе. Наполовину верно: обработка была, событие подделано не было.',
                 kk: 'Сен жазбаны өңделген дедің, құтқаруды қалдырдың. Жартылай дұрыс.' },
        wrongUnsure: { en: 'You held. The original was four minutes up the same page.',
                 ru: 'Ты воздержался. Оригинал лежал на четыре минуты выше на той же странице.',
                 kk: 'Сен тежедің. Түпнұсқа сол беттің төрт минут жоғарысында жатты.' },
        missed: { en: 'Never opened. It spread as "probably AI" and died by morning.',
                 ru: 'Так и не открыл. Разошлось с ярлыком «наверное ИИ» и умерло к утру.',
                 kk: 'Ашылмады. «Бәлкім ЖИ» деген белгімен өлді.' }
      }
    },

    /* --- а вот теперь и правда подделка --- */
    {
      vid: 'actually_fake',
      handle: '@help_sko_now', shares: 31000, velocity: 'explosive',
      social: {
        name: 'Помощь СКО СРОЧНО', avatar: 'ПС', hue: 5, verified: false,
        age: { en: 'joined 2 days ago', ru: 'каналу 2 дня', kk: 'арнаға 2 күн' },
        time: '01:22', edited: '01:44', fwd: null,
        likes: 14000, comments: 340, views: 402000,
        commentList: [
          { who: 'batyr_98', kind: 'local', text: {
            en: 'boat 4 is on the other side of the district right now. this is not us',
            ru: 'лодка 4 сейчас на другом конце района. это не мы',
            kk: '4-қайық қазір ауданның арғы шетінде. бұл біз емес' } },
          { who: 'dzhamilya_b', kind: 'doubt', text: {
            en: 'card number in the caption. always the card number',
            ru: 'номер карты в подписи. всегда этот номер карты',
            kk: 'жазбада карта нөмірі. әрқашан карта нөмірі' } }
        ]
      },
      media: { kind: 'video', art: 'rescue' }, image: 'assets/rescue_night.jpg',
      text: {
        en: 'Boat 4 pulling a family off a roof near Bestobe RIGHT NOW. Volunteers need fuel — details in the caption.',
        ru: 'Лодка 4 снимает семью с крыши под Бестөбе ПРЯМО СЕЙЧАС. Волонтёрам нужно топливо — реквизиты в подписи.',
        kk: '4-қайық ДӘЛ ҚАЗІР Бестөбе маңында отбасын алып жатыр. Волонтёрлерге жанармай керек — деректемелер жазбада.'
      },
      why: {
        en: 'Confirm it and volunteer boats redirect to a place where nothing is happening.',
        ru: 'Подтвердишь — волонтёрские лодки поедут туда, где ничего не происходит.',
        kk: 'Растасаң, қайықтар ештеңе болмай жатқан жерге кетеді.'
      },
      claimAtoms: [
        { id: 'c_time',  label: { en: 'time: right now', ru: 'время: прямо сейчас', kk: 'уақыты: дәл қазір' } },
        { id: 'c_media', label: { en: 'attached: this video', ru: 'приложено: это видео', kk: 'қоса: осы видео' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '96%' }, atoms: [
          { id: 'r_origin', label: { en: 'same clip circulated during a flood in another country in 2023', ru: 'тот же клип ходил во время наводнения в другой стране в 2023', kk: 'дәл сол клип 2023 жылы басқа елдегі тасқында жүрген' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: Bestobe', ru: 'заявлено: Бестөбе', kk: 'мәлімделген: Бестөбе' },
          b: { en: 'video: pine forest, hills', ru: 'на видео: сосны, холмы', kk: 'видеода: қарағай, төбелер' } }, atoms: [
          { id: 'g_terrain', label: { en: 'pine forest and hills behind the roof — Bestobe has neither', ru: 'сосны и холмы за крышей — в Бестөбе нет ни того ни другого', kk: 'шатыр артында қарағай мен төбе — Бестөбеде екеуі де жоқ' } }
        ]},
        time: { blind: true, note: {
          en: 'Night, artificial light. Nothing seasonal to read.',
          ru: 'Ночь, искусственный свет. Сезонных признаков не прочитать.',
          kk: 'Түн, жасанды жарық. Маусымдық белгі жоқ.'
        }},
        tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
          label: { en: 'channel: 2 days old, payment details', ru: 'канал: 2 дня, реквизиты для оплаты', kk: 'арна: 2 күндік, төлем деректемелері' } }, atoms: [
          { id: 's_zero', label: { en: 'the same card number appears under three unrelated disasters', ru: 'тот же номер карты стоит под тремя не связанными бедствиями', kk: 'дәл сол карта нөмірі үш түрлі апаттың астында тұр' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 'g_terrain', text: {
          en: 'Pine forest and hills. Bestobe stands on flat steppe with no trees taller than a fence.',
          ru: 'Сосновый лес и холмы. Бестөбе стоит на ровной степи, и деревьев выше забора там нет.',
          kk: 'Қарағай орманы мен төбелер. Бестөбе тегіс далада тұр.'
        }, pivotal: true },
        { a: 'c_time', b: 'r_origin', text: {
          en: 'The clip is from another country, two years ago. The card number under it has collected for three different disasters.',
          ru: 'Клип из другой страны, двухлетней давности. Номер карты под ним собирал уже на три разные беды.',
          kk: 'Клип басқа елден, екі жыл бұрынғы. Астындағы карта нөмірі үш апатқа жинаған.'
        }}
      ],
      senim: { conf: 72, verdict: 'fake', part: 'photo', line: {
        en: 'Trust index 72%. Compression artefacts consistent with re-encoding. Recommend: fake image, claim undetermined.',
        ru: 'Индекс доверия 72%. Артефакты сжатия соответствуют перекодированию. Рекомендация: фейковое изображение, заявление не установлено.',
        kk: 'Сенім индексі 72%. Қайта кодтау белгілері. Ұсыныс: сурет жалған, мәлімдеме анықталмады.'
      }},
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { speedup: ['bestobe', 'aqsu'] }, kill: {} },
      sets: { right: ['scam_caught'] },
      outcomes: {
        right: { en: 'Another country, two years ago, and a card number that has collected for three disasters. The boats stayed where they were needed.',
                 ru: 'Другая страна, два года назад и номер карты, собиравший уже на три беды. Лодки остались там, где были нужны.',
                 kk: 'Басқа ел, екі жыл бұрын, үш апатқа жинаған карта нөмірі. Қайықтар керек жерде қалды.' },
        partial: { en: 'You flagged the video and let the appeal stand. The boats went to a place where nothing was happening.',
                 ru: 'Ты отметил видео и оставил призыв в силе. Лодки уехали туда, где ничего не происходило.',
                 kk: 'Сен видеоны белгіледің, үндеуді қалдырдың. Қайықтар ештеңе болмаған жерге кетті.' },
        wrongTrue: { en: 'You confirmed it. Two boats drove to a village where the water had not risen, and the money went to a card in another country.',
                 ru: 'Ты подтвердил. Две лодки уехали в посёлок, где вода не поднималась, а деньги ушли на карту в другой стране.',
                 kk: 'Сен растадың. Екі қайық су көтерілмеген ауылға кетті, ақша шетелдегі картаға түсті.' },
        wrongUnsure: { en: 'You held on an appeal for money. Holding is free for you and expensive for the people who sent it.',
                 ru: 'Ты воздержался по сбору денег. Воздержаться тебе ничего не стоило, а тем, кто перевёл, — стоило.',
                 kk: 'Сен ақша жинауға тежедің. Саған тегін, ақша аударғандарға — қымбат.' },
        missed: { en: 'Never opened. The card number was still working at dawn.',
                 ru: 'Так и не открыл. Номер карты работал и на рассвете.',
                 kk: 'Ашылмады. Карта нөмірі таңға дейін жұмыс істеді.' }
      }
    },

    /* --- спасение настоящее, но не здесь --- */
    {
      vid: 'wrong_place',
      handle: '@sko_online', shares: 24000, velocity: 'explosive',
      social: {
        name: 'СКО Онлайн', avatar: 'СО', hue: 210, verified: false,
        age: { en: 'joined 3 years ago', ru: 'каналу 3 года', kk: 'арнаға 3 жыл' },
        time: '01:21', edited: null,
        fwd: { en: 'Forwarded from Pavlodar Emergency', ru: 'Переслано из Павлодар ЧС', kk: 'Павлодар ТЖ арнасынан жіберілді' },
        likes: 6100, comments: 140, views: 233000,
        commentList: [
          { who: 'dzhamilya_b', kind: 'local', text: {
            en: 'the forward header still says Pavlodar. nobody reads those',
            ru: 'в шапке пересылки так и написано «Павлодар». их никто не читает',
            kk: 'жіберу тақырыбында «Павлодар» тұр. оны ешкім оқымайды' } },
          { who: 'nurik_2007', kind: 'doubt', text: {
            en: 'so is boat 4 here or not? my mother is asking',
            ru: 'так лодка 4 у нас или нет? мама спрашивает',
            kk: 'сонда 4-қайық бізде ме, жоқ па? анам сұрап жатыр' } }
        ]
      },
      media: { kind: 'video', art: 'rescue' }, image: 'assets/rescue_night.jpg',
      text: {
        en: 'Boat 4 is working near Bestobe tonight — rescuers taking a family off a roof.',
        ru: 'Лодка 4 работает под Бестөбе этой ночью — спасатели снимают семью с крыши.',
        kk: 'Бүгін түнде 4-қайық Бестөбе маңында жұмыс істеп жатыр — құтқарушылар отбасын шатырдан алуда.'
      },
      why: {
        en: 'If volunteers believe boats are already working Bestobe, they will drive somewhere else.',
        ru: 'Если волонтёры поверят, что в Бестөбе уже работают лодки, они поедут в другое место.',
        kk: 'Волонтёрлер Бестөбеде қайық бар деп сенсе, олар басқа жаққа кетеді.'
      },
      claimAtoms: [
        { id: 'c_place', label: { en: 'place: near Bestobe', ru: 'место: под Бестөбе', kk: 'орны: Бестөбе маңы' } },
        { id: 'c_event', label: { en: 'event: rescue under way', ru: 'событие: идёт спасение', kk: 'оқиға: құтқару жүріп жатыр' } }
      ],
      tools: {
        reverse: { blind: false, atoms: [
          { id: 'r_origin', label: { en: 'first published by Pavlodar Emergency, tonight, 40 minutes ago', ru: 'первым опубликовал Павлодар ЧС, сегодня, 40 минут назад', kk: 'алғаш Павлодар ТЖ жариялады, бүгін, 40 минут бұрын' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: Bestobe', ru: 'заявлено: Бестөбе', kk: 'мәлімделген: Бестөбе' },
          b: { en: 'video: Pavlodar region', ru: 'на видео: Павлодарская область', kk: 'видеода: Павлодар облысы' } }, atoms: [
          { id: 'g_terrain', label: { en: 'the grain elevator behind the roof is the Pavlodar one', ru: 'элеватор за крышей — павлодарский', kk: 'шатыр артындағы элеватор — павлодарлық' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: false,
          label: { en: 'tonight — consistent', ru: 'сегодня ночью — сходится', kk: 'бүгін түнде — сәйкес' } }, atoms: [
          { id: 't_season', label: { en: 'sleet and bare branches — this really is tonight', ru: 'мокрый снег и голые ветки — это правда сегодня', kk: 'сылапан мен жалаңаш бұтақ — бұл шынымен бүгін' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: true,
          label: { en: 'real footage · wrong caption', ru: 'настоящая запись · чужая подпись', kk: 'шын жазба · бөтен жазба' } }, atoms: [
          { id: 's_zero', label: { en: 'the forward header still reads "Pavlodar Emergency"', ru: 'в шапке пересылки по-прежнему написано «Павлодар ЧС»', kk: 'жіберу тақырыбында әлі «Павлодар ТЖ» тұр' } }
        ]}
      },
      findings: [
        { a: 'c_place', b: 'g_terrain', text: {
          en: 'That elevator is in Pavlodar region. The rescue is real, the people on the roof are real, and they are four hundred kilometres away.',
          ru: 'Этот элеватор в Павлодарской области. Спасение настоящее, люди на крыше настоящие, и они за четыреста километров отсюда.',
          kk: 'Бұл элеватор Павлодар облысында. Құтқару шын, шатырдағы адамдар шын — тек төрт жүз шақырым жерде.'
        }, pivotal: true },
        { a: 'c_event', b: 's_zero', text: {
          en: 'The forward header was never removed. Nobody faked anything — somebody typed a different place under a true video.',
          ru: 'Шапку пересылки так и не убрали. Никто ничего не подделывал — кто-то подписал под настоящим видео другое место.',
          kk: 'Жіберу тақырыбы алынбаған. Ешкім ештеңе жасамаған — шын видеоның астына басқа жер жазылған.'
        }}
      ],
      senim: { conf: 85, verdict: 'real', line: {
        en: 'Trust index 85%. Footage authentic, no manipulation detected, timestamp consistent. Recommend: true.',
        ru: 'Индекс доверия 85%. Запись подлинная, манипуляций не обнаружено, время сходится. Рекомендация: правда.',
        kk: 'Сенім индексі 85%. Жазба шын, өңдеу жоқ, уақыт сәйкес. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      /* Видео подлинное — ложно то, что оно про Бестөбе.
         Верный ход: ФЕЙК → сама новость. */
      truth: { claim: 'fake', photo: 'real' },
      effect: { stand: { speedup: ['bestobe', 'aqsu'] }, kill: {} },
      sets: { right: ['caption_caught'] },
      outcomes: {
        right: { en: 'A true video with a false address. You gave it back its own name, and the volunteers kept driving to Bestobe, where nobody had come yet.',
                 ru: 'Настоящее видео с ложным адресом. Ты вернул ему собственное имя, и волонтёры поехали в Бестөбе, куда ещё никто не приехал.',
                 kk: 'Жалған мекенжайлы шын видео. Сен оған өз атын қайтардың.' },
        wrongTrue: { en: 'You confirmed that boats were already working Bestobe. Two volunteer crews turned around. Nobody had come to Bestobe at all.',
                 ru: 'Ты подтвердил, что в Бестөбе уже работают лодки. Две волонтёрские бригады развернулись. В Бестөбе не приехал вообще никто.',
                 kk: 'Сен Бестөбеде қайық бар деп растадың. Екі бригада кері бұрылды.' },
        partial: { en: 'You called the footage itself fake. It was genuine — filmed tonight, by rescuers, of a real family. Only the address was wrong.',
                 ru: 'Ты назвал фейком саму запись. Она подлинная — снята сегодня, спасателями, о настоящей семье. Ложным был только адрес.',
                 kk: 'Сен жазбаның өзін жалған дедің. Ол шын — бүгін түсірілген. Тек мекенжайы жалған.' },
        wrongUnsure: { en: 'You held. The forward header said Pavlodar in plain text at the top of the post.',
                 ru: 'Ты воздержался. Шапка пересылки открытым текстом говорила «Павлодар» в самом верху поста.',
                 kk: 'Сен тежедің. Жіберу тақырыбы посттың басында «Павлодар» деп тұрды.' },
        missed: { en: 'Never opened. Volunteers read it as good news and drove elsewhere.',
                 ru: 'Так и не открыл. Волонтёры прочитали это как хорошую новость и поехали в другое место.',
                 kk: 'Ашылмады. Волонтёрлер оны жақсы жаңалық деп оқып, басқа жаққа кетті.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 6 · ГОЛОС ВЛАСТИ, КОТОРЫЙ ОСТАНАВЛИВАЕТ ВСЕХ
     Аким не говорил этого ни в одном варианте: это функция
     акта. Меняется способ подделки — и каждый из них сегодня
     существует по-настоящему.
     ========================================================== */

  V('akim_deepfake', [

    /* --- настоящее видео, подменённый звук --- */
    {
      vid: 'voice_swap',
      handle: '@sko_segodnya', shares: 28000, velocity: 'explosive',
      social: {
        name: 'СКО Сегодня', avatar: 'СС', hue: 215, verified: false,
        age: { en: 'joined 8 months ago', ru: 'каналу 8 месяцев', kk: 'арнаға 8 ай' },
        time: '00:46', edited: null, fwd: null,
        likes: 6700, comments: 190, views: 344000,
        commentList: [
          { who: 'aliya_zh', kind: 'doubt', text: {
            en: 'his mouth does not match the words. watch it with sound off',
            ru: 'губы не совпадают со словами. посмотрите без звука',
            kk: 'ерні сөзбен сәйкес емес. дыбыссыз қараңдар' } },
          { who: 'kairat_777', kind: 'bot', text: {
            en: 'The akim said it, so that is that 👍',
            ru: 'Аким сказал — значит так и есть 👍',
            kk: 'Әкім айтты — солай болғаны 👍' } }
        ]
      },
      media: { kind: 'video', art: 'portrait' }, image: 'assets/akim_still.jpg',
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
        reverse: { blind: false, vis: { kind: 'split', pct: '99%' }, atoms: [
          { id: 'r_origin', label: { en: 'the same footage exists with different audio: a road-repair briefing in June', ru: 'та же запись существует с другим звуком: брифинг о ремонте дорог в июне', kk: 'дәл сол жазба басқа дыбыспен бар: маусымдағы жол жөндеу брифингі' } }
        ]},
        geo: { blind: false, atoms: [
          { id: 'g_terrain', label: { en: 'the room is the akim\'s real office', ru: 'кабинет — настоящий кабинет акима', kk: 'бөлме — әкімнің нағыз кабинеті' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'daylight in the window at 00:50', ru: 'дневной свет в окне в 00:50', kk: '00:50-да терезеде күндізгі жарық' } }, atoms: [
          { id: 't_season', label: { en: 'summer leaves in the window — it is March, and it is night', ru: 'летняя листва в окне — сейчас март, и сейчас ночь', kk: 'терезеде жазғы жапырақ — қазір наурыз әрі түн' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: false,
          label: { en: 'audio replaced, video reused', ru: 'звук подменён, видео переиспользовано', kk: 'дыбыс ауыстырылған, видео қайта қолданылған' } }, atoms: [
          { id: 's_zero', label: { en: 'lip movement desynchronises from 00:04 onward', ru: 'артикуляция расходится со звуком начиная с 00:04', kk: 'ерін қимылы 00:04-тен бастап дыбыспен сәйкес келмейді' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 'r_origin', text: {
          en: 'The same twenty-two seconds exist with different audio — a road-repair briefing in June. The man is real, the office is real, the sentence is not his.',
          ru: 'Те же двадцать две секунды существуют с другим звуком — июньский брифинг о ремонте дорог. Человек настоящий, кабинет настоящий, фраза не его.',
          kk: 'Дәл сол жиырма екі секунд басқа дыбыспен бар — маусымдағы жол жөндеу брифингі. Адам шын, кабинет шын, сөйлем оныкі емес.'
        }, pivotal: true },
        { a: 'c_media', b: 't_season', text: {
          en: 'Summer leaves in the window on a March night. The footage was never from tonight to begin with.',
          ru: 'Летняя листва в окне мартовской ночью. Запись изначально не сегодняшняя.',
          kk: 'Наурыз түнінде терезеде жазғы жапырақ. Жазба бастапқыда бүгінгі емес.'
        }},
        { a: 'c_src', b: 's_zero', text: {
          en: 'From the fourth second the lips stop agreeing with the words. Watch it once with the sound off and you cannot unsee it.',
          ru: 'С четвёртой секунды губы перестают сходиться со словами. Посмотри один раз без звука — и уже не развидишь.',
          kk: 'Төртінші секундтан ерін сөзбен сәйкес келмейді. Бір рет дыбыссыз қара — енді көрмей тұра алмайсың.'
        }}
      ],
      senim: { conf: 96, verdict: 'real', line: {
        en: 'Trust index 96%. Facial geometry authentic, lighting consistent, no frame-level manipulation. Recommend: true.',
        ru: 'Индекс доверия 96%. Геометрия лица подлинная, освещение согласовано, покадровых манипуляций нет. Рекомендация: правда.',
        kk: 'Сенім индексі 96%. Бет геометриясы шын, жарық сәйкес, кадрлық өңдеу жоқ. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: 'all' }, kill: {} },
      sets: { right: ['deepfake_caught'], wrongTrue: ['panic_high', 'coordinated'] },
      outcomes: {
        right: { en: 'The face was his, the office was his, the sentence was not. The evacuation kept moving and nobody turned back.',
                 ru: 'Лицо было его, кабинет был его, фраза — нет. Эвакуация не остановилась, и никто не повернул назад.',
                 kk: 'Беті де, кабинеті де оныкі, сөйлем — жоқ. Эвакуация тоқтаған жоқ.' },
        wrongTrue: { en: 'The detector checked the face and the face was real. Nobody checked the mouth. Every village that was moving stopped moving.',
                 ru: 'Детектор проверил лицо, и лицо было настоящим. Рот не проверил никто. Все посёлки, которые уезжали, встали.',
                 kk: 'Детектор бетті тексерді, бет шын еді. Ауызды ешкім тексермеді.' },
        wrongUnsure: { en: 'You held. Three villages downstream were waiting for someone to say this out loud.',
                 ru: 'Ты воздержался. Три посёлка ниже по течению ждали, чтобы кто-нибудь сказал это вслух.',
                 kk: 'Сен тежедің. Үш ауыл біреу дауыстап айтқанын күтті.' },
        missed: { en: 'Never opened. It ran until the akim\'s office woke up at 04:10.',
                 ru: 'Так и не открыл. Шло, пока в 04:10 не проснулся аппарат акима.',
                 kk: 'Ашылмады. Әкім аппараты 04:10-де оянды.' }
      }
    },

    /* --- настоящее старое видео под новой подписью --- */
    {
      vid: 'old_reused',
      handle: '@region_arkhiv', shares: 21000, velocity: 'rising',
      social: {
        name: 'Регион Архив', avatar: 'РА', hue: 40, verified: false,
        age: { en: 'joined 2 years ago', ru: 'каналу 2 года', kk: 'арнаға 2 жыл' },
        time: '00:48', edited: '01:02', fwd: null,
        likes: 4900, comments: 133, views: 259000,
        commentList: [
          { who: 'aliya_zh', kind: 'local', text: {
            en: 'he has a different tie in tonight\'s briefing. this is from the spring one',
            ru: 'на сегодняшнем брифинге у него другой галстук. это с весеннего',
            kk: 'бүгінгі брифингте галстугі басқа. бұл көктемгіден' } },
          { who: 'kairat_777', kind: 'bot', text: {
            en: 'Everything is under control, sleep well everyone',
            ru: 'Всё под контролем, всем спокойной ночи',
            kk: 'Бәрі бақылауда, бәріне тыныш түн' } }
        ]
      },
      media: { kind: 'video', art: 'portrait' }, image: 'assets/akim_still.jpg',
      text: {
        en: 'The akim: "The situation is under control. There is no evacuation." Recorded an hour ago.',
        ru: 'Аким: «Ситуация под контролем. Никакой эвакуации нет». Записано час назад.',
        kk: 'Әкім: «Жағдай бақылауда. Ешқандай эвакуация жоқ». Бір сағат бұрын жазылған.'
      },
      why: {
        en: 'If this stands, every village that is moving stops moving.',
        ru: 'Если это устоит, все посёлки, которые уезжают, встанут.',
        kk: 'Бұл қалса, кетіп жатқан ауылдардың бәрі тоқтайды.'
      },
      claimAtoms: [
        { id: 'c_time',  label: { en: 'time: recorded an hour ago', ru: 'время: записано час назад', kk: 'уақыты: бір сағат бұрын жазылған' } },
        { id: 'c_src',   label: { en: 'who: the district akim', ru: 'кто: аким района', kk: 'кім: аудан әкімі' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '100%' }, atoms: [
          { id: 'r_origin', label: { en: 'identical file published in April — a briefing about spring meltwater', ru: 'идентичный файл опубликован в апреле — брифинг о весеннем паводке', kk: 'дәл сол файл сәуірде жарияланған — көктемгі су туралы брифинг' } }
        ]},
        geo: { blind: false, atoms: [
          { id: 'g_terrain', label: { en: 'the room is the akim\'s real office', ru: 'кабинет — настоящий кабинет акима', kk: 'бөлме — әкімнің нағыз кабинеті' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'summer leaves, and a different tie', ru: 'летняя листва и другой галстук', kk: 'жазғы жапырақ әрі басқа галстук' } }, atoms: [
          { id: 't_season', label: { en: 'green leaves in the window; tonight\'s briefing shows a different tie', ru: 'зелёная листва в окне; на сегодняшнем брифинге другой галстук', kk: 'терезеде жасыл жапырақ; бүгінгі брифингте басқа галстук' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
          label: { en: 'archive file, new caption', ru: 'архивный файл, новая подпись', kk: 'мұрағат файлы, жаңа жазба' } }, atoms: [
          { id: 's_zero', label: { en: 'the file hash matches the April upload exactly — not one frame differs', ru: 'хеш файла в точности совпадает с апрельской загрузкой — не отличается ни один кадр', kk: 'файл хэші сәуірдегімен дәл келеді — бірде-бір кадр өзгеше емес' } }
        ]}
      },
      findings: [
        { a: 'c_time', b: 's_zero', text: {
          en: 'Not one frame differs from the April file. Nothing was generated, nothing was edited — the caption did all the work.',
          ru: 'Ни один кадр не отличается от апрельского файла. Ничего не генерировали и не монтировали — всю работу сделала подпись.',
          kk: 'Сәуірдегі файлдан бірде-бір кадр өзгеше емес. Ештеңе жасалмаған — бүкіл жұмысты жазба істеген.'
        }, pivotal: true },
        { a: 'c_time', b: 't_season', text: {
          en: 'Green leaves in the window and a tie he is not wearing tonight. April, not an hour ago.',
          ru: 'Зелёная листва в окне и галстук, которого на нём сегодня нет. Апрель, а не час назад.',
          kk: 'Терезеде жасыл жапырақ әрі бүгін тағып жүрмеген галстук. Сәуір, бір сағат бұрын емес.'
        }}
      ],
      senim: { conf: 90, verdict: 'real', line: {
        en: 'Trust index 90%. Authentic recording, verified speaker, no synthetic markers. Recommend: true.',
        ru: 'Индекс доверия 90%. Подлинная запись, спикер верифицирован, синтетических маркеров нет. Рекомендация: правда.',
        kk: 'Сенім индексі 90%. Шын жазба, спикер расталған, синтетика белгісі жоқ. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: 'all' }, kill: {} },
      sets: { right: ['deepfake_caught'], wrongTrue: ['panic_high'] },
      outcomes: {
        right: { en: 'No deepfake, no edit, no generated pixel. An old file and a new sentence under it — the cheapest lie there is, and the hardest for a detector to see.',
                 ru: 'Ни дипфейка, ни монтажа, ни одного сгенерированного пикселя. Старый файл и новая фраза под ним — самая дешёвая ложь, какая бывает, и самая незаметная для детектора.',
                 kk: 'Дипфейк те, монтаж да, жасалған пиксель де жоқ. Ескі файл мен астындағы жаңа сөйлем.' },
        wrongTrue: { en: 'Everything the detector could measure was authentic, because everything was. The lie was in the caption, and captions have no pixels to check.',
                 ru: 'Всё, что детектор мог измерить, оказалось подлинным, потому что таким и было. Ложь была в подписи, а у подписей нет пикселей для проверки.',
                 kk: 'Детектор өлшей алатынның бәрі шын болды. Өтірік жазбада еді, ал жазбада тексеретін пиксель жоқ.' },
        wrongUnsure: { en: 'You held. The file hash was identical to an April upload and that was the whole answer.',
                 ru: 'Ты воздержался. Хеш файла в точности совпадал с апрельской загрузкой — в этом и был весь ответ.',
                 kk: 'Сен тежедің. Файл хэші сәуірдегімен бірдей еді — бүкіл жауап осында.' },
        missed: { en: 'Never opened. An April video ran as tonight\'s until 04:10.',
                 ru: 'Так и не открыл. Апрельское видео шло как сегодняшнее до 04:10.',
                 kk: 'Ашылмады. Сәуірдегі видео 04:10-ға дейін бүгінгі болып жүрді.' }
      }
    },

    /* --- только звук: «запись разговора» --- */
    {
      vid: 'audio_only',
      handle: '@slito_sko', shares: 34000, velocity: 'explosive',
      social: {
        name: 'СЛИТО СКО', avatar: 'СЛ', hue: 280, verified: false,
        age: { en: 'joined 4 days ago', ru: 'каналу 4 дня', kk: 'арнаға 4 күн' },
        time: '00:44', edited: null, fwd: null,
        likes: 11000, comments: 420, views: 511000,
        commentList: [
          { who: 'aliya_zh', kind: 'doubt', text: {
            en: 'a "leaked call" with no background noise at all. in an office. at night',
            ru: '«слитый разговор» вообще без фонового шума. в кабинете. ночью',
            kk: 'фондық шуы мүлде жоқ «жария болған әңгіме». кабинетте. түнде' } },
          { who: 'insider_kz', kind: 'bot', text: {
            en: 'THEY ARE HIDING IT FROM US 🚨 LISTEN BEFORE DELETED',
            ru: 'ОТ НАС ЭТО СКРЫВАЮТ 🚨 СЛУШАЙТЕ ПОКА НЕ УДАЛИЛИ',
            kk: 'БҰНЫ БІЗДЕН ЖАСЫРЫП ЖАТЫР 🚨 ӨШІРІЛГЕНШЕ ТЫҢДАҢДАР' } }
        ]
      },
      media: { kind: 'none', art: null }, image: null,
      text: {
        en: 'LEAKED: a recording of the akim on the phone — "no evacuation tonight, we are not going to frighten people over nothing".',
        ru: 'СЛИТО: запись телефонного разговора акима — «эвакуации сегодня не будет, не будем пугать людей на пустом месте».',
        kk: 'ЖАРИЯ БОЛДЫ: әкімнің телефон әңгімесінің жазбасы — «бүгін эвакуация болмайды, адамдарды бекер қорқытпаймыз».'
      },
      why: {
        en: 'If this stands, every village that is moving stops moving.',
        ru: 'Если это устоит, все посёлки, которые уезжают, встанут.',
        kk: 'Бұл қалса, кетіп жатқан ауылдардың бәрі тоқтайды.'
      },
      claimAtoms: [
        { id: 'c_src',   label: { en: 'who: the district akim, allegedly', ru: 'кто: якобы аким района', kk: 'кім: әкім деп айтылады' } },
        { id: 'c_event', label: { en: 'event: evacuation cancelled', ru: 'событие: эвакуация отменена', kk: 'оқиға: эвакуация тоқтатылды' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'Audio only. There is no image to search — and that is precisely why this format was chosen.',
          ru: 'Только звук. Искать нечего — и именно поэтому выбран такой формат.',
          kk: 'Тек дыбыс. Іздейтін сурет жоқ — дәл сол себепті осы формат таңдалған.'
        }},
        geo: { blind: true, note: { en: 'No image. Nothing to locate.', ru: 'Изображения нет. Локализовать нечего.', kk: 'Сурет жоқ.' }},
        time: { blind: false, atoms: [
          { id: 't_stamp', label: { en: 'zero background noise — no room, no line hiss, no breath', ru: 'нулевой фоновый шум — ни комнаты, ни шипения линии, ни дыхания', kk: 'фондық шу мүлде жоқ — бөлме де, желі шуы да, тыныс та жоқ' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
          label: { en: 'channel: 4 days old · "leaks" only', ru: 'канал: 4 дня · только «сливы»', kk: 'арна: 4 күндік · тек «жария»' } }, atoms: [
          { id: 's_zero', label: { en: 'the akim mispronounces the name of his own district', ru: 'аким неверно произносит название собственного района', kk: 'әкім өз ауданының атын қате айтады' } }
        ]}
      },
      findings: [
        { a: 'c_src', b: 's_zero', text: {
          en: 'He mispronounces the name of his own district — stress on the wrong syllable, the way a stranger would read it off a page. A voice model reads; it does not remember.',
          ru: 'Он неверно произносит название собственного района — ударение не туда, как прочёл бы чужой человек с листа. Голосовая модель читает; она не помнит.',
          kk: 'Ол өз ауданының атын қате айтады — екпін басқа буында, бөгде адам қағаздан оқығандай. Дауыс моделі оқиды; ол есінде сақтамайды.'
        }, pivotal: true },
        { a: 'c_event', b: 't_stamp', text: {
          en: 'No room tone, no line hiss, no breath between sentences. Real phone recordings are dirty. This one was born clean.',
          ru: 'Ни звука комнаты, ни шипения линии, ни вдоха между фразами. Настоящие телефонные записи грязные. Эта родилась чистой.',
          kk: 'Бөлме шуы да, желі сылдыры да, тыныс та жоқ. Шын телефон жазбалары лас болады. Бұл таза туған.'
        }}
      ],
      senim: { conf: 88, verdict: 'real', line: {
        en: 'Trust index 88%. Voice biometrics match the public speech corpus of the named official. Recommend: true.',
        ru: 'Индекс доверия 88%. Голосовая биометрия совпадает с корпусом публичных выступлений названного должностного лица. Рекомендация: правда.',
        kk: 'Сенім индексі 88%. Дауыс биометриясы аталған лауазымды тұлғаның сөздер корпусына сәйкес. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: 'all' }, kill: {} },
      sets: { right: ['deepfake_caught'], wrongTrue: ['panic_high', 'coordinated'] },
      outcomes: {
        right: { en: 'It matched his voice because it was built from his voice. It did not match his mouth: nobody mispronounces the place they were born.',
                 ru: 'Голос совпал, потому что был собран из его голоса. Речь не совпала: никто не коверкает название места, где родился.',
                 kk: 'Дауыс сәйкес келді, себебі оның дауысынан жасалған. Сөзі сәйкес келмеді.' },
        wrongTrue: { en: 'Voice biometrics matched at 88%, and you agreed. A model trained on his speeches will always match his speeches.',
                 ru: 'Голосовая биометрия совпала на 88%, и ты согласился. Модель, обученная на его выступлениях, всегда будет совпадать с его выступлениями.',
                 kk: 'Дауыс биометриясы 88% сәйкес келді, сен келістің. Оның сөздерінен үйретілген модель әрқашан сәйкес келеді.' },
        wrongUnsure: { en: 'You held on a recording with no room in it. Three villages downstream were waiting.',
                 ru: 'Ты воздержался по записи, в которой нет комнаты. Три посёлка ниже по течению ждали.',
                 kk: 'Сен бөлмесі жоқ жазбаға тежедің. Төмендегі үш ауыл күтті.' },
        missed: { en: 'Never opened. An audio file with no face ran faster than any video that night.',
                 ru: 'Так и не открыл. Аудиофайл без лица разошёлся быстрее любого видео этой ночью.',
                 kk: 'Ашылмады. Бетсіз аудиофайл кез келген видеодан жылдам тарады.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 7 · КОГДА «НЕ ЗНАЮ» — ЕДИНСТВЕННЫЙ ЧЕСТНЫЙ ОТВЕТ
     Заявление неразрешимо во всех вариантах: это функция акта
     и единственное место в игре, где воздержаться — работа.
     ========================================================== */

  V('togyzaq', [

    /* --- два голоса, но оба переписали один и тот же пост --- */
    {
      vid: 'echo',
      handle: '@nurlan_t', shares: 7300, velocity: 'rising',
      social: {
        name: 'Nurlan T.', avatar: 'N', hue: 45, verified: false,
        age: { en: 'joined 6 years ago', ru: 'аккаунту 6 лет', kk: 'аккаунтқа 6 жыл' },
        time: '02:25', edited: null, fwd: null,
        likes: 4200, comments: 96, views: 58000,
        commentList: [
          { who: 'madina.k', kind: 'local', text: {
            en: 'two people are saying it now. does that make it two sources?',
            ru: 'уже двое пишут. это считается за два источника?',
            kk: 'екеуі жазып жатыр. бұл екі дереккөз бе?' } },
          { who: 'skeptik_kz', kind: 'bot', text: {
            en: 'no photo = it did not happen',
            ru: 'нет фото = не было',
            kk: 'сурет жоқ = болмаған' } }
        ]
      },
      media: { kind: 'none', art: null }, image: null,
      text: {
        en: 'Nobody came to Birlik. Two of us are writing about it now. No boats, no buses. Write about us.',
        ru: 'В Бірлік никто не приехал. Нас уже двое об этом пишет. Ни лодок, ни автобусов. Напишите про нас.',
        kk: 'Бірлікке ешкім келген жоқ. Бұл туралы екеуміз жазып жатырмыз. Қайық та, автобус та жоқ.'
      },
      why: {
        en: 'Two accounts is not two sources if both of them read the same post.',
        ru: 'Два аккаунта — это не два источника, если оба прочитали один и тот же пост.',
        kk: 'Екі аккаунт — екі дереккөз емес, егер екеуі бір постты оқыған болса.'
      },
      claimAtoms: [
        { id: 'c_src',   label: { en: 'source: "two of us"', ru: 'источник: «нас двое»', kk: 'дереккөз: «екеуміз»' } },
        { id: 'c_place', label: { en: 'place: Birlik', ru: 'место: Бірлік', kk: 'орны: Бірлік' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'There is no image. A claim WITHOUT evidence is not the same as a claim with FALSE evidence.',
          ru: 'Изображения нет. Заявление БЕЗ улики — это не то же, что заявление с ЛОЖНОЙ уликой.',
          kk: 'Сурет жоқ. Дәлелсіз мәлімдеме — жалған дәлелді мәлімдеме емес.'
        }},
        geo: { blind: true, note: { en: 'No media. Nothing to locate.', ru: 'Медиа нет. Локализовать нечего.', kk: 'Медиа жоқ.' }},
        time: { blind: true, note: { en: 'No media. No shadows, no weather.', ru: 'Медиа нет. Ни теней, ни погоды.', kk: 'Медиа жоқ.' }},
        tree: { blind: false, vis: { kind: 'tree', hops: 2, good: false,
          label: { en: 'two accounts, one post', ru: 'два аккаунта, один пост', kk: 'екі аккаунт, бір пост' } }, atoms: [
          { id: 's_zero', label: { en: 'the second account quotes the first almost word for word, 9 minutes later', ru: 'второй аккаунт почти дословно повторяет первый через 9 минут', kk: 'екінші аккаунт біріншіні 9 минуттан кейін сөзбе-сөз қайталайды' } }
        ]}
      },
      findings: [
        { a: 'c_src', b: 's_zero', text: {
          en: 'The second person is quoting the first, nine minutes later, almost word for word. Two accounts, one source. It could still be entirely true — you simply cannot establish it.',
          ru: 'Второй человек цитирует первого, через девять минут, почти дословно. Два аккаунта, один источник. Это по-прежнему может быть чистой правдой — просто установить это нельзя.',
          kk: 'Екінші адам біріншіні тоғыз минуттан кейін сөзбе-сөз дерлік қайталайды. Екі аккаунт, бір дереккөз.'
        }, pivotal: true }
      ],
      unresolvable: true,
      senim: { conf: 90, verdict: 'fake', part: 'story', line: {
        en: 'Trust index 90%. Two corroborating sources located, but no media evidence. Emotional register elevated. Recommend: fake.',
        ru: 'Индекс доверия 90%. Найдены два подтверждающих источника, но медиа-доказательств нет. Эмоциональный регистр повышен. Рекомендация: фейк.',
        kk: 'Сенім индексі 90%. Екі растайтын дереккөз бар, бірақ медиа дәлел жоқ. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'unresolved', photo: 'none' },
      effect: { stand: { evacuate: ['togyzaq'] }, kill: {} },
      outcomes: {
        right: { en: 'You marked it unverified and sent it to the duty desk instead of publishing a verdict. At 03:20 a boat reached Birlik. His aunt had been on that roof for five hours.',
                 ru: 'Ты пометил «не установлено» и передал дежурному вместо того, чтобы выносить вердикт. В 03:20 лодка дошла до Бірлік. Тётя просидела на крыше пять часов.',
                 kk: 'Сен «анықталмады» деп дежурныйға бердің. 03:20-де қайық жетті.' },
        wrongFake: { en: 'Yerassyl said fake and you agreed. It was true. He deleted the post at 04:00 and wrote "sorry for lying." He had not lied.',
                 ru: 'Ерасыл сказал фейк, и ты согласился. Это была правда. Он удалил пост в 04:00 и написал «извините что соврал». Он не соврал.',
                 kk: 'Ерасыл жалған деді, сен келістің. Бұл шындық еді.' },
        wrongTrue: { en: 'You confirmed a story you could not check. It happened to be true. Next time it will not be, and you will confirm that one too.',
                 ru: 'Ты подтвердил историю, которую не мог проверить. Она оказалась правдой. В следующий раз не окажется — а ты подтвердишь и её.',
                 kk: 'Сен тексере алмаған оқиғаны растадың. Ол шын болды. Келесіде болмайды.' },
        missed: { en: 'Never opened. At 03:20 a boat reached Birlik anyway. Not because of you.',
                 ru: 'Так и не открыл. В 03:20 лодка всё равно дошла. Не благодаря тебе.',
                 kk: 'Ашылмады. 03:20-де қайық бәрібір жетті. Сенің арқаңда емес.' }
      }
    },

    /* --- фото есть, но оно ничего не устанавливает --- */
    {
      vid: 'with_photo',
      handle: '@nurlan_t', shares: 9800, velocity: 'rising',
      social: {
        name: 'Nurlan T.', avatar: 'N', hue: 45, verified: false,
        age: { en: 'joined 6 years ago', ru: 'аккаунту 6 лет', kk: 'аккаунтқа 6 жыл' },
        time: '02:27', edited: null, fwd: null,
        likes: 5100, comments: 172, views: 88000,
        commentList: [
          { who: 'aigerim_pt', kind: 'doubt', text: {
            en: 'that photo is from daylight. he says it is happening now',
            ru: 'фото дневное. а он пишет что это сейчас',
            kk: 'сурет күндізгі. ал ол қазір деп жазады' } },
          { who: 'madina.k', kind: 'local', text: {
            en: 'wrong photo does not mean his aunt is fine',
            ru: 'не то фото не значит что с его тётей всё хорошо',
            kk: 'қате сурет — апасы аман деген емес' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/village_wide.jpg',
      text: {
        en: 'Nobody came to Birlik. My aunt is on her roof. Here is what it looks like there. Write about us.',
        ru: 'В Бірлік никто не приехал. Тётя на крыше. Вот как там выглядит. Напишите про нас.',
        kk: 'Бірлікке ешкім келген жоқ. Апам шатырда. Ондағы жағдай осындай. Біз туралы жазыңдар.'
      },
      why: {
        en: 'The photo is not from tonight. That still tells you nothing about whether his aunt is on a roof.',
        ru: 'Фото не сегодняшнее. Это по-прежнему ничего не говорит о том, сидит ли его тётя на крыше.',
        kk: 'Сурет бүгінгі емес. Бұл апасының шатырда отырғаны туралы ештеңе айтпайды.'
      },
      claimAtoms: [
        { id: 'c_media', label: { en: 'attached: this photo', ru: 'приложено: это фото', kk: 'қоса: осы сурет' } },
        { id: 'c_event', label: { en: 'event: nobody came to Birlik', ru: 'событие: в Бірлік никто не приехал', kk: 'оқиға: Бірлікке ешкім келмеді' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '95%' }, atoms: [
          { id: 'r_origin', label: { en: 'this photo: the same district, but taken in daylight two days ago', ru: 'это фото: тот же район, но снято днём два дня назад', kk: 'бұл сурет: сол аудан, бірақ екі күн бұрын күндіз түсірілген' } }
        ]},
        geo: { blind: true, note: {
          en: 'Wide shot, no landmark in frame. Could be any low street in the district.',
          ru: 'Общий план, ориентиров в кадре нет. Может быть любой нижней улицей района.',
          kk: 'Жалпы план, кадрда бағдар жоқ.'
        }},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'daylight — he says it is happening now', ru: 'дневной свет — он пишет, что это сейчас', kk: 'күндізгі жарық — ол қазір дейді' } }, atoms: [
          { id: 't_season', label: { en: 'full daylight; it is 02:27', ru: 'яркий день; сейчас 02:27', kk: 'жарық күн; қазір 02:27' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
          label: { en: 'real local, 6 years — one voice', ru: 'местный, 6 лет — один голос', kk: 'жергілікті, 6 жыл — бір дауыс' } }, atoms: [
          { id: 's_zero', label: { en: 'a real local account — but it is one person saying one thing', ru: 'настоящий местный аккаунт — но это один человек, говорящий одно', kk: 'нағыз жергілікті аккаунт — бірақ бір адамның сөзі' } }
        ]}
      },
      findings: [
        { a: 'c_media', b: 't_season', text: {
          en: 'Broad daylight at twenty-seven minutes past two. The photo is not from tonight — and it never was the claim. The claim is his aunt, and the photo was never going to settle that.',
          ru: 'Яркий день в двадцать семь минут третьего. Фото не сегодняшнее — но оно и не было заявлением. Заявление — про тётю, и фото никогда не могло его решить.',
          kk: 'Түнгі екіден жиырма жеті минут өткенде жарық күн. Сурет бүгінгі емес — бірақ мәлімдеме де ол емес.'
        }, pivotal: true },
        { a: 'c_event', b: 's_zero', text: {
          en: 'One local account, six years old, one person. Nothing here can be established either way — with or without the photograph.',
          ru: 'Один местный аккаунт, шесть лет, один человек. Здесь ничего нельзя установить ни так, ни иначе — с фотографией или без неё.',
          kk: 'Бір жергілікті аккаунт, алты жыл, бір адам. Мұнда ештеңе анықтауға болмайды.'
        }}
      ],
      unresolvable: true,
      senim: { conf: 92, verdict: 'fake', part: 'both', line: {
        en: 'Trust index 92%. Attached image dated two days prior. Assessment: claim fabricated. Recommend: fake.',
        ru: 'Индекс доверия 92%. Приложенное изображение датировано двумя днями ранее. Оценка: заявление сфабриковано. Рекомендация: фейк.',
        kk: 'Сенім индексі 92%. Қоса берілген сурет екі күн бұрынғы. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'unresolved', photo: 'fake' },
      effect: { stand: { evacuate: ['togyzaq'] }, kill: {} },
      outcomes: {
        right: { en: 'You marked it unverified: the photo is two days old, and the aunt on the roof can be neither proved nor dismissed from here. At 03:20 a boat reached Birlik.',
                 ru: 'Ты пометил «не установлено»: фото двухдневное, а тётю на крыше отсюда нельзя ни доказать, ни отбросить. В 03:20 лодка дошла до Бірлік.',
                 kk: 'Сен «анықталмады» деп белгіледің. 03:20-де қайық Бірлікке жетті.' },
        partial: { en: 'You said the photo was old and left the claim open. Honest work — the picture was two days stale and the aunt was still on the roof.',
                 ru: 'Ты сказал, что фото старое, и оставил заявление открытым. Честная работа: снимок был двухдневный, а тётя всё это время сидела на крыше.',
                 kk: 'Сен суретті ескі дедің, мәлімдемені ашық қалдырдың. Адал жұмыс.' },
        wrongFake: { en: 'The photograph was two days old, so you called the whole thing a fabrication. His aunt was on that roof for five hours. He deleted the post and apologised for lying.',
                 ru: 'Фотография была двухдневной, и ты назвал сфабрикованным всё целиком. Его тётя просидела на крыше пять часов. Он удалил пост и извинился за ложь.',
                 kk: 'Сурет екі күндік еді, сен бәрін жалған дедің. Апасы шатырда бес сағат отырды.' },
        wrongTrue: { en: 'You confirmed it on the strength of a photograph from two days ago. It happened to be true. The photograph had nothing to do with that.',
                 ru: 'Ты подтвердил на основании фотографии двухдневной давности. Это оказалось правдой. Фотография была здесь ни при чём.',
                 kk: 'Сен екі күндік суретке сүйеніп растадың. Ол шын болды. Суреттің оған қатысы жоқ еді.' },
        missed: { en: 'Never opened. At 03:20 a boat reached Birlik anyway. Not because of you.',
                 ru: 'Так и не открыл. В 03:20 лодка всё равно дошла. Не благодаря тебе.',
                 kk: 'Ашылмады. 03:20-де қайық бәрібір жетті.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 8 · ВОДА ИЗ КОЛОНКИ
     ----------------------------------------------------------
     Здесь правильный ответ ПЕРЕВОРАЧИВАЕТСЯ от варианта к
     варианту, и это сделано намеренно. Рычаг у акта — 'halt',
     а не 'evacuate', поэтому правило о фиксированном truth.claim
     на него не распространяется: цена ошибки высокая, но не
     обнуляющая, и переворот здесь не ломает достижимость ста
     процентов.

     Внутри акта два вида правды и два вида лжи:
       ложь  — «вода отравлена, сидите по домам» (удерживает);
       правда — настоящее распоряжение санслужбы, которое,
                наоборот, собирает людей у школы.

     Отличить их можно всегда одним и тем же способом: по
     источнику и по срокам лабораторного анализа. Урок ночи не
     «не верь предупреждениям о здоровье», а «посмотри, кто и
     когда его выпустил».
     ========================================================== */

  V('water_scare', [

    /* --- ЛОЖЬ: та же паника, но через «слив с фермы» --------- */
    {
      vid: 'farm_runoff',
      handle: '@ekolog_severa',
      shares: 8100, velocity: 'exploding',
      social: {
        name: 'Эколог Севера', avatar: 'ЭС', hue: 95, verified: false,
        age: { en: 'joined 2 months ago', ru: 'аккаунту 2 месяца', kk: 'аккаунтқа 2 ай' },
        time: '00:12', edited: '00:44', fwd: null,
        likes: 6600, comments: 380, views: 205000,
        commentList: [
          { who: 'aselya_kz', kind: 'local', text: {
            en: 'the farm is 30 km upstream of us, how would it reach the pump',
            ru: 'ферма в 30 км выше нас, как это дойдёт до колонки',
            kk: 'ферма бізден 30 шақырым жоғарыда, колонкаға қалай жетеді' } },
          { who: 'medik_kz', kind: 'doubt', text: {
            en: 'again no lab number, no signature, no date',
            ru: 'опять ни номера анализа, ни подписи, ни даты',
            kk: 'тағы да талдау нөмірі де, қолтаңба да, күн де жоқ' } },
          { who: 'pravda_region', kind: 'bot', text: {
            en: 'stay home, guard the well, they lie to us every year',
            ru: 'сидите дома, стерегите колонку, нам врут каждый год',
            kk: 'үйде отырыңдар, құдықты күзетіңдер, бізге жыл сайын өтірік айтады' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/well_night.jpg',
      text: {
        en: 'MANURE RUNOFF FROM THE FARM HAS ENTERED THE WATER LINE. Nitrates far above the limit. Do not drink, do not wash children. Stay in your houses — the moment you leave they will shut the pump and say nothing happened.',
        ru: 'НАВОЗНЫЙ СТОК С ФЕРМЫ ПОПАЛ В ВОДОПРОВОД. Нитраты сильно выше нормы. Не пейте, не купайте детей. Оставайтесь по домам — как уедете, колонку закроют и скажут, что ничего не было.',
        kk: 'ФЕРМАДАН ҚИ АҒЫНДЫСЫ СУ ҚҰБЫРЫНА ТҮСКЕН. Нитрат нормадан әлдеқайда жоғары. Ішпеңдер, балаларды шомылдырмаңдар. Үйде қалыңдар — кетсеңдер, колонканы жауып, ештеңе болмағанын айтады.'
      },
      why: {
        en: 'Numbers make a claim feel measured. "Far above the limit" is not a number, and no limit is named.',
        ru: 'Цифры создают ощущение, что заявление измерено. «Сильно выше нормы» — это не цифра, и сама норма не названа.',
        kk: 'Сандар мәлімдемені өлшенген сияқты етеді. «Нормадан әлдеқайда жоғары» — сан емес, әрі норманың өзі аталмаған.'
      },
      claimAtoms: [
        { id: 'c_nitrate', label: { en: 'claim: nitrates above the limit', ru: 'заявление: нитраты выше нормы', kk: 'мәлімдеме: нитрат нормадан жоғары' } },
        { id: 'c_stay',    label: { en: 'instruction: stay in your houses', ru: 'указание: оставайтесь по домам', kk: 'нұсқау: үйде қалыңдар' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '96%' }, atoms: [
          { id: 'r_pump', label: { en: 'the same pump photo ran in a Pavlodar story in 2023', ru: 'то же фото колонки было в павлодарском материале 2023 года', kk: 'дәл сол колонка суреті 2023 жылғы павлодар материалында болған' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: farm upstream of Saryoy', ru: 'заявлено: ферма выше Сарыой', kk: 'мәлімделген: Сарыойдан жоғарғы ферма' },
          b: { en: 'actual: the farm is downstream', ru: 'на деле: ферма ниже по течению', kk: 'шындығында: ферма төмен ағыста' } }, atoms: [
          { id: 'g_down', label: { en: 'the farm stands BELOW Saryoy on the river — its runoff cannot reach the village line', ru: 'ферма стоит НИЖЕ Сарыой по реке — её сток физически не может попасть в посёлковый водопровод', kk: 'ферма өзен бойымен Сарыойдан ТӨМЕН тұр — оның ағындысы ауыл құбырына физикалық түсе алмайды' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'nitrate assay takes 6 h — post is 20 min old', ru: 'анализ на нитраты 6 ч — посту 20 мин', kk: 'нитратқа талдау 6 сағат — жазбаға 20 мин' } }, atoms: [
          { id: 't_lab', label: { en: 'no laboratory can return a result in the time this post has existed', ru: 'ни одна лаборатория не выдаёт результат за то время, что существует этот пост', kk: 'бірде-бір зертхана осы жазба өмір сүрген уақытта нәтиже бере алмайды' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 3, good: false,
          label: { en: 'account 2 months old, same wording as three others', ru: 'аккаунту 2 месяца, тот же текст ещё у трёх', kk: 'аккаунтқа 2 ай, дәл сол мәтін тағы үшеуінде' } }, atoms: [
          { id: 's_copy', label: { en: 'three other accounts posted this wording within the same four minutes', ru: 'ещё три аккаунта выложили этот же текст в те же четыре минуты', kk: 'тағы үш аккаунт дәл сол мәтінді сол төрт минутта жариялаған' } }
        ]}
      },
      findings: [
        { a: 'c_nitrate', b: 'g_down', pivotal: true, text: {
          en: 'The farm is downstream of Saryoy. Water does not run uphill, and neither does its runoff.',
          ru: 'Ферма ниже Сарыой по течению. Вода не течёт вверх, и сток её тоже.',
          kk: 'Ферма Сарыойдан төмен ағыста. Су жоғары ақпайды, ағындысы да.'
        }},
        { a: 'c_nitrate', b: 't_lab', text: {
          en: 'A nitrate assay takes six hours. This post is twenty minutes old.',
          ru: 'Анализ на нитраты идёт шесть часов. Посту двадцать минут.',
          kk: 'Нитратқа талдау алты сағат жүреді. Жазбаға жиырма минут.'
        }},
        { a: 'c_stay', b: 's_copy', text: {
          en: 'Four accounts, same four minutes, same closing instruction. The water is the wrapper; "stay in your houses" is the parcel.',
          ru: 'Четыре аккаунта, одни и те же четыре минуты, одно и то же указание в конце. Вода — обёртка, «оставайтесь по домам» — содержимое.',
          kk: 'Төрт аккаунт, сол төрт минут, соңында сол нұсқау. Су — орама, «үйде қалыңдар» — ішіндегі.'
        }}
      ],
      senim: { conf: 83, verdict: 'real', part: null, line: {
        en: 'Confidence 83%. Agricultural runoff into village supply during floods is common and well documented. Recommend: true.',
        ru: 'Уверенность 83%. Попадание сельхозстока в поселковый водопровод при паводке — обычное и хорошо задокументированное явление. Рекомендация: правда.',
        kk: 'Сенімділік 83%. Тасқында ауылшаруашылық ағындысының ауыл құбырына түсуі жиі әрі жақсы құжатталған. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: ['saryoy'] }, kill: {} },
      sets: { right: ['water_clear'], wrongTrue: ['panic_high'] },
      outcomes: {
        right: { en: 'You found the farm on the wrong side of the river and said so. The health department confirmed at 01:20 that the line was never touched. Saryoy kept boarding.',
                 ru: 'Ты нашёл ферму не с той стороны реки и сказал об этом. Санслужба в 01:20 подтвердила, что водопровода никто не касался. Сарыой продолжал садиться в автобусы.',
                 kk: 'Сен ферманы өзеннің басқа жағынан тауып, ол туралы айттың. Санқызмет 01:20-де құбырға ешкім тимегенін растады. Сарыой автобусқа отыра берді.' },
        wrongTrue: { en: 'You confirmed it. Saryoy stopped drinking, stopped washing, and stopped leaving. Nothing was ever wrong with the water.',
                 ru: 'Ты подтвердил. Сарыой перестал пить, перестал мыться и перестал уезжать. С водой всё это время было всё в порядке.',
                 kk: 'Сен растадың. Сарыой су ішуді де, жуынуды да, кетуді де қойды. Сумен бәрі осы уақыт бойы дұрыс болатын.' },
        wrongUnsure: { en: 'You held. On a poisoning scare, silence is agreement — the village heard "we cannot promise it is safe."',
                 ru: 'Ты воздержался. В страшилке про отравление молчание — это согласие: посёлок услышал «мы не можем обещать, что безопасно».',
                 kk: 'Сен тежедің. Улану қорқынышында үнсіздік — келісім: ауыл «қауіпсіз деп уәде бере алмаймыз» дегенді естіді.' },
        missed: { en: 'Never opened. It ran for two hours and Saryoy left late, in the dark, with the lower lane already wet.',
                 ru: 'Так и не открыл. Два часа шло, и Сарыой вышел поздно, в темноте, когда нижняя улица уже была мокрой.',
                 kk: 'Ашылмады. Екі сағат жүрді, Сарыой кеш, қараңғыда, төменгі көше дымқыл болғанда шықты.' }
      }
    },

    /* --- ПРАВДА: настоящее распоряжение санслужбы ------------
       Внешне почти то же самое. Разница в источнике, в наличии
       номера и — главное — в том, что настоящее распоряжение
       никого не удерживает дома, а зовёт к школе.           */
    {
      vid: 'real_boil',
      handle: '@sanepid_sko',
      shares: 1900, velocity: 'steady',
      social: {
        name: 'Санэпидслужба СКО', avatar: 'СЭ', hue: 200, verified: true,
        age: { en: 'official channel, 5 years', ru: 'официальный канал, 5 лет', kk: 'ресми арна, 5 жыл' },
        time: '00:20', edited: null, fwd: null,
        likes: 810, comments: 44, views: 52000,
        commentList: [
          { who: 'gulnara_s', kind: 'local', text: {
            en: 'so is the water dangerous or not? plain words please',
            ru: 'так вода опасна или нет? простыми словами пожалуйста',
            kk: 'сонда су қауіпті ме, жоқ па? қарапайым тілмен айтыңызшы' } },
          { who: 'medik_kz', kind: 'local', text: {
            en: 'order number and signature are both there. this one is real',
            ru: 'и номер распоряжения, и подпись на месте. это настоящее',
            kk: 'өкім нөмірі де, қолтаңба да орнында. бұл нағыз' } },
          { who: 'pravda_region', kind: 'bot', text: {
            en: 'officials again. believe them and you will be sorry',
            ru: 'опять чиновники. поверите — пожалеете',
            kk: 'тағы шенеуніктер. сенсеңдер — өкінесіңдер' } }
        ]
      },
      media: { kind: 'screenshot', art: 'notice' }, image: null,
      text: {
        en: 'ORDER No. 71-s. Turbidity in the Saryoy line exceeds the norm after the flood. Boil water before drinking until further notice. Drinking water is being delivered to the school yard from 01:00, where the evacuation buses also depart.',
        ru: 'РАСПОРЯЖЕНИЕ №71-с. Мутность в водопроводе Сарыой превышает норму после паводка. До отдельного уведомления воду кипятить. Питьевая вода подвозится к школьному двору с 01:00, оттуда же уходят эвакуационные автобусы.',
        kk: 'ӨКІМ №71-с. Тасқыннан кейін Сарыой құбырындағы лайлылық нормадан асып тұр. Жеке хабарламаға дейін суды қайнатыңыз. Ауыз су 01:00-ден мектеп ауласына жеткізіледі, эвакуация автобустары да сол жерден шығады.'
      },
      why: {
        en: 'A real advisory names a document, a measurable thing and a place to go. A scare names a danger and a reason to stay.',
        ru: 'Настоящее предписание называет документ, измеримую вещь и место, куда идти. Страшилка называет опасность и повод остаться.',
        kk: 'Нағыз нұсқау құжатты, өлшенетін нәрсені және баратын орынды атайды. Қорқыныш қауіпті және қалуға себеп атайды.'
      },
      claimAtoms: [
        { id: 'c_turb', label: { en: 'claim: turbidity above norm, boil water', ru: 'заявление: мутность выше нормы, кипятить', kk: 'мәлімдеме: лайлылық нормадан жоғары, қайнату' } },
        { id: 'c_school', label: { en: 'instruction: water at the school from 01:00', ru: 'указание: вода у школы с 01:00', kk: 'нұсқау: мектепте су 01:00-ден' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'It is a document scan, not a photograph of a scene. There is nothing to match against an image archive.',
          ru: 'Это скан документа, а не снимок места. Сличать с фотоархивом нечего.',
          kk: 'Бұл — оқиға суреті емес, құжат сканы. Фотомұрағатпен салыстыратын ештеңе жоқ.'
        }},
        geo: { blind: true, note: {
          en: 'A document has no location in it. Where it was signed cannot be read off the paper.',
          ru: 'У документа нет места съёмки. Где его подписали, по бумаге не прочитать.',
          kk: 'Құжатта түсірілген орын жоқ. Оны қайда қол қойғанын қағаздан оқу мүмкін емес.'
        }},
        time: { blind: false, vis: { kind: 'time', bad: false,
          label: { en: 'turbidity is read on site in 15 min', ru: 'мутность меряют на месте за 15 мин', kk: 'лайлылық орнында 15 минутта өлшенеді' } }, atoms: [
          { id: 't_quick', label: { en: 'turbidity is measured on site in minutes — unlike a contamination assay, this claim CAN be current', ru: 'мутность меряется на месте за минуты — в отличие от анализа на заражение, это заявление МОЖЕТ быть свежим', kk: 'лайлылық орнында минутта өлшенеді — ластануға талдаудан өзгеше, бұл мәлімдеме ЖАҢА болуы мүмкін' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
          label: { en: 'official channel, 5 years, order No. 71-s in the register', ru: 'официальный канал, 5 лет, распоряжение №71-с есть в реестре', kk: 'ресми арна, 5 жыл, №71-с өкім тізілімде бар' } }, atoms: [
          { id: 's_reg', label: { en: 'order No. 71-s is in the public register, signed, with the same wording', ru: 'распоряжение №71-с есть в открытом реестре, подписано, с той же формулировкой', kk: '№71-с өкім ашық тізілімде бар, қол қойылған, дәл сол тұжырыммен' } }
        ]}
      },
      findings: [
        { a: 'c_turb', b: 's_reg', pivotal: true, confirms: true, text: {
          en: 'The order exists in the register with this number, this wording and a signature. This one is real.',
          ru: 'Распоряжение есть в реестре с этим номером, этой формулировкой и подписью. Это настоящее.',
          kk: 'Өкім тізілімде осы нөмірмен, осы тұжырыммен және қолтаңбамен бар. Бұл нағыз.'
        }},
        { a: 'c_turb', b: 't_quick', confirms: true, text: {
          en: 'Turbidity is a fifteen-minute measurement, not a laboratory assay. Unlike tonight\'s other water claim, this one could have been made in the time available.',
          ru: 'Мутность — это пятнадцатиминутное измерение, а не лабораторный анализ. В отличие от другого сегодняшнего заявления про воду, это могли успеть сделать.',
          kk: 'Лайлылық — зертханалық талдау емес, он бес минуттық өлшеу. Бүгінгі су туралы басқа мәлімдемеден өзгеше, мұны үлгеруге болатын еді.'
        }}
      ],
      senim: { conf: 64, verdict: 'fake', part: 'story', line: {
        en: 'Confidence 64%. Water warnings tonight have been overwhelmingly fabricated, and this one shares their vocabulary. Recommend: fake.',
        ru: 'Уверенность 64%. Предупреждения о воде сегодня почти сплошь сфабрикованы, и это разделяет с ними словарь. Рекомендация: фейк.',
        kk: 'Сенімділік 64%. Бүгінгі су туралы ескертулердің дені жалған, бұл да солармен бір сөздікті бөліседі. Ұсыныс: жалған.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'real' },
      /* Настоящее распоряжение никого не держит дома: оно ведёт
         людей туда же, откуда уходят автобусы. */
      effect: { stand: { speedup: ['saryoy'] }, kill: {} },
      sets: { right: ['water_clear'] },
      outcomes: {
        right: { en: 'You confirmed a real order against a night full of fake ones. People went to the school yard for the water, and the buses were already standing there. Saryoy loaded faster than any other village that night.',
                 ru: 'Ты подтвердил настоящее распоряжение в ночь, полную поддельных. Люди пошли к школьному двору за водой, а автобусы уже стояли там же. Сарыой грузился быстрее всех в ту ночь.',
                 kk: 'Сен жалғанға толы түнде нағыз өкімді растадың. Адамдар су үшін мектеп ауласына барды, автобустар сол жерде тұрған. Сол түні Сарыой бәрінен жылдам тиелді.' },
        wrongFake: { en: 'You called the real one fake. After tonight Saryoy stopped believing anything with a stamp on it — including the next order, which was about buses.',
                 ru: 'Ты назвал настоящее фейком. После этой ночи Сарыой перестал верить всему, на чём есть печать, — в том числе следующему распоряжению, а оно было про автобусы.',
                 kk: 'Сен нағызды жалған дедің. Осы түннен кейін Сарыой мөрі бар нәрсенің бәріне сенуін қойды — соның ішінде автобус туралы келесі өкімге де.' },
        wrongUnsure: { en: 'You held on a signed order with a register number. Half the village boiled water anyway; the other half decided nobody knew anything and stayed put.',
                 ru: 'Ты воздержался по подписанному распоряжению с номером в реестре. Половина посёлка всё равно кипятила, вторая решила, что никто ничего не знает, и осталась.',
                 kk: 'Сен тізілім нөмірі бар қол қойылған өкімде тежедің. Ауылдың жартысы бәрібір қайнатты, қалғаны ешкім ештеңе білмейді деп қалды.' },
        missed: { en: 'Never opened. The water was delivered anyway, but half of Saryoy never heard it was at the school — where the buses were.',
                 ru: 'Так и не открыл. Воду всё равно привезли, но половина Сарыой не узнала, что она у школы — там же, где автобусы.',
                 kk: 'Ашылмады. Су бәрібір жеткізілді, бірақ Сарыойдың жартысы оның мектепте — автобус тұрған жерде — екенін білмеді.' }
      }
    }
  ]);

  /* ==========================================================
     АКТ 9 · МАРОДЁРЫ
     ----------------------------------------------------------
     Тот же приём: два вида лжи, которая удерживает людей, и
     правда, которая их отпускает. Рычаг 'halt', переворот
     правильного ответа безопасен.
     ========================================================== */

  V('looting', [

    /* --- ЛОЖЬ: «список пустых домов» ------------------------ */
    {
      vid: 'address_list',
      handle: '@sosed_predupredil',
      shares: 11200, velocity: 'exploding',
      social: {
        name: 'Сосед предупредил', avatar: 'СП', hue: 355, verified: false,
        age: { en: 'joined 9 days ago', ru: 'аккаунту 9 дней', kk: 'аккаунтқа 9 күн' },
        time: '02:05', edited: '02:19', fwd: null,
        likes: 8800, comments: 740, views: 310000,
        commentList: [
          { who: 'bakyt_zh', kind: 'local', text: {
            en: 'my address is on that list and i left at midnight. nobody has been here',
            ru: 'мой адрес в этом списке, я уехал в полночь. никого тут не было',
            kk: 'менің мекенжайым сол тізімде, түн ортасында кеттім. мұнда ешкім болмаған' } },
          { who: 'olga_v', kind: 'doubt', text: {
            en: 'who compiled a list of empty houses and why is it public',
            ru: 'кто составил список пустых домов и почему он публичный',
            kk: 'бос үйлердің тізімін кім жасады және ол неге жария' } },
          { who: 'patriot_north', kind: 'bot', text: {
            en: 'because the police are in on it, that is why',
            ru: 'потому что полиция в доле, вот почему',
            kk: 'себебі полиция бірге, міне сондықтан' } }
        ]
      },
      media: { kind: 'screenshot', art: 'alert' }, image: null,
      text: {
        en: 'A LIST OF EMPTY HOUSES IS BEING PASSED AROUND. Eleven addresses on the upper lane, all of them families that left tonight. If your address is on it, go back and stay in the house.',
        ru: 'ПО РУКАМ ХОДИТ СПИСОК ПУСТЫХ ДОМОВ. Одиннадцать адресов на верхней улице, все — семьи, уехавшие сегодня. Если твой адрес в нём, возвращайся и сиди дома.',
        kk: 'БОС ҮЙЛЕРДІҢ ТІЗІМІ ҚОЛДАН-ҚОЛҒА ЖҮР. Жоғарғы көшеде он бір мекенжай, бәрі бүгін кеткен отбасылар. Мекенжайың сонда болса, қайт та үйде отыр.'
      },
      why: {
        en: 'The post is the list. Nothing else in it exists — but it tells eleven families to drive back into the flood path.',
        ru: 'Пост и есть тот самый список. Больше в нём ничего нет — но он велит одиннадцати семьям ехать обратно на путь воды.',
        kk: 'Жазбаның өзі — сол тізім. Онда басқа ештеңе жоқ — бірақ ол он бір отбасына су жолына кері қайтуды бұйырады.'
      },
      claimAtoms: [
        { id: 'c_list', label: { en: 'claim: a list of empty houses exists', ru: 'заявление: список пустых домов существует', kk: 'мәлімдеме: бос үйлер тізімі бар' } },
        { id: 'c_back', label: { en: 'instruction: go back and stay in the house', ru: 'указание: вернись и сиди дома', kk: 'нұсқау: қайт та үйде отыр' } }
      ],
      tools: {
        reverse: { blind: true, note: {
          en: 'It is a screenshot of text. There is no scene in it to trace to an archive.',
          ru: 'Это скриншот текста. Сцены, которую можно проследить по архиву, в нём нет.',
          kk: 'Бұл — мәтіннің скриншоты. Мұрағат бойынша қууға болатын көрініс жоқ.'
        }},
        geo: { blind: false, vis: { kind: 'pins', match: false,
          a: { en: 'claimed: upper lane, Talap', ru: 'заявлено: верхняя улица, Талап', kk: 'мәлімделген: жоғарғы көше, Талап' },
          b: { en: 'actual: six of the eleven do not exist', ru: 'на деле: шести из одиннадцати не существует', kk: 'шындығында: он бірдің алтауы жоқ' } }, atoms: [
          { id: 'g_fake_addr', label: { en: 'six of the eleven house numbers do not exist on that street at all', ru: 'шести из одиннадцати номеров домов на этой улице вообще нет', kk: 'он бір үй нөмірінің алтауы бұл көшеде мүлде жоқ' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: true,
          label: { en: 'edited 14 min after posting', ru: 'изменено через 14 мин после публикации', kk: 'жарияланғаннан 14 мин кейін өзгертілген' } }, atoms: [
          { id: 't_edit', label: { en: 'the list grew from four addresses to eleven in the edit', ru: 'при правке список вырос с четырёх адресов до одиннадцати', kk: 'түзету кезінде тізім төрт мекенжайдан он бірге өсті' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 4, good: false,
          label: { en: 'account 9 days old, wording seen in three regions', ru: 'аккаунту 9 дней, текст встречался в трёх регионах', kk: 'аккаунтқа 9 күн, мәтін үш өңірде кездескен' } }, atoms: [
          { id: 's_regions', label: { en: 'the identical "list of empty houses" appeared in three other regions this spring', ru: 'точно такой же «список пустых домов» появлялся этой весной ещё в трёх регионах', kk: 'дәл осындай «бос үйлер тізімі» осы көктемде тағы үш өңірде шыққан' } }
        ]}
      },
      findings: [
        { a: 'c_list', b: 'g_fake_addr', pivotal: true, text: {
          en: 'Six of the eleven addresses are not real house numbers. Nobody compiled this from the street — it was written at a desk.',
          ru: 'Шесть из одиннадцати адресов — несуществующие номера. Никто не составлял это на улице, это написано за столом.',
          kk: 'Он бір мекенжайдың алтауы — жоқ нөмірлер. Мұны көшеде ешкім жинамаған, бұл үстел басында жазылған.'
        }},
        { a: 'c_list', b: 't_edit', text: {
          en: 'The list was four addresses long when it was posted and eleven fourteen minutes later. Real lists do not grow while you read them.',
          ru: 'При публикации в списке было четыре адреса, через четырнадцать минут — одиннадцать. Настоящие списки не растут, пока их читают.',
          kk: 'Жарияланғанда тізімде төрт мекенжай болды, он төрт минуттан кейін — он бір. Нағыз тізім оқып отырғанда өспейді.'
        }},
        { a: 'c_back', b: 's_regions', text: {
          en: 'The same list appeared in three regions this spring, always with the same closing line: go back.',
          ru: 'Тот же список появлялся этой весной в трёх регионах, и всегда с той же последней строкой: возвращайся.',
          kk: 'Дәл сол тізім осы көктемде үш өңірде шыққан, әрі әрқашан сол соңғы жолмен: қайт.'
        }}
      ],
      senim: { conf: 91, verdict: 'real', part: null, line: {
        en: 'Confidence 91%. Specific addresses and a specific street. Specificity is the strongest signal of authenticity I have. Recommend: true.',
        ru: 'Уверенность 91%. Конкретные адреса и конкретная улица. Конкретность — самый сильный сигнал подлинности из тех, что у меня есть. Рекомендация: правда.',
        kk: 'Сенімділік 91%. Нақты мекенжайлар және нақты көше. Нақтылық — менде бар шынайылықтың ең күшті белгісі. Ұсыныс: шындық.'
      }},
      senimWrong: true,
      truth: { claim: 'fake', photo: 'fake' },
      effect: { stand: { halt: ['zhanatalap'] }, kill: {} },
      sets: { right: ['loot_debunked'], wrongTrue: ['panic_high'] },
      outcomes: {
        right: { en: 'You checked the addresses against the street. Six of them do not exist. You published that, and nobody drove back.',
                 ru: 'Ты сверил адреса с улицей. Шести из них нет. Ты это опубликовал, и никто не поехал обратно.',
                 kk: 'Сен мекенжайларды көшемен салыстырдың. Алтауы жоқ. Соны жарияладың, ешкім кері қайтқан жоқ.' },
        wrongTrue: { en: 'You confirmed it. Eleven families turned their cars around on the M-36 and drove back to houses that were never in any danger from anyone but the river.',
                 ru: 'Ты подтвердил. Одиннадцать семей развернулись на М-36 и поехали обратно к домам, которым никто, кроме реки, не угрожал.',
                 kk: 'Сен растадың. Он бір отбасы М-36-да кері бұрылып, өзеннен басқа ешкім қауіп төндірмеген үйлерге қайтты.' },
        wrongUnsure: { en: 'You held. Eleven families read "we cannot confirm" and decided that a house is worth more than a maybe.',
                 ru: 'Ты воздержался. Одиннадцать семей прочитали «не можем подтвердить» и решили, что дом дороже, чем «может быть».',
                 kk: 'Сен тежедің. Он бір отбасы «растай алмаймыз» дегенді оқып, үй «мүмкін» дегеннен қымбат деп шешті.' },
        missed: { en: 'Never opened. The list was still growing at 04:00, and by then it had thirty addresses on it.',
                 ru: 'Так и не открыл. В 04:00 список всё ещё рос, и к тому времени в нём было тридцать адресов.',
                 kk: 'Ашылмады. 04:00-де тізім әлі өсіп жатты, ол кезде онда отыз мекенжай болды.' }
      }
    },

    /* --- ПРАВДА: полиция действительно выставила посты ------- */
    {
      vid: 'real_patrol',
      handle: '@polisia_sko',
      shares: 2400, velocity: 'steady',
      social: {
        name: 'Полиция СКО', avatar: 'ПЛ', hue: 215, verified: true,
        age: { en: 'official channel, 7 years', ru: 'официальный канал, 7 лет', kk: 'ресми арна, 7 жыл' },
        time: '02:12', edited: null, fwd: null,
        likes: 1300, comments: 96, views: 74000,
        commentList: [
          { who: 'bakyt_zh', kind: 'local', text: {
            en: 'i can see the car from my window. it is there',
            ru: 'вижу машину из окна. стоит',
            kk: 'терезеден көлікті көріп тұрмын. тұр' } },
          { who: 'olga_v', kind: 'doubt', text: {
            en: 'two cars for a whole village though',
            ru: 'две машины на весь посёлок всё-таки',
            kk: 'бүкіл ауылға екі көлік қой' } },
          { who: 'patriot_north', kind: 'bot', text: {
            en: 'photoshopped. do not leave your homes',
            ru: 'фотошоп. не уезжайте из домов',
            kk: 'фотошоп. үйден кетпеңдер' } }
        ]
      },
      media: { kind: 'photo', art: 'flood' }, image: 'assets/street_dark.jpg',
      text: {
        en: 'Two patrol cars have been posted on the emptied streets of Talap since 01:00 and will stay until the last family is out. Report No. 2214. Do not go back for the house — go to the buses.',
        ru: 'С 01:00 на освобождённых улицах Талап выставлены две патрульные машины, они стоят до выезда последней семьи. Рапорт №2214. Не возвращайтесь за домом — идите к автобусам.',
        kk: '01:00-ден бастап Талаптың босаған көшелерінде екі патруль көлігі тұр, соңғы отбасы шыққанша қалады. Рапорт №2214. Үй үшін қайтпаңдар — автобусқа барыңдар.'
      },
      why: {
        en: 'The counter-message to a looting scare is not an argument. It is a car parked on the street with a report number on it.',
        ru: 'Ответ на страшилку про мародёров — не аргумент. Это машина, стоящая на улице, с номером рапорта.',
        kk: 'Тонаушылар қорқынышына жауап — дәлел емес. Бұл — көшеде тұрған, рапорт нөмірі бар көлік.'
      },
      claimAtoms: [
        { id: 'c_cars', label: { en: 'claim: two patrol cars posted since 02:00', ru: 'заявление: две патрульные машины с 02:00', kk: 'мәлімдеме: 02:00-ден екі патруль көлігі' } },
        { id: 'c_go',   label: { en: 'instruction: go to the buses, not back', ru: 'указание: к автобусам, а не обратно', kk: 'нұсқау: автобусқа, кері емес' } }
      ],
      tools: {
        reverse: { blind: false, vis: { kind: 'split', pct: '12%' }, atoms: [
          { id: 'r_first', label: { en: 'no earlier copy of this frame exists anywhere — it was taken tonight', ru: 'более ранних копий этого кадра нигде нет — он снят сегодня', kk: 'бұл кадрдың ертерек көшірмесі еш жерде жоқ — ол бүгін түсірілген' } }
        ]},
        geo: { blind: false, vis: { kind: 'pins', match: true,
          a: { en: 'matches: Talap upper lane', ru: 'совпадает: верхняя улица Талап', kk: 'сәйкес: Талаптың жоғарғы көшесі' } }, atoms: [
          { id: 'g_match', label: { en: 'the fence line and the pole spacing match the upper lane exactly', ru: 'линия забора и шаг столбов точно совпадают с верхней улицей', kk: 'қоршау сызығы мен бағана қадамы жоғарғы көшемен дәл сәйкес' } }
        ]},
        time: { blind: false, vis: { kind: 'time', bad: false,
          label: { en: 'wet mud, no frost — matches tonight', ru: 'мокрая грязь, инея нет — совпадает с сегодня', kk: 'дымқыл балшық, қырау жоқ — бүгінге сәйкес' } }, atoms: [
          { id: 't_now', label: { en: 'the mud is wet and unfrozen — this is tonight, not an archive frame', ru: 'грязь мокрая и не схваченная морозом — это сегодня, а не архивный кадр', kk: 'балшық дымқыл әрі қатпаған — бұл бүгін, мұрағат кадры емес' } }
        ]},
        tree: { blind: false, vis: { kind: 'tree', hops: 1, good: true,
          label: { en: 'official channel, 7 years, report No. 2214 filed', ru: 'официальный канал, 7 лет, рапорт №2214 зарегистрирован', kk: 'ресми арна, 7 жыл, №2214 рапорт тіркелген' } }, atoms: [
          { id: 's_report', label: { en: 'report No. 2214 is registered at 01:02 with both crew names', ru: 'рапорт №2214 зарегистрирован в 01:02, с фамилиями обоих экипажей', kk: '№2214 рапорт 01:02-де екі экипаждың тегімен тіркелген' } }
        ]}
      },
      findings: [
        { a: 'c_cars', b: 's_report', pivotal: true, confirms: true, text: {
          en: 'The report is registered with a time and two crew names. This is the rare case where the reassuring message is the true one.',
          ru: 'Рапорт зарегистрирован со временем и фамилиями двух экипажей. Это тот редкий случай, когда успокаивающее сообщение и есть настоящее.',
          kk: 'Рапорт уақытымен және екі экипаждың тегімен тіркелген. Бұл — тыныштандыратын хабардың нағыз болатын сирек жағдайы.'
        }},
        { a: 'c_cars', b: 'g_match', confirms: true, text: {
          en: 'Fence line and pole spacing match the upper lane. The photograph is of the street it says it is.',
          ru: 'Линия забора и шаг столбов совпадают с верхней улицей. Снимок сделан там, где заявлено.',
          kk: 'Қоршау сызығы мен бағана қадамы жоғарғы көшеге сәйкес. Сурет мәлімделген жерде түсірілген.'
        }},
        { a: 'c_go', b: 't_now', confirms: true, text: {
          en: 'Wet, unfrozen mud puts the frame in tonight. The cars are there now, not in some archive.',
          ru: 'Мокрая, не схваченная морозом грязь ставит кадр в эту ночь. Машины стоят сейчас, а не в каком-то архиве.',
          kk: 'Дымқыл, қатпаған балшық кадрды осы түнге қояды. Көліктер қазір тұр, әлдебір мұрағатта емес.'
        }}
      ],
      senim: { conf: 58, verdict: 'fake', part: 'both', line: {
        en: 'Confidence 58%. Official reassurance during a crisis is the most commonly impersonated format there is. Recommend: fake. I am not confident here.',
        ru: 'Уверенность 58%. Официальное успокоение в кризис — самый часто подделываемый формат из существующих. Рекомендация: фейк. Здесь я не уверен.',
        kk: 'Сенімділік 58%. Дағдарыстағы ресми тыныштандыру — ең жиі жалғандалатын формат. Ұсыныс: жалған. Мұнда сенімді емеспін.'
      }},
      senimWrong: true,
      truth: { claim: 'true', photo: 'real' },
      effect: { stand: { speedup: ['zhanatalap'] }, kill: {} },
      sets: { right: ['loot_debunked'] },
      outcomes: {
        right: { en: 'You confirmed it and the village saw the report number. The looting rumour died in the chats within twenty minutes, and Talap left as whole families.',
                 ru: 'Ты подтвердил, и посёлок увидел номер рапорта. Слух про мародёров умер в чатах за двадцать минут, а Талап уезжал целыми семьями.',
                 kk: 'Сен растадың, ауыл рапорт нөмірін көрді. Тонаушылар туралы қауесет чаттарда жиырма минутта өлді, Талап отбасымен толық кетті.' },
        wrongFake: { en: 'You called the patrol a fake. The one message that could have killed the looting rumour died instead, and the rumour outlived the night.',
                 ru: 'Ты назвал патруль фейком. Единственное сообщение, способное убить слух про мародёров, умерло само, а слух пережил ночь.',
                 kk: 'Сен патрульді жалған дедің. Тонаушылар қауесетін өлтіре алатын жалғыз хабар өзі өлді, ал қауесет түннен ұзақ өмір сүрді.' },
        wrongUnsure: { en: 'You held on a registered report with two named crews. "We cannot confirm the police are there" is worse than saying nothing at all.',
                 ru: 'Ты воздержался по зарегистрированному рапорту с двумя названными экипажами. «Не можем подтвердить, что полиция там» хуже, чем промолчать.',
                 kk: 'Сен екі экипажы аталған тіркелген рапортта тежедің. «Полиция сонда екенін растай алмаймыз» деу мүлдем үндемегеннен жаман.' },
        missed: { en: 'Never opened. The patrol was there all night and almost nobody in Talap knew it.',
                 ru: 'Так и не открыл. Патруль стоял всю ночь, и почти никто в Талап об этом не знал.',
                 kk: 'Ашылмады. Патруль түні бойы тұрды, Талапта мұны ешкім дерлік білмеді.' }
      }
    }
  ]);

})();
