# Universal RP CEF System - Installation Guide

## პრობლემების გადაჭრა

### 1. /mm command არ მუშაობს
**გადაჭრა:** დავამატე `/mm` command რომელიც იხსნება CEF მენიუს.

### 2. მოთამაშის ინფორმაცია არ იტვირთება
**გადაჭრა:** გავასწორე `CefMenu` ფუნქცია რომელიც აგზავნის მოთამაშის მონაცემებს CEF-ში.

### 3. ფული არ იჩვენება (0 ჩანს)
**გადაჭრა:** გავასწორე JavaScript-ში მონაცემების მიღება და გამოჩენა.

### 4. GPS არ მუშაობს
**გადაჭრა:** გავასწორე CEF callback ფუნქციები GPS-ისთვის.

### 5. მანქანის ინფორმაცია არ იჩვენება
**გადაჭრა:** გავასწორე vehicle data emission და JavaScript parsing.

## ინსტალაციის ნაბიჯები

### 1. ფაილების განთავსება
```
gamemodes/
├── cef/
│   ├── index.html          (მთავარი CEF ინტერფეისი)
│   ├── styles.css          (CSS სტილები)
│   ├── script.js           (JavaScript ლოგიკა)
│   ├── config.js           (კონფიგურაცია)
│   ├── demo.html           (დემო ვერსია)
│   ├── test.html           (ტესტირების ვერსია)
│   └── README.md           (დოკუმენტაცია)
└── universal.pwn           (განახლებული gamemode)
```

### 2. CEF Plugin
დარწმუნდით რომ გაქვთ CEF plugin დაყენებული სერვერზე.

### 3. ბრაუზერის URL
განაახლეთ `MainCefInit` ფუნქციაში URL:
```pawn
cef_create_browser(playerid, 4, "file:///cef/index.html", false, false);
```

## გამოყენება

### ძირითადი Commands
- `/mm` - CEF მთავარი მენიუ
- `/phone` - ტელეფონის სისტემა
- `/gps` - GPS სისტემა

### CEF Events
```pawn
// მოთამაშის ინფორმაციის განახლება
cef_emit_event(playerid, "Hud:pinfo", CEFINT(health), CEFINT(armor));

// ფულის განახლება
cef_emit_event(playerid, "game:CEF:money", CEFINT(money));

// მანქანის ინფორმაცია
cef_emit_event(playerid, "data:vehicle", CEFINT(engine), CEFINT(doors), CEFINT(lights), CEFINT(fuel), CEFINT(health));

// შეტყობინება
cef_emit_event(playerid, "data:not", CEFSTR("Header"), CEFSTR("Text"), CEFSTR("success"), CEFINT(1), CEFINT(3000));
```

## ტესტირება

### 1. ბრაუზერში ტესტირება
გახსენით `test.html` ბრაუზერში და შეამოწმეთ ყველა ფუნქცია.

### 2. სერვერზე ტესტირება
1. დააკომპილირეთ gamemode
2. გაუშვით სერვერი
3. შედით თამაშში
4. გამოიყენეთ `/mm` command

## ცნობილი პრობლემები

### 1. CEF Plugin
თუ CEF არ მუშაობს, შეამოწმეთ:
- CEF plugin დაყენებულია
- ბრაუზერის URL სწორია
- ფაილების გზები სწორია

### 2. JavaScript Errors
თუ JavaScript errors არის:
- შეამოწმეთ browser console
- შეამოწმეთ CEF events
- შეამოწმეთ data format

### 3. Pawn Compilation
თუ compilation errors არის:
- შეამოწმეთ forward declarations
- შეამოწმეთ CEF include
- შეამოწმეთ function signatures

## მხარდაჭერა

### Debug Mode
JavaScript-ში ჩართეთ debug mode:
```javascript
const CEFConfig = {
    debug: true,
    // ... other settings
};
```

### Console Logging
ყველა CEF event იწერება console-ში:
```javascript
console.log('CEF Event:', type, data);
```

### CEF Events List
ყველა CEF event:
- `data:pool:reg` - რეგისტრაცია/ავტორიზაცია
- `Hud:pinfo` - მოთამაშის ინფორმაცია
- `game:CEF:money` - ფული
- `game:CEF:bank` - ბანკი
- `data:vehicle` - მანქანის ინფორმაცია
- `Hud:zona` - ზონის სტატუსი
- `data:not` - შეტყობინებები
- `job:frame` - სამუშაო ფრეიმი
- `quest:frame` - ქვესტ ფრეიმი

## კონტაქტი

თუ გაქვთ კითხვები ან პრობლემები, დაუკავშირდით განვითარებულს.
