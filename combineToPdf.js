import { PDFDocument } from "pdf-lib";
import fsPromise from 'node:fs/promises'
import path from "node:path";
import { Dirent } from "node:fs";

/**
 * 
 * @param {{title:string,content:Dirent[]}[]} orderedImagesPath 
 * @param {string} outputPath   
 */
export default async function combineToPdf(orderedImagesPath, outputPath) {
    await fsPromise.mkdir(outputPath, { recursive: true })

    const result = await fsPromise.readdir(outputPath)
    if (result.length !== 0) {
        throw new Error(`outputPath is not empty, the path is ${path.resolve(outputPath)}`)
    }

    await Promise.all(orderedImagesPath.map(chapterDirent =>
        (async function () {
            const pdfDoc = await PDFDocument.create()
            for (const contentDirent of chapterDirent.content) {
                let pdfImage
                const imageBytes = await fsPromise.readFile(path.join(contentDirent.parentPath, contentDirent.name))
                const ext = path.extname(contentDirent.name).toLowerCase()

                switch (ext) {
                    case '.png':
                        pdfImage = await pdfDoc.embedPng(imageBytes)
                        break;
                    case '.jpg':
                        pdfImage = await pdfDoc.embedJpg(imageBytes)
                        break;
                    default:
                        throw new Error(`Unsupported file format: ${ext}`)
                }

                const page = pdfDoc.addPage([pdfImage.width, pdfImage.height])
                page.drawImage(pdfImage, {
                    x: 0,
                    y: 0,
                    width: pdfImage.width,
                    height: pdfImage.height
                })
            }

            const pdfBytes = await pdfDoc.save()
            await fsPromise.writeFile(path.join(outputPath, `${chapterDirent.title}.pdf`), pdfBytes)
        })()
    ))
}
