

const { getArg, genIframeCode, log } = require('./util')

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
    let title = args.title || 'az' //getArg('title',args,'az');
    let w = args.w || '1280' //getArg('w',args,'1280');
    let h = args.h || '720' //getArg('h',args,'720');
    let allow = args.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' //getArg('allow',args,'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');

    return genIframeCode(
        `<iframe width="${w}" height="${h}" src="https://www.youtube.com/embed/${id}" title="${title}" frameborder="0" allow="${allow}" allowfullscreen></iframe>`
    );
}


module.exports = {
    generateYoutuIFrame
}