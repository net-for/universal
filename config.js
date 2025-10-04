// Universal RP CEF Configuration
const CEFConfig = {
    // General Settings
    version: "1.0.0",
    debug: true,
    
    // UI Settings
    theme: {
        primaryColor: "#38AF91",
        secondaryColor: "#00D4FF",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        textColor: "#ffffff",
        successColor: "#27ae60",
        errorColor: "#e74c3c",
        warningColor: "#f39c12",
        infoColor: "#3498db"
    },
    
    // Animation Settings
    animations: {
        duration: 300,
        easing: "ease",
        enableTransitions: true,
        enableHoverEffects: true
    },
    
    // Notification Settings
    notifications: {
        defaultDuration: 5000,
        maxNotifications: 5,
        position: "top-right",
        enableSound: false,
        enableAnimations: true
    },
    
    // HUD Settings
    hud: {
        updateInterval: 1000,
        enableHealthBar: true,
        enableArmorBar: true,
        enableMoneyDisplay: true,
        enableZoneIndicator: true,
        enableTimeDisplay: true
    },
    
    // Phone Settings
    phone: {
        enableApps: true,
        enableCalling: true,
        enableSMS: false,
        enableInternet: false,
        defaultApps: ["phone", "bank", "taxi", "gps", "settings"]
    },
    
    // Bank Settings
    bank: {
        enableTransactions: true,
        enableHouseMoney: true,
        enablePhoneBalance: true,
        enableATM: true,
        maxTransactionAmount: 1000000
    },
    
    // Vehicle Settings
    vehicle: {
        enableHUD: true,
        enableEngineStatus: true,
        enableLightsStatus: true,
        enableFuelDisplay: true,
        enableHealthDisplay: true,
        updateInterval: 500
    },
    
    // Job Settings
    jobs: {
        enableJobSystem: true,
        enableTaxiApp: true,
        enableGPSApp: true,
        enableJobFrames: true,
        availableJobs: [
            "Unemployed",
            "Police Officer", 
            "Medic",
            "Mechanic",
            "Taxi Driver",
            "Trucker",
            "Pilot",
            "Farmer",
            "Business Owner"
        ]
    },
    
    // Quest Settings
    quests: {
        enableQuestSystem: true,
        enableQuestFrames: true,
        enableProgressTracking: true,
        maxActiveQuests: 5
    },
    
    // CEF Integration Settings
    cef: {
        enableKeyboardInput: true,
        enableMouseInput: true,
        enableFocusManagement: true,
        enableEventHandling: true,
        debugMode: false
    },
    
    // Language Settings
    language: {
        default: "ka",
        supported: ["ka", "en", "ru"],
        translations: {
            ka: {
                registration: "რეგისტრაცია",
                authorization: "ავტორიზაცია",
                phone: "ტელეფონი",
                bank: "ბანკი",
                taxi: "ტაქსი",
                gps: "GPS",
                settings: "პარამეტრები",
                money: "ფული",
                health: "ჯანმრთელობა",
                armor: "ჯავშანი",
                fuel: "საწვავი",
                engine: "ძრავი",
                lights: "ფარები",
                safeZone: "უსაფრთხო ზონა",
                dangerZone: "საშიში ზონა"
            },
            en: {
                registration: "Registration",
                authorization: "Authorization",
                phone: "Phone",
                bank: "Bank",
                taxi: "Taxi",
                gps: "GPS",
                settings: "Settings",
                money: "Money",
                health: "Health",
                armor: "Armor",
                fuel: "Fuel",
                engine: "Engine",
                lights: "Lights",
                safeZone: "Safe Zone",
                dangerZone: "Danger Zone"
            },
            ru: {
                registration: "Регистрация",
                authorization: "Авторизация",
                phone: "Телефон",
                bank: "Банк",
                taxi: "Такси",
                gps: "GPS",
                settings: "Настройки",
                money: "Деньги",
                health: "Здоровье",
                armor: "Броня",
                fuel: "Топливо",
                engine: "Двигатель",
                lights: "Фары",
                safeZone: "Безопасная зона",
                dangerZone: "Опасная зона"
            }
        }
    },
    
    // Performance Settings
    performance: {
        enableOptimizations: true,
        reduceAnimations: false,
        enableCaching: true,
        maxCacheSize: 50,
        enableLazyLoading: true
    },
    
    // Security Settings
    security: {
        enableInputValidation: true,
        enableXSSProtection: true,
        enableCSRFProtection: true,
        maxInputLength: 1000,
        allowedFileTypes: ["html", "css", "js", "json"]
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CEFConfig;
} else {
    window.CEFConfig = CEFConfig;
}
