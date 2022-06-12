import fs from "fs";
import crypto from "crypto";
import path from 'path';
import {sayCurrFolder} from "./say.js";

const listContents = async (listFolder) => {
    fs.access(listFolder, (err ) => {
        if(err) throw new Error('FS operation failed. Folder to list files from doesn\'t exist');
    });

    fs.readdir(listFolder, (err, files) => {
        if(err) throw new Error(err);
        files.forEach((file) => {
            console.log(file);
        });
        sayCurrFolder();
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

const readFileByStream = (filePath) => {
    const fileReadStream = fs.createReadStream(filePath, 'utf8');

    fileReadStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    });

    fileReadStream.on('data', (chunk) => {
        console.log(chunk);
    });

    fileReadStream.on('end', () => {
        sayCurrFolder();
    });
}
const copyFileByStream = (filePathFrom, destinationFolderPath) => {
    const filePathTo = path.join(destinationFolderPath, path.basename(filePathFrom))
    const readableStream = fs.createReadStream(filePathFrom, 'utf8');
    const writableStream = fs.createWriteStream(filePathTo);

    readableStream.on('data', (chunk) => {
        writableStream.write(chunk);
    });

    readableStream.on('end', () => {
        sayCurrFolder();
    });
    writableStream.end();
}

const moveFileByStream = (filePathFrom, destinationFolderPath) => {
    const filePathTo = path.join(destinationFolderPath, path.basename(filePathFrom))
    const readableStream = fs.createReadStream(filePathFrom, 'utf8');
    const writableStream = fs.createWriteStream(filePathTo);

    readableStream.on('data', (chunk) => {
        writableStream.write(chunk);
    });

    readableStream.on('end', () => {
        fs.unlink(filePathFrom, (err) => {
            if (err) {
                console.log("Removing initial file failed. " + err.message);
            }
            sayCurrFolder();
        });

    });
    writableStream.end();
}

const createFile = async (filePath) => {
    fs.stat(filePath, (err, stats) => {
        if (!stats) {
            fs.writeFile(filePath, '', () => {
                sayCurrFolder();
            });
        } else {
            console.log("File cannot be created.");
        }
    });
};

const fileRename = async (filePath, newFileName) => {
    fs.rename(
        filePath,
        path.join(path.dirname(filePath), newFileName),
        (err) => {
            if (err) {
                console.log("Rename failed: " + err.message);
            }
        }
    );
};

const fileRemove = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("Removing initial file failed. " + err.message);
        }
    });
};

export {
    listContents,
    readFile,
    calculateHash,
    checkFilePath,
    checkDirPath,
    prepareInputPath,
    readFileByStream,
    copyFileByStream,
    moveFileByStream,
    createFile,
    fileRename,
    fileRemove,

};