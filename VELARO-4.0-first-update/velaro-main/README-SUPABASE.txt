VELARO — ПІДКЛЮЧЕННЯ SUPABASE ТА ЗАХИСТ АДМІНКИ

1. Відкрийте js/supabase-config.js.
2. Вставте свій Publishable key замість PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE.
   Secret key вставляти не можна.

3. У Supabase відкрийте SQL Editor -> New query.
4. Відкрийте файл SUPABASE-SETUP.sql, скопіюйте весь текст і натисніть Run.
   Це дозволить усім бачити каталог, але редагування буде лише після входу.

5. У Supabase відкрийте Authentication -> Users -> Add user.
6. Створіть свій email і пароль. Саме ними ви входитимете на /admin/.
   Не створюйте облікові записи стороннім людям.

7. Запустіть сайт. Відкрийте /admin/, увійдіть і натисніть
   «Відновити приклади», щоб записати 32 товари в спільну базу.

8. Перевірка:
   - додайте тестовий товар в адмінці;
   - відкрийте магазин в інкогніто;
   - товар повинен бути видимий.

Публікація в GitHub із кореня репозиторію:
  git add .
  git commit -m "Connect Velaro to Supabase with protected admin"
  git push

ВАЖЛИВО:
- Publishable key можна використовувати у браузері. Захист забезпечує RLS.
- Secret/service_role key ніколи не вставляйте у файли сайту.
- Фото до 700 КБ зараз зберігаються як data URL у таблиці products.
