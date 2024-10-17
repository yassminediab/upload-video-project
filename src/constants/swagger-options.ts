import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions: any = new DocumentBuilder()
  .setTitle('Herogram')
  .setDescription('Herogram APIS')
  .setVersion('0.0.2')
  .addServer(process.env.LOCAL_APP_URL, 'local_server')
  .addBearerAuth()
  .build();
