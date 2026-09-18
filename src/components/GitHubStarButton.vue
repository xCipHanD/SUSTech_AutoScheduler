<template>
    <a
        class="gh-star"
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`Star ${user}/${repo} on GitHub`"
    >
        <svg class="gh-star__icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span class="gh-star__text">Star</span>
        <span v-if="starCount !== null" class="gh-star__count">{{ formattedCount }}</span>
    </a>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';

    const user = 'xCipHanD';
    const repo = 'SUSTech_AutoScheduler';
    const repoUrl = `https://github.com/${user}/${repo}`;

    // 模块级缓存，避免每次路由切换都请求 GitHub API
    let fetched = false;
    let cached: number | null = null;

    const starCount = ref<number | null>(cached);
    const formattedCount = computed(() => starCount.value === null ? '' : starCount.value.toLocaleString());

    onMounted(async () => {
        if (fetched) {
            starCount.value = cached;
            return;
        }
        fetched = true;
        try {
            const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);
            if (!res.ok) return;
            const data = await res.json();
            if (typeof data.stargazers_count === 'number') {
                cached = data.stargazers_count;
                starCount.value = cached;
            }
        } catch {
            // 离线/限流时只显示 Star
        }
    });
</script>

<style scoped>
    .gh-star {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 10px;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        background: var(--el-fill-color-blank);
        color: var(--el-text-color-regular);
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
        text-decoration: none;
        transition: background-color 0.2s, border-color 0.2s, color 0.2s;
    }

    .gh-star:hover {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
    }

    .gh-star__icon {
        flex-shrink: 0;
    }

    .gh-star__count {
        padding-left: 6px;
        margin-left: 2px;
        border-left: 1px solid var(--el-border-color);
        color: var(--el-text-color-secondary);
        font-variant-numeric: tabular-nums;
    }
</style>
