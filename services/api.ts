
/**
 * @file Этот файл является единой точкой входа (хабом) для всех API-сервисов.
 * Он импортирует и ре-экспортирует все функции из модульных файлов,
 * расположенных в директории `./api/`. Это позволяет остальной части приложения
 * импортировать все необходимое из одного места, сохраняя при этом
 * чистоту и модульность кода.
 */

export * from './api/ai.api';
export * from './api/ai_preset.api';
export * from './api/auth.api';
export * from './api/global_variable.api';
export * from './api/management.api';
export * from './api/market.api';
export * from './api/media.api';
export * from './api/note.api';
export * from './api/post.api';
export * from './api/project.api';
export * from './api/tag.api';
export * from './api/lists.api';
export * from './api/system_accounts.api';
export * from './api/project_context.api';
export * from './api/ai_token.api';
export * from './api/automations.api';
export * from './api/automations_ai.api';
