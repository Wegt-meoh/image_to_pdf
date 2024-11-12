import readImagesInOrder from './readImagesInOrder.js'
import combineToPdf from './combineToPdf.js'

const target = `C:\\xxxx\\xxxx\\your_image_save_path`
const outputDir = 'output'

const orderedImagesPath = await readImagesInOrder(target)

await combineToPdf(orderedImagesPath, outputDir)