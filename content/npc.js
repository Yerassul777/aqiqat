/* ============================================================
   AQIQAT — АНДРЕЙ И АЛИ
   ------------------------------------------------------------
   Два человека, которых можно отправить в район. Они не дают
   ответа — они приносят то, что инструменты принести не могут:
   что люди ГОВОРЯТ и что на месте ВИДНО.

     Андрей ходит по дворам и стучится в двери. Он приносит
     молву: кто что слышал, от кого, когда. Молва бывает
     точнее документа и бывает пустой — это её свойство, а не
     недостаток.

     Али идёт смотреть сам. Он приносит наблюдение: стоит ли
     машина, есть ли вода на улице, горит ли свет. Он не умеет
     объяснять, он умеет только рассказать, что видел.

   ПРАВИЛО НАВОДКИ: ни один текст здесь не произносит слов
   «фейк» и «правда». Наводка сдвигает вероятность, а вердикт
   остаётся работой игрока — иначе за двенадцать монет он купил
   бы себе ответ, и вся игра свелась бы к «есть ли деньги».

   Наводки привязаны к акту. Там, где правильный ответ
   переворачивается от варианта к варианту (спасение, вода,
   мародёры), они привязаны к варианту — иначе Андрей врал бы
   в половине ночей.

   ПРАВИЛО СЕТТИНГА: посёлки и люди ВЫМЫШЛЕНЫ.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.NPCS = [
  { id: 'andrey', name: { en: 'Andrey', ru: 'Андрей', kk: 'Андрей' },
    role: { en: 'knocks on doors', ru: 'обходит дворы', kk: 'үйлерді аралайды' } },
  { id: 'ali', name: { en: 'Ali', ru: 'Али', kk: 'Али' },
    role: { en: 'goes and looks', ru: 'едет и смотрит', kk: 'барып көреді' } }
];

AQ.NPCHINTS = {

  bridge: {
    andrey: {
      en: 'A driver in Qarasu says he came over the M-36 at half past ten and there was nothing wrong with it. He also says half the street is already packing because of that photo.',
      ru: 'Водитель в Қарасу говорит, что проехал по М-36 в половине одиннадцатого и всё с ним было в порядке. Ещё говорит, полулицы уже собирает вещи из-за того фото.',
      kk: 'Қарасудағы жүргізуші М-36 арқылы он жарымда өткенін, көпірде ешқандай ақау болмағанын айтады. Тағы айтады: сол сурет салдарынан жарты көше зат жинай бастаған.'
    },
    ali: {
      en: 'I got as far as the bridge approach. There are headlights crossing it right now, both ways. No barrier, no crew, no crowd standing about — nothing like a collapse site.',
      ru: 'Доехал до съезда на мост. Прямо сейчас по нему идут фары, в обе стороны. Ни шлагбаума, ни бригады, ни толпы вокруг — на место обрушения не похоже совсем.',
      kk: 'Көпірге кірер жерге дейін жеттім. Дәл қазір ол арқылы екі бағытта фаралар өтіп жатыр. Шлагбаум да, бригада да, жиналған халық та жоқ — құлау орнына мүлде ұқсамайды.'
    }
  },

  evac_qarasu: {
    andrey: {
      en: 'The school caretaker in Qarasu has the buses on her list and she has been told to open the yard at one. She has not seen any paper herself — she got a phone call.',
      ru: 'У завхоза школы в Қарасу автобусы записаны, и ей велели открыть двор к часу. Бумаги она сама не видела — ей позвонили.',
      kk: 'Қарасудағы мектеп шаруашылық меңгерушісінің тізімінде автобустар бар, оған ауланы бірге ашуды тапсырған. Қағазды өзі көрмеген — оған қоңырау шалған.'
    },
    ali: {
      en: 'Two buses are standing at the Qarasu school yard with the engines running. Nobody is loading yet. The drivers say they were sent from the depot and are waiting for someone to say go.',
      ru: 'Во дворе школы в Қарасу стоят два автобуса с заведёнными моторами. Никто пока не грузится. Водители говорят, их отправили с автобазы и они ждут, чтобы кто-нибудь сказал «поехали».',
      kk: 'Қарасу мектебінің ауласында моторы қосулы екі автобус тұр. Әзірге ешкім тиелмейді. Жүргізушілер оларды автобазадан жібергенін, біреу «жүр» дегенін күтіп тұрғанын айтады.'
    }
  },

  aqsu_dam: {
    andrey: {
      en: 'Nobody in Aksu is arguing about whether it happened. The lower lane has water in it and they can hear it. What they are arguing about is whether the photo going round is theirs.',
      ru: 'В Ақсу никто не спорит, случилось ли. На нижней улице вода, и её слышно. Спорят там о другом — их ли то фото, что ходит по сети.',
      kk: 'Ақсуда болды ма деп ешкім дауласпайды. Төменгі көшеде су бар, оны естіп тұр. Олардың дауласатыны басқа — желіде жүрген сурет солардікі ме.'
    },
    ali: {
      en: 'I could not get closer than the turn. There is water across the road where there was none two hours ago, and it is moving. I did not see the dam itself.',
      ru: 'Ближе поворота не подобрался. Через дорогу идёт вода там, где два часа назад её не было, и она движется. Саму дамбу я не видел.',
      kk: 'Бұрылыстан жақын бара алмадым. Екі сағат бұрын су болмаған жерде жол арқылы су ағып жатыр, әрі қозғалып тұр. Бөгеттің өзін көрмедім.'
    }
  },

  dam_denial: {
    andrey: {
      en: 'Nobody at the akimat picked up. The duty man at the water office did, and he said flatly that they have not put out any statement tonight and would not know what to put out.',
      ru: 'В акимате трубку никто не взял. В облводхозе дежурный взял и сказал прямо: никаких заявлений сегодня они не выпускали и не знали бы, что выпускать.',
      kk: 'Әкімдікте телефонды ешкім алмады. Облыссушарда кезекші алды да, бүгін ешқандай мәлімдеме шығармағанын, әрі не шығаруды білмейтінін тура айтты.'
    },
    ali: {
      en: 'The water office windows are lit and there are three cars outside. Somebody is working. Nobody came out to talk to me.',
      ru: 'В облводхозе горит свет, у входа три машины. Кто-то работает. Ко мне никто не вышел.',
      kk: 'Облыссушарда жарық жанып тұр, кіреберісте үш көлік. Біреу жұмыс істеп жатыр. Маған ешкім шыққан жоқ.'
    }
  },

  rescue_video: {
    andrey: {
      en: 'The volunteers are real and they are out tonight — everyone in Bestobe knows the boat. What people cannot agree on is where it has actually been working.',
      ru: 'Волонтёры настоящие и сегодня работают — лодку в Бестобе знают все. Люди не сходятся в другом: где именно она была.',
      kk: 'Волонтёрлер нағыз және бүгін жұмыс істеп жүр — қайықты Бестөбеде бәрі біледі. Адамдар басқа нәрседе келіспейді: ол нақты қай жерде болды.'
    },
    ali: {
      en: 'There is a boat working the roofs. I saw it from the embankment, but not close enough to read anything on the hull.',
      ru: 'Лодка на крышах работает. Видел с насыпи, но не настолько близко, чтобы прочитать что-то на борту.',
      kk: 'Шатырларда қайық жұмыс істеп жүр. Үйіндіден көрдім, бірақ бортта не жазылғанын оқитындай жақын емес.'
    },
    byVid: {
      actually_fake: {
        andrey: {
          en: 'The volunteers say straight out that they never ask for money, and that somebody is collecting in their name tonight. They are angry about it.',
          ru: 'Волонтёры говорят прямо: денег они никогда не просят, а сегодня кто-то собирает от их имени. Они на это злятся.',
          kk: 'Волонтёрлер тура айтады: ақша ешқашан сұрамайды, ал бүгін біреу солардың атынан жинап жүр. Оған ашулы.'
        },
        ali: {
          en: 'I asked at the school where the crews come in. Nobody has seen that particular clip happen here, and two of them said the water in it is the wrong colour for our river.',
          ru: 'Спросил в школе, куда заходят экипажи. Никто не видел, чтобы этот ролик снимали здесь, а двое сказали, что вода в нём не того цвета, что у нашей реки.',
          kk: 'Экипаждар кіретін мектепте сұрадым. Бұл роликті мұнда түсіргенін ешкім көрмеген, екеуі ондағы судың біздің өзеннің түсіне келмейтінін айтты.'
        }
      },
      wrong_place: {
        andrey: {
          en: 'People in Bestobe say no boat has come to them at all tonight. They are asking why a video of a rescue in their village is going round when nobody here has been rescued.',
          ru: 'В Бестобе говорят, что к ним сегодня лодка вообще не приходила. Спрашивают, почему по сети ходит видео спасения в их посёлке, если тут никого не спасали.',
          kk: 'Бестөбеде бүгін оларға қайық мүлде келмегенін айтады. Мұнда ешкімді құтқармаса, олардың ауылындағы құтқару видеосы неге тарап жүр деп сұрайды.'
        },
        ali: {
          en: 'The crews are working, but the boats I saw were on the Saryoy side. I drove the Bestobe lane twice and it was empty water.',
          ru: 'Экипажи работают, но лодки, что я видел, были со стороны Сарыой. По бестобинской улице проехал дважды — там пустая вода.',
          kk: 'Экипаждар жұмыс істеп жүр, бірақ мен көрген қайықтар Сарыой жағында еді. Бестөбе көшесімен екі рет өттім — онда бос су.'
        }
      }
    }
  },

  akim_deepfake: {
    andrey: {
      en: 'His secretary answered on the third try. She says he has been at the regional headquarters since eleven and has not recorded anything for anyone tonight.',
      ru: 'Секретарь ответила с третьего раза. Говорит, он в областном штабе с одиннадцати и сегодня ничего никому не записывал.',
      kk: 'Хатшысы үшінші рет жауап берді. Айтуынша, ол он бірден бері облыстық штабта, бүгін ешкімге ештеңе жазып бермеген.'
    },
    ali: {
      en: 'I went to the akimat. The office he sits in is dark and the car is not in the yard. The duty officer would not say where he is.',
      ru: 'Съездил в акимат. Кабинет, где он сидит, тёмный, машины во дворе нет. Дежурный не стал говорить, где он.',
      kk: 'Әкімдікке бардым. Ол отыратын кабинет қараңғы, көлік ауладан жоқ. Кезекші оның қайда екенін айтпады.'
    }
  },

  togyzaq: {
    andrey: {
      en: 'I could not reach anyone in Birlik at all. Two people in the next village have relatives there and neither has got through since about three. That is not the same as nothing being wrong.',
      ru: 'До Бірлік дозвониться не смог вообще. У двоих в соседнем посёлке там родня, и ни один не дозвонился примерно с трёх. Это не то же самое, что «ничего не случилось».',
      kk: 'Бірлікке мүлде хабарласа алмадым. Көрші ауылдағы екі адамның ол жақта туысы бар, екеуі де шамамен үштен бері хабарласа алмаған. Бұл «ештеңе болмаған» дегенмен бір емес.'
    },
    ali: {
      en: 'The track to Birlik is under water about four kilometres out. I turned back. I cannot tell you what is happening there and neither can anyone else from this side.',
      ru: 'Грунтовка на Бірлік под водой примерно с четвёртого километра. Развернулся. Что там происходит, сказать не могу — и никто с этой стороны не может.',
      kk: 'Бірлікке баратын жол шамамен төртінші шақырымнан су астында. Кері бұрылдым. Онда не болып жатқанын айта алмаймын — бұл жақтан ешкім айта алмайды.'
    }
  },

  water_scare: {
    andrey: {
      en: 'Half of Saryoy has stopped drinking from the pump and the other half never uses it anyway. Nobody I spoke to has actually been ill. The word going round came from the post, not from anyone\'s stomach.',
      ru: 'Полсарыой перестало пить из колонки, вторая половина ей и так не пользуется. Ни один из тех, с кем я говорил, не заболел. Молва пошла от поста, а не от чьего-то живота.',
      kk: 'Сарыойдың жартысы колонкадан су ішуді қойды, қалған жартысы оны бәрібір пайдаланбайды. Сөйлескендерімнің бірде-біреуі ауырмаған. Сөз жазбадан тарады, ешкімнің ішінен емес.'
    },
    ali: {
      en: 'I stood at the pump for ten minutes. The water runs clear and there is no smell. That is not a test — I am telling you what I saw, not what is in it.',
      ru: 'Постоял у колонки минут десять. Вода идёт прозрачная, запаха нет. Это не анализ — я говорю, что видел, а не что в ней.',
      kk: 'Колонканың жанында он минуттай тұрдым. Су мөлдір ағады, иіс жоқ. Бұл талдау емес — не көргенімді айтамын, ішінде не бар екенін емес.'
    },
    byVid: {
      real_boil: {
        andrey: {
          en: 'The school caretaker has been told to expect a water truck at one, and she has the order number written on her hand. She says the man who called her also reads out the bus times.',
          ru: 'Завхозу школы велели ждать водовозку к часу, и номер распоряжения у неё записан на руке. Говорит, тот же человек по телефону зачитывает и время автобусов.',
          kk: 'Мектеп шаруашылық меңгерушісіне бірде су таситын көлікті күтуді айтқан, өкім нөмірі қолына жазулы. Айтуынша, телефон шалған адам автобус уақытын да оқып береді.'
        },
        ali: {
          en: 'The water in the pump is cloudy tonight, properly cloudy — you can see it in a glass. That is the flood silt. It is not the same thing as poison, but it is real and it is visible.',
          ru: 'Вода в колонке сегодня мутная, по-настоящему мутная — в стакане видно. Это паводковая муть. Это не то же, что отрава, но это настоящее и это видно.',
          kk: 'Колонкадағы су бүгін лай, шынымен лай — стақанда көрінеді. Бұл тасқын лайы. Улану емес, бірақ бұл нағыз әрі көзге көрінеді.'
        }
      }
    }
  },

  looting: {
    andrey: {
      en: 'I knocked on eleven doors on the upper lane. Nine were empty and locked, exactly as they were left. Nobody I found had seen a van, but everybody had read about one.',
      ru: 'Постучал в одиннадцать дверей на верхней улице. Девять пустые и заперты, ровно как их оставили. Никто из тех, кого нашёл, газели не видел, но про неё читали все.',
      kk: 'Жоғарғы көшеде он бір есікті қақтым. Тоғызы бос әрі құлыптаулы, қалдырылған күйінде. Тапқандарымның бірде-біреуі көлікті көрмеген, бірақ ол туралы бәрі оқыған.'
    },
    ali: {
      en: 'I drove the upper lane twice. No vans, no broken gates, no lights in the empty houses. I am not saying nothing can happen — I am saying nothing is happening at this minute.',
      ru: 'Проехал по верхней улице дважды. Ни газелей, ни сломанных ворот, ни света в пустых домах. Я не говорю, что ничего не может случиться, — говорю, что сейчас ничего не происходит.',
      kk: 'Жоғарғы көшемен екі рет өттім. Көлік те, сынған қақпа да, бос үйлерде жарық та жоқ. Ештеңе бола алмайды демеймін — дәл қазір ештеңе болып жатқан жоқ деймін.'
    },
    byVid: {
      real_patrol: {
        andrey: {
          en: 'People on the upper lane have seen the patrol car and they mention it themselves before I ask. One woman says the crew knocked and told her to go to the buses.',
          ru: 'На верхней улице патрульную машину видели и сами про неё говорят, ещё до моего вопроса. Одна женщина сказала, что экипаж постучал и велел идти к автобусам.',
          kk: 'Жоғарғы көшеде патруль көлігін көрген, мен сұрамай тұрып өздері айтады. Бір әйел экипаж есікті қағып, автобусқа баруды айтқанын жеткізді.'
        },
        ali: {
          en: 'There is a patrol car parked at the top of the lane with its lights on low. I walked up to it. Two officers, both bored, both real.',
          ru: 'В начале улицы стоит патрульная машина с приглушёнными фарами. Подошёл к ней. Два сотрудника, обоим скучно, оба настоящие.',
          kk: 'Көшенің басында фарасы бәсеңдетілген патруль көлігі тұр. Жанына бардым. Екі қызметкер, екеуі де зеріккен, екеуі де нағыз.'
        }
      }
    }
  }
};

/* Наводка для конкретного входящего: вариант перебивает акт. */
AQ.npcHint = function (npcId, it) {
  var pack = AQ.NPCHINTS[it.id];
  if (!pack) return null;
  var byVid = pack.byVid && pack.byVid[it.vid];
  if (byVid && byVid[npcId]) return byVid[npcId];
  return pack[npcId] || null;
};
