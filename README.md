# Combine images to pdf

This tool is used for [crawler_manhua](https://github.com/Wegt-meoh/crawler_manhua)

convert the downloaded images into pdf files which are seperated by directory

## Example

target dir struct:

```md
targetDir
├──0_chapterName
│   ├── 0001.jpg
│   └── 0002.jpg
├──1_chapterName
│   ├── 0001.jpg
│   └── 0002.jpg
```

output struct:

```md
outputDir
├──0_chapterName.pdf 1_chapterName.pdf
```
