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
            </div>
        </el-main>
        <div class=" ibruce" style="text-align: center; color: var(--el-text-color-secondary); font-size: 14px;">
            <span id="busuanzi_container_site_pv">本站总访问量<span id="vercount_value_page_pv"></span>次</span>
        </div>
    </el-container>

    <!-- TIS插件对话框 -->
    <el-dialog v-model="showTisDialog" title="TIS插件" width="600px">
        <div>
            <h3>插件功能</h3>
            <p>将自动排课界面集成到 TIS 系统内，无需跳转即可快速生成完美课表。</p>
            <el-image style="max-width: 100%; border: 1px solid #e0e0e0; border-radius: 4px;" :src="img"
                alt="TIS 插件截图"></el-image>
        </div>

        <div>
            <h3>安装方式(点击复制)</h3>
            <p>使用油猴脚本管理器(如 Tampermonkey)安装以下代码：</p>
            <div @click="copyTisScript"
                style="position: relative; background: #f5f5f5; padding: 15px; border-radius: 4px; overflow: hidden; max-height: 230px; cursor: pointer;">
                <el-scrollbar height="190px" view-style="padding-right: 80px;">
                    <pre
                        style="margin: 0; font-size: 12px; line-height: 1.5; white-space: pre; user-select: text;">{{ tisUserScript }}</pre>
                </el-scrollbar>
            </div>
        </div>

        <div>
            <h3>🔒 数据安全保证</h3>
            <ul>
                <li>✅ 所有数据本地保存</li>
                <li>✅ 不会收集任何个人数据</li>
                <li>✅ 完全开源，源代码公开可审计</li>
            </ul>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
    import { Calendar, Document, DocumentCopy } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import img from '@/assets/TISPlugin.png';

    const isMobileDevice = ref(false);
    const showTisDialog = ref(false);

    const tisUserScript = `// ==UserScript==
// @name   AutoScheduler Loader
// @match  https://tis.sustech.edu.cn/authentication/main
// @description An auto loader
// @version 1.0
// @grant  unsafeWindow
// @grant  GM_xmlhttpRequest
// @connect c.x-d.fun
// ==/UserScript==

(()=>{const U='https://c.x-d.fun/inject.js',w=c=>{let f=document.querySelectorAll('iframe'),n=f.length;n?f.forEach(i=>i.addEventListener('load',()=>--n||c())):c()};w(()=>GM_xmlhttpRequest({method:'GET',url:U,onload:r=>new Function('unsafeWindow',r.responseText.trim())(unsafeWindow)}))})();`;

    const checkMobile = () => {
        const ua = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return mobileRegex.test(ua) || (isSmallScreen && isTouchDevice);
    };

    const copyTisScript = () => {
        navigator.clipboard.writeText(tisUserScript).then(() => {
            ElMessage.success('脚本已复制到剪贴板！');
        }).catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = tisUserScript;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            ElMessage.success('脚本已复制到剪贴板！');
        });
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
