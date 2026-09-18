<template>
    <el-container
        style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding-top: 20vh; padding-bottom: 20px;">
        <el-main style="width: auto;">
            <div style="text-align: center;">
                <h1 style="font-size: 3em; color: var(--el-text-color-primary)">🔥SUSTech 自动排课
                </h1>
                <p style="font-size: 1.5em; color: var(--el-text-color-secondary);">快速生成无时间冲突的完美课表
                </p>
                <el-space :size="40">
                    <el-button v-if="!isMobileDevice" type="primary" size="large" @click="$router.push('/select')">
                        <el-icon class="el-icon--left">
                            <Calendar />
                        </el-icon>
                        开始排课
                    </el-button>
                    <el-button size="large" @click="$router.push('/help')">
                        <el-icon class="el-icon--left">
                            <Document />
                        </el-icon>
                        帮助文档
                    </el-button>
                    <el-badge value="new" type="danger">
                        <el-button size="large" @click="showTisDialog = true">
                            <el-icon class="el-icon--left">
                                <DocumentCopy />
                            </el-icon>
                            <span>TIS插件</span>
                        </el-button>
                    </el-badge>
                </el-space>
                <div>
                    <a class="github-link" href="https://github.com/xCipHanD/SUSTech_AutoScheduler" target="_blank"
                        rel="noopener noreferrer">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        <span>在 GitHub 上 Star 本项目</span>
                    </a>
                </div>
            </div>
        </el-main>
        <div class=" ibruce" style="text-align: center; color: var(--el-text-color-secondary); font-size: 14px;">
            <span id="busuanzi_container_site_pv">本站总访问量<span id="vercount_value_page_pv"></span>次</span>
        </div>
    </el-container>

    <TisPluginDialog v-model="showTisDialog" />
</template>

<script setup lang="ts">
    import { Calendar, Document, DocumentCopy } from '@element-plus/icons-vue';
    import TisPluginDialog from '@/components/TisPluginDialog.vue';

    const isMobileDevice = ref(false);
    const showTisDialog = ref(false);

    const checkMobile = () => {
        const ua = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return mobileRegex.test(ua) || (isSmallScreen && isTouchDevice);
    };

    onMounted(() => {
        isMobileDevice.value = checkMobile();

        // 加载不蒜子统计脚本
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://events.vercount.one/js';
        document.body.appendChild(script);
    });
</script>

<style scoped>
    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 80px;
        font-size: 15px;
        color: var(--el-text-color-secondary);
        text-decoration: none;
        transition: color 0.2s;
    }

    .github-link:hover {
        color: var(--el-color-primary);
    }
</style>
