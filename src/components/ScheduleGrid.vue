<template>
    <div style="height: 100%; display: flex; flex-direction: column; user-select: none;">
        <el-tabs v-model="activeTab" type="card" style="flex: 1; display: flex; flex-direction: column;">
            <el-tab-pane label="单周" name="odd" style="height: 100%;">
                <div style="height: 100%; overflow: auto;">
                    <el-table :data="timeSlots" border style="width: 100%; height: 100%; user-select: none;"
                        :row-style="{ height: '100px' }" :cell-style="({ rowIndex, columnIndex }) => {
                            if (columnIndex === 0) return {};
                            const course = getCourse(1, columnIndex, rowIndex);
                            if (!course) return {};
                            const isHighlighted = colorManager.isHighlighted(course.id);
                            return {
                                backgroundColor: getCourseColor(course.id),
                                padding: '0',
                                position: 'relative',
                                border: isHighlighted ? '3px solid #FFD700' : undefined,
                                boxSizing: 'border-box'
                            };
                        }">
                        <el-table-column label="时间 / 星期" width="100" align="center" fixed>
                            <template #default="scope">
                                <div style="white-space: pre-wrap; font-size: 12px; font-weight: bold;">{{ scope.row }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(day, index) in weekDays" :key="index" :label="day" align="center"
                            min-width="120">
                            <template #default="scope">
                                <div v-if="getCourse(1, index + 1, scope.$index)"
                                    :style="{ ...getCourseStyle(), position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '8px' }"
                                    @click="changeColor(getCourse(1, index + 1, scope.$index)!.id)"
                                    @contextmenu.prevent="showContextMenu($event, getCourse(1, index + 1, scope.$index)!, 1, index + 1, scope.$index)">
                                    <div
                                        style="font-size: 13px; font-weight: bold; line-height: 1.4; margin-bottom: 4px;">
                                        {{ getCourse(1, index + 1, scope.$index)!.kcmc }}</div>
                                    <div
                                        style="font-size: 12px; opacity: 0.95; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        {{
                                            getCourse(1, index + 1,
                                                scope.$index)!.dgjsmc }}</div>
                                    <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">{{ getCourse(1, index +
                                        1, scope.$index)!.skyymc }}</div>
                                    <div
                                        style="position: absolute; top: 6px; right: 6px; display: flex; align-items: center; font-size: 10px;">
                                        <span :style="{
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            background: 'rgba(0, 0, 0, 0.35)',
                                            color: '#fff',
                                            lineHeight: 1.2,
                                        }">
                                            {{ compactCapacityText(getCourse(1, index + 1, scope.$index)!) }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="双周" name="even" style="height: 100%;">
                <div style="height: 100%; overflow: auto;">
                    <el-table :data="timeSlots" border style="width: 100%; height: 100%; user-select: none;"
                        :row-style="{ height: '100px' }" :cell-style="({ rowIndex, columnIndex }) => {
                            if (columnIndex === 0) return {};
                            const course = getCourse(2, columnIndex, rowIndex);
                            if (!course) return {};
                            const isHighlighted = colorManager.isHighlighted(course.id);
                            return {
                                backgroundColor: getCourseColor(course.id),
                                padding: '0',
                                position: 'relative',
                                border: isHighlighted ? '3px solid #FFD700' : undefined,
                                boxSizing: 'border-box'
                            };
                        }">
                        <el-table-column label="时间 / 星期" width="100" align="center" fixed>
                            <template #default="scope">
                                <div style="white-space: pre-wrap; font-size: 12px; font-weight: bold;">{{ scope.row }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(day, index) in weekDays" :key="index" :label="day" align="center"
                            min-width="120">
                            <template #default="scope">
                                <div v-if="getCourse(2, index + 1, scope.$index)"
                                    :style="{ ...getCourseStyle(), position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '8px' }"
                                    @click="changeColor(getCourse(2, index + 1, scope.$index)!.id)"
                                    @contextmenu.prevent="showContextMenu($event, getCourse(2, index + 1, scope.$index)!, 2, index + 1, scope.$index)">
                                    <div
                                        style="font-size: 13px; font-weight: bold; line-height: 1.4; margin-bottom: 4px;">
                                        {{ getCourse(2, index + 1, scope.$index)!.kcmc }}</div>
                                    <div
                                        style="font-size: 12px; opacity: 0.95; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        {{
                                            getCourse(2, index + 1,
                                                scope.$index)!.dgjsmc }}</div>
                                    <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">{{ getCourse(2, index +
                                        1, scope.$index)!.skyymc }}</div>
                                    <div
                                        style="position: absolute; top: 6px; right: 6px; display: flex; align-items: center; font-size: 10px;">
                                        <span :style="{
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            background: 'rgba(0, 0, 0, 0.35)',
                                            color: '#fff',
                                            lineHeight: 1.2,
                                        }">
                                            {{ compactCapacityText(getCourse(2, index + 1, scope.$index)!) }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- Context Menu -->
        <el-card v-if="menuVisible" :style="{ ...menuStyle, position: 'fixed', zIndex: 9999, minWidth: '150px' }"
            :body-style="{ padding: '0' }" shadow="always" @click.stop>
            <div style="padding: 8px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 13px;"
                @mouseenter="handleHover($event, '#f5f7fa')" @mouseleave="handleHover($event, '')"
                @click="handleAction('recolor')">更换颜色</div>
            <div style="padding: 8px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 13px;"
                @mouseenter="handleHover($event, '#f5f7fa')" @mouseleave="handleHover($event, '')"
                @click="handleAction('details')">查看详情</div>
            <div style="padding: 8px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 13px;"
                @mouseenter="handleHover($event, '#f5f7fa')" @mouseleave="handleHover($event, '')"
                @click="handleAction('highlight')">高亮课程</div>
            <!-- <div style="padding: 8px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 13px;" @click="handleAction('clear')">清空时段</div> -->
            <div style="padding: 8px 16px; cursor: pointer; color: #f56c6c; font-size: 13px;"
                @mouseenter="handleHover($event, '#fef0f0')" @mouseleave="handleHover($event, '')"
                @click="handleAction('disable')">禁用课程</div>
        </el-card>

        <!-- Color Picker -->
        <ColorPicker :visible="colorPickerVisible" :position="colorPickerPosition" :current-color="currentCourseColor"
            @close="colorPickerVisible = false" @confirm="handleColorConfirm" />
    </div>
</template>

<script setup lang="ts">
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { Course, CourseBundle } from '@/types';
    import { TIME_SLOTS, WEEK_DAYS } from '@/utils/scheduleAlgo';
    import { store } from '../store/courseStore';
    import ColorPicker from './ColorPicker.vue';
    import { findCourseAtTime } from '@/utils/courseTimeParser';
    import { CourseColorManager } from '@/utils/courseColorManager';

    const props = defineProps<{
        schedule: CourseBundle;
    }>();

    const emit = defineEmits<{
        (e: 'refresh'): void
    }>();

    const activeTab = ref('odd');
    const timeSlots = TIME_SLOTS;
    const weekDays = WEEK_DAYS;
    const menuVisible = ref(false);
    const menuStyle = reactive({ top: '0px', left: '0px' });
    const contextCourse = ref<Course | null>(null);
    const contextPosition = reactive({ week: 0, day: 0, slot: 0 });

    // Color picker state
    const colorPickerVisible = ref(false);
    const colorPickerPosition = reactive({ top: '0px', left: '0px' });
    const currentCourseColor = ref('#2c3e50');
    const colorPickerCourseId = ref('');

    // Use color manager (make it reactive)
    const colorManager = reactive(new CourseColorManager());

    function getCourseColor (id: string) {
        const color = colorManager.getColor(id);
        // 将十六进制颜色转换为 rgba 格式，添加 0.333 的透明度
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.333)`;
    }

    function changeColor (id: string) {
        colorManager.assignRandomColor(id);
    }

    function getCourseStyle () {
        return {
            color: '#fff',
            height: '100%',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center'
        };
    }

    // Helper to find course at specific time
    function getCourse (week: number, day: number, slotIndex: number): Course | undefined {
        return findCourseAtTime(props.schedule, week, day, slotIndex);
    }

    const hasFullCapacity = (course: Course) => typeof course.yxzrs === 'number' && typeof course.bksrl === 'number' && (course.bksrl ?? 0) > 0;

    const compactCapacityText = (course: Course) => {
        if (hasFullCapacity(course)) {
            const enrolled = course.yxzrs ?? 0;
            const cap = course.bksrl ?? 0;
            return `${enrolled}/${cap}`;
        }
        if (typeof course.yxzrs === 'number') return `${course.yxzrs}/—`;
        return '容量?';
    };

    // Watch for schedule changes to clear colors or re-assign if needed
    watch(() => props.schedule, () => {
        // Optionally clear or keep colors. Keeping colors is usually better for UX if same course appears.
        // courseColors.clear();
    });

    const handleHover = (e: Event, color: string) => {
        const target = e.target as HTMLElement;
        if (target) {
            // 如果是深色模式，使用深色的 hover 颜色
            const isDark = document.documentElement.classList.contains('dark');
            let hoverColor = color;
            if (isDark) {
                if (color === '#f5f7fa') {
                    hoverColor = '#4a4a4a';
                } else if (color === '#fef0f0') {
                    hoverColor = '#5a3a3a';
                }
            }
            target.style.backgroundColor = hoverColor;
        }
    };

    const showContextMenu = (event: MouseEvent, course: Course, week: number, day: number, slotIndex: number) => {
        contextCourse.value = course;
        contextPosition.week = week;
        contextPosition.day = day;
        contextPosition.slot = slotIndex;

        const { clientX, clientY } = event;
        // Basic boundary check could be added here
        menuStyle.left = `${clientX}px`;
        menuStyle.top = `${clientY}px`;
        menuVisible.value = true;

        // Add click listener to close menu
        setTimeout(() => {
            window.addEventListener('click', closeMenu);
            window.addEventListener('contextmenu', closeMenu);
        }, 0);
    };

    const closeMenu = () => {
        menuVisible.value = false;
        window.removeEventListener('click', closeMenu);
        window.removeEventListener('contextmenu', closeMenu);
    };

    const handleAction = (action: string) => {
        if (!contextCourse.value) return;
        const cid = contextCourse.value.id;

        if (action === 'recolor') {
            // 打开颜色选择器，获取原始十六进制颜色（不带 alpha 通道）
            colorPickerCourseId.value = cid;
            currentCourseColor.value = colorManager.getColor(cid) || '#2c3e50';
            colorPickerPosition.left = menuStyle.left;
            colorPickerPosition.top = menuStyle.top;
            colorPickerVisible.value = true;
            closeMenu();
        } else if (action === 'details') {
            const c = contextCourse.value;
            ElMessageBox.alert(
                `<p><strong>${c.kcmc}</strong> (${c.kcdm})</p>
                 <p>Teacher: ${c.dgjsmc}</p>
                 <p>Dept: ${c.kkyxmc}</p>
                 <p>Time codes: ${(c.time || []).join(', ')}</p>`,
                'Course Details',
                { dangerouslyUseHTMLString: true }
            );
        } else if (action === 'highlight') {
            // 高亮课程 - 使用边框高亮
            if (colorManager.isHighlighted(cid)) {
                colorManager.unhighlight(cid);
            } else {
                colorManager.highlight(cid);
                // 3秒后自动取消高亮
                setTimeout(() => {
                    colorManager.unhighlight(cid);
                }, 3000);
            }
        } else if (action === 'disable') {
            ElMessageBox.confirm(
                `确定要禁用课程"${contextCourse.value.kcmc}"吗？这将触发重新排课。`,
                '禁用课程',
                { type: 'warning' }
            ).then(() => {
                store.toggleCourseActive(cid, false);
                emit('refresh'); // Notify parent to re-schedule
            }).catch(() => { });
        } else if (action === 'clear') {
            // "Clear Time Slot" logic is complex: it implies creating a constraint "No class at Week X Day Y Slot Z"
            // This requires storing constraints in store or algo.
            // For now, let's skip implementing this unless requested, as it requires deeper store changes.
            ElMessage.info('Feature not fully implemented yet.');
        }

        closeMenu();
    };

    const handleColorConfirm = (color: string) => {
        if (colorPickerCourseId.value) {
            colorManager.setColor(colorPickerCourseId.value, color);
        }
    };
</script>
