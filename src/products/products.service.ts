import { Injectable } from '@nestjs/common';
import { parse } from 'papaparse';
import { jsonrepair } from 'jsonrepair';
import { userDataSource } from 'src/database/database.providers';

@Injectable()
export class ProductsService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const csvData = file.buffer.toString();
    const parsedData: any = parse(csvData, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
    });

    for (const data of parsedData.data) {
      const sku =
        data?.sku.toLowerCase().replace('sku:', '').trim() + Math.random();
      const brand = data?.brand === '' ? 'Unbrand' : data?.brand;
      console.log(brand);
      const createdDate = new Date().toISOString().slice(0, 10);
      const repairedDescriptionData = JSON.parse(jsonrepair(data?.description));
      let finalDescription;
      repairedDescriptionData.forEach((description) => {
        finalDescription = { ...finalDescription, ...description };
      });
      const size = data?.size.split(',');
      var finalSize: { [k: string]: any } = {};
      size.forEach((size: string) => {
        switch (size) {
          case 'XS(2)':
            finalSize.extraSmall = 'XS(2)';
          case 'S(4)':
            finalSize.small = 'S(4)';
          case 'M(6)':
            finalSize.medium = 'M(6)';
          case 'L(8/10)':
            finalSize.large = 'L(8/10)';
          case 'one-size':
            finalSize.oneSize = 'one-size';
        }
      });
      const resultsBrand = await userDataSource.manager.query(
        'INSERT INTO brand VALUES (?, ?)',
        [sku, brand],
      );
      const resultsSize = await userDataSource.manager.query(
        'INSERT INTO SIZE VALUES(?, ?, ?, ?, ?, ?)',
        [
          sku,
          finalSize?.extraSmall,
          finalSize?.small,
          finalSize?.medium,
          finalSize?.large,
          finalSize?.oneSize,
        ],
      );
      const imagesArray = JSON.parse(jsonrepair(data.images));
      imagesArray.forEach(async (image) => {
        await userDataSource.manager.query('INSERT INTO images VALUES(?, ?)', [
          sku,
          image,
        ]);
      });
      const resultsDescription = await userDataSource.manager.query(
        'INSERT INTO description VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          sku,
          finalDescription?.Color || null,
          finalDescription?.Style || null,
          finalDescription?.['Pattern Type'] || null,
          finalDescription?.['Details'] || null,
          finalDescription?.['Type'] || null,
          finalDescription?.['Lined For Added Warmth'] || null,
          finalDescription?.['Neckline'] || null,
          finalDescription?.['Sleeve Length'] || null,
          finalDescription?.['Sleeve Type'] || null,
          finalDescription?.['Waist Line'] || null,
          finalDescription?.['Hem Shaped'] || null,
          finalDescription?.['Length'] || null,
          finalDescription?.['Fit Type'] || null,
          finalDescription?.['Fabric'] || null,
          finalDescription?.['Material'] || null,
          finalDescription?.['Composition'] || null,
          finalDescription?.['Care Instructions'],
          finalDescription?.['Pockets'] || null,
          finalDescription?.['Body'] || null,
          finalDescription?.['Chest pad'] || null,
          finalDescription?.['Belt'] || null,
          finalDescription?.['Sheer'] || null,
          finalDescription?.['Gender'] || null,
        ],
      );
      const results = await userDataSource.manager.query(
        'INSERT INTO products VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          sku,
          data?.name,
          brand,
          data?.url,
          sku,
          data?.price,
          sku,
          true,
          createdDate,
          createdDate,
          'VishaalC',
          sku,
        ],
      );
      console.log(results);
      console.log(resultsBrand);
      console.log(resultsDescription);
      console.log(resultsSize);
    }
  }
}
