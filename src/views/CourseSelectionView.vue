<template>
    <el-container style="height: 100%;">
        <el-header
            style="height: auto; padding: 15px 20px; border-bottom: 1px solid var(--el-border-color); display: flex; justify-content: space-between; align-items: center;">
            <el-button @click="$router.push('/')">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                返回首页
            </el-button>
            <h2 style="margin: 0;">选课管理</h2>
            <el-button link @click="$router.push('/help')" style="color: var(--el-text-color-secondary);">
                <el-icon>
                    <QuestionFilled />
                </el-icon>
            </el-button>
        </el-header>

        <el-container style="overflow: hidden;">
            <el-main style="display: flex; flex-direction: column; padding: 0;">
                <div style="padding: 20px;">
                    <h2 style="margin-top: 0;">搜索课程</h2>
                    <el-input v-model="searchQuery" placeholder="输入课程名或教师名(I) | Ctrl+Shift+A 全选 Ctrl+Shift+D 反选"
                        :prefix-icon="Search" clearable @input="onSearch">
                        <template #append>
                            <el-button @click="onSearch">搜索</el-button>
                        </template>
                    </el-input>
                    <div
                        style="margin: 6px 0 10px; font-size: 12px; color: var(--el-text-color-secondary); display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <span>当前学期：{{ currentSemester }}</span>
                        <span>已加载课程：{{ loadedCourseCount }} 门</span>
                        <span>上次更新：{{ lastUpdated }}</span>
                        <el-tag :type="statusTagType" size="small" effect="plain" :disable-transitions="true"
                            @click="handleStatusClick"
                            style="white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; cursor: pointer; flex-wrap: nowrap;">
                            <span class="status-tag-content">
                                <span>{{ isUpdating ? '同步课程中' : `TIS：${injectConnected ? '正常' : '未连接'}` }}</span>
                                <el-icon v-if="isUpdating" class="is-loading" style="margin-left: 2px;">
                                    <Loading />
                                </el-icon>
                                <el-tooltip v-if="injectConnected && !isUpdating" content="重新同步课程" placement="top">
                                    <el-button link size="small" class="status-icon-btn"
                                        @click.stop="handleReloadClick">
                                        <el-icon>
                                            <Refresh />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip v-else-if="!injectConnected && !isUpdating" content="查看互联帮助"
                                    placement="top">
                                    <el-button link size="small" class="status-icon-btn"
                                        @click.stop="handleHelpIconClick">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </span>
                        </el-tag>
                    </div>
                </div>
                <el-scrollbar style="flex: 1; padding: 0 20px;">
                    <template v-if="loading">
                        <div style="padding: 10px 0;">
                            <el-skeleton v-for="i in 4" :key="i" animated style="margin-bottom: 12px;">
                                <template #template>
                                    <el-skeleton-item variant="rect"
                                        style="width: 100%; height: 82px; border-radius: 6px;" />
                                </template>
                            </el-skeleton>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="!searchQuery && searchResults.length === 0" style="padding: 30px 0;">
                            <el-empty description="输入关键词或点击示例开始搜索" :image-size="120">
                                <el-button v-if="firstExample" type="primary" text
                                    @click="applyExample(firstExample)">试试“{{ firstExample }}”</el-button>
                            </el-empty>
                        </div>
                        <div v-else-if="searchResults.length === 0 && searchQuery" style="padding: 20px;">
                            <el-empty description="无结果，换个关键词试试" :image-size="120">
                                <el-button type="primary" link tag="a"
                                    href="https://github.com/xCipHanD/SUSTech_AutoScheduler/issues/new?template=missing-course-report.md"
                                    target="_blank" rel="noopener noreferrer">没有想要的课？去反馈</el-button>
                            </el-empty>
                        </div>
                        <el-card v-for="course in searchResults" :key="course.id" shadow="hover"
                            style="margin-bottom: 10px; cursor: pointer;"
                            :class="{ 'is-selected': store.isSelected(course) }"
                            :style="store.isSelected(course) ? { borderColor: 'var(--el-color-primary)', backgroundColor: 'var(--el-color-primary-light-9)' } : {}"
                            @click="store.toggleCourseSelection(course)">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="font-weight: bold;">{{ course.kcmc }}</span>
                                <el-tag v-if="store.isSelected(course)" size="small" type="success">已选</el-tag>
                            </div>
                            <div
                                style="font-size: 13px; color: var(--el-text-color-regular); display: flex; justify-content: space-between;">
                                <span>Code: {{ course.kcdm }}</span>
                                <span>{{ course.dgjsmc }}</span>
                            </div>
                            <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 5px;">{{
                                course.rwmc
                                }}</div>
                        </el-card>
                    </template>
                </el-scrollbar>
            </el-main>

            <el-aside width="350px"
                style="border-left: 1px solid var(--el-border-color); display: flex; flex-direction: column;">
                <div style="padding: 15px; border-bottom: 1px solid var(--el-border-color-lighter);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">已选课程</h3>
                        <el-button type="danger" link @click="handleClearSelection" size="small"
                            v-if="store.selectedCourses.length">清空</el-button>
                    </div>
                    <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 5px;">
                        拖拽调整优先级
                    </div>
                </div>
                <el-scrollbar style="flex: 1; padding: 0 10px;">
                    <div v-if="store.selectedCourses.length === 0" style="padding: 24px 12px;">
                        <el-empty description="右侧空空如也，去左侧添加课程吧" :image-size="100">
                            <el-button v-if="firstExample" type="primary" text size="small"
                                @click="applyExample(firstExample)">试试“{{ firstExample }}”</el-button>
                        </el-empty>
                    </div>
                    <div v-else>
                        <transition-group name="list">
                            <div v-for="(course, index) in store.selectedCourses" :key="course.id"
                                style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid var(--el-border-color-lighter); cursor: move;"
                                draggable="true" @dragstart="dragStart(index)" @drop="onDrop(index)" @dragenter.prevent
                                @dragover.prevent>
                                <div style="margin-right: 10px; cursor: grab; color: var(--el-text-color-secondary);">
                                    <el-icon>
                                        <Rank />
                                    </el-icon>
                                </div>
                                <div
                                    style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; flex-direction: column;">
                                        <span style="font-weight: 500;">{{ course.kcmc }}</span>
                                        <span style="font-size: 12px; color: var(--el-text-color-secondary);">{{
                                            course.dgjsmc
                                        }}</span>
                                    </div>
                                    <div style="display: flex; align-items: center;">
                                        <el-button link type="danger" @click="store.toggleCourseSelection(course)">
                                            <el-icon>
                                                <Close />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </el-scrollbar>
                <div style="padding: 15px; border-top: 1px solid var(--el-border-color-lighter);">
                    <el-button type="primary" size="large" style="width: 100%;" @click="handleGenerate"
                        :loading="generating">
                        开始排课(Enter)
                    </el-button>
                </div>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
    import { ElMessage } from 'element-plus';
    import { Search, Rank, QuestionFilled, HomeFilled, Close, Loading, Refresh } from '@element-plus/icons-vue';
    import { useMobileDetection } from '../composables/useMobileDetection';
    import { store } from '../store/courseStore';
    import { fetchCourses } from '../api/course';
    import { arrangeSchedule } from '../utils/scheduleAlgo';
    import type { Course } from '../types';

    useMobileDetection();

    const router = useRouter();
    const allCourses = ref<Course[]>([]);
    const currentSemester = '2026 春季学期';
    const lastUpdatedTs = ref<number | null>(null);
    const searchQuery = ref('');
    const searchResults = ref<Course[]>([]);
    const exampleKeywords = ['软件工程', '操作系统', '音乐赏析', '数学', '英语'];
    const firstExample = computed(() => exampleKeywords[0] || '');
    const loading = ref(true);
    const loadedCourseCount = computed(() => allCourses.value.length);
    const generating = ref(false);
    const dragIndex = ref<number | null>(null);
    const injectConnected = ref(false);
    const isUpdating = ref(false);
    const statusTagType = computed(() => {
        if (isUpdating.value) return 'info';
        return injectConnected.value ? 'success' : 'warning';
    });
    const helpAnchor = 'inject-help';
    const lastUpdated = computed(() => {
        if (!lastUpdatedTs.value) return '---';
        const d = new Date(lastUpdatedTs.value);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${mm}-${dd} ${hh}:${mi}`;
    });

    onMounted(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('message', onMessageFromInject);
        sendPingToInject();
        // Defer course fetching to avoid blocking initial render
        setTimeout(() => {
            refreshCourses();
        }, 0);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('message', onMessageFromInject);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        // 如果正在输入框中，只处理 Enter
        const target = e.target as HTMLElement;
        const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

        if (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            // 全选当前搜索结果
            searchResults.value.forEach(course => {
                if (!store.isSelected(course)) {
                    store.toggleCourseSelection(course);
                }
            });
            if (searchResults.value.length > 0) {
                ElMessage.success(`已添加 ${searchResults.value.length} 门课程`);
            }
        } else if (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            // 取消当前搜索结果中的全部已选课程
            let count = 0;
            searchResults.value.forEach(course => {
                if (store.isSelected(course)) {
                    store.toggleCourseSelection(course);
                    count++;
                }
            });
            if (count > 0) {
                ElMessage.success(`已取消 ${count} 门课程`);
            }
        } else if (e.key === 'i' || e.key === 'I') {
            if (!isInInput) {
                e.preventDefault();
                // 聚焦搜索框
                const inputElement = document.querySelector('.el-input__inner') as HTMLInputElement;
                if (inputElement) {
                    inputElement.focus();
                }
            }
        } else if (e.key === 'Enter') {
            if (isInInput) {
                e.preventDefault();
                handleGenerate();
            }
        }
    };

    const onSearch = () => {
        if (!searchQuery.value.trim()) {
            searchResults.value = [];
            return;
        }

        // 使用空格分离关键词
        const keywords = searchQuery.value.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0);

        searchResults.value = allCourses.value.filter(c => {
            const courseName = (c.kcmc || '').toLowerCase();
            const teacherName = (c.dgjsmc || '').toLowerCase();
            const courseCode = (c.kcdm || '').toLowerCase();
            const className = (c.rwmc || '').toLowerCase();
            const courseInfo = `${courseName} ${teacherName} ${courseCode} ${className}`;

            // 所有关键词都必须匹配
            return keywords.every(keyword => courseInfo.includes(keyword));
        }).slice(0, 50); // Limit results for performance
    };

    const applyExample = (keyword: string) => {
        if (!keyword) return;
        searchQuery.value = keyword;
        onSearch();
    };

    const dragStart = (index: number) => {
        dragIndex.value = index;
    };

    const onDrop = (dropIndex: number) => {
        if (dragIndex.value === null) return;
        const item = store.selectedCourses[dragIndex.value];
        if (!item) return;
        store.selectedCourses.splice(dragIndex.value, 1);
        store.selectedCourses.splice(dropIndex, 0, item);
        dragIndex.value = null;
    };

    const handleClearSelection = () => {
        store.selectedCourses.splice(0, store.selectedCourses.length);
    };

    const onMessageFromInject = (ev: MessageEvent) => {
        const data: any = ev.data;
        if (!data || data.source !== 'AutoSchedulerInject') return;
        if (data.type === 'hello' || data.type === 'proxyResult') {
            injectConnected.value = true;
        }
    };

    const sendPingToInject = () => {
        try {
            const targetWin = window.parent && window.parent !== window ? window.parent : window;
            targetWin.postMessage({ source: 'AutoSchedulerWeb', type: 'ping' }, '*');
        } catch (e) {
            console.error('ping inject failed', e);
        }
    };

    const refreshCourses = async (force = false) => {
        isUpdating.value = true;
        try {
            const { courses, updatedAt } = await fetchCourses({ forceRefresh: force });
            allCourses.value = courses;
            lastUpdatedTs.value = updatedAt;
            onSearch();
        } finally {
            loading.value = false;
            isUpdating.value = false;
        }
    };

    const handleStatusClick = () => {
        if (isUpdating.value) return;
        if (!injectConnected.value) {
            sendPingToInject();
        }
    };

    const handleHelpIconClick = () => {
        router.push({ path: '/help', query: { section: helpAnchor } });
    };

    const handleReloadClick = () => {
        if (isUpdating.value) return;
        refreshCourses(true);
    };

    const handleGenerate = async () => {
        if (store.selectedCourses.length === 0) {
            ElMessage.warning('请先选择课程');
            return;
        }

        generating.value = true;
        setTimeout(() => {
            try {
                const results = arrangeSchedule(store.selectedCourses);
                if (results.length === 0) {
                    ElMessage.error('无法生成无冲突课表，请尝试减少课程或降低部分课程优先级');
                } else {
                    store.setResults(results);
                    ElMessage.success(`生成了 ${results.length} 个方案`);
                    router.push('/schedule');
                }
            } catch (e) {
                console.error(e);
                ElMessage.error('排课过程出错');
            } finally {
                generating.value = false;
            }
        }, 100);
    };
</script>

<style scoped>
    .status-tag-content {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-wrap: nowrap;
    }

    .status-icon-btn {
        padding: 0;
        color: var(--el-text-color-secondary);
        display: inline-flex;
        align-items: center;
        line-height: 1;
        height: auto;
    }
</style>
