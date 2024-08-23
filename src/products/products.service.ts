import { Injectable } from '@nestjs/common';
import { parse } from 'papaparse';
import { jsonrepair } from 'jsonrepair';
import { userDataSource } from 'src/database/database.providers';
import { productDTO } from './dto/product.dto';

@Injectable()
export class ProductsService {
  async uploadFile(file: Express.Multer.File) {
    const queryRunner = userDataSource.createQueryRunner();
    const createdDate = new Date().toISOString().slice(0, 10);
    const productsTobeUploadedFromRequest = file.buffer.toString();
    const parsedProductsTobeUploaded: any = parse(
      productsTobeUploadedFromRequest,
      {
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
      },
    );
    await queryRunner.startTransaction();
    for (const product of parsedProductsTobeUploaded.data) {
      const sku =
        product?.sku.toLowerCase().replace('sku:', '').trim() + Math.random();
      const brand = product?.brand === '' ? 'Unbrand' : product?.brand;
      try {
        await this.uploadBrand(brand);
        const productId = await this.uploadProducts(
          sku,
          product,
          brand,
          createdDate,
        );
        await this.uploadSize(product, productId, createdDate);
        await this.uploadImage(productId, product, createdDate);
        await this.uploadDescription(productId, product, createdDate);
        return 'Data added successfuly';
      } catch (error) {
        await queryRunner.rollbackTransaction();
      }
    }
  }

  async uploadBrand(brand: string) {
    try {
      await userDataSource.manager.query(
        'INSERT IGNORE INTO brand (brand_name) VALUES (?)',
        [brand],
      );
    } catch (error) {
      throw error;
    }
  }

  async uploadProducts(
    sku: string,
    data: productDTO,
    brand: string,
    createdDate: string,
  ) {
    const productsTableColumns = {
      sku: sku,
      name: data?.name,
      url: data?.url,
      date: createdDate,
      brand_name: brand,
      price: data?.price,
      status: true,
      created_date: createdDate,
      modified_date: createdDate,
      created_by: 'Vishaal',
    };
    const columns = Object.keys(productsTableColumns);
    const values = Object.values(productsTableColumns);
    const questionsMarks = Object.keys(productsTableColumns).map((key) => '?');
    try {
      const uploadProductsResults = await userDataSource.manager.query(
        `INSERT INTO products (${columns}) VALUES(${questionsMarks})`,
        values,
      );
      return uploadProductsResults.insertId;
    } catch (error) {
      throw error;
    }
  }

  async uploadSize(data: productDTO, productId: string, createdDate: string) {
    const size = data?.size.split(',');
    try {
      size.forEach(async (size: string) => {
        await userDataSource.manager.query(
          'INSERT INTO size(product_id, size, status, created_date, modified_date, created_by) VALUES(?, ?, ?, ?, ?, ?)',
          [productId, size, true, createdDate, createdDate, 'Vishaal'],
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(productId: string, data: productDTO, createdDate: string) {
    const imagesArray = await JSON.parse(jsonrepair(data.images));
    try {
      await imagesArray.forEach(async (image: string) => {
        await userDataSource.manager.query(
          'INSERT INTO images(product_id, image_url, status, created_date, modified_date, created_by) VALUES(?, ?, ?, ?, ?, ?)',
          [productId, image, true, createdDate, createdDate, 'Vishaal'],
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadDescription(
    productId: string,
    data: productDTO,
    createdDate: string,
  ) {
    const repairedDescriptionData = await JSON.parse(
      jsonrepair(data?.description),
    );
    let finalDescription;
    repairedDescriptionData.forEach((description: JSON) => {
      finalDescription = { ...finalDescription, ...description };
    });

    const descriptionTableKeys = {
      product_id: productId,
      color: finalDescription?.color || null,
      style: finalDescription?.style || null,
      pattern_type: finalDescription?.['Pattern Type'] || null,
      type: finalDescription?.type || null,
      lined_for_added_warmth:
        finalDescription?.['Lined For Added Warmth'] || null,
      neckline: finalDescription?.['Neckline'] || null,
      sleeve_length: finalDescription?.['Sleeve Length'] || null,
      sleeve_type: finalDescription?.['Sleeve Type'] || null,
      waist_line: finalDescription?.['Waist Line'] || null,
      hem_shaped: finalDescription?.['Hem Shaped'] || null,
      fit_type: finalDescription?.['Fit Type'] || null,
      fabric: finalDescription?.['Fabric'] || null,
      material: finalDescription?.['Material'] || null,
      composition: finalDescription?.['Composition'] || null,
      care_instructions: finalDescription?.['Care Instructions'] || null,
      pockets: finalDescription?.['Pockets'] || null,
      body: finalDescription?.['Body'] || null,
      chest_pad: finalDescription?.['Chest Pad'] || null,
      belt: finalDescription?.['Belt'] || null,
      sheer: finalDescription?.['Sheer'] || null,
      gender: finalDescription?.['Gender'] || null,
      status: true,
      created_date: createdDate,
      modified_date: createdDate,
      created_by: 'Vishaal',
    };
    const descriptionTableColumns = Object.keys(descriptionTableKeys);
    const descriptionTableValues = Object.values(descriptionTableKeys);
    const descriptionTableQuestionMarks = Object.keys(
      descriptionTableColumns,
    ).map((key) => '?');
    try {
      await userDataSource.manager.query(
        `INSERT INTO products_description (${descriptionTableColumns}) VALUES (${descriptionTableQuestionMarks})`,
        descriptionTableValues,
      );
    } catch (error) {
      throw error;
    }
  }
}
