import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Meridian API')
  .setDescription('Education Agency API')
  .setVersion('0.1.0')
  .addBearerAuth()
  .build();
