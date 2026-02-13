import path from 'path';
import { TestDataFile } from '../data/enums/testDataFiles';

const projectRoot = path.join(__dirname, '..');

export class FileManager {
  static getTestDataPath(file: TestDataFile): string {
    return path.join(projectRoot, 'tests', 'test-data', file);
  }
}
