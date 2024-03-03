
const axios = require('axios');
const { getArg, genIframeCode, log } = require('./util')

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
}

const default_args = {
    w:'100%',
    h:'100%',
    allow:'allow-top-navigation allow-same-origin allow-forms allow-scripts',
    scrolling:'on',
    style:'',
    allowfullscreen: 'allowfullscreen',
}

//参考 https://github.com/1015770492/bilibili-download/blob/master/doc/bilibili-Api%E6%96%87%E6%A1%A3.md

const queryWidthBV = (id) => {
    const query_url = `http://api.bilibili.com/x/web-interface/view?bvid=${id}`
    log.debug('query:', query_url);
    return axios.get(query_url, { headers }).then(({ data }) => {
        return data;
    });
}


/**
 * Process bilibili url and generate html code
 * 
 * sample url: https://www.bilibili.com/video/xxxxxxxxxx/
 * @param {string} link bilibili video url
 * @param {Map} args 
 * @returns iframe code
 */
async function generateBlIFrame(link, args) {
    let bvid = '';

    let match = link.match(/\/video\/([a-zA-Z0-9]+)\//);
    if (match && match.length > 1) {
        bvid = match[1];
    }
    const resp = await queryWidthBV(bvid);

    if (!resp || resp.code != 0) {
        // error
        console.warn('AZPlayer: query bv error ', bvid, resp.message);
        return link;
    } else {
        let { aid, cid } = resp.data;

        let pm = {...default_args,...args};
        
        return genIframeCode(
            `<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&high_quality=1&danmaku=0" allowfullscreen="${pm.allowfullscreen}" width="${pm.w}" height="${pm.h}" scrolling="${pm.scrolling}" frameborder="0" sandbox="${pm.allow}"  style="${pm.style}"></iframe>`
        )
    }
}


module.exports = {
    generateBlIFrame
}