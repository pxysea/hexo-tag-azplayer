

const { getArg, genIframeCode, log } = require('./util')

const default_args = {
    title: 'az',
    w:'1280',
    h:'720',
    allow:'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    scrolling:'on',
    style:'',
    allowfullscreen: 'allowfullscreen',
};
//url rule
//https://www.youtube.com/watch?v=UuraNOlh-Vk
//https://youtu.be/6mTlXvEkuvU

const generateYoutuIFrame = (link, args) => {
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

    let pm = {...default_args,...args};

    return genIframeCode(
        `<iframe width="${pm.w}" height="${pm.h}" src="https://www.youtube.com/embed/${id}" title="${pm.title}" frameborder="0" allow="${pm.allow}" ${pm.allowfullscreen} scrolling="${pm.scrolling}" style="${pm.style}"></iframe>`
    );
}


module.exports = {
    generateYoutuIFrame
}