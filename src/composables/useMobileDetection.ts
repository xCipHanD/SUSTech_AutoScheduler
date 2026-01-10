import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export function useMobileDetection() {
    const router = useRouter();

    const isMobile = () => {
        // 检测用户代理
        const ua = navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

        // 检测屏幕宽度
        const isSmallScreen = window.innerWidth <= 768;

        // 检测触摸设备
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        return mobileRegex.test(ua) || (isSmallScreen && isTouchDevice);
    };

    onMounted(() => {
        // 如果当前不是移动端提示页面和主页,且检测到移动端,则跳转
        const currentPath = router.currentRoute.value.path;
        if (currentPath !== '/mobile-warning' && currentPath !== '/' && isMobile()) {
            router.replace('/mobile-warning');
        }
    });

    return {
        isMobile
    };
}
