import { promisify } from 'util';
import { readFile } from 'fs';
import { from, OperatorFunction } from 'rxjs';
import { map, tap, flatMap, take, filter, concatMap, toArray, bufferCount } from 'rxjs/operators';
import Car from './models/Car';

const readFilePromise = promisify(readFile);
const filename = `${__dirname}/../files/fasecolda.txt`;

const splitLine = (): OperatorFunction<string, string> => obs =>
  obs.pipe(flatMap((text: string) => text.split('\r\n')));

const process = async () => {
  const file = readFilePromise(filename);
  const lines = from(file).pipe(
    map(buff => buff.toString()),
    splitLine(),
    filter((_, index) => index > 0),
    filter(line => line !== '')
  );
  await lines.pipe(
    map(line => line.split('|')),
    map(line => ({
      brand: line[1],
      type: line[2],
      fasecolda: line[3],
      model: line[5],
      details: `${line[6]} ${line[7]}`
    })),
    bufferCount(1000),
    flatMap(car => from(Car.bulkCreate(car)))
  ).toPromise();
  return 'Finished';
};

process()
  .then(console.log)
  .catch(console.error);
