<template>
    <el-container
        style="height: 100%; display: flex; justify-content: center; align-items: center; background-color: var(--el-bg-color);">
        <el-card style="max-width: 500px; margin: 20px; text-align: center;" shadow="always">
            <template #header>
                <div style="display: flex; justify-content: center; align-items: center;">
                    <el-icon :size="40" color="#409EFF">
                        <Monitor />
                    </el-icon>
                </div>
            </template>

            <div style="padding: 20px 0;">
                <h2 style="margin: 0 0 20px 0; color: #303133;">请使用电脑访问</h2>

                <p style="font-size: 16px; color: #606266; line-height: 1.8; margin-bottom: 20px;">
                    SUSTech 自动排课系统暂不支持移动端访问
                </p>

                <el-alert title="为获得最佳体验，请使用电脑浏览器访问本系统" type="info" :closable="false" style="margin-bottom: 20px;">
                </el-alert>

                <div style="font-size: 14px; color: #909399; margin-bottom: 20px;">
                    <p style="margin: 5px 0;">推荐使用以下浏览器：</p>
                    <p style="margin: 5px 0;">Chrome、Edge、Firefox、Safari</p>
                </div>

                <el-divider />

                <el-button type="primary" @click="backToHome">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                    返回主页
                </el-button>
            </div>
        </el-card>
    </el-container>
</template>

<script setup lang="ts">
    import { HomeFilled } from '@element-plus/icons-vue';

    const router = useRouter();

    const backToHome = () => {
        router.push('/');
    };
</script>
