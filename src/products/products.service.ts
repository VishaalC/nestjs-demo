import { Injectable, NotFoundException } from '@nestjs/common';
import { parse } from 'papaparse';
import { jsonrepair } from 'jsonrepair';
import { userDataSource } from 'src/database/database.providers';
import { productDTO } from './dto/product.dto';
import logger, { metaLogFormatter } from 'logger/winston.logger';
import { productDescriptionDTO } from './dto/productDescription.dto';

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
      } catch (error) {
        logger.error('UploadFile: Internal Server Error', {
          meta: metaLogFormatter(
            'ND-UF-100',
            `${error}`,
            `${error.status}`,
            '/upload',
            null,
          ),
        });
        await queryRunner.rollbackTransaction();
        throw error;
      }
    }
    return 'Data added successfuly';
  }

  async uploadBrand(brand: string) {
    try {
      let response = await userDataSource.manager.query(
        'INSERT IGNORE INTO brand (brand_name) VALUES (?)',
        [brand],
      );
    } catch (error) {
      logger.error('UPLOAD BRAND: Internal server error', {
        meta: metaLogFormatter(
          'ND-UB-200',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
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
      logger.error('UPLOAD PRODUCTS: Internal server error', {
        meta: metaLogFormatter(
          'ND-UP-300',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
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
      logger.error('UPLOAD SIZE: Internal server error', {
        meta: metaLogFormatter(
          'ND-US-300',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
      throw error;
    }
  }

  async uploadImage(productId: string, data: productDTO, createdDate: string) {
    try {
      const imagesArray = await JSON.parse(jsonrepair(data.images));
      await imagesArray.forEach(async (image: string) => {
        await userDataSource.manager.query(
          'INSERT INTO images(product_id, image_url, status, created_date, modified_date, created_by) VALUES(?, ?, ?, ?, ?, ?)',
          [productId, image, true, createdDate, createdDate, 'Vishaal'],
        );
      });
    } catch (error) {
      logger.error('UPLOAD Image: Internal server error', {
        meta: metaLogFormatter(
          'ND-UI-400',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
      throw error;
    }
  }

  async uploadDescription(
    productId: string,
    data: productDTO,
    createdDate: string,
  ) {
    let repairedDescriptionData;
    try {
      repairedDescriptionData = await JSON.parse(jsonrepair(data?.description));
    } catch (error) {
      logger.error('UPLOAD DESCRIPTION: Internal server error', {
        meta: metaLogFormatter(
          'ND-UD-501',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
      throw error;
    }
    let finalDescription: any;
    repairedDescriptionData.forEach((description: Object) => {
      finalDescription = { ...finalDescription, ...description };
    });
    finalDescription = Object.fromEntries(
      Object.entries(finalDescription).map(([k, v]) => [k.toLowerCase(), v]),
    );

    const descriptionTableKeys = {
      product_id: productId,
      color: finalDescription?.color || null,
      style: finalDescription?.style || null,
      pattern_type: finalDescription?.['pattern type'] || null,
      type: finalDescription?.type || null,
      lined_for_added_warmth:
        finalDescription?.['lined for added warmth'] || null,
      neckline: finalDescription?.['neckline'] || null,
      sleeve_length: finalDescription?.['sleeve length'] || null,
      sleeve_type: finalDescription?.['sleeve type'] || null,
      waist_line: finalDescription?.['waist line'] || null,
      hem_shaped: finalDescription?.['hem shaped'] || null,
      fit_type: finalDescription?.['fit type'] || null,
      fabric: finalDescription?.['fabric'] || null,
      material: finalDescription?.['material'] || null,
      composition: finalDescription?.['composition'] || null,
      care_instructions: finalDescription?.['care instructions'] || null,
      pockets: finalDescription?.['pockets'] || null,
      body: finalDescription?.['body'] || null,
      chest_pad: finalDescription?.['chest pad'] || null,
      belt: finalDescription?.['belt'] || null,
      sheer: finalDescription?.['sheer'] || null,
      gender: finalDescription?.['gender'] || null,
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
      logger.error('UPLOAD DESCRIPTION: Internal server error', {
        meta: metaLogFormatter(
          'ND-UD-500',
          `${error}`,
          `${error.status}`,
          '/upload',
          null,
        ),
      });
      throw error;
    }
  }

  async getRevenueByBrand() {
    try {
      const brandRevenue = await userDataSource.manager.query(
        `SELECT brand.brand_name, SUM(CAST(substr(joined_table.price, 2) AS DECIMAL(10, 3))) AS total_price FROM brand
         INNER JOIN products joined_table ON brand.brand_name = joined_table.brand_name
         GROUP BY (brand.brand_name)
         ORDER BY (total_price) DESC;`,
      );
      if (brandRevenue.length == 0) {
        throw new NotFoundException();
      } else {
        return brandRevenue;
      }
    } catch (error) {
      logger.error('UPLOAD BRAND: Internal server error', {
        meta: metaLogFormatter(
          'ND--GRB-100',
          `${error}`,
          `${error.status}`,
          '/getRevenueByBrand',
          null,
        ),
      });
      throw error;
    }
  }

  async popularProductsByBrand() {
    try {
      const popularProductsByBrand = await userDataSource.manager.query(
        `SELECT brand.brand_name, COUNT(joined_table.brand_name) AS product_count FROM brand
         INNER JOIN products joined_table ON brand.brand_name = joined_table.brand_name
        GROUP BY (brand.brand_name)
        ORDER BY (product_count) DESC;`,
      );
      if (popularProductsByBrand.length == 0) {
        return new NotFoundException();
      } else {
        return popularProductsByBrand;
      }
    } catch (error) {
      logger.error('popularProductsByBrand: Internal server error', {
        meta: metaLogFormatter(
          'ND--PPBB-100',
          `${error}`,
          `${error.status}`,
          '/popularProductsByBrand',
          null,
        ),
      });
      throw error;
    }
  }

  async maxPriceProduct() {
    try {
      const maxPriceProduct = await userDataSource.manager.query(
        `SELECT brand.brand_name, MAX(CAST(substr(joined_table.price, 2) AS DECIMAL(10, 3))) AS max_price FROM brand
          INNER JOIN products joined_table ON brand.brand_name = joined_table.brand_name
          GROUP BY (brand.brand_name)
          ORDER BY (max_price) DESC;`,
      );
      if (maxPriceProduct.length == 0) {
        throw new NotFoundException();
      } else {
        return maxPriceProduct;
      }
    } catch (error) {
      logger.error('maxPriceProduct: Internal Server Error', {
        meta: metaLogFormatter(
          'ND--MPP-100',
          `${error}`,
          `${error.status}`,
          '/maxPriceProduct',
          null,
        ),
      });
      throw error;
    }
  }

  async popularSizesPerBrand() {
    try {
      const popularSizesPerBrand = await userDataSource.manager.query(
        `SELECT size, brand_name, COUNT(size) AS size_count FROM products
         INNER JOIN size joined_table ON products.product_id = joined_table.product_id
         GROUP BY size, brand_name;
        `,
      );
      if (popularSizesPerBrand.length == 0) {
        return new NotFoundException();
      } else {
        return popularSizesPerBrand;
      }
    } catch (error) {
      logger.error('popularSizesPerBrand: Internal Server Error', {
        meta: metaLogFormatter(
          'ND-PPPB-100',
          `${error}`,
          `${error.status}`,
          '/popularSizesPerBrand',
          null,
        ),
      });
      throw error;
    }
  }

  async searchProductByColorAndGender(color: string, gender: string) {
    try {
      const searchResults = await userDataSource.manager.query(
        `SELECT name, color, gender FROM products
          INNER JOIN products_description joined_table ON products.product_id = joined_table.product_id
          WHERE color =(?) AND gender =(?) ;`,
        [color, gender],
      );
      if (searchResults.length == 0) {
        throw new NotFoundException();
      } else {
        return searchResults;
      }
    } catch (error) {
      logger.error('searchProductByColorAndGender: Internal Server Error', {
        meta: metaLogFormatter(
          'ND-PPPB-100',
          `${error}`,
          `${error.status}`,
          '/popularSizesPerBrand',
          null,
        ),
      });
      throw error;
    }
  }

  async searchProductBetweenRange(
    fitType: string,
    material: string,
    start: string,
    end: string,
  ) {
    try {
      const searchResults = await userDataSource.manager.query(
        `SELECT fit_type, material, CAST(substr(joined_table.price, 2) AS DECIMAL(10, 3)) AS result
         FROM products_description
         INNER JOIN products joined_table ON joined_table.product_id = products_description.product_id
         WHERE (fit_type=(?) AND material=(?)) HAVING result BETWEEN (?) AND (?);`,
        [fitType, material, start, end],
      );
      if (searchResults.length == 0) {
        throw new NotFoundException();
      } else {
        return searchResults;
      }
    } catch (error) {
      logger.error('searchProductBetweenRange: Internal Server Error', {
        meta: metaLogFormatter(
          'ND-PPPB-100',
          `${error}`,
          `${error.status}`,
          '/popularSizesPerBrand',
          null,
        ),
      });
      throw error;
    }
  }
}
