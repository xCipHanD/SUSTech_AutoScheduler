<template>
    <iframe
        title="Star SUSTech_AutoScheduler on GitHub"
        :src="src"
        width="110"
        height="30"
        frameborder="0"
        scrolling="no"
        style="border: 0; display: block;"
    ></iframe>
</template>

<script setup lang="ts">
    const user = 'xCipHanD';
    const repo = 'SUSTech_AutoScheduler';

    const src = `https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=star&count=true&size=large`;
</script>
