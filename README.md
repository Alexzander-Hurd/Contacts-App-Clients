# Contacts-App-Clients

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

A modern, polymorphic frontend suite for the **Contacts App**, featuring distinct implementations in **SvelteKit** and **Vue 3**. Designed to demonstrate framework agility, both clients run across multiple targets:

- 🌐 Web (SPA via Nginx / static hosting)
- 🖥 Desktop (Windows & Linux via **Wails**)

This repository consumes the [Contacts App Backend](https://github.com/Alexzander-Hurd/Contacts-App-Backend) and demonstrates a **write-once, deploy-everywhere** architecture with interchangeable UI frameworks.

[View on GitHub](https://github.com/Alexzander-Hurd/Contacts-App-Clients)

---

## 📜 Table of Contents

- [About The Project](#about-the-project)
- [Architecture Overview](#architecture-overview)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Option A: Svelte](#option-a-svelte)
  - [Option B: Vue](#option-b-vue)
  - [Building for Desktop (Wails)](#building-for-desktop-wails)
- [State Management Comparison](#state-management-comparison)
- [API Integration](#api-integration)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## About The Project

The **Contacts App Frontend** is a portfolio showcase of **Framework Agility**. It proves that complex application logic, state management patterns, and API integrations can be ported seamlessly between modern frameworks without compromising the user experience or the native desktop wrapper.

Key goals of the project:

- **Polymorphic UI:** Identical features implemented in both **Svelte 5 (Runes)** and **Vue 3 (Composition API)**.
- **End-to-end type safety:** Both frontends consume the same OpenAPI-generated TypeScript definitions.
- **Environment-aware builds:** The same codebase serves both Web and Desktop (Wails) targets.
- **Shared Architecture:** Both implementations share the same CSS (Tailwind) and API Client logic (`openapi-fetch`).

The frontend dynamically adapts to user roles (Admin vs Standard User) and supports full CRUD workflows, authentication, and real-time UI feedback.

---

## Architecture Overview

```bash
Contacts-App-Clients/
├── Svelte/              # SvelteKit 5 App (Runes)
├── Vue/                 # Vue 3 App (Pinia + Composition API)
└── Wails/               # Desktop Wrapper (Go)
    ├── frontend/        # Build target (imports dist/ from Svelte or Vue)
    ├── main.go          # Wails entrypoint
    └── build-script.sh  # Dynamic build helper
```

### Deployment Targets

- **Web:** Configured for static output → hosted behind Nginx or any static provider.
- **Desktop:** The build artifacts (`dist/` or `build/`) are embedded into a single Go binary using Wails.

---

## Built With

### Common

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Wails](https://img.shields.io/badge/Wails-DF0000?style=for-the-badge&logo=go&logoColor=white)](https://wails.io/)

### Implementation A

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)

### Implementation B

[![Vue](https://img.shields.io/badge/Vue-42b883?style=for-the-badge&logo=svelte&logoColor=white)](https://vuejs.org/)

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm or pnpm
- Running instance of the backend API  
   <https://github.com/Alexzander-Hurd/Contacts-App-Backend>

---

### Option A: Svelte

1. Navigate to the folder:

```bash
cd Contacts-App-Clients/Svelte
npm install
```

1. Run in development mode:

```bash
npm run dev
```

---

### Option B: Vue

1. Navigate to the folder:

```bash
cd Contacts-App-Clients/Vue
npm install
```

1. Run in development mode:

```bash
npm run dev
```

The app will be available at:

```bash
http://localhost:5173
```

---

*(Both options utilize a `.env` file pointing `VITE_API_URL` to your backend).*

---

### Building for Desktop (Wails)

The Wails wrapper is **framework agnostic**. It simply wraps the static HTML/JS/CSS produced by your chosen framework.

#### Linux / macOS

Use the helper script to choose your frontend and build:

```bash
cd Contacts-App-Clients/Wails
./build-script.sh
```

#### Windows (Manual Step)

1. **Build your chosen frontend:**

```bash
# Example for Vue
cd ../Vue
npm run build
```

1. **Copy the output:**  
Copy the contents of `Svelte/build` (or `Vue/dist`) into `Wails/frontend/dist`.

2. **Build the Binary:**

```bash
cd ../Wails
wails3 build
```

**Output:**

```bash
./bin/ContactsApp.exe
```

---

## State Management Comparison

This project demonstrates how different frameworks handle the same business logic.

### Svelte 5 (Runes)

- **Reactivity:** `$state` (local), `$derived` (derived).
- **Global State:** A class-based `user.svelte.ts` store using Runes to encapsulate Auth and User Profile.
- **Approach:** Minimalistic, close to vanilla JS classes.

### Vue 3 (Composition API)

- **Reactivity:** `ref()` (local), `computed()` (derived).
- **Global State:** **Pinia** stores utilizing a "Shared Mutable State" pattern to handle Auth Tokens outside the component lifecycle.
- **Approach:** Modular, utilizing the Vue ecosystem's standard store library.

---

## API Integration

Both frontends share the same API strategy to ensure consistency:

- **OpenAPI:** Backend exposes Swagger schemas.
- **Code Gen:** Types are generated automatically for both projects.
- **Client:** `openapi-fetch` is used in both Svelte and Vue.
- **Fetch Factory:** A custom wrapper injects JWT headers and handles errors identically across both implementations.

This ensures **compile-time safety** regardless of the frontend framework used.

---

## Roadmap

- [x] Svelte 5 Implementation
- [x] Desktop Cross-Compilation (Windows/Linux)
- [x] Vue 3 Implementation
- [ ] React Implementation (Completing the trifecta)
- [ ] CI builds for Windows desktop binaries

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

© Alexzander Hurd

---

## Contact

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
