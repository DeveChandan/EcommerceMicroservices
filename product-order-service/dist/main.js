"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const port = configService.get('port') || 8000;
    await app.listen(port, '0.0.0.0');
    console.log(`Product & Order service is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map