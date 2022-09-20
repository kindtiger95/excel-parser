import { db } from '../db/database.js';
import xlsxPkg from 'xlsx';
const { readFile } = xlsxPkg;
const xlsFile = readFile('/Users/ibjang/Downloads/hd_test.xls');

const firstSheetName = xlsFile.SheetNames[0];
const targetSheet = xlsFile.Sheets[firstSheetName];
const totalRowLength = Object.keys(targetSheet).length;

const parserProcess = async () => {
    console.log('전체 데이터 개수:', totalRowLength);
    let countProcess = 1;
    let beforePercentage = 0;
    const percentage = 0;
    console.log('작업 시작...');
    for (const key in targetSheet) {
        const cellObject = targetSheet[key];
        if (cellObject.v != null) {
            await db.execute(`INSERT INTO carnumber (carnum) VALUES (?)`, [cellObject.v]);
            countProcess++;
            const percentage = Math.floor((countProcess / totalRowLength) * 100);
            if (percentage != beforePercentage && percentage % 10 == 0) {
                beforePercentage = percentage;
                console.log(`현재 작업량 ... ${percentage}%`);
            }
        }
    }
    console.log('작업 완료!');
    process.exit(0);
};

export async function startWorker() {
    await parserProcess();
}
