(function (unsafeWindow) {
    'use strict';

    // 重写导航函数
    unsafeWindow.bnavbtnFn = function (iconobj, id, name, pageurl, jsdm) {
        pageurl = (baseUrl + pageurl)
            .replace(baseUrl + baseUrl, baseUrl)
            .replace('/https:/', 'https://');

        $('.hide_li').hide();

        const tnavlist = [];
        $(".footer-main-list>li").each(function () {
            const listinx = $(this).children("a").attr("index");
            tnavlist.push(listinx);
        });

        if (tnavlist.indexOf(id) === -1) {
            mainsboxfn(id, pageurl, jsdm);
            navsboxfn(id, name, iconobj);
        } else {
            $(".footer-main-index").removeClass("on");
            $(".footer-main-list>li").removeClass("on");
            $("#mains_" + id).addClass("on");
            $(".contentbox-list .contentbox-sub").removeClass("action");
            $(".contentbox-list")
                .children("#mains_" + id + "_panel")
                .addClass("action");
        }

        cbhidenfn();
    };

    // 注入菜单项
    const menuItem = {
        bgcolor: '#2d8cf0',
        fqxdm: '001',
        icon: 'iconhuojiang2',
        jsdm: 'js001',
        jsmc: '自动排课',
        kyf: true,
        qxdm: '001',
        qxmc: '自动排课',
        qxmc_en: 'Auto Scheduling',
        sfsc: false,
        url: 'https://c.x-d.fun',
        xssx: 1,
        xtdm: 'xt01'
    };

    try {
        mains_index_iframe.window.app
            .$children[3]
            ._data.mkdata[2]
            .child.push(menuItem);

        console.log('[AutoScheduler] Menu injected');
    } catch (e) {
        console.error('[AutoScheduler] Menu inject failed', e);
    }

})(unsafeWindow);
