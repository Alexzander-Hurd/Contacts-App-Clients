import { auth } from "$lib/auth.svelte";

function getStorage(key: string): string | null {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(key);
	}
	return null;
}

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

class UIState {
	public toasts = $state<Toast[]>([]);
	public sidebarOpen = $state(false);
	public isBusy = $state(false);
	public theme = $state(
		getStorage('theme') ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	);

	public async toggleSidebar() {
		await auth.getUserContact();
		this.sidebarOpen = !this.sidebarOpen;
	}

	public closeSidebar() {
		this.sidebarOpen = false;
	}

	public setBusy(val: boolean) {
		this.isBusy = val;
	}

	public toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', this.theme);
	}

	triggerToast(message: string, type: ToastType = 'info') {
        const id = crypto.randomUUID(); // Unique ID for animations
        
        // Add to the stack
        this.toasts.push({ id, message, type });

        // Auto-remove after 3 seconds
        setTimeout(() => {
            this.removeToast(id);
        }, 3000);
    }

    removeToast(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}

export const ui = new UIState();
