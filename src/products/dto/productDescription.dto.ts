import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class productDescriptionDTO {
  @IsString()
  @IsOptional()
  product_id: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  style: string;

  @IsString()
  @IsOptional()
  pattern_type: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  lined_for_added_warmth: string;

  @IsString()
  @IsOptional()
  neckline: string;

  @IsString()
  @IsOptional()
  sleeve_length: string;

  @IsString()
  @IsOptional()
  sleeve_type: string;

  @IsString()
  @IsOptional()
  waist_line: string;

  @IsString()
  @IsOptional()
  hem_shaped: string;

  @IsString()
  @IsOptional()
  fit_type: string;

  @IsString()
  @IsOptional()
  fabric: string;

  @IsString()
  @IsOptional()
  material: string;

  @IsString()
  @IsOptional()
  composition: string;

  @IsString()
  @IsOptional()
  care_instructions: string;

  @IsString()
  @IsOptional()
  pockets: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  chest_pad: string;

  @IsString()
  @IsOptional()
  belt: string;

  @IsString()
  @IsOptional()
  sheer: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  created_date: string;

  @IsString()
  @IsOptional()
  modified_date: string;

  @IsString()
  @IsOptional()
  created_by: string;
}
