/**
 * Universal CEF System - Real Implementation
 * Based on actual usage from universal.pwn
 */

// Global variables
let currentPlayerData = {
    health: 100,
    armor: 0,
    level: 1,
    money: 0,
    bank: 0,
    zone: 'Unknown',
    jailTime: 0,
    taxiTime: 0,
    admin: 0
};

let currentVehicleData = {
    engine: 0,
    doors: 0,
    lights: 0,
    fuel: 100,
    health: 1000
};

let currentBonusData = {
    active: 0,
    salary: 0
};

// Initialize CEF system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Universal CEF System - Real Implementation initialized');
    initializeEventListeners();
    setupCEFCommunication();
});

// Initialize event listeners
function initializeEventListeners() {
    // Authentication form listeners
    const regSubmit = document.getElementById('reg-submit');
    const loginSubmit = document.getElementById('login-submit');
    
    if (regSubmit) {
        regSubmit.addEventListener('click', handleRegistration);
    }
    
    if (loginSubmit) {
        loginSubmit.addEventListener('click', handleLogin);
    }
    
    // Phone app listeners
    const phoneClose = document.getElementById('phone-close');
    const bankClose = document.getElementById('bank-close');
    
    if (phoneClose) {
        phoneClose.addEventListener('click', () => hidePanel('phone-panel'));
    }
    
    if (bankClose) {
        bankClose.addEventListener('click', () => hidePanel('bank-panel'));
    }
    
    // App button listeners
    const appButtons = document.querySelectorAll('.app-button');
    appButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const app = e.target.getAttribute('data-app');
            handleAppClick(app);
        });
    });
    
    // Spawn location listeners
    const spawnLocations = document.querySelectorAll('.spawn-location');
    spawnLocations.forEach(location => {
        location.addEventListener('click', (e) => {
            const locationId = e.target.getAttribute('data-location');
            handleSpawnLocation(locationId);
        });
    });
}

// Setup CEF communication with SA-MP
function setupCEFCommunication() {
    // Listen for CEF events from SA-MP server
    if (typeof mp !== 'undefined') {
        console.log('CEF environment detected');
    } else {
        console.log('Running in test mode - CEF events will be simulated');
        simulateCEFEvents();
    }
}

// Simulate CEF events for testing
function simulateCEFEvents() {
    // Simulate player data updates
    setTimeout(() => {
        updatePlayerInfo({
            health: 85,
            armor: 50,
            level: 5,
            money: 50000,
            bank: 100000,
            zone: 'Los Santos'
        });
    }, 2000);
    
    // Simulate vehicle data
    setTimeout(() => {
        updateVehicleInfo({
            engine: 1,
            doors: 0,
            lights: 1,
            fuel: 75,
            health: 800
        });
    }, 3000);
    
    // Simulate notifications
    setTimeout(() => {
        showNotification('Welcome', 'Welcome to the server!', 'success');
    }, 1000);
}

// CEF Event Handlers - Based on real usage from universal.pwn

// Authentication System
function handleDataPoolReg(data) {
    console.log('Data pool registration:', data);
    const authPanel = document.getElementById('auth-panel');
    const regForm = document.getElementById('reg-form');
    const loginForm = document.getElementById('login-form');
    
    if (data === 1) {
        // Show registration form
        regForm.classList.add('active');
        loginForm.classList.remove('active');
        showPanel('auth-panel');
    } else if (data === 2) {
        // Show login form
        loginForm.classList.add('active');
        regForm.classList.remove('active');
        showPanel('auth-panel');
    }
}

function handleRegName(name) {
    console.log('Registration name:', name);
    const nameInput = document.getElementById('reg-username');
    if (nameInput) {
        nameInput.value = name;
    }
}

function handleAtvName(name) {
    console.log('ATV name:', name);
    const nameInput = document.getElementById('reg-username');
    if (nameInput) {
        nameInput.value = name;
    }
}

// HUD System
function handleHudZona(status) {
    console.log('Zone status:', status);
    const zoneIndicator = document.getElementById('zone-indicator');
    
    if (status === 0) {
        // Safe zone
        zoneIndicator.textContent = 'Safe Zone';
        zoneIndicator.className = 'zone-indicator safe';
    } else if (status === 1) {
        // Danger zone
        zoneIndicator.textContent = 'Danger Zone';
        zoneIndicator.className = 'zone-indicator danger';
    }
}

function handleHudTimers(jailTime, taxiTime, admin) {
    console.log('Timers update:', { jailTime, taxiTime, admin });
    currentPlayerData.jailTime = jailTime;
    currentPlayerData.taxiTime = taxiTime;
    currentPlayerData.admin = admin;
    
    updateTimerDisplay();
}

function handleHudPinfo(health, armor, level, playerid, money, bank, zone) {
    console.log('Player info update:', { health, armor, level, playerid, money, bank, zone });
    currentPlayerData.health = health;
    currentPlayerData.armor = armor;
    currentPlayerData.level = level;
    currentPlayerData.money = money;
    currentPlayerData.bank = bank;
    currentPlayerData.zone = zone;
    
    updatePlayerInfoDisplay();
}

function handleDataHudStats(status) {
    console.log('HUD stats status:', status);
    const hudPanel = document.getElementById('hud-panel');
    if (status === 5) {
        hudPanel.style.opacity = '1';
    } else if (status === -1) {
        hudPanel.style.opacity = '0.5';
    }
}

// Vehicle System
function handleDataVehicle(engine, doors, lights, fuel, health) {
    console.log('Vehicle data update:', { engine, doors, lights, fuel, health });
    currentVehicleData.engine = engine;
    currentVehicleData.doors = doors;
    currentVehicleData.lights = lights;
    currentVehicleData.fuel = fuel;
    currentVehicleData.health = health;
    
    updateVehicleInfoDisplay();
    showPanel('vehicle-panel');
}

// Notification System
function handleDataNot(type, header, text, color, autohide, delay) {
    console.log('Notification:', { type, header, text, color, autohide, delay });
    showNotification(header, text, getNotificationType(type), autohide, delay);
}

function handleBonusInfo(status) {
    console.log('Bonus info:', status);
    currentBonusData.active = status;
    updateBonusDisplay();
}

function handleJobBonus(status) {
    console.log('Job bonus:', status);
    currentBonusData.salary = status;
    updateBonusDisplay();
}

// Bank System
function handleBankInfo(cash, rouletteMoney) {
    console.log('Bank info:', { cash, rouletteMoney });
    const bankCash = document.getElementById('bank-cash');
    const bankRoulette = document.getElementById('bank-roulette');
    
    if (bankCash) bankCash.textContent = formatMoney(cash);
    if (bankRoulette) bankRoulette.textContent = formatMoney(rouletteMoney);
}

// Spawn System
function handleSpawnInfo(level) {
    console.log('Spawn info:', level);
    const spawnLevel = document.getElementById('spawn-level');
    if (spawnLevel) {
        spawnLevel.textContent = level;
    }
    showPanel('spawn-panel');
}

function handleSpawnLock(member, familyMember, location) {
    console.log('Spawn lock:', { member, familyMember, location });
    const spawnLocations = document.querySelectorAll('.spawn-location');
    spawnLocations.forEach((location, index) => {
        const isLocked = (index + 1) > member && (index + 1) > familyMember;
        location.disabled = isLocked;
        location.style.opacity = isLocked ? '0.5' : '1';
    });
}

// Phone System
function handleTaxiApp(data) {
    console.log('Taxi app data:', data);
    // Handle taxi app functionality
}

function handlePhoneNumberCall(number) {
    console.log('Phone number call:', number);
    // Handle phone number calling
}

function handleBankClickedApp(app) {
    console.log('Bank app clicked:', app);
    // Handle bank app interactions
}

// Job System
function handleJobFrame(frame) {
    console.log('Job frame:', frame);
    const jobPanel = document.getElementById('job-panel');
    const jobFrame = document.getElementById('job-frame');
    
    if (jobPanel && jobFrame) {
        jobFrame.innerHTML = `Job Frame ${frame} Content`;
        showPanel('job-panel');
    }
}

// Quest System
function handleQuestFrame(quest) {
    console.log('Quest frame:', quest);
    const questPanel = document.getElementById('quest-panel');
    const questFrame = document.getElementById('quest-frame');
    
    if (questPanel && questFrame) {
        questFrame.innerHTML = `Quest Frame ${quest} Content`;
        showPanel('quest-panel');
    }
}

// Money System
function handleGameCEFMoney(cash) {
    console.log('Money update:', cash);
    currentPlayerData.money = cash;
    updatePlayerInfoDisplay();
}

function handleGameCEFBank(cash) {
    console.log('Bank update:', cash);
    currentPlayerData.bank = cash;
    updatePlayerInfoDisplay();
}

// UI Update Functions
function updatePlayerInfo(data) {
    Object.assign(currentPlayerData, data);
    updatePlayerInfoDisplay();
}

function updatePlayerInfoDisplay() {
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-text');
    const armorBar = document.getElementById('armor-bar');
    const armorText = document.getElementById('armor-text');
    const levelText = document.getElementById('level-text');
    const moneyText = document.getElementById('money-text');
    const bankText = document.getElementById('bank-text');
    const zoneText = document.getElementById('zone-text');
    
    if (healthBar) {
        healthBar.style.width = currentPlayerData.health + '%';
    }
    if (healthText) {
        healthText.textContent = currentPlayerData.health;
    }
    
    if (armorBar) {
        armorBar.style.width = currentPlayerData.armor + '%';
    }
    if (armorText) {
        armorText.textContent = currentPlayerData.armor;
    }
    
    if (levelText) {
        levelText.textContent = currentPlayerData.level;
    }
    
    if (moneyText) {
        moneyText.textContent = formatMoney(currentPlayerData.money);
    }
    
    if (bankText) {
        bankText.textContent = formatMoney(currentPlayerData.bank);
    }
    
    if (zoneText) {
        zoneText.textContent = currentPlayerData.zone;
    }
}

function updateVehicleInfo(data) {
    Object.assign(currentVehicleData, data);
    updateVehicleInfoDisplay();
}

function updateVehicleInfoDisplay() {
    const engineStatus = document.getElementById('engine-status');
    const doorsStatus = document.getElementById('doors-status');
    const lightsStatus = document.getElementById('lights-status');
    const fuelBar = document.getElementById('fuel-bar');
    const fuelText = document.getElementById('fuel-text');
    const vehicleHealthBar = document.getElementById('vehicle-health-bar');
    const vehicleHealthText = document.getElementById('vehicle-health-text');
    
    if (engineStatus) {
        engineStatus.textContent = currentVehicleData.engine ? 'On' : 'Off';
        engineStatus.className = 'status ' + (currentVehicleData.engine ? 'on' : 'off');
    }
    
    if (doorsStatus) {
        doorsStatus.textContent = currentVehicleData.doors ? 'Unlocked' : 'Locked';
        doorsStatus.className = 'status ' + (currentVehicleData.doors ? 'unlocked' : 'locked');
    }
    
    if (lightsStatus) {
        lightsStatus.textContent = currentVehicleData.lights ? 'On' : 'Off';
        lightsStatus.className = 'status ' + (currentVehicleData.lights ? 'on' : 'off');
    }
    
    if (fuelBar) {
        fuelBar.style.width = currentVehicleData.fuel + '%';
    }
    if (fuelText) {
        fuelText.textContent = currentVehicleData.fuel + '%';
    }
    
    if (vehicleHealthBar) {
        const healthPercent = (currentVehicleData.health / 1000) * 100;
        vehicleHealthBar.style.width = healthPercent + '%';
    }
    if (vehicleHealthText) {
        vehicleHealthText.textContent = currentVehicleData.health;
    }
}

function updateTimerDisplay() {
    const jailTimer = document.getElementById('jail-timer');
    const taxiTimer = document.getElementById('taxi-timer');
    
    if (jailTimer) {
        jailTimer.textContent = formatTime(currentPlayerData.jailTime);
    }
    
    if (taxiTimer) {
        taxiTimer.textContent = formatTime(currentPlayerData.taxiTime);
    }
}

function updateBonusDisplay() {
    const bonusIndicator = document.getElementById('bonus-indicator');
    
    if (currentBonusData.active > 0 || currentBonusData.salary > 0) {
        bonusIndicator.classList.remove('hidden');
        if (currentBonusData.active === 1) {
            bonusIndicator.textContent = 'X2 Bonus Active';
        } else if (currentBonusData.active === 2) {
            bonusIndicator.textContent = 'X3 Bonus Active';
        } else if (currentBonusData.salary === 1) {
            bonusIndicator.textContent = 'X2 Salary Active';
        }
    } else {
        bonusIndicator.classList.add('hidden');
    }
}

// Form Handlers
function handleRegistration() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    
    if (!username || !password || !email) {
        showNotification('Error', 'Please fill in all fields', 'error');
        return;
    }
    
    // Send registration data to server
    sendToServer('cefregistration', `${username},${password},${email}`);
    hidePanel('auth-panel');
}

function handleLogin() {
    const password = document.getElementById('login-password').value;
    
    if (!password) {
        showNotification('Error', 'Please enter your password', 'error');
        return;
    }
    
    // Send login data to server
    sendToServer('cefauthorization', password);
    hidePanel('auth-panel');
}

function handleAppClick(app) {
    console.log('App clicked:', app);
    
    switch (app) {
        case 'taxi':
            sendToServer('Taxi:app', '1');
            break;
        case 'bank':
            showPanel('bank-panel');
            sendToServer('Bank:app', '1');
            break;
        case 'gps':
            sendToServer('Clicked:app', '1');
            break;
    }
}

function handleSpawnLocation(locationId) {
    console.log('Spawn location selected:', locationId);
    sendToServer('spawn:location', locationId);
    hidePanel('spawn-panel');
}

// Utility Functions
function showPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.remove('hidden');
    }
}

function hidePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('hidden');
    }
}

function showNotification(header, text, type = 'info', autohide = true, delay = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-header">${header}</div>
        <div class="notification-text">${text}</div>
    `;
    
    container.appendChild(notification);
    
    if (autohide) {
        setTimeout(() => {
            notification.remove();
        }, delay);
    }
}

function getNotificationType(type) {
    switch (type) {
        case 0: return 'success';
        case 1: return 'error';
        case 2: return 'warning';
        case 3: return 'info';
        default: return 'info';
    }
}

function formatMoney(amount) {
    return '$' + amount.toLocaleString();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function sendToServer(event, data) {
    console.log('Sending to server:', event, data);
    
    // In actual CEF environment, this would send data to SA-MP server
    if (typeof mp !== 'undefined') {
        mp.trigger(event, data);
    } else {
        console.log('Test mode: Would send', event, 'with data:', data);
    }
}

// CEF Event Router - Based on real events from universal.pwn
function handleCEFEvent(eventName, ...args) {
    console.log('CEF Event received:', eventName, args);
    
    switch (eventName) {
        // Authentication System
        case 'data:pool:reg':
            handleDataPoolReg(args[0]);
            break;
        case 'reg:name':
            handleRegName(args[0]);
            break;
        case 'atv:name':
            handleAtvName(args[0]);
            break;
            
        // HUD System
        case 'Hud:zona':
            handleHudZona(args[0]);
            break;
        case 'Hud:timers':
            handleHudTimers(args[0], args[1], args[2]);
            break;
        case 'Hud:pinfo':
            handleHudPinfo(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            break;
        case 'data:hud:stats':
            handleDataHudStats(args[0]);
            break;
            
        // Vehicle System
        case 'data:vehicle':
            handleDataVehicle(args[0], args[1], args[2], args[3], args[4]);
            break;
            
        // Notification System
        case 'data:not':
            handleDataNot(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        case 'bonus:info':
            handleBonusInfo(args[0]);
            break;
        case 'job:bonus':
            handleJobBonus(args[0]);
            break;
            
        // Bank System
        case 'bank:info':
            handleBankInfo(args[0], args[1]);
            break;
            
        // Spawn System
        case 'spawn:info':
            handleSpawnInfo(args[0]);
            break;
        case 'spawn:lock':
            handleSpawnLock(args[0], args[1], args[2]);
            break;
            
        // Phone System
        case 'Taxi:app':
            handleTaxiApp(args[0]);
            break;
        case 'Phone:number':
            handlePhoneNumberCall(args[0]);
            break;
        case 'Bank:app':
            handleBankClickedApp(args[0]);
            break;
        case 'Clicked:app':
            handleAppClick('gps');
            break;
            
        // Job System
        case 'job:frame':
            handleJobFrame(args[0]);
            break;
            
        // Quest System
        case 'quest:frame':
            handleQuestFrame(args[0]);
            break;
            
        // Money System
        case 'game:CEF:money':
            handleGameCEFMoney(args[0]);
            break;
        case 'game:CEF:bank':
            handleGameCEFBank(args[0]);
            break;
            
        default:
            console.log('Unknown CEF event:', eventName, args);
    }
}

// Export for CEF environment
if (typeof window !== 'undefined') {
    window.handleCEFEvent = handleCEFEvent;
    window.showNotification = showNotification;
    window.showPanel = showPanel;
    window.hidePanel = hidePanel;
}
