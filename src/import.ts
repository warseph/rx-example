import { promisify } from 'util';
import { readFile } from 'fs';
import {  } from 'rxjs';
import {  } from 'rxjs/operators';

const readFilePromise = promisify(readFile);
const filename = `${__dirname}/../files/fasecolda.txt`;

const process = async () =>
  'Finished';

process()
  .then(console.log)
  .catch(console.error);
