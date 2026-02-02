function getStorage(key: string): string | null {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(key);
	}
	return null;
}
class UIState {
	public sidebarOpen = $state(false);
	public isBusy = $state(false);
	public theme = $state(
		getStorage('theme') ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	);

	public toggleSidebar() {
		this.sidebarOpen = !this.sidebarOpen;
	}

	public closeSidebar() {
		this.sidebarOpen = false;
	}

	public setBusy(val: boolean) {
		this.isBusy = val;
	}

	public toggleTheme() {
		console.log('toggleTheme');
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', this.theme);
	}
}

export const ui = new UIState();
