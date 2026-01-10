<template>
    <div class="app-background"></div>
    <el-config-provider>
        <router-view></router-view>
    </el-config-provider>
</template>

<script setup lang="ts">
    const updateTheme = () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
    };

    onMounted(() => {
        updateTheme();
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    });

    onUnmounted(() => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
    });
</script>

<style>
    :root {
        --app-bg-color: #f8f9fa;
    }

    :root.dark {
        --app-bg-color: #262B36;
        --el-bg-color: #2E3748;
        --el-fill-color-blank: #2E3748;
    }

    html.dark {
        color-scheme: dark;
    }

    .dark .el-dropdown-menu__item:hover,
    .dark .el-menu-item:hover,
    .dark .el-popper.is-light .el-popper__arrow::before {
        background-color: #4a4a4a !important;
    }
</style>

<style scoped>
    .app-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--app-bg-color);
        z-index: -1;
        pointer-events: none;
    }

    :deep(.el-container) {
        background: transparent !important;
    }
</style>
