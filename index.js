import {getArgValue} from "./src/helpers/args.js";
import * as readline from "readline";
import {__resolveAction} from "./src/controller.js";
import {sayHi, sayBye, sayCurrFolder} from "./src/helpers/say.js";
import {homedir} from "os";

const username = getArgValue('username');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.chdir(homedir());
sayHi(username);

rl.on('line', (line) => {
    const inputLine = line.trim();
    const actionEnd = line.indexOf(' ') !== -1 ? line.indexOf(' ') : 0;
    const action = actionEnd ? inputLine.slice(0, actionEnd) : inputLine;

    const params = inputLine.indexOf(' ') === -1 ? [] : inputLine
        .slice(inputLine.indexOf(' '), inputLine.length)
        .trim()
        .split(' ');

    __resolveAction(action, params).then(() => {sayCurrFolder()})
});

rl.on('close', () => sayBye(username));