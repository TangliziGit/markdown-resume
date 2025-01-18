/***
 * @author HuaiyuGong
 * @description This code is to convert markdown to pdf
 */

const fs = require('fs'),
    mp = require('markdown-pdf'),
    through = require('through2'),
    path = require('path')
cheerio = require('cheerio');


const files = 'md'
const resultFiles = 'pdf'


const preProcessHtml = (basePath) => {
    return function () {
        return through(function (chunk, encoding, callback) {
            var $ = cheerio.load(chunk);
            $('img[src]').each(function () {
                var imagePath = $(this).attr('src');
                imagePath = path.resolve(basePath, imagePath);
                $(this).attr('src', 'file://' + (process.platform === 'win32' ? '/' : '') + imagePath);
            });

            this.push($.html());
            callback();
        });
    }
};

const reg = /^(.*)\.(.*)$/
let commonOptions = {
    preProcessHtml: preProcessHtml(files),
    cssPath: 'resume.css',
    remarkable: {
        preset: 'full',
        html: true
    },
}

const recureRead = (dir) => fs.readdir(dir, (err, childrenDir) => {
    if (err) {
        console.log(err);
    } else {
        childrenDir.forEach(name => {
            if (!reg.test(name)) return
            const [filename, ext] = (() => {
                const splits = name.split('.');
                const len = splits.length;
                return [splits.slice(0, len-1).join('.'), splits[len-1]];
            })();

            let options = {...commonOptions};
            if (fs.existsSync(`css/${filename}.css`))
                options['cssPath'] = `css/${filename}.css`
            console.log(options['cssPath'])

            fs.createReadStream(`${dir}/${name}`)
                .pipe(mp(options))
                .pipe(fs.createWriteStream(`${resultFiles}/${filename}.pdf`));

            console.log(`${filename}.${ext} done!`)
        })
    }
});

recureRead(files);
