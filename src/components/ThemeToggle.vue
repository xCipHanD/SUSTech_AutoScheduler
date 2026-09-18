<template>
    <el-tooltip :content="label" placement="bottom" :show-after="200">
        <el-button link :style="{ color: 'var(--el-text-color-secondary)' }" @click="themeStore.cycle()">
            <el-icon>
                <component :is="icon" />
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Monitor, Moon, Sunny } from '@element-plus/icons-vue';
    import { themeStore } from '@/store/themeStore';

    const icon = computed(() => {
        switch (themeStore.mode.value) {
            case 'light': return Sunny;
            case 'dark': return Moon;
            default: return Monitor;
        }
    });

    const label = computed(() => {
        switch (themeStore.mode.value) {
            case 'light': return '浅色模式';
            case 'dark': return '深色模式';
            default: return '跟随系统';
        }
    });
</script>
