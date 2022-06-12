import fs from "fs";
import crypto from "crypto";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const list = async (listFolder) => {
    fs.access(listFolder, (err ) => {
        if(err) throw new Error('FS operation failed. Folder to list files from doesn\'t exist');
    });

    fs.readdir(listFolder, (err, files) => {
        if(err) throw new Error(err);
        files.forEach((file) => {
            console.log(file);
        });
    });
};

const readFile = (filePath) => {
    const readableStream = fs.createReadStream(filePath, 'utf-8');

    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}

const checkFilePath = (inputPath) => {
    inputPath = prepareInputPath(inputPath);
    return fs.existsSync(inputPath) && fs.lstatSync(inputPath).isFile();
};

const checkDirPath = (inputPath) => {
    inputPath = prepareInputPath(inputPath);
    return fs.existsSync(inputPath) && fs.lstatSync(inputPath).isDirectory();
}

const prepareInputPath = (inputPath) => {
    if(!inputPath.startsWith('/') && inputPath.indexOf(':\\') === -1) {
        inputPath = path.join(process.cwd(), inputPath);
    }

    return inputPath;
}

const calculateHash = (inputPath) => {
    const fileBuffer = fs.readFileSync(inputPath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);

    return hashSum.digest('hex');
};

export {list, readFile, calculateHash, checkFilePath, checkDirPath, prepareInputPath};