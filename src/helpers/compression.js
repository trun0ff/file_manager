import zlib from "zlib";
import fs from "fs";
import path from "path";

const extension = '.br';

const compressBrotli = async (filePath, pathTo) => {
    pathTo = path.join(pathTo, path.basename(filePath) + extension);
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(pathTo);
    const brotli = zlib.createBrotliCompress();
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        console.log('Compression is done.');
    });
};

const decompressBrotli = async (fileFrom, pathTo) => {
    //check that from is file and has br extension
    pathTo = path.join(pathTo, path.basename(fileFrom));
    pathTo = pathTo.slice(0,-extension.length);
    const readStream = fs.createReadStream(fileFrom);
    const writeStream = fs.createWriteStream(pathTo);
    const brotli = zlib.createBrotliDecompress();
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
        console.log('Decompressing is done.');
    });
};

export {
    compressBrotli,
    decompressBrotli
};