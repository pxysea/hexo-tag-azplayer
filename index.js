'use strict';
const { log,parseArgs } = require('./lib/util');
const { generateBlIFrame } = require('./lib/bl');
const { generateYoutuIFrame } = require('./lib/youtu');


hexo.extend.tag.register('azplayer', async function (args) {
    let link = args[0]; 
    
    log.debug('AZPlayer link:' + link);
    let p_args = parseArgs(args);    

    if (/^http[s]?:\/\/www.bilibili.com\//.test(link)) {
        return await generateBlIFrame(link,p_args);
    } else if (/^http[s]?:\/\/[w.]{0,}(youtube.com|youtu.be)\//.test(link)) {
        return generateYoutuIFrame(link, p_args);
    }
    else {
        // other 
        log.warn(`AZPlayer: Not support ${link}`);
       return link;
    }
}, { async: true })
