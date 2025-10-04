// CEF Integration for Spawnchoose
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all spawn options
    const spawnButtons = document.querySelectorAll('[class*="rectangle-3462456"]');
    
    spawnButtons.forEach((button, index) => {
        // Map the buttons to correct spawn types:
        // 0: Fraction Spawn
        // 1: House Spawn
        // 2: Random Spawn
        // 3: Last Position Spawn
        let spawnType = index;
        
        button.addEventListener('click', function() {
            // Send spawn choice to server (0-3)
            sendSpawnChoice(spawnType);
        });
        
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.classList.add('rectangle-active');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('rectangle-active');
        });
    });
    
    // Initialize CEF event listener
    window.addEventListener('message', function(event) {
        const data = event.data;
        
        if (data.type === 'spawn:info') {
            // Handle spawn info if needed
            console.log('Spawn info received:', data);
        }
        
        if (data.type === 'spawn:lock') {
            // Handle lock info for spawn options
            updateSpawnOptions(data);
        }
    });
});

function sendSpawnChoice(choice) {
    // Send choice to server using CEF
    if (typeof cefQuery !== 'undefined') {
        cefQuery({
            request: 'spawnchoose:select,' + choice,
            onSuccess: function(response) {
                console.log('Spawn choice sent successfully:', response);
            },
            onFailure: function(errorCode, errorMessage) {
                console.error('Failed to send spawn choice:', errorMessage);
            }
        });
    } else {
        // Fallback for testing
        console.log('Sending spawn choice:', choice);
        // You can simulate the CEF call for testing
        // In a real environment, this would be handled by the CEF framework
    }
}

function updateSpawnOptions(data) {
    // Update UI based on available spawn options
    const factionButton = document.querySelector('.rectangle-34624563-8wRukR');
    const houseButton = document.querySelector('.rectangle-34624562-8wRukR');
    const lastPositionButton = document.querySelector('.rectangle-34624564-8wRukR');
    
    // Hide/show options based on player data
    if (data.faction === 0) {
        // Player not in faction, hide faction spawn
        if (factionButton) factionButton.style.display = 'none';
    }
    
    if (data.house === 0) {
        // Player doesn't have house, hide house spawn
        if (houseButton) houseButton.style.display = 'none';
    }
    
    if (data.lastPosition === 0) {
        // Player doesn't have last position, hide last position spawn
        if (lastPositionButton) lastPositionButton.style.display = 'none';
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}