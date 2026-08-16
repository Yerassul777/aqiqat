/* ============================================================
   AQIQAT — СТАТЬИ, КОТОРЫЕ НАХОДИТ ЕРАСЫЛ
   ------------------------------------------------------------
   Ерасыл не выносит вердикт из ниоткуда. Он идёт в архив,
   вытаскивает публикацию по теме и строит мнение ИЗ НЕЁ. Отсюда
   вся его польза и вся его ненадёжность разом.

   ЧТО ВИДНО ДО ТЕКСТА: источник, репутация, дата, город. Это
   сделано намеренно — настоящая медиаграмотность начинается с
   решения «с каким доверием я это читаю», принятого ДО того,
   как текст успел убедить.

   ПРАВИЛО БАЛАНСА: плохая репутация — редкость. Если бы Ерасыл
   регулярно таскал мусор, к нему просто перестали бы ходить, и
   двадцать монет за наём стали бы налогом на доверчивость. Он
   младший, а не бесполезный: чаще всего статья реально помогает
   и указывает в сторону правды.

   matchesTruth: false — статья уводит в сторону. Таких мало и
   каждая помечена, чтобы это было видно с одного взгляда.

   ЕДИНСТВЕННОЕ ИСКЛЮЧЕНИЕ — Саят Саматович. Это отсылка к
   комедийному акиму из веб-сериала «Саке»: репутация «ужасная»
   написана прямо в шапке, текст — чистый анекдот. Он выпадает
   только на акте про дипфейк акима и только в половине ночей.
   Один раз игрок на него попадётся, посмеётся и с этого момента
   начнёт читать строку репутации. Ради этого он и написан.

   ПРАВИЛО СЕТТИНГА прежнее: область реальная, издания и авторы
   ВЫМЫШЛЕНЫ.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.ARTICLES = {

  /* ---------- 1 · МОСТ М-36 ---------------------------------
     Все варианты: заявление ложно, мост стоит. Статья должна
     давать проверяемый факт о состоянии моста.             */
  bridge: {
    base: {
      source: { en: 'Severnyi Kurier', ru: 'Северный курьер', kk: 'Солтүстік курьер' },
      reputation: 'good', date: '21:40', matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Road service reports the M-36 crossing passed its flood inspection at 21:40 and remains open in both directions. Load limit reduced to 20 tonnes; no closure is planned tonight.',
        ru: 'Дорожная служба сообщает: переправа М-36 прошла паводковый осмотр в 21:40 и остаётся открытой в обе стороны. Ограничение нагрузки снижено до 20 тонн, закрытие на сегодня не планируется.',
        kk: 'Жол қызметі хабарлайды: М-36 өткелі 21:40-та тасқын тексерісінен өтті және екі бағытта да ашық. Жүктеме шегі 20 тоннаға дейін төмендетілді, бүгін жабу жоспарланбаған.'
      }
    },
    old_repair: {
      source: { en: 'Regional Roads Bulletin', ru: 'Вестник дорог области', kk: 'Облыс жолдары хабаршысы' },
      reputation: 'good', date: '03.2024', matchesTruth: true,
      city: { en: 'Qostanay', ru: 'Костанай', kk: 'Қостанай' },
      text: {
        en: 'Archive: in March 2024 the M-36 span was closed for eleven days after ice damage. Photographs of the works circulated widely at the time and resurface at every high water since.',
        ru: 'Архив: в марте 2024 года пролёт М-36 закрывали на одиннадцать дней после повреждения льдом. Снимки тех работ разошлись тогда широко и всплывают при каждом большом паводке.',
        kk: 'Мұрағат: 2024 жылдың наурызында М-36 аралығы мұз зақымынан кейін он бір күнге жабылған. Сол жұмыстардың суреттері кең тарап, әр су тасқынында қайта шығады.'
      }
    },
    ai_made: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'Three "collapse" images from tonight share the same failure: guard rails that dissolve into the deck, and a river with no current line. Generated imagery is now the default first wave of any flood rumour.',
        ru: 'Три сегодняшних снимка «обрушения» роднит одно: ограждение растворяется в полотне, а у реки нет линии течения. Сгенерированные картинки сейчас — стандартная первая волна любого слуха о паводке.',
        kk: 'Бүгінгі «құлау» суреттерінің үшеуін бір нәрсе біріктіреді: қоршау төсемге сіңіп кетеді, ал өзенде ағыс сызығы жоқ. Жасанды суреттер — кез келген тасқын қауесетінің әдеттегі бірінші толқыны.'
      }
    },
    other_bridge: {
      source: { en: 'Severnyi Kurier', ru: 'Северный курьер', kk: 'Солтүстік курьер' },
      reputation: 'good', date: '22:55', matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Our correspondent drove the M-36 northbound at 22:40. The crossing is open, traffic is light, and the service crew on site had heard nothing about a collapse until we asked them.',
        ru: 'Наш корреспондент проехал М-36 на север в 22:40. Переправа открыта, машин мало, а дежурная бригада на месте ничего про обрушение не слышала, пока мы у неё не спросили.',
        kk: 'Тілшіміз 22:40-та М-36 бойымен солтүстікке өтті. Өткел ашық, көлік аз, ал кезекші бригада біз сұрағанша құлау туралы ештеңе естімеген.'
      }
    }
  },

  /* ---------- 2 · ПРИКАЗ ОБ ЭВАКУАЦИИ -----------------------
     Заявление во всех вариантах истинно: ехать надо. Меняется
     только то, что подделано вокруг него.                  */
  evac_qarasu: {
    base: {
      source: { en: 'Regional Emergency Service', ru: 'Служба ЧС области', kk: 'Облыс ТЖ қызметі' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Order No. 114 is on the service register: lower streets of Qarasu, Bestobe, Saryoy and Talap to be cleared from 01:00. Buses depart from the school yards. The register entry matches the document circulating online.',
        ru: 'Приказ №114 значится в реестре службы: нижние улицы Қарасу, Бестобе, Сарыой и Талап освобождаются с 01:00. Автобусы от школьных дворов. Запись в реестре совпадает с документом, который ходит в сети.',
        kk: 'Қызмет тізілімінде №114 бұйрық бар: Қарасу, Бестөбе, Сарыой және Талап төменгі көшелері 01:00-ден босатылады. Автобустар мектеп ауласынан. Тізілімдегі жазба желідегі құжатпен сәйкес.'
      }
    },
    forged_point: {
      source: { en: 'Regional Emergency Service', ru: 'Служба ЧС области', kk: 'Облыс ТЖ қызметі' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Clarification: the assembly points in Order No. 114 are the school yards on the upper streets. The service asks residents to disregard any version naming the riverside club — that building is inside the projected flood line.',
        ru: 'Уточнение: точки сбора по приказу №114 — школьные дворы на верхних улицах. Служба просит не обращать внимания на версии, где назван прибрежный клуб: это здание находится внутри расчётной линии затопления.',
        kk: 'Нақтылау: №114 бұйрық бойынша жиналу орындары — жоғарғы көшелердегі мектеп аулалары. Қызмет жағадағы клуб аталған нұсқаларға назар аудармауды сұрайды: ол ғимарат су басу сызығының ішінде.'
      }
    },
    redated: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'A scan of Order No. 114 is going round with an October date in the header. The order number and the street list are current; only the date line has been altered. The evacuation itself is real and is running tonight.',
        ru: 'По сети ходит скан приказа №114 с октябрьской датой в шапке. Номер приказа и список улиц — сегодняшние, переправлена только строка даты. Сама эвакуация настоящая и идёт этой ночью.',
        kk: 'Желіде №114 бұйрықтың сканы қазан айының күнімен таралып жүр. Бұйрық нөмірі мен көше тізімі — бүгінгі, тек күн жолы өзгертілген. Эвакуацияның өзі нағыз және осы түні жүріп жатыр.'
      }
    },
    relay: {
      source: { en: 'Regional Emergency Service', ru: 'Служба ЧС области', kk: 'Облыс ТЖ қызметі' },
      reputation: 'good', after: 14, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'The dispatch confirms by telephone that the evacuation of the four villages is under way. The written order has not yet been published to the public portal — the portal is behind by about forty minutes tonight.',
        ru: 'Диспетчерская подтверждает по телефону: эвакуация четырёх посёлков идёт. Письменный приказ на публичный портал ещё не выложен — портал сегодня отстаёт примерно на сорок минут.',
        kk: 'Диспетчерлік телефон арқылы растайды: төрт ауылды эвакуациялау жүріп жатыр. Жазбаша бұйрық әлі жария порталға шықпаған — портал бүгін қырық минуттай кешігіп тұр.'
      }
    }
  },

  /* ---------- 3 · ЛОВУШКА ПРО ДАМБУ -------------------------
     Заявление истинно всегда, улика — как повезёт. Статья
     подтверждает прорыв, но НЕ говорит ничего про снимок:
     разбираться с фотографией игрок обязан сам.            */
  aqsu_dam: {
    base: {
      source: { en: 'Regional Water Authority', ru: 'Облводхоз', kk: 'Облыссушар' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Gauge station 4 above Aksu lost telemetry at 23:48 after a sharp drop in the upstream reading. Field crews have been dispatched. The authority is not yet commenting on the state of the embankment.',
        ru: 'Водомерный пост №4 выше Ақсу потерял телеметрию в 23:48 после резкого падения показаний выше по течению. На место выехали бригады. Состояние насыпи ведомство пока не комментирует.',
        kk: 'Ақсудан жоғарыдағы №4 су өлшеу бекеті 23:48-де телеметрияны жоғалтты — жоғарғы ағыстағы көрсеткіш күрт төмендеген соң. Бригадалар шықты. Үйінді жағдайына ведомство әзірге түсінік бермейді.'
      }
    },
    ai_photo: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'Warning to editors: a generated flood image is being attached to tonight\'s Aksu reports. A false picture on a true warning is the hardest case there is — checking the photograph tells you nothing about the water.',
        ru: 'Предупреждение редакциям: к сегодняшним сообщениям про Ақсу прикладывают сгенерированное фото паводка. Ложная картинка при истинном предупреждении — самый трудный случай: проверка снимка ничего не говорит о воде.',
        kk: 'Редакцияларға ескерту: бүгінгі Ақсу туралы хабарларға жасанды тасқын суреті тіркелуде. Шын ескертуге жалған сурет — ең қиын жағдай: суретті тексеру су туралы ештеңе айтпайды.'
      }
    },
    other_region: {
      source: { en: 'Regional Water Authority', ru: 'Облводхоз', kk: 'Облыссушар' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Upstream inflow at Aksu exceeded the design figure at 23:40 and the reservoir is discharging uncontrolled. Residents of the lower village should move to the highway on foot rather than wait for transport.',
        ru: 'Приток выше Ақсу в 23:40 превысил проектный, водохранилище сбрасывает неуправляемо. Жителям нижней части посёлка следует выходить к трассе пешком, не дожидаясь транспорта.',
        kk: 'Ақсудан жоғарғы ағын 23:40-та жобалық көрсеткіштен асты, су қоймасы бақылаусыз ағызуда. Ауылдың төменгі бөлігі тұрғындары көлік күтпей, жаяу тас жолға шығуы керек.'
      }
    },
    genuine: {
      source: { en: 'Severnyi Kurier', ru: 'Северный курьер', kk: 'Солтүстік курьер' },
      reputation: 'good', after: 14, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Our stringer in Aksu reports water in the lower lanes and confirms he sent out his own photographs at 23:52. He is on the road to the highway now and is not answering.',
        ru: 'Наш внештатник в Ақсу сообщает о воде на нижних улицах и подтверждает, что в 23:52 отправил собственные снимки. Сейчас он на дороге к трассе и не отвечает.',
        kk: 'Ақсудағы штаттан тыс тілшіміз төменгі көшелерде су бар екенін хабарлап, 23:52-де өз суреттерін жібергенін растайды. Қазір ол тас жолға қарай жолда, жауап бермейді.'
      }
    }
  },

  /* ---------- 4 · «ДАМБА ЦЕЛА» ------------------------------
     Опровержение прорыва. Заявление ложно во всех вариантах.
     Здесь Ерасыл ошибается чаще всего — и один раз статья
     честно тянет его не туда.                              */
  dam_denial: {
    base: {
      source: { en: 'Regional Water Authority', ru: 'Облводхоз', kk: 'Облыссушар' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'The authority has issued no statement on the Aksu embankment tonight. Telemetry from the site has been down since 23:48 and no crew has yet reached the dam on foot.',
        ru: 'Ведомство сегодня не выпускало заявлений о насыпи в Ақсу. Телеметрия с объекта не работает с 23:48, ни одна бригада до дамбы пешком ещё не дошла.',
        kk: 'Ведомство бүгін Ақсу үйіндісі туралы мәлімдеме жасаған жоқ. Нысаннан телеметрия 23:48-ден бері жоқ, бөгетке әлі бірде-бір бригада жетпеген.'
      }
    },
    spoofed: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'The account posting tonight\'s "all clear" is not the authority\'s. The real service channel carries a verification mark and has published nothing since 23:50. Denials are cheaper to fake than warnings and travel just as far.',
        ru: 'Аккаунт, публикующий сегодняшнее «всё спокойно», ведомству не принадлежит. У настоящего канала службы стоит отметка о верификации, и с 23:50 он ничего не публиковал. Опровержения подделывать дешевле, чем предупреждения, а расходятся они так же далеко.',
        kk: 'Бүгінгі «бәрі тыныш» дегенді жариялаған аккаунт ведомствоға тиесілі емес. Нағыз қызмет арнасында растау белгісі бар, ол 23:50-ден бері ештеңе жарияламады. Теріске шығаруды жалғандау ескертуден арзан, ал таралуы сондай алыс.'
      }
    },
    stale_true: {
      source: { en: 'Akimat Press Office', ru: 'Пресс-служба акимата', kk: 'Әкімдік баспасөз қызметі' },
      reputation: 'mixed', date: '19:30', matchesTruth: false,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Evening briefing: the Aksu embankment is holding, the situation is under control, there is no need for residents to leave their homes. The next briefing is scheduled for the morning.',
        ru: 'Вечерний брифинг: насыпь в Ақсу держится, ситуация под контролем, оснований покидать дома у жителей нет. Следующий брифинг — утром.',
        kk: 'Кешкі брифинг: Ақсу үйіндісі берік, жағдай бақылауда, тұрғындардың үйден кетуіне негіз жоқ. Келесі брифинг — таңертең.'
      }
    },
    coordinated: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 14, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'Forty-one accounts posted near-identical wording about "provocateurs" within nine minutes tonight. Thirty-six of them were created this week. Volume is not evidence — it is the cheapest thing on the internet to buy.',
        ru: 'Сорок один аккаунт за девять минут опубликовал сегодня почти одинаковый текст про «провокаторов». Тридцать шесть из них созданы на этой неделе. Массовость — не доказательство, это самое дешёвое, что можно купить в сети.',
        kk: 'Бүгін тоғыз минут ішінде қырық бір аккаунт «арандатушылар» туралы бірдей мәтін жариялады. Олардың отыз алтауы осы аптада ашылған. Көптік — дәлел емес, бұл желіде сатып алуға болатын ең арзан нәрсе.'
      }
    }
  },

  /* ---------- 5 · ВИДЕО СПАСЕНИЯ ---------------------------- */
  rescue_video: {
    base: {
      source: { en: 'Volunteer Corps «Qayyq»', ru: 'Волонтёрский корпус «Қайық»', kk: '«Қайық» волонтёрлер корпусы' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Bestobe', ru: 'Бестобе', kk: 'Бестөбе' },
      text: {
        en: 'Boat 4 has been working the Bestobe roofs since 01:05 and has taken off nine people, including one family of four. The crew is asking for dry blankets at the school, not for money.',
        ru: 'Лодка №4 работает на крышах Бестобе с 01:05, снято девять человек, включая семью из четырёх. Экипаж просит сухие одеяла в школу, а не деньги.',
        kk: '№4 қайық 01:05-тен бері Бестөбе шатырларында жұмыс істеп, тоғыз адамды, оның ішінде төрт адамдық отбасын түсірді. Экипаж ақша емес, мектепке құрғақ көрпе сұрайды.'
      }
    },
    upscaled: {
      source: { en: 'Volunteer Corps «Qayyq»', ru: 'Волонтёрский корпус «Қайық»', kk: '«Қайық» волонтёрлер корпусы' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Bestobe', ru: 'Бестобе', kk: 'Бестөбе' },
      text: {
        en: 'Boat 4 is out at Bestobe tonight and the footage going round is ours. Someone has run it through a sharpening tool to make the hull number readable — the event is real, the crispness is not.',
        ru: 'Лодка №4 сегодня в Бестобе, и кадры, которые ходят по сети, — наши. Кто-то прогнал их через повышение резкости, чтобы читался бортовой номер: событие настоящее, чёткость — нет.',
        kk: '№4 қайық бүгін Бестөбеде, желідегі кадрлар — біздікі. Біреу борт нөмірі оқылсын деп оларды айқындау құралынан өткізген: оқиға нағыз, айқындығы — жоқ.'
      }
    },
    actually_fake: {
      source: { en: 'Volunteer Corps «Qayyq»', ru: 'Волонтёрский корпус «Қайық»', kk: '«Қайық» волонтёрлер корпусы' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Bestobe', ru: 'Бестобе', kk: 'Бестөбе' },
      text: {
        en: 'We do not collect money and we never have. Any post asking for fuel transfers in our name is not ours. Two such posts appeared tonight, both using footage from another region.',
        ru: 'Мы не собираем деньги и никогда не собирали. Любой пост, где от нашего имени просят перевести на топливо, не наш. Сегодня появились два таких, оба с кадрами из другого региона.',
        kk: 'Біз ақша жинамаймыз және ешқашан жинаған емеспіз. Біздің атымыздан жанармайға аударым сұраған кез келген жазба біздікі емес. Бүгін екеуі шықты, екеуі де басқа өңірдің кадрларымен.'
      }
    },
    wrong_place: {
      source: { en: 'Volunteer Corps «Qayyq»', ru: 'Волонтёрский корпус «Қайық»', kk: '«Қайық» волонтёрлер корпусы' },
      reputation: 'good', after: 14, matchesTruth: true,
      city: { en: 'Bestobe', ru: 'Бестобе', kk: 'Бестөбе' },
      text: {
        en: 'To be clear about tonight: boat 4 is assigned to Saryoy and has not been to Bestobe at all. The video is genuine, the crew is ours, the village named under it is wrong.',
        ru: 'Чтобы не было путаницы: лодка №4 сегодня закреплена за Сарыой и в Бестобе не заходила вовсе. Видео подлинное, экипаж наш, посёлок под ним назван не тот.',
        kk: 'Шатаспау үшін: №4 қайық бүгін Сарыойға бекітілген, Бестөбеге мүлде кірген жоқ. Бейне нағыз, экипаж біздікі, ал астында аталған ауыл дұрыс емес.'
      }
    }
  },

  /* ---------- 6 · ДИПФЕЙК АКИМА -----------------------------
     Здесь живёт единственная шутка ночи. Саят Саматович —
     персонаж комедийного сериала «Саке», аким-взяточник; его
     репутация написана в шапке крупными буквами, и статья
     ровно настолько бесполезна, насколько обещает.          */
  akim_deepfake: {
    base: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'The akimat press office states that the akim has given no video address tonight and is at the regional headquarters. A synthetic address timed to the peak of an evacuation is the single most damaging format we track.',
        ru: 'Пресс-служба акимата заявляет: аким сегодня видеообращений не давал и находится в областном штабе. Синтетическое обращение, выпущенное на пике эвакуации, — самый разрушительный формат из всех, что мы отслеживаем.',
        kk: 'Әкімдіктің баспасөз қызметі мәлімдейді: әкім бүгін бейнеүндеу жасаған жоқ, облыстық штабта. Эвакуация шыңында шыққан жасанды үндеу — біз бақылайтын форматтардың ең қиратқышы.'
      }
    },
    voice_swap: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'Voice cloning has outrun face synthesis: a real recording with a substituted soundtrack now passes every test an ordinary viewer can run. Watch the mouth, not the message — and phone the office before you believe either.',
        ru: 'Клонирование голоса обогнало синтез лица: настоящая запись с подменённой дорожкой проходит сегодня все проверки, доступные обычному зрителю. Смотрите на рот, а не на смысл, — и позвоните в приёмную, прежде чем поверить и тому и другому.',
        kk: 'Дауысты клондау бет синтезінен озып кетті: дыбыс жолы ауыстырылған нағыз жазба бүгін қарапайым көрерменнің кез келген тексерісінен өтеді. Мағынаға емес, ерінге қараңыз — сосын қабылдау бөлмесіне қоңырау шалыңыз.'
      }
    },
    /* --- шутка ночи ---------------------------------------- */
    old_reused: {
      source: { en: 'Sayat Samatovich · personal channel', ru: 'Саят Саматович · личный канал', kk: 'Саят Саматович · жеке арна' },
      reputation: 'bad', after: 11, matchesTruth: false,
      city: { en: 'Chapayev district', ru: 'Чапаевский район', kk: 'Чапаев ауданы' },
      text: {
        en: 'Dear residents!!! I personally checked the dam TODAY with my own two eyes (from the car, it was dark, but I checked). Everything is fine. Everything is under control. Whoever is spreading panic — come to my office, we will discuss it, bring your documents. Also the district needs a new fountain, I have already found a contractor, he is my brother-in-law but a very good specialist.',
        ru: 'Уважаемые жители!!! Я лично СЕГОДНЯ своими глазами проверил дамбу (из машины, темно было, но проверил). Всё нормально. Всё под контролем. Кто панику разводит — зайдите ко мне в кабинет, обсудим, документы захватите. И ещё: району нужен новый фонтан, подрядчика я уже нашёл, он мой свояк, но очень хороший специалист.',
        kk: 'Құрметті тұрғындар!!! Мен БҮГІН бөгетті өз көзіммен тексердім (көліктен, қараңғы еді, бірақ тексердім). Бәрі жақсы. Бәрі бақылауда. Кім үрей таратып жүр — кабинетіме кіріңіз, талқылаймыз, құжаттарыңызды ала келіңіз. Тағы: ауданға жаңа субұрқақ керек, мердігерді таптым, ол менің бажам, бірақ өте жақсы маман.'
      }
    },
    audio_only: {
      source: { en: 'Sayat Samatovich · personal channel', ru: 'Саят Саматович · личный канал', kk: 'Саят Саматович · жеке арна' },
      reputation: 'bad', after: 14, matchesTruth: false,
      city: { en: 'Chapayev district', ru: 'Чапаевский район', kk: 'Чапаев ауданы' },
      text: {
        en: 'Colleagues, I am being sent some recording where allegedly I say something. First of all, that is not my voice. Second of all, if it is my voice, it was taken out of context. Third of all, I was not even there. I am currently on a working trip and cannot comment further, my phone is dying.',
        ru: 'Коллеги, мне присылают какую-то запись, где я якобы что-то говорю. Во-первых, это не мой голос. Во-вторых, если это мой голос, то вырвано из контекста. В-третьих, меня там вообще не было. Я сейчас в рабочей поездке и комментировать больше не могу, телефон садится.',
        kk: 'Әріптестер, маған әлдебір жазба жіберіп жатыр, онда мен бірдеңе айтыпты. Біріншіден, бұл менің дауысым емес. Екіншіден, егер менің дауысым болса, контекстен жұлып алынған. Үшіншіден, мен онда мүлде болған жоқпын. Қазір іссапардамын, түсінік бере алмаймын, телефон отырып барады.'
      }
    }
  },

  /* ---------- 8 · ВОДА ИЗ КОЛОНКИ ---------------------------
     Единственный акт, где правильный ответ переворачивается, —
     поэтому статья здесь обязана давать не вывод, а критерий:
     чем настоящее предписание отличается от страшилки.      */
  water_scare: {
    base: {
      source: { en: 'Regional Health Service', ru: 'Санэпидслужба области', kk: 'Облыстық санэпидқызмет' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Standing rule for flood season: a contamination result takes eighteen hours in the laboratory. Any warning issued within an hour of the flooding is not based on one. Genuine advisories carry an order number and a signature.',
        ru: 'Постоянное правило на паводок: анализ на заражение делается в лаборатории восемнадцать часов. Любое предупреждение, выпущенное в течение часа после подтопления, на нём не основано. У настоящих предписаний есть номер и подпись.',
        kk: 'Тасқын маусымына тұрақты ереже: ластануға талдау зертханада он сегіз сағат жасалады. Су басқаннан кейін бір сағат ішінде шыққан кез келген ескерту оған сүйенбейді. Нағыз нұсқауларда нөмір мен қолтаңба болады.'
      }
    },
    farm_runoff: {
      source: { en: 'Regional Water Authority', ru: 'Облводхоз', kk: 'Облыссушар' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Reminder on the Saryoy intake: it draws from above the settlement. Everything downstream of the village — the farm included — is downstream of the intake as well and cannot enter the line.',
        ru: 'Напоминание по водозабору Сарыой: он берёт воду выше посёлка. Всё, что ниже посёлка по течению, включая ферму, находится ниже водозабора и в трубу попасть не может.',
        kk: 'Сарыой су алғышы туралы еске салу: ол ауылдан жоғарыдан су алады. Ауылдан төмен ағыстағының бәрі, ферманы қоса, су алғыштан төмен және құбырға түсе алмайды.'
      }
    },
    real_boil: {
      source: { en: 'Regional Health Service', ru: 'Санэпидслужба области', kk: 'Облыстық санэпидқызмет' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Order No. 71-s appears in tonight\'s public register: boil-water advisory for Saryoy on turbidity grounds, with delivery to the school yard from 01:00. Turbidity is measured on site in minutes and does not require a laboratory.',
        ru: 'Распоряжение №71-с значится в сегодняшнем открытом реестре: предписание кипятить воду в Сарыой по мутности, с подвозом к школьному двору с 01:00. Мутность меряется на месте за минуты и лаборатории не требует.',
        kk: '№71-с өкім бүгінгі ашық тізілімде тұр: Сарыойда лайлылық бойынша суды қайнату нұсқауы, 01:00-ден мектеп ауласына жеткізумен. Лайлылық орнында минутта өлшенеді, зертхана қажет емес.'
      }
    }
  },

  /* ---------- 9 · МАРОДЁРЫ ---------------------------------- */
  looting: {
    base: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'The looting scare is the most reliable template in flood disinformation and always ends the same way: leave one adult behind. We logged the identical text in Atyrau in April and in two other regions before that.',
        ru: 'Страшилка про мародёров — самый надёжный шаблон паводковой дезинформации, и заканчивается она всегда одинаково: оставьте одного взрослого. Тот же текст мы зафиксировали в Атырау в апреле и до этого ещё в двух регионах.',
        kk: 'Тонаушылар туралы қорқыныш — тасқын дезинформациясының ең сенімді үлгісі, әрі әрқашан бірдей аяқталады: бір ересек қалдырыңдар. Дәл сол мәтінді сәуірде Атырауда, оған дейін тағы екі өңірде тіркедік.'
      }
    },
    address_list: {
      source: { en: 'Talap rural council', ru: 'Сельский акимат Талап', kk: 'Талап ауылдық әкімдігі' },
      reputation: 'mixed', after: 8, matchesTruth: true,
      city: { en: 'Talap', ru: 'Талап', kk: 'Талап' },
      text: {
        en: 'We are being asked about a list of addresses. The upper lane has house numbers 1 to 27 with gaps; several of the numbers in that list have never existed here. We are not commenting further tonight, we have people to move.',
        ru: 'Нас спрашивают про список адресов. На верхней улице номера с 1 по 27 с пропусками; нескольких номеров из того списка здесь никогда не было. Больше сегодня не комментируем, нам людей вывозить.',
        kk: 'Бізден мекенжайлар тізімі туралы сұрап жатыр. Жоғарғы көшеде нөмірлер 1-ден 27-ге дейін, үзілістермен; ол тізімдегі бірнеше нөмір мұнда ешқашан болмаған. Бүгін бұдан артық түсінік бермейміз, адам шығаруымыз керек.'
      }
    },
    real_patrol: {
      source: { en: 'Regional Police Press Office', ru: 'Пресс-служба полиции области', kk: 'Облыс полициясының баспасөз қызметі' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Report No. 2214 is on the duty register, filed 01:02, two crews assigned to the emptied streets of Talap until the evacuation closes. Residents are asked not to return for property.',
        ru: 'Рапорт №2214 значится в журнале дежурной части, подан в 01:02, два экипажа закреплены за освобождёнными улицами Талап до конца эвакуации. Жителей просят не возвращаться за имуществом.',
        kk: '№2214 рапорт кезекші бөлім журналында тұр, 01:02-де берілген, екі экипаж эвакуация аяқталғанша Талаптың босаған көшелеріне бекітілген. Тұрғындардан мүлік үшін қайтпауды сұрайды.'
      }
    }
  },

  /* ---------- 7 · БІРЛІК ----------------------------------
     Заявление принципиально непроверяемо. Честная статья это
     и говорит — и тем самым учит главному: «нечем проверить»
     тоже бывает ответом.                                    */
  togyzaq: {
    base: {
      source: { en: 'Severnyi Kurier', ru: 'Северный курьер', kk: 'Солтүстік курьер' },
      reputation: 'good', after: 5, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'Birlik has been without mobile coverage since 02:05 and the access track is under water. We have no correspondent there, the emergency service has no crew there, and nobody we called can confirm or deny anything about the village tonight.',
        ru: 'Бірлік без мобильной связи с 02:05, подъездная грунтовка под водой. Корреспондента у нас там нет, бригады у службы там нет, и никто из тех, кому мы дозвонились, не может сегодня ни подтвердить, ни опровергнуть ничего про этот посёлок.',
        kk: 'Бірлікте 02:05-тен бері ұялы байланыс жоқ, кіреберіс жол су астында. Ол жерде тілшіміз де, қызметтің бригадасы да жоқ, ал біз хабарласқандардың ешқайсысы бүгін бұл ауыл туралы ештеңені растай да, теріске шығара да алмайды.'
      }
    },
    echo: {
      source: { en: 'Steppe Fact Desk', ru: 'Дала. Проверка фактов', kk: 'Дала. Дерек тексеру' },
      reputation: 'good', after: 8, matchesTruth: true,
      city: { en: 'Astana', ru: 'Астана', kk: 'Астана' },
      text: {
        en: 'Two accounts describing Birlik tonight quote each other. Neither adds a fact the other did not already carry. Repetition raises the felt weight of a claim without adding a gram of evidence to it — this is the oldest effect in the field.',
        ru: 'Два аккаунта, описывающие сегодня Бірлік, ссылаются друг на друга. Ни один не добавляет факта, которого не было бы у другого. Повтор поднимает ощущаемый вес заявления, не добавляя к нему ни грамма доказательств, — это старейший эффект в предмете.',
        kk: 'Бүгін Бірлік туралы жазған екі аккаунт бір-біріне сілтейді. Ешқайсысы екіншісінде жоқ дерек қоспайды. Қайталау мәлімдеменің салмағын сезімде арттырады, бірақ оған бір грамм дәлел қоспайды — бұл саладағы ең көне әсер.'
      }
    },
    with_photo: {
      source: { en: 'Severnyi Kurier', ru: 'Северный курьер', kk: 'Солтүстік курьер' },
      reputation: 'good', after: 11, matchesTruth: true,
      city: { en: 'Petropavl', ru: 'Петропавл', kk: 'Петропавл' },
      text: {
        en: 'A photograph attached to a claim about Birlik can be checked. Whether anyone reached the village cannot — not from here, not tonight. Those are two different questions and they deserve two different answers.',
        ru: 'Фотографию, приложенную к сообщению про Бірлік, проверить можно. Дошёл ли кто-нибудь до посёлка — нельзя: ни отсюда, ни сегодня. Это два разных вопроса, и они заслуживают двух разных ответов.',
        kk: 'Бірлік туралы хабарға тіркелген суретті тексеруге болады. Ауылға біреу жетті ме — жоқ: мұнда да, бүгін де. Бұл екі бөлек сұрақ және екі бөлек жауапқа лайық.'
      }
    }
  }
};

/* Разложить статьи по вариантам. Отдельным проходом, а не
   внутри контента: так статья остаётся снимаемым слоем, и
   выверенные акты никто не трогает. */
(function attach() {
  if (!AQ.SCENARIO || !AQ.NIGHT) return;
  AQ.SCENARIO.ensureActs(AQ.NIGHT).forEach(function (a) {
    var pack = AQ.ARTICLES[a.id];
    if (!pack) return;
    a.variants.forEach(function (v) {
      var art = pack[v.vid || 'base'];
      if (art && v.senim) v.senim.article = art;
    });
  });
})();
