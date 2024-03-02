'use strict';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
}
hexo.config.azplayer = Object.assign({

}, hexo.config.azplayer);

const config = hexo.config.azplayer;

function genIframeCode(iframe) {
    // console.log('iframe:',iframe)
    return `<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">${iframe} </div>
    `
}

/**
 * 
 * @param { } key key name
 * @param {*} args args array
 * @param {*} dft default value
 * @author pxysea@163.com
 */
function getArg(key, args, dft = '') {
    for (let t of args) {
        let regex = new RegExp(`^['" ]{0,}${key}[ ]{0,}=[ ]{0,}([^'$]+)['" ]{0,}$`,);

        let match = t.match(regex);
        if (match && match.length > 1) {
            // console.debug('arg :',key,match[1]);
            return match[1];
        }
    }
    return dft;
}
/**
 * Process bilibili url and generate html code
 * @param {string} link bilibili video url
 * @param {Array} args 
 * @returns iframe code
 * @author pxysea@163.com
 */
async function processBilibili(link, args) {
    const axios = require('axios');
    let bvid = '';

    //引用自 https://github.com/1015770492/bilibili-download/blob/master/doc/bilibili-Api%E6%96%87%E6%A1%A3.md
    const queryWidthBV = (id) => {
        const query_url = `http://api.bilibili.com/x/web-interface/view?bvid=${id}`
        // console.log('query:',query_url);
        return axios.get(query_url, { headers }).then(({ data }) => {
            return data;
        });
    }

    let match = link.match(/\/video\/([a-zA-Z0-9]+)\//);
    if (match && match.length > 1) {
        bvid = match[1];
    }
    const resp = await queryWidthBV(bvid);

    // console.info('query resp :', resp)
    if (!resp || resp.code != 0) {
        // error
        console.warn('AZPlayer: query bv error ', bvid, resp.message);
        return link;
    } else {
        let { aid, cid } = resp.data;
        let sandbox = getArg('allow', args, 'allow-top-navigation allow-same-origin allow-forms allow-scripts');
        let scrolling = getArg("scrolling", args, 'no');
        let w = getArg('w', args, '100%');
        let h = getArg('h', args, '100%');

        return genIframeCode(
            `<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&high_quality=1&danmaku=0" allowfullscreen="allowfullscreen" width="${w}" height="${h}" scrolling="${scrolling}" frameborder="0" sandbox="${sandbox}"  style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"></iframe>`

        )
    }
}

//url rule
//https://www.youtube.com/watch?v=UuraNOlh-Vk
//https://youtu.be/6mTlXvEkuvU
function processYoutube(link, args) {
    // console.log('process youtube:',args);
    const match = link.match(/\/watch\?v=([a-zA-Z0-9-_]+)/);
    let id = '';

    if (match && match.length > 1) {
        id = match[1];
    }
    if (id === '') {
        match = link.match(/youtu.be\/([a-zA-Z0-9-_]+)/);
        if (match && match.length > 1) {
            id = match[1];
        }
    }
    if (id === '')
        return link;
    let title = getArg('title', args, 'az');
    let w = getArg('w', args, '1280');
    let h = getArg('h', args, '720');
    let allow = getArg('allow', args, 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');

    return genIframeCode(
        `<iframe width="${w}" height="${h}" src="https://www.youtube.com/embed/${id}" title="${title}" frameborder="0" allow="${allow}" allowfullscreen></iframe>`
    );
}

hexo.extend.tag.register('azplayer', async function (args) {
    let link = args[0];

    //https://www.bilibili.com/video/BV1QS421K7mD/
    if (/^http[s]?:\/\/www.bilibili.com\//.test(link)) {
        return await processBilibili(link, args);
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
