import { Dirent } from 'node:fs'
import fsPromise from 'node:fs/promises'
import path from 'node:path'

/**
 * 
 * @param {string} targetDir 
 * @param {(a: Dirent, b: Dirent) => number} getOrder
 */
export default async function readImagesInOrder(targetDir, getOrder = defaultCompareFunction) {
    const chapterDirentList = await fsPromise.readdir(targetDir, { withFileTypes: true })
    if (!chapterDirentList.every(r => r.isDirectory())) {
        throw new Error('Error directory struct')
    }

    const sortedChapterDirentList = chapterDirentList.sort(getOrder)
    chapterDirentList.forEach(chapterDirent => {
        chapterDirent.parentPath = targetDir
    })

    return Promise.all(sortedChapterDirentList.map(async chapterDirent => {
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

/**
 * 
 * @param {Dirent} a 
 * @param {Dirent} b 
 */
function defaultCompareFunction(a, b) {
    const serialStringA = a.name.slice(0, a.name.indexOf('_'))
    const serialStringB = b.name.slice(0, b.name.indexOf('_'))

    if (/[^0-9]/.test(serialStringA || /[^0-9]/.test(serialStringB))) {
        throw new Error(`Can not get serial number from directory name which is A:${serialStringA} B:${serialStringB}`)
    }

    return Number.parseInt(serialStringA, 10) - Number.parseInt(serialStringB, 10)
}