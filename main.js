import readImagesInOrder from './readImagesInOrder.js'
import combineToPdf from './combineToPdf.js'

const target = `C:\\Users\\wegt-meoh\\Downloads\\crawler_manhua\\output\\manga-rt21385`
const outputDir = 'output'

const orderedImagesPath = await readImagesInOrder(target)

await combineToPdf(orderedImagesPath, outputDir)