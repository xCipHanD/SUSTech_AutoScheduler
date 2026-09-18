<template>
    <div ref="homeBg" class="home-bg" :class="{ 'is-interactive': interactive }" aria-hidden="true">
        <span class="blob blob-1"></span>
        <span class="blob blob-2"></span>
        <span class="blob blob-3"></span>
        <span class="blob blob-4"></span>
        <span class="spotlight"></span>
        <span class="grain"></span>
    </div>

    <div class="home-theme-toggle">
        <ThemeToggle />
    </div>

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

    // 液态惯性光晕：弹簧跟随 + 速度拉伸
    const homeBg = ref<HTMLElement | null>(null);
    const interactive = ref(false);
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let pointerRaf = 0;

    const EASE = 0.16;

    const renderFrame = () => {
        pointerRaf = 0;
        const el = homeBg.value;
        if (!el) return;

        // 临界阻尼缓动：顺滑跟手，不过冲
        const prevX = current.x;
        const prevY = current.y;
        current.x += (target.x - current.x) * EASE;
        current.y += (target.y - current.y) * EASE;

        const vx = current.x - prevX;
        const vy = current.y - prevY;
        const speed = Math.hypot(vx, vy);

        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        // 移动越快，光斑沿运动方向拉伸越多
        const stretch = Math.min(speed / 120, 0.25);
        const angle = Math.atan2(vy, vx);

        el.style.setProperty('--mx', `${current.x}px`);
        el.style.setProperty('--my', `${current.y}px`);
        el.style.setProperty('--px', `${(current.x / w - 0.5) * 2}`);
        el.style.setProperty('--py', `${(current.y / h - 0.5) * 2}`);
        el.style.setProperty('--sx', `${1 + stretch}`);
        el.style.setProperty('--sy', `${1 - stretch * 0.5}`);
        el.style.setProperty('--rot', `${angle}rad`);

        const settled = speed < 0.3 && Math.hypot(target.x - current.x, target.y - current.y) < 0.5;
        if (!settled) pointerRaf = requestAnimationFrame(renderFrame);
    };

    const onPointerMove = (e: PointerEvent) => {
        target.x = e.clientX;
        target.y = e.clientY;
        if (!pointerRaf) pointerRaf = requestAnimationFrame(renderFrame);
    };

    const checkMobile = () => {
        const ua = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return mobileRegex.test(ua) || (isSmallScreen && isTouchDevice);
    };

    onMounted(() => {
        isMobileDevice.value = checkMobile();

        const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (canHover && !reduceMotion) {
            current.x = target.x = window.innerWidth / 2;
            current.y = target.y = window.innerHeight * 0.4;
            interactive.value = true;
            window.addEventListener('pointermove', onPointerMove, { passive: true });
        }

        // 加载不蒜子统计脚本
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://events.vercount.one/js';
        document.body.appendChild(script);
    });

    onUnmounted(() => {
        window.removeEventListener('pointermove', onPointerMove);
        if (pointerRaf) cancelAnimationFrame(pointerRaf);
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

    .home-theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10;
    }

    /* ===== 主页背景：极简光晕 + 噪点 ===== */
    .home-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        --spot-color: rgba(255, 255, 255, 0.55);
    }

    .blob {
        position: absolute;
        border-radius: 50%;
        will-change: transform;
        transform: translate3d(0, 0, 0);
        transition: translate 0.3s ease-out;
    }

    .blob-1 {
        width: 48vw;
        height: 48vw;
        top: -14vw;
        left: -10vw;
        background: radial-gradient(circle at 50% 50%, rgba(147, 181, 207, 0.34), rgba(147, 181, 207, 0) 70%);
        animation: home-float-a 34s ease-in-out infinite;
    }

    .blob-2 {
        width: 44vw;
        height: 44vw;
        top: -10vw;
        right: -12vw;
        background: radial-gradient(circle at 50% 50%, rgba(184, 167, 217, 0.30), rgba(184, 167, 217, 0) 70%);
        animation: home-float-b 40s ease-in-out infinite;
    }

    .blob-3 {
        width: 52vw;
        height: 52vw;
        bottom: -20vw;
        left: -8vw;
        background: radial-gradient(circle at 50% 50%, rgba(168, 213, 207, 0.26), rgba(168, 213, 207, 0) 70%);
        animation: home-float-b 46s ease-in-out infinite;
    }

    .blob-4 {
        width: 40vw;
        height: 40vw;
        bottom: -16vw;
        right: -8vw;
        background: radial-gradient(circle at 50% 50%, rgba(249, 215, 112, 0.20), rgba(249, 215, 112, 0) 70%);
        animation: home-float-a 38s ease-in-out infinite;
    }

    /* 鼠标视差：各光晕不同深度 */
    .blob-1 {
        translate: calc(var(--px, 0) * 16px) calc(var(--py, 0) * 16px);
    }

    .blob-2 {
        translate: calc(var(--px, 0) * -12px) calc(var(--py, 0) * -12px);
    }

    .blob-3 {
        translate: calc(var(--px, 0) * 9px) calc(var(--py, 0) * 9px);
    }

    .blob-4 {
        translate: calc(var(--px, 0) * -18px) calc(var(--py, 0) * -18px);
    }

    .spotlight {
        position: absolute;
        left: 0;
        top: 0;
        width: 560px;
        height: 560px;
        margin: -280px 0 0 -280px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, var(--spot-color), transparent 70%);
        transform: translate3d(var(--mx, 50vw), var(--my, 40vh), 0) rotate(var(--rot, 0rad)) scale(var(--sx, 1), var(--sy, 1));
        will-change: transform;
        opacity: 0;
        transition: opacity 0.6s ease;
    }

    .home-bg.is-interactive .spotlight {
        opacity: 1;
    }

    .grain {
        position: absolute;
        inset: 0;
        opacity: 0.04;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 140px 140px;
    }

    @keyframes home-float-a {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1, 1); }
        50% { transform: translate3d(5vw, 4vw, 0) rotate(8deg) scale(1.1, 0.94); }
    }

    @keyframes home-float-b {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1, 1); }
        50% { transform: translate3d(-5vw, 3vw, 0) rotate(-8deg) scale(0.94, 1.1); }
    }

    @media (prefers-reduced-motion: reduce) {
        .blob {
            animation: none !important;
        }
    }
</style>

<style>
    /* 深色模式：降低不透明度，改用更亮的微光 */
    html.dark .home-bg {
        --spot-color: rgba(120, 160, 225, 0.16);
    }

    html.dark .home-bg .blob-1 {
        background: radial-gradient(circle at 50% 50%, rgba(96, 140, 190, 0.24), rgba(96, 140, 190, 0) 70%);
    }

    html.dark .home-bg .blob-2 {
        background: radial-gradient(circle at 50% 50%, rgba(140, 118, 190, 0.22), rgba(140, 118, 190, 0) 70%);
    }

    html.dark .home-bg .blob-3 {
        background: radial-gradient(circle at 50% 50%, rgba(94, 168, 160, 0.20), rgba(94, 168, 160, 0) 70%);
    }

    html.dark .home-bg .blob-4 {
        background: radial-gradient(circle at 50% 50%, rgba(190, 160, 70, 0.16), rgba(190, 160, 70, 0) 70%);
    }

    html.dark .home-bg .grain {
        opacity: 0.06;
    }
</style>
