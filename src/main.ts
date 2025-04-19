// main.ts
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { setupSwagger } from './common/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  logger.log('🚧 Iniciando processo de inicialização...');
  try {
    logger.log('🔨 Criando instância da aplicação...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
      bufferLogs: true,
    });
    logger.log('✅ Aplicação criada com sucesso');

    logger.log('⚙️ Configurando ValidationPipe...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // 3. Configuração de CORS
    const configService = app.get(ConfigService);
    const environment = configService.get<string>('NODE_ENV', 'development');

    logger.log(`🌍 Ambiente detectado: ${environment}`);
    app.enableCors({
      origin: environment === 'production' ? configService.get<string>('CORS_ORIGIN', '*') : '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    });

    // 4. Swagger (Apenas desenvolvimento)
    if (environment !== 'production') {
      logger.log('📄 Configurando Swagger...');
      setupSwagger(app);
    }

    // 5. Configuração de Porta
    const port = configService.get<number>('PORT', 3000);
    logger.log(`🔌 Tentando iniciar na porta ${port}...`);

    // 6. Inicialização do Servidor
    await app.listen(port);
    logger.log(`🚀 Aplicação iniciada com sucesso!`);
    logger.log(`👉 URL Local: http://localhost:${port}`);
  } catch (error: unknown) {
    logger.error('❌ Falha crítica durante a inicialização');
    if (error instanceof Error) {
      logger.error(`📌 Erro: ${error.message}`, error.stack);
    } else {
      logger.error('💣 Erro desconhecido:', error);
    }
    process.exit(1);
  }
}

void bootstrap();
