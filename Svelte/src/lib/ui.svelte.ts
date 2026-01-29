class UIState {
	public sidebarOpen = $state(false);
	public isBusy = $state(false);

	public toggleSidebar() {
		this.sidebarOpen = !this.sidebarOpen;
	}

	public closeSidebar() {
		this.sidebarOpen = false;
	}

	public setBusy(val: boolean) {
		this.isBusy = val;
	}
}

export const ui = new UIState();
