/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	/**
	 * @param {boolean=} fromUpdate true when called from update
	 */
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(36);
const common_1 = __webpack_require__(6);
const compression = __webpack_require__(159);
const cookieParser = __webpack_require__(160);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('DaiQuanGia API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT_SERVER || 3000, "0.0.0.0");
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const users_module_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(86);
const mailer_module_1 = __webpack_require__(98);
const seed_module_1 = __webpack_require__(100);
const role_module_1 = __webpack_require__(79);
const admin_module_1 = __webpack_require__(73);
const cloudinary_module_1 = __webpack_require__(56);
const category_module_1 = __webpack_require__(57);
const spendinglimit_module_1 = __webpack_require__(61);
const spendingnote_module_1 = __webpack_require__(66);
const incomenote_module_1 = __webpack_require__(101);
const encryption_module_1 = __webpack_require__(85);
const debt_module_1 = __webpack_require__(110);
const schedule_module_1 = __webpack_require__(116);
const app_controller_1 = __webpack_require__(121);
const rank_module_1 = __webpack_require__(122);
const post_module_1 = __webpack_require__(125);
const comment_module_1 = __webpack_require__(132);
const report_module_1 = __webpack_require__(136);
const statistics_module_1 = __webpack_require__(141);
const event_gateway_1 = __webpack_require__(145);
const story_module_1 = __webpack_require__(153);
const message_module_1 = __webpack_require__(157);
const redis_module_1 = __webpack_require__(65);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            mailer_module_1.MailerModule,
            seed_module_1.SeedModule,
            role_module_1.RoleModule,
            admin_module_1.AdminModule,
            cloudinary_module_1.CloudinaryModule,
            category_module_1.CategoryModule,
            spendinglimit_module_1.SpendingLimitModule,
            spendingnote_module_1.SpendingNoteModule,
            incomenote_module_1.IncomenoteModule,
            encryption_module_1.EncryptionModule,
            debt_module_1.DebtModule,
            schedule_module_1.ScheduleModule,
            rank_module_1.RankModule,
            post_module_1.PostModule,
            comment_module_1.CommentModule,
            report_module_1.ReportModule,
            statistics_module_1.StatisticsModule,
            story_module_1.StoryModule,
            message_module_1.MessageModule,
            redis_module_1.RedisCacheModule,
        ],
        controllers: [
            app_controller_1.AppController
        ],
        providers: [
            event_gateway_1.EventGateway
        ],
    })
], AppModule);


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/mongoose");

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(6);
const users_controller_1 = __webpack_require__(10);
const users_service_1 = __webpack_require__(11);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(13);
const config_1 = __webpack_require__(8);
const cloudinary_module_1 = __webpack_require__(56);
const abilities_factory_1 = __webpack_require__(40);
const category_module_1 = __webpack_require__(57);
const admin_module_1 = __webpack_require__(73);
const encryption_module_1 = __webpack_require__(85);
const rank_schema_1 = __webpack_require__(33);
const redis_module_1 = __webpack_require__(65);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => encryption_module_1.EncryptionModule),
            admin_module_1.AdminModule,
            redis_module_1.RedisCacheModule,
            category_module_1.CategoryModule,
            cloudinary_module_1.CloudinaryModule,
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }, { name: rank_schema_1.Rank.name, schema: rank_schema_1.RankSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, abilities_factory_1.AbilityFactory],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(11);
const auth_gaurd_1 = __webpack_require__(34);
const swagger_1 = __webpack_require__(36);
const jwt = __webpack_require__(37);
const platform_express_1 = __webpack_require__(38);
const cloudinary_service_1 = __webpack_require__(14);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
const express_1 = __webpack_require__(47);
const index_1 = __webpack_require__(48);
const member_gaurd_1 = __webpack_require__(55);
let UsersController = class UsersController {
    constructor(usersService, cloudinaryService) {
        this.usersService = usersService;
        this.cloudinaryService = cloudinaryService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async findAllController() {
        return this.usersService.listUserService();
    }
    async viewProfileByIdController(userId) {
        const data = await this.usersService.viewProfileService(userId);
        return { data };
    }
    async viewProfileController(request) {
        const userId = this.getUserIdFromToken(request);
        const data = await this.usersService.viewProfileService(userId);
        return { data };
    }
    async updateProfileController(request, updateUserDto) {
        const userId = this.getUserIdFromToken(request);
        const { firstname, lastname, email, dateOfBirth, address, gender, phone, nickname, description, hyperlink, } = updateUserDto;
        await this.usersService.updateUserProfileService(userId, firstname, lastname, email, dateOfBirth, address, gender, phone, nickname, description, hyperlink);
        return { message: 'User profile updated successfully' };
    }
    async updateAvatarController(request, file) {
        const userId = this.getUserIdFromToken(request);
        const fileResult = await this.cloudinaryService.uploadImageService(userId.toString(), file);
        await this.usersService.updateAvatarService(userId, fileResult.uploadResult.url);
        return { message: 'Avatar updated successfully' };
    }
    async searchUserController(request) {
        const searchKey = request.query.searchKey;
        const data = await this.usersService.searchUserService(searchKey);
        return { data };
    }
    async searchUserForUserController(request) {
        const searchKey = request.query.searchKey;
        const data = await this.usersService.searchUserService(searchKey);
        return { data };
    }
    async blockUserController(blockUserDto) {
        await this.usersService.blockUserService(blockUserDto._id, blockUserDto.isBlock);
        return { message: 'update block user successfully' };
    }
    async deleteUserController(deleteUserDto) {
        await this.usersService.deleteUserService(deleteUserDto._id);
        return { message: 'delete user successfully' };
    }
    async attendanceUserController(request) {
        const userId = this.getUserIdFromToken(request);
        return await this.usersService.attendanceService(userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('user'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all users' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, common_1.Get)('list-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllController", null);
__decorate([
    (0, common_1.Get)('view-profile/:userId'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get user by id' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'User not found' }),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UsersController.prototype, "viewProfileByIdController", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Get user by id' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'User not found' }),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, common_1.Get)('view-profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UsersController.prototype, "viewProfileController", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Update success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'User not found' }),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, common_1.Put)('update-profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, typeof (_g = typeof index_1.UpdateUserProfileDto !== "undefined" && index_1.UpdateUserProfileDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], UsersController.prototype, "updateProfileController", null);
__decorate([
    (0, common_1.Patch)('update-avatar'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, swagger_1.ApiOkResponse)({ description: 'Update avatar success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bab Request' }),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object, typeof (_l = typeof Express !== "undefined" && (_k = Express.Multer) !== void 0 && _k.File) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], UsersController.prototype, "updateAvatarController", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('user'),
    (0, swagger_1.ApiOkResponse)({ description: 'Search user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, swagger_1.ApiQuery)({
        name: 'searchKey',
        required: true,
        type: String,
        description: 'The search key',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], UsersController.prototype, "searchUserController", null);
__decorate([
    (0, common_1.Get)('search-user'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Search for user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Search user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, swagger_1.ApiQuery)({
        name: 'searchKey',
        required: true,
        type: String,
        description: 'The search key',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], UsersController.prototype, "searchUserForUserController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('block'),
    (0, casl_decorator_1.Subject)('user'),
    (0, common_1.Patch)('update-block-user'),
    (0, swagger_1.ApiOkResponse)({ description: 'Block user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof index_1.BlockUserDto !== "undefined" && index_1.BlockUserDto) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], UsersController.prototype, "blockUserController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('delete'),
    (0, casl_decorator_1.Subject)('user'),
    (0, common_1.Delete)('delete-user'),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof index_1.DeleteUserDto !== "undefined" && index_1.DeleteUserDto) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], UsersController.prototype, "deleteUserController", null);
__decorate([
    (0, common_1.Patch)('attendance-user'),
    (0, swagger_1.ApiOkResponse)({ description: 'Attendance user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], UsersController.prototype, "attendanceUserController", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object])
], UsersController);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(13);
const cloudinary_service_1 = __webpack_require__(14);
const remove_accents_1 = __webpack_require__(22);
const category_service_1 = __webpack_require__(23);
const encryption_service_1 = __webpack_require__(31);
const rank_schema_1 = __webpack_require__(33);
const redis_service_1 = __webpack_require__(27);
let UsersService = class UsersService {
    constructor(cloudinaryService, userModel, rankModel, categoryService, encryptionService, redisService) {
        this.cloudinaryService = cloudinaryService;
        this.userModel = userModel;
        this.rankModel = rankModel;
        this.categoryService = categoryService;
        this.encryptionService = encryptionService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async getCache(key) {
        const cachedData = await this.redisService.getJSON(key, '$');
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return null;
    }
    async findOneEmailOrUsernameService(account) {
        const cacheKey = `user:${account}`;
        const cachedUser = await this.getCache(cacheKey);
        if (cachedUser) {
            console.log('cachedUser');
            return cachedUser;
        }
        const user = await this.userModel
            .findOne({
            $or: [{ email: account }, { username: account }],
        })
            .exec();
        if (user) {
            await this.setCache(cacheKey, user);
        }
        return user;
    }
    async findOneUsernameService(username) {
        return this.findOneEmailOrUsernameService(username);
    }
    async findOneUserForMessageService(userId) {
        const cacheKey = `user:${userId}:message`;
        const cachedUser = await this.getCache(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        const user = await this.userModel
            .findOne({ _id: userId })
            .select('firstname avatar lastname')
            .exec();
        if (user) {
            await this.setCache(cacheKey, user);
        }
        return user;
    }
    async findOneReTokenService(refreshToken) {
        const user = await this.userModel.findOne({ refreshToken }).exec();
        return user;
    }
    async findOneCodeService(Code) {
        const user = await this.userModel.findOne({ 'authCode.code': Code }).exec();
        return user;
    }
    async updatePasswordService(code, newPassword) {
        const user = await this.findOneCodeService(code);
        if (!user) {
            return null;
        }
        const encryptKey = user.encryptKey;
        const decryptKey = this.encryptionService.decryptEncryptKey(encryptKey, user.password);
        const newEncryptKey = this.encryptionService.updateEncryptKey(newPassword, decryptKey);
        user.encryptKey = newEncryptKey;
        user.password = newPassword;
        user.authCode = null;
        await user.save();
        await this.deleteCache(`user:${user.email}`);
        await this.deleteCache(`user:username:${user.username}`);
        return user;
    }
    async listUserService() {
        const cacheKey = `users:list`;
        const cachedUsers = await this.getCache(cacheKey);
        if (cachedUsers) {
            return cachedUsers;
        }
        const users = await this.userModel
            .find()
            .select('firstname avatar lastname email dateOfBirth address gender phone nickname description hyperlink createdAt status isBlock')
            .exec();
        if (users) {
            await this.setCache(cacheKey, users);
        }
        return users;
    }
    async updateRefreshTokenService(account, refreshToken) {
        const user = await this.userModel
            .findOneAndUpdate({ $or: [{ email: account }, { username: account }] }, { refreshToken }, { new: true })
            .exec();
        if (user) {
            await this.deleteCache(`user:${account}`);
            await this.deleteCache(`user:${user._id}:profile`);
        }
        return user;
    }
    async updateCodeService(email, authCode, expiredCode) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        user.authCode = {
            code: authCode,
            expiredAt: expiredCode,
        };
        await user.save();
        await this.deleteCache(`user:authCode:${authCode}`);
        await this.deleteCache(`user:${user._id}:profile`);
        return user;
    }
    async createUserService(email, password, username, firstname, lastname, refreshToken) {
        const userExist = await this.userModel
            .findOne({
            $or: [{ email: email }, { username: username }],
        })
            .exec();
        if (userExist) {
            return { message: 'Email or username already exists' };
        }
        const createEncryptKey = this.encryptionService.createEncryptKey(password.toString());
        const newUser = new this.userModel({
            email,
            password,
            username,
            firstname,
            lastname,
            encryptKey: createEncryptKey,
            refreshToken,
        });
        const savedUser = await newUser.save();
        await this.deleteCache(`user:${email}`);
        await this.deleteCache(`user:username:${username}`);
        await this.deleteCache(`users:list`);
        return savedUser;
    }
    async viewProfileService(_id) {
        const cacheKey = `user:${_id}:profile`;
        const cachedUser = await this.getCache(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        const user = await this.userModel
            .findOne({ _id })
            .select('email role _id avatar firstname lastname address dateOfBirth description gender hyperlink nickname phone createdAt rankID rankScore')
            .populate('rankID', '-score -rankScoreGoal')
            .exec();
        if (user) {
            await this.setCache(cacheKey, user);
        }
        return user;
    }
    async updateUserProfileService(_id, firstname, lastname, email, dateOfBirth, address, gender, phone, nickname, description, hyperlink) {
        const updatedUser = await this.userModel
            .findOneAndUpdate({ _id }, {
            firstname,
            lastname,
            email,
            dateOfBirth,
            address,
            gender,
            phone,
            nickname,
            description,
            hyperlink,
        }, { new: true })
            .exec();
        if (updatedUser) {
            await this.deleteCache(`user:${_id}:profile`);
            await this.deleteCache(`user:${updatedUser.email}`);
            await this.deleteCache(`user:username:${updatedUser.username}`);
            await this.deleteCache(`users:list`);
        }
        return updatedUser;
    }
    async updateAvatarService(_id, avatar) {
        const user = await this.userModel.findOne({ _id }).exec();
        const deleteAvatar = this.cloudinaryService.deleteMediaService(user.avatar);
        if (!deleteAvatar) {
            return null;
        }
        const updatedUser = await this.userModel
            .findOneAndUpdate({ _id }, { avatar }, { new: true })
            .exec();
        if (updatedUser) {
            await this.deleteCache(`user:${_id}:profile`);
            await this.deleteCache(`users:list`);
            await this.deleteCache(`posts:user:${_id}`);
        }
        return updatedUser;
    }
    async searchUserService(searchKey) {
        try {
            const users = await this.userModel.find({}, { password: 0 }).exec();
            const preprocessString = (str) => str
                ? (0, remove_accents_1.remove)(str)
                    .replace(/[^a-zA-Z0-9\s]/gi, '')
                    .trim()
                    .toLowerCase()
                : '';
            const preprocessedSearchKey = preprocessString(searchKey);
            const regex = new RegExp(`${preprocessedSearchKey}`, 'i');
            const matchedUsers = users.filter((user) => {
                const { username, firstname, lastname, email } = user;
                const fullname = `${firstname} ${lastname}`;
                const [preprocessedUsername, preprocessedFullname, preprocessedEmail] = [username, fullname, email].map((field) => preprocessString(field));
                return (regex.test(preprocessedUsername) ||
                    regex.test(preprocessedFullname) ||
                    regex.test(preprocessedEmail));
            });
            if (matchedUsers.length > 0) {
                return {
                    message: `Found ${matchedUsers.length} user(s)`,
                    user: matchedUsers,
                };
            }
            return { message: 'No user found', user: [] };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async blockUserService(_id, isBlock) {
        const updatedUser = await this.userModel
            .findOneAndUpdate({ _id }, { isBlock }, { new: true })
            .exec();
        if (updatedUser) {
            await this.deleteCache(`user:${_id}:profile`);
            await this.deleteCache(`users:list`);
            this.deleteCache(`user:${updatedUser.email}`);
            this.deleteCache(`user:${updatedUser.username}`);
        }
        return updatedUser;
    }
    async deleteUserService(_id) {
        const user = await this.userModel.findById(_id).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.categoryService.deleteOfUser(_id);
        const deletedUser = await this.userModel.findOneAndDelete({ _id }).exec();
        if (deletedUser) {
            this.deleteCache(`user:${_id}:profile`);
            this.deleteCache(`user:${deletedUser.email}`);
            this.deleteCache(`user:username:${deletedUser.username}`);
            this.deleteCache(`users:list`);
        }
        return deletedUser;
    }
    async findUserByIdService(userId) {
        const cacheKey = `user:${userId}`;
        const cachedUser = await this.getCache(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (user) {
            await this.setCache(cacheKey, user);
        }
        return user;
    }
    async updateScoreRankService(userId, blogScore, commentScore, likeScore) {
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.rankScore) {
            user.rankScore = {
                attendance: {
                    attendanceScore: 0,
                    dateAttendance: null,
                },
                numberOfBlog: 0,
                numberOfComment: 0,
                numberOfLike: 0,
            };
        }
        if (blogScore === true) {
            user.rankScore.numberOfBlog += 1;
        }
        if (commentScore === true) {
            user.rankScore.numberOfComment += 1;
        }
        if (likeScore === true) {
            user.rankScore.numberOfLike += 1;
        }
        await this.checkRankService(userId);
        await user.save();
        await this.deleteCache(`user:${userId}`);
        await this.deleteCache(`user:${userId}:profile`);
        await this.deleteCache(`user:list`);
        return user;
    }
    async attendanceService(userId) {
        console.log(userId);
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.rankScore) {
            user.rankScore = {
                attendance: {
                    attendanceScore: 1,
                    dateAttendance: new Date(),
                },
                numberOfBlog: 0,
                numberOfComment: 0,
                numberOfLike: 0,
            };
            await user.save();
            await this.deleteCache(`user:${userId}`);
            await this.deleteCache(`user:${userId}:profile`);
            await this.deleteCache(`user:list`);
            return { message: 'Attendance marked successfully' };
        }
        const today = new Date();
        if (user.rankScore.attendance.dateAttendance) {
            const lastAttendanceDate = new Date(user.rankScore.attendance.dateAttendance);
            if (today.setHours(0, 0, 0, 0) === lastAttendanceDate.setHours(0, 0, 0, 0)) {
                throw new common_1.BadRequestException('You have already marked attendance today.');
            }
        }
        user.rankScore.attendance.attendanceScore += 1;
        user.rankScore.attendance.dateAttendance = new Date();
        await user.save();
        await this.deleteCache(`user:${userId}`);
        await this.deleteCache(`user:${userId}:profile`);
        await this.deleteCache(`user:list`);
        return { message: 'Attendance marked successfully' };
    }
    async checkRankService(userId) {
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!user.rankScore) {
            user.rankScore = {
                attendance: {
                    attendanceScore: 0,
                    dateAttendance: new Date(),
                },
                numberOfBlog: 0,
                numberOfComment: 0,
                numberOfLike: 0,
            };
        }
        const ranks = await this.rankModel.find().exec();
        if (!ranks || ranks.length === 0) {
            throw new common_1.BadRequestException('No ranks found');
        }
        let highestRank = null;
        for (const rank of ranks) {
            if (user.rankScore.attendance.attendanceScore >=
                rank.score.attendanceScore &&
                user.rankScore.numberOfComment >= rank.score.numberOfComment &&
                user.rankScore.numberOfBlog >= rank.score.numberOfBlog &&
                user.rankScore.numberOfLike >= rank.score.numberOfLike) {
                if (!highestRank || rank.rankScoreGoal > highestRank.rankScoreGoal) {
                    highestRank = rank;
                }
            }
        }
        if (highestRank) {
            user.rankID = highestRank._id;
            await user.save();
            await this.deleteCache(`user:${userId}`);
            await this.deleteCache(`user:list`);
        }
        return true;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(rank_schema_1.Rank.name)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => encryption_service_1.EncryptionService))),
    __metadata("design:paramtypes", [typeof (_a = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _d : Object, typeof (_e = typeof encryption_service_1.EncryptionService !== "undefined" && encryption_service_1.EncryptionService) === "function" ? _e : Object, typeof (_f = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _f : Object])
], UsersService);


/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Array }),
    __metadata("design:type", Array)
], User.prototype, "hyperlink", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_3.default.Schema.Types.String,
        default: 'member',
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_3.default.Schema.Types.String,
        default: 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg',
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            code: { type: String },
            expiredAt: { type: Date },
        },
        default: null,
    }),
    __metadata("design:type", Object)
], User.prototype, "authCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_3.default.Schema.Types.String,
        enum: ['active', 'inactive'],
        default: 'active',
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isBlock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, default: null }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, reuired: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, default: null, ref: 'Rank' }),
    __metadata("design:type", String)
], User.prototype, "rankID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, }),
    __metadata("design:type", String)
], User.prototype, "encryptKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            attendance: {
                attendanceScore: { type: mongoose_3.default.Schema.Types.Number, default: 0 },
                dateAttendance: { type: mongoose_3.default.Schema.Types.Date, default: null },
            },
            numberOfComment: { type: mongoose_3.default.Schema.Types.Number, default: 0 },
            numberOfBlog: { type: mongoose_3.default.Schema.Types.Number, default: 0 },
            numberOfLike: { type: mongoose_3.default.Schema.Types.Number, default: 0 },
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "rankScore", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryService = void 0;
const common_1 = __webpack_require__(6);
const cloudinary_1 = __webpack_require__(15);
const streamifier = __webpack_require__(16);
const ffmpeg = __webpack_require__(17);
const ffmpegPath = __webpack_require__(18);
const ffprobePath = __webpack_require__(19);
const path_1 = __webpack_require__(20);
const fs_1 = __webpack_require__(21);
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        ffmpeg.setFfmpegPath(ffmpegPath.path);
        ffmpeg.setFfprobePath(ffprobePath.path);
    }
    async uploadFile(file, options) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    validateFile(file, type, maxSizeMB = 100) {
        if (!file.mimetype.startsWith(type + '/')) {
            throw new common_1.BadRequestException(`File is not a ${type}.`);
        }
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSizeMB) {
            throw new common_1.BadRequestException(`File size exceeds the ${maxSizeMB}MB limit.`);
        }
    }
    async uploadImageService(imageName, file) {
        const timestamp = new Date();
        this.validateFile(file, 'image');
        const normalizedImageName = imageName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const newImageName = normalizedImageName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 25);
        const publicId = `daitongquan/images/${newImageName}-${timestamp.getTime()}`;
        const uploadResult = await this.uploadFile(file, { public_id: publicId });
        return { uploadResult };
    }
    async uploadVideoService(videoName, file) {
        this.validateFile(file, 'video');
        const publicId = `daitongquan/videos/${videoName}`;
        const uploadResult = await this.uploadFile(file, { public_id: publicId, resource_type: 'video' });
        const thumbnailPath = await this.extractFirstFrame(file);
        const thumbnailBuffer = (0, fs_1.readFileSync)(thumbnailPath);
        const thumbnailPublicId = `daitongquan/videos/thumbnails/${videoName}`;
        const thumbnailResult = await this.uploadFile({ buffer: thumbnailBuffer, mimetype: 'image/png' }, { public_id: thumbnailPublicId, resource_type: 'image' });
        (0, fs_1.unlinkSync)(thumbnailPath);
        return { uploadResult, thumbnailResult };
    }
    extractFirstFrame(file) {
        return new Promise((resolve, reject) => {
            const tmpDir = (0, path_1.join)(__dirname, 'tmp');
            if (!(0, fs_1.existsSync)(tmpDir)) {
                (0, fs_1.mkdirSync)(tmpDir);
            }
            const thumbnailPath = (0, path_1.join)(tmpDir, `${file.originalname}-thumbnail.png`);
            const tempVideoPath = (0, path_1.join)(tmpDir, `${file.originalname}`);
            (0, fs_1.writeFileSync)(tempVideoPath, file.buffer);
            ffmpeg(tempVideoPath)
                .on('end', () => {
                console.log('Thumbnail extraction completed:', thumbnailPath);
                (0, fs_1.unlinkSync)(tempVideoPath);
                resolve(thumbnailPath);
            })
                .on('error', (err) => {
                console.error('ffmpeg error:', err);
                (0, fs_1.unlinkSync)(tempVideoPath);
                reject(new common_1.BadRequestException('Failed to extract thumbnail'));
            })
                .screenshots({
                timestamps: ['00:00:01.000'],
                folder: tmpDir,
                filename: `${file.originalname}-thumbnail.png`,
            });
        });
    }
    async deleteMediaService(url) {
        const publicId = url.split('/upload/')[1].split('.')[0];
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async deleteManyImagesService(urls) {
        await Promise.all(urls.map((url) => this.deleteMediaService(url)));
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);


/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";
module.exports = require("cloudinary");

/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("streamifier");

/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("fluent-ffmpeg");

/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("@ffmpeg-installer/ffmpeg");

/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("@ffprobe-installer/ffprobe");

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 21 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 22 */
/***/ ((module) => {

"use strict";
module.exports = require("remove-accents");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const category_schema_1 = __webpack_require__(24);
const spendinglimit_service_1 = __webpack_require__(25);
const spendingnote_service_1 = __webpack_require__(29);
const redis_service_1 = __webpack_require__(27);
let CategoryService = class CategoryService {
    constructor(CategoryModel, spendingLimitService, spendingNoteService, redisService) {
        this.CategoryModel = CategoryModel;
        this.spendingLimitService = spendingLimitService;
        this.spendingNoteService = spendingNoteService;
        this.redisService = redisService;
    }
    async deleteCache(userId, key) {
        await this.redisService.delJSON(`categories:${userId}:${key}`, '$');
    }
    async setCache(userId, key, data) {
        await this.redisService.setJSON(`categories:${userId}:${key}`, '$', JSON.stringify(data));
    }
    async deleteOfUser(userId) {
        const result = await this.CategoryModel.deleteMany({ userId }).exec();
        await this.deleteCache(userId, 'all');
        return result;
    }
    async createCateService(userId, name, type, icon, color, status, description) {
        const newCate = new this.CategoryModel({
            userId,
            name,
            type,
            icon,
            color,
            status,
            description: description || '',
        });
        const result = await newCate.save();
        await this.deleteCache(userId, 'all');
        await this.deleteCache(result.userId, 'income');
        await this.deleteCache(result.userId, 'spend');
        return result;
    }
    async updateCateService(userId, cateId, name, description, icon, color, status) {
        const result = await this.CategoryModel.findOneAndUpdate({ userId, _id: cateId }, { name, description, icon, color, status }, { new: true });
        if (result) {
            await this.deleteCache(userId, cateId);
            await this.deleteCache(userId, 'all');
            await this.deleteCache(result.userId, 'income');
            await this.deleteCache(result.userId, 'spend');
        }
        return result;
    }
    async deleteCateService(userId, cateId) {
        const cate = await this.CategoryModel.findOne({ userId, _id: cateId });
        const checkExistSpendingNote = await this.spendingNoteService.findSpendingNoteByCateIdService(cateId);
        if (checkExistSpendingNote.length > 0) {
            throw new common_1.NotFoundException('Category has spending note');
        }
        if (!cate) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.CategoryModel.deleteOne({ userId, _id: cateId });
        await this.deleteCache(userId, cateId);
        await this.deleteCache(userId, 'all');
        await this.deleteCache(userId, 'income');
        await this.deleteCache(userId, 'spend');
        return { message: 'Delete category successfully' };
    }
    async viewCateService(userId) {
        const cachedCategories = await this.redisService.getJSON(`categories:${userId}:all`, '$');
        if (cachedCategories) {
            console.log('Have cached categories');
            return cachedCategories;
        }
        console.log('Not cached categories');
        const result = await this.CategoryModel.find({ userId }).exec();
        await this.setCache(userId, 'all', result);
        return result;
    }
    async updateSpendingLimitIdService(cateId, spendingLimitId) {
        const updatedCate = await this.CategoryModel.findOneAndUpdate({ _id: cateId }, { spendingLimitId }, { new: true });
        if (!updatedCate) {
            throw new common_1.NotFoundException(`SpendingCate with ID ${cateId} not found`);
        }
        await this.deleteCache(updatedCate.userId, cateId);
        await this.deleteCache(updatedCate.userId, 'all');
        await this.deleteCache(updatedCate.userId, 'income');
        await this.deleteCache(updatedCate.userId, 'spend');
        return updatedCate;
    }
    async deleteSpendingLimitIdService(spendingLimitId) {
        const result = await this.CategoryModel.updateMany({ spendingLimitId }, { spendingLimitId: null });
        if (result.modifiedCount === 0) {
            throw new common_1.NotFoundException(`No SpendingCate with spendingLimitId ${spendingLimitId} found`);
        }
        await this.deleteCache('all', 'all');
        return result;
    }
    async findOneCateService(userId, cateId) {
        const cachedCate = await this.redisService.getJSON(`categories:${userId}:${cateId}`, '$');
        if (cachedCate) {
            return cachedCate;
        }
        const result = await this.CategoryModel.findOne({ userId, _id: cateId });
        if (result) {
            await this.setCache(userId, cateId, result);
        }
        return result;
    }
    async getCateByTypeIncomeService(userId) {
        const cachedCates = await this.redisService.getJSON('categories:${userId}:income', '$');
        if (cachedCates) {
            console.log('Have cached categories');
            return cachedCates;
        }
        console.log('Not cached categories');
        const result = await this.CategoryModel.find({ userId, type: 'income' }).exec();
        await this.setCache(userId, 'income', result);
        return result;
    }
    async getCateByTypeSpendingService(userId) {
        const cachedCates = await this.redisService.getJSON(`categories:${userId}:spend`, '$');
        if (cachedCates) {
            return cachedCates;
        }
        const categories = await this.CategoryModel.find({ userId, type: 'spend' }).exec();
        const categoriesWithBudget = await Promise.all(categories.map(async (category) => {
            const spendingLimit = await this.spendingLimitService.findSpendingLimitByIdService(category.spendingLimitId);
            const budget = spendingLimit ? spendingLimit.budget : 0;
            return { ...category.toObject(), budget };
        }));
        await this.setCache(userId, 'spend', categoriesWithBudget);
        return categoriesWithBudget;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => spendinglimit_service_1.SpendingLimitService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => spendingnote_service_1.SpendingNoteService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof spendinglimit_service_1.SpendingLimitService !== "undefined" && spendinglimit_service_1.SpendingLimitService) === "function" ? _b : Object, typeof (_c = typeof spendingnote_service_1.SpendingNoteService !== "undefined" && spendingnote_service_1.SpendingNoteService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], CategoryService);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose = __webpack_require__(12);
let Category = class Category extends mongoose_2.Document {
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, enum: ['income', 'spend'], required: true }),
    __metadata("design:type", String)
], Category.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Category.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], Category.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, required: false }),
    __metadata("design:type", String)
], Category.prototype, "spendingLimitId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false, default: 'white' }),
    __metadata("design:type", String)
], Category.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, enum: ['show', 'hidden'], default: 'show' }),
    __metadata("design:type", String)
], Category.prototype, "status", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({ collection: 'categories' })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingLimitService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const spendinglimit_schema_1 = __webpack_require__(26);
const category_service_1 = __webpack_require__(23);
const redis_service_1 = __webpack_require__(27);
let SpendingLimitService = class SpendingLimitService {
    constructor(spendingLimitModel, categoryService, redisService) {
        this.spendingLimitModel = spendingLimitModel;
        this.categoryService = categoryService;
        this.redisService = redisService;
    }
    async getCache(key) {
        return await this.redisService.getJSON(key, '$');
    }
    async setCache(key, value) {
        await this.redisService.setJSON(key, '$', value);
    }
    async delCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async createSpendingLimitService(spendingCateId, budget) {
        if (budget > 100000000000) {
            throw new Error('Budget is too large');
        }
        const newSpendingLimit = new this.spendingLimitModel({ budget });
        await this.categoryService.updateSpendingLimitIdService(spendingCateId, newSpendingLimit._id);
        await this.delCache(`spendinglimit:${newSpendingLimit._id}`);
        return newSpendingLimit.save();
    }
    async updateSpendingLimitService(spendingLimitId, budget) {
        const updatedSpendingLimit = await this.spendingLimitModel.findOneAndUpdate({ _id: spendingLimitId }, { budget }, { new: true });
        await this.setCache(`spendinglimit:${spendingLimitId}`, updatedSpendingLimit);
        return updatedSpendingLimit;
    }
    async deleteSpendingLimitService(spendingLimitId) {
        await this.categoryService.deleteSpendingLimitIdService(spendingLimitId);
        await this.spendingLimitModel.deleteOne({ _id: spendingLimitId });
        await this.delCache(`spendinglimit:${spendingLimitId}`);
        return { message: 'Delete spending limit successfully' };
    }
    async findSpendingLimitByIdService(spendingLimitId) {
        const cacheKey = `spendinglimit:${spendingLimitId}`;
        const cachedSpendingLimit = await this.getCache(cacheKey);
        if (cachedSpendingLimit) {
            return cachedSpendingLimit;
        }
        const spendingLimit = await this.spendingLimitModel.findById(spendingLimitId);
        if (spendingLimit) {
            await this.setCache(cacheKey, spendingLimit);
        }
        return spendingLimit;
    }
};
exports.SpendingLimitService = SpendingLimitService;
exports.SpendingLimitService = SpendingLimitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(spendinglimit_schema_1.SpendingLimit.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => category_service_1.CategoryService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], SpendingLimitService);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingLimitSchema = exports.SpendingLimit = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let SpendingLimit = class SpendingLimit extends mongoose_2.Document {
};
exports.SpendingLimit = SpendingLimit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number, required: true }),
    __metadata("design:type", Number)
], SpendingLimit.prototype, "budget", void 0);
exports.SpendingLimit = SpendingLimit = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SpendingLimit);
exports.SpendingLimitSchema = mongoose_1.SchemaFactory.createForClass(SpendingLimit);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(6);
const redis_1 = __webpack_require__(28);
let RedisService = class RedisService {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.client = this.initializeClient();
        this.client.on('error', (err) => {
            this.logger.error('Redis Client Error', err);
            throw new common_1.InternalServerErrorException('Redis connection error');
        });
    }
    initializeClient() {
        return (0, redis_1.createClient)({
            ...this.config,
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 50, 500),
                connectTimeout: 5000,
                keepAlive: 5000,
            },
        });
    }
    async isConnected() {
        try {
            const ping = await this.client.ping();
            if (ping !== 'PONG') {
                throw new common_1.InternalServerErrorException('Redis connection error');
            }
        }
        catch (err) {
            this.logger.error('Redis ping error: ', err);
            throw new common_1.InternalServerErrorException('Redis connection error');
        }
    }
    async connect() {
        try {
            await this.client.connect();
            this.logger.log('Redis connected...');
            return this.client;
        }
        catch (err) {
            this.logger.error('Redis connection error: ', err);
            throw new common_1.InternalServerErrorException('Redis connection error');
        }
    }
    async set(key, value, ttl) {
        try {
            if (ttl) {
                await this.client.set(key, value, { PX: ttl });
            }
            else {
                await this.client.set(key, value, { PX: 3600 });
            }
        }
        catch (err) {
            this.logger.error(`Error setting key ${key}: `, err);
            throw new common_1.InternalServerErrorException(`Error setting key ${key}`);
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (err) {
            this.logger.error(`Error getting key ${key}: `, err);
            throw new common_1.InternalServerErrorException(`Error getting key ${key}`);
        }
    }
    async hSet(key, value) {
        try {
            return await this.client.hSet(key, value);
        }
        catch (err) {
            this.logger.error(`Error setting hash key ${key}: `, err);
            throw new common_1.InternalServerErrorException(`Error setting hash key ${key}`);
        }
    }
    async hGetAll(key) {
        try {
            return await this.client.hGetAll(key);
        }
        catch (err) {
            this.logger.error(`Error getting all hash values for key ${key}: `, err);
            throw new common_1.InternalServerErrorException(`Error getting all hash values for key ${key}`);
        }
    }
    async getJSON(key, path) {
        try {
            const result = await this.client.json.get(key, { path });
            return result ? JSON.parse(JSON.stringify(result))[0] : null;
        }
        catch (err) {
            this.logger.error(`Error getting JSON for key ${key} and path ${path}: `, err);
            throw new common_1.InternalServerErrorException(`Error getting JSON for key ${key} and path ${path}`);
        }
    }
    async setJSON(key, path = '$', value) {
        try {
            await this.client.json.set(key, path, value);
            await this.client.expire(key, 3600);
            return 'OK';
        }
        catch (err) {
            this.logger.error(`Error setting JSON for key ${key} and path ${path}: `, err);
            throw new common_1.InternalServerErrorException(`Error setting JSON for key ${key} and path ${path}`);
        }
    }
    async delJSON(key, path) {
        try {
            return await this.client.json.DEL(key, path);
        }
        catch (err) {
            this.logger.error(`Error deleting JSON for key ${key} and path ${path}: `, err);
            throw new common_1.InternalServerErrorException(`Error deleting JSON for key ${key} and path ${path}`);
        }
    }
    async exists(keys) {
        try {
            return await this.client.exists(keys);
        }
        catch (err) {
            this.logger.error(`Error checking existence of key(s) ${keys}: `, err);
            throw new common_1.InternalServerErrorException(`Error checking existence of key(s) ${keys}`);
        }
    }
    async setTTL(key, ttl) {
        try {
            await this.client.pExpire(key, ttl);
        }
        catch (err) {
            this.logger.error(`Error setting TTL for key ${key}: `, err);
            throw new common_1.InternalServerErrorException(`Error setting TTL for key ${key}`);
        }
    }
    async flushAll() {
        try {
            await this.client.flushAll();
        }
        catch (err) {
            this.logger.error('Error flushing all keys: ', err);
            throw new common_1.InternalServerErrorException('Error flushing all keys');
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof redis_1.RedisClientOptions !== "undefined" && redis_1.RedisClientOptions) === "function" ? _a : Object, typeof (_b = typeof common_1.Logger !== "undefined" && common_1.Logger) === "function" ? _b : Object])
], RedisService);


/***/ }),
/* 28 */
/***/ ((module) => {

"use strict";
module.exports = require("redis");

/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingNoteService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const spendingnote_schema_1 = __webpack_require__(30);
const category_service_1 = __webpack_require__(23);
const remove_accents_1 = __webpack_require__(22);
const spendinglimit_service_1 = __webpack_require__(25);
let SpendingNoteService = class SpendingNoteService {
    constructor(spendingNoteModel, categoryService, spendingLimitService) {
        this.spendingNoteModel = spendingNoteModel;
        this.categoryService = categoryService;
        this.spendingLimitService = spendingLimitService;
    }
    async createSpendingNoteService(cateId, userId, title, spendingDate, paymentMethod, amount, content) {
        const checkExist = await this.categoryService.findOneCateService(userId, cateId);
        if (!checkExist) {
            throw new common_1.NotFoundException('Category not found');
        }
        const cate = await this.categoryService.findOneCateService(userId, cateId);
        const spendingLimit = await this.spendingLimitService.findSpendingLimitByIdService(cate.spendingLimitId);
        const currentSpendingNotes = await this.spendingNoteModel.find({
            cateId,
            userId,
        });
        const currentTotalSpending = currentSpendingNotes.reduce((total, note) => total + note.amount, 0);
        const newTotalSpending = currentTotalSpending + amount;
        const newSpendingNote = new this.spendingNoteModel({
            cateId,
            title,
            userId,
            spendingDate,
            paymentMethod,
            amount,
            content,
        });
        await newSpendingNote.save();
        let successMessage = 'Create spending note successfully';
        let warningMessage;
        if (spendingLimit && newTotalSpending > spendingLimit.budget) {
            warningMessage = 'Warning: Spending limit exceeded';
        }
        return { successMessage, warningMessage };
    }
    async updateSpendingNoteService(spendingNoteId, userId, title, spendingDate, paymentMethod, amount, content, cateId) {
        const spendingNote = await this.spendingNoteModel.findOne({
            _id: spendingNoteId,
            userId,
        });
        if (!spendingNote) {
            throw new common_1.NotFoundException('Note not found');
        }
        if (cateId) {
            const category = await this.categoryService.findOneCateService(userId, cateId);
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        let warningMessage;
        if (amount !== undefined && spendingNote.amount !== amount) {
            const currentSpendingNotes = await this.spendingNoteModel.find({
                cateId: spendingNote.cateId,
                userId,
            });
            const currentTotalSpending = currentSpendingNotes.reduce((total, note) => total + note.amount, 0);
            const newTotalSpending = currentTotalSpending - spendingNote.amount + amount;
            const category = await this.categoryService.findOneCateService(userId, spendingNote.cateId);
            const spendingLimit = await this.spendingLimitService.findSpendingLimitByIdService(category.spendingLimitId);
            if (spendingLimit && newTotalSpending > spendingLimit.budget) {
                warningMessage = 'Warning: Spending limit exceeded';
            }
        }
        const updatedSpendingNote = await this.spendingNoteModel.findOneAndUpdate({ _id: spendingNoteId, userId }, { title, spendingDate, paymentMethod, amount, content, cateId }, { new: true });
        return { updatedSpendingNote, warningMessage };
    }
    async deleteOneSpendingNoteService(spendingNoteId, userId) {
        const spendingNote = await this.spendingNoteModel.findOne({
            _id: spendingNoteId,
            userId,
        });
        if (!spendingNote) {
            throw new common_1.NotFoundException('Note not found');
        }
        await this.spendingNoteModel.deleteOne({ _id: spendingNoteId, userId });
        return { message: 'Delete note successfully' };
    }
    async deleteManySpendingNoteService(spendingNoteId, userId) {
        const spendingNote = await this.spendingNoteModel.find({
            _id: { $in: spendingNoteId },
            userId,
        });
        if (spendingNote.length === 0) {
            throw new common_1.NotFoundException('Note not found');
        }
        await this.spendingNoteModel.deleteMany({ _id: { $in: spendingNoteId } });
        return { message: 'Delete note successfully' };
    }
    async listSpendingNoteService(userId) {
        const spendingNotes = await this.spendingNoteModel.find({ userId });
        const totalAmount = spendingNotes.reduce((acc, note) => acc + note.amount, 0);
        return { totalAmount, spendingNotes };
    }
    async searchSpendingNoteService(searchKey, userId) {
        try {
            const spendingNotes = await this.spendingNoteModel.find({ userId });
            const preprocessString = (str) => str ? (0, remove_accents_1.remove)(str).trim().toLowerCase() : '';
            const preprocessedSearchKey = preprocessString(searchKey || '');
            const regex = new RegExp(`\\b${preprocessedSearchKey}\\b`, 'i');
            const matchedSpendingNotes = spendingNotes.filter((note) => {
                const { title = '', content = '' } = note;
                const [preprocessedTitle, preprocessedContent] = [title, content].map((field) => preprocessString(field));
                return regex.test(preprocessedTitle) || regex.test(preprocessedContent);
            });
            if (matchedSpendingNotes.length === 0) {
                throw new common_1.NotFoundException('No spending note found');
            }
            return { spendingNotes: matchedSpendingNotes };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async getSpendingsNoteByCateService(cateId, userId) {
        return this.spendingNoteModel.find({
            cateId: cateId,
            userId,
        });
    }
    async filterSpendingNoteService(startDate, endDate, userId) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid startDate or endDate');
        }
        const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));
        const spendingNotes = await this.spendingNoteModel.find({
            spendingDate: { $gte: start, $lte: end },
            userId,
        });
        if (spendingNotes.length === 0) {
            throw new common_1.NotFoundException('No spending notes found for the given date range and user ID');
        }
        return spendingNotes;
    }
    async statisticSpendingNoteOptionService(userId, startDate, endDate) {
        const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));
        const spendingNotes = await this.spendingNoteModel.find({
            spendingDate: { $gte: start, $lte: end },
            userId,
        });
        let totalCost = 0;
        const spendingDetails = {};
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            spendingDetails[d.toISOString().split('T')[0]] = [];
        }
        spendingNotes.forEach((note) => {
            totalCost += note.amount;
            const date = note.spendingDate.toISOString().split('T')[0];
            spendingDetails[date].push({
                title: note.title,
                cost: note.amount,
            });
        });
        return {
            startDate: start,
            endDate: end,
            total: totalCost,
            spending: spendingDetails,
        };
    }
    async statisticSpendingNoteOfMonthService(userId, month, year) {
        const start = new Date(Date.UTC(year, month - 1, 1));
        const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));
        const spendingNotes = await this.spendingNoteModel.find({
            spendingDate: { $gte: start, $lte: end },
            userId,
        });
        let totalCost = 0;
        const spendingDetails = spendingNotes.map((note) => {
            totalCost += note.amount;
            return {
                title: note.title,
                cost: note.amount,
                spendingDate: note.spendingDate,
            };
        });
        return { start, end, totalCost, spendingDetails };
    }
    async statisticSpendingNoteOfYearService(userId, year) {
        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
        const spendingNotes = await this.spendingNoteModel.find({
            spendingDate: { $gte: start, $lte: end },
            userId,
        });
        let totalCost = 0;
        const spendingDetails = spendingNotes.map((note) => {
            totalCost += note.amount;
            return {
                title: note.title,
                cost: note.amount,
                spendingDate: note.spendingDate,
            };
        });
        return { start, end, totalCost, spendingDetails };
    }
    async statisticSpendingNoteByCateService(userId, startDate, endDate) {
        startDate =
            startDate instanceof Date ? startDate : new Date(Date.parse(startDate));
        endDate = endDate instanceof Date ? endDate : new Date(Date.parse(endDate));
        const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));
        const spendingNotes = await this.spendingNoteModel.find({
            spendingDate: { $gte: start, $lte: end },
            userId,
        });
        const cateIdUnique = [...new Set(spendingNotes.map((note) => note.cateId))];
        const spendingDetails = await Promise.all(cateIdUnique.map(async (cateId) => {
            let totalCost = 0;
            const cateSpendingNotes = spendingNotes.filter((note) => {
                const isMatch = note.cateId === cateId;
                if (isMatch) {
                    totalCost += note.amount;
                }
                return isMatch;
            });
            const infoCate = await this.categoryService.findOneCateService(userId, cateId);
            const limitCate = await this.spendingLimitService.findSpendingLimitByIdService(infoCate.spendingLimitId);
            if (!limitCate) {
                return {
                    nameCate: infoCate.name,
                    percentHasUse: 0,
                    budget: 0,
                    spending: cateSpendingNotes.map((note) => ({
                        title: note.title,
                        cost: note.amount,
                        percentHasUse: 0,
                    })),
                };
            }
            const percentHasUse = Math.min((totalCost / limitCate.budget) * 100, 100);
            const spending = cateSpendingNotes.map((note) => ({
                title: note.title,
                cost: note.amount,
                percentHasUse: (note.amount / limitCate.budget) * 100,
            }));
            return {
                nameCate: infoCate.name,
                percentHasUse,
                budget: limitCate.budget,
                spending,
            };
        }));
        const groupedSpendingDetails = spendingDetails.reduce((acc, curr) => {
            if (!acc.has(curr.nameCate)) {
                acc.set(curr.nameCate, {
                    nameCate: curr.nameCate,
                    allOfPersentUse: 0,
                    budget: curr.budget,
                    spending: [],
                });
            }
            const group = acc.get(curr.nameCate);
            group.spending.push(...curr.spending);
            group.allOfPersentUse += curr.percentHasUse;
            return acc;
        }, new Map());
        return {
            startDate: start,
            endDate: end,
            spending: Array.from(groupedSpendingDetails.values()),
        };
    }
    async statisticSpendingNoteService(userId, filterBy, numberOfItems, category) {
        let start, end;
        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth();
        switch (filterBy) {
            case 'month':
                start = new Date(Date.UTC(currentYear, currentMonth - numberOfItems + 1, 1));
                end = new Date(Date.UTC(currentYear, currentMonth, currentDate.getUTCDate(), 23, 59, 59));
                break;
            case 'year':
                start = new Date(Date.UTC(currentYear - numberOfItems + 1, 0, 1));
                end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
                break;
            case 'category':
                start = new Date(Date.UTC(currentYear, 0, 1));
                end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
                break;
            default:
                throw new Error('Invalid filter type');
        }
        const query = {
            spendingDate: { $gte: start, $lte: end },
            userId,
        };
        if (category) {
            query.cateId = category;
        }
        let totalCosts = 0;
        let highestCosts = 0;
        const spendingNotes = await this.spendingNoteModel.find(query);
        let groupedSpendingDetails = {};
        if (filterBy === 'month') {
            let year = currentYear;
            let month = currentMonth;
            for (let i = 0; i < numberOfItems; i++) {
                const key = `${year}-${month + 1}`;
                groupedSpendingDetails[key] = {
                    totalCost: 0,
                    items: [],
                };
                month -= 1;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
            }
        }
        else if (filterBy === 'year') {
            for (let i = 0; i < numberOfItems; i++) {
                const year = currentYear - i;
                groupedSpendingDetails[year] = {
                    totalCost: 0,
                    items: [],
                };
            }
        }
        spendingNotes.forEach((note) => {
            const noteDate = new Date(note.spendingDate);
            const key = filterBy === 'month'
                ? `${noteDate.getUTCFullYear()}-${noteDate.getUTCMonth() + 1}`
                : noteDate.getUTCFullYear();
            if (groupedSpendingDetails[key]) {
                groupedSpendingDetails[key].totalCost += note.amount;
                groupedSpendingDetails[key].items.push({
                    title: note.title,
                    cost: note.amount,
                    category: note.cateId,
                    spendingDate: note.spendingDate,
                });
                totalCosts += note.amount;
            }
        });
        for (const key in groupedSpendingDetails) {
            if (groupedSpendingDetails[key].totalCost > highestCosts) {
                highestCosts = groupedSpendingDetails[key].totalCost;
            }
        }
        return { start, end, highestCosts, totalCosts, groupedSpendingDetails };
    }
    async notifySpendingNoteService(userId) {
        const spendingNotes = await this.spendingNoteModel.find({ userId }).lean();
        const processedCategories = new Map();
        for (const note of spendingNotes) {
            const { cateId } = note;
            const infoCate = await this.categoryService.findOneCateService(userId, cateId);
            if (!infoCate) {
                throw new common_1.NotFoundException('Category not found');
            }
            const limitCate = await this.spendingLimitService.findSpendingLimitByIdService(infoCate.spendingLimitId);
            if (!limitCate) {
                throw new common_1.NotFoundException('Spending limit not found');
            }
            let category = processedCategories.get(infoCate.name);
            if (!category) {
                const totalCost = await this.getTotalSpendingForCategory(userId, cateId);
                category = {
                    id: cateId,
                    nameCate: infoCate.name,
                    budget: limitCate.budget,
                    budgetUsed: totalCost,
                };
                processedCategories.set(infoCate.name, category);
            }
        }
        const outOfBudgetCategories = Array.from(processedCategories.values()).filter((category) => category.budgetUsed >= category.budget);
        if (outOfBudgetCategories.length === 0) {
            return { message: 'All of your spending notes are within budget' };
        }
        return {
            message: 'You have categories that have reached or exceeded the budget',
            outOfBudgetCategories,
        };
    }
    async getTotalSpendingForCategory(userId, categoryId) {
        const categorySpendingNotes = await this.spendingNoteModel
            .find({ userId, cateId: categoryId })
            .lean();
        return categorySpendingNotes.reduce((total, note) => total + note.amount, 0);
    }
    async findSpendingNoteByCateIdService(cateId) {
        return this.spendingNoteModel.find({ cateId });
    }
    async deleteAllSpendingNoteByCateIdService(userId, cateId) {
        await this.spendingNoteModel.deleteMany({ userId, cateId });
        return { message: 'Delete all note successfully' };
    }
};
exports.SpendingNoteService = SpendingNoteService;
exports.SpendingNoteService = SpendingNoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(spendingnote_schema_1.SpendingNote.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => category_service_1.CategoryService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _b : Object, typeof (_c = typeof spendinglimit_service_1.SpendingLimitService !== "undefined" && spendinglimit_service_1.SpendingLimitService) === "function" ? _c : Object])
], SpendingNoteService);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingNoteSchema = exports.SpendingNote = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let SpendingNote = class SpendingNote extends mongoose_2.Document {
};
exports.SpendingNote = SpendingNote;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], SpendingNote.prototype, "cateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], SpendingNote.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], SpendingNote.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], SpendingNote.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date, required: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], SpendingNote.prototype, "spendingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, enum: ['banking', 'cash'], defaut: 'cash', required: true }),
    __metadata("design:type", String)
], SpendingNote.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number }),
    __metadata("design:type", Number)
], SpendingNote.prototype, "amount", void 0);
exports.SpendingNote = SpendingNote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SpendingNote);
exports.SpendingNoteSchema = mongoose_1.SchemaFactory.createForClass(SpendingNote);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EncryptionService = void 0;
const common_1 = __webpack_require__(6);
const crypto = __webpack_require__(32);
const fs = __webpack_require__(21);
const ALGORITHM = 'aes-256-ecb';
const ENCODING = 'base64';
let EncryptionService = class EncryptionService {
    constructor() {
        if (!fs.existsSync('private.pem') || !fs.existsSync('public.pem')) {
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
            });
            fs.writeFileSync('private.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }));
            fs.writeFileSync('public.pem', publicKey.export({ type: 'spki', format: 'pem' }));
        }
        this.privateKey = fs.readFileSync('private.pem', 'utf8');
        this.publicKey = fs.readFileSync('public.pem', 'utf8');
    }
    createCipher(password) {
        return crypto.createCipheriv(ALGORITHM, password.substr(0, 32), '');
    }
    createDecipher(password) {
        return crypto.createDecipheriv(ALGORITHM, password.substr(0, 32), '');
    }
    createEncryptKey(password) {
        const keyA = crypto.randomBytes(32);
        const cipher = this.createCipher(password);
        let keyB = cipher.update(keyA);
        keyB = Buffer.concat([keyB, cipher.final()]);
        return keyB.toString(ENCODING);
    }
    updateEncryptKey(password, decryptedKey) {
        const cipher = this.createCipher(password);
        let encryptedKey = cipher.update(Buffer.from(decryptedKey, ENCODING));
        encryptedKey = Buffer.concat([encryptedKey, cipher.final()]);
        return encryptedKey.toString(ENCODING);
    }
    decryptEncryptKey(encryptKey, password) {
        const decipher = this.createDecipher(password);
        let decryptedKey = decipher.update(Buffer.from(encryptKey, ENCODING));
        decryptedKey = Buffer.concat([decryptedKey, decipher.final()]);
        return decryptedKey.toString(ENCODING);
    }
    encryptData(data, key) {
        const cipher = this.createCipher(key);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        return encryptedData.toString(ENCODING);
    }
    decryptData(data, key) {
        const decipher = this.createDecipher(key);
        let decryptedData = decipher.update(Buffer.from(data, ENCODING));
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        return decryptedData.toString();
    }
    rsaEncrypt(text) {
        const buffer = Buffer.from(text, 'utf8');
        const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
        return encrypted.toString('base64');
    }
    rsaDecrypt(text) {
        try {
            const buffer = Buffer.from(text, 'base64');
            const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
            return decrypted.toString('utf8');
        }
        catch (e) {
            return text;
        }
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EncryptionService);


/***/ }),
/* 32 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RankSchema = exports.Rank = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Rank = class Rank extends mongoose_2.Document {
};
exports.Rank = Rank;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Rank.prototype, "rankName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number, required: true }),
    __metadata("design:type", Number)
], Rank.prototype, "rankScoreGoal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            attendanceScore: Number,
            numberOfComment: Number,
            numberOfBlog: Number,
            numberOfLike: Number,
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Rank.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Rank.prototype, "rankIcon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_3.default.Schema.Types.String] }),
    __metadata("design:type", Array)
], Rank.prototype, "action", void 0);
exports.Rank = Rank = __decorate([
    (0, mongoose_1.Schema)()
], Rank);
exports.RankSchema = mongoose_1.SchemaFactory.createForClass(Rank);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthGuard = void 0;
const common_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(35);
let AuthGuard = class AuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('token not found');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
        }
        catch {
            throw new common_1.UnauthorizedException('invalid token');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthGuard);


/***/ }),
/* 35 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 36 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 37 */
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),
/* 38 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionGuard = void 0;
const common_1 = __webpack_require__(6);
const core_1 = __webpack_require__(4);
const abilities_factory_1 = __webpack_require__(40);
const jwt_1 = __webpack_require__(35);
const jwt = __webpack_require__(37);
const admin_service_1 = __webpack_require__(42);
const TOKEN_NOT_FOUND_MESSAGE = 'Token not found';
const TOKEN_EXPIRED_MESSAGE = 'Token expired';
const INVALID_TOKEN_MESSAGE = 'Invalid token';
const NO_PERMISSION_MESSAGE = 'You do not have permission to perform this action, or you are blocked. pls contact the master admin.';
let PermissionGuard = class PermissionGuard {
    constructor(reflector, abilityFactory, jwtService, adminService) {
        this.reflector = reflector;
        this.abilityFactory = abilityFactory;
        this.jwtService = jwtService;
        this.adminService = adminService;
    }
    async canActivate(context) {
        const subject = this.reflector.get('Subject', context.getHandler());
        const action = this.reflector.get('Action', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException(TOKEN_NOT_FOUND_MESSAGE);
        }
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new common_1.UnauthorizedException(TOKEN_EXPIRED_MESSAGE);
            }
            else {
                throw new common_1.UnauthorizedException(INVALID_TOKEN_MESSAGE);
            }
        }
        try {
            var permissions = payload.role.flatMap((role) => role.permissionID.map(Number));
        }
        catch (error) {
            throw new common_1.ForbiddenException(NO_PERMISSION_MESSAGE);
        }
        if (!permissions) {
            throw new common_1.ForbiddenException(NO_PERMISSION_MESSAGE);
        }
        const ability = this.abilityFactory.createForUser(permissions);
        const checkAbility = ability.can(action[0], subject[0]);
        const checkBlock = await this.adminService.findOneAdminService(payload._id);
        if (!checkAbility || checkBlock.isBlock === true) {
            throw new common_1.ForbiddenException(NO_PERMISSION_MESSAGE);
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof abilities_factory_1.AbilityFactory !== "undefined" && abilities_factory_1.AbilityFactory) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object, typeof (_d = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _d : Object])
], PermissionGuard);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbilityFactory = void 0;
const ability_1 = __webpack_require__(41);
const common_1 = __webpack_require__(6);
const fs = __webpack_require__(21);
const path = __webpack_require__(20);
let AbilityFactory = class AbilityFactory {
    createForUser(permissions) {
        if (!Array.isArray(permissions)) {
            throw new Error('Permissions is undefined or not an array');
        }
        const rolePermissions = permissions.reduce((acc, permission) => {
            const permissionForRole = this.getPermissionsForRole([permission]);
            return acc.concat(permissionForRole);
        }, []);
        return (0, ability_1.defineAbility)((can, cannot) => {
            rolePermissions.forEach(({ action, subject }) => {
                can(action, subject);
            });
        });
    }
    getPermissionsForRole(permissionIDs) {
        let allPermissions;
        try {
            const filePath = path.resolve('./src/config/permission.json');
            const fileData = fs.readFileSync(filePath, 'utf-8');
            allPermissions = JSON.parse(fileData);
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
        if (!Array.isArray(permissionIDs)) {
            throw new Error('permissionIDs is not an array');
        }
        const rolePermissions = allPermissions.filter((permission) => permissionIDs.includes(permission.id));
        return rolePermissions;
    }
};
exports.AbilityFactory = AbilityFactory;
exports.AbilityFactory = AbilityFactory = __decorate([
    (0, common_1.Injectable)()
], AbilityFactory);


/***/ }),
/* 41 */
/***/ ((module) => {

"use strict";
module.exports = require("@casl/ability");

/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(6);
const admin_schema_1 = __webpack_require__(43);
const mongoose_1 = __webpack_require__(12);
const mongoose_2 = __webpack_require__(7);
const role_schema_1 = __webpack_require__(44);
const bcrypt = __webpack_require__(45);
let AdminService = class AdminService {
    constructor(adminModel, roleModel) {
        this.adminModel = adminModel;
        this.roleModel = roleModel;
    }
    async createAdminService(fullname, email, password, roleId) {
        const duplicate = await this.adminModel.findOne({ email }).exec();
        const findRole = await this.roleModel.find({ _id: { $in: roleId } }).exec();
        console.log(findRole);
        if (!findRole.length) {
            throw new common_1.BadRequestException('Role not exists');
        }
        if (duplicate) {
            throw new common_1.BadRequestException('Admin already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new this.adminModel({
            fullname,
            email,
            password: hashedPassword,
            role: roleId,
        });
        return admin.save();
    }
    async updateAdminService(id, fullname, email, password, roleId) {
        if (email) {
            const duplicate = await this.adminModel.findOne({ email, _id: { $ne: id } }).exec();
            if (duplicate) {
                throw new common_1.BadRequestException('Admin already exists');
            }
        }
        if (password) {
            password = await bcrypt.hash(password, 10);
        }
        if (roleId) {
            const findRole = await this.roleModel
                .find({ _id: { $in: roleId } })
                .exec();
            if (findRole.length !== roleId.length) {
                throw new common_1.BadRequestException('Some roles were not found');
            }
            roleId = findRole.map((role) => role._id.toString());
        }
        return this.adminModel
            .findByIdAndUpdate(id, { $set: { fullname, email, password, role: roleId } }, { new: true, runValidators: true })
            .orFail(new common_1.BadRequestException('Admin not exists'))
            .exec();
    }
    async findOneAdminEmailService(email) {
        return this.adminModel.findOne({ email }).exec();
    }
    async updateRefreshTokenService(email, refreshToken) {
        return this.adminModel
            .findOneAndUpdate({
            email,
        }, {
            refreshToken,
        }, {
            new: true,
        })
            .exec();
    }
    async findOneAdminRefreshTokenService(refreshToken) {
        return this.adminModel.findOne({
            refreshToken,
        });
    }
    async deleteAdminService(id) {
        const admin = await this.adminModel.findById(id).exec();
        if (!admin) {
            throw new common_1.BadRequestException('Admin not exists');
        }
        if (admin.email === 'masterAdmin@gmail.com') {
            throw new common_1.BadRequestException('Cannot delete master admin');
        }
        await this.adminModel.findByIdAndDelete(id).exec();
        return { message: 'Admin deleted successfully' };
    }
    async listAdminService() {
        const admins = await this.adminModel
            .find()
            .select('-password -createdAt -updatedAt -refreshToken')
            .exec();
        const roleIds = admins.reduce((ids, admin) => [...ids, ...admin.role], []);
        const roles = await this.roleModel
            .find({ _id: { $in: roleIds } })
            .select('-permissionID')
            .exec();
        return admins.map((admin) => {
            const role = roles.filter((role) => admin.role.includes(role._id.toString()));
            return {
                ...admin.toObject(),
                role,
            };
        });
    }
    async blockAdminService(id, isBlock) {
        await this.adminModel
            .findByIdAndUpdate(id, { $set: { isBlock } }, { new: true, runValidators: true })
            .exec();
        return { message: 'Block admin success' };
    }
    async findOneAdminService(id) {
        return this.adminModel.findById(id).exec();
    }
    async findOneAdminbyIdRoleService(id) {
        return this.adminModel.findOne({ role: id }).exec();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_2.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _b : Object])
], AdminService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminSchema = exports.Admin = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Admin = class Admin extends mongoose_2.Document {
};
exports.Admin = Admin;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Admin.prototype, "fullname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Boolean, default: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isBlock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_3.default.Schema.Types.ObjectId], ref: 'roles' }),
    __metadata("design:type", Array)
], Admin.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, default: null }),
    __metadata("design:type", String)
], Admin.prototype, "refreshToken", void 0);
exports.Admin = Admin = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Admin);
exports.AdminSchema = mongoose_1.SchemaFactory.createForClass(Admin);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleSchema = exports.Role = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Role = class Role extends mongoose_2.Document {
};
exports.Role = Role;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true, unique: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_3.default.Schema.Types.Number, default: [] }] }),
    __metadata("design:type", Array)
], Role.prototype, "permissionID", void 0);
exports.Role = Role = __decorate([
    (0, mongoose_1.Schema)()
], Role);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);


/***/ }),
/* 45 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Action = exports.Subject = void 0;
const common_1 = __webpack_require__(6);
const Subject = (...subject) => (0, common_1.SetMetadata)('Subject', subject);
exports.Subject = Subject;
const Action = (...action) => (0, common_1.SetMetadata)('Action', action);
exports.Action = Action;


/***/ }),
/* 47 */
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserProfileDto = exports.BlockUserDto = exports.CreateUserDto = exports.DeleteUserDto = void 0;
const deleteUser_dto_1 = __webpack_require__(49);
Object.defineProperty(exports, "DeleteUserDto", ({ enumerable: true, get: function () { return deleteUser_dto_1.DeleteUserDto; } }));
const createrUser_dto_1 = __webpack_require__(51);
Object.defineProperty(exports, "CreateUserDto", ({ enumerable: true, get: function () { return createrUser_dto_1.CreateUserDto; } }));
const blockUser_dto_1 = __webpack_require__(53);
Object.defineProperty(exports, "BlockUserDto", ({ enumerable: true, get: function () { return blockUser_dto_1.BlockUserDto; } }));
const updateUserProfile_dto_1 = __webpack_require__(54);
Object.defineProperty(exports, "UpdateUserProfileDto", ({ enumerable: true, get: function () { return updateUserProfile_dto_1.UpdateUserProfileDto; } }));


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteUserDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class DeleteUserDto {
}
exports.DeleteUserDto = DeleteUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of user ',
        example: '60e1d0b5d8f1f40015e4e8b0'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], DeleteUserDto.prototype, "_id", void 0);


/***/ }),
/* 50 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(50);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user ',
        example: 'xuanchimto@gmail.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsEmail)({}, { message: 'please enter correct email' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password of user ',
        example: 'Xuanchimto123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of user ',
        example: 'Nguyen Le Minh Xuan'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth of user ',
        example: '1999-12-31'
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Avatar of user ',
        example: 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address of user ',
        example: 'Ho Chi Minh City'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);


/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlockUserDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class BlockUserDto {
}
exports.BlockUserDto = BlockUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of user ',
        example: '60e1d0b5d8f1f40015e4e8b0'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], BlockUserDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Block status of user ',
        example: 'true'
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], BlockUserDto.prototype, "isBlock", void 0);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserProfileDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(50);
class UpdateUserProfileDto {
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'firstname of user',
        example: 'Nguyên Lê Minh',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of user ',
        example: 'Xuân',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user ',
        example: 'xuancudai2km@gmail.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth of user ',
        example: '1999-12-31',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateUserProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user ',
        example: 'Duong Quan Ham, Phuong 5, Quan 6, TP.HCM',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'male or female or other',
        example: 'male',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number  user ',
        example: '0123456789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nickname of user ',
        example: 'Xuân',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of user ',
        example: 'I am a student',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hyperlink of user ',
        example: '["www.facebook.com","www.instagram.com"," www.twitter.com"]',
    }),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "hyperlink", void 0);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberGuard = void 0;
const common_1 = __webpack_require__(6);
const auth_gaurd_1 = __webpack_require__(34);
let MemberGuard = class MemberGuard extends auth_gaurd_1.AuthGuard {
    async canActivate(context) {
        try {
            const canActivate = await super.canActivate(context);
            if (!canActivate) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
        catch (error) {
            if (error.name === 'TokenExpiredError' || error.message.includes('expired')) {
                throw new common_1.UnauthorizedException('Token expired');
            }
            else {
                throw new common_1.UnauthorizedException('Token not found or invalid');
            }
        }
        const request = context.switchToHttp().getRequest();
        if (request.user && request.user.role === 'member' && request.user.isBlock === false) {
            return true;
        }
        throw new common_1.UnauthorizedException('Only members are allowed OR you are blocked');
    }
};
exports.MemberGuard = MemberGuard;
exports.MemberGuard = MemberGuard = __decorate([
    (0, common_1.Injectable)()
], MemberGuard);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryModule = void 0;
const common_1 = __webpack_require__(6);
const cloudinary_service_1 = __webpack_require__(14);
const config_1 = __webpack_require__(8);
let CloudinaryModule = class CloudinaryModule {
};
exports.CloudinaryModule = CloudinaryModule;
exports.CloudinaryModule = CloudinaryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        providers: [cloudinary_service_1.CloudinaryService],
        exports: [cloudinary_service_1.CloudinaryService],
    })
], CloudinaryModule);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryModule = void 0;
const common_1 = __webpack_require__(6);
const category_service_1 = __webpack_require__(23);
const category_controller_1 = __webpack_require__(58);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const category_schema_1 = __webpack_require__(24);
const spendinglimit_module_1 = __webpack_require__(61);
const spendingnote_module_1 = __webpack_require__(66);
const redis_module_1 = __webpack_require__(65);
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            (0, common_1.forwardRef)(() => spendinglimit_module_1.SpendingLimitModule),
            (0, common_1.forwardRef)(() => spendingnote_module_1.SpendingNoteModule),
        ],
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
        exports: [category_service_1.CategoryService],
    })
], CategoryModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const common_1 = __webpack_require__(6);
const category_service_1 = __webpack_require__(23);
const CreateCate_dto_1 = __webpack_require__(59);
const jwt = __webpack_require__(37);
const swagger_1 = __webpack_require__(36);
const member_gaurd_1 = __webpack_require__(55);
const UpdateCate_dto_1 = __webpack_require__(60);
const redis_service_1 = __webpack_require__(27);
let CategoryController = class CategoryController {
    constructor(categoryService, redisService) {
        this.categoryService = categoryService;
        this.redisService = redisService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createCateController(request, createCateDto) {
        const userId = this.getUserIdFromToken(request);
        return this.categoryService.createCateService(userId, createCateDto.name, createCateDto.type, createCateDto.icon, createCateDto.color, createCateDto.status, createCateDto.description);
    }
    async updateCateController(request, updateCateDto) {
        const userId = this.getUserIdFromToken(request);
        return this.categoryService.updateCateService(userId, updateCateDto.cateId, updateCateDto.name, updateCateDto.description, updateCateDto.icon, updateCateDto.color, updateCateDto.status);
    }
    async deleteCateController(request, cateId) {
        const userId = this.getUserIdFromToken(request);
        return this.categoryService.deleteCateService(userId, cateId);
    }
    async viewCateController(request) {
        const userId = this.getUserIdFromToken(request);
        try {
            const data = await this.categoryService.viewCateService(userId);
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving data');
        }
    }
    async getCateByTypeIncomeController(request) {
        const userId = this.getUserIdFromToken(request);
        const cacheKey = `category-income-${userId}`;
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await this.categoryService.getCateByTypeIncomeService(userId);
            await this.redisService.set(cacheKey, JSON.stringify(data));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving data');
        }
    }
    async getCateByTypeSpendController(request) {
        const userId = this.getUserIdFromToken(request);
        const cacheKey = `category-spend-${userId}`;
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await this.categoryService.getCateByTypeSpendingService(userId);
            await this.redisService.set(cacheKey, JSON.stringify(data));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving data');
        }
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully created.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Request !== "undefined" && Request) === "function" ? _c : Object, typeof (_d = typeof CreateCate_dto_1.CreateCateDto !== "undefined" && CreateCate_dto_1.CreateCateDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CategoryController.prototype, "createCateController", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof Request !== "undefined" && Request) === "function" ? _f : Object, typeof (_g = typeof UpdateCate_dto_1.UpdateCateDto !== "undefined" && UpdateCate_dto_1.UpdateCateDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], CategoryController.prototype, "updateCateController", null);
__decorate([
    (0, common_1.Delete)(':cateId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof Request !== "undefined" && Request) === "function" ? _j : Object, String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], CategoryController.prototype, "deleteCateController", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof Request !== "undefined" && Request) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], CategoryController.prototype, "viewCateController", null);
__decorate([
    (0, common_1.Get)('/income'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof Request !== "undefined" && Request) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], CategoryController.prototype, "getCateByTypeIncomeController", null);
__decorate([
    (0, common_1.Get)('/spend'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof Request !== "undefined" && Request) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], CategoryController.prototype, "getCateByTypeSpendController", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('category'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [typeof (_a = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _a : Object, typeof (_b = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _b : Object])
], CategoryController);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCateDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateCateDto {
}
exports.CreateCateDto = CreateCateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of spending category ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of spending category ',
        example: 'income or spend'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['income', 'spend']),
    __metadata("design:type", String)
], CreateCateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of spending category ',
        example: 'Food or drink or salary or rent or ...'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Icon of spending category ',
        example: 'Food'
    }),
    __metadata("design:type", String)
], CreateCateDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color of spending category ',
        example: 'red'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCateDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of spending category ',
        example: 'show or hidden'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['show', 'hidden']),
    __metadata("design:type", String)
], CreateCateDto.prototype, "status", void 0);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCateDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateCateDto {
}
exports.UpdateCateDto = UpdateCateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending category id ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "cateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of spending category ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of spending category ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Icon of spending category ',
        example: 'Food'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color of spending category ',
        example: 'red'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of spending category ',
        example: 'show or hidden'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['show', 'hidden']),
    __metadata("design:type", String)
], UpdateCateDto.prototype, "status", void 0);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingLimitModule = void 0;
const common_1 = __webpack_require__(6);
const spendinglimit_service_1 = __webpack_require__(25);
const spendinglimit_controller_1 = __webpack_require__(62);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const spendinglimit_schema_1 = __webpack_require__(26);
const category_module_1 = __webpack_require__(57);
const redis_module_1 = __webpack_require__(65);
let SpendingLimitModule = class SpendingLimitModule {
};
exports.SpendingLimitModule = SpendingLimitModule;
exports.SpendingLimitModule = SpendingLimitModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: spendinglimit_schema_1.SpendingLimit.name, schema: spendinglimit_schema_1.SpendingLimitSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            (0, common_1.forwardRef)(() => category_module_1.CategoryModule),
        ],
        controllers: [spendinglimit_controller_1.SpendinglimitController],
        providers: [spendinglimit_service_1.SpendingLimitService],
        exports: [spendinglimit_service_1.SpendingLimitService],
    })
], SpendingLimitModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendinglimitController = void 0;
const common_1 = __webpack_require__(6);
const spendinglimit_service_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(36);
const CreateSpendingLimit_dto_1 = __webpack_require__(63);
const member_gaurd_1 = __webpack_require__(55);
const UpdateSpendingLimit_dto_1 = __webpack_require__(64);
let SpendinglimitController = class SpendinglimitController {
    constructor(spendinglimitService) {
        this.spendinglimitService = spendinglimitService;
    }
    async createSpendingLimitController(dto) {
        return this.spendinglimitService.createSpendingLimitService(dto.spendingCateId, dto.budget);
    }
    async updateSpendingLimitController(dto) {
        return this.spendinglimitService.updateSpendingLimitService(dto.spendingLimitId, dto.budget);
    }
    async deleteSpendingLimitController(spendingLimitId) {
        return this.spendinglimitService.deleteSpendingLimitService(spendingLimitId);
    }
};
exports.SpendinglimitController = SpendinglimitController;
__decorate([
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Spending limit created' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof CreateSpendingLimit_dto_1.CreateSpendingLimitDto !== "undefined" && CreateSpendingLimit_dto_1.CreateSpendingLimitDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], SpendinglimitController.prototype, "createSpendingLimitController", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending limit updated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof UpdateSpendingLimit_dto_1.UpdateSpendingLimitDto !== "undefined" && UpdateSpendingLimit_dto_1.UpdateSpendingLimitDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], SpendinglimitController.prototype, "updateSpendingLimitController", null);
__decorate([
    (0, common_1.Delete)(':spendingLimitId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending limit deleted' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('spendingLimitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], SpendinglimitController.prototype, "deleteSpendingLimitController", null);
exports.SpendinglimitController = SpendinglimitController = __decorate([
    (0, swagger_1.ApiTags)('spending limit'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('spendinglimit'),
    __metadata("design:paramtypes", [typeof (_a = typeof spendinglimit_service_1.SpendingLimitService !== "undefined" && spendinglimit_service_1.SpendingLimitService) === "function" ? _a : Object])
], SpendinglimitController);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSpendingLimitDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateSpendingLimitDto {
}
exports.CreateSpendingLimitDto = CreateSpendingLimitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpendingLimitDto.prototype, "spendingCateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Budget of spending category ',
        example: '1000'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSpendingLimitDto.prototype, "budget", void 0);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSpendingLimitDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateSpendingLimitDto {
}
exports.UpdateSpendingLimitDto = UpdateSpendingLimitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSpendingLimitDto.prototype, "spendingLimitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Budget of spending category ',
        example: '1000'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSpendingLimitDto.prototype, "budget", void 0);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisCacheModule = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(8);
const redis_service_1 = __webpack_require__(27);
let RedisCacheModule = class RedisCacheModule {
};
exports.RedisCacheModule = RedisCacheModule;
exports.RedisCacheModule = RedisCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
        ],
        providers: [
            {
                provide: redis_service_1.RedisService,
                useFactory: async (config) => {
                    const logger = new common_1.Logger('REDIS');
                    const cacheService = new redis_service_1.RedisService({
                        url: `redis://${config.get('REDIS_HOST')}:${+config.get('REDIS_PORT')}`,
                        password: config.get('REDIS_PASSWORD'),
                    }, logger);
                    await cacheService.connect();
                    return cacheService;
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [redis_service_1.RedisService],
    })
], RedisCacheModule);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingNoteModule = void 0;
const common_1 = __webpack_require__(6);
const spendingnote_service_1 = __webpack_require__(29);
const spendingnote_controller_1 = __webpack_require__(67);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const spendingnote_schema_1 = __webpack_require__(30);
const category_module_1 = __webpack_require__(57);
const spendinglimit_module_1 = __webpack_require__(61);
let SpendingNoteModule = class SpendingNoteModule {
};
exports.SpendingNoteModule = SpendingNoteModule;
exports.SpendingNoteModule = SpendingNoteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            spendinglimit_module_1.SpendingLimitModule,
            (0, common_1.forwardRef)(() => category_module_1.CategoryModule),
            mongoose_1.MongooseModule.forFeature([{ name: spendingnote_schema_1.SpendingNote.name, schema: spendingnote_schema_1.SpendingNoteSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [spendingnote_controller_1.SpendingnoteController],
        providers: [spendingnote_service_1.SpendingNoteService],
        exports: [spendingnote_service_1.SpendingNoteService],
    })
], SpendingNoteModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpendingnoteController = void 0;
const common_1 = __webpack_require__(6);
const spendingnote_service_1 = __webpack_require__(29);
const swagger_1 = __webpack_require__(36);
const CreateSpendingNote_dto_1 = __webpack_require__(68);
const jwt = __webpack_require__(37);
const member_gaurd_1 = __webpack_require__(55);
const updateSpendingNote_dto_1 = __webpack_require__(69);
const DeleteSpendingNote_dto_1 = __webpack_require__(70);
const FilterSpendingNote_dto_1 = __webpack_require__(71);
const express_1 = __webpack_require__(47);
const StatictisSpendingNote_dto_1 = __webpack_require__(72);
let SpendingnoteController = class SpendingnoteController {
    constructor(spendingnoteService) {
        this.spendingnoteService = spendingnoteService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createSpendingNoteController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.createSpendingNoteService(dto.cateId, userId, dto.title, dto.date, dto.method, dto.amount, dto.content);
    }
    async updateSpendingNoteController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.updateSpendingNoteService(dto.spendingNoteId, userId, dto.title, dto.date, dto.method, dto.amount, dto.content, dto.cateId);
    }
    async deleteManySpendingNoteController(req, dto) {
        console.log(dto);
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.deleteManySpendingNoteService(dto.spendingNoteId, userId);
    }
    async deleteOneSpendingNoteController(spendingNoteId, req) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.deleteOneSpendingNoteService(spendingNoteId, userId);
    }
    async getSpendingNoteController(req) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.listSpendingNoteService(userId);
    }
    async searchSpendingNoteController(req) {
        const userId = this.getUserIdFromToken(req);
        const searchKey = req.query.searchKey;
        return this.spendingnoteService.searchSpendingNoteService(searchKey, userId);
    }
    async getSpendingsByCateCotroller(req, spendingCateId) {
        console.log(spendingCateId);
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.getSpendingsNoteByCateService(spendingCateId, userId);
    }
    async filterSpendingNoteController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.filterSpendingNoteService(dto.startDate, dto.endDate, userId);
    }
    async statisticSpendingNoteOfDayController(req, dto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.statisticSpendingNoteOptionService(userId, startDate, endDate);
    }
    async statisticSpendingNoteOfMonthController(req, month, year) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.statisticSpendingNoteOfMonthService(userId, month, year);
    }
    async statisticSpendingNoteOfYearController(req, year) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.statisticSpendingNoteOfYearService(userId, year);
    }
    async statisticSpendingNoteByCateController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.statisticSpendingNoteByCateService(userId, dto.startDate, dto.endDate);
    }
    async notifySpendingNoteController(req) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.notifySpendingNoteService(userId);
    }
    async statisticSpendingController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.statisticSpendingNoteService(userId, dto.filterBy, dto.numberOfItem, dto.cateId);
    }
    async deleteAllSpendingNoteByCateController(req, cateId) {
        const userId = this.getUserIdFromToken(req);
        return this.spendingnoteService.deleteAllSpendingNoteByCateIdService(userId, cateId);
    }
};
exports.SpendingnoteController = SpendingnoteController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Spending note created' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof CreateSpendingNote_dto_1.CreateSpendingNoteDto !== "undefined" && CreateSpendingNote_dto_1.CreateSpendingNoteDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], SpendingnoteController.prototype, "createSpendingNoteController", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note updated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, typeof (_f = typeof updateSpendingNote_dto_1.UpdateSpendingNoteDto !== "undefined" && updateSpendingNote_dto_1.UpdateSpendingNoteDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], SpendingnoteController.prototype, "updateSpendingNoteController", null);
__decorate([
    (0, common_1.Delete)('deleteMany'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof DeleteSpendingNote_dto_1.DeleteSpendingNoteDto !== "undefined" && DeleteSpendingNote_dto_1.DeleteSpendingNoteDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "deleteManySpendingNoteController", null);
__decorate([
    (0, common_1.Delete)(':spendingNoteId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note deleted' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Param)('spendingNoteId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "deleteOneSpendingNoteController", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "getSpendingNoteController", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiQuery)({
        name: 'searchKey',
        required: true,
        type: String,
        description: 'The search key',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "searchSpendingNoteController", null);
__decorate([
    (0, common_1.Get)('get-by-cate/:spendingCateId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('spendingCateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object, String]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "getSpendingsByCateCotroller", null);
__decorate([
    (0, common_1.Get)('filter-by-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Filter spending note by date create' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _p : Object, typeof (_q = typeof FilterSpendingNote_dto_1.QueryDateSpendingNoteDto !== "undefined" && FilterSpendingNote_dto_1.QueryDateSpendingNoteDto) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "filterSpendingNoteController", null);
__decorate([
    (0, common_1.Get)('statistic-option-day'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Statistic spending note of day spending' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Statistic spending note of day spending' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _r : Object, typeof (_s = typeof FilterSpendingNote_dto_1.QueryDateSpendingNoteDto !== "undefined" && FilterSpendingNote_dto_1.QueryDateSpendingNoteDto) === "function" ? _s : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "statisticSpendingNoteOfDayController", null);
__decorate([
    (0, common_1.Get)('statistic-option-month'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Statistic spending note of month' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _t : Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "statisticSpendingNoteOfMonthController", null);
__decorate([
    (0, common_1.Get)('statistic-option-year'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _u : Object, Number]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "statisticSpendingNoteOfYearController", null);
__decorate([
    (0, common_1.Get)('statistic-option-cate'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Statistic spending note by category' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _v : Object, typeof (_w = typeof FilterSpendingNote_dto_1.QueryDateSpendingNoteDto !== "undefined" && FilterSpendingNote_dto_1.QueryDateSpendingNoteDto) === "function" ? _w : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "statisticSpendingNoteByCateController", null);
__decorate([
    (0, common_1.Get)('notify-out-of-money'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Notify spending note' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _x : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "notifySpendingNoteController", null);
__decorate([
    (0, common_1.Get)('statistic-spending'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Statistic spending note' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _y : Object, typeof (_z = typeof StatictisSpendingNote_dto_1.StatisticsSpendingDto !== "undefined" && StatictisSpendingNote_dto_1.StatisticsSpendingDto) === "function" ? _z : Object]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "statisticSpendingController", null);
__decorate([
    (0, common_1.Delete)('delete-all-by-cate/:cateId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Spending note deleted' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _0 : Object, String]),
    __metadata("design:returntype", Promise)
], SpendingnoteController.prototype, "deleteAllSpendingNoteByCateController", null);
exports.SpendingnoteController = SpendingnoteController = __decorate([
    (0, swagger_1.ApiTags)('spending note'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('spendingnote'),
    __metadata("design:paramtypes", [typeof (_a = typeof spendingnote_service_1.SpendingNoteService !== "undefined" && spendingnote_service_1.SpendingNoteService) === "function" ? _a : Object])
], SpendingnoteController);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSpendingNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateSpendingNoteDto {
}
exports.CreateSpendingNoteDto = CreateSpendingNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpendingNoteDto.prototype, "cateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpendingNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpendingNoteDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending date ',
        example: '2021-08-12'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateSpendingNoteDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method ',
        example: 'cash'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpendingNoteDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of spending note ',
        example: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Max)(10000000000000),
    __metadata("design:type", Number)
], CreateSpendingNoteDto.prototype, "amount", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSpendingNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateSpendingNoteDto {
}
exports.UpdateSpendingNoteDto = UpdateSpendingNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending note id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSpendingNoteDto.prototype, "spendingNoteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpendingNoteDto.prototype, "cateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpendingNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpendingNoteDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending date ',
        example: '2021-08-12'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateSpendingNoteDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method ',
        example: 'cash'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSpendingNoteDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of spending note ',
        example: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSpendingNoteDto.prototype, "amount", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteSpendingNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class DeleteSpendingNoteDto {
}
exports.DeleteSpendingNoteDto = DeleteSpendingNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending note id ',
        example: ['64d123j231223221']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], DeleteSpendingNoteDto.prototype, "spendingNoteId", void 0);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryDateSpendingNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(50);
class QueryDateSpendingNoteDto {
}
exports.QueryDateSpendingNoteDto = QueryDateSpendingNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date ',
        example: '2024-05-20'
    }),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], QueryDateSpendingNoteDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date ',
        example: '2024-05-28'
    }),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], QueryDateSpendingNoteDto.prototype, "endDate", void 0);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsSpendingDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
const class_transformer_1 = __webpack_require__(52);
class StatisticsSpendingDto {
}
exports.StatisticsSpendingDto = StatisticsSpendingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by month or year',
        example: 'month'
    }),
    (0, class_validator_1.IsEnum)(['month', 'year']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StatisticsSpendingDto.prototype, "filterBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items',
        example: 6
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StatisticsSpendingDto.prototype, "numberOfItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: '60b4c5e5d1b7e30015c5f3d8',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StatisticsSpendingDto.prototype, "cateId", void 0);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(6);
const admin_service_1 = __webpack_require__(42);
const admin_controller_1 = __webpack_require__(74);
const mongoose_1 = __webpack_require__(7);
const admin_schema_1 = __webpack_require__(43);
const config_1 = __webpack_require__(8);
const role_module_1 = __webpack_require__(79);
const role_schema_1 = __webpack_require__(44);
const abilities_factory_1 = __webpack_require__(40);
const redis_module_1 = __webpack_require__(65);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            (0, common_1.forwardRef)(() => role_module_1.RoleModule),
            mongoose_1.MongooseModule.forFeature([{ name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema }, { name: role_schema_1.Role.name, schema: role_schema_1.RoleSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, abilities_factory_1.AbilityFactory,],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(6);
const admin_service_1 = __webpack_require__(42);
const createAdmin_dto_1 = __webpack_require__(75);
const updateAdmin_dto_1 = __webpack_require__(76);
const deleteAdmin_dto_1 = __webpack_require__(77);
const blockAdmin_dto_1 = __webpack_require__(78);
const swagger_1 = __webpack_require__(36);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
const redis_service_1 = __webpack_require__(27);
let AdminController = class AdminController {
    constructor(adminService, redisService) {
        this.adminService = adminService;
        this.redisService = redisService;
    }
    async createAdminController(createAdminDto) {
        const result = await this.adminService.createAdminService(createAdminDto.fullname, createAdminDto.email, createAdminDto.password, createAdminDto.roleId);
        await this.redisService.setJSON(`admin:${result._id}`, '$', JSON.stringify(result));
        await this.redisService.delJSON('admin:all', '$');
        return result;
    }
    async updateAdmincontroller(updateAdminDto) {
        const result = await this.adminService.updateAdminService(updateAdminDto.id, updateAdminDto.fullname, updateAdminDto.email, updateAdminDto.password, updateAdminDto.roleId);
        await this.redisService.setJSON(`admin:${updateAdminDto.id}`, '$', JSON.stringify(result));
        await this.redisService.delJSON('admin:all', '$');
        return result;
    }
    async deleteAdminController(deleteAdminDto) {
        const result = await this.adminService.deleteAdminService(deleteAdminDto.id);
        await this.redisService.delJSON(`admin:${deleteAdminDto.id}`, '$');
        await this.redisService.delJSON('admin:all', '$');
        return result;
    }
    async listAdminController() {
        const cachedAdmins = await this.redisService.getJSON('admin:all', '$');
        if (cachedAdmins) {
            return cachedAdmins;
        }
        const result = await this.adminService.listAdminService();
        await this.redisService.setJSON('admin:all', '$', JSON.stringify(result));
        return result;
    }
    async blockAdminController(blockAdminDto) {
        const result = await this.adminService.blockAdminService(blockAdminDto.id, blockAdminDto.isBlock);
        const cachedAdmin = await this.redisService.getJSON(`admin:${blockAdminDto.id}`, '$');
        if (cachedAdmin) {
            const admin = JSON.parse(cachedAdmin.toString());
            admin.isBlock = blockAdminDto.isBlock;
            await this.redisService.set(`admin:${blockAdminDto.id}`, JSON.stringify(admin));
        }
        await this.redisService.delJSON('admin:all', '$');
        return result;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, casl_decorator_1.Subject)('admin'),
    (0, casl_decorator_1.Action)('create'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Admin created successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof createAdmin_dto_1.CreateAdminDto !== "undefined" && createAdmin_dto_1.CreateAdminDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdminController", null);
__decorate([
    (0, casl_decorator_1.Action)('update'),
    (0, casl_decorator_1.Subject)('admin'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Admin updated successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof updateAdmin_dto_1.UpdateAdminDto !== "undefined" && updateAdmin_dto_1.UpdateAdminDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmincontroller", null);
__decorate([
    (0, casl_decorator_1.Action)('delete'),
    (0, casl_decorator_1.Subject)('admin'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Admin deleted successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof deleteAdmin_dto_1.DeleteAdminDto !== "undefined" && deleteAdmin_dto_1.DeleteAdminDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdminController", null);
__decorate([
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('admin'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Admin listed successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listAdminController", null);
__decorate([
    (0, casl_decorator_1.Action)('block'),
    (0, casl_decorator_1.Subject)('admin'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Admin blocked successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Patch)('update-block'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof blockAdmin_dto_1.BlockAdminDto !== "undefined" && blockAdmin_dto_1.BlockAdminDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "blockAdminController", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object, typeof (_b = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _b : Object])
], AdminController);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAdminDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the admin',
        example: 'Admin1'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of the admin',
        example: 'admin1@gmail.com'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password of the admin',
        example: 'Admin@123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role of the admin',
        example: '["66445e3ad052f97add5912c1","66445e3ad052f97add5912c1"]'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateAdminDto.prototype, "roleId", void 0);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAdminDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateAdminDto {
}
exports.UpdateAdminDto = UpdateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of the admin',
        example: '60e1d0b5d8f1f40015e4e8b0',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the admin',
        example: 'Admin1',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "fullname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of the admin',
        example: 'admin1@gmail.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password of the admin',
        example: 'Admin@123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role of the admin',
        example: ['66445e3ad052f97add5912c1', '66445e3ad052f97add5912c1'],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateAdminDto.prototype, "roleId", void 0);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteAdminDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class DeleteAdminDto {
}
exports.DeleteAdminDto = DeleteAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of the admin',
        example: '60e1d0b5d8f1f40015e4e8b0',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], DeleteAdminDto.prototype, "id", void 0);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlockAdminDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class BlockAdminDto {
}
exports.BlockAdminDto = BlockAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of the admin',
        example: '66445e3ad052f97add5912c1'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BlockAdminDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Block status of the admin',
        example: 'true'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], BlockAdminDto.prototype, "isBlock", void 0);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleModule = void 0;
const common_1 = __webpack_require__(6);
const role_service_1 = __webpack_require__(80);
const role_controller_1 = __webpack_require__(81);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const role_schema_1 = __webpack_require__(44);
const abilities_factory_1 = __webpack_require__(40);
const admin_module_1 = __webpack_require__(73);
const redis_module_1 = __webpack_require__(65);
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => admin_module_1.AdminModule),
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: role_schema_1.Role.name, schema: role_schema_1.RoleSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [role_controller_1.RoleController],
        providers: [role_service_1.RoleService, abilities_factory_1.AbilityFactory],
        exports: [role_service_1.RoleService],
    })
], RoleModule);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const role_schema_1 = __webpack_require__(44);
const admin_service_1 = __webpack_require__(42);
const redis_service_1 = __webpack_require__(27);
let RoleService = class RoleService {
    constructor(roleModel, adminService, redisService) {
        this.roleModel = roleModel;
        this.adminService = adminService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async getCache(key) {
        const cachedData = await this.redisService.getJSON(key, '$');
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return null;
    }
    async createRoleService(name, permissionID) {
        const role = await this.roleModel.findOne({ name }).exec();
        if (role) {
            throw new common_1.BadRequestException('Role already exists');
        }
        const newRole = new this.roleModel({ name, permissionID });
        await newRole.save();
        await this.deleteCache('roles:all');
        await this.setCache(`role:${newRole.id}`, newRole);
        return newRole;
    }
    async updateRoleService(id, name, permissionIDs) {
        const role = await this.roleModel.findById(id).exec();
        if (!role) {
            throw new common_1.BadRequestException('Role does not exist.');
        }
        if (name) {
            const roleDuplicate = await this.roleModel.findOne({ name }).exec();
            if (roleDuplicate && roleDuplicate._id.toString() !== id) {
                throw new common_1.BadRequestException('Role name already exists.');
            }
            role.name = name;
        }
        if (permissionIDs) {
            role.permissionID = permissionIDs;
        }
        await role.save();
        await this.setCache(`role:${id}`, role);
        await this.deleteCache('roles:all');
        return role;
    }
    async findRoleService(ids) {
        const cacheKeys = ids.map((id) => `role:${id}`);
        const cachedRoles = await Promise.all(cacheKeys.map((key) => this.getCache(key)));
        const missedCacheIndices = cachedRoles
            .map((role, index) => (role ? null : index))
            .filter((index) => index !== null);
        const missedCacheIds = missedCacheIndices.map((index) => ids[index]);
        if (missedCacheIds.length === 0) {
            return cachedRoles.map((role) => JSON.parse(role));
        }
        else {
            const rolesFromDb = await this.roleModel
                .find({ _id: { $in: missedCacheIds } })
                .exec();
            await Promise.all(rolesFromDb.map((role) => this.setCache(`role:${role.id}`, JSON.stringify(role))));
            const rolesFromCache = cachedRoles
                .filter((role) => role !== null)
                .map((role) => JSON.parse(role));
            return [...rolesFromCache, ...rolesFromDb];
        }
    }
    async viewlistRoleService() {
        const cacheKey = 'roles:all';
        let cachedRoles = await this.getCache(cacheKey);
        if (cachedRoles) {
            cachedRoles = JSON.parse(cachedRoles);
            return cachedRoles;
        }
        const roles = await this.roleModel.find().lean().exec();
        await this.setCache(cacheKey, JSON.stringify(roles));
        return roles;
    }
    async deleteRoleService(id) {
        try {
            const checkRoleExistInAdmin = await this.adminService.findOneAdminbyIdRoleService(id);
            if (checkRoleExistInAdmin) {
                throw new common_1.BadRequestException('Role exists in admin');
            }
            const role = await this.roleModel.findById(id).exec();
            if (!role) {
                throw new common_1.BadRequestException('Role not exists');
            }
            await this.roleModel.findByIdAndDelete(id).exec();
            await this.deleteCache('roles:all');
            await this.deleteCache(`role:${id}`);
            return { message: 'Role deleted successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting role');
        }
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], RoleService);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleController = void 0;
const common_1 = __webpack_require__(6);
const role_service_1 = __webpack_require__(80);
const createrole_dto_1 = __webpack_require__(82);
const updaterole_dto_1 = __webpack_require__(83);
const deleterole_dto_1 = __webpack_require__(84);
const swagger_1 = __webpack_require__(36);
const casl_decorator_1 = __webpack_require__(46);
const permission_gaurd_1 = __webpack_require__(39);
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async createRoleController(role) {
        await this.roleService.createRoleService(role.name, role.permissionID);
        return { message: 'Role created successfully' };
    }
    async updateRoleController(updateRoleDto) {
        await this.roleService.updateRoleService(updateRoleDto._id, updateRoleDto.name, updateRoleDto.permissionID);
        return { message: 'Role updated successfully' };
    }
    async viewlistRoleController() {
        const data = await this.roleService.viewlistRoleService();
        return { data };
    }
    async deleteRoleController(deleteRoleDto) {
        return this.roleService.deleteRoleService(deleteRoleDto.id);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('create'),
    (0, casl_decorator_1.Subject)('role'),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Role created successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof createrole_dto_1.CreateRoleDto !== "undefined" && createrole_dto_1.CreateRoleDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "createRoleController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('update'),
    (0, casl_decorator_1.Subject)('role'),
    (0, swagger_1.ApiOkResponse)({ description: 'Role updated successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof updaterole_dto_1.UpdateRoleDto !== "undefined" && updaterole_dto_1.UpdateRoleDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], RoleController.prototype, "updateRoleController", null);
__decorate([
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('role'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all roles' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], RoleController.prototype, "viewlistRoleController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('delete'),
    (0, casl_decorator_1.Subject)('role'),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete user success' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof deleterole_dto_1.DeleteRoleDto !== "undefined" && deleterole_dto_1.DeleteRoleDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRoleController", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('role'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('role'),
    __metadata("design:paramtypes", [typeof (_a = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _a : Object])
], RoleController);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRoleDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateRoleDto {
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of role ',
        example: 'admin'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission of role ',
        example: [0, 1, 2],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateRoleDto.prototype, "permissionID", void 0);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateRoleDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Id of role ',
        example: '60e1d0b5d8f1f40015e4e8b0',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of role ',
        example: 'admin',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission of role ',
        example: [0, 1, 2],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], UpdateRoleDto.prototype, "permissionID", void 0);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteRoleDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class DeleteRoleDto {
}
exports.DeleteRoleDto = DeleteRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'role_id of role',
        example: '5f2a5c1b4f9d550017c3d4d7'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteRoleDto.prototype, "id", void 0);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EncryptionModule = void 0;
const common_1 = __webpack_require__(6);
const encryption_service_1 = __webpack_require__(31);
const users_module_1 = __webpack_require__(9);
let EncryptionModule = class EncryptionModule {
};
exports.EncryptionModule = EncryptionModule;
exports.EncryptionModule = EncryptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule)
        ],
        providers: [encryption_service_1.EncryptionService],
        exports: [encryption_service_1.EncryptionService],
    })
], EncryptionModule);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const auth_controller_1 = __webpack_require__(87);
const auth_service_1 = __webpack_require__(88);
const users_module_1 = __webpack_require__(9);
const jwt_1 = __webpack_require__(35);
const config_1 = __webpack_require__(8);
const mailer_module_1 = __webpack_require__(98);
const seed_module_1 = __webpack_require__(100);
const admin_module_1 = __webpack_require__(73);
const role_module_1 = __webpack_require__(79);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            role_module_1.RoleModule,
            admin_module_1.AdminModule,
            seed_module_1.SeedModule,
            users_module_1.UsersModule,
            mailer_module_1.MailerModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(6);
const express_1 = __webpack_require__(47);
const swagger_1 = __webpack_require__(36);
const auth_service_1 = __webpack_require__(88);
const index_1 = __webpack_require__(92);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerController(register) {
        return await this.authService.registerService(register.email, register.password, register.username, register.firstname, register.lastname);
    }
    async loginController(user, response) {
        const loginResult = await this.authService.loginService(user.account, user.password);
        response.cookie('token', loginResult.access_token);
        return { message: 'successfully', data: loginResult };
    }
    async refreshTokenController(refreshToken) {
        return await this.authService.refreshTokenService(refreshToken.refreshToken);
    }
    async logoutController(refreshToken) {
        return await this.authService.logoutService(refreshToken.refreshToken);
    }
    async forgotPasswordController(forgotPassword) {
        return await this.authService.forgotPasswordService(forgotPassword.email);
    }
    async resetPasswordController(resetPassword) {
        const result = await this.authService.resetPasswordService(resetPassword.code, resetPassword.newPassword);
        return {
            ...result,
            statusCode: 201,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiCreatedResponse)({ description: 'register successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof index_1.RegisterDto !== "undefined" && index_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerController", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'login successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof index_1.LoginDto !== "undefined" && index_1.LoginDto) === "function" ? _c : Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginController", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOkResponse)({ description: 'refresh token successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Patch)('refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof index_1.RefreshTokenDto !== "undefined" && index_1.RefreshTokenDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokenController", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOkResponse)({ description: 'logout successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Patch)('logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof index_1.RefreshTokenDto !== "undefined" && index_1.RefreshTokenDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], AuthController.prototype, "logoutController", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOkResponse)({ description: 'sent code successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof index_1.ForgotPasswordDto !== "undefined" && index_1.ForgotPasswordDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPasswordController", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOkResponse)({ description: 'reset password successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, common_1.Put)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof index_1.ResetPasswordDto !== "undefined" && index_1.ResetPasswordDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], AuthController.prototype, "resetPasswordController", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('authentication'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(35);
const users_service_1 = __webpack_require__(11);
const mailer_service_1 = __webpack_require__(89);
const crypto_1 = __webpack_require__(32);
const bcrypt = __webpack_require__(45);
const seeds_service_1 = __webpack_require__(91);
const admin_service_1 = __webpack_require__(42);
const role_service_1 = __webpack_require__(80);
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailerService, seedsService, adminService, roleService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.seedsService = seedsService;
        this.adminService = adminService;
        this.roleService = roleService;
    }
    async createJwtPayload(accountHolder, isUser) {
        if (isUser) {
            return {
                _id: accountHolder._id,
                role: accountHolder.role,
                isBlock: accountHolder.isBlock,
                rankID: accountHolder.rankID,
                sub: accountHolder._id,
            };
        }
        else {
            const roles = await this.roleService.findRoleService(accountHolder.role.map(String));
            return {
                _id: accountHolder._id,
                email: accountHolder.email,
                fullname: accountHolder.fullname,
                role: roles,
            };
        }
    }
    async registerService(email, password, username, firstname, lastname) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const createRefreshToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const user = await this.usersService.createUserService(email, hashedPassword, username, firstname, lastname, createRefreshToken);
            if ('message' in user) {
                throw new common_1.BadRequestException(user.message);
            }
            const payload = await this.createJwtPayload(user, true);
            await this.seedsService.createDefaultSpenCate(user._id);
            await this.seedsService.createDefaultIncomeCate(user._id);
            return {
                access_token: this.jwtService.sign(payload),
                refresh_token: createRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async loginService(account, password) {
        try {
            const user = await this.usersService.findOneEmailOrUsernameService(account);
            const admin = await this.adminService.findOneAdminEmailService(account);
            const accountHolder = user || admin;
            if (!accountHolder) {
                throw new common_1.UnauthorizedException('Account not found');
            }
            if (!(await bcrypt.compare(password, accountHolder.password))) {
                throw new common_1.UnauthorizedException('Password is incorrect');
            }
            if (accountHolder.isBlock) {
                throw new common_1.UnauthorizedException('Account is blocked');
            }
            const createRefreshToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const payload = await this.createJwtPayload(accountHolder, !!user);
            const returnedUser = user
                ? {
                    email: user.email,
                    role: user.role,
                    _id: user._id,
                    avatar: user.avatar,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    address: user.address,
                    dateOfBirth: user.dateOfBirth,
                    description: user.description,
                    gender: user.gender,
                    nickname: user.nickname,
                    phone: user.phone,
                    dateAttendance: user.rankScore?.attendance?.dateAttendance ?? null,
                }
                : {
                    fullname: admin.fullname,
                    email: admin.email,
                    role: await this.roleService.findRoleService(admin.role.map(String)),
                    _id: admin._id,
                };
            if (user) {
                await this.usersService.updateRefreshTokenService(account, createRefreshToken);
            }
            else if (admin) {
                await this.adminService.updateRefreshTokenService(account, createRefreshToken);
            }
            return {
                access_token: this.jwtService.sign(payload),
                refreshToken: createRefreshToken,
                user: returnedUser,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async refreshTokenService(refreshToken) {
        try {
            const user = await this.usersService.findOneReTokenService(refreshToken);
            const admin = await this.adminService.findOneAdminRefreshTokenService(refreshToken);
            const accountHolder = user || admin;
            if (!accountHolder) {
                throw new Error('refresh Token not found');
            }
            if (accountHolder.isBlock) {
                throw new common_1.UnauthorizedException('Account is blocked');
            }
            const createRefreshToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const payload = await this.createJwtPayload(accountHolder, !!user);
            if (user) {
                await this.usersService.updateRefreshTokenService(user.email, createRefreshToken);
            }
            else if (admin) {
                await this.adminService.updateRefreshTokenService(admin.email, createRefreshToken);
            }
            return {
                access_token: this.jwtService.sign(payload),
                refreshToken: createRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async logoutService(refreshToken) {
        try {
            const user = await this.usersService.findOneReTokenService(refreshToken);
            const admin = await this.adminService.findOneAdminRefreshTokenService(refreshToken);
            const accountHolder = user || admin;
            if (!accountHolder) {
                throw new Error('refresh Token not found');
            }
            if (user) {
                await this.usersService.updateRefreshTokenService(user.email, null);
            }
            else if (admin) {
                await this.adminService.updateRefreshTokenService(admin.email, null);
            }
            return { message: 'Logout successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async forgotPasswordService(email) {
        const munitesExp = 5;
        const authCode = Math.floor(100000 + Math.random() * 900000).toString();
        const now = new Date();
        const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const expiredCode = new Date(vnTime.getTime() + munitesExp * 60000);
        try {
            const saveDate = await this.usersService.updateCodeService(email, authCode, expiredCode);
            if (!saveDate || saveDate === null) {
                throw new common_1.BadRequestException('Email not found');
            }
            await this.mailerService.sendEmailWithCode(email, authCode);
            return { statusCode: 202, message: 'Email sent successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('something went wrong with email. please try again');
        }
    }
    async resetPasswordService(code, newPassword) {
        try {
            const user = await this.usersService.findOneCodeService(code);
            const hashPassword = await bcrypt.hash(newPassword, 10);
            if (!user || user === null) {
                throw new common_1.BadRequestException('Code is incorrect');
            }
            const now = new Date();
            const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
            if (user.authCode.expiredAt < vnTime) {
                throw new common_1.BadRequestException('Code is expired');
            }
            await this.usersService.updatePasswordService(code, hashPassword);
            return { message: 'Password reset successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async handleVerifyTokenService(token) {
        try {
            const Payload = this.jwtService.verify(token);
            return Payload['_id'];
        }
        catch (error) {
            throw new common_1.BadRequestException('Token is invalid');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof mailer_service_1.MailerService !== "undefined" && mailer_service_1.MailerService) === "function" ? _c : Object, typeof (_d = typeof seeds_service_1.SeedsService !== "undefined" && seeds_service_1.SeedsService) === "function" ? _d : Object, typeof (_e = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _e : Object, typeof (_f = typeof role_service_1.RoleService !== "undefined" && role_service_1.RoleService) === "function" ? _f : Object])
], AuthService);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailerService = void 0;
const common_1 = __webpack_require__(6);
const nodemailer = __webpack_require__(90);
const users_service_1 = __webpack_require__(11);
let MailerService = class MailerService {
    constructor(usersService) {
        this.usersService = usersService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            from: 'support@daiquangia.com',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }
    async sendEmailWithCode(email, code) {
        const mailOptions = {
            to: email,
            subject: 'DaiQuanGia - Password Reset Instructions',
            html: `
      <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #fff;
    }
  </style>
  <body style="background-color: #25293c">
    <div
      style="
        max-width: 800px;
        margin: 0 auto;
        background-color: #2f3349;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
      "
    >
      <div
        style="
          background-color: #7367f0;
          text-align: center;
          color: #fff;
          margin-bottom: 10px;
          height: 100px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        "
      >
        <h1 style="text-transform: uppercase; padding-top: 27px">
          Dai quan gia
        </h1>
      </div>
      <div style="padding: 20px">
        <h4 style="margin-bottom: 10px; color: #fff">Dear user,</h4>
        <p style="color: #fff">
          We received a request to reset your password for your DaiQuanGia
          account.
        </p>
        <p style="margin-bottom: 10px; color: #fff">
          Here is your password reset code:
        </p>

        <div
          style="
            margin-bottom: 10px;
            font-size: 46px;
            font-weight: bold;
            text-align: center;
            color: #fff;
          "
        >
          <p>${code}</p>
        </div>

        <p style="margin-bottom: 15px; color: #fff">
          If you did not request a password reset, please ignore this email or
          reply to let us know. This password reset is only valid for the next
          5 minutes.
        </p>

        <p style="color: #fff">Thank you, DaiQuanGia Support Team</p>
      </div>
    </div>`,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId, code);
    }
    async sendEmailNotification(userId, schedules) {
        const user = await this.usersService.findUserByIdService(userId);
        const email = user.email;
        if (!schedules || schedules.length === 0) {
            console.error('No schedules to notify for user', userId);
            return;
        }
        const scheduleDetails = schedules.map((schedule) => {
            return `
      <p style="margin-bottom: 10px; color: #fff">
        <strong>Title:</strong> ${schedule.title}
      </p>
      <p style="margin-bottom: 10px; color: #fff">
        <strong>Location:</strong> ${schedule.location}
      </p>
      <p style="margin-bottom: 10px; color: #fff">
        <strong>Start:</strong> ${schedule.startDateTime}
      </p>
      <p style="margin-bottom: 10px; color: #fff">
        <strong>End:</strong> ${schedule.endDateTime}
      </p>
      <p style="margin-bottom: 10px; color: #fff">
        <strong>Note:</strong> ${schedule.note || 'N/A'}
      </p>
    `;
        }).join('<br>');
        const mailOptions = {
            to: email,
            subject: 'DaiQuanGia - Notification',
            html: `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          color: #fff;        }
      </style>
      <body style="background-color: #25293c">
        <div
          style="
            max-width: 800px;
            margin: 0 auto;
            background-color: #2f3349;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
          "
        >
          <div
            style="
              background-color: #7367f0;
              text-align: center;
              color: #fff;
              margin-bottom: 10px;
              height: 100px;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            "
          >
            <h1 style="text-transform: uppercase; padding-top: 27px">
              Dai quan gia
            </h1>
          </div>
          <div style="padding: 20px">
            <h4 style="margin-bottom: 10px; color: #fff">Dear user,</h4>
            <p style="color: #fff">
              You have a new schedule notification.
            </p>
            ${scheduleDetails}
            <p style="color: #fff">
              Thank you, DaiQuanGia Support Team
            </p>
          </div>
        </div>`,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], MailerService);


/***/ }),
/* 90 */
/***/ ((module) => {

"use strict";
module.exports = require("nodemailer");

/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedsService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const category_schema_1 = __webpack_require__(24);
let SeedsService = class SeedsService {
    constructor(seedModel) {
        this.seedModel = seedModel;
    }
    async createDefaultSpenCate(userId) {
        const categories = [
            { name: 'Food', description: 'Food Category', type: 'spend', icon: 'mdi:food-outline', color: '#FF0000' },
            { name: 'Relax', description: 'Relax Category,', type: 'spend', icon: 'mingcute:happy-line', color: '#006769' },
            { name: 'Shopping', description: 'Shopping Category', type: 'spend', icon: 'mingcute:shopping-bag-1-line', color: '#FFBF00' },
            { name: 'Chilling', description: 'Chilling Category', type: 'spend', icon: 'material-symbols:relax-outline', color: '#3572EF' },
        ];
        return this.createCategories(categories, userId);
    }
    async createDefaultIncomeCate(userId) {
        const categories = [
            { name: 'Salary', description: 'Salary Category', type: 'income', icon: 'fluent-emoji-high-contrast:money-bag', color: '#808836' },
            { name: 'Gift', description: 'Gift Category', type: 'income', icon: 'teenyicons:gift-outline,', color: '#D2649A' },
            { name: 'Award', description: 'Award Category', type: 'income', icon: 'healthicons:award-trophy-outline', color: '#FEB941' },
            { name: 'Bonus', description: 'Bonus Category', type: 'income', icon: 'solar:dollar-outline', color: '#808836' },
        ];
        return this.createCategories(categories, userId);
    }
    async createCategories(categories, userId) {
        const seeds = categories.map(category => {
            const newSeed = new this.seedModel({
                name: category.name,
                description: category.description,
                type: category.type,
                icon: category.icon,
                userId: userId,
            });
            return newSeed.save();
        });
        return Promise.all(seeds);
    }
};
exports.SeedsService = SeedsService;
exports.SeedsService = SeedsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], SeedsService);


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.RefreshTokenDto = exports.LoginDto = exports.RegisterDto = void 0;
const register_dto_1 = __webpack_require__(93);
Object.defineProperty(exports, "RegisterDto", ({ enumerable: true, get: function () { return register_dto_1.RegisterDto; } }));
const login_dto_1 = __webpack_require__(94);
Object.defineProperty(exports, "LoginDto", ({ enumerable: true, get: function () { return login_dto_1.LoginDto; } }));
const refreshToken_dto_1 = __webpack_require__(95);
Object.defineProperty(exports, "RefreshTokenDto", ({ enumerable: true, get: function () { return refreshToken_dto_1.RefreshTokenDto; } }));
const forgotPassword_dto_1 = __webpack_require__(96);
Object.defineProperty(exports, "ForgotPasswordDto", ({ enumerable: true, get: function () { return forgotPassword_dto_1.ForgotPasswordDto; } }));
const resetPassword_dto_1 = __webpack_require__(97);
Object.defineProperty(exports, "ResetPasswordDto", ({ enumerable: true, get: function () { return resetPassword_dto_1.ResetPasswordDto; } }));


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of user ',
        example: 'xuanchimto'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'firstname of user',
        example: 'Nguyên Lê Minh'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of user ',
        example: 'Xuân'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user ',
        example: 'xuanchimto@gmail.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsEmail)({}, { message: 'please enter correct email' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password of user ',
        example: 'Xuanchimto123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user or username',
        example: 'xuanchimto@gmail.com'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "account", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Username of user ',
        example: 'Xuanchimto123'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refresh token',
        example: 'string'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of user ',
        example: 'xuanchimto@gmail.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsEmail)({}, { message: 'please enter correct email' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code',
        example: 'string'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password',
        example: 'string'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailerModule = void 0;
const common_1 = __webpack_require__(6);
const mailer_service_1 = __webpack_require__(89);
const mailer_controller_1 = __webpack_require__(99);
const config_1 = __webpack_require__(8);
const users_module_1 = __webpack_require__(9);
let MailerModule = class MailerModule {
};
exports.MailerModule = MailerModule;
exports.MailerModule = MailerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [mailer_controller_1.MailerController],
        providers: [mailer_service_1.MailerService],
        exports: [mailer_service_1.MailerService],
    })
], MailerModule);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailerController = void 0;
const common_1 = __webpack_require__(6);
const mailer_service_1 = __webpack_require__(89);
let MailerController = class MailerController {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
};
exports.MailerController = MailerController;
exports.MailerController = MailerController = __decorate([
    (0, common_1.Controller)('mailer'),
    __metadata("design:paramtypes", [typeof (_a = typeof mailer_service_1.MailerService !== "undefined" && mailer_service_1.MailerService) === "function" ? _a : Object])
], MailerController);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedModule = void 0;
const common_1 = __webpack_require__(6);
const seeds_service_1 = __webpack_require__(91);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const category_schema_1 = __webpack_require__(24);
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        providers: [seeds_service_1.SeedsService],
        exports: [seeds_service_1.SeedsService],
    })
], SeedModule);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomenoteModule = void 0;
const common_1 = __webpack_require__(6);
const incomenote_service_1 = __webpack_require__(102);
const incomenote_controller_1 = __webpack_require__(104);
const category_module_1 = __webpack_require__(57);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const incomenote_schema_1 = __webpack_require__(103);
const redis_module_1 = __webpack_require__(65);
let IncomenoteModule = class IncomenoteModule {
};
exports.IncomenoteModule = IncomenoteModule;
exports.IncomenoteModule = IncomenoteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            category_module_1.CategoryModule,
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: incomenote_schema_1.IncomeNote.name, schema: incomenote_schema_1.IncomeNoteSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [incomenote_controller_1.IncomenoteController],
        providers: [incomenote_service_1.IncomenoteService],
    })
], IncomenoteModule);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomenoteService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const incomenote_schema_1 = __webpack_require__(103);
const category_service_1 = __webpack_require__(23);
const remove_accents_1 = __webpack_require__(22);
const redis_service_1 = __webpack_require__(27);
let IncomenoteService = class IncomenoteService {
    constructor(incomeNoteModel, categoryService, redisService) {
        this.incomeNoteModel = incomeNoteModel;
        this.categoryService = categoryService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async createIncomeNoteService(userId, cateId, title, content, incomeDate, method, amount) {
        const checkExist = await this.categoryService.findOneCateService(userId, cateId);
        if (!checkExist) {
            throw new common_1.NotFoundException('Category not found');
        }
        const newIncomeNote = new this.incomeNoteModel({
            cateId,
            userId,
            title,
            content,
            incomeDate,
            method,
            amount,
        });
        await this.deleteCache(`incomeNotes:${userId}`);
        return newIncomeNote.save();
    }
    async updateIncomeNoteService(userId, incomeNoteId, cateId, title, content, incomeDate, method, amount) {
        const checkExist = await this.categoryService.findOneCateService(userId, cateId);
        if (!checkExist) {
            throw new common_1.NotFoundException('Category not found');
        }
        const updatedIncomeNote = await this.incomeNoteModel.findOneAndUpdate({ _id: incomeNoteId, userId }, { cateId, title, content, incomeDate, method, amount }, { new: true });
        if (!updatedIncomeNote) {
            throw new common_1.NotFoundException('Income note not found');
        }
        await this.deleteCache(`incomeNotes:${userId}`);
        return updatedIncomeNote;
    }
    async deleteIncomeNoteService(userId, incomeNoteId) {
        const incomeNote = await this.incomeNoteModel.findOneAndDelete({
            _id: incomeNoteId,
            userId,
        });
        if (!incomeNote) {
            throw new common_1.NotFoundException('Income note not found');
        }
        await this.deleteCache(`incomeNotes:${userId}`);
        return { message: 'Income note deleted successfully' };
    }
    async deleteManyIncomeNoteService(userId, filter) {
        const deleteFilter = { userId, ...filter };
        const result = await this.incomeNoteModel.deleteMany(deleteFilter).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('No income notes found to delete');
        }
        await this.deleteCache(`incomeNotes:${userId}`);
        return {
            message: `Deleted ${result.deletedCount} income notes successfully`,
        };
    }
    async viewAllIncomeNoteService(userId) {
        const cachedIncomeNotes = await this.redisService.getJSON(`incomeNotes:${userId}`, '$');
        if (cachedIncomeNotes) {
            return JSON.parse(cachedIncomeNotes);
        }
        const incomeNotes = await this.incomeNoteModel.find({ userId });
        const totalAmount = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
        await this.setCache(`incomeNotes:${userId}`, { totalAmount, incomeNotes });
        return { totalAmount, incomeNotes };
    }
    async getIncomeNoteByCategoryService(userId, cateId) {
        const cachedIncomeNotes = await this.redisService.getJSON(`incomeNotes:${userId}:${cateId}`, '$');
        if (cachedIncomeNotes) {
            console.log('Income notes fetched from cache successfully.');
            return JSON.parse(cachedIncomeNotes);
        }
        console.log('non cache.');
        const incomeNotes = await this.incomeNoteModel.find({ userId, cateId });
        return incomeNotes;
    }
    async searchIncomeNoteService(searchKey, userId) {
        try {
            const incomeNotes = await this.incomeNoteModel.find({ userId });
            const preprocessString = (str) => str ? (0, remove_accents_1.remove)(str).trim().toLowerCase() : '';
            const preprocessedSearchKey = preprocessString(searchKey || '');
            const regex = new RegExp(`${preprocessedSearchKey}`, 'i');
            const matchedIncomeNotes = incomeNotes.filter((note) => {
                const { title = '', content = '', amount = '' } = note;
                const [preprocessedTitle, preprocessedContent, preprocessedAmount] = [
                    title,
                    content,
                    amount.toString(),
                ].map((field) => preprocessString(field));
                return (regex.test(preprocessedTitle) ||
                    regex.test(preprocessedContent) ||
                    regex.test(preprocessedAmount));
            });
            if (matchedIncomeNotes.length === 0) {
                throw new common_1.NotFoundException('No income note found');
            }
            return { incomeNotes: matchedIncomeNotes };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async filterIncomeNoteByDateService(userId, startDate, endDate) {
        return this.incomeNoteModel.find({
            userId,
            incomeDate: { $gte: startDate, $lte: endDate },
        });
    }
    async statisticsIncomeNoteByDateService(userId, startDate, endDate) {
        const incomeNotes = await this.incomeNoteModel.find({ userId });
        const filteredIncomeNotes = incomeNotes.filter((note) => note.incomeDate >= startDate && note.incomeDate <= endDate);
        const totalAmount = filteredIncomeNotes.reduce((acc, note) => acc + note.amount, 0);
        return {
            totalAmount,
            totalIncomeNotes: filteredIncomeNotes.length,
        };
    }
    async statisticsIncomeNoteOptionDayService(userId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const incomeNotes = await this.incomeNoteModel.find({
            userId,
            incomeDate: { $gte: start, $lte: end },
        });
        const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
        const income = incomeNotes.map((note) => ({
            title: note.title,
            cost: note.amount,
        }));
        return {
            startDate: start,
            endDate: end,
            total,
            income,
        };
    }
    async statisticsIncomeNoteOptionMonthService(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const incomeNotes = await this.incomeNoteModel.find({
            userId,
            incomeDate: { $gte: startDate, $lte: endDate },
        });
        const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
        const income = incomeNotes.map((note) => ({
            title: note.title,
            cost: note.amount,
        }));
        return {
            startDate,
            endDate,
            total,
            income,
        };
    }
    async statisticsIncomeNoteOptionYearService(userId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const incomeNotes = await this.incomeNoteModel.find({
            userId,
            incomeDate: { $gte: startDate, $lte: endDate },
        });
        const total = incomeNotes.reduce((acc, note) => acc + note.amount, 0);
        const income = incomeNotes.map((note) => ({
            title: note.title,
            cost: note.amount,
        }));
        return {
            startDate,
            endDate,
            total,
            income,
        };
    }
    async statisticIncomeNoteService(userId, filterBy, numberOfItems, category) {
        let start, end;
        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth();
        switch (filterBy) {
            case 'month':
                start = new Date(Date.UTC(currentYear, currentMonth - numberOfItems + 1, 1));
                end = new Date(Date.UTC(currentYear, currentMonth, currentDate.getUTCDate(), 23, 59, 59));
                break;
            case 'year':
                start = new Date(Date.UTC(currentYear - numberOfItems + 1, 0, 1));
                end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
                break;
            case 'category':
                start = new Date(Date.UTC(currentYear, 0, 1));
                end = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
                break;
            default:
                throw new common_1.BadRequestException('Invalid filterBy value. Please use "month" or "year".');
        }
        const query = {
            incomeDate: { $gte: start, $lte: end },
            userId,
        };
        if (category) {
            query.cateId = category;
        }
        const incomeNotes = await this.incomeNoteModel.find(query).exec();
        let groupedIncomeDetails = {};
        if (filterBy === 'month') {
            let year = currentYear;
            let month = currentMonth;
            for (let i = 0; i < numberOfItems; i++) {
                const key = `${year}-${month + 1}`;
                groupedIncomeDetails[key] = {
                    totalAmount: 0,
                    items: [],
                };
                month -= 1;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
            }
        }
        else if (filterBy === 'year') {
            for (let i = 0; i < numberOfItems; i++) {
                const year = currentYear - i;
                groupedIncomeDetails[year] = {
                    totalAmount: 0,
                    items: [],
                };
            }
        }
        let totalAmount = 0;
        let highestAmount = 0;
        incomeNotes.forEach((note) => {
            const noteDate = new Date(note.incomeDate);
            const key = filterBy === 'month'
                ? `${noteDate.getUTCFullYear()}-${noteDate.getUTCMonth() + 1}`
                : noteDate.getUTCFullYear();
            if (groupedIncomeDetails[key]) {
                groupedIncomeDetails[key].totalAmount += note.amount;
                groupedIncomeDetails[key].items.push({
                    title: note.title,
                    amount: note.amount,
                    category: note.cateId,
                    incomeDate: note.incomeDate,
                });
                totalAmount += note.amount;
            }
        });
        for (const key in groupedIncomeDetails) {
            if (groupedIncomeDetails[key].totalAmount > highestAmount) {
                highestAmount = groupedIncomeDetails[key].totalAmount;
            }
        }
        return { start, end, highestAmount, totalAmount, groupedIncomeDetails };
    }
};
exports.IncomenoteService = IncomenoteService;
exports.IncomenoteService = IncomenoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(incomenote_schema_1.IncomeNote.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], IncomenoteService);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomeNoteSchema = exports.IncomeNote = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let IncomeNote = class IncomeNote extends mongoose_2.Document {
};
exports.IncomeNote = IncomeNote;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], IncomeNote.prototype, "cateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], IncomeNote.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], IncomeNote.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], IncomeNote.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date, required: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], IncomeNote.prototype, "incomeDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, enum: ['banking', 'cash'], defaut: 'cash', required: true }),
    __metadata("design:type", String)
], IncomeNote.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number }),
    __metadata("design:type", Number)
], IncomeNote.prototype, "amount", void 0);
exports.IncomeNote = IncomeNote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], IncomeNote);
exports.IncomeNoteSchema = mongoose_1.SchemaFactory.createForClass(IncomeNote);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomenoteController = void 0;
const incomenote_service_1 = __webpack_require__(102);
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(36);
const jwt = __webpack_require__(37);
const member_gaurd_1 = __webpack_require__(55);
const express_1 = __webpack_require__(47);
const CreateIncomeNote_dto_1 = __webpack_require__(105);
const UpdateIncomeNote_dto_1 = __webpack_require__(106);
const queryDate_dto_1 = __webpack_require__(107);
const statisticsincomeNote_1 = __webpack_require__(108);
const DeleteManyIncome_dto_1 = __webpack_require__(109);
let IncomenoteController = class IncomenoteController {
    constructor(incomenoteService) {
        this.incomenoteService = incomenoteService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createIncomeNoteController(request, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.createIncomeNoteService(userId, dto.cateId, dto.title, dto.content, dto.date, dto.method, dto.amount);
    }
    async updateIncomeNoteController(request, incomeNoteId, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.updateIncomeNoteService(userId, incomeNoteId, dto.cateId, dto.title, dto.content, dto.date, dto.method, dto.amount);
    }
    async deleteManyIncomeNoteController(request, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.deleteManyIncomeNoteService(userId, dto.incomeNoteIds);
    }
    async deleteIncomeNoteController(request, incomeNoteId) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.deleteIncomeNoteService(userId, incomeNoteId);
    }
    async getAllIncomeNoteController(request) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.viewAllIncomeNoteService(userId);
    }
    async getIncomeNoteByCategoryController(request, cateId) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.getIncomeNoteByCategoryService(userId, cateId);
    }
    async searchIncomeNoteController(request, searchKey) {
        const userId = this.getUserIdFromToken(request);
        console.log(searchKey);
        if (!searchKey) {
            throw new common_1.BadRequestException('Search query is required');
        }
        return this.incomenoteService.searchIncomeNoteService(searchKey, userId);
    }
    async filterIncomeNoteByDateController(request, query) {
        const userId = this.getUserIdFromToken(request);
        const { startDate, endDate } = query;
        if (!startDate || !endDate) {
            throw new common_1.BadRequestException('From and to date is required');
        }
        return this.incomenoteService.filterIncomeNoteByDateService(userId, startDate, endDate);
    }
    async staticticsIncomeNoteOptionDayController(request, query) {
        const { startDate, endDate } = query;
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.statisticsIncomeNoteOptionDayService(userId, startDate, endDate);
    }
    async staticticsIncomeNoteOptionMonthController(request, month, year) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.statisticsIncomeNoteOptionMonthService(userId, month, year);
    }
    async staticticsIncomeNoteOptionYearController(request, year) {
        const userId = this.getUserIdFromToken(request);
        return this.incomenoteService.statisticsIncomeNoteOptionYearService(userId, year);
    }
    async statisticSpendingController(req, dto) {
        const userId = this.getUserIdFromToken(req);
        return this.incomenoteService.statisticIncomeNoteService(userId, dto.filterBy, dto.numberOfItem, dto.cateId);
    }
};
exports.IncomenoteController = IncomenoteController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Income note created' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof CreateIncomeNote_dto_1.CreateIncomeNoteDto !== "undefined" && CreateIncomeNote_dto_1.CreateIncomeNoteDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], IncomenoteController.prototype, "createIncomeNoteController", null);
__decorate([
    (0, common_1.Put)(':incomeNoteId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Income note updated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('incomeNoteId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, String, typeof (_f = typeof UpdateIncomeNote_dto_1.UpdateIncomeNoteDto !== "undefined" && UpdateIncomeNote_dto_1.UpdateIncomeNoteDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], IncomenoteController.prototype, "updateIncomeNoteController", null);
__decorate([
    (0, common_1.Delete)('deleteMany'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Income note deleted' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof DeleteManyIncome_dto_1.DeleteManyIncomeDto !== "undefined" && DeleteManyIncome_dto_1.DeleteManyIncomeDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], IncomenoteController.prototype, "deleteManyIncomeNoteController", null);
__decorate([
    (0, common_1.Delete)(':incomeNoteId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Income note deleted' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('incomeNoteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object, String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], IncomenoteController.prototype, "deleteIncomeNoteController", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'All income note' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], IncomenoteController.prototype, "getAllIncomeNoteController", null);
__decorate([
    (0, common_1.Get)('get-by-cate/:cateId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _q : Object, String]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], IncomenoteController.prototype, "getIncomeNoteByCategoryController", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('searchKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _s : Object, String]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], IncomenoteController.prototype, "searchIncomeNoteController", null);
__decorate([
    (0, common_1.Get)('filter-by-date'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _u : Object, typeof (_v = typeof queryDate_dto_1.QueryDateDto !== "undefined" && queryDate_dto_1.QueryDateDto) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], IncomenoteController.prototype, "filterIncomeNoteByDateController", null);
__decorate([
    (0, common_1.Get)('statictics-option-day'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _x : Object, typeof (_y = typeof queryDate_dto_1.QueryDateDto !== "undefined" && queryDate_dto_1.QueryDateDto) === "function" ? _y : Object]),
    __metadata("design:returntype", typeof (_z = typeof Promise !== "undefined" && Promise) === "function" ? _z : Object)
], IncomenoteController.prototype, "staticticsIncomeNoteOptionDayController", null);
__decorate([
    (0, common_1.Get)('statictics-option-month'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _0 : Object, Number, Number]),
    __metadata("design:returntype", typeof (_1 = typeof Promise !== "undefined" && Promise) === "function" ? _1 : Object)
], IncomenoteController.prototype, "staticticsIncomeNoteOptionMonthController", null);
__decorate([
    (0, common_1.Get)('statictics-option-year'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_2 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _2 : Object, Number]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], IncomenoteController.prototype, "staticticsIncomeNoteOptionYearController", null);
__decorate([
    (0, common_1.Get)('statistics-income'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Statistic spending note' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_4 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _4 : Object, typeof (_5 = typeof statisticsincomeNote_1.StatisticsIncomeNoteDto !== "undefined" && statisticsincomeNote_1.StatisticsIncomeNoteDto) === "function" ? _5 : Object]),
    __metadata("design:returntype", Promise)
], IncomenoteController.prototype, "statisticSpendingController", null);
exports.IncomenoteController = IncomenoteController = __decorate([
    (0, swagger_1.ApiTags)('income note'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('incomenote'),
    __metadata("design:paramtypes", [typeof (_a = typeof incomenote_service_1.IncomenoteService !== "undefined" && incomenote_service_1.IncomenoteService) === "function" ? _a : Object])
], IncomenoteController);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateIncomeNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateIncomeNoteDto {
}
exports.CreateIncomeNoteDto = CreateIncomeNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncomeNoteDto.prototype, "cateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of income note ',
        example: 'salary'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncomeNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIncomeNoteDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending date ',
        example: '2021-08-12'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateIncomeNoteDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method ',
        example: 'cash'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncomeNoteDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of spending note ',
        example: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateIncomeNoteDto.prototype, "amount", void 0);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateIncomeNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateIncomeNoteDto {
}
exports.UpdateIncomeNoteDto = UpdateIncomeNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'category id ',
        example: '64d123j231223221'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateIncomeNoteDto.prototype, "cateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of income note ',
        example: 'salary'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateIncomeNoteDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of spending note ',
        example: 'Food'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIncomeNoteDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spending date ',
        example: '2021-08-12'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateIncomeNoteDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method ',
        example: 'cash'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateIncomeNoteDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of spending note ',
        example: 100
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateIncomeNoteDto.prototype, "amount", void 0);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryDateDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class QueryDateDto {
}
exports.QueryDateDto = QueryDateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'start date ',
        example: '2024-01-12',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], QueryDateDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'end date ',
        example: '2024-08-12',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], QueryDateDto.prototype, "endDate", void 0);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsIncomeNoteDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
const class_transformer_1 = __webpack_require__(52);
class StatisticsIncomeNoteDto {
}
exports.StatisticsIncomeNoteDto = StatisticsIncomeNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by month or year',
        example: 'month'
    }),
    (0, class_validator_1.IsEnum)(['month', 'year']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StatisticsIncomeNoteDto.prototype, "filterBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items',
        example: 6
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StatisticsIncomeNoteDto.prototype, "numberOfItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: '60b4c5e5d1b7e30015c5f3d8',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StatisticsIncomeNoteDto.prototype, "cateId", void 0);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteManyIncomeDto = void 0;
const swagger_1 = __webpack_require__(36);
class DeleteManyIncomeDto {
}
exports.DeleteManyIncomeDto = DeleteManyIncomeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of ids to delete',
        example: ['id1', 'id2'],
    }),
    __metadata("design:type", Array)
], DeleteManyIncomeDto.prototype, "incomeNoteIds", void 0);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebtModule = void 0;
const common_1 = __webpack_require__(6);
const debt_service_1 = __webpack_require__(111);
const debt_controller_1 = __webpack_require__(113);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const debt_schema_1 = __webpack_require__(112);
const encryption_module_1 = __webpack_require__(85);
const users_module_1 = __webpack_require__(9);
const redis_module_1 = __webpack_require__(65);
let DebtModule = class DebtModule {
};
exports.DebtModule = DebtModule;
exports.DebtModule = DebtModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            users_module_1.UsersModule,
            encryption_module_1.EncryptionModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Debt', schema: debt_schema_1.DebtSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [debt_controller_1.DebtController],
        providers: [debt_service_1.DebtService],
    })
], DebtModule);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebtService = void 0;
const common_1 = __webpack_require__(6);
const debt_schema_1 = __webpack_require__(112);
const mongoose_1 = __webpack_require__(12);
const mongoose_2 = __webpack_require__(7);
const encryption_service_1 = __webpack_require__(31);
const users_service_1 = __webpack_require__(11);
const redis_service_1 = __webpack_require__(27);
let DebtService = class DebtService {
    constructor(debtModel, encryptionService, usersService, redisService) {
        this.debtModel = debtModel;
        this.encryptionService = encryptionService;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async createDebtService(debtor, creditor, userId, amount, status, type, dueDate, description) {
        if (dueDate && dueDate < new Date()) {
            throw new common_1.BadRequestException('Due date must be in the future or today');
        }
        const newDebt = new this.debtModel({
            debtor,
            creditor,
            userId,
            amount,
            description,
            status,
            type,
            dueDate,
        });
        await this.deleteCache(`debts:${userId}:${type}`);
        await this.deleteCache(`debts:${userId}:due`);
        return newDebt.save();
    }
    async updateDebtService(debtId, userId, debtor, creditor, amount, type, dueDate, description) {
        const debt = await this.debtModel.findById({ _id: debtId, userId });
        if (!debt) {
            throw new common_1.BadRequestException('Debt not found');
        }
        if (dueDate && dueDate < new Date()) {
            throw new common_1.BadRequestException('Due date must be in the future or today');
        }
        if (debtor) {
            debt.debtor = debtor;
        }
        if (creditor) {
            debt.creditor = creditor;
        }
        if (amount) {
            debt.amount = amount;
        }
        if (type) {
            debt.type = type;
        }
        if (dueDate) {
            debt.dueDate = dueDate;
        }
        if (description) {
            debt.description = description;
        }
        await this.deleteCache(`debts:${userId}:${debt.type}`);
        await this.deleteCache(`debts:${userId}:due`);
        return debt.save();
    }
    async deleteDebtService(debtId, userId) {
        const debt = await this.debtModel.findOneAndDelete({ _id: debtId, userId });
        if (!debt) {
            throw new common_1.BadRequestException('Debt not found');
        }
        await this.deleteCache(`debts:${userId}:${debt.type}`);
        await this.deleteCache(`debts:${userId}:due`);
        return { message: 'Debt deleted successfully' };
    }
    async decryptDebtData(debt, userId) {
        const findUser = await this.usersService.findUserByIdService(userId);
        const encryptedKey = findUser.encryptKey;
        const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
        debt.isEncrypted = debt.isEncrypted;
        debt.debtor = this.encryptionService.decryptData(debt.debtor, decryptedKey);
        debt.creditor = this.encryptionService.decryptData(debt.creditor, decryptedKey);
        debt.description = debt.description
            ? this.encryptionService.decryptData(debt.description, decryptedKey)
            : undefined;
        return debt;
    }
    async getDebtByTypeService(userId, type) {
        const cachedDebts = await this.redisService.getJSON(`debts:${userId}:${type}`, '$');
        if (cachedDebts) {
            console.log('Debts fetched from cache successfully.');
            return JSON.parse(cachedDebts);
        }
        console.log('Debts fetched from database.');
        const debts = await this.debtModel.find({ userId, type });
        const findUser = await this.usersService.findUserByIdService(userId);
        const decryptedDebts = await Promise.all(debts.map((debt) => (debt.isEncrypted ? this.decryptDebtData(debt, findUser._id) : debt)));
        await this.setCache(`debts:${userId}:${type}`, decryptedDebts);
        return decryptedDebts;
    }
    async getDebtWhenDueService(userId) {
        const cachedDebts = await this.redisService.getJSON(`debts:${userId}:due`, '$');
        if (cachedDebts) {
            console.log('Debts fetched from cache successfully.');
            return JSON.parse(cachedDebts);
        }
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const debts = await this.debtModel.find({ userId, dueDate: { $lt: tomorrow } });
        const findUser = await this.usersService.findUserByIdService(userId);
        const decryptedDebts = await Promise.all(debts.map((debt) => (debt.isEncrypted ? this.decryptDebtData(debt, findUser._id) : debt)));
        await this.setCache(`debts:${userId}:due`, decryptedDebts);
        return decryptedDebts;
    }
    async changeEncryptionState(debtId, userId, encrypt) {
        const debt = await this.debtModel.findById(debtId);
        if (!debt || debt.isEncrypted === encrypt) {
            throw new common_1.BadRequestException(`Debt not found or already ${encrypt ? 'encrypted' : 'decrypted'}`);
        }
        const findUser = await this.usersService.findUserByIdService(userId);
        const encryptedKey = findUser.encryptKey;
        const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
        debt.isEncrypted = encrypt;
        debt.debtor = encrypt
            ? this.encryptionService.encryptData(debt.debtor, decryptedKey)
            : this.encryptionService.decryptData(debt.debtor, decryptedKey);
        debt.creditor = encrypt
            ? this.encryptionService.encryptData(debt.creditor, decryptedKey)
            : this.encryptionService.decryptData(debt.creditor, decryptedKey);
        debt.description = debt.description
            ? encrypt
                ? this.encryptionService.encryptData(debt.description, decryptedKey)
                : this.encryptionService.decryptData(debt.description, decryptedKey)
            : undefined;
        await debt.save();
        await this.deleteCache(`debts:${userId}:${debt.type}`);
        await this.deleteCache(`debts:${userId}:due`);
        return debt;
    }
    async enableEncryptionService(debtId, userId) {
        return this.changeEncryptionState(debtId, userId, true);
    }
    async disableEncryptionService(debtId, userId) {
        return this.changeEncryptionState(debtId, userId, false);
    }
};
exports.DebtService = DebtService;
exports.DebtService = DebtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(debt_schema_1.Debt.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof encryption_service_1.EncryptionService !== "undefined" && encryption_service_1.EncryptionService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], DebtService);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebtSchema = exports.Debt = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Debt = class Debt extends mongoose_2.Document {
};
exports.Debt = Debt;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Debt.prototype, "debtor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Debt.prototype, "creditor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", String)
], Debt.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number, required: true }),
    __metadata("design:type", Number)
], Debt.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, enum: ['lending_debt', 'borrowing_debt'], required: true }),
    __metadata("design:type", String)
], Debt.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Debt.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true, enum: ['active', 'paid', 'overdue'] }),
    __metadata("design:type", String)
], Debt.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date, required: false }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Debt.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], Debt.prototype, "isEncrypted", void 0);
exports.Debt = Debt = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Debt);
exports.DebtSchema = mongoose_1.SchemaFactory.createForClass(Debt);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebtController = void 0;
const common_1 = __webpack_require__(6);
const jwt = __webpack_require__(37);
const swagger_1 = __webpack_require__(36);
const member_gaurd_1 = __webpack_require__(55);
const debt_service_1 = __webpack_require__(111);
const CreateDebt_dto_1 = __webpack_require__(114);
const UpdateDebt_dto_1 = __webpack_require__(115);
const redis_service_1 = __webpack_require__(27);
let DebtController = class DebtController {
    constructor(debtService, redisService) {
        this.debtService = debtService;
        this.redisService = redisService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createDebtController(request, createDebtDto) {
        const userId = this.getUserIdFromToken(request);
        return this.debtService.createDebtService(createDebtDto.debtor, createDebtDto.creditor, userId, createDebtDto.amount, createDebtDto.status, createDebtDto.type, createDebtDto.dueDate, createDebtDto.description);
    }
    async updateDebtController(request, debtId, updateDebtDto) {
        const userId = this.getUserIdFromToken(request);
        return this.debtService.updateDebtService(debtId, userId, updateDebtDto.debtor, updateDebtDto.creditor, updateDebtDto.amount, updateDebtDto.type, updateDebtDto.dueDate, updateDebtDto.description);
    }
    async deleteDebtController(request, debtId) {
        const userId = this.getUserIdFromToken(request);
        return this.debtService.deleteDebtService(debtId, userId);
    }
    async getLendingDebtController(request) {
        const userId = this.getUserIdFromToken(request);
        const cacheKey = `debt-lending-${userId}`;
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await this.debtService.getDebtByTypeService(userId, 'lending_debt');
            await this.redisService.set(cacheKey, JSON.stringify(data));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving lending debts');
        }
    }
    async getBorrowingDebtController(request) {
        const userId = this.getUserIdFromToken(request);
        const cacheKey = `debt-borrowing-${userId}`;
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await this.debtService.getDebtByTypeService(userId, 'borrowing_debt');
            await this.redisService.set(cacheKey, JSON.stringify(data));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving borrowing debts');
        }
    }
    async notifyDueDebtController(request) {
        const userId = this.getUserIdFromToken(request);
        const cacheKey = `debt-notify-due-${userId}`;
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await this.debtService.getDebtWhenDueService(userId);
            await this.redisService.set(cacheKey, JSON.stringify(data));
            return data;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error retrieving due debts');
        }
    }
    async enableEncryptController(request, debtId) {
        const userId = this.getUserIdFromToken(request);
        return this.debtService.enableEncryptionService(debtId, userId);
    }
    async disableEncryptController(request, debtId) {
        const userId = this.getUserIdFromToken(request);
        return this.debtService.disableEncryptionService(debtId, userId);
    }
};
exports.DebtController = DebtController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully created.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Request !== "undefined" && Request) === "function" ? _c : Object, typeof (_d = typeof CreateDebt_dto_1.CreateDebtDto !== "undefined" && CreateDebt_dto_1.CreateDebtDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], DebtController.prototype, "createDebtController", null);
__decorate([
    (0, common_1.Put)(':debtId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('debtId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof Request !== "undefined" && Request) === "function" ? _f : Object, String, typeof (_g = typeof UpdateDebt_dto_1.UpdateDebtDto !== "undefined" && UpdateDebt_dto_1.UpdateDebtDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], DebtController.prototype, "updateDebtController", null);
__decorate([
    (0, common_1.Delete)(':debtId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('debtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof Request !== "undefined" && Request) === "function" ? _j : Object, String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], DebtController.prototype, "deleteDebtController", null);
__decorate([
    (0, common_1.Get)('/lending'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The lending debts have been successfully fetched.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof Request !== "undefined" && Request) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], DebtController.prototype, "getLendingDebtController", null);
__decorate([
    (0, common_1.Get)('/borrowing'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The borrowing debts have been successfully fetched.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof Request !== "undefined" && Request) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], DebtController.prototype, "getBorrowingDebtController", null);
__decorate([
    (0, common_1.Get)('/notify-due'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof Request !== "undefined" && Request) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], DebtController.prototype, "notifyDueDebtController", null);
__decorate([
    (0, common_1.Put)('/enable-encrypt/:debtId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('debtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof Request !== "undefined" && Request) === "function" ? _s : Object, String]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], DebtController.prototype, "enableEncryptController", null);
__decorate([
    (0, common_1.Put)('/disable-encrypt/:debtId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('debtId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof Request !== "undefined" && Request) === "function" ? _u : Object, String]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], DebtController.prototype, "disableEncryptController", null);
exports.DebtController = DebtController = __decorate([
    (0, swagger_1.ApiTags)('debt'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('debt'),
    __metadata("design:paramtypes", [typeof (_a = typeof debt_service_1.DebtService !== "undefined" && debt_service_1.DebtService) === "function" ? _a : Object, typeof (_b = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _b : Object])
], DebtController);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateDebtDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateDebtDto {
}
exports.CreateDebtDto = CreateDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Name of the debtor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "debtor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe', description: 'Name of the creditor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "creditor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: 'Amount of the debt' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lending_debt', enum: ['lending_debt', 'borrowing_debt'], description: 'Type of the debt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['lending_debt', 'borrowing_debt']),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Loan for car', description: 'Description of the debt', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', enum: ['active', 'paid', 'overdue'], description: 'Status of the debt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['active', 'paid', 'overdue']),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31', description: 'Due date of the debt', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateDebtDto.prototype, "dueDate", void 0);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateDebtDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class UpdateDebtDto {
}
exports.UpdateDebtDto = UpdateDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Name of the debtor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "debtor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe', description: 'Name of the creditor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "creditor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: 'Amount of the debt' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Loan for car', description: 'Description of the debt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', enum: ['active', 'paid', 'overdue'], description: 'Status of the debt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'paid', 'overdue']),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lending_debt or borrowing_debt', enum: ['lending_debt', 'borrowing_debt'], description: 'Type of the debt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['lending_debt', 'borrowing_debt']),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31', description: 'Due date of the debt', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateDebtDto.prototype, "dueDate", void 0);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleModule = void 0;
const common_1 = __webpack_require__(6);
const schedule_service_1 = __webpack_require__(117);
const schedule_controller_1 = __webpack_require__(119);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const schedule_schema_1 = __webpack_require__(118);
const users_module_1 = __webpack_require__(9);
const encryption_module_1 = __webpack_require__(85);
const redis_module_1 = __webpack_require__(65);
let ScheduleModule = class ScheduleModule {
};
exports.ScheduleModule = ScheduleModule;
exports.ScheduleModule = ScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            redis_module_1.RedisCacheModule,
            encryption_module_1.EncryptionModule,
            mongoose_1.MongooseModule.forFeature([{ name: schedule_schema_1.Schedule.name, schema: schedule_schema_1.ScheduleSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [schedule_controller_1.ScheduleController],
        providers: [schedule_service_1.ScheduleService],
        exports: [schedule_service_1.ScheduleService]
    })
], ScheduleModule);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const schedule_schema_1 = __webpack_require__(118);
const users_service_1 = __webpack_require__(11);
const encryption_service_1 = __webpack_require__(31);
const redis_service_1 = __webpack_require__(27);
let ScheduleService = class ScheduleService {
    constructor(scheduleModel, encryptionService, usersService, redisService) {
        this.scheduleModel = scheduleModel;
        this.encryptionService = encryptionService;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async getCache(key) {
        const cachedData = await this.redisService.getJSON(key, '$');
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return null;
    }
    async createScheduleService(userId, title, location, isAllDay, startDateTime, endDateTime, note, isLoop, calendars, url) {
        if (startDateTime > endDateTime) {
            throw new common_1.BadRequestException('Start date time must be less than end date time');
        }
        const newSchedule = new this.scheduleModel({
            userId,
            title,
            location,
            isAllDay,
            startDateTime,
            endDateTime,
            note,
            isLoop,
            calendars,
            url,
        });
        try {
            const savedSchedule = await newSchedule.save();
            await this.deleteCache(`schedules:${userId}`);
            await this.setCache(`schedule:${savedSchedule._id}`, savedSchedule);
            return savedSchedule;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error creating schedule');
        }
    }
    async updateScheduleService(userId, scheduleId, title, location, isAllDay, startDateTime, endDateTime, note, isLoop, calendars, url) {
        const schedule = await this.scheduleModel.findOne({
            userId,
            _id: scheduleId,
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Schedule not found');
        }
        if (startDateTime && endDateTime && startDateTime > endDateTime) {
            throw new common_1.BadRequestException('Start date time must be less than end date time');
        }
        try {
            const updatedSchedule = await this.scheduleModel.findOneAndUpdate({ userId, _id: scheduleId }, {
                title,
                location,
                isAllDay,
                startDateTime,
                endDateTime,
                note,
                isLoop,
                calendars,
                url,
            }, { new: true });
            await this.deleteCache(`schedules:${userId}`);
            await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
            return updatedSchedule;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error updating schedule');
        }
    }
    async updateStatusService(userId, scheduleId, status) {
        const schedule = await this.scheduleModel.findOne({
            userId,
            _id: scheduleId,
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Schedule not found');
        }
        try {
            const updatedSchedule = await this.scheduleModel.findOneAndUpdate({ userId, _id: scheduleId }, { status }, { new: true });
            await this.deleteCache(`schedules:${userId}`);
            await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
            return updatedSchedule;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error updating schedule');
        }
    }
    async deleteScheduleService(userId, scheduleId) {
        const schedule = await this.scheduleModel.findOne({
            userId,
            _id: scheduleId,
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Schedule not found');
        }
        try {
            await this.scheduleModel.deleteOne({ userId, _id: scheduleId }).exec();
            await this.deleteCache(`schedules:${userId}`);
            await this.deleteCache(`schedule:${scheduleId}`);
            return { message: 'Delete schedule successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting schedule');
        }
    }
    async deleteManyScheduleService(userId, scheduleIds) {
        const schedules = await this.scheduleModel.find({
            userId,
            _id: { $in: scheduleIds },
        });
        if (!schedules.length) {
            throw new common_1.BadRequestException('Schedules not found');
        }
        try {
            await this.scheduleModel
                .deleteMany({ userId, _id: { $in: scheduleIds } })
                .exec();
            await this.deleteCache(`schedules:${userId}`);
            scheduleIds.forEach(async (id) => await this.deleteCache(`schedule:${id}`));
            return { message: 'Delete schedules successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting schedules');
        }
    }
    async viewListScheduleService(userId, calendars) {
        const cacheKey = `schedules:${userId}`;
        const cachedSchedules = await this.getCache(cacheKey);
        if (cachedSchedules) {
            return cachedSchedules;
        }
        const findUser = await this.usersService.findUserByIdService(userId);
        if (!findUser) {
            throw new common_1.BadRequestException('User not found');
        }
        const schedules = await this.scheduleModel.find({
            userId,
            calendars: { $in: calendars },
        });
        if (!schedules.length) {
            throw new common_1.BadRequestException('Schedules not found');
        }
        const decryptedSchedules = schedules.map((schedule) => {
            if (schedule.isEncrypted) {
                const encryptedKey = findUser.encryptKey;
                const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
                schedule.title = this.encryptionService.decryptData(schedule.title, decryptedKey);
                schedule.location = this.encryptionService.decryptData(schedule.location, decryptedKey);
                schedule.note = schedule.note
                    ? this.encryptionService.decryptData(schedule.note, decryptedKey)
                    : undefined;
            }
            schedule.startDateTime.toUTCString();
            schedule.endDateTime.toUTCString();
            return schedule;
        });
        await this.setCache(cacheKey, decryptedSchedules);
        return decryptedSchedules;
    }
    async notifyScheduleService(userId) {
        const TIMEZONE_OFFSET_HOURS = 7;
        const NOTIFICATION_TIME_MINUTES = 15;
        const nowTime = new Date(Date.now() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
        const notificationTime = new Date(nowTime.getTime() + NOTIFICATION_TIME_MINUTES * 60 * 1000);
        try {
            const [nonLoopedSchedules, loopedSchedules, user] = await Promise.all([
                this.scheduleModel.find({
                    userId,
                    isLoop: false,
                    startDateTime: { $gte: nowTime, $lte: notificationTime },
                }),
                this.scheduleModel.find({
                    userId,
                    isLoop: true,
                }),
                this.usersService.findUserByIdService(userId),
            ]);
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const filteredLoopedSchedules = loopedSchedules.filter((schedule) => {
                const startDateTime = new Date(schedule.startDateTime);
                const startTotalMinutes = startDateTime.getUTCHours() * 60 + startDateTime.getUTCMinutes();
                const nowTotalMinutes = nowTime.getUTCHours() * 60 + nowTime.getUTCMinutes();
                const notificationTotalMinutes = notificationTime.getUTCHours() * 60 +
                    notificationTime.getUTCMinutes();
                return (startTotalMinutes >= nowTotalMinutes &&
                    startTotalMinutes <= notificationTotalMinutes);
            });
            const schedules = [...nonLoopedSchedules, ...filteredLoopedSchedules];
            const decryptedSchedules = schedules.map((schedule) => {
                if (schedule.isEncrypted) {
                    const decryptedKey = this.encryptionService.decryptEncryptKey(user.encryptKey, user.password);
                    schedule.title = this.encryptionService.decryptData(schedule.title, decryptedKey);
                    schedule.location = this.encryptionService.decryptData(schedule.location, decryptedKey);
                    schedule.note = schedule.note
                        ? this.encryptionService.decryptData(schedule.note, decryptedKey)
                        : undefined;
                }
                return schedule;
            });
            const formattedSchedules = decryptedSchedules.map((schedule) => ({
                ...schedule.toObject(),
                startDateTime: new Date(schedule.startDateTime).toUTCString(),
                endDateTime: new Date(schedule.endDateTime).toUTCString(),
            }));
            return formattedSchedules;
        }
        catch (error) {
            console.error('Error fetching schedules for notification:', error);
            throw new common_1.InternalServerErrorException('Error fetching schedules for notification');
        }
    }
    async enableEncryptionService(scheduleId, userId) {
        const schedule = await this.scheduleModel.findOne({
            userId,
            _id: scheduleId,
        });
        if (!schedule || schedule.isEncrypted) {
            throw new common_1.BadRequestException('Schedule not found or already encrypted');
        }
        const findUser = await this.usersService.findUserByIdService(userId);
        if (!findUser) {
            throw new common_1.BadRequestException('User not found');
        }
        const encryptedKey = findUser.encryptKey;
        const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
        try {
            schedule.title = this.encryptionService.encryptData(schedule.title, decryptedKey);
            schedule.location = this.encryptionService.encryptData(schedule.location, decryptedKey);
            schedule.note = schedule.note
                ? this.encryptionService.encryptData(schedule.note, decryptedKey)
                : undefined;
            schedule.isEncrypted = true;
            const updatedSchedule = await schedule.save();
            await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
            return updatedSchedule;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error enabling encryption');
        }
    }
    async disableEncryptionService(scheduleId, userId) {
        const schedule = await this.scheduleModel.findOne({
            userId,
            _id: scheduleId,
        });
        if (!schedule || !schedule.isEncrypted) {
            throw new common_1.BadRequestException('Schedule not found or already decrypted');
        }
        const findUser = await this.usersService.findUserByIdService(userId);
        if (!findUser) {
            throw new common_1.BadRequestException('User not found');
        }
        const encryptedKey = findUser.encryptKey;
        const decryptedKey = this.encryptionService.decryptEncryptKey(encryptedKey, findUser.password);
        try {
            schedule.title = this.encryptionService.decryptData(schedule.title, decryptedKey);
            schedule.location = this.encryptionService.decryptData(schedule.location, decryptedKey);
            schedule.note = schedule.note
                ? this.encryptionService.decryptData(schedule.note, decryptedKey)
                : undefined;
            schedule.isEncrypted = false;
            const updatedSchedule = await schedule.save();
            await this.setCache(`schedule:${scheduleId}`, updatedSchedule);
            return updatedSchedule;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error disabling encryption');
        }
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schedule_schema_1.Schedule.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof encryption_service_1.EncryptionService !== "undefined" && encryption_service_1.EncryptionService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], ScheduleService);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleSchema = exports.Schedule = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose = __webpack_require__(12);
let Schedule = class Schedule {
};
exports.Schedule = Schedule;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", typeof (_c = typeof mongoose !== "undefined" && (_a = mongoose.Schema) !== void 0 && (_b = _a.Types) !== void 0 && _b.ObjectId) === "function" ? _c : Object)
], Schedule.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Schedule.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Schedule.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isAllDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.Date,
        required: true,
        default: () => new Date()
    }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Schedule.prototype, "startDateTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.Date,
        required: true,
        default: () => new Date()
    }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Schedule.prototype, "endDateTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Schedule.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isLoop", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Boolean, required: false }),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isEncrypted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Schedule.prototype, "calendars", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Schedule.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.String, required: false, default: 'unRead', enum: ['unRead', 'readed'] }),
    __metadata("design:type", String)
], Schedule.prototype, "status", void 0);
exports.Schedule = Schedule = __decorate([
    (0, mongoose_1.Schema)()
], Schedule);
exports.ScheduleSchema = mongoose_1.SchemaFactory.createForClass(Schedule);


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleController = void 0;
const common_1 = __webpack_require__(6);
const schedule_service_1 = __webpack_require__(117);
const express_1 = __webpack_require__(47);
const jwt = __webpack_require__(37);
const schedule_dto_1 = __webpack_require__(120);
const swagger_1 = __webpack_require__(36);
const member_gaurd_1 = __webpack_require__(55);
let ScheduleController = class ScheduleController {
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createScheduleController(request, createScheduleDto) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.createScheduleService(userId, createScheduleDto.title, createScheduleDto.location, createScheduleDto.isAllDay, createScheduleDto.startDateTime, createScheduleDto.endDateTime, createScheduleDto.note, createScheduleDto.isLoop, createScheduleDto.calendars, createScheduleDto.url);
    }
    async updateScheduleController(request, scheduleId, updateScheduleDto) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.updateScheduleService(userId, scheduleId, updateScheduleDto.title, updateScheduleDto.location, updateScheduleDto.isAllDay, updateScheduleDto.startDateTime, updateScheduleDto.endDateTime, updateScheduleDto.note, updateScheduleDto.isLoop, updateScheduleDto.calendars, updateScheduleDto.url);
    }
    async deleteManyScheduleController(request, deleteManyDto) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.deleteManyScheduleService(userId, deleteManyDto.scheduleIds);
    }
    async deleteScheduleController(request, scheduleId) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.deleteScheduleService(userId, scheduleId);
    }
    async viewListScheduleController(request, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.viewListScheduleService(userId, dto.calendars);
    }
    async notifyScheduleController(request) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.notifyScheduleService(userId);
    }
    async enableEncryptScheduleController(scheduleId, request) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.enableEncryptionService(scheduleId, userId);
    }
    async disableEncryptScheduleController(scheduleId, request) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.disableEncryptionService(scheduleId, userId);
    }
    async updateStatusController(request, scheduleId, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.scheduleService.updateStatusService(userId, scheduleId, dto.status);
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully created.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof schedule_dto_1.CreateScheduleDto !== "undefined" && schedule_dto_1.CreateScheduleDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ScheduleController.prototype, "createScheduleController", null);
__decorate([
    (0, common_1.Put)(':scheduleId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('scheduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, String, typeof (_f = typeof schedule_dto_1.UpdateScheduleDto !== "undefined" && schedule_dto_1.UpdateScheduleDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ScheduleController.prototype, "updateScheduleController", null);
__decorate([
    (0, common_1.Delete)('delete-many'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The records have been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof schedule_dto_1.DeleteManyDto !== "undefined" && schedule_dto_1.DeleteManyDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ScheduleController.prototype, "deleteManyScheduleController", null);
__decorate([
    (0, common_1.Delete)(':scheduleId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object, String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], ScheduleController.prototype, "deleteScheduleController", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully retrieved.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object, typeof (_p = typeof schedule_dto_1.ViewScheduleDto !== "undefined" && schedule_dto_1.ViewScheduleDto) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], ScheduleController.prototype, "viewListScheduleController", null);
__decorate([
    (0, common_1.Get)('notify-schedule'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Notify schedule before 15 minutes',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], ScheduleController.prototype, "notifyScheduleController", null);
__decorate([
    (0, common_1.Put)('/enable-encrypt/:scheduleId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_t = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _t : Object]),
    __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], ScheduleController.prototype, "enableEncryptScheduleController", null);
__decorate([
    (0, common_1.Put)('/disable-encrypt/:scheduleId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_v = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], ScheduleController.prototype, "disableEncryptScheduleController", null);
__decorate([
    (0, common_1.Patch)('update-status/:scheduleId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully updated.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('scheduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _x : Object, String, typeof (_y = typeof schedule_dto_1.statusScheduleDto !== "undefined" && schedule_dto_1.statusScheduleDto) === "function" ? _y : Object]),
    __metadata("design:returntype", typeof (_z = typeof Promise !== "undefined" && Promise) === "function" ? _z : Object)
], ScheduleController.prototype, "updateStatusController", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, swagger_1.ApiTags)('schedule'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schedule'),
    __metadata("design:paramtypes", [typeof (_a = typeof schedule_service_1.ScheduleService !== "undefined" && schedule_service_1.ScheduleService) === "function" ? _a : Object])
], ScheduleController);


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.statusScheduleDto = exports.ViewScheduleDto = exports.DeleteManyDto = exports.UpdateScheduleDto = exports.CreateScheduleDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(50);
class CreateScheduleDto {
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of schedule', example: 'Meeting' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location of schedule', example: 'Room 1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is all day schedule', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "isAllDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date time of schedule', example: '2021-07-16T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateScheduleDto.prototype, "startDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date time of schedule', example: '2021-07-16T23:59:59.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateScheduleDto.prototype, "endDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note of schedule', example: 'Please bring your laptop' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is loop schedule', example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "isLoop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calendars of schedule', example: 'calendar1' }),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "calendars", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL of schedule', example: 'https://example.com' }),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "url", void 0);
class UpdateScheduleDto {
}
exports.UpdateScheduleDto = UpdateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of schedule', example: 'Meeting' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location of schedule', example: 'Room 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is all day schedule', example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateScheduleDto.prototype, "isAllDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date time of schedule', example: '2021-07-16T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UpdateScheduleDto.prototype, "startDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date time of schedule', example: '2021-07-16T23:59:59.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], UpdateScheduleDto.prototype, "endDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note of schedule', example: 'Please bring your laptop' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is loop schedule', example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateScheduleDto.prototype, "isLoop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calendars of schedule', example: 'calendar1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "calendars", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL of schedule', example: 'https://example.com' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateScheduleDto.prototype, "url", void 0);
class DeleteManyDto {
}
exports.DeleteManyDto = DeleteManyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of schedule ids', example: ['60f0c5d0b5f5e3f2c8f7c4b7', '60f0c5d0b5f5e3f2c8f7c4b8'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], DeleteManyDto.prototype, "scheduleIds", void 0);
class ViewScheduleDto {
}
exports.ViewScheduleDto = ViewScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of schedule', example: ['type 1', 'type 2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value) ? value : [value], { toClassOnly: true }),
    __metadata("design:type", Array)
], ViewScheduleDto.prototype, "calendars", void 0);
class statusScheduleDto {
}
exports.statusScheduleDto = statusScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status of schedule', example: 'readed or unread' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], statusScheduleDto.prototype, "status", void 0);


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(6);
let AppController = class AppController {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RankModule = void 0;
const common_1 = __webpack_require__(6);
const rank_service_1 = __webpack_require__(123);
const rank_controller_1 = __webpack_require__(124);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const rank_schema_1 = __webpack_require__(33);
const cloudinary_module_1 = __webpack_require__(56);
const abilities_factory_1 = __webpack_require__(40);
const admin_module_1 = __webpack_require__(73);
const redis_module_1 = __webpack_require__(65);
let RankModule = class RankModule {
};
exports.RankModule = RankModule;
exports.RankModule = RankModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cloudinary_module_1.CloudinaryModule,
            redis_module_1.RedisCacheModule,
            (0, common_1.forwardRef)(() => admin_module_1.AdminModule),
            mongoose_1.MongooseModule.forFeature([{ name: rank_schema_1.Rank.name, schema: rank_schema_1.RankSchema }]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [rank_controller_1.RankController],
        providers: [rank_service_1.RankService, abilities_factory_1.AbilityFactory,],
        exports: [rank_service_1.RankService],
    })
], RankModule);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RankService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const rank_schema_1 = __webpack_require__(33);
const cloudinary_service_1 = __webpack_require__(14);
const redis_service_1 = __webpack_require__(27);
let RankService = class RankService {
    constructor(RankModel, cloudinaryService, redisService) {
        this.RankModel = RankModel;
        this.cloudinaryService = cloudinaryService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async plushCache() {
        await this.redisService.flushAll();
    }
    async createRankService(rankName, attendanceScore, numberOfComment, numberOfBlog, numberOfLike, file, action) {
        const existedRank = await this.RankModel.findOne({ rankName });
        if (existedRank) {
            throw new common_1.BadRequestException('Rank existed');
        }
        const rankScoreGoal = this.calculateRankScoreGoal(attendanceScore, numberOfComment, numberOfBlog, numberOfLike);
        const rankIcon = await this.uploadRankIcon(rankName, file);
        const rank = new this.RankModel({
            rankName,
            rankScoreGoal,
            score: { attendanceScore, numberOfComment, numberOfBlog, numberOfLike },
            rankIcon,
            action,
        });
        const savedRank = await rank.save();
        await this.deleteCache('ranks:all');
        await this.setCache(`ranks:detail:${savedRank._id}`, savedRank);
        await this.plushCache();
        return savedRank;
    }
    async updateRankService(rankId, rankName, attendanceScore, numberOfComment, numberOfBlog, numberOfLike, action, file) {
        const existedRank = await this.RankModel.findOne({ _id: rankId });
        if (!existedRank) {
            throw new common_1.BadRequestException('Rank not found');
        }
        if (rankName) {
            const existedRankName = await this.RankModel.findOne({ rankName });
            if (existedRankName && existedRankName._id.toString() !== rankId) {
                throw new common_1.BadRequestException('Rank name existed');
            }
        }
        this.updateRankDetails(existedRank, {
            rankName,
            attendanceScore,
            numberOfComment,
            numberOfBlog,
            numberOfLike,
            action
        });
        if (file) {
            await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
            existedRank.rankIcon = await this.uploadRankIcon(existedRank.rankName, file);
        }
        existedRank.rankScoreGoal = this.calculateRankScoreGoal(existedRank.score.attendanceScore, existedRank.score.numberOfComment, existedRank.score.numberOfBlog, existedRank.score.numberOfLike);
        const updatedRank = await existedRank.save();
        await this.deleteCache('ranks:all');
        await this.deleteCache(`ranks:detail:${rankId}`);
        await this.plushCache();
        return updatedRank;
    }
    async deleteRankService(rankId) {
        const existedRank = await this.RankModel.findOne({ _id: rankId });
        if (!existedRank) {
            throw new common_1.BadRequestException('Rank not found');
        }
        await this.cloudinaryService.deleteMediaService(existedRank.rankIcon);
        await existedRank.deleteOne();
        await this.deleteCache('ranks:all');
        await this.deleteCache(`ranks:detail:${rankId}`);
        await this.plushCache();
        return { message: 'Delete rank successfully' };
    }
    async getRankService() {
        const cacheKey = 'ranks:all';
        const cachedRanks = await this.redisService.getJSON(cacheKey, '$');
        if (cachedRanks) {
            return JSON.parse(cachedRanks);
        }
        const ranks = await this.RankModel.find();
        await this.setCache(cacheKey, ranks);
        return ranks;
    }
    async getRankDetailService(rankId) {
        const cacheKey = `ranks:detail:${rankId}`;
        const cachedRank = await this.redisService.getJSON(cacheKey, '$');
        if (cachedRank) {
            return JSON.parse(cachedRank);
        }
        const rank = await this.RankModel.findOne({ _id: rankId });
        await this.setCache(cacheKey, rank);
        return rank;
    }
    calculateRankScoreGoal(attendanceScore, numberOfComment, numberOfBlog, numberOfLike) {
        return attendanceScore + numberOfComment + numberOfBlog + numberOfLike;
    }
    async uploadRankIcon(rankName, file) {
        const fileResult = await this.cloudinaryService.uploadImageService(rankName, file);
        return fileResult.uploadResult.url;
    }
    updateRankDetails(rank, details) {
        if (details.rankName)
            rank.rankName = details.rankName;
        if (details.attendanceScore)
            rank.score.attendanceScore = details.attendanceScore;
        if (details.numberOfComment)
            rank.score.numberOfComment = details.numberOfComment;
        if (details.numberOfBlog)
            rank.score.numberOfBlog = details.numberOfBlog;
        if (details.numberOfLike)
            rank.score.numberOfLike = details.numberOfLike;
        if (details.action)
            rank.action = details.action;
    }
};
exports.RankService = RankService;
exports.RankService = RankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(rank_schema_1.Rank.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], RankService);


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RankController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(36);
const platform_express_1 = __webpack_require__(38);
const rank_service_1 = __webpack_require__(123);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
let RankController = class RankController {
    constructor(rankService) {
        this.rankService = rankService;
    }
    async createRankController(body, file) {
        if (!file) {
            throw new common_1.BadRequestException('Image is required');
        }
        return this.rankService.createRankService(body.rankName, Number(body.attendanceScore), Number(body.numberOfComment), Number(body.numberOfBlog), Number(body.numberOfLike), file, body.action);
    }
    async updateRankController(body, rankId, file) {
        return this.rankService.updateRankService(rankId, body.rankName, body.attendanceScore, body.numberOfComment, body.numberOfBlog, body.numberOfLike, body.action, file);
    }
    async deleteRankController(rankId) {
        return this.rankService.deleteRankService(rankId);
    }
    async getAllRankController() {
        return this.rankService.getRankService();
    }
    async getRankByIdController(rankId) {
        return this.rankService.getRankDetailService(rankId);
    }
};
exports.RankController = RankController;
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('create'),
    (0, casl_decorator_1.Subject)('rank'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                rankName: { type: 'string' },
                attendanceScore: { type: 'number' },
                numberOfComment: { type: 'number' },
                numberOfBlog: { type: 'number' },
                numberOfLike: { type: 'number' },
                action: { type: 'array', items: { type: 'string' } },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "createRankController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('update'),
    (0, casl_decorator_1.Subject)('rank'),
    (0, common_1.Put)('update/:rankId'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                rankName: { type: 'string' },
                attendanceScore: { type: 'number' },
                numberOfComment: { type: 'number' },
                numberOfBlog: { type: 'number' },
                numberOfLike: { type: 'number' },
                action: { type: 'array', items: { type: 'string' } },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiOkResponse)({ description: 'Update rank successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Rank not existed' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('rankId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "updateRankController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('delete'),
    (0, casl_decorator_1.Subject)('rank'),
    (0, common_1.Delete)(':rankId'),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete rank successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Rank not existed' }),
    __param(0, (0, common_1.Param)('rankId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "deleteRankController", null);
__decorate([
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('rank'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all rank successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getAllRankController", null);
__decorate([
    (0, common_1.Get)(':rankId'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get rank by id successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Rank not existed' }),
    __param(0, (0, common_1.Param)('rankId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getRankByIdController", null);
exports.RankController = RankController = __decorate([
    (0, swagger_1.ApiTags)('rank'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('rank'),
    __metadata("design:paramtypes", [typeof (_a = typeof rank_service_1.RankService !== "undefined" && rank_service_1.RankService) === "function" ? _a : Object])
], RankController);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostModule = void 0;
const common_1 = __webpack_require__(6);
const post_service_1 = __webpack_require__(126);
const post_controller_1 = __webpack_require__(128);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const post_schema_1 = __webpack_require__(127);
const cloudinary_module_1 = __webpack_require__(56);
const users_module_1 = __webpack_require__(9);
const abilities_factory_1 = __webpack_require__(40);
const admin_module_1 = __webpack_require__(73);
const favoritePost_schema_1 = __webpack_require__(130);
const comment_schema_1 = __webpack_require__(131);
const redis_module_1 = __webpack_require__(65);
let PostModule = class PostModule {
};
exports.PostModule = PostModule;
exports.PostModule = PostModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cloudinary_module_1.CloudinaryModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
                { name: 'FavoritePost', schema: favoritePost_schema_1.FavoritePostSchema },
                { name: 'Comment', schema: comment_schema_1.CommentSchema },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [post_controller_1.PostController],
        providers: [post_service_1.PostService, abilities_factory_1.AbilityFactory],
        exports: [post_service_1.PostService],
    })
], PostModule);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const post_schema_1 = __webpack_require__(127);
const cloudinary_service_1 = __webpack_require__(14);
const users_service_1 = __webpack_require__(11);
const redis_service_1 = __webpack_require__(27);
let PostService = class PostService {
    constructor(postModel, favoritePostModel, cloudinaryService, usersService, redisService) {
        this.postModel = postModel;
        this.favoritePostModel = favoritePostModel;
        this.cloudinaryService = cloudinaryService;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        const keys = Array.isArray(key) ? key : [key];
        await Promise.all(keys.map((k) => this.redisService.delJSON(k, '$')));
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async createPostService(userId, content, file) {
        const post = new this.postModel({ userId, content });
        if (file) {
            const { uploadResult } = await this.cloudinaryService.uploadImageService(content, file);
            post.postImage = uploadResult.url;
        }
        await this.usersService.updateScoreRankService(userId, true);
        const savedPost = await post.save();
        await this.deleteCache(`posts:user:${userId}`);
        return savedPost;
    }
    async updatePostService(userId, postId, isShow, content, file) {
        const post = await this.postModel.findOne({ _id: postId, userId });
        if (!post)
            throw new common_1.BadRequestException('Post not found');
        if (content)
            post.content = content;
        if (file) {
            await this.cloudinaryService.deleteMediaService(post.postImage);
            const { uploadResult } = await this.cloudinaryService.uploadImageService(post.content, file);
            post.postImage = uploadResult.url;
        }
        if (isShow !== undefined)
            post.isShow = isShow;
        const updatedPost = await post.save();
        ;
        return updatedPost;
    }
    async deletePostService(userId, postId) {
        const post = await this.postModel.findOneAndDelete({ _id: postId, userId });
        if (!post)
            throw new common_1.BadRequestException('Post not found');
        if (post.postImage)
            await this.cloudinaryService.deleteMediaService(post.postImage);
        return post;
    }
    async viewDetailPostService(postId) {
        const cacheKey = `posts:detail:${postId}`;
        const cachedPost = await this.redisService.getJSON(cacheKey, '$');
        if (cachedPost)
            return JSON.parse(cachedPost);
        const post = await this.postModel
            .findById(postId)
            .populate('userReaction.userId', 'firstname lastname avatar')
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon ',
            },
        });
        await this.setCache(cacheKey, post);
        return post;
    }
    async deleteManyPostService(userId, postIds) {
        const posts = await this.postModel.find({ _id: { $in: postIds }, userId });
        if (!posts.length)
            throw new common_1.BadRequestException('Posts not found');
        for (const post of posts) {
            if (post.postImage)
                await this.cloudinaryService.deleteMediaService(post.postImage);
        }
        await this.postModel.deleteMany({ _id: { $in: postIds } });
        return posts;
    }
    async updateStatusService(userId, postId, status) {
        const post = await this.postModel.findOne({ _id: postId, userId });
        if (!post)
            throw new common_1.BadRequestException('Post not found');
        post.status = status;
        const updatedPost = await post.save();
        return updatedPost;
    }
    async updateApproveService(postId, isApproved) {
        const post = await this.postModel.findOne({ _id: postId });
        if (!post || post.status === 'rejected')
            throw new common_1.BadRequestException('Post not found or rejected');
        post.isApproved = isApproved;
        post.status = isApproved ? 'active' : 'inactive';
        const updatedPost = await post.save();
        return updatedPost;
    }
    async rejectPostService(postId) {
        const post = await this.postModel.findOne({ _id: postId });
        if (!post)
            throw new common_1.BadRequestException('Post not found');
        post.status = 'rejected';
        const updatedPost = await post.save();
        return updatedPost;
    }
    async viewAllPostService() {
        const posts = await this.postModel
            .find({ status: 'active', isShow: true })
            .populate('userReaction.userId', 'firstname lastname avatar')
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon ',
            },
        })
            .sort({ createdAt: -1 });
        return posts;
    }
    async viewListPostService() {
        const posts = await this.postModel
            .find()
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon ',
            },
        })
            .sort({ createdAt: -1 });
        return posts;
    }
    async viewMyPostService(userId) {
        const cacheKey = `posts:user:${userId}`;
        const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
        if (cachedPosts)
            return JSON.parse(cachedPosts);
        const posts = await this.postModel
            .find({ userId })
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon ',
            },
        })
            .populate({
            path: 'userReaction.userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon ',
            },
        })
            .sort({ createdAt: -1 });
        await this.setCache(cacheKey, posts);
        return posts;
    }
    async searchPostService(searchKey) {
        const result = 'code đã bị xóa';
        return result;
    }
    async addReactionPostService(userId, postId, reaction) {
        const postQuery = { _id: postId, 'userReaction.userId': userId };
        const postExists = await this.postModel.findOne(postQuery).lean();
        let message = '';
        let updatePostQuery;
        let updatePostOptions;
        if (postExists) {
            updatePostQuery = postQuery;
            updatePostOptions = { $set: { 'userReaction.$.reaction': reaction } };
            message = 'Reaction updated successfully';
        }
        else {
            updatePostQuery = { _id: postId, 'userReaction.userId': { $ne: userId } };
            updatePostOptions = {
                $push: { userReaction: { userId, reaction } },
                $inc: { reactionCount: 1 },
            };
        }
        const updatedPost = await this.postModel.findOneAndUpdate(updatePostQuery, updatePostOptions, { new: true });
        if (!updatedPost)
            throw new common_1.BadRequestException('Post not found or you have already reacted to this post');
        if (!postExists && reaction === 'like') {
            await this.usersService.updateScoreRankService(updatedPost.userId.toString(), false, false, true);
        }
        return { message };
    }
    async removeReactionPostService(userId, postId) {
        const post = await this.postModel.findOneAndUpdate({ _id: postId, 'userReaction.userId': userId }, {
            $pull: { userReaction: { userId } },
            $inc: { reactionCount: -1 },
        }, { new: true });
        if (!post)
            throw new common_1.BadRequestException('You have not reacted to this post');
        return post;
    }
    async addFavoritePostService(userId, postId) {
        const favoritePost = new this.favoritePostModel({ userId, postId });
        await favoritePost.save();
        await this.deleteCache([
            `posts:favorites:${userId}`,
            `posts:detail:${postId}`,
        ]);
        return { message: 'Favorite post added successfully' };
    }
    async removeFavoritePostService(userId, postId) {
        await this.favoritePostModel.findOneAndDelete({ userId, postId });
        await this.deleteCache([
            `posts:favorites:${userId}`,
            `posts:detail:${postId}`,
        ]);
        return { message: 'Favorite post removed successfully' };
    }
    async viewMyFavoritePostService(userId) {
        const cacheKey = `posts:favorites:${userId}`;
        const cachedPosts = await this.redisService.getJSON(cacheKey, '$');
        if (cachedPosts)
            return JSON.parse(cachedPosts);
        const favoritePosts = await this.favoritePostModel.find({ userId });
        const postIds = favoritePosts.map((post) => post.postId);
        const posts = await this.postModel
            .find({ _id: { $in: postIds }, isShow: true, status: 'active', isApproved: true })
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon',
            },
        });
        await this.setCache(cacheKey, posts);
        return posts;
    }
    async getPaginatedPostsService(page, limit) {
        page = page || 1;
        limit = limit || 10;
        const posts = await this.postModel
            .find({ status: 'active', isShow: true })
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: '_id rankName rankIcon',
            },
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return posts;
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)('FavoritePost')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _c : Object, typeof (_d = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _d : Object, typeof (_e = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _e : Object])
], PostService);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostSchema = exports.Post = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Post = class Post extends mongoose_2.Document {
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Post.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String }),
    __metadata("design:type", String)
], Post.prototype, "postImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "commentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Number, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "reactionCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                userId: {
                    type: mongoose_3.default.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                reaction: {
                    type: mongoose_3.default.Schema.Types.String,
                    required: true,
                    enum: ['like', 'dislike'],
                },
            },
        ],
    }),
    __metadata("design:type", Object)
], Post.prototype, "userReaction", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_3.default.Schema.Types.String,
        default: 'inactive',
        enum: ['active', 'inactive', 'blocked', 'rejected'],
    }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Boolean, default: true }),
    __metadata("design:type", Boolean)
], Post.prototype, "isShow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Boolean, default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "isApproved", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Post.prototype, "updatedAt", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.index({ content: 'text' });


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(36);
const post_service_1 = __webpack_require__(126);
const platform_express_1 = __webpack_require__(38);
const jwt = __webpack_require__(37);
const post_dto_1 = __webpack_require__(129);
const member_gaurd_1 = __webpack_require__(55);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createPostController(dto, req, file) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.createPostService(userId, dto.content, file);
    }
    async updatePostController(dto, postId, req, file) {
        const userId = this.getUserIdFromToken(req);
        if (!postId) {
            throw new common_1.BadRequestException('postId is required');
        }
        return await this.postService.updatePostService(userId, postId, dto.isShow, dto.content, file);
    }
    async deleteManyPostController(dto, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.deleteManyPostService(userId, dto.postIds);
    }
    async deletePostController(postId, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.deletePostService(userId, postId);
    }
    async getFavoritePostController(req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.viewMyFavoritePostService(userId);
    }
    async searchPostController(searchKey) {
        return await this.postService.searchPostService(searchKey);
    }
    async viewListPostController() {
        return await this.postService.viewListPostService();
    }
    async getMyPostsController(req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.viewMyPostService(userId);
    }
    async getPostsController() {
        return await this.postService.viewAllPostService();
    }
    async paginationPostController(dto) {
        return await this.postService.getPaginatedPostsService(dto.page, dto.limit);
    }
    async viewDetailPostController(postId) {
        return await this.postService.viewDetailPostService(postId);
    }
    async approvePostController(postId, isApproved) {
        return await this.postService.updateApproveService(postId, isApproved);
    }
    async reactionPostController(postId, action, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.addReactionPostService(userId, postId, action);
    }
    async removeReactionPostController(postId, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.removeReactionPostService(userId, postId);
    }
    async favoritePostController(postId, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.addFavoritePostService(userId, postId);
    }
    async unFavoritePostController(postId, req) {
        const userId = this.getUserIdFromToken(req);
        return await this.postService.removeFavoritePostService(userId, postId);
    }
    async rejectPostController(postId) {
        return await this.postService.rejectPostService(postId);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Post created successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof post_dto_1.CreatePostDto !== "undefined" && post_dto_1.CreatePostDto) === "function" ? _b : Object, typeof (_c = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _c : Object, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPostController", null);
__decorate([
    (0, common_1.Put)('/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string' },
                isShow: { type: 'boolean' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Post updated successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof post_dto_1.UpdatePostDto !== "undefined" && post_dto_1.UpdatePostDto) === "function" ? _f : Object, String, typeof (_g = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _g : Object, typeof (_j = typeof Express !== "undefined" && (_h = Express.Multer) !== void 0 && _h.File) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePostController", null);
__decorate([
    (0, common_1.Delete)('/delete-many'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts deleted successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof post_dto_1.deleteManyPostDto !== "undefined" && post_dto_1.deleteManyPostDto) === "function" ? _k : Object, typeof (_l = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteManyPostController", null);
__decorate([
    (0, common_1.Delete)('/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Post deleted successfully' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePostController", null);
__decorate([
    (0, common_1.Get)('/favorite'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Favorite posts' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getFavoritePostController", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts' }),
    __param(0, (0, common_1.Query)('searchKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "searchPostController", null);
__decorate([
    (0, common_1.Get)('/view-list-post'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('post'),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiOperation)({ summary: 'For Admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "viewListPostController", null);
__decorate([
    (0, common_1.Get)('/view-my-posts'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getMyPostsController", null);
__decorate([
    (0, common_1.Get)('/view-all-post'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostsController", null);
__decorate([
    (0, common_1.Get)('pagination'),
    (0, swagger_1.ApiOkResponse)({ description: 'Posts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof post_dto_1.PaginationDto !== "undefined" && post_dto_1.PaginationDto) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "paginationPostController", null);
__decorate([
    (0, common_1.Get)('/:postId'),
    (0, swagger_1.ApiOkResponse)({ description: 'Post detail' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "viewDetailPostController", null);
__decorate([
    (0, common_1.Patch)('/approve/:postId/'),
    (0, swagger_1.ApiOperation)({ summary: 'For Admin' }),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('post'),
    (0, casl_decorator_1.Action)('approve'),
    (0, swagger_1.ApiOkResponse)({ description: 'Post approved' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('isApproved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "approvePostController", null);
__decorate([
    (0, common_1.Put)('/reaction/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Post reaction' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('action')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_r = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _r : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "reactionPostController", null);
__decorate([
    (0, common_1.Delete)('reaction/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Post reaction removed' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_s = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _s : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "removeReactionPostController", null);
__decorate([
    (0, common_1.Post)('/favorite/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Post favorited' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_t = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _t : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "favoritePostController", null);
__decorate([
    (0, common_1.Delete)('/favorite/:postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiOkResponse)({ description: 'Post unfavorited' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_u = typeof common_1.Request !== "undefined" && common_1.Request) === "function" ? _u : Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "unFavoritePostController", null);
__decorate([
    (0, common_1.Patch)('rejection/:postId'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('post'),
    (0, casl_decorator_1.Action)('read'),
    (0, swagger_1.ApiOkResponse)({ description: 'Post rejected' }),
    (0, swagger_1.ApiOperation)({ summary: 'For Admin' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "rejectPostController", null);
exports.PostController = PostController = __decorate([
    (0, swagger_1.ApiTags)('post'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('post'),
    __metadata("design:paramtypes", [typeof (_a = typeof post_service_1.PostService !== "undefined" && post_service_1.PostService) === "function" ? _a : Object])
], PostController);


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaginationDto = exports.deleteManyPostDto = exports.UpdatePostDto = exports.CreatePostDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(50);
class CreatePostDto {
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1500),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
class UpdatePostDto {
}
exports.UpdatePostDto = UpdatePostDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePostDto.prototype, "isShow", void 0);
class deleteManyPostDto {
}
exports.deleteManyPostDto = deleteManyPostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'post id ',
        example: ['64d123j231223221',
            '64d123j231223222',
        ]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], deleteManyPostDto.prototype, "postIds", void 0);
class PaginationDto {
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: Number,
        description: 'Limit of items per page',
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: Number,
        description: 'Page number',
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FavoritePostSchema = exports.FavoritePost = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let FavoritePost = class FavoritePost extends mongoose_2.Document {
};
exports.FavoritePost = FavoritePost;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], FavoritePost.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", String)
], FavoritePost.prototype, "postId", void 0);
exports.FavoritePost = FavoritePost = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FavoritePost);
exports.FavoritePostSchema = mongoose_1.SchemaFactory.createForClass(FavoritePost);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentSchema = exports.Comment = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
let Comment = class Comment extends mongoose_2.Document {
};
exports.Comment = Comment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", String)
], Comment.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                _id: { type: mongoose_2.default.Schema.Types.ObjectId, auto: true },
                userId: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true },
                content: { type: mongoose_2.default.Schema.Types.String, required: true },
                createdAt: { type: mongoose_2.default.Schema.Types.Date, required: true }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], Comment.prototype, "repliesComment", void 0);
exports.Comment = Comment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Comment);
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentModule = void 0;
const common_1 = __webpack_require__(6);
const comment_service_1 = __webpack_require__(133);
const comment_controller_1 = __webpack_require__(134);
const mongoose_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const comment_schema_1 = __webpack_require__(131);
const post_module_1 = __webpack_require__(125);
const users_module_1 = __webpack_require__(9);
const post_schema_1 = __webpack_require__(127);
const redis_module_1 = __webpack_require__(65);
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            users_module_1.UsersModule,
            post_module_1.PostModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Comment', schema: comment_schema_1.CommentSchema },
                { name: 'Post', schema: post_schema_1.PostSchema },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [comment_controller_1.CommentController],
        providers: [comment_service_1.CommentService],
    })
], CommentModule);


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const comment_schema_1 = __webpack_require__(131);
const users_service_1 = __webpack_require__(11);
const redis_service_1 = __webpack_require__(27);
let CommentService = class CommentService {
    constructor(commentModel, postModel, usersService, redisService) {
        this.commentModel = commentModel;
        this.postModel = postModel;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async createCommentService(userId, postId, content) {
        const comment = new this.commentModel({
            userId,
            postId,
            content,
        });
        await this.usersService.updateScoreRankService(userId, false, true);
        await this.postModel.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 },
        });
        await comment.save();
        this.setCache(`comments:${postId}`, comment);
        this.deleteCache(`comments:get:${postId}`);
        this.deleteCache(`posts:detail:${postId}`);
        this.deleteCache(`posts:user:${userId}`);
        this.deleteCache(`posts:favorites:${userId}`);
        return { message: 'Comment created successfully.' };
    }
    async updateCommentService(userId, commentId, content) {
        const comment = await this.commentModel.findOneAndUpdate({ _id: commentId, userId }, { content }, { new: true });
        if (comment) {
            this.deleteCache(`comments:${comment.postId}`);
            this.deleteCache(`comments:get:${comment.postId}`);
            this.deleteCache(`posts:detail:${comment.postId}`);
            this.deleteCache(`posts:user:${userId}`);
            this.deleteCache(`posts:favorites:${userId}`);
        }
        return {
            comment,
            message: comment ? 'Comment updated successfully.' : 'No comment found to update.',
        };
    }
    async deleteCommentService(userId, commentId) {
        const result = await this.commentModel.findOneAndDelete({
            _id: commentId,
            userId,
        });
        if (result) {
            const sizeReplyComment = result.repliesComment.length;
            const postId = result.postId;
            await this.postModel.findByIdAndUpdate(postId, {
                $inc: { commentCount: -(sizeReplyComment + 1) },
            });
            this.deleteCache(`comments:${postId}`);
            this.deleteCache(`comments:get:${postId}`);
            this.deleteCache(`posts:detail:${postId}`);
            this.deleteCache(`posts:user:${userId}`);
            this.deleteCache(`posts:favorites:${userId}`);
        }
        return {
            message: result ? 'Comment deleted successfully.' : 'No comment found to delete.',
        };
    }
    async getCommentService(postId) {
        const cachedComments = await this.redisService.getJSON(`comments:get:${postId}`, '$');
        if (cachedComments) {
            console.log('Comments fetched from cache successfully.');
            const comments = JSON.parse(cachedComments);
            return { comments, message: 'Comments fetched from cache successfully.' };
        }
        let comments = await this.commentModel
            .find({ postId })
            .populate('userId', 'firstname lastname avatar rankId')
            .populate('repliesComment.userId', 'firstname lastname avatar rankId')
            .sort({ createdAt: -1 });
        comments = comments.map((comment) => {
            comment.repliesComment.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            return comment;
        });
        await this.setCache(`comments:${postId}`, comments);
        return { comments, message: 'Comments fetched successfully.' };
    }
    async CreateReplyCommentService(userId, commentId, content) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.BadRequestException('Comment not found');
        }
        comment.repliesComment.push({
            _id: new mongoose_2.Types.ObjectId().toString(),
            userId: userId,
            content: content,
            createdAt: new Date(),
        });
        await this.usersService.updateScoreRankService(userId, false, true);
        const postId = comment.postId;
        await this.postModel.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 },
        });
        await comment.save();
        this.deleteCache(`comments:${postId}`);
        this.deleteCache(`comments:get:${postId}`);
        this.setCache(`comment:${commentId}`, comment);
        this.deleteCache(`posts:detail:${postId}`);
        this.deleteCache(`posts:user:${userId}`);
        this.deleteCache(`posts:favorites:${userId}`);
        return { comment, message: 'Reply comment created successfully.' };
    }
    async updateReplyCommentService(userId, commentId, replyCommentId, content) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.BadRequestException('Comment not found');
        }
        const replyCommentIndex = comment.repliesComment.findIndex((reply) => reply._id.toString() === replyCommentId);
        if (replyCommentIndex === -1) {
            throw new common_1.BadRequestException('Reply comment not found');
        }
        if (comment.repliesComment[replyCommentIndex].userId.toString() !== userId) {
            throw new common_1.BadRequestException('You are not the owner of this reply comment');
        }
        comment.repliesComment[replyCommentIndex].content = content;
        await comment.save();
        this.deleteCache(`comments:${comment.postId}`);
        this.deleteCache(`comments:get:${comment.postId}`);
        this.setCache(`comment:${commentId}`, comment);
        this.deleteCache(`posts:detail:${comment.postId}`);
        this.deleteCache(`posts:user:${userId}`);
        this.deleteCache(`posts:favorites:${userId}`);
        return { message: 'Reply comment updated successfully.' };
    }
    async deleteReplyCommentService(userId, commentId, replyCommentId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new common_1.BadRequestException('Comment not found');
        }
        const replyCommentIndex = comment.repliesComment.findIndex((reply) => reply._id.toString() === replyCommentId);
        if (replyCommentIndex === -1) {
            throw new common_1.BadRequestException('Reply comment not found');
        }
        if (comment.repliesComment[replyCommentIndex].userId.toString() !== userId) {
            throw new common_1.BadRequestException('You are not the owner of this reply comment');
        }
        comment.repliesComment.splice(replyCommentIndex, 1);
        const postId = comment.postId;
        await this.postModel.findByIdAndUpdate(postId, {
            $inc: { commentCount: -1 },
        });
        await comment.save();
        this.deleteCache(`comments:${postId}`);
        this.setCache(`comment:${commentId}`, comment);
        this.deleteCache(`comments:get:${comment.postId}`);
        this.deleteCache(`posts:detail:${postId}`);
        this.deleteCache(`posts:user:${userId}`);
        this.deleteCache(`posts:favorites:${userId}`);
        return { message: 'Reply comment deleted successfully.' };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)('Post')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], CommentService);


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentController = void 0;
const common_1 = __webpack_require__(6);
const comment_service_1 = __webpack_require__(133);
const swagger_1 = __webpack_require__(36);
const comment_dto_1 = __webpack_require__(135);
const jwt = __webpack_require__(37);
const member_gaurd_1 = __webpack_require__(55);
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createCommentController(request, createCommentDto) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.createCommentService(userId, createCommentDto.postId, createCommentDto.content);
    }
    async updateCommentController(request, commentId, updateCommentDto) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.updateCommentService(userId, commentId, updateCommentDto.content);
    }
    async deleteCommentController(request, commentId) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.deleteCommentService(userId, commentId);
    }
    async getCommentController(postId) {
        const comments = await this.commentService.getCommentService(postId);
        return comments;
    }
    async replyCommentController(request, commentId, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.CreateReplyCommentService(userId, commentId, dto.content);
    }
    async updateReplyCommentController(request, commentId, replyId, dto) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.updateReplyCommentService(userId, commentId, replyId, dto.content);
    }
    async deleteReplyCommentController(request, commentId, replyId) {
        const userId = this.getUserIdFromToken(request);
        return this.commentService.deleteReplyCommentService(userId, commentId, replyId);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Request !== "undefined" && Request) === "function" ? _b : Object, typeof (_c = typeof comment_dto_1.CreateCommentDto !== "undefined" && comment_dto_1.CreateCommentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createCommentController", null);
__decorate([
    (0, common_1.Put)(':commentId'),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Success' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof Request !== "undefined" && Request) === "function" ? _d : Object, String, typeof (_e = typeof comment_dto_1.UpdateCommentDto !== "undefined" && comment_dto_1.UpdateCommentDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateCommentController", null);
__decorate([
    (0, common_1.Delete)(':commentId'),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Success' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof Request !== "undefined" && Request) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteCommentController", null);
__decorate([
    (0, common_1.Get)(':postId'),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Success' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentController", null);
__decorate([
    (0, common_1.Post)('reply/:commentId'),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Success' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof Request !== "undefined" && Request) === "function" ? _g : Object, String, typeof (_h = typeof comment_dto_1.ReplyCommentDto !== "undefined" && comment_dto_1.ReplyCommentDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "replyCommentController", null);
__decorate([
    (0, common_1.Put)(':commentId/reply/:replyId'),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Success' }),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Param)('replyId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof Request !== "undefined" && Request) === "function" ? _j : Object, String, String, typeof (_k = typeof comment_dto_1.ReplyCommentDto !== "undefined" && comment_dto_1.ReplyCommentDto) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateReplyCommentController", null);
__decorate([
    (0, common_1.Delete)(':commentId/reply/:replyId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Param)('replyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof Request !== "undefined" && Request) === "function" ? _l : Object, String, String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteReplyCommentController", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)('comment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [typeof (_a = typeof comment_service_1.CommentService !== "undefined" && comment_service_1.CommentService) === "function" ? _a : Object])
], CommentController);


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReplyCommentDto = exports.UpdateCommentDto = exports.CreateCommentDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'asdjksopkdoasodo', description: ' content comment for post' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '112233', description: 'key for encrypt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "postId", void 0);
class UpdateCommentDto {
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'asdjksopkdoasodo', description: ' content comment for post' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);
class ReplyCommentDto {
}
exports.ReplyCommentDto = ReplyCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'asdjksopkdoasodo', description: ' content comment for post' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReplyCommentDto.prototype, "content", void 0);


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportModule = void 0;
const common_1 = __webpack_require__(6);
const report_service_1 = __webpack_require__(137);
const report_controller_1 = __webpack_require__(139);
const config_1 = __webpack_require__(8);
const mongoose_1 = __webpack_require__(7);
const report_schema_1 = __webpack_require__(138);
const abilities_factory_1 = __webpack_require__(40);
const admin_module_1 = __webpack_require__(73);
const user_schema_1 = __webpack_require__(13);
const post_schema_1 = __webpack_require__(127);
const redis_module_1 = __webpack_require__(65);
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            admin_module_1.AdminModule,
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Report', schema: report_schema_1.ReportSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Post', schema: post_schema_1.PostSchema },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [report_controller_1.ReportController],
        providers: [report_service_1.ReportService, abilities_factory_1.AbilityFactory],
    })
], ReportModule);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const report_schema_1 = __webpack_require__(138);
const redis_service_1 = __webpack_require__(27);
let ReportService = class ReportService {
    constructor(reportModel, userModel, postModel, redisService) {
        this.reportModel = reportModel;
        this.userModel = userModel;
        this.postModel = postModel;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async createReportService(userId, postId, reportType, reportContent) {
        const report = new this.reportModel({
            userId,
            postId,
            reportType,
            reportContent,
        });
        await report.save();
        await this.deleteCache('reports:all');
        return { message: 'Report created successfully.' };
    }
    async getReportsService() {
        const cachedReports = await this.redisService.getJSON('reports:all', '$');
        if (cachedReports) {
            return JSON.parse(cachedReports);
        }
        const reports = await this.reportModel
            .find()
            .populate({
            path: 'userId',
            select: 'firstname lastname avatar rankID',
            populate: {
                path: 'rankID',
                select: 'rankName rankIcon'
            }
        })
            .populate({
            path: 'postId',
            populate: {
                path: 'userId',
                select: 'firstname lastname avatar isBlock',
            },
        });
        const groupedReports = reports.reduce((acc, report) => {
            const postId = report.postId.toString();
            if (!acc[postId]) {
                acc[postId] = {
                    post: report.postId,
                    report: [],
                };
            }
            const { postId: _, ...reportWithoutPostId } = report.toObject();
            acc[postId].report.push(reportWithoutPostId);
            return acc;
        }, {});
        const result = Object.values(groupedReports);
        await this.setCache('reports:all', result);
        return result;
    }
    async deleteReportService(reportId) {
        const report = await this.reportModel.findByIdAndDelete(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        await this.deleteCache('reports:all');
        return { message: 'Report deleted successfully.' };
    }
    async blockUserByReportService(reportId) {
        const report = await this.reportModel.findById(reportId).populate('postId');
        if (!report) {
            throw new common_1.BadRequestException('Report not found');
        }
        const userId = report.postId.userId;
        await this.userModel.findByIdAndUpdate(userId, { isBlock: true });
        report.status = 'Processed';
        await report.save();
        await this.deleteCache('reports:all');
        await this.redisService.flushAll();
        return { message: 'User blocked successfully.' };
    }
    async blockPostByReportService(reportId) {
        const report = await this.reportModel.findById(reportId).populate('postId');
        if (!report) {
            throw new common_1.BadRequestException('Report not found');
        }
        await this.postModel.findByIdAndUpdate(report.postId, {
            status: 'blocked',
        });
        report.status = 'Processed';
        await report.save();
        await this.deleteCache('reports:all');
        await this.redisService.flushAll();
        return { message: 'Post blocked successfully.' };
    }
    async rejectReportService(reportId) {
        const report = await this.reportModel.findById(reportId);
        if (!report) {
            throw new common_1.BadRequestException('Report not found');
        }
        report.status = 'rejected';
        await report.save();
        await this.deleteCache('reports:all');
        return { message: 'Report rejected successfully.' };
    }
    async deleteAllReportsbyPostIdService(postId) {
        await this.reportModel.deleteMany({ postId });
        await this.deleteCache('reports:all');
        return { message: 'All reports deleted successfully.' };
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __param(2, (0, mongoose_1.InjectModel)('Post')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], ReportService);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportSchema = exports.Report = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Report = class Report extends mongoose_2.Document {
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Report.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Report.prototype, "reportType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Report.prototype, "reportContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", String)
], Report.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, default: 'pending', enum: ['pending', 'Processed', 'rejected'] }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportController = void 0;
const common_1 = __webpack_require__(6);
const report_service_1 = __webpack_require__(137);
const swagger_1 = __webpack_require__(36);
const member_gaurd_1 = __webpack_require__(55);
const express_1 = __webpack_require__(47);
const jwt = __webpack_require__(37);
const report_dto_1 = __webpack_require__(140);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createReportController(request, postId, dto) {
        const userId = this.getUserIdFromToken(request);
        return await this.reportService.createReportService(userId, postId, dto.reportType, dto.reportContent);
    }
    async getReportsController() {
        return { reports: await this.reportService.getReportsService() };
    }
    async deleteAllReportsbyPostIdController(postId) {
        return await this.reportService.deleteAllReportsbyPostIdService(postId);
    }
    async deleteReportController(reportId) {
        return await this.reportService.deleteReportService(reportId);
    }
    async blockUserByReportController(reportId) {
        return await this.reportService.blockUserByReportService(reportId);
    }
    async blockPostByReportController(reportId) {
        return await this.reportService.blockPostByReportService(reportId);
    }
    async rejectReportController(reportId) {
        return await this.reportService.rejectReportService(reportId);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Post)(':postId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, String, typeof (_c = typeof report_dto_1.CreateReportDto !== "undefined" && report_dto_1.CreateReportDto) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ReportController.prototype, "createReportController", null);
__decorate([
    (0, common_1.Get)('list-report'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('report'),
    (0, casl_decorator_1.Action)('read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ReportController.prototype, "getReportsController", null);
__decorate([
    (0, common_1.Delete)('ss/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ReportController.prototype, "deleteAllReportsbyPostIdController", null);
__decorate([
    (0, common_1.Delete)(':reportId'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('report'),
    (0, casl_decorator_1.Action)('delete'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ReportController.prototype, "deleteReportController", null);
__decorate([
    (0, common_1.Patch)('block-user/:reportId'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('report'),
    (0, casl_decorator_1.Action)('block'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ReportController.prototype, "blockUserByReportController", null);
__decorate([
    (0, common_1.Patch)('block-post/:reportId'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('report'),
    (0, casl_decorator_1.Action)('block'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ReportController.prototype, "blockPostByReportController", null);
__decorate([
    (0, common_1.Patch)('reject/:reportId'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Subject)('report'),
    (0, casl_decorator_1.Action)('read'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ReportController.prototype, "rejectReportController", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)('report'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('report'),
    __metadata("design:paramtypes", [typeof (_a = typeof report_service_1.ReportService !== "undefined" && report_service_1.ReportService) === "function" ? _a : Object])
], ReportController);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReportDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '60f4b3b3b3b3b3b3b3b3b3b3',
        description: 'type report',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'nội  dung khiếm nhã',
        description: 'content report',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reportContent", void 0);


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsModule = void 0;
const common_1 = __webpack_require__(6);
const statistics_service_1 = __webpack_require__(142);
const statistics_controller_1 = __webpack_require__(143);
const config_1 = __webpack_require__(8);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(13);
const rank_schema_1 = __webpack_require__(33);
const admin_module_1 = __webpack_require__(73);
const abilities_factory_1 = __webpack_require__(40);
const post_schema_1 = __webpack_require__(127);
const redis_module_1 = __webpack_require__(65);
let StatisticsModule = class StatisticsModule {
};
exports.StatisticsModule = StatisticsModule;
exports.StatisticsModule = StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisCacheModule,
            admin_module_1.AdminModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: rank_schema_1.Rank.name, schema: rank_schema_1.RankSchema },
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
        ],
        controllers: [statistics_controller_1.StatisticsController],
        providers: [statistics_service_1.StatisticsService, abilities_factory_1.AbilityFactory],
        exports: [statistics_service_1.StatisticsService],
    })
], StatisticsModule);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const rank_schema_1 = __webpack_require__(33);
const user_schema_1 = __webpack_require__(13);
let StatisticsService = class StatisticsService {
    constructor(userModel, rankModel, postModel) {
        this.userModel = userModel;
        this.rankModel = rankModel;
        this.postModel = postModel;
    }
    async statisticsUserFollowRankService() {
        const users = await this.userModel.find();
        const ranks = await this.rankModel.find();
        const statistics = [];
        try {
            for (const rank of ranks) {
                if (!rank._id)
                    continue;
                const userFollowRank = users.filter((user) => user.rankID && user.rankID.toString() === rank._id.toString());
                statistics.push({
                    rankName: rank.rankName,
                    totalUserFollowRank: userFollowRank.length,
                });
            }
            return statistics;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async statisticsTopPost(filter, start, end) {
        const posts = await this.postModel.find();
        const topPost = posts.filter((post) => {
            let count = 0;
            if (filter === 'like') {
                count = post.reactionCount;
            }
            else if (filter === 'comment') {
                count = post.commentCount;
            }
            else {
                count = post.commentCount + post.reactionCount;
            }
            return count >= start && count <= end;
        });
        const count = topPost.length;
        return { posts: topPost, count: count };
    }
    async statisticsUserService(filter, numberOfItem) {
        const users = await this.userModel.find();
        const statistics = [];
        let date = new Date();
        for (let i = 0; i < numberOfItem; i++) {
            const formattedDate = this.formatDateByFilter(date, filter);
            const userFollowRank = users.filter((user) => {
                const userCreatedAtFormatted = this.formatDateByFilter(new Date(user.createdAt), filter);
                return userCreatedAtFormatted === formattedDate;
            });
            statistics.push({
                title: formattedDate,
                count: userFollowRank.length,
            });
            switch (filter) {
                case 'day':
                    date.setDate(date.getDate() - 1);
                    break;
                case 'month':
                    if (date.getMonth() === 0) {
                        date.setFullYear(date.getFullYear() - 1);
                        date.setMonth(11);
                    }
                    else {
                        date.setMonth(date.getMonth() - 1);
                    }
                    break;
                case 'year':
                    date.setFullYear(date.getFullYear() - 1);
                    break;
            }
        }
        return statistics;
    }
    formatDateByFilter(date, filter) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        switch (filter) {
            case 'day':
                return `${day}/${month}/${year}`;
            case 'month':
                return `${month}/${year}`;
            case 'year':
                return year.toString();
            default:
                throw new Error('Invalid filter');
        }
    }
    async statisticsPostService(filter, numberOfItem) {
        const posts = await this.postModel.find();
        const statistics = [];
        let date = new Date();
        for (let i = 0; i < numberOfItem; i++) {
            const formattedDate = this.formatDateByFilter(date, filter);
            const post = posts.filter((post) => {
                const postCreatedAtFormatted = this.formatDateByFilter(new Date(post.createdAt), filter);
                return postCreatedAtFormatted === formattedDate;
            });
            statistics.push({
                title: formattedDate,
                count: post.length,
            });
            switch (filter) {
                case 'day':
                    date.setDate(date.getDate() - 1);
                    break;
                case 'month':
                    if (date.getMonth() === 0) {
                        date.setFullYear(date.getFullYear() - 1);
                        date.setMonth(11);
                    }
                    else {
                        date.setMonth(date.getMonth() - 1);
                    }
                    break;
                case 'year':
                    date.setFullYear(date.getFullYear() - 1);
                    break;
            }
        }
        return statistics;
    }
    async statisticsUserOptionDayService(start, end) {
        const users = await this.userModel.find();
        const statistics = {};
        const newStart = new Date(start);
        const newEnd = new Date(end);
        newEnd.setHours(23, 59, 59, 999);
        let currentDate = new Date(newStart);
        while (currentDate <= newEnd) {
            const dateString = currentDate.toISOString().split('T')[0];
            statistics[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        for (const user of users) {
            const userCreatedAt = new Date(user.createdAt);
            if (userCreatedAt >= newStart && userCreatedAt <= newEnd) {
                const createdAtString = userCreatedAt.toISOString().split('T')[0];
                if (statistics.hasOwnProperty(createdAtString)) {
                    statistics[createdAtString] += 1;
                }
            }
        }
        const statisticsArray = Object.keys(statistics).map((date) => ({
            title: date,
            count: statistics[date],
        }));
        return statisticsArray;
    }
    async statisticsPostOptionDayService(start, end) {
        const posts = await this.postModel.find();
        const statistics = {};
        const newStart = new Date(start);
        const newEnd = new Date(end);
        newEnd.setHours(23, 59, 59, 999);
        let currentDate = new Date(newStart);
        while (currentDate <= newEnd) {
            const dateString = currentDate.toISOString().split('T')[0];
            statistics[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        for (const post of posts) {
            const postCreatedAt = new Date(post.createdAt);
            if (postCreatedAt >= newStart && postCreatedAt <= newEnd) {
                const createdAtString = postCreatedAt.toISOString().split('T')[0];
                if (statistics.hasOwnProperty(createdAtString)) {
                    statistics[createdAtString] += 1;
                }
            }
        }
        const statisticsArray = Object.keys(statistics).map((date) => ({
            title: date,
            count: statistics[date],
        }));
        return statisticsArray;
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(rank_schema_1.Rank.name)),
    __param(2, (0, mongoose_1.InjectModel)('Post')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], StatisticsService);


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StatisticsController_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsController = void 0;
const common_1 = __webpack_require__(6);
const statistics_service_1 = __webpack_require__(142);
const swagger_1 = __webpack_require__(36);
const permission_gaurd_1 = __webpack_require__(39);
const casl_decorator_1 = __webpack_require__(46);
const querydate_dto_1 = __webpack_require__(144);
const redis_service_1 = __webpack_require__(27);
let StatisticsController = StatisticsController_1 = class StatisticsController {
    constructor(statisticsService, redisService) {
        this.statisticsService = statisticsService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(StatisticsController_1.name);
    }
    async getCachedData(cacheKey, ttl, fetchFunction) {
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const data = await fetchFunction();
            await this.redisService.set(cacheKey, JSON.stringify(data), ttl);
            return data;
        }
        catch (error) {
            this.logger.error(`Error retrieving data for cacheKey: ${cacheKey}`, error.stack);
            throw new common_1.InternalServerErrorException('Error retrieving data');
        }
    }
    async statisticsUserFollowRankController() {
        const cacheKey = 'user-follow-rank';
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsUserFollowRankService());
    }
    async statisticsTopPostController(filter, start, end) {
        const cacheKey = `top-post-${filter}-${start}-${end}`;
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsTopPost(filter, start, end));
    }
    async statisticsUserController(filter, numberOfItem) {
        const cacheKey = `user-${filter}-${numberOfItem}`;
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsUserService(filter, numberOfItem));
    }
    async statisticsPostController(filter, numberOfItem) {
        const cacheKey = `post-${filter}-${numberOfItem}`;
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsPostService(filter, numberOfItem));
    }
    async statisticsUserOptionDayController(dto) {
        const cacheKey = `user-option-day-${dto.start}-${dto.end}`;
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsUserOptionDayService(dto.start, dto.end));
    }
    async statisticsPostOptionDayController(dto) {
        const cacheKey = `post-option-day-${dto.start}-${dto.end}`;
        const ttl = 60;
        return this.getCachedData(cacheKey, ttl, () => this.statisticsService.statisticsPostOptionDayService(dto.start, dto.end));
    }
    async flushCache() {
        try {
            await this.redisService.flushAll();
            return { message: 'Cache flushed successfully' };
        }
        catch (error) {
            this.logger.error('Error flushing cache', error.stack);
            throw new common_1.InternalServerErrorException('Error flushing cache');
        }
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('user-follow-rank'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get user follow rank statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], StatisticsController.prototype, "statisticsUserFollowRankController", null);
__decorate([
    (0, common_1.Get)('top-post'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get top post statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __param(0, (0, common_1.Query)('filter')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], StatisticsController.prototype, "statisticsTopPostController", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get user statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __param(0, (0, common_1.Query)('filter')),
    __param(1, (0, common_1.Query)('numberOfItem')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], StatisticsController.prototype, "statisticsUserController", null);
__decorate([
    (0, common_1.Get)('post'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get post statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __param(0, (0, common_1.Query)('filter')),
    __param(1, (0, common_1.Query)('numberOfItem')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], StatisticsController.prototype, "statisticsPostController", null);
__decorate([
    (0, common_1.Get)('user-option-day'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get user option day statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof querydate_dto_1.QueryDto !== "undefined" && querydate_dto_1.QueryDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], StatisticsController.prototype, "statisticsUserOptionDayController", null);
__decorate([
    (0, common_1.Get)('post-option-day'),
    (0, common_1.UseGuards)(permission_gaurd_1.PermissionGuard),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get post option day statistics' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof querydate_dto_1.QueryDto !== "undefined" && querydate_dto_1.QueryDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], StatisticsController.prototype, "statisticsPostOptionDayController", null);
__decorate([
    (0, common_1.Get)('flush-cache'),
    (0, casl_decorator_1.Action)('read'),
    (0, casl_decorator_1.Subject)('dashboard'),
    (0, swagger_1.ApiOkResponse)({ description: 'Flush all cache' }),
    (0, swagger_1.ApiBadGatewayResponse)({ description: 'Bad gateway' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], StatisticsController.prototype, "flushCache", null);
exports.StatisticsController = StatisticsController = StatisticsController_1 = __decorate([
    (0, swagger_1.ApiTags)('statistics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [typeof (_a = typeof statistics_service_1.StatisticsService !== "undefined" && statistics_service_1.StatisticsService) === "function" ? _a : Object, typeof (_b = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _b : Object])
], StatisticsController);


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryDto = void 0;
const swagger_1 = __webpack_require__(36);
class QueryDto {
}
exports.QueryDto = QueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'Start date',
        example: '2021-01-01',
        required: true
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], QueryDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'End date',
        example: '2021-01-01',
        required: true
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], QueryDto.prototype, "end", void 0);


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventGateway = void 0;
const websockets_1 = __webpack_require__(146);
const socket_io_1 = __webpack_require__(147);
const auth_service_1 = __webpack_require__(88);
const schedule_service_1 = __webpack_require__(117);
const story_service_1 = __webpack_require__(148);
const message_service_1 = __webpack_require__(150);
const common_1 = __webpack_require__(6);
const stream_1 = __webpack_require__(152);
const users_service_1 = __webpack_require__(11);
const encryption_service_1 = __webpack_require__(31);
const mailer_service_1 = __webpack_require__(89);
let EventGateway = class EventGateway {
    constructor(authService, scheduleService, storyService, messageService, usersService, encryptionService, mailerService) {
        this.authService = authService;
        this.scheduleService = scheduleService;
        this.storyService = storyService;
        this.messageService = messageService;
        this.usersService = usersService;
        this.encryptionService = encryptionService;
        this.mailerService = mailerService;
        this.clients = new Map();
        this.startConditionCheck();
        this.startConditionStoryCheck();
    }
    handleDisconnect(socket) {
        console.log('Socket disconnected', 'Socket ID:', socket.id, 'User ID:', socket.data?._id);
        this.clients.delete(socket.id);
    }
    async handleConnection(socket) {
        const authHeader = socket.handshake.headers.authorization;
        if (authHeader && typeof authHeader === 'string') {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const userId = await this.authService.handleVerifyTokenService(token);
                    if (userId) {
                        socket.data = { _id: userId };
                        console.log('Socket connected', 'Socket ID:', socket.id, 'User ID:', userId);
                        socket.join(userId);
                        this.clients.set(socket.id, { socket, lastSchedules: null });
                    }
                    else {
                        console.log('Authentication failed - disconnecting socket');
                        socket.disconnect();
                    }
                }
                catch (err) {
                    console.error('Error during connection handling:', err);
                    socket.disconnect();
                }
            }
            else {
                console.log('No token provided - disconnecting socket');
                socket.disconnect();
            }
        }
        else {
            console.log('No authorization header - disconnecting socket');
            socket.disconnect();
        }
    }
    afterInit(server) {
        console.log('Socket server initialized');
    }
    startConditionCheck() {
        setInterval(async () => {
            try {
                await this.checkConditionAndNotifyClients();
            }
            catch (error) {
                console.error('Error checking condition:', error);
            }
        }, 5000);
    }
    startConditionStoryCheck() {
        setInterval(async () => {
            try {
                await this.storyService.checkExpiredStoryService();
            }
            catch (error) {
                console.error('Error checking condition:', error);
            }
        }, 3600000);
    }
    async handleChat(socket, data) {
        const senderId = socket.data?._id;
        if (!senderId) {
            console.error('User ID is undefined');
            throw new common_1.BadRequestException('User ID is undefined.');
        }
        try {
            let file = undefined;
            if (data.file && data.fileName && data.fileType) {
                file = await this.processFile({
                    file: data.file,
                    fileName: data.fileName,
                    fileType: data.fileType,
                });
            }
            const message = await this.messageService.saveMessage(senderId, data.receiverId, data.content, file);
            const [detailsSender, detailsReceiver] = await Promise.all([
                this.usersService.findOneUserForMessageService(senderId),
                this.usersService.findOneUserForMessageService(data.receiverId),
            ]);
            const messageToSend = {
                _id: message._id,
                senderId: senderId,
                receiverId: message.receiverId,
                senderDetails: detailsSender,
                receiverDetails: detailsReceiver,
                content: message.content
                    ? this.encryptionService.rsaDecrypt(message.content)
                    : null,
                image: message.image
                    ? this.encryptionService.rsaDecrypt(message.image)
                    : null,
                createdAt: message.createdAt,
            };
            this.server.to(data.receiverId).emit('chat', messageToSend);
            this.server.to(senderId).emit('chat', messageToSend);
        }
        catch (error) {
            console.error('Error saving message:', error);
            throw new common_1.BadRequestException('Failed to save message.');
        }
    }
    async processFile(data) {
        const base64Data = data.file.split(',')[1];
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const readableInstanceStream = new stream_1.Readable();
        readableInstanceStream.push(fileBuffer);
        readableInstanceStream.push(null);
        return {
            buffer: fileBuffer,
            originalname: data.fileName,
            mimetype: data.fileType,
            fieldname: '',
            encoding: '',
            size: fileBuffer.length,
            stream: readableInstanceStream,
            destination: '',
            filename: '',
            path: '',
        };
    }
    async checkConditionAndNotifyClients() {
        for (const [socketId, client] of this.clients.entries()) {
            const userId = client.socket.data?._id;
            if (userId) {
                try {
                    const schedules = await this.scheduleService.notifyScheduleService(userId);
                    if (JSON.stringify(schedules) !== JSON.stringify(client.lastSchedules)) {
                        console.log('Schedules updated for user:', userId);
                        this.server.to(userId).emit('schedules', schedules);
                        client.lastSchedules = schedules;
                        this.mailerService.sendEmailNotification(userId, schedules);
                    }
                    else {
                    }
                }
                catch (error) {
                    console.error('Error getting schedules for user', userId, ':', error);
                }
            }
            else {
                console.error('User ID is undefined for socket ID:', socketId);
            }
        }
    }
};
exports.EventGateway = EventGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_h = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _h : Object)
], EventGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object, Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], EventGateway.prototype, "handleChat", null);
exports.EventGateway = EventGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof schedule_service_1.ScheduleService !== "undefined" && schedule_service_1.ScheduleService) === "function" ? _b : Object, typeof (_c = typeof story_service_1.StoryService !== "undefined" && story_service_1.StoryService) === "function" ? _c : Object, typeof (_d = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" ? _d : Object, typeof (_e = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _e : Object, typeof (_f = typeof encryption_service_1.EncryptionService !== "undefined" && encryption_service_1.EncryptionService) === "function" ? _f : Object, typeof (_g = typeof mailer_service_1.MailerService !== "undefined" && mailer_service_1.MailerService) === "function" ? _g : Object])
], EventGateway);


/***/ }),
/* 146 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/websockets");

/***/ }),
/* 147 */
/***/ ((module) => {

"use strict";
module.exports = require("socket.io");

/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const story_schema_1 = __webpack_require__(149);
const cloudinary_service_1 = __webpack_require__(14);
let StoryService = class StoryService {
    constructor(storyModel, cloudinaryService) {
        this.storyModel = storyModel;
        this.cloudinaryService = cloudinaryService;
    }
    async checkFile(file) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        if (file.mimetype.includes('image')) {
            return 'image';
        }
        else if (file.mimetype.includes('video')) {
            return 'video';
        }
        else {
            throw new common_1.BadRequestException('Unsupported file type');
        }
    }
    async createStoryService(userId, title, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        try {
            const checkFileType = await this.checkFile(file);
            let mediaUrl;
            let thumbnailUrl;
            const uploadService = checkFileType === 'image'
                ? this.cloudinaryService.uploadImageService
                : this.cloudinaryService.uploadVideoService;
            const fileUpload = await uploadService.call(this.cloudinaryService, title, file);
            mediaUrl = fileUpload.uploadResult.url;
            thumbnailUrl = fileUpload.thumbnailResult?.url;
            const newStory = new this.storyModel({ userId, title, mediaUrl, thumbnailUrl });
            return await newStory.save();
        }
        catch (error) {
            console.error('Error in createStoryService:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            else if (error.http_code === 400) {
                throw new common_1.BadRequestException('Invalid file type or upload error');
            }
            else {
                throw new common_1.BadRequestException('Error creating story');
            }
        }
    }
    async deleteStoryService(userId, storyId) {
        try {
            const story = await this.storyModel.findOne({
                _id: storyId,
                userId: userId,
            });
            if (!story) {
                throw new common_1.BadRequestException('Story not found or user does not have permission to delete this story.');
            }
            if (story.mediaUrl) {
                await this.cloudinaryService.deleteMediaService(story.mediaUrl);
            }
            await this.storyModel.findByIdAndDelete(storyId);
            return { message: 'Story deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting story:', error);
            throw new common_1.BadRequestException('Error deleting story');
        }
    }
    async getListStoryService() {
        return await this.storyModel
            .find({ status: 'active' })
            .populate('userId', 'firstname lastname _id')
            .exec();
    }
    async getMyStoryService(userId) {
        return await this.storyModel
            .find({ userId: userId })
            .populate('userId', 'firstname lastname _id')
            .exec();
    }
    async checkExpiredStoryService() {
        try {
            console.log('Checking for expired stories');
            await this.storyModel.updateMany({ createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, { status: 'expired' });
            return { message: 'Expired stories deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting expired stories:', error);
            throw new common_1.BadRequestException('Error deleting expired stories');
        }
    }
};
exports.StoryService = StoryService;
exports.StoryService = StoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(story_schema_1.Story.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object])
], StoryService);


/***/ }),
/* 149 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StorySchema = exports.Story = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Story = class Story extends mongoose_2.Document {
};
exports.Story = Story;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: true }),
    __metadata("design:type", String)
], Story.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, required: true, ref: 'User' }),
    __metadata("design:type", String)
], Story.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: false, default: 'https://i.pinimg.com/originals/b5/b4/1f/b5b41f6906dff7cb81a654ee63885eb3.jpg' }),
    __metadata("design:type", String)
], Story.prototype, "mediaUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: false }),
    __metadata("design:type", String)
], Story.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, required: false, default: 'active' }),
    __metadata("design:type", String)
], Story.prototype, "status", void 0);
exports.Story = Story = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Story);
exports.StorySchema = mongoose_1.SchemaFactory.createForClass(Story);


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const message_schema_1 = __webpack_require__(151);
const cloudinary_service_1 = __webpack_require__(14);
const encryption_service_1 = __webpack_require__(31);
const redis_service_1 = __webpack_require__(27);
let MessageService = class MessageService {
    constructor(messageModel, cloudinaryService, encryptionService, redisService) {
        this.messageModel = messageModel;
        this.cloudinaryService = cloudinaryService;
        this.encryptionService = encryptionService;
        this.redisService = redisService;
    }
    async deleteCache(key) {
        await this.redisService.delJSON(key, '$');
    }
    async setCache(key, data) {
        await this.redisService.setJSON(key, '$', JSON.stringify(data));
    }
    async saveMessage(senderId, receiverId, content, file) {
        try {
            console.log(`Saving message from ${senderId} to ${receiverId}`);
            let image;
            if (file) {
                const imageFile = await this.cloudinaryService.uploadImageService(senderId.toString(), file);
                image = this.encryptionService.rsaEncrypt(imageFile.uploadResult.url);
            }
            if (!content && !image) {
                throw new common_1.BadRequestException('Message content or image must be provided.');
            }
            const messageData = { senderId, receiverId };
            if (content)
                messageData.content = this.encryptionService.rsaEncrypt(content);
            if (image)
                messageData.image = image;
            const message = new this.messageModel(messageData);
            const savedMessage = await message.save();
            await this.deleteCache(`messages:${senderId}`);
            await this.deleteCache(`messages:${receiverId}`);
            return savedMessage;
        }
        catch (error) {
            console.error("Error saving message:", error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getMessagesForUser(userId) {
        try {
            const cacheKey = `messages:${userId}`;
            const cachedMessages = await this.redisService.getJSON(cacheKey, '$');
            if (cachedMessages) {
                console.log('Messages fetched from cache successfully.');
                return JSON.parse(cachedMessages);
            }
            const messages = await this.messageModel
                .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
                .populate('senderId', 'avatar firstname lastname')
                .populate('receiverId', 'avatar firstname lastname');
            const decryptedMessages = messages.map(message => {
                if (message.content)
                    message.content = this.encryptionService.rsaDecrypt(message.content);
                if (message.image)
                    message.image = this.encryptionService.rsaDecrypt(message.image);
                return message;
            });
            const groupedMessages = decryptedMessages.reduce((acc, message) => {
                const otherUserId = message.senderId.toString() === userId ? message.receiverId.toString() : message.senderId.toString();
                if (!acc[otherUserId]) {
                    acc[otherUserId] = {
                        messages: [],
                    };
                }
                acc[otherUserId].messages.push({
                    [userId]: {
                        content: message.content,
                        image: message.image,
                        createdAt: message.createdAt,
                    },
                    [otherUserId]: {
                        content: message.content,
                        image: message.image,
                        createdAt: message.createdAt,
                    }
                });
                return acc;
            }, {});
            const transformedMessages = {
                [userId]: Object.keys(groupedMessages).map(otherUserId => ({
                    [otherUserId]: groupedMessages[otherUserId]
                }))
            };
            await this.redisService.setJSON(cacheKey, '$', JSON.stringify(transformedMessages));
            console.log('Messages fetched from database and cached successfully.');
            return transformedMessages;
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            throw new common_1.BadRequestException('Failed to fetch messages');
        }
    }
    async deleteMessage(messageId, userId) {
        try {
            const message = await this.messageModel.findOneAndDelete({ _id: messageId, $or: [{ senderId: userId }, { receiverId: userId }] });
            if (message.image)
                await this.cloudinaryService.deleteMediaService(message.image);
            await this.deleteCache(`messages:${message.senderId}`);
            await this.deleteCache(`messages:${message.receiverId}`);
            return message;
        }
        catch (error) {
            console.error("Error deleting message:", error);
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof cloudinary_service_1.CloudinaryService !== "undefined" && cloudinary_service_1.CloudinaryService) === "function" ? _b : Object, typeof (_c = typeof encryption_service_1.EncryptionService !== "undefined" && encryption_service_1.EncryptionService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], MessageService);


/***/ }),
/* 151 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageSchema = exports.Message = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const mongoose_3 = __webpack_require__(12);
let Message = class Message extends mongoose_2.Document {
};
exports.Message = Message;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Message.prototype, "receiverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.String, }),
    __metadata("design:type", String)
], Message.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_3.default.Schema.Types.Date, required: true, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Message.prototype, "createdAt", void 0);
exports.Message = Message = __decorate([
    (0, mongoose_1.Schema)()
], Message);
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);


/***/ }),
/* 152 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryModule = void 0;
const common_1 = __webpack_require__(6);
const story_service_1 = __webpack_require__(148);
const story_controller_1 = __webpack_require__(154);
const mongoose_1 = __webpack_require__(7);
const story_schema_1 = __webpack_require__(149);
const cloudinary_module_1 = __webpack_require__(56);
const rank_module_1 = __webpack_require__(122);
let StoryModule = class StoryModule {
};
exports.StoryModule = StoryModule;
exports.StoryModule = StoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            rank_module_1.RankModule,
            mongoose_1.MongooseModule.forFeature([{ name: story_schema_1.Story.name, schema: story_schema_1.StorySchema }]),
            cloudinary_module_1.CloudinaryModule
        ],
        controllers: [story_controller_1.StoryController],
        providers: [story_service_1.StoryService],
        exports: [story_service_1.StoryService]
    })
], StoryModule);


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryController = void 0;
const common_1 = __webpack_require__(6);
const story_service_1 = __webpack_require__(148);
const story_dto_1 = __webpack_require__(155);
const member_gaurd_1 = __webpack_require__(55);
const jwt = __webpack_require__(37);
const swagger_1 = __webpack_require__(36);
const platform_express_1 = __webpack_require__(38);
const rank_gaurd_1 = __webpack_require__(156);
let StoryController = class StoryController {
    constructor(storyService) {
        this.storyService = storyService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async createStoryController(dto, req, file) {
        const userId = this.getUserIdFromToken(req);
        return await this.storyService.createStoryService(userId, dto.title, file);
    }
    async deleteStoryController(req, storyId) {
        const userId = this.getUserIdFromToken(req);
        return await this.storyService.deleteStoryService(userId, storyId);
    }
    async getListStoryController() {
        return await this.storyService.getListStoryService();
    }
    async getMyStoryController(req) {
        const userId = this.getUserIdFromToken(req);
        return await this.storyService.getMyStoryService(userId);
    }
};
exports.StoryController = StoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(rank_gaurd_1.RankGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully created.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof story_dto_1.StoryDto !== "undefined" && story_dto_1.StoryDto) === "function" ? _b : Object, typeof (_c = typeof Request !== "undefined" && Request) === "function" ? _c : Object, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], StoryController.prototype, "createStoryController", null);
__decorate([
    (0, common_1.Delete)(':storyId'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof Request !== "undefined" && Request) === "function" ? _g : Object, String]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], StoryController.prototype, "deleteStoryController", null);
__decorate([
    (0, common_1.Get)('list-story'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], StoryController.prototype, "getListStoryController", null);
__decorate([
    (0, common_1.Get)('my-story'),
    (0, common_1.UseGuards)(member_gaurd_1.MemberGuard),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The record has been successfully deleted.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof Request !== "undefined" && Request) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], StoryController.prototype, "getMyStoryController", null);
exports.StoryController = StoryController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('story'),
    (0, common_1.Controller)('story'),
    __metadata("design:paramtypes", [typeof (_a = typeof story_service_1.StoryService !== "undefined" && story_service_1.StoryService) === "function" ? _a : Object])
], StoryController);


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryDto = void 0;
const swagger_1 = __webpack_require__(36);
const class_validator_1 = __webpack_require__(50);
class StoryDto {
}
exports.StoryDto = StoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        description: 'The title of the story',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], StoryDto.prototype, "title", void 0);


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RankGuard = void 0;
const common_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(35);
const rank_service_1 = __webpack_require__(123);
const auth_gaurd_1 = __webpack_require__(34);
let RankGuard = class RankGuard extends auth_gaurd_1.AuthGuard {
    constructor(jwtService, rankService) {
        super(jwtService);
        this.rankService = rankService;
    }
    async canActivate(context) {
        const canActivate = await super.canActivate(context);
        if (!canActivate) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const { role, isBlock, rankID } = request.user;
        if (role !== 'member' || isBlock) {
            throw new common_1.UnauthorizedException('Access denied: Invalid role or user is blocked.');
        }
        try {
            const rank = await this.rankService.getRankDetailService(rankID);
            if (!rank.action.includes('story')) {
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Access denied: Unable to verify user rank.');
        }
        return true;
    }
};
exports.RankGuard = RankGuard;
exports.RankGuard = RankGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof rank_service_1.RankService !== "undefined" && rank_service_1.RankService) === "function" ? _b : Object])
], RankGuard);


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModule = void 0;
const common_1 = __webpack_require__(6);
const message_service_1 = __webpack_require__(150);
const message_controller_1 = __webpack_require__(158);
const mongoose_1 = __webpack_require__(7);
const message_schema_1 = __webpack_require__(151);
const cloudinary_module_1 = __webpack_require__(56);
const encryption_module_1 = __webpack_require__(85);
const redis_module_1 = __webpack_require__(65);
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            encryption_module_1.EncryptionModule,
            cloudinary_module_1.CloudinaryModule,
            redis_module_1.RedisCacheModule,
            mongoose_1.MongooseModule.forFeature([{ name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema }]),
        ],
        controllers: [message_controller_1.MessageController],
        providers: [message_service_1.MessageService],
        exports: [message_service_1.MessageService],
    })
], MessageModule);


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageController = void 0;
const common_1 = __webpack_require__(6);
const message_service_1 = __webpack_require__(150);
const jwt = __webpack_require__(37);
const swagger_1 = __webpack_require__(36);
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    getUserIdFromToken(request) {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        return decodedToken._id;
    }
    async deleteMessageController(messageId, request) {
        const userId = this.getUserIdFromToken(request);
        return this.messageService.deleteMessage(messageId, userId);
    }
    async getMessagesForUserController(request) {
        const userId = this.getUserIdFromToken(request);
        return this.messageService.getMessagesForUser(userId);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Delete)(':messageId'),
    (0, swagger_1.ApiOkResponse)({
        description: 'The record has been successfully deleted',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Request !== "undefined" && Request) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], MessageController.prototype, "deleteMessageController", null);
__decorate([
    (0, common_1.Get)('get-messages'),
    (0, swagger_1.ApiOkResponse)({
        description: 'The messages have been successfully retrieved',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof Request !== "undefined" && Request) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], MessageController.prototype, "getMessagesForUserController", null);
exports.MessageController = MessageController = __decorate([
    (0, swagger_1.ApiTags)('message'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('message'),
    __metadata("design:paramtypes", [typeof (_a = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" ? _a : Object])
], MessageController);


/***/ }),
/* 159 */
/***/ ((module) => {

"use strict";
module.exports = require("compression");

/***/ }),
/* 160 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("8a507265da12c5ecfbbd")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;