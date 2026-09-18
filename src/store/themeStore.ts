import { computed, ref } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'sustech-theme-mode';
const CYCLE: ThemeMode[] = ['system', 'light', 'dark'];

const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

function loadMode (): ThemeMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
        // ignore
    }
    return 'system';
}

const mode = ref<ThemeMode>(loadMode());
const systemDark = ref(systemMedia.matches);

// 最终是否使用暗色：手动指定优先，system 则跟随系统
const isDark = computed(() => mode.value === 'dark' || (mode.value === 'system' && systemDark.value));

function apply (): void {
    document.documentElement.classList.toggle('dark', isDark.value);
}

function setMode (next: ThemeMode): void {
    mode.value = next;
    try {
        localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // ignore
    }
    apply();
}

function cycle (): void {
    const index = CYCLE.indexOf(mode.value);
    setMode(CYCLE[(index + 1) % CYCLE.length]!);
}

let initialized = false;
function initTheme (): void {
    apply();
    if (initialized) return;
    initialized = true;
    systemMedia.addEventListener('change', (e) => {
        systemDark.value = e.matches;
        if (mode.value === 'system') apply();
    });
}

export const themeStore = {
    mode,
    isDark,
    setMode,
    cycle,
    initTheme
};
