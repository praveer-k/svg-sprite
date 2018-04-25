const SVGSprite = require('./dist').SVGSprite;

console.log('main.ts --infilepath --outfilepath');

let infilepath = (process.argv[2]==undefined) ? './test/icomoon/svg' : process.argv[2];
let outfilepath = (process.argv[3]==undefined) ? './output/sprites.svg' : process.argv[3];

const svg = new SVGSprite(infilepath);
svg.generate('viewtranslate').write(outfilepath);