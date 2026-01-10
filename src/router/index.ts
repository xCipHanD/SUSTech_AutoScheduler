import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HelpView from '../views/HelpView.vue';
import CourseSelectionView from '../views/CourseSelectionView.vue';
import ScheduleResultView from '../views/ScheduleResultView.vue';
import MobileWarningView from '../views/MobileWarningView.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/help',
        name: 'Help',
        component: HelpView
    },
    {
        path: '/select',
        name: 'Select',
        component: CourseSelectionView
    },
    {
        path: '/schedule',
        name: 'Schedule',
        component: ScheduleResultView
    },
    {
        path: '/mobile-warning',
        name: 'MobileWarning',
        component: MobileWarningView
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
