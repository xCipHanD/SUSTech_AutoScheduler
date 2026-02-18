<template>
    <el-container style="height: 100%;">
        <el-header
            style="height: auto; padding: 15px 20px; border-bottom: 1px solid var(--el-border-color); display: flex; justify-content: space-between; align-items: center;">
            <el-button @click="$router.push('/select')">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                返回选课
            </el-button>
            <h2 style="margin: 0;">课程表</h2>
            <el-button link @click="$router.push('/help')" style="color: var(--el-text-color-secondary);">
                <el-icon>
                    <QuestionFilled />
                </el-icon>
            </el-button>
        </el-header>

        <el-container style="overflow: hidden;">
            <el-main style="overflow: hidden; padding: 20px; display: flex; flex-direction: column;">
                <!-- 工具栏 -->
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <el-text style="margin-right: 10px;">学期开始日期:</el-text>
                        <el-date-picker v-model="semesterStartDate" type="date" placeholder="选择日期" size="small"
                            style="width: 150px;" format="YYYY-MM-DD" />
                    </div>
                    <el-button-group>
                        <el-button @click="exportImage">
                            <el-icon>
                                <Download />
                            </el-icon>
                            导出图片
                        </el-button>
                        <el-button @click="exportCSV">
                            <el-icon>
                                <Document />
                            </el-icon>
                            导出 CSV
                        </el-button>
                        <el-button @click="exportICS">
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            导出日历
                        </el-button>
                    </el-button-group>
                </div>

                <!-- 课程表 -->
                <div class="schedule-scroll" style="flex: 1; overflow: auto;" ref="scheduleRef">
                    <div v-if="!currentSchedule"
                        style="height: 100%; display: flex; justify-content: center; align-items: center; color: var(--el-text-color-secondary);">
                        <span
                            v-if="store.selectedCourses.filter(c => c.active !== false).length === 0">请勾选右侧课程进行排课</span>
                        <span v-else>无可行方案，请尝试调整课程或优先级</span>
                    </div>
                    <ScheduleGrid v-else :schedule="flatSchedule" ref="gridComponent" @refresh="debouncedGenerate" />
                </div>

                <!-- 方案控制栏 -->
                <div style="margin-top: 15px; display: flex; justify-content: center; align-items: center;">
                    <el-space :size="15">
                        <el-button circle :icon="ArrowLeft" @click="prevPage" :disabled="currentPage <= 1" />
                        <span style="font-weight: bold; font-size: 14px;">方案 {{ currentPage }} / {{ totalPages }} (课程数:
                            {{
                                currentCourseCount
                            }})</span>
                        <el-button circle :icon="ArrowRight" @click="nextPage" :disabled="currentPage >= totalPages" />
                    </el-space>
                </div>
            </el-main>

            <el-aside width="350px"
                style="border-left: 1px solid var(--el-border-color); display: flex; flex-direction: column;">
                <div style="padding: 15px; border-bottom: 1px solid var(--el-border-color-lighter);">
                    <h3 style="margin: 0;">已选课程</h3>
                    <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 5px;">
                        调整开关或顺序会自动重新排课
                    </div>
                </div>
                <el-scrollbar style="flex: 1; padding: 0 10px;">
                    <div v-if="store.selectedCourses.length === 0"
                        style="padding: 20px; text-align: center; color: var(--el-text-color-secondary);">
                        暂无课程
                    </div>
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
                            <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; flex-direction: column; width: 180px;">
                                    <span
                                        style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                                        :title="course.kcmc">{{ course.kcmc }}</span>
                                    <span style="font-size: 12px; color: var(--el-text-color-secondary);">{{
                                        course.dgjsmc }}</span>
                                    <div
                                        style="font-size: 12px; color: var(--el-text-color-secondary); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                                        <span>人数：{{ formatCapacity(course) }}</span>
                                        <el-tag v-if="hasFullCapacity(course)" size="small" effect="plain"
                                            :type="capacityStatusType(course)">
                                            {{ capacityStatusType(course) === 'danger' ? '超额' : '实时' }}
                                        </el-tag>
                                    </div>
                                </div>
                                <div>
                                    <el-switch :model-value="course.active !== false" size="small"
                                        @change="val => handleToggleActive(course.id, !!val)" />
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </el-scrollbar>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
    import { ElMessage } from 'element-plus';
    import { ArrowLeft, ArrowRight, Rank, QuestionFilled, Download, Document, Calendar } from '@element-plus/icons-vue';
    import type { Course } from '@/types';
    import { useMobileDetection } from '../composables/useMobileDetection';
    import { useCourseData } from '../composables/useCourseData';

    useMobileDetection();
    import { store } from '../store/courseStore';
    import ScheduleGrid from '../components/ScheduleGrid.vue';
    import html2canvas from 'html2canvas';
    import { arrangeSchedule } from '../utils/scheduleAlgo';
    import { exportToICS, downloadICS } from '@/utils/icsExporter';

    const { startAutoRefresh } = useCourseData();

    const router = useRouter();
    const scheduleRef = ref<HTMLElement | null>(null);
    const dragIndex = ref<number | null>(null);
    const semesterStartDate = ref<Date>(new Date('2026-02-23')); // 默认学期开始日期

    const currentPage = computed({
        get: () => store.currentResultIndex + 1,
        set: (val) => store.currentResultIndex = val - 1
    });

    const totalPages = computed(() => store.scheduleResults.length);
    const currentSchedule = computed(() => store.scheduleResults[store.currentResultIndex]);

    // Flatten the bundle list to a single course list for the grid
    const flatSchedule = computed(() => currentSchedule.value ? currentSchedule.value.flat() : []);

    // Count unique courses (one per bundle), so lectures+labs are treated as a single course
    const currentCourseCount = computed(() => currentSchedule.value ? currentSchedule.value.length : 0);

    const hasFullCapacity = (course: Course) => typeof course.yxzrs === 'number' && typeof course.bksrl === 'number' && (course.bksrl ?? 0) > 0;
    const formatCapacity = (course: Course) => {
        const enrolled = course.yxzrs;
        const cap = course.bksrl;
        if (hasFullCapacity(course)) {
            const ratio = cap ? Math.round(((enrolled ?? 0) / cap) * 100) : null;
            return `${enrolled ?? 0}/${cap}${ratio !== null ? ` (${ratio}%)` : ''}`;
        }
        if (typeof enrolled === 'number' && enrolled >= 0) return `${enrolled}/—`;
        return '容量未知';
    };
    const capacityStatusType = (course: Course) => {
        if (!hasFullCapacity(course)) return 'info';
        const enrolled = course.yxzrs ?? 0;
        const cap = course.bksrl ?? 0;
        if (enrolled > cap) return 'danger';
        if (cap > 0 && enrolled / cap >= 0.9) return 'warning';
        return 'success';
    };

    const prevPage = () => {
        if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const handleToggleActive = (courseId: string, isActive: boolean) => {
        store.toggleCourseActive(courseId, isActive);
        debouncedGenerate();
    };

    const jumpPages = (direction: 'prev' | 'next') => {
        const jumpSize = Math.max(1, Math.floor(totalPages.value * 0.1));
        if (direction === 'prev') {
            currentPage.value = Math.max(1, currentPage.value - jumpSize);
        } else {
            currentPage.value = Math.min(totalPages.value, currentPage.value + jumpSize);
        }
    };

    const handleKeyup = (e: KeyboardEvent) => {
        // 防止在输入框中触发快捷键
        const target = e.target as HTMLElement;
        const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        const key = e.key.toLowerCase();

        // Backspace 特殊处理：只在非输入框时生效
        if (key === 'backspace' && !isInInput) {
            e.preventDefault();
            router.push('/select');
            return;
        }

        // 其他导航键在输入框中也不生效
        if (isInInput) return;

        if (e.shiftKey && (key === 'arrowleft' || key === 'h')) {
            e.preventDefault();
            jumpPages('prev');
        } else if (e.shiftKey && (key === 'arrowright' || key === 'l')) {
            e.preventDefault();
            jumpPages('next');
        } else if (key === 'arrowleft' || key === 'h') {
            e.preventDefault();
            prevPage();
        } else if (key === 'arrowright' || key === 'l') {
            e.preventDefault();
            nextPage();
        }
    };

    const dragStart = (index: number) => {
        dragIndex.value = index;
    };

    const onDrop = (dropIndex: number) => {
        if (dragIndex.value === null) return;
        if (dragIndex.value === dropIndex) return;

        const item = store.selectedCourses[dragIndex.value];
        if (!item) return;

        store.selectedCourses.splice(dragIndex.value, 1);
        store.selectedCourses.splice(dropIndex, 0, item);
        dragIndex.value = null;

        // Re-generate
        debouncedGenerate();
    };

    let debounceTimer: number | null = null;
    const debouncedGenerate = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(triggerGenerate, 300) as unknown as number;
    };

    const triggerGenerate = () => {
        try {
            const results = arrangeSchedule(store.selectedCourses);
            if (results.length === 0) {
                store.setResults([]);
                // Optionally clear index or handle empty state ui
            } else {
                store.setResults(results);
                store.currentResultIndex = 0;
            }
        } catch (e) {
            console.error(e);
            ElMessage.error('排课出错');
        }
    };

    onMounted(() => {
        // Start shared auto-refresh (includes immediate run) to keep capacity/time fresh and re-schedule when data changes
        startAutoRefresh(30_000, () => {
            debouncedGenerate();
        });

        // If results are empty (e.g. reload), try generate if courses exist
        if (store.scheduleResults.length === 0 && store.selectedCourses.length > 0) {
            triggerGenerate();
        }
        window.addEventListener('keydown', handleKeyup);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyup);
    });

    const exportImage = async () => {
        if (!scheduleRef.value) return;
        // Check if there is a schedule rendered (not the empty msg)
        if (!currentSchedule.value) {
            ElMessage.warning('当前无课表可导出');
            return;
        }

        try {
            const canvas = await html2canvas(scheduleRef.value);
            const link = document.createElement('a');
            link.download = `schedule-variant-${currentPage.value}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (e) {
            console.error('Export failed', e);
            ElMessage.error('导出失败');
        }
    };

    const exportCSV = () => {
        if (!flatSchedule.value.length) {
            ElMessage.warning('当前无课表可导出');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Course Name,Code,Teacher,Time Codes\n";
        flatSchedule.value.forEach(c => {
            const row = [
                c.kcmc,
                `"${c.kcdm}"`,
                c.dgjsmc,
                `"${(c.time || []).join(';')}"`
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `schedule-${currentPage.value}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportICS = () => {
        if (!flatSchedule.value.length) {
            ElMessage.warning('当前无课表可导出');
            return;
        }

        try {
            const icsContent = exportToICS(flatSchedule.value, semesterStartDate.value);
            downloadICS(icsContent, `SUSTech课程表-方案${currentPage.value}.ics`);
            ElMessage.success('日历文件已导出');
        } catch (e) {
            console.error('ICS export failed', e);
            ElMessage.error('导出失败');
        }
    };
</script>

<style scoped>
    /* Keep vertical/horizontal scrollbars consistent in the schedule area */
    .schedule-scroll::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .schedule-scroll::-webkit-scrollbar-track {
        background: var(--el-border-color-lighter);
        border-radius: 6px;
    }

    .schedule-scroll::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.25);
        border-radius: 6px;
    }

    .schedule-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.35);
    }
</style>
