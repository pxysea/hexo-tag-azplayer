
const axios = require('axios');
const { getArg, genIframeCode, log } = require('./util')

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
}

//参考 https://github.com/1015770492/bilibili-download/blob/master/doc/bilibili-Api%E6%96%87%E6%A1%A3.md

const queryWidthBV = (id) => {
    const query_url = `http://api.bilibili.com/x/web-interface/view?bvid=${id}`
    log.info('query:', query_url);
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

    // console.info('query resp :', resp)
    if (!resp || resp.code != 0) {
        // error
        console.warn('AZPlayer: query bv error ', bvid, resp.message);
        return link;
    } else {
        let { aid, cid } = resp.data;
        let sandbox = args.allow || 'allow-top-navigation allow-same-origin allow-forms allow-scripts' //getArg('allow', args, 'allow-top-navigation allow-same-origin allow-forms allow-scripts');
        let scrolling = args.scrolling || 'no' //getArg("scrolling", args, 'no');
        let style = ''// args.style || 'position: absolute; width: 100%; height: 100%; left: 0; top: 0;';
        let w = args.w || '100%' //getArg('w', args, '100%');
        let h = args.h || '100%' //getArg('h', args, '100%');

        return genIframeCode(
            `<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&high_quality=1&danmaku=0" allowfullscreen="allowfullscreen" width="${w}" height="${h}" scrolling="${scrolling}" frameborder="0" sandbox="${sandbox}"  style="${style}"></iframe>`
        )
    }
}


module.exports = {
    generateBlIFrame
}