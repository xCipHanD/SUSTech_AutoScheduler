<template>
    <el-card v-if="visible" :style="{ ...position, position: 'fixed', zIndex: 10000, minWidth: '280px' }"
        :body-style="{ padding: '15px' }" shadow="always" @click.stop>
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 14px;">选择颜色</span>
                <el-button link :icon="Close" @click="handleClose" />
            </div>
        </template>

        <!-- 预设颜色 -->
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 8px;">预设颜色</div>
            <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; align-items: center;">
                <div v-for="color in presetColors" :key="color"
                    :style="{ width: '28px', height: '28px', backgroundColor: color, cursor: 'pointer', borderRadius: '4px', border: '2px solid', borderColor: selectedColor === color ? 'var(--el-color-primary)' : 'transparent', boxSizing: 'border-box', outline: '1px solid var(--el-border-color)' }"
                    @click="selectColor(color)" :title="color">
                </div>
            </div>
        </div>

        <!-- 自定义颜色 -->
        <div>
            <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 8px;">自定义颜色</div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="color" v-model="customColor" @input="onCustomColorChange"
                    style="width: 50px; height: 32px; border: 1px solid var(--el-border-color); border-radius: 4px; cursor: pointer;" />
                <el-input v-model="customColor" placeholder="#000000" size="small" @input="onCustomColorInput"
                    style="flex: 1;">
                    <template #prepend>#</template>
                </el-input>
            </div>
        </div>

        <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
            <el-button size="small" @click="handleClose">取消</el-button>
            <el-button type="primary" size="small" @click="handleConfirm">确定</el-button>
        </div>
    </el-card>
</template>

<script setup lang="ts">
    import { Close } from '@element-plus/icons-vue';

    const props = defineProps<{
        visible: boolean;
        position: { top: string; left: string };
        currentColor?: string;
    }>();

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'confirm', color: string): void;
    }>();

    const presetColors = [
        '#2c3e50', '#34495e', '#7f8c8d', '#16a085',
        '#27ae60', '#2980b9', '#8e44ad', '#2c2c54',
        '#474787', '#218c74', '#33d9b2', '#3c6382',
        '#0a3d62', '#60a3bc', '#e58e26', '#b33939'
    ];

    const selectedColor = ref<string>((props.currentColor || presetColors[0]) as string);
    const customColor = ref<string>((props.currentColor || '#2c3e50') as string);

    watch(() => props.currentColor, (newColor) => {
        if (newColor) {
            selectedColor.value = newColor;
            customColor.value = newColor;
        }
    });

    watch(() => props.visible, (visible) => {
        if (visible && props.currentColor) {
            selectedColor.value = props.currentColor;
            customColor.value = props.currentColor;
        }
    });

    const selectColor = (color: string) => {
        selectedColor.value = color;
        customColor.value = color;
    };

    const onCustomColorChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        selectedColor.value = target.value;
    };

    const onCustomColorInput = (value: string) => {
        // 自动添加 # 前缀
        let colorValue = value.replace(/^#+/, '');
        if (colorValue && !colorValue.startsWith('#')) {
            colorValue = '#' + colorValue;
        }
        if (/^#[0-9A-Fa-f]{6}$/.test(colorValue)) {
            selectedColor.value = colorValue;
        }
    };

    const handleClose = () => {
        emit('close');
    };

    const handleConfirm = () => {
        emit('confirm', (selectedColor.value || presetColors[0]) as string);
        emit('close');
    };

    // 阻止快捷键事件传播,避免与全局快捷键冲突
    const stopKeyboardPropagation = (e: KeyboardEvent) => {
        e.stopPropagation();
    };

    watch(() => props.visible, (visible) => {
        if (visible) {
            // 颜色选择器打开时，阻止键盘事件传播
            window.addEventListener('keydown', stopKeyboardPropagation, true);
        } else {
            // 颜色选择器关闭时，移除事件监听器
            window.removeEventListener('keydown', stopKeyboardPropagation, true);
        }
    });

    onUnmounted(() => {
        // 组件卸载时确保移除事件监听器
        window.removeEventListener('keydown', stopKeyboardPropagation, true);
    });
</script>
