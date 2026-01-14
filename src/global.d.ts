declare interface Window {
    showAppToast?: (message: string, type?: 'info'|'success'|'error'|'warning') => void;
}
