import { Dirent } from 'node:fs'
import fsPromise from 'node:fs/promises'
import path from 'node:path'

/**
 * 
 * @param {string} targetDir 
 */
export default async function readImagesInOrder(targetDir) {
    const chapterDirentList = await fsPromise.readdir(targetDir, { withFileTypes: true })
    if (!chapterDirentList.every(r => r.isDirectory())) {
        throw new Error('Error directory struct')
    }

    chapterDirentList.forEach(chapterDirent => {
        chapterDirent.parentPath = targetDir
    })

    return Promise.all(chapterDirentList.map(async chapterDirent => {
        const imageDirentList = await fsPromise.readdir(
            path.join(chapterDirent.parentPath, chapterDirent.name), { withFileTypes: true }
        )
        imageDirentList.forEach(imageDirent => {
            if (!imageDirent.isFile()) {
                throw new Error(`Subdirectories can not be recursive, error path is ${path.join(imageDirent.parentPath, imageDirent.name)}`)
            }
            imageDirent.parentPath = path.join(chapterDirent.parentPath, chapterDirent.name)
        })
        return {
            title: chapterDirent.name,
            content: imageDirentList.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
        }
    }
    ))
}