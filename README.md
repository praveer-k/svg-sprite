# svg-sprite
Reduce Unscaled SVG to a standard format and lay them out in a single sprite.

```
const SVGSprite = require('svg-sprite-standardized').SVGSprite;

let infilepath = process.argv[2];
let outfilepath = process.argv[3];

const svg = new SVGSprite(infilepath);
svg.generate('viewtranslate').write(outfilepath);

```

Then, on the console :

```
 
 > node index.js --input-file-name --output-file-name

 > node index.js --input-directory-name --output-file-name

```
