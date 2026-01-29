class UIState {
    public open = $state(false);

    public toggle() {
        this.open = !this.open;
    }

    public close() {
        this.open = false;
    }
}

export const sidebar = new UIState();