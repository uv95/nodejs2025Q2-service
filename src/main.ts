import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'node:path';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs/promises';
import * as YAML from 'yaml';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const yamlPath = join(__dirname, '..', 'doc', 'api.yaml');
  const content = await fs.readFile(yamlPath, 'utf8');
  const doc = YAML.parse(content);

  SwaggerModule.setup('doc', app, doc);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/doc`);
  });
}
bootstrap();
