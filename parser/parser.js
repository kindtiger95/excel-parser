import { db } from '../db/database.js';
import xlsxPkg from 'xlsx';
import { config } from '../config/config.js';
const { readFile } = xlsxPkg;

const xlsFile = readFile(config.filePath);

const firstSheetName = xlsFile.SheetNames[0];
const targetSheet = xlsFile.Sheets[firstSheetName];
const totalRowLength = Object.keys(targetSheet).length;
const platePattern = /.*\d{4}/;

const searchQuery = `SELECT * FROM bluewalnut_registerd_car WHERE plate_number = ?`;
const insertQuery = `INSERT INTO bluewalnut_registerd_car (brand_code, plate_number, reg_type, created_at) VALUES (?, ?, ?, ?)`;

export async function startWorker() {
    let countProcess = 1;
    let beforePercentage = 0;
    console.log('파일 이름:',config.filePath);
    console.log('전체 데이터 개수:', totalRowLength);
    console.log('3초 뒤 작업 시작');
    const currentTime = Date.now();
    while (Date.now() - currentTime < 3000) {}
    console.log('작업 시작...');
    for (const key in targetSheet) {
        const cellObject = targetSheet[key];
        if (cellObject.v != null && platePattern.exec(cellObject.v) != null) {
            const searchRet = await db.execute(searchQuery, [cellObject.v]);
            if (searchRet[0].length == 0) {
                await db.execute(insertQuery, ['2', cellObject.v, '1', new Date()]);
            }
            countProcess++;
            const percentage = Math.floor((countProcess / totalRowLength) * 100);
            if (percentage != beforePercentage && percentage % 10 == 0) {
                beforePercentage = percentage;
                console.log(`현재 작업량 ... ${percentage}%`);
            }
        }
    }
    console.log('작업 완료!');
    await db.end();
}
