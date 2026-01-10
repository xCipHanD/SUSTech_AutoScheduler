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
                </el-space>
            </div>
        </el-main>
        <div class="ibruce" style="text-align: center; color: var(--el-text-color-secondary); font-size: 14px;">
            <span id="busuanzi_container_site_pv">本站总访问量<span id="vercount_value_page_pv"></span>次</span>
        </div>
    </el-container>
</template>

<script setup lang="ts">
    import { Calendar, Document } from '@element-plus/icons-vue';

    const isMobileDevice = ref(false);

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
