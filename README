[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

# Contacts-App-Clients

A modern, reactive frontend for the **Contacts App**, built with **SvelteKit** and designed to run across multiple targets:

- 🌐 Web (SPA via Nginx / static hosting)
- 🖥 Desktop (Windows & Linux via **Wails**)

This repository consumes the [Contacts App Backend](https://github.com/Alexzander-Hurd/Contacts-App-Backend) and demonstrates a **write-once, deploy-everywhere** frontend architecture.

[View on GitHub](https://github.com/Alexzander-Hurd/Contacts-App-Clients)

---

## 📜 Table of Contents

- [About The Project](#about-the-project)
- [Architecture Overview](#architecture-overview)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running (Web)](#running-web)
  - [Building (Desktop / Wails)](#building-desktop--wails)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## 🧠 About The Project

The **Contacts App Frontend** is a single, unified UI codebase designed to operate in both browser and native desktop environments without modification to application logic.

Key goals of the project:

- **Framework-first reactivity** using Svelte 5 Runes
- **End-to-end type safety** via OpenAPI-generated types
- **Environment-aware builds** (web vs desktop)
- **Minimal abstraction overhead**—no Redux-style boilerplate or heavy client frameworks

The frontend dynamically adapts to user roles (Admin vs Standard User) and supports full CRUD workflows, authentication, and real-time UI feedback.

---

## 🏗 Architecture Overview

```bash
Contacts-App-Clients/
├── Wails/
│   ├── frontend/        # SvelteKit app
│   ├── main.go          # Wails entrypoint
│   └── build-script.sh  # Desktop build helper
└── shared/
    └── api/             # OpenAPI-generated types & client
```

### Deployment Targets

- **Web:**  
  SvelteKit with adapter-static → hosted behind Nginx or any static provider
- **Desktop:**  
  Same static output embedded into a Go binary using Go embed directives via Wails

---

## 🛠 Built With

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Wails](https://img.shields.io/badge/Wails-DF0000?style=for-the-badge&logo=go&logoColor=white)](https://wails.io/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Running instance of the backend API  
  👉 <https://github.com/Alexzander-Hurd/Contacts-App-Backend>

---

### Installation

Clone the repository:

```
git clone <https://github.com/Alexzander-Hurd/Contacts-App-Clients.git>
cd Contacts-App-Clients/Wails/frontend
npm install
```

Create a `.env` file:

```bash
VITE_API_URL=<http://localhost:5169>
```

---

### Running (Web)

```bash
npm run dev
```

The app will be available at:

```bash
http://localhost:5173
```

---

### Building (Desktop / Wails)

#### Linux / macOS

```bash
cd Contacts-App-Clients/Wails
./build-script.sh
```

#### Windows (manual step)

1. Build the Svelte app:

   ```bash
   npm run build
   ```

2. Copy the generated `dist/` folder into:

   ```bash
   Wails/frontend/
   ```

3. Build with Wails:

   ```bash
   wails3 build
   ```

**Output:**

```bash
./bin/ContactsApp.exe
```

---

## 🧩 State Management

This project intentionally avoids external state libraries.

### Svelte 5 Runes

- `$state` — local reactive state
- `$derived` — computed data (filters, sorting, grouping)
- `$effect` — side effects (API sync, persistence)

### Global Store Pattern

A class-based store (`user.svelte.ts`) encapsulates:

- Auth session
- User profile
- `IsAdmin` role flag
- Token lifecycle

---

## 🔌 API Integration

- Backend exposes OpenAPI schemas
- Types are consumed directly in the frontend
- API calls are wrapped with `openapi-fetch`
- Custom fetch factory:
  - Injects JWT headers
  - Handles JSON / multipart payloads
  - Centralizes error handling

This ensures **compile-time safety** across the full stack.

---

## 🛣 Roadmap

Planned enhancements include:

- Polymorphic UI implementations (React / Vue) using the same Wails host
- Desktop auto-update support
- Offline-first caching strategies
- CI builds for Windows desktop binaries

---

## 🛡 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

© Alexzander Hurd

---

## 📬 Contact

- GitHub: [@Alexzander-Hurd](https://github.com/Alexzander-Hurd)
- Website: <https://www.alexhurd.uk>
- Links: <https://www.alexhurd.uk/links>

---

[contributors-shield]: https://img.shields.io/github/contributors/Alexzander-Hurd/Contacts-App-Clients.svg?style=for-the-badge
[contributors-url]: https://github.com/Alexzander-Hurd/Contacts-App-Clients/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Alexzander-Hurd/Contacts-App-Clients.svg?style=for-the-badge
[forks-url]: https://github.com/Alexzander-Hurd/Contacts-App-Clients/network/members
[stars-shield]: https://img.shields.io/github/stars/Alexzander-Hurd/Contacts-App-Clients.svg?style=for-the-badge
[stars-url]: https://github.com/Alexzander-Hurd/Contacts-App-Clients/stargazers
[issues-shield]: https://img.shields.io/github/issues/Alexzander-Hurd/Contacts-App-Clients.svg?style=for-the-badge
[issues-url]: https://github.com/Alexzander-Hurd/Contacts-App-Clients/issues
[license-shield]: https://img.shields.io/github/license/Alexzander-Hurd/Contacts-App-Clients.svg?style=for-the-badge
[license-url]: https://github.com/Alexzander-Hurd/Contacts-App-Clients/blob/master/LICENSE
