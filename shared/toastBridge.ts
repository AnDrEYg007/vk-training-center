// Simple bridge to allow non-React code to show toasts via window.showAppToast

type ToastLevel = 'info' | 'success' | 'error' | 'warning';

function showAppToast(message: string, type: ToastLevel = 'info') {
    try {
        const ev = new CustomEvent('app-toast', { detail: { message, type } });
        window.dispatchEvent(ev);
    } catch (e) {
        // fallback: console
        // eslint-disable-next-line no-console
        console.log('Toast:', type, message);
    }
}

// Attach to window
// @ts-ignore
window.showAppToast = showAppToast;

export default showAppToast;
