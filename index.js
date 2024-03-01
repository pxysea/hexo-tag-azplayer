'use strict';

hexo.config.azplayer = Object.assign({
    sandbox_enabled: true
}, hexo.config.azplayer);

const config = hexo.config.azplayer;

function genIframeCode(iframe) {
    return `<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">${iframe} </div>
    `
}

async function processBilibili(link,args) {
    const axios = require('axios');
    let bvid = '';
    let cid = 0;
    let aid = 0;

    const getCID = async (id, key = 'bvid') => {
        //使用了 https://blog.xxwhite.com/2020/03230.bilibili-bvid.html 提供的api
        //作者 叉叉白 at https://blog.xxwhite.com/    

        const query_url = `https://api.bilibili.com/x/player/pagelist?${key}=${id}`

        const rq = axios.get(query_url);
        return rq.then((res) => {
            const rq_ = res.data;
            if (res.status !== 200) {
                throw new Error(id + "-API服务出现异常，请检查网络情况重试或联系作者");
            }
            if (rq_.code !== 0) {
                throw new Error(id + "-无效的视频bv号，请重新确认" + rq.code);
            }
            return parseInt(rq_.data[0].cid);
        });
    };
    const BvtoAV = (x) => {
        //使用了 https://www.zhihu.com/question/381784377/answer/1099438784 的算法
        //作者 mcfx at https://www.zhihu.com/people/-._.-
        const table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
        const tr = {};
        for (let i = 0; i < 58; i += 1) {
            tr[table[i]] = i;
        }
        const s = [11, 10, 3, 8, 4, 6];
        const xor = 177451812;
        const add = 8728348608;
        let r = 0;
        for (let i = 0; i < 6; i += 1) {
            r += tr[x[s[i]]] * (58 ** i);
        }
        return (r - add) ^ xor;
    };
    let match = link.match(/\/video\/([a-zA-Z0-9]+)\//);
    if (match && match.length > 1) {
        bvid = match[1];
        aid = BvtoAV(bvid);
        cid = await getCID(bvid)
    }

    if (aid && bvid && cid) {
        console.debug(`AZplayer: aid=${aid},cid=${cid} `);
        let sandbox = '';
        if (config.sandbox_enabled)
            sandbox = `sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"`;

        return genIframeCode(
            `<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&high_quality=1&danmaku=0" allowfullscreen="allowfullscreen" width="100%" height="100%" scrolling="no" frameborder="0" ${sandbox}  style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"></iframe>`
        )
    } else {
        return link;
    }
}

//https://www.youtube.com/watch?v=UuraNOlh-Vk
function processYoutube(link, args) {
    
    const match = link.match(/\/watch\?v=([a-zA-Z0-9-_]+)/);
    let id='';
    let title = '';

    if (!match) {
        return link;
    }
    id = match[1];
    
    if (args.length > 1)
        title = args[1];

    return genIframeCode(
        `<iframe width="1276" height="718" src="https://www.youtube.com/embed/${id}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    );
}

hexo.extend.tag.register('azplayer', async function (args) {
    let link = args[0];

    //https://www.bilibili.com/video/BV1QS421K7mD/
    if (/^http[s]?:\/\/www.bilibili.com\//.test(link)) {
        return await processBilibili(link,args);
    } else if (/^http[s]?:\/\/[w.]+?youtube.com\//.test(link)) {
        return processYoutube(link, args);
    }
    else {
        // other 
        console.warn(`AZPlayer: Not support ${link}`);
        return genIframeCode(
            `<iframe src="${link}" allowfullscreen="allowfullscreen" width="100%" height="100%" scrolling="no" frameborder="0"  style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"></iframe>`
        )
    }
}, { async: true })
