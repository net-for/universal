# Universal CEF System

A comprehensive Chromium Embedded Framework (CEF) system for SA-MP servers, designed to provide modern web-based UI components for roleplay servers.

## Overview

This CEF system provides a complete set of UI components and functionality that can be integrated with SA-MP servers. It includes authentication, HUD, vehicle information, notifications, phone system, bank system, and spawn selection.

## File Structure

```
cef/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality and CEF event handlers
└── README.md           # This documentation file
```

## Features

### 1. Authentication System
- **Registration Form**: Username, password, and email input
- **Login Form**: Password-based authentication
- **Server Integration**: Sends data to SA-MP server via CEF events

### 2. HUD (Heads-Up Display)
- **Player Information**: Health, armor, level, money, bank balance, current zone
- **Zone Status**: Safe zone and danger zone indicators
- **Timers**: Jail time and taxi time display
- **Bonus Indicators**: Active bonus and salary multipliers

### 3. Vehicle System
- **Engine Status**: On/off indicator
- **Door Status**: Locked/unlocked indicator
- **Light Status**: On/off indicator
- **Fuel Level**: Visual progress bar
- **Vehicle Health**: Health status with progress bar

### 4. Notification System
- **Multiple Types**: Success, error, warning, and info notifications
- **Auto-hide**: Configurable auto-hide with delay
- **Customizable**: Header, text, color, and timing options

### 5. Phone System
- **App Interface**: Taxi, Bank, and GPS apps
- **Interactive Buttons**: Clickable app buttons
- **Server Communication**: Sends app interactions to server

### 6. Bank System
- **Account Information**: Cash and roulette money display
- **Interactive Interface**: Bank app functionality
- **Real-time Updates**: Live balance updates

### 7. Spawn System
- **Location Selection**: Multiple spawn location options
- **Level-based Access**: Spawn locations based on player level
- **Member Restrictions**: Family and organization member restrictions

## CEF Events

The system handles the following CEF events from the SA-MP server:

### Authentication Events
- `data:pool:reg` - Registration status (1 = show reg form, 2 = show login form)
- `reg:name` - Pre-fill username in registration
- `atv:name` - Pre-fill username for ATV registration

### HUD Events
- `Hud:zona` - Zone status (0 = safe, 1 = danger)
- `Hud:timers` - Timer updates (jail time, taxi time, admin status)
- `Hud:pinfo` - Player information (health, armor, level, money, bank, zone)
- `data:hud:stats` - HUD statistics status

### Vehicle Events
- `data:vehicle` - Vehicle information (engine, doors, lights, fuel, health)

### Notification Events
- `data:not` - Notification display (type, header, text, color, autohide, delay)
- `bonus:info` - Bonus status (0 = off, 1 = x2, 2 = x3)
- `job:bonus` - Job bonus status (0 = off, 1 = x2 salary)

### Bank Events
- `bank:info` - Bank information (cash, roulette money)

### Spawn Events
- `spawn:info` - Spawn information (player level)
- `spawn:lock` - Spawn location restrictions (member, family, location)

### Phone Events
- `Taxi:app` - Taxi app interactions
- `Phone:number` - Phone number calling
- `Bank:app` - Bank app interactions
- `Clicked:app` - General app clicks

## Server Integration

### PAWN Functions Required

The following PAWN functions should be implemented in your server script:

```pawn
// CEF Event Emission
cef_emit_event(playerid, "event_name", CEFINT(value), CEFSTR(string));

// CEF Browser Control
cef_focus_browser(playerid, browser_id, focus);
cef_hide_browser(playerid, browser_id, hide);
cef_destroy_browser(playerid, browser_id);

// CEF Event Subscription
cef_subscribe("event_name", "callback_function");
```

### Callback Functions

Implement these callback functions in your PAWN script:

```pawn
// Authentication callbacks
forward cefregistration(playerid, args[]);
public cefregistration(playerid, args[]) {
    // Handle registration data
}

forward cefauthorization(playerid, args[]);
public cefauthorization(playerid, args[]) {
    // Handle login data
}

// App callbacks
publics: Taxicef(playerid, const arguments[]) {
    // Handle taxi app interactions
}

publics: BankClickedApp(playerid, const arguments[]) {
    // Handle bank app interactions
}

publics: PhoneNumberCall(playerid, const arguments[]) {
    // Handle phone number calls
}

publics: ClickedApp(playerid, const arguments[]) {
    // Handle general app clicks
}
```

## Usage Examples

### 1. Show Authentication Panel
```pawn
cef_emit_event(playerid, "data:pool:reg", CEFINT(1)); // Show registration
cef_emit_event(playerid, "data:pool:reg", CEFINT(2)); // Show login
cef_focus_browser(playerid, 3, true);
cef_hide_browser(playerid, 3, false);
```

### 2. Update Player HUD
```pawn
cef_emit_event(playerid, "Hud:pinfo", 
    CEFINT(health), 
    CEFINT(armor), 
    CEFINT(level), 
    CEFINT(playerid), 
    CEFINT(money), 
    CEFINT(bank), 
    CEFSTR(zone)
);
```

### 3. Show Notification
```pawn
cef_emit_event(playerid, "data:not", 
    CEFINT(0), // Type (0=success, 1=error, 2=warning, 3=info)
    CEFSTR("Welcome"), // Header
    CEFSTR("Welcome to the server!"), // Text
    CEFSTR("#27ae60"), // Color
    CEFINT(1), // Auto-hide
    CEFINT(5000) // Delay
);
```

### 4. Update Vehicle Information
```pawn
cef_emit_event(playerid, "data:vehicle", 
    CEFINT(engine), // Engine status (0=off, 1=on)
    CEFINT(doors), // Door status (0=locked, 1=unlocked)
    CEFINT(lights), // Light status (0=off, 1=on)
    CEFINT(fuel), // Fuel percentage
    CEFINT(health) // Vehicle health
);
```

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- All components use CSS variables for easy theming
- Responsive design included for different screen sizes

### Functionality
- Extend `script.js` to add new CEF events
- Modify event handlers to change behavior
- Add new UI components as needed

### Server Integration
- Add new CEF events in your PAWN script
- Implement corresponding callback functions
- Use `cef_emit_event()` to send data to the browser

## Browser Requirements

- Modern web browser with JavaScript support
- CEF (Chromium Embedded Framework) for SA-MP integration
- HTML5 and CSS3 support

## Performance Considerations

- The system is optimized for real-time updates
- Minimal DOM manipulation for better performance
- Efficient event handling and memory management
- Responsive design for various screen sizes

## Troubleshooting

### Common Issues

1. **CEF Events Not Working**
   - Ensure CEF plugin is properly loaded
   - Check browser ID in `cef_focus_browser()` calls
   - Verify event names match exactly

2. **Styling Issues**
   - Check CSS file is loaded correctly
   - Verify HTML structure matches CSS selectors
   - Test in different browsers

3. **JavaScript Errors**
   - Check browser console for errors
   - Ensure all required elements exist in HTML
   - Verify event handler functions are defined

### Debug Mode

Enable debug mode by setting `console.log` statements in the JavaScript file to see CEF events and data flow.

## License

This CEF system is provided as-is for SA-MP server use. Modify and distribute according to your server's needs.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the server integration examples
3. Test with the provided examples
4. Modify the code to fit your specific needs

## Version History

- **v1.0** - Initial release with core functionality
- Complete authentication, HUD, vehicle, notification, phone, bank, and spawn systems
- Full SA-MP server integration
- Responsive design and modern UI
