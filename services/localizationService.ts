
export type Language = 'en' | 'de' | 'es' | 'tr';
export type UnitSystem = 'metric' | 'imperial';

interface LocaleData {
  [key: string]: string | string[];
}

const DICTIONARY: Record<Language, LocaleData> = {
  en: {
    // --- UI Labels ---
    welcomeBack: "Welcome Back",
    yourPets: "Your Pets",
    addPet: "Add Pet",
    history: "History",
    noPets: "No pets yet",
    noPetsDesc: "Add your first furry friend to get started!",
    checkFood: "Check a food",
    recentChecks: "Recent Checks",
    step1: "1. Food Name",
    step2: "2. Photo (Optional)",
    step3: "3. Analyze",
    enterFoodName: "e.g. Chicken breast, Grapes",
    analyze: "Analyze Safety",
    analyzeLoading: "Analyzing...",
    safe: "SAFE",
    caution: "CAUTION",
    dangerous: "DANGEROUS",
    unknown: "UNKNOWN",
    canEat: "Can {name} eat this?",
    why: "Why?",
    warning: "Warning",
    disclaimer: "Disclaimer: This is AI advice. Consult a vet for emergencies.",
    checkAnother: "Check another food",
    goPro: "Go Pro",
    freeRemaining: "{count} free checks",
    outOfCredits: "0 free checks",
    
    // --- Pet Form ---
    name: "Name",
    age: "Age",
    weight: "Weight",
    species: "Species",
    notes: "Notes / Health Issues",
    save: "Save Profile",
    create: "Create Profile",
    editProfile: "Edit Profile",
    dog: "Dog",
    cat: "Cat",
    other: "Other",
    delete: "Delete",

    // --- History ---
    searchHistory: "Search history...",
    noHistory: "No checks yet",

    // --- Onboarding ---
    appName: "PawFresh",
    onboardingTitle: "Keep them safe",
    onboardingDesc: "Instantly check if food is safe for your pet using AI.",
    getStarted: "Get Started",

    // --- Paywall ---
    premiumTitle: "PawFresh Pro",
    premiumDesc: "Unlimited pets, unlimited checks, detailed analysis & priority support.",
    planYearly: "Yearly Plan",
    planMonthly: "Monthly Plan",
    bestValue: "BEST VALUE",
    perYear: "/ year",
    perMonth: "/ month",
    continue: "Continue",
    restore: "Restore Purchases",
    processingPayment: "Processing Payment...",
    securePayment: "Secure payment via App Store",
    
    // --- Limits & Errors ---
    limitReachedTitle: "Limit Reached",
    limitReachedDesc: "Free users can only add 1 pet. Upgrade to PawFresh Pro for unlimited pets!",
    paymentFailed: "Payment Failed",
    paymentCancelled: "Payment Cancelled",
    networkError: "Network Error. Please try again.",
    restoreFailed: "No purchases found to restore.",
    restoreSuccess: "Purchases restored!",

    // --- Fun Facts ---
    didYouKnow: "Did you know?",
    dogFacts: [
      "Dogs' noses are wet to help absorb scent chemicals.",
      "Basenji dogs don't bark, they yodel.",
      "A greyhound could beat a cheetah in a long-distance race.",
      "Dogs have three eyelids."
    ],
    catFacts: [
      "Cats spend 70% of their lives sleeping.",
      "A group of kittens is called a kindle.",
      "Cats can't taste sweetness.",
      "A cat's nose print is unique, like a human fingerprint."
    ],
    generalFacts: [
      "Pets help lower blood pressure and reduce stress.",
      "Obesity is the #1 health problem in pets today.",
      "Chocolate is toxic to both cats and dogs."
    ],
    loadCreate: [
      "Scanning your pet's cute features...",
      "Identifying the species...",
      "Analyzing breed characteristics...",
      "Mixing the colors for the portrait..."
    ],
    loadAnalyze: [
      "Scanning the food image...",
      "Identifying ingredients...",
      "Checking toxicity database...",
      "Calculating safe portions..."
    ],

    // --- Allergies & Inputs ---
    allergies: "Allergies",
    addAllergy: "Add allergy...",
    conditions: "Health Conditions",
    addCondition: "Add condition...",
    placeholderNotes: "e.g. Chicken allergy, Sensitive stomach",
    
    // --- Camera / New Check ---
    camera: "Camera",
    gallery: "Gallery",
    takePhoto: "Take Photo",
    whatIsEating: "What is {name} eating?",
    takePhotoDesc: "Take a photo or upload an image to check safety.",
    readyToAnalyze: "Ready to analyze?",
    retake: "Retake",
    analysisFailed: "Analysis failed. Please try again.",
    unknownFood: "Unknown Food",

    // --- Results ---
    yesSafe: "Yes, Safe",
    noAvoid: "No, Avoid"
  },
  de: {
    welcomeBack: "Willkommen",
    yourPets: "Deine Tiere",
    addPet: "Tier hinzufügen",
    history: "Verlauf",
    noPets: "Keine Tiere",
    noPetsDesc: "Füge deinen ersten Freund hinzu!",
    checkFood: "Futter prüfen",
    recentChecks: "Letzte Prüfungen",
    step1: "1. Futtername",
    step2: "2. Foto (Optional)",
    step3: "3. Analyse",
    enterFoodName: "z.B. Hühnchen, Trauben",
    analyze: "Sicherheit prüfen",
    analyzeLoading: "Analysiere...",
    safe: "SICHER",
    caution: "VORSICHT",
    dangerous: "GEFÄHRLICH",
    unknown: "UNBEKANNT",
    canEat: "Darf {name} das essen?",
    why: "Warum?",
    warning: "Warnung",
    disclaimer: "Hinweis: KI-Rat. Bei Notfällen Tierarzt aufsuchen.",
    checkAnother: "Anderes Futter prüfen",
    goPro: "Pro werden",
    freeRemaining: "{count} Checks übrig",
    outOfCredits: "0 Checks übrig",
    name: "Name",
    age: "Alter",
    weight: "Gewicht",
    species: "Spezies",
    notes: "Notizen / Gesundheit",
    save: "Speichern",
    create: "Erstellen",
    editProfile: "Profil bearbeiten",
    dog: "Hund",
    cat: "Katze",
    other: "Andere",
    delete: "Löschen",

    searchHistory: "Verlauf suchen...",
    noHistory: "Kein Verlauf",
    appName: "PawFresh",
    onboardingTitle: "Halte sie sicher",
    onboardingDesc: "Prüfe sofort, ob Futter sicher ist.",
    getStarted: "Loslegen",
    
    premiumTitle: "PawFresh Pro",
    premiumDesc: "Unbegrenzte Tiere, Checks & Details.",
    planYearly: "Jahresabo",
    planMonthly: "Monatsabo",
    bestValue: "BESTER PREIS",
    perYear: "/ Jahr",
    perMonth: "/ Monat",
    continue: "Weiter",
    restore: "Wiederherstellen",
    processingPayment: "Zahlung wird verarbeitet...",
    securePayment: "Sichere Zahlung via App Store",
    
    limitReachedTitle: "Limit erreicht",
    limitReachedDesc: "Kostenlose Nutzer können nur 1 Tier hinzufügen. Hol dir Pro für unbegrenzte Tiere!",
    paymentFailed: "Zahlung fehlgeschlagen",
    paymentCancelled: "Zahlung abgebrochen",
    networkError: "Netzwerkfehler. Bitte erneut versuchen.",
    restoreFailed: "Keine Käufe gefunden.",
    restoreSuccess: "Käufe wiederhergestellt!",

    didYouKnow: "Wusstest du schon?",
    dogFacts: [
      "Hundenasen sind nass, um Duftstoffe besser aufzunehmen.",
      "Basenjis bellen nicht, sie jodeln.",
      "Windhunde sind im Sprint schneller als Geparden.",
      "Hunde haben drei Augenlider."
    ],
    catFacts: [
      "Katzen schlafen 70% ihres Lebens.",
      "Eine Gruppe von Kätzchen nennt man 'Kindle'.",
      "Katzen können Süßes nicht schmecken.",
      "Der Nasenabdruck einer Katze ist einzigartig."
    ],
    generalFacts: [
      "Haustiere senken Blutdruck und Stress.",
      "Übergewicht ist das Gesundheitsproblem Nr. 1.",
      "Schokolade ist giftig für Hunde und Katzen."
    ],
    loadCreate: [
      "Scanne die niedlichen Merkmale...",
      "Identifiziere die Tierart...",
      "Analysiere Rassemerkmale...",
      "Mische Farben für das Porträt..."
    ],
    loadAnalyze: [
      "Scanne das Futterbild...",
      "Identifiziere Zutaten...",
      "Prüfe Toxizitätsdatenbank...",
      "Berechne sichere Portionen..."
    ],

    allergies: "Allergien",
    addAllergy: "Hinzufügen...",
    conditions: "Krankheiten",
    addCondition: "Hinzufügen...",
    placeholderNotes: "z.B. Hühnchenallergie, Empfindlicher Magen",

    camera: "Kamera",
    gallery: "Galerie",
    takePhoto: "Foto machen",
    whatIsEating: "Was isst {name}?",
    takePhotoDesc: "Foto machen oder hochladen zur Prüfung.",
    readyToAnalyze: "Bereit zur Analyse?",
    retake: "Wiederholen",
    analysisFailed: "Analyse fehlgeschlagen. Bitte erneut versuchen.",
    unknownFood: "Unbekanntes Futter",
    yesSafe: "Ja, Sicher",
    noAvoid: "Nein, Meiden"
  },
  es: {
    welcomeBack: "Hola",
    yourPets: "Mascotas",
    addPet: "Añadir",
    history: "Historial",
    noPets: "Sin mascotas",
    noPetsDesc: "¡Añade a tu amigo peludo!",
    checkFood: "Revisar comida",
    recentChecks: "Recientes",
    step1: "1. Nombre comida",
    step2: "2. Foto (Opcional)",
    step3: "3. Analizar",
    enterFoodName: "ej. Pollo, Uvas",
    analyze: "Analizar",
    analyzeLoading: "Analizando...",
    safe: "SEGURO",
    caution: "PRECAUCIÓN",
    dangerous: "PELIGROSO",
    unknown: "DESCONOCIDO",
    canEat: "¿Puede comer esto {name}?",
    why: "¿Por qué?",
    warning: "Advertencia",
    disclaimer: "Aviso: IA. Consulte veterinario en urgencias.",
    checkAnother: "Revisar otro",
    goPro: "Ser Pro",
    freeRemaining: "{count} gratis",
    outOfCredits: "0 gratis",
    name: "Nombre",
    age: "Edad",
    weight: "Peso",
    species: "Especie",
    notes: "Notas / Salud",
    save: "Guardar",
    create: "Crear",
    editProfile: "Editar Perfil",
    dog: "Perro",
    cat: "Gato",
    other: "Otro",
    delete: "Eliminar",

    searchHistory: "Buscar...",
    noHistory: "Sin historial",
    appName: "PawFresh",
    onboardingTitle: "Protégelos",
    onboardingDesc: "Verifica si la comida es segura al instante.",
    getStarted: "Empezar",
    
    premiumTitle: "PawFresh Pro",
    premiumDesc: "Mascotas ilimitadas, chequeos ilimitados.",
    planYearly: "Plan Anual",
    planMonthly: "Plan Mensual",
    bestValue: "MEJOR PRECIO",
    perYear: "/ año",
    perMonth: "/ mes",
    continue: "Continuar",
    restore: "Restaurar",
    processingPayment: "Procesando pago...",
    securePayment: "Pago seguro vía App Store",
    
    limitReachedTitle: "Límite Alcanzado",
    limitReachedDesc: "Usuarios gratis: 1 mascota. ¡Hazte Pro para ilimitadas!",
    paymentFailed: "Pago fallido",
    paymentCancelled: "Pago cancelado",
    networkError: "Error de red. Intenta de nuevo.",
    restoreFailed: "No se encontraron compras.",
    restoreSuccess: "¡Compras restauradas!",

    didYouKnow: "¿Sabías que?",
    dogFacts: [
      "La nariz de los perros está húmeda para captar olores.",
      "Los Basenji no ladran, cantan.",
      "Los galgos pueden ganar a un guepardo en largas distancias.",
      "Los perros tienen tres párpados."
    ],
    catFacts: [
      "Los gatos pasan el 70% de su vida durmiendo.",
      "Un grupo de gatitos se llama 'kindle'.",
      "Los gatos no detectan el sabor dulce.",
      "La huella nasal de un gato es única."
    ],
    generalFacts: [
      "Las mascotas reducen la presión arterial.",
      "La obesidad es el problema nº1.",
      "El chocolate es tóxico para perros y gatos."
    ],
    loadCreate: [
      "Escaneando rasgos adorables...",
      "Identificando especie...",
      "Analizando raza...",
      "Mezclando colores para el retrato..."
    ],
    loadAnalyze: [
      "Escaneando comida...",
      "Identificando ingredientes...",
      "Revisando base de datos de toxinas...",
      "Calculando porciones seguras..."
    ],

    allergies: "Alergias",
    addAllergy: "Añadir...",
    conditions: "Condiciones",
    addCondition: "Añadir...",
    placeholderNotes: "ej. Alergia al pollo, Estómago sensible",
    
    camera: "Cámara",
    gallery: "Galería",
    takePhoto: "Tomar Foto",
    whatIsEating: "¿Qué come {name}?",
    takePhotoDesc: "Toma una foto o sube una imagen.",
    readyToAnalyze: "¿Listo para analizar?",
    retake: "Retomar",
    analysisFailed: "Falló el análisis. Intenta de nuevo.",
    unknownFood: "Comida Desconocida",
    yesSafe: "Sí, Seguro",
    noAvoid: "No, Evitar"
  },
  tr: {
    welcomeBack: "Merhaba",
    yourPets: "Evcil Hayvanlar",
    addPet: "Ekle",
    history: "Geçmiş",
    noPets: "Henüz yok",
    noPetsDesc: "İlk dostunu ekle!",
    checkFood: "Yiyecek Kontrolü",
    recentChecks: "Son Kontroller",
    step1: "1. Yiyecek İsmi",
    step2: "2. Fotoğraf (İsteğe Bağlı)",
    step3: "3. Analiz Et",
    enterFoodName: "örn. Tavuk, Üzüm",
    analyze: "Güvenliği Analiz Et",
    analyzeLoading: "Analiz ediliyor...",
    safe: "GÜVENLİ",
    caution: "DİKKAT",
    dangerous: "TEHLİKELİ",
    unknown: "BİLİNMİYOR",
    canEat: "{name} bunu yiyebilir mi?",
    why: "Neden?",
    warning: "Uyarı",
    disclaimer: "Yasal Uyarı: AI tavsiyesidir. Acil durumda veterinere danışın.",
    checkAnother: "Başka yiyecek kontrol et",
    goPro: "Pro Ol",
    freeRemaining: "{count} hak kaldı",
    outOfCredits: "Hakkınız bitti",
    name: "İsim",
    age: "Yaş",
    weight: "Kilo",
    species: "Tür",
    notes: "Notlar / Sağlık",
    save: "Kaydet",
    create: "Oluştur",
    editProfile: "Profili Düzenle",
    dog: "Köpek",
    cat: "Kedi",
    other: "Diğer",
    delete: "Sil",

    searchHistory: "Ara...",
    noHistory: "Henüz geçmiş yok",
    appName: "PawFresh",
    onboardingTitle: "Onları Koru",
    onboardingDesc: "Yiyeceklerin güvenli olup olmadığını anında öğren.",
    getStarted: "Başla",
    
    premiumTitle: "PawFresh Pro",
    premiumDesc: "Sınırsız evcil hayvan, sınırsız kontrol & analiz.",
    planYearly: "Yıllık Plan",
    planMonthly: "Aylık Plan",
    bestValue: "EN İYİ FİYAT",
    perYear: "/ yıl",
    perMonth: "/ ay",
    continue: "Devam Et",
    restore: "Geri Yükle",
    processingPayment: "Ödeme İşleniyor...",
    securePayment: "App Store ile güvenli ödeme",
    
    limitReachedTitle: "Limit Doldu",
    limitReachedDesc: "Ücretsiz kullanıcılar sadece 1 evcil hayvan ekleyebilir. Sınırsız için Pro'ya geçin!",
    paymentFailed: "Ödeme Başarısız",
    paymentCancelled: "Ödeme İptal Edildi",
    networkError: "Ağ Hatası. Tekrar deneyin.",
    restoreFailed: "Satın alma bulunamadı.",
    restoreSuccess: "Satın alımlar geri yüklendi!",

    didYouKnow: "Biliyor muydunuz?",
    dogFacts: [
      "Köpeklerin burnu kokuları daha iyi alabilmek için ıslaktır.",
      "Basenji cinsi köpekler havlamaz, yodel yapar.",
      "Tazılar uzun mesafede çitalardan daha hızlıdır.",
      "Köpeklerin üç göz kapağı vardır."
    ],
    catFacts: [
      "Kediler hayatlarının %70'ini uyuyarak geçirir.",
      "Bir grup kedi yavrusuna 'kindle' denir.",
      "Kediler tatlı tadı alamazlar.",
      "Kedilerin burun izi parmak izi gibi eşsizdir."
    ],
    generalFacts: [
      "Evcil hayvanlar stresi azaltır.",
      "Obezite en büyük sorundur.",
      "Çikolata hem kediler hem de köpekler için zehirlidir."
    ],
    loadCreate: [
      "Sevimli özellikleri taranıyor...",
      "Tür tespit ediliyor...",
      "Irk özellikleri analiz ediliyor...",
      "Portre renkleri hazırlanıyor..."
    ],
    loadAnalyze: [
      "Mama fotoğrafı taranıyor...",
      "İçindekiler tespit ediliyor...",
      "Zehir veri tabanı kontrol ediliyor...",
      "Güvenli porsiyon hesaplanıyor..."
    ],

    allergies: "Alerjiler",
    addAllergy: "Ekle...",
    conditions: "Hastalıklar",
    addCondition: "Ekle...",
    placeholderNotes: "örn. Tavuk alerjisi, Hassas mide",
    
    camera: "Kamera",
    gallery: "Galeri",
    takePhoto: "Fotoğraf Çek",
    whatIsEating: "{name} ne yiyor?",
    takePhotoDesc: "Güvenliği kontrol etmek için fotoğraf çekin veya yükleyin.",
    readyToAnalyze: "Analiz edilsin mi?",
    retake: "Tekrar",
    analysisFailed: "Analiz başarısız. Lütfen tekrar deneyin.",
    unknownFood: "Bilinmeyen Yiyecek",
    yesSafe: "Evet, Güvenli",
    noAvoid: "Hayır, Uzak Dur"
  }
};

const getDeviceLanguage = (): Language => {
  const lang = navigator.language.split('-')[0];
  if (['de', 'es', 'tr'].includes(lang)) return lang as Language;
  return 'en';
};

const getDeviceRegion = (): string => {
  const parts = navigator.language.split('-');
  return parts.length > 1 ? parts[1].toUpperCase() : 'US';
};

const isImperialCountry = (region: string) => {
  return ['US', 'LR', 'MM'].includes(region);
};

class LocalizationService {
  language: Language;
  unitSystem: UnitSystem;

  constructor() {
    this.language = getDeviceLanguage();
    this.unitSystem = isImperialCountry(getDeviceRegion()) ? 'imperial' : 'metric';
  }

  t(key: string, params?: Record<string, string | number>): string {
    const dict = DICTIONARY[this.language] || DICTIONARY.en;
    let val = dict[key];
    if (!val) val = DICTIONARY.en[key] || key;
    
    let str = val as string;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }

  getArray(key: string): string[] {
      const dict = DICTIONARY[this.language] || DICTIONARY.en;
      const val = dict[key];
      if (Array.isArray(val)) return val;
      return DICTIONARY.en[key] as string[] || [];
  }

  // --- Currency Formatting ---
  formatCurrency(amount: number): string {
    const region = getDeviceRegion();
    // Map region to likely currency, heavily simplified
    let currency = 'USD';
    if (this.language === 'de') currency = 'EUR';
    if (this.language === 'es') currency = 'EUR'; // Simplifying for Spain vs LatAm
    if (this.language === 'tr') currency = 'TRY';
    if (region === 'GB') currency = 'GBP';

    // Pricing Adjustment Mock
    let adjustedAmount = amount;
    if (currency === 'EUR') adjustedAmount = amount * 0.92;
    if (currency === 'TRY') adjustedAmount = amount * 34; // Approximate Rate
    if (currency === 'GBP') adjustedAmount = amount * 0.76;

    try {
      return new Intl.NumberFormat(this.language, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2
      }).format(adjustedAmount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  }

  // Helper formatting methods
  formatWeight(kg: number): string {
    if (this.unitSystem === 'imperial') {
      return `${(kg * 2.20462).toFixed(1)} lbs`;
    }
    return `${kg.toFixed(1)} kg`;
  }

  toKg(value: number): number {
    if (this.unitSystem === 'imperial') return value / 2.20462;
    return value;
  }

  fromKg(kg: number): string {
    if (this.unitSystem === 'imperial') return (kg * 2.20462).toFixed(1);
    return kg.toString();
  }

  getWeightUnit(): string {
    return this.unitSystem === 'imperial' ? 'lbs' : 'kg';
  }
}

export const localization = new LocalizationService();
