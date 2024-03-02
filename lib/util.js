
const hexoLog = require('hexo-log');

const log = typeof hexoLog.default === 'function' ? hexoLog.default({
    debug: false,
    silent: false
}) : hexoLog({
    debug: false,
    silent: false
});

const genIframeCode = (iframe) => {
    // console.log('iframe:',iframe)
    return `<div class="video_box" style="position: relative; ">${iframe} </div>
    `
}

/**
 * 
 * @param { } key key name
 * @param {*} args args array
 * @param {*} dft default value
 * @author pxysea@163.com
 */
const getArg = (key, args, dft = '') => {
    for (let t of args) {
        let regex = new RegExp(`^['" ]{0,}${key}[ ]{0,}=[ ]{0,}([^'$]+)['" ]{0,}$`);

        let match = t.match(regex);
        if (match && match.length > 1) {
            log.debug('arg :', key, match[1]);
            return match[1];
        }
    }
    return dft;
}

const parseArgs = (args) =>{
    let idx = 0;
    // const map = new Map();
    const map = {};
    for (let t of args) {
        let regex = new RegExp(`^['" ]{0,}([a-zA-Z_]+[a-zA-Z_0-9]{0,})[ ]{0,}=[ '"]{0,}([^'"$]+)['" ]{0,}$`);

        let match = t.match(regex);
        if (match && match.length > 2) {
            let key = match[1]
            let value = match[2]
            log.debug(`parseArgs : ${key}, ${value}`);
            map[key] = value;
        }else{
            map[`_key_${idx}`] = t;
        }
        idx++;
    }
    return map;
}

module.exports = {
    log,
    getArg,
    genIframeCode,
    parseArgs,
}