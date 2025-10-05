// Inventory System JavaScript
class InventorySystem {
    constructor() {
        this.currentTab = 'inventory';
        this.selectedItem = null;
        this.currentCategory = 'weapons';
        this.inventory = [];
        this.shopItems = {};
        this.playerData = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateInventorySlots();
        this.loadShopItems();
        this.setupTooltips();
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeInventory();
            }
            if (e.key === 'Enter' && this.selectedItem) {
                this.useSelectedItem();
            }
        });

        // CEF Event Listeners
        if (typeof cef !== 'undefined') {
            cef.on('inventory:data', (data) => {
                this.updateInventory(JSON.parse(data));
            });

            cef.on('inventory:playerData', (data) => {
                this.updatePlayerData(JSON.parse(data));
            });

            cef.on('inventory:shopData', (data) => {
                this.updateShopData(JSON.parse(data));
            });
        }
    }

    // Tab Management
    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        if (tabName === 'inventory') {
            this.loadInventory();
        } else if (tabName === 'shop') {
            this.loadShop();
        } else if (tabName === 'stats') {
            this.loadStats();
        }
    }

    // Inventory Management
    generateInventorySlots() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';

        for (let i = 0; i < 40; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot empty';
            slot.dataset.slot = i;
            slot.addEventListener('click', () => this.selectSlot(i));
            slot.addEventListener('mouseenter', (e) => this.showTooltip(e, i));
            slot.addEventListener('mouseleave', () => this.hideTooltip());
            grid.appendChild(slot);
        }
    }

    selectSlot(slotIndex) {
        // Remove previous selection
        document.querySelectorAll('.inventory-slot').forEach(slot => slot.classList.remove('selected'));

        // Select new slot
        const slot = document.querySelector(`[data-slot="${slotIndex}"]`);
        slot.classList.add('selected');
        this.selectedItem = slotIndex;

        // Update action buttons
        this.updateActionButtons();
    }

    updateInventory(inventoryData) {
        this.inventory = inventoryData;
        this.renderInventory();
    }

    renderInventory() {
        const slots = document.querySelectorAll('.inventory-slot');
        
        slots.forEach((slot, index) => {
            const item = this.inventory.find(item => item.slot === index);
            
            if (item) {
                slot.className = 'inventory-slot';
                slot.innerHTML = `
                    <div class="item-icon">${this.getItemIcon(item.item_type)}</div>
                    <div class="item-name">${item.item_name}</div>
                    ${item.item_amount > 1 ? `<div class="item-amount">${item.item_amount}</div>` : ''}
                `;
            } else {
                slot.className = 'inventory-slot empty';
                slot.innerHTML = '';
            }
        });
    }

    getItemIcon(itemType) {
        const icons = {
            'weapon': '🔫',
            'food': '🍎',
            'drink': '🥤',
            'clothes': '👕',
            'misc': '📦',
            'tool': '🔧',
            'key': '🗝️',
            'phone': '📱',
            'money': '💰',
            'drug': '💊'
        };
        return icons[itemType] || '📦';
    }

    useSelectedItem() {
        if (this.selectedItem === null) return;

        const item = this.inventory.find(item => item.slot === this.selectedItem);
        if (!item) return;

        // Send use item event to server
        if (typeof cef !== 'undefined') {
            cef.emit('inventory:useItem', JSON.stringify({
                slot: this.selectedItem,
                itemId: item.item_id
            }));
        }

        this.showNotification(`Used ${item.item_name}`, 'success');
    }

    dropSelectedItem() {
        if (this.selectedItem === null) return;

        const item = this.inventory.find(item => item.slot === this.selectedItem);
        if (!item) return;

        if (confirm(`Are you sure you want to drop ${item.item_name}?`)) {
            // Send drop item event to server
            if (typeof cef !== 'undefined') {
                cef.emit('inventory:dropItem', JSON.stringify({
                    slot: this.selectedItem,
                    itemId: item.item_id
                }));
            }

            this.showNotification(`Dropped ${item.item_name}`, 'info');
        }
    }

    updateActionButtons() {
        const useBtn = document.querySelector('.inventory-actions .btn-primary');
        const dropBtn = document.querySelector('.inventory-actions .btn-danger');
        
        if (this.selectedItem !== null) {
            const item = this.inventory.find(item => item.slot === this.selectedItem);
            useBtn.disabled = !item;
            dropBtn.disabled = !item;
        } else {
            useBtn.disabled = true;
            dropBtn.disabled = true;
        }
    }

    // Shop Management
    switchCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentCategory = category;
        this.renderShopItems();
    }

    loadShopItems() {
        // Default shop items
        this.shopItems = {
            weapons: [
                { id: 1, name: 'Pistol', price: 500, icon: '🔫', type: 'weapon', description: 'Basic handgun' },
                { id: 2, name: 'AK-47', price: 2500, icon: '🔫', type: 'weapon', description: 'Assault rifle' },
                { id: 3, name: 'Shotgun', price: 1200, icon: '🔫', type: 'weapon', description: 'Close range weapon' }
            ],
            food: [
                { id: 4, name: 'Burger', price: 15, icon: '🍔', type: 'food', description: 'Restores 50 HP' },
                { id: 5, name: 'Pizza', price: 25, icon: '🍕', type: 'food', description: 'Restores 75 HP' },
                { id: 6, name: 'Water', price: 5, icon: '💧', type: 'drink', description: 'Restores 25 HP' }
            ],
            clothes: [
                { id: 7, name: 'T-Shirt', price: 50, icon: '👕', type: 'clothes', description: 'Basic clothing' },
                { id: 8, name: 'Jeans', price: 80, icon: '👖', type: 'clothes', description: 'Casual pants' },
                { id: 9, name: 'Sneakers', price: 120, icon: '👟', type: 'clothes', description: 'Comfortable shoes' }
            ],
            misc: [
                { id: 10, name: 'Phone', price: 300, icon: '📱', type: 'misc', description: 'Communication device' },
                { id: 11, name: 'Keys', price: 20, icon: '🗝️', type: 'misc', description: 'House keys' },
                { id: 12, name: 'Toolbox', price: 150, icon: '🔧', type: 'tool', description: 'Repair tools' }
            ]
        };
    }

    renderShopItems() {
        const grid = document.getElementById('shopGrid');
        const items = this.shopItems[this.currentCategory] || [];
        
        grid.innerHTML = items.map(item => `
            <div class="shop-item" onclick="inventorySystem.buyItem(${item.id})">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-price">$${item.price}</div>
                <div class="shop-item-description">${item.description}</div>
                <button class="btn btn-primary">Buy</button>
            </div>
        `).join('');
    }

    buyItem(itemId) {
        const category = this.shopItems[this.currentCategory];
        const item = category.find(item => item.id === itemId);
        
        if (!item) return;

        if (confirm(`Buy ${item.name} for $${item.price}?`)) {
            // Send buy item event to server
            if (typeof cef !== 'undefined') {
                cef.emit('inventory:buyItem', JSON.stringify({
                    itemId: itemId,
                    price: item.price
                }));
            }

            this.showNotification(`Bought ${item.name}`, 'success');
        }
    }

    // Player Data Management
    updatePlayerData(data) {
        this.playerData = data;
        
        document.getElementById('playerName').textContent = data.name || 'Player Name';
        document.getElementById('playerLevel').textContent = `Level: ${data.level || 1}`;
        document.getElementById('playerMoney').textContent = `$${(data.money || 0).toLocaleString()}`;
        
        // Update avatar if available
        if (data.avatar) {
            document.getElementById('playerAvatar').src = data.avatar;
        }
    }

    // Statistics
    loadStats() {
        // Load player statistics
        if (typeof cef !== 'undefined') {
            cef.emit('inventory:getStats', '');
        }
    }

    updateStats(stats) {
        document.getElementById('playTime').textContent = `${stats.playTime || 0} hours`;
        document.getElementById('kills').textContent = stats.kills || 0;
        document.getElementById('deaths').textContent = stats.deaths || 0;
        document.getElementById('distance').textContent = `${stats.distance || 0} km`;
    }

    // Tooltip Management
    setupTooltips() {
        this.tooltip = document.getElementById('itemTooltip');
    }

    showTooltip(event, slotIndex) {
        const item = this.inventory.find(item => item.slot === slotIndex);
        if (!item) return;

        this.tooltip.innerHTML = `
            <h4 id="tooltipName">${item.item_name}</h4>
            <p id="tooltipDescription">${item.description || 'No description available'}</p>
            <div class="tooltip-stats" id="tooltipStats">
                Type: ${item.item_type}<br>
                Amount: ${item.item_amount}
            </div>
        `;

        this.tooltip.style.left = event.pageX + 10 + 'px';
        this.tooltip.style.top = event.pageY - 10 + 'px';
        this.tooltip.classList.add('show');
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#20c997',
            error: '#ff4757',
            info: '#4f8cff',
            warning: '#ffa502'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    closeInventory() {
        if (typeof cef !== 'undefined') {
            cef.emit('inventory:close', '');
        }
    }

    // Public methods for global access
    loadInventory() {
        if (typeof cef !== 'undefined') {
            cef.emit('inventory:getInventory', '');
        }
    }

    loadShop() {
        this.renderShopItems();
    }
}

// Global functions for HTML onclick events
function switchTab(tabName) {
    inventorySystem.switchTab(tabName);
}

function switchCategory(category) {
    inventorySystem.switchCategory(category);
}

function useSelectedItem() {
    inventorySystem.useSelectedItem();
}

function dropSelectedItem() {
    inventorySystem.dropSelectedItem();
}

function closeInventory() {
    inventorySystem.closeInventory();
}

// Initialize the inventory system when page loads
let inventorySystem;
document.addEventListener('DOMContentLoaded', () => {
    inventorySystem = new InventorySystem();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
