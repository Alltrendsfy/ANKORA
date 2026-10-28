/**
 * Ankora i18n system supporting 12 languages with full translations for
 * pt-BR, en, it, uk, and ar (with RTL support) as requested by the PRD.
 */

export type SupportedLanguage = 
  | 'pt-BR'
  | 'pt-PT'
  | 'es'
  | 'en'
  | 'de'
  | 'fr'
  | 'it'
  | 'ro'
  | 'hy'
  | 'uk'
  | 'ar'
  | 'tr';

export interface LanguageMeta {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'pt-BR', label: 'Português (Brasil)', nativeLabel: 'Português (Brasil)', dir: 'ltr' },
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'it', label: 'Italiano', nativeLabel: 'Italiano', dir: 'ltr' },
  { code: 'uk', label: 'Ucraniano', nativeLabel: 'Українська', dir: 'ltr' },
  { code: 'ar', label: 'Árabe', nativeLabel: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Espanhol', nativeLabel: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Francês', nativeLabel: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Alemão', nativeLabel: 'Deutsch', dir: 'ltr' },
  { code: 'pt-PT', label: 'Português (Portugal)', nativeLabel: 'Português (Portugal)', dir: 'ltr' },
  { code: 'ro', label: 'Romeno', nativeLabel: 'Română', dir: 'ltr' },
  { code: 'tr', label: 'Turco', nativeLabel: 'Türkçe', dir: 'ltr' },
  { code: 'hy', label: 'Armênio', nativeLabel: 'Հայերեն', dir: 'ltr' },
];

export interface HelpCardPhrases {
  help: { it: string; tr: string };
  noItalian: { it: string; tr: string };
  takeMe: { it: string; tr: string };
  call112: { it: string; tr: string };
}

export interface TranslationDictionary {
  demoBanner: string;
  demoFootnote: string;
  
  // Profile / Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  chooseLanguage: string;
  statusQuestion: string;
  statusTraveling: string;
  statusLiving: string;
  nationalityQuestion: string;
  nationalityPreferNot: string;
  safeguardQuestion: string;
  safeguardHelper: string;
  yes: string;
  no: string;
  continueBtn: string;
  saveBtn: string;
  
  // Home
  locationOff: string;
  needHelp: string;
  call112: string;
  call112Sub: string;
  verifiedDataNote: string;
  profileSettings: string;
  aboutData: string;
  
  // Destinations List
  destinationsTitle: string;
  tabWaitingAreas: string;
  tabMyConsulate: string;
  tabOtherEmbassies: string;
  showAll: string;
  showClosest3: string;
  noMissionsFound: string;
  outsideItalyPrefix: string;
  badgeVerified: string;
  badgeVerifying: string;
  badgeLimited: string;
  callBtn: string;
  waitingAreaLabel: string;
  careerConsulate: string;
  honoraryConsulate: string;
  embassy: string;
  
  // Detail
  detailTitle: string;
  compassNeedle: string;
  compassCalibrating: string;
  enableCompassIOS: string;
  compassAllowed: string;
  openMapRoute: string;
  openMapRouteNote: string;
  showHelpCard: string;
  addressLabel: string;
  distanceLabel: string;
  directionLabel: string;
  
  // Help Card
  helpCardTitle: string;
  helpCardSub: string;
  helpCardValidationNotice: string;
  closeHelpCard: string;
  showToDriver: string;
  
  // Cardinal directions
  north: string;
  northeast: string;
  east: string;
  southeast: string;
  south: string;
  southwest: string;
  west: string;
  northwest: string;
  
  // Settings & Simulation
  settingsTitle: string;
  simulateLocation: string;
  simulateRealGPS: string;
  simulatePiazzaGrande: string;
  simulateTrainStation: string;
  simulateRomeCenter: string;
  installApp: string;
  offlineReady: string;
  offlineBanner: string;
  
  // Help phrases
  phrases: HelpCardPhrases;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  'pt-BR': {
    demoBanner: 'DEMO — não use em emergência real',
    demoFootnote: 'Dados para demonstração. Não usar em emergência real.',
    onboardingTitle: 'Configuração Inicial',
    onboardingSubtitle: 'Todas as preferências ficam salvas apenas no seu aparelho e funcionam sem conexão.',
    chooseLanguage: 'Idioma do aplicativo',
    statusQuestion: 'Você está…',
    statusTraveling: 'Viajando pela Europa',
    statusLiving: 'Morando na Itália',
    nationalityQuestion: 'Sua nacionalidade',
    nationalityPreferNot: 'Prefiro não dizer',
    safeguardQuestion: 'Mostrar o consulado do seu país como destino?',
    safeguardHelper: 'Algumas pessoas preferem não procurar o próprio consulado. Você pode mudar isso depois.',
    yes: 'Sim',
    no: 'Não',
    continueBtn: 'Começar',
    saveBtn: 'Salvar alterações',
    locationOff: 'Localização desligada',
    needHelp: 'Preciso de ajuda',
    call112: 'Ligar 112',
    call112Sub: 'Ligue 112 — emergência na Europa',
    verifiedDataNote: 'Dados verificados em 28/10/2026 · Pacote Itália/Modena',
    profileSettings: 'Perfil & Configurações',
    aboutData: 'Sobre os dados',
    destinationsTitle: 'Destinos mais próximos',
    tabWaitingAreas: 'Áreas de espera',
    tabMyConsulate: 'Seu consulado',
    tabOtherEmbassies: 'Outras missões',
    showAll: 'Ver todos os locais',
    showClosest3: 'Mostrar 3 mais próximos',
    noMissionsFound: 'Nenhuma missão encontrada para o país selecionado.',
    outsideItalyPrefix: 'Atende a Itália a partir de',
    badgeVerified: 'Verificado',
    badgeVerifying: 'Endereço em verificação — ligue antes',
    badgeLimited: 'Serviço limitado — ligue antes de ir',
    callBtn: 'Ligar',
    waitingAreaLabel: 'Área de espera da Proteção Civil',
    careerConsulate: 'Consulado de carreira',
    honoraryConsulate: 'Consulado honorário',
    embassy: 'Embaixada',
    detailTitle: 'Destino',
    compassNeedle: 'Aponte o topo do celular na direção da seta',
    compassCalibrating: 'Calibrando bússola…',
    enableCompassIOS: 'Ativar sensor de bússola',
    compassAllowed: 'Bússola ativa',
    openMapRoute: 'Abrir rota no mapa',
    openMapRouteNote: '(requer internet)',
    showHelpCard: 'Mostrar cartão de ajuda',
    addressLabel: 'Endereço oficial',
    distanceLabel: 'Distância calculada',
    directionLabel: 'Direção',
    helpCardTitle: 'Cartão de Ajuda',
    helpCardSub: 'Mostre esta tela para um taxista, policial ou passante',
    helpCardValidationNotice: '[DEMO] Traduções a validar por tradutor profissional.',
    closeHelpCard: 'Fechar cartão',
    showToDriver: 'Mostre este cartão',
    north: 'Norte',
    northeast: 'Nordeste',
    east: 'Leste',
    southeast: 'Sudeste',
    south: 'Sul',
    southwest: 'Sudoeste',
    west: 'Oeste',
    northwest: 'Noroeste',
    settingsTitle: 'Configurações & Testes',
    simulateLocation: 'Simular localização (teste sem GPS)',
    simulateRealGPS: 'Usar GPS real do aparelho',
    simulatePiazzaGrande: 'Piazza Grande, Modena',
    simulateTrainStation: 'Estação ferroviária de Modena',
    simulateRomeCenter: 'Roma, centro',
    installApp: 'Instalar no celular',
    offlineReady: 'Pronto para uso offline',
    offlineBanner: 'Modo offline ativo — dados carregados da memória local.',
    phrases: {
      help: {
        it: 'Ho bisogno di aiuto.',
        tr: 'Preciso de ajuda.',
      },
      noItalian: {
        it: 'Non parlo italiano.',
        tr: 'Não falo italiano.',
      },
      takeMe: {
        it: 'Mi può portare a questo indirizzo, per favore?',
        tr: 'Pode me levar a este endereço, por favor?',
      },
      call112: {
        it: 'Per favore, chiami il 112.',
        tr: 'Por favor, ligue para o 112.',
      },
    },
  },

  en: {
    demoBanner: 'DEMO — do not use in a real emergency',
    demoFootnote: 'Demonstration data only. Do not use in a real emergency.',
    onboardingTitle: 'Initial Setup',
    onboardingSubtitle: 'All preferences remain strictly on your device and work completely offline.',
    chooseLanguage: 'App language',
    statusQuestion: 'You are…',
    statusTraveling: 'Traveling through Europe',
    statusLiving: 'Living in Italy',
    nationalityQuestion: 'Your nationality',
    nationalityPreferNot: 'Prefer not to say',
    safeguardQuestion: 'Show your country’s consulate as a destination?',
    safeguardHelper: 'Some people prefer not to seek out their own consulate. You can change this later.',
    yes: 'Yes',
    no: 'No',
    continueBtn: 'Get started',
    saveBtn: 'Save changes',
    locationOff: 'Location disabled',
    needHelp: 'I need help',
    call112: 'Call 112',
    call112Sub: 'Call 112 — European emergency number',
    verifiedDataNote: 'Data verified on 28/10/2026 · Italy/Modena package',
    profileSettings: 'Profile & Settings',
    aboutData: 'About the data',
    destinationsTitle: 'Closest destinations',
    tabWaitingAreas: 'Waiting areas',
    tabMyConsulate: 'Your consulate',
    tabOtherEmbassies: 'Other missions',
    showAll: 'View all locations',
    showClosest3: 'Show 3 closest',
    noMissionsFound: 'No mission found for the selected country.',
    outsideItalyPrefix: 'Serves Italy from',
    badgeVerified: 'Verified',
    badgeVerifying: 'Address verifying — call before going',
    badgeLimited: 'Limited service — call before going',
    callBtn: 'Call',
    waitingAreaLabel: 'Civil Protection waiting area',
    careerConsulate: 'Career consulate',
    honoraryConsulate: 'Honorary consulate',
    embassy: 'Embassy',
    detailTitle: 'Destination',
    compassNeedle: 'Point the top of your phone toward the arrow',
    compassCalibrating: 'Calibrating compass…',
    enableCompassIOS: 'Enable compass sensor',
    compassAllowed: 'Compass active',
    openMapRoute: 'Open map route',
    openMapRouteNote: '(requires internet)',
    showHelpCard: 'Show help card',
    addressLabel: 'Official address',
    distanceLabel: 'Calculated distance',
    directionLabel: 'Direction',
    helpCardTitle: 'Help Card',
    helpCardSub: 'Show this screen to a taxi driver, officer or bystander',
    helpCardValidationNotice: '[DEMO] Translations to be verified by a certified translator.',
    closeHelpCard: 'Close card',
    showToDriver: 'Show this card',
    north: 'North',
    northeast: 'Northeast',
    east: 'East',
    southeast: 'Southeast',
    south: 'South',
    southwest: 'Southwest',
    west: 'West',
    northwest: 'Northwest',
    settingsTitle: 'Settings & Testing',
    simulateLocation: 'Simulate location (GPS test)',
    simulateRealGPS: 'Use device real GPS',
    simulatePiazzaGrande: 'Piazza Grande, Modena',
    simulateTrainStation: 'Modena Train Station',
    simulateRomeCenter: 'Rome, city center',
    installApp: 'Install app',
    offlineReady: 'Ready for offline use',
    offlineBanner: 'Offline mode active — local storage in use.',
    phrases: {
      help: {
        it: 'Ho bisogno di aiuto.',
        tr: 'I need help.',
      },
      noItalian: {
        it: 'Non parlo italiano.',
        tr: 'I do not speak Italian.',
      },
      takeMe: {
        it: 'Mi può portare a questo indirizzo, per favore?',
        tr: 'Can you take me to this address, please?',
      },
      call112: {
        it: 'Per favore, chiami il 112.',
        tr: 'Please call 112.',
      },
    },
  },

  it: {
    demoBanner: 'DEMO — non usare in emergenza reale',
    demoFootnote: 'Dati per dimostrazione. Non usare in caso di vera emergenza.',
    onboardingTitle: 'Configurazione Iniziale',
    onboardingSubtitle: 'Tutte le preferenze restano sul dispositivo e funzionano senza rete.',
    chooseLanguage: 'Lingua dell’applicazione',
    statusQuestion: 'Sei…',
    statusTraveling: 'In viaggio in Europa',
    statusLiving: 'Residente in Italia',
    nationalityQuestion: 'La tua nazionalità',
    nationalityPreferNot: 'Preferisco non specificare',
    safeguardQuestion: 'Mostrare il consolato del tuo paese come destinazione?',
    safeguardHelper: 'Alcune persone preferiscono non rivolgersi al proprio consolato. Potrai modificare questa scelta in seguito.',
    yes: 'Sì',
    no: 'No',
    continueBtn: 'Inizia',
    saveBtn: 'Salva modifiche',
    locationOff: 'Posizione disattivata',
    needHelp: 'Ho bisogno di aiuto',
    call112: 'Chiama 112',
    call112Sub: 'Chiama 112 — emergenza europea',
    verifiedDataNote: 'Dati verificati il 28/10/2026 · Pacchetto Italia/Modena',
    profileSettings: 'Profilo & Impostazioni',
    aboutData: 'Informazioni sui dati',
    destinationsTitle: 'Destinazioni più vicine',
    tabWaitingAreas: 'Aree di attesa',
    tabMyConsulate: 'Il tuo consolato',
    tabOtherEmbassies: 'Altre missioni',
    showAll: 'Mostra tutti i luoghi',
    showClosest3: 'Mostra i 3 più vicini',
    noMissionsFound: 'Nessuna missione trovata per il paese selezionato.',
    outsideItalyPrefix: 'Assiste l’Italia da',
    badgeVerified: 'Verificato',
    badgeVerifying: 'Indirizzo in verifica — chiama prima',
    badgeLimited: 'Servizio limitato — chiama prima di recarti',
    callBtn: 'Chiama',
    waitingAreaLabel: 'Area di attesa della Protezione Civile',
    careerConsulate: 'Consolato di carriera',
    honoraryConsulate: 'Consolato onorario',
    embassy: 'Ambasciata',
    detailTitle: 'Destinazione',
    compassNeedle: 'Punta la parte superiore del telefono nella direzione della freccia',
    compassCalibrating: 'Calibrazione bussola…',
    enableCompassIOS: 'Attiva sensore bussola',
    compassAllowed: 'Bussola attiva',
    openMapRoute: 'Apri percorso sulla mappa',
    openMapRouteNote: '(richiede internet)',
    showHelpCard: 'Mostra scheda di aiuto',
    addressLabel: 'Indirizzo ufficiale',
    distanceLabel: 'Distanza stimata',
    directionLabel: 'Direzione',
    helpCardTitle: 'Scheda di Aiuto',
    helpCardSub: 'Mostra questo schermo a un tassista, alle forze dell’ordine o a un passante',
    helpCardValidationNotice: '[DEMO] Traduzioni da convalidare da traduttore professionista.',
    closeHelpCard: 'Chiudi scheda',
    showToDriver: 'Mostra questa scheda',
    north: 'Nord',
    northeast: 'Nord-Est',
    east: 'Est',
    southeast: 'Sud-Est',
    south: 'Sud',
    southwest: 'Sud-Ovest',
    west: 'Ovest',
    northwest: 'Nord-Ovest',
    settingsTitle: 'Impostazioni & Simulazione',
    simulateLocation: 'Simula posizione (test senza GPS)',
    simulateRealGPS: 'Usa GPS reale del dispositivo',
    simulatePiazzaGrande: 'Piazza Grande, Modena',
    simulateTrainStation: 'Stazione ferroviaria di Modena',
    simulateRomeCenter: 'Roma, centro',
    installApp: 'Installa app',
    offlineReady: 'Pronto per l’uso offline',
    offlineBanner: 'Modalità offline attiva — memoria locale in uso.',
    phrases: {
      help: {
        it: 'Ho bisogno di aiuto.',
        tr: 'Ho bisogno di aiuto.',
      },
      noItalian: {
        it: 'Non parlo italiano.',
        tr: 'Non parlo italiano.',
      },
      takeMe: {
        it: 'Mi può portare a questo indirizzo, per favore?',
        tr: 'Mi può portare a questo indirizzo, per favore?',
      },
      call112: {
        it: 'Per favore, chiami il 112.',
        tr: 'Per favore, chiami il 112.',
      },
    },
  },

  uk: {
    demoBanner: 'ДЕМО — не використовувати при реальній надзвичайній ситуації',
    demoFootnote: 'Дані лише для демонстрації. Не використовувати під час справжньої небезпеки.',
    onboardingTitle: 'Початкове налаштування',
    onboardingSubtitle: 'Усі параметри зберігаються лише на вашому пристрої та працюють без доступу до інтернету.',
    chooseLanguage: 'Мова додатку',
    statusQuestion: 'Ви зараз…',
    statusTraveling: 'Подорожуєте Європою',
    statusLiving: 'Проживаєте в Італії',
    nationalityQuestion: 'Ваше громадянство',
    nationalityPreferNot: 'Бажаю не вказувати',
    safeguardQuestion: 'Показувати консульство вашої країни як пункт призначення?',
    safeguardHelper: 'Деякі люди воліють не звертатися до власного консульства. Ви можете змінити це пізніше.',
    yes: 'Так',
    no: 'Ні',
    continueBtn: 'Розпочати',
    saveBtn: 'Зберегти зміни',
    locationOff: 'Геолокація вимкнена',
    needHelp: 'Мені потрібна допомога',
    call112: 'Дзвонити 112',
    call112Sub: 'Телефонуйте 112 — служба порятунку в Європі',
    verifiedDataNote: 'Дані перевірено 28.10.2026 · Пакет Італія/Модена',
    profileSettings: 'Профіль та налаштування',
    aboutData: 'Про дані',
    destinationsTitle: 'Найближчі пункти',
    tabWaitingAreas: 'Зони очікування',
    tabMyConsulate: 'Ваше консульство',
    tabOtherEmbassies: 'Інші місії',
    showAll: 'Показати всі локації',
    showClosest3: 'Показати 3 найближчі',
    noMissionsFound: 'Дипломатичне представництво для обраної країни не знайдено.',
    outsideItalyPrefix: 'Обслуговує Італію з',
    badgeVerified: 'Перевірено',
    badgeVerifying: 'Адреса перевіряється — зателефонуйте заздалегідь',
    badgeLimited: 'Обмежене обслуговування — зателефонуйте перед візитом',
    callBtn: 'Зателефонувати',
    waitingAreaLabel: 'Зона очікування Цивільного захисту',
    careerConsulate: 'Генеральне консульство',
    honoraryConsulate: 'Почесне консульство',
    embassy: 'Посольство',
    detailTitle: 'Пункт призначення',
    compassNeedle: 'Спрямуйте верхню частину телефону за стрілкою',
    compassCalibrating: 'Калібрування компаса…',
    enableCompassIOS: 'Увімкнути компас',
    compassAllowed: 'Компас активний',
    openMapRoute: 'Відкрити маршрут на мапі',
    openMapRouteNote: '(потрібен інтернет)',
    showHelpCard: 'Показати картку допомоги',
    addressLabel: 'Офіційна адреса',
    distanceLabel: 'Розрахована відстань',
    directionLabel: 'Напрямок',
    helpCardTitle: 'Картка Допомоги',
    helpCardSub: 'Покажіть цей екран водієві таксі, поліцейському або перехожому',
    helpCardValidationNotice: '[ДЕМО] Переклад потребує остаточного затвердження дипломованим перекладачем.',
    closeHelpCard: 'Закрити картку',
    showToDriver: 'Покажіть цю картку',
    north: 'Північ',
    northeast: 'Північний схід',
    east: 'Схід',
    southeast: 'Південний схід',
    south: 'Південь',
    southwest: 'Південний захід',
    west: 'Захід',
    northwest: 'Північний захід',
    settingsTitle: 'Налаштування та тестування',
    simulateLocation: 'Імітувати геопозицію (тест без GPS)',
    simulateRealGPS: 'Використовувати справжній GPS пристрою',
    simulatePiazzaGrande: 'Пьяцца Гранде, Модена',
    simulateTrainStation: 'Залізничний вокзал Модени',
    simulateRomeCenter: 'Рим, центр',
    installApp: 'Встановити додаток',
    offlineReady: 'Готовий до автономної роботи',
    offlineBanner: 'Автономний режим — використовуються локальні дані.',
    phrases: {
      help: {
        it: 'Ho bisogno di aiuto.',
        tr: 'Мені потрібна допомога.',
      },
      noItalian: {
        it: 'Non parlo italiano.',
        tr: 'Я не розмовляю італійською.',
      },
      takeMe: {
        it: 'Mi può portare a questo indirizzo, per favore?',
        tr: 'Чи можете ви відвезти мене за цією адресою, будь ласка?',
      },
      call112: {
        it: 'Per favore, chiami il 112.',
        tr: 'Будь ласка, зателефонуйте 112.',
      },
    },
  },

  ar: {
    demoBanner: 'نسخة تجريبية — لا تستخدم في حالات الطوارئ الحقيقية',
    demoFootnote: 'بيانات تجريبية فقط. لا تستخدم في حالات الطوارئ الفعلية.',
    onboardingTitle: 'الإعداد الأولي',
    onboardingSubtitle: 'يتم حفظ جميع التفضيلات حصرياً على جهازك وتعمل دون الحاجة لشبكة الإنترنت.',
    chooseLanguage: 'لغة التطبيق',
    statusQuestion: 'أنت حالياً…',
    statusTraveling: 'مسافر في أوروبا',
    statusLiving: 'مقيم في إيطاليا',
    nationalityQuestion: 'جنسيتك',
    nationalityPreferNot: 'أفضل عدم التحديد',
    safeguardQuestion: 'إظهار قنصلية بلدك كوجهة مساعدة؟',
    safeguardHelper: 'يفضل بعض الأشخاص عدم التوجه إلى قنصلية بلدهم. يمكنك تغيير ذلك لاحقاً في أي وقت.',
    yes: 'نعم',
    no: 'لا',
    continueBtn: 'البدء الآن',
    saveBtn: 'حفظ التغييرات',
    locationOff: 'تحديد الموقع متوقف',
    needHelp: 'أحتاج إلى مساعدة',
    call112: 'اتصال بـ 112',
    call112Sub: 'اتصل برقم 112 — طوارئ أوروبا',
    verifiedDataNote: 'تم التحقق من البيانات في 28/10/2026 · حزمة إيطاليا/مودينا',
    profileSettings: 'الملف الشخصي والإعدادات',
    aboutData: 'حول البيانات ومصادرها',
    destinationsTitle: 'أقرب الوجهات الرسمية',
    tabWaitingAreas: 'مناطق الانتظار',
    tabMyConsulate: 'قنصليتك',
    tabOtherEmbassies: 'بعثات أخرى',
    showAll: 'عرض جميع الأماكن',
    showClosest3: 'عرض أقرب 3 وجهات',
    noMissionsFound: 'لم يتم العثور على بعثة دبلوماسية للدولة المحددة.',
    outsideItalyPrefix: 'تقدم الخدمات لإيطاليا من',
    badgeVerified: 'تم التحقق',
    badgeVerifying: 'العنوان قيد التحقق — اتصل مسبقاً',
    badgeLimited: 'خدمات محدودة — اتصل هاتفياً قبل الذهاب',
    callBtn: 'اتصال',
    waitingAreaLabel: 'منطقة انتظار تابعة للحماية المدنية',
    careerConsulate: 'قنصلية عامة',
    honoraryConsulate: 'قنصلية فخرية',
    embassy: 'سفارة',
    detailTitle: 'تفاصيل الوجهة',
    compassNeedle: 'وجّه أعلى الهاتف باتجاه السهم',
    compassCalibrating: 'جارٍ معايرة البوصلة…',
    enableCompassIOS: 'تفعيل مستشعر البوصلة',
    compassAllowed: 'البوصلة نشطة',
    openMapRoute: 'فتح المسار على الخريطة',
    openMapRouteNote: '(يتطلب اتصالاً بالإنترنت)',
    showHelpCard: 'عرض بطاقة المساعدة',
    addressLabel: 'العنوان الرسمي',
    distanceLabel: 'المسافة المحسوبة',
    directionLabel: 'الاتجاه',
    helpCardTitle: 'بطاقة المساعدة السريعة',
    helpCardSub: 'أظهر هذه الشاشة لسائق الأجرة أو الشرطة أو المارة',
    helpCardValidationNotice: '[تجريبي] الترجمات تخضع للتحقق من قِبل مترجم معتمد.',
    closeHelpCard: 'إغلاق البطاقة',
    showToDriver: 'أظهر هذه البطاقة',
    north: 'شمال',
    northeast: 'شمال شرق',
    east: 'شرق',
    southeast: 'جنوب شرق',
    south: 'جنوب',
    southwest: 'جنوب غرب',
    west: 'غرب',
    northwest: 'شمال غرب',
    settingsTitle: 'الإعدادات والمحاكاة',
    simulateLocation: 'محاكاة الموقع (اختبار بدون GPS)',
    simulateRealGPS: 'استخدام GPS الفعلي للجهاز',
    simulatePiazzaGrande: 'ساحة بياتسا غراندي، مودينا',
    simulateTrainStation: 'محطة قطارات مودينا',
    simulateRomeCenter: 'وسط روما',
    installApp: 'تثبيت التطبيق',
    offlineReady: 'جاهز للاستخدام بدون إنترنت',
    offlineBanner: 'وضع العمل بدون إنترنت نشط — تُستخدم البيانات المحلية.',
    phrases: {
      help: {
        it: 'Ho bisogno di aiuto.',
        tr: 'أنا بحاجة إلى مساعدة.',
      },
      noItalian: {
        it: 'Non parlo italiano.',
        tr: 'أنا لا أتحدث الإيطالية.',
      },
      takeMe: {
        it: 'Mi può portare a questo indirizzo, per favore?',
        tr: 'هل يمكنك اصطحابي إلى هذا العنوان من فضلك؟',
      },
      call112: {
        it: 'Per favore, chiami il 112.',
        tr: 'من فضلك اتصل بـ 112.',
      },
    },
  },
};

export function getTranslation(lang: SupportedLanguage): TranslationDictionary {
  if (TRANSLATIONS[lang]) {
    return TRANSLATIONS[lang];
  }
  // Fallbacks: pt-PT -> pt-BR; others -> en
  if (lang === 'pt-PT') {
    return TRANSLATIONS['pt-BR'];
  }
  return TRANSLATIONS['en'];
}
