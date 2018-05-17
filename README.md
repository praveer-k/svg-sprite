# svg-sprite
Reduce Unscaled SVG to a standard format and lay them out in a single sprite.

The initial idea for creating this repository was to experiment with SVG and see how we can manipulate the SVG files (mainly to gain experience).

Usually, when we create a SVG file to an unscaled canvas, we end up with different scales for all svgs. Therefore, have to manipulate each SVG by looking at its scale and view box. In order to make them the same size and hence, relieve ourselves from calculating the view box size each time. I ended up creating a simple application to manipulate SVG and resize them. 

```
const SVGSprite = require('svg-sprite-standardized').SVGSprite;

let infilepath = process.argv[2];
let outfilepath = process.argv[3];

const svg = new SVGSprite(infilepath);
svg.generate('viewtranslate')
   .write(outfilepath)
   .writeCSS('./output/sprites.css');

```

Then, on the console :

```
 
 > node index.js --input-file-name --output-file-name

 > node index.js --input-directory-name --output-file-name

```
**There are 3 types of sprites that can be created :**
 - viewtranslate
 - stacked
 - symbol

 A CSS file also gets generated that can be used to link to icons. However, in case of symbols they should directly be used inside a html page.

**Note: icons named with numbers are renamed as _\<number\> in CSS file.**
 You also have option to reconfigure the size of the icons in the sprite which can be done by defining it while initiallizing the SVGSprite(\<filepath\>, \<options\>)
```
e.g. 

options = { height: 64, width:64, padding:8 };
const svg = new SVGSprite(infilepath, options);
svg.generate('stacked').write(outfilepath);

```

Please respond back with feedbacks and features that you would like to have in the application.

Report a bug or anything you dislike !!!