# flowOS 🚀

A modern, fast, and feature-rich Web Desktop Operating System built with pure Vanilla HTML5, CSS3, and JavaScript. Designed with a sleek, responsive interface for developers, power users, and crypto enthusiasts.

---

## 🌟 Features Overview

### 🖥️ Desktop & Window Management
- **Smooth Windowing Engine**: Drag, resize in 8 directions, minimize, maximize, and focus management with dynamic Z-indexing.
- **Window Snapping**: Edge snapping support for fast layout arrangements.
- **Interactive macOS-style Dock**: Fluid magnification physics on mouse hover, running app indicators, bounce animations, and custom icon size scaling.
- **Dynamic Menu Bar**: Context-aware application menus, system menu, and a live synchronized status clock.
- **Desktop Icons & Context Menu**: Right-click context menus with actions for new folders, wallpaper changes, theme switching, and icon sorting.
- **Mission Control**: Full-screen overview displaying running and minimized windows for instant switching.
- **App Switcher (`⌘ / Ctrl + Tab`)**: Fast keyboard-driven cycling between active applications.
- **Spotlight Search (`⌘ / Ctrl + Space`)**: Universal instant search across all installed applications and file system nodes.
- **System Notifications**: Non-intrusive floating toast notifications with auto-dismissal.

---

## 📱 Built-in Application Suite

| Application | Description | Key Features |
| :--- | :--- | :--- |
| **📁 Files** | Hierarchical File Explorer | Breadcrumb navigation, Grid/List view toggle, instant search, sidebar bookmarks, and file drag-and-drop to Desktop. |
| **🌐 Browser** | Multi-Tab Web Browser | Tab management, URL bar navigation, quick favorites (Wikipedia, GitHub, etc.), and sandboxed web previews. |
| **📝 Notes** | Rich Text Notepad | Auto-saving notes, note list sidebar, creation timestamping, and inline formatting (Bold, Italic, Underline). |
| **💻 Terminal** | Interactive Command Shell | Virtual filesystem commands, command history (`↑` / `↓`), colored syntax, and path awareness. |
| **🧮 Calculator** | Standard & Memory Calculator | Floating-point math, operations history display, percentage, sign toggle (`±`), and memory registers (`MC`, `MR`, `M+`, `M-`). |
| **⚙️ Settings** | System Preferences | Light / Dark theme toggles, dynamic accent color selector, custom wallpaper gallery, and Dock slider controls. |
| **📅 Calendar** | Monthly Planner & Agenda | Month navigation, today highlight, custom event scheduler, and visual event indicators. |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`⌘ / Ctrl + Space`** | Open Spotlight Universal Search |
| **`⌘ / Ctrl + Tab`** | Open App Switcher & cycle through open windows |
| **`⌘ / Ctrl + W`** | Close currently focused window |
| **`⌘ / Ctrl + M`** | Minimize currently focused window |
| **`Escape`** | Close Spotlight, Mission Control, App Switcher, or Context Menus |
| **`↑ / ↓` (in Terminal)** | Cycle through command history |

---

## 💻 Terminal Commands

The built-in terminal interacts directly with the virtual file system:

- `help` - Show list of available commands
- `ls [dir]` - List directory contents
- `cd <dir>` - Change current working directory
- `pwd` - Print current working directory path
- `cat <file>` - Print file contents to terminal
- `echo <text>` - Print text to console
- `whoami` - Display current active user
- `date` - Display current date and time
- `clear` - Clear terminal screen

---

## 🛠️ Tech Stack & Architecture

- **Core**: Semantic HTML5 & Modern Vanilla JavaScript (ES6+ modular design pattern)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Theme tokens, glassmorphism, responsive backdrops, and hardware-accelerated animations)
- **Persistence**: `localStorage` integration for preserving notes, calendar events, themes, dock configurations, and wallpaper preferences
- **Zero Dependencies**: 100% lightweight, no heavy frameworks, instant boot-up time

---

## 📂 Project Structure

```
flowOS/
├── index.html     # Main OS layout, bootloader, window containers & UI markup
├── style.css      # Design system, glassmorphism styles, dark/light themes & animations
├── script.js     # OS kernel, window manager, virtual file system & app implementations
├── README.md      # Comprehensive documentation
└── .gitignore     # Git ignore configuration
```

---

## 🚀 Getting Started

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AP-boi/flowOS.git
   ```
2. Navigate into the directory:
   ```bash
   cd flowOS
   ```
3. Open `index.html` in any modern web browser, or serve it using your preferred local server:
   ```bash
   # Using Python
   python -m http.server 3000

   # Using Node (npx)
   npx serve .
   ```

---

## 📄 License

Open-source under the [MIT License](LICENSE).
