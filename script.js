// Universal RP CEF JavaScript
class UniversalRP {
    constructor() {
        this.isLoaded = false;
        this.currentSystem = null;
        this.playerData = {
            name: '',
            level: 1,
            money: 0,
            bank: 0,
            health: 100,
            armor: 0,
            zone: 0
        };
        this.vehicleData = {
            engine: 0,
            lights: 0,
            fuel: 100,
            health: 100,
            doors: 0
        };
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startLoading();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    setupEventListeners() {
        // CEF Event Listeners
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type) {
                this.handleCEFEvent(data.type, data);
            }
        });

        // Keyboard Events
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });

        // Form Submissions
        document.getElementById('regUsername')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitRegistration();
        });
        document.getElementById('regPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitRegistration();
        });
        document.getElementById('regEmail')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitRegistration();
        });
        document.getElementById('authPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAuthorization();
        });
    }

    startLoading() {
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
                this.isLoaded = true;
            }, 500);
        }, 3000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ka-GE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const timeElements = document.querySelectorAll('#serverTime, #phoneTime');
        timeElements.forEach(el => {
            if (el) el.textContent = timeString;
        });
    }

    handleCEFEvent(type, data) {
        // Extract value from data object if it exists
        const value = data.value !== undefined ? data.value : data;
        
        switch (type) {
            case 'data:pool:reg':
                this.handleRegistration(data);
                break;
            case 'data:pool:name':
                this.updatePlayerName(value);
                break;
            case 'data:pool:number':
                this.updatePlayerNumber(value);
                break;
            case 'data:pool:job':
                this.updatePlayerJob(value);
                break;
            case 'data:pool:passid':
                this.updatePlayerPassId(value);
                break;
            case 'data:pool:bankcash':
                this.updatePlayerBank(value);
                break;
            case 'data:pool:havehouse':
                this.updatePlayerHouse(value);
                break;
            case 'data:pool:havecarid':
                this.updatePlayerCar(value);
                break;
            case 'data:pool:havebiz':
                this.updatePlayerBusiness(value);
                break;
            case 'reg:name':
                this.updatePlayerName(value);
                break;
            case 'atv:name':
                this.updatePlayerName(value);
                break;
            case 'Hud:zona':
                this.updateZone(value);
                break;
            case 'bonus:info':
                this.updateBonusInfo(value);
                break;
            case 'job:bonus':
                this.updateJobBonus(value);
                break;
            case 'data:hud:stats':
                this.updateHudStats(value);
                break;
            case 'data:not':
                this.showNotification(data);
                break;
            case 'data:vehicle':
                // Handle vehicle data from Pawn (comes as array of values)
                const vehicleData = Array.isArray(data) ? data : [data.engine, data.doors, data.lights, data.fuel, data.health];
                this.updateVehicleData(vehicleData);
                break;
            case 'Hud:timers':
                this.updateTimers(data);
                break;
            case 'spawn:info':
                this.updateSpawnInfo(value);
                break;
            case 'spawn:lock':
                this.updateSpawnLock(data);
                break;
            case 'bank:info':
                this.updateBankInfo(data);
                break;
            case 'Hud:pinfo':
                // Handle HUD player info (comes as array of values)
                if (Array.isArray(data)) {
                    this.playerData.health = data[0] || 100;
                    this.playerData.armor = data[1] || 0;
                } else {
                    this.playerData.health = data.health || 100;
                    this.playerData.armor = data.armor || 0;
                }
                this.updateHealthBar();
                this.updateArmorBar();
                break;
            case 'game:CEF:money':
                this.updateMoney(value);
                break;
            case 'game:CEF:bank':
                this.updateBank(value);
                break;
            case 'job:frame':
                this.updateJobFrame(value);
                break;
            case 'quest:frame':
                this.updateQuestFrame(value);
                break;
            default:
                console.log('Unknown CEF event:', type, data);
        }
    }

    handleRegistration(data) {
        if (data.value === 1) {
            this.showRegistration();
        } else if (data.value === 2) {
            this.showAuthorization();
        }
    }

    showRegistration() {
        this.hideAllSystems();
        document.getElementById('registrationSystem').classList.remove('hidden');
        this.currentSystem = 'registration';
    }

    showAuthorization() {
        this.hideAllSystems();
        document.getElementById('authorizationSystem').classList.remove('hidden');
        this.currentSystem = 'authorization';
    }

    hideAllSystems() {
        const systems = [
            'registrationSystem',
            'authorizationSystem',
            'phoneSystem',
            'bankSystem',
            'vehicleHUD',
            'jobSystem',
            'questSystem'
        ];
        systems.forEach(system => {
            document.getElementById(system).classList.add('hidden');
        });
    }

    submitRegistration() {
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const email = document.getElementById('regEmail').value;

        if (!username || !password || !email) {
            this.showNotification({
                type: 'error',
                header: 'Error',
                text: 'Please fill in all fields'
            });
            return;
        }

        // Send to Pawn
        this.sendToPawn('cefregistration', `${username},${password},${email}`);
        this.hideAllSystems();
    }

    submitAuthorization() {
        const password = document.getElementById('authPassword').value;

        if (!password) {
            this.showNotification({
                type: 'error',
                header: 'Error',
                text: 'Please enter password'
            });
            return;
        }

        // Send to Pawn
        this.sendToPawn('cefauthorization', password);
        this.hideAllSystems();
    }

    updatePlayerName(name) {
        this.playerData.name = name;
        const nameElement = document.getElementById('playerName');
        if (nameElement) nameElement.textContent = name;
    }

    updatePlayerNumber(number) {
        this.playerData.number = number;
    }

    updatePlayerJob(job) {
        this.playerData.job = job;
    }

    updatePlayerPassId(passId) {
        this.playerData.passId = passId;
    }

    updatePlayerBank(bank) {
        this.playerData.bank = bank;
        const bankElement = document.getElementById('playerBank');
        if (bankElement) bankElement.textContent = `$${bank.toLocaleString()}`;
    }

    updatePlayerHouse(house) {
        this.playerData.house = house;
    }

    updatePlayerCar(car) {
        this.playerData.car = car;
    }

    updatePlayerBusiness(business) {
        this.playerData.business = business;
    }

    updateZone(zone) {
        this.playerData.zone = zone;
        const zoneElement = document.getElementById('zoneIndicator');
        if (zoneElement) {
            if (zone === 1) {
                zoneElement.classList.add('danger');
                zoneElement.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Danger Zone</span>';
            } else {
                zoneElement.classList.remove('danger');
                zoneElement.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Safe Zone</span>';
            }
        }
    }

    updateBonusInfo(bonus) {
        let message = '';
        switch (bonus) {
            case 1:
                message = 'X2 Bonus Active!';
                break;
            case 2:
                message = 'X3 Bonus Active!';
                break;
            default:
                message = 'Bonus Inactive';
        }
        this.showNotification({
            type: 'info',
            header: 'Bonus',
            text: message
        });
    }

    updateJobBonus(bonus) {
        const message = bonus === 1 ? 'X2 Salary Active!' : 'Salary Normal';
        this.showNotification({
            type: 'info',
            header: 'Salary',
            text: message
        });
    }

    updateHudStats(stats) {
        // Handle HUD stats update
        console.log('HUD Stats:', stats);
    }

    updateVehicleData(data) {
        // Handle vehicle data from Pawn (comes as array of values)
        if (Array.isArray(data)) {
            this.vehicleData.engine = data[0] || 0;
            this.vehicleData.doors = data[1] || 0;
            this.vehicleData.lights = data[2] || 0;
            this.vehicleData.fuel = data[3] || 0;
            this.vehicleData.health = data[4] || 0;
        } else {
            if (data.engine !== undefined) this.vehicleData.engine = data.engine;
            if (data.lights !== undefined) this.vehicleData.lights = data.lights;
            if (data.fuel !== undefined) this.vehicleData.fuel = data.fuel;
            if (data.health !== undefined) this.vehicleData.health = data.health;
            if (data.doors !== undefined) this.vehicleData.doors = data.doors;
        }

        this.updateVehicleHUD();
    }

    updateVehicleHUD() {
        const vehicleHUD = document.getElementById('vehicleHUD');
        if (!vehicleHUD) return;

        // Show vehicle HUD if in vehicle
        if (this.vehicleData.engine !== undefined) {
            vehicleHUD.classList.remove('hidden');
        } else {
            vehicleHUD.classList.add('hidden');
            return;
        }

        // Update engine status
        const engineIcon = document.getElementById('engineIcon');
        const engineStatus = document.getElementById('engineStatus');
        if (engineIcon && engineStatus) {
            if (this.vehicleData.engine === 1) {
                engineIcon.style.color = '#27ae60';
                engineStatus.textContent = 'On';
            } else {
                engineIcon.style.color = '#e74c3c';
                engineStatus.textContent = 'Off';
            }
        }

        // Update lights status
        const lightsIcon = document.getElementById('lightsIcon');
        const lightsStatus = document.getElementById('lightsStatus');
        if (lightsIcon && lightsStatus) {
            if (this.vehicleData.lights === 1) {
                lightsIcon.style.color = '#f39c12';
                lightsStatus.textContent = 'On';
            } else {
                lightsIcon.style.color = '#95a5a6';
                lightsStatus.textContent = 'Off';
            }
        }

        // Update fuel
        const fuelBar = document.getElementById('fuelBar');
        const fuelText = document.getElementById('fuelText');
        if (fuelBar && fuelText) {
            const fuelPercent = Math.max(0, Math.min(100, this.vehicleData.fuel));
            fuelBar.style.width = `${fuelPercent}%`;
            fuelText.textContent = `${Math.round(fuelPercent)}%`;
        }

        // Update vehicle health
        const vehicleHealthBar = document.getElementById('vehicleHealthBar');
        const vehicleHealthText = document.getElementById('vehicleHealthText');
        if (vehicleHealthBar && vehicleHealthText) {
            const healthPercent = Math.max(0, Math.min(100, this.vehicleData.health));
            vehicleHealthBar.style.width = `${healthPercent}%`;
            vehicleHealthText.textContent = `${Math.round(healthPercent)}%`;
        }
    }

    updateTimers(data) {
        // Handle jail time, taxi time, admin status
        console.log('Timers:', data);
    }

    updateSpawnInfo(level) {
        this.playerData.level = level;
        const levelElement = document.getElementById('playerLevel');
        if (levelElement) levelElement.textContent = `Level ${level}`;
    }

    updateSpawnLock(data) {
        // Handle spawn lock data
        console.log('Spawn Lock:', data);
    }

    updateBankInfo(data) {
        // Handle bank info from Pawn (comes as array of values)
        if (Array.isArray(data)) {
            this.playerData.money = data[0] || 0;
            this.playerData.bank = data[1] || 0;
        } else {
            if (data.money !== undefined) {
                this.playerData.money = data.money;
            }
            if (data.bank !== undefined) {
                this.playerData.bank = data.bank;
            }
        }
        
        const moneyElement = document.getElementById('playerMoney');
        if (moneyElement) moneyElement.textContent = `$${this.playerData.money.toLocaleString()}`;
        
        const bankElement = document.getElementById('playerBank');
        if (bankElement) bankElement.textContent = `$${this.playerData.bank.toLocaleString()}`;
    }

    updatePlayerInfo(data) {
        if (data.health !== undefined) {
            this.playerData.health = data.health;
            this.updateHealthBar();
        }
        if (data.armor !== undefined) {
            this.playerData.armor = data.armor;
            this.updateArmorBar();
        }
    }

    updateHealthBar() {
        const healthBar = document.getElementById('healthBar');
        const healthText = document.getElementById('healthText');
        if (healthBar && healthText) {
            const healthPercent = Math.max(0, Math.min(100, this.playerData.health));
            healthBar.style.width = `${healthPercent}%`;
            healthText.textContent = Math.round(healthPercent);
        }
    }

    updateArmorBar() {
        const armorBar = document.getElementById('armorBar');
        const armorText = document.getElementById('armorText');
        if (armorBar && armorText) {
            const armorPercent = Math.max(0, Math.min(100, this.playerData.armor));
            armorBar.style.width = `${armorPercent}%`;
            armorText.textContent = Math.round(armorPercent);
        }
    }

    updateMoney(money) {
        this.playerData.money = money;
        const moneyElement = document.getElementById('playerMoney');
        if (moneyElement) moneyElement.textContent = `$${money.toLocaleString()}`;
    }

    updateBank(bank) {
        this.playerData.bank = bank;
        const bankElement = document.getElementById('playerBank');
        if (bankElement) bankElement.textContent = `$${bank.toLocaleString()}`;
    }

    updateJobFrame(frame) {
        const jobSystem = document.getElementById('jobSystem');
        const jobContent = document.getElementById('jobContent');
        
        if (!jobSystem || !jobContent) return;

        if (frame >= 0) {
            jobSystem.classList.remove('hidden');
            this.currentSystem = 'job';
            
            // Update job content based on frame
            const jobTitles = [
                'Unemployed',
                'Police Officer',
                'Medic',
                'Mechanic',
                'Taxi Driver',
                'Trucker',
                'Pilot',
                'Farmer',
                'Business Owner'
            ];
            
            jobContent.innerHTML = `
                <div class="job-item">
                    <h4>${jobTitles[frame] || 'Unknown Job'}</h4>
                    <p>Current job information and status</p>
                </div>
            `;
        } else {
            jobSystem.classList.add('hidden');
        }
    }

    updateQuestFrame(quest) {
        const questSystem = document.getElementById('questSystem');
        const questContent = document.getElementById('questContent');
        
        if (!questSystem || !questContent) return;

        if (quest >= 0) {
            questSystem.classList.remove('hidden');
            this.currentSystem = 'quest';
            
            questContent.innerHTML = `
                <div class="quest-item">
                    <h4>Quest ${quest}</h4>
                    <p>Quest description and objectives</p>
                </div>
            `;
        } else {
            questSystem.classList.add('hidden');
        }
    }

    showNotification(data) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${data.type || 'info'}`;
        
        const header = data.header || 'Notification';
        const text = data.text || data.value || 'No message';
        
        notification.innerHTML = `
            <div class="notification-header">${header}</div>
            <div class="notification-text">${text}</div>
        `;

        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        const delay = data.delay || 5000;
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, delay);
    }

    openApp(app) {
        switch (app) {
            case 'phone':
                this.openPhone();
                break;
            case 'bank':
                this.openBank();
                break;
            case 'taxi':
                this.openTaxi();
                break;
            case 'gps':
                this.openGPS();
                break;
            case 'settings':
                this.openSettings();
                break;
        }
    }

    openPhone() {
        this.hideAllSystems();
        document.getElementById('phoneSystem').classList.remove('hidden');
        this.currentSystem = 'phone';
    }

    openBank() {
        this.hideAllSystems();
        document.getElementById('bankSystem').classList.remove('hidden');
        this.currentSystem = 'bank';
        this.updateBankDisplay();
    }

    openTaxi() {
        this.sendToPawn('Taxi:app', '0');
    }

    openGPS() {
        this.sendToPawn('Clicked:app', '0');
    }

    openSettings() {
        this.showNotification({
            type: 'info',
            header: 'Settings',
            text: 'Settings panel coming soon!'
        });
    }

    updateBankDisplay() {
        const bankCash = document.getElementById('bankCash');
        const bankAccount = document.getElementById('bankAccount');
        
        if (bankCash) bankCash.textContent = `$${this.playerData.money.toLocaleString()}`;
        if (bankAccount) bankAccount.textContent = `$${this.playerData.bank.toLocaleString()}`;
    }

    bankAction(action) {
        this.sendToPawn('Bank:app', action.toString());
    }

    closeBank() {
        document.getElementById('bankSystem').classList.add('hidden');
        this.currentSystem = null;
    }

    handleKeyPress(event) {
        // Handle ESC key to close systems
        if (event.key === 'Escape') {
            if (this.currentSystem) {
                this.hideAllSystems();
                this.currentSystem = null;
            }
        }
        
        // Handle F1 key for phone
        if (event.key === 'F1') {
            event.preventDefault();
            this.openPhone();
        }
        
        // Handle F2 key for bank
        if (event.key === 'F2') {
            event.preventDefault();
            this.openBank();
        }
    }

    sendToPawn(event, data) {
        // Send data to Pawn script
        if (window.cef) {
            window.cef.emit(event, data);
        } else {
            console.log('Sending to Pawn:', event, data);
        }
    }
}

// Global functions for HTML onclick events
function submitRegistration() {
    if (window.universalRP) {
        window.universalRP.submitRegistration();
    }
}

function submitAuthorization() {
    if (window.universalRP) {
        window.universalRP.submitAuthorization();
    }
}

function openApp(app) {
    if (window.universalRP) {
        window.universalRP.openApp(app);
    }
}

function bankAction(action) {
    if (window.universalRP) {
        window.universalRP.bankAction(action);
    }
}

function closeBank() {
    if (window.universalRP) {
        window.universalRP.closeBank();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.universalRP = new UniversalRP();
});

// CEF Integration
window.cef = {
    emit: function(event, data) {
        // This would be replaced with actual CEF integration
        console.log('CEF Emit:', event, data);
    }
};
