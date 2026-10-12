# Результат переработки PR

## Issues/Notes

- Разрешены все merge-конфликты с `main`; сохранена актуальная реализация лендинга из `main`, а навигация ET-8 и якорь `#live-coach` добавлены обратно.
- Vitest обновлён до `^5.0.4`, lock-файл пересоздан. `npm audit` сообщает 0 уязвимостей.
- Мобильная навигация получила отдельный вертикальный контейнер без горизонтального overflow.
- Секция Live Coach теперь имеет корректный доступный заголовок `coach-title`.

## Approach

- Добавлены регрессионные тесты для якоря Interactive Demo, доступного имени Live Coach и мобильной навигации.
- Ограничен lint-скрипт исходниками приложения и конфигурацией, чтобы bootstrap-код `.dmtools` не попадал в проверку.
- Обновлены конфигурации Vitest/Playwright и разрешены конфликты конфигурационных файлов в пользу актуального `main`.

## Files Modified

- `package.json`, `package-lock.json`
- `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`
- `tests/e2e/landing.spec.ts`
- `vitest.config.ts`, `playwright.config.ts`, TypeScript-конфигурация и `README.md`
- Файлы актуальной реализации из `main` сохранены при разрешении конфликтов.

## Test Coverage

- `git diff --check` — пройден.
- `npx eslint src test tests/e2e e2e vite.config.ts vitest.config.ts playwright.config.ts --max-warnings 0` — пройден.
- `npm run typecheck` — пройден.
- `npm test` — пройдено: 6 test files, 11 tests.
- `npm run test:e2e` — пройдено: 4 tests.
- `npm run build` — пройден.
- `npm audit --audit-level=moderate` — пройден, уязвимости не обнаружены.

