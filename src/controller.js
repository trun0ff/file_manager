import InvalidActionError from "./Errors/InvalidActionError.js";
import path from "path";
import {calculateHash, checkDirPath, checkFilePath, list, prepareInputPath, readFile} from "./helpers/files.js";
import {getFirstKey, getFirstPathArg, getSecondPathArg} from "./helpers/args.js";
import InvalidArgumentError from "./Errors/InvalidArgumentError.js";
import {cpus, EOL, homedir, userInfo} from "os";
import {printCpusInfo} from "./helpers/os_info.js";
import {compressBrotli, decompressBrotli} from "./helpers/compression.js";

export const __resolveAction = async (action, params) => {
    switch (action) {
        case 'up':
            actionUp();
            break;
        case 'cd':
            actionCd(params);
            break;
        case 'ls':
            actionLs();
            break;
        case 'cat':
            actionCat(params);
            break;
        case 'add':
            break;
        case 'rn':
            break;
        case 'cp':
            break;
        case 'mv':
            break;
        case 'rm':
            break;
        case 'os':
            actionOs(params);
            break;
        case 'hash':
            actionHash(params);
            break;
        case 'compress':
            await actionCompress(params);
            break;
        case 'decompress':
            await actionDecompress(params);
            break;
        default:
            throw new InvalidActionError('Oops! Action not found.');
    }
};

const actionUp = () => {
    process.chdir('..');
};

const actionCd = (params) => {
    if(params.length !== 1) {
        throw new InvalidArgumentError('Wrong arguments for cd');
    }
    var dir = params[0];
    if(!dir.startsWith('/') && dir.indexOf(':') === -1)
    {
        dir = process.cwd() + path.sep + dir;
    }
    process.chdir(dir);
};

const actionLs = () => {
    list(process.cwd())
};

const actionCat = () => {
    // resolve path like for actionCd and then call readFile from files.js
};

const actionOs = (params) => {
    let key = getFirstKey(params);
    switch(key) {
        case 'EOL':
            console.log('Current system End-Of-Line is ' + JSON.stringify(EOL));
            break;
        case 'cpus':
            printCpusInfo();
            break;
        case 'homedir':
            console.log('Home dir is ' + homedir());
            break;
        case 'username':
            console.log('OS username is "' + userInfo().username + '"');
            break;
        case 'architecture':
            console.log('CPU architecture is ' +  process.arch);
            break;
        default:
            throw new InvalidArgumentError('Key ' + key + ' not found');
    }
};

const actionHash = (params) => {
    console.log( checkFilePath(getFirstPathArg(params)) ?
        'File hash is: ' + calculateHash(getFirstPathArg(params)) :
        'Path is incorrect!');
};

const actionCompress = async (params) => {
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        console.log('Check that first argument is file and second is directory that exists');
        return;
    }

    await compressBrotli(prepareInputPath(getFirstPathArg(params)), prepareInputPath(getSecondPathArg(params)));
};

const actionDecompress = async (params) => {
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        console.log('Check that first argument is file and second is directory that exists');
        return;
    }

    await decompressBrotli(prepareInputPath(getFirstPathArg(params)), prepareInputPath(getSecondPathArg(params)));
};