<template>
    <el-dialog v-model="visible" title="TIS插件" width="600px">
        <div>
            <h3>插件功能</h3>
            <p>将自动排课界面集成到 TIS 系统内，无需跳转即可快速生成完美课表。</p>
            <el-image style="max-width: 100%; border: 1px solid #e0e0e0; border-radius: 4px;" :src="imageSrc"
                alt="TIS 插件截图"></el-image>
        </div>

        <div>
            <h3>安装方式(点击复制)</h3>
            <p>使用油猴脚本管理器(如 Tampermonkey)安装以下代码：</p>
            <div @click="copyScript"
                style="position: relative; background: #f5f5f5; padding: 15px; border-radius: 4px; overflow: hidden; max-height: 230px; cursor: pointer;">
                <el-scrollbar height="190px" view-style="padding-right: 80px;">
                    <pre
                        style="margin: 0; font-size: 12px; line-height: 1.5; white-space: pre; user-select: text;">{{ script }}</pre>
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
    import { ElMessage } from 'element-plus';
    import { computed } from 'vue';
    import img from '@/assets/TISPlugin.png';

    const props = defineProps<{ modelValue: boolean; script?: string; image?: string }>();
    const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

    const visible = computed({
        get: () => props.modelValue,
        set: (val: boolean) => emit('update:modelValue', val)
    });

    const defaultScript = `// ==UserScript==
// @name   AutoScheduler Loader
// @match  https://tis.sustech.edu.cn/authentication/main
// @description An auto loader
// @version 1.0
// @grant  unsafeWindow
// @grant  GM_xmlhttpRequest
// @connect c.x-d.fun
// ==/UserScript==

(()=>{const U='https://c.x-d.fun/inject.js',w=c=>{let f=document.querySelectorAll('iframe'),n=f.length;n?f.forEach(i=>i.addEventListener('load',()=>--n||c())):c()};w(()=>GM_xmlhttpRequest({method:'GET',url:U,onload:r=>new Function('unsafeWindow',r.responseText.trim())(unsafeWindow)}))})();`;

    const script = computed(() => props.script || defaultScript);
    const imageSrc = computed(() => props.image || img);

    const copyScript = () => {
        navigator.clipboard.writeText(script.value).then(() => {
            ElMessage.success('脚本已复制到剪贴板！');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = script.value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            ElMessage.success('脚本已复制到剪贴板！');
        });
    };
</script>
