<template>
    <el-container style="height: 100%;">
        <el-header
            style="height: auto; padding: 15px 20px; border-bottom: 1px solid var(--el-border-color); display: flex; justify-content: space-between; align-items: center;">
            <el-button @click="$router.go(-1)">返回</el-button>
            <h2 style="margin: 0;">帮助文档</h2>
            <div style="width: 80px;"></div>
        </el-header>
        <el-main>
            <div style="max-width: 800px; margin: 0 auto;">
                <h1>SUSTech 自动排课 · 帮助文档</h1>
                <h2>项目简介</h2>
                <p>本项目旨在帮助同学快速生成无时间冲突的课程表。你可以搜索并选择课程，设置优先级，系统会自动组合出多份可行方案，并支持导出图片与 CSV。</p>

                <h2>主要功能</h2>
                <ul>
                    <li>课程搜索：按课程名称或教师名搜索。</li>
                    <li>已选课程管理：
                        <ul>
                            <li>拖拽调整优先级（靠前优先保留）。</li>
                            <li>开关单门课程的启用/禁用，不想参与本次排课就关闭开关。</li>
                        </ul>
                    </li>
                    <li>自动排课：
                        <ul>
                            <li>将主课与其附属课（如实验/讨论）自动成组。</li>
                            <li>生成不冲突的多份方案；若“全选课程组”无解，采用“最少跳课”策略，从跳 1 门开始寻找可行解，尽量保留高优先级课程。</li>
                        </ul>
                    </li>
                    <li>课表渲染：
                        <ul>
                            <li>单双周分表展示；支持周六、周日显示（兼容周日编码为 0 或 7 的数据）。</li>
                            <li>分页显示当前方案编号与“课程数”。</li>
                            <li>点击任意课程格子，会为该课程的所有格子随机更换背景色。</li>
                            <li>右键点击课程表格子可弹出菜单，包含更换颜色、查看详情、高亮同名课程、清空时段和禁用课程等操作。</li>
                        </ul>
                    </li>
                    <li>导出：
                        <ul>
                            <li>导出课表为图片（PNG）。</li>
                            <li>导出当前方案为 CSV（包含单双周矩阵与课程详情）。</li>
                        </ul>
                    </li>
                    <li>本地存储：自动保存已选课程与开关、优先级设置到浏览器本地。</li>
                </ul>

                <h2>使用指南</h2>
                <ol>
                    <li>进入首页，点击“开始排课”。</li>
                    <li>在排课页搜索框中输入课程或教师，加入到“已选课程”。</li>
                    <li><strong>重要提示：</strong>对于有些课程，理论课和实验课是分开的两门课程。如果你需要同时上理论课和实验课，请务必将两门课程都添加到“已选课程”中。系统会自动识别并绑定相关的理论课与实验课，确保它们在排课时作为一个整体进行安排。
                    </li>
                    <li>在“已选课程”中：
                        <ul>
                            <li>拖拽条目可调整优先级（靠前更优先保留）。</li>
                            <li>使用开关可临时禁用某门课程参与排课。</li>
                        </ul>
                    </li>
                    <li>点击“生成课表”或按 Enter 进入课表页。</li>
                    <li>在课表页：
                        <ul>
                            <li>使用左右分页按钮或快捷键浏览不同方案。</li>
                            <li>查看“课程数”，了解当前方案包含的课程数量（主课+附属课算作一门）。</li>
                            <li>点击课程格子可随机更换该课程的配色（同一课程的所有格子会同步变色）。</li>
                            <li>可导出图片或 CSV 保存。</li>
                        </ul>
                    </li>
                </ol>

                <h2 id="inject-help">TIS 互联说明</h2>
                <p>为避免频繁手工导出课程信息，我们通过浏览器注入脚本直接调用教务系统接口并把结果转发给本页面。状态标签在选课页右上方显示当前互联状态；需要安装或查看脚本，请点击 <el-link
                        type="primary" @click="showTisDialog = true">inject.js</el-link>。</p>
                <ul>
                    <li><strong>TIS：正常</strong> — 已成功收到注入脚本的握手，点击标签旁的刷新图标可强制同步课程。</li>
                    <li><strong>TIS：未连接</strong> — 页面未收到注入脚本的消息，点击问号图标查看本说明，点击状态标签会再次尝试握手。</li>
                </ul>
                <p>如果一直处于“未连接”，请按下列步骤排查：</p>
                <ol>
                    <li>确认已安装并启用浏览器插件/油猴脚本，或在 TIS 页面通过开发者工具手动注入 <code>inject.js</code>。</li>
                    <li>确保在教务系统主页面打开本应用（即在 TIS 的 iframe 中），而不是直接访问 c.x-d.fun。</li>
                    <li>登录教务系统后再刷新本页，避免接口因未登录被拦截。</li>
                    <li>如仍无效，按 F12 打开控制台，检查是否有跨域/权限报错，并向我们反馈。</li>
                </ol>
                <p>已连接时点击状态标签会立即发起一次“同步课程”，期间标签显示“同步课程中”，同步完成后更新时间会更新到分钟。</p>

                <h2>快捷键</h2>
                <ul>
                    <li>在搜索页：I 聚焦搜索框，Enter 生成课表。</li>
                    <li>在课表页：
                        <ul>
                            <li>← 或 H：上一份方案</li>
                            <li>→ 或 L：下一份方案</li>
                            <li>Shift + ←/H 或 →/L：按约 10% 份数快速跳页</li>
                            <li>Backspace：返回选课页面</li>
                        </ul>
                    </li>
                </ul>

                <h2>反馈与贡献</h2>
                <ul>
                    <li>如有问题或建议，欢迎在 GitHub 仓库提交 Issue 或 Pull Request。</li>
                    <li>项目地址：<a href="https://github.com/xCipHanD/SUSTech_AutoScheduler" target="_blank"
                            rel="noopener noreferrer">https://github.com/xCipHanD/SUSTech_AutoScheduler</a></li>
                </ul>

                <TisPluginDialog v-model="showTisDialog" />
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
    import { nextTick, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { useMobileDetection } from '../composables/useMobileDetection';
    import TisPluginDialog from '@/components/TisPluginDialog.vue';

    useMobileDetection();

    const route = useRoute();
    const showTisDialog = ref(false);

    const scrollToSection = (sectionId: string) => {
        nextTick(() => {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    };

    const handleSectionScroll = () => {
        const section = route.query.section;
        if (typeof section === 'string') {
            scrollToSection(section);
        }
    };

    onMounted(handleSectionScroll);

    watch(() => route.query.section, () => {
        handleSectionScroll();
    });
</script>
