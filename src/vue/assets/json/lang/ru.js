export default {
  // Actions
  View: 'Просмотр',
  Add: 'Добавить',
  Edit: 'Редактировать',
  Renew: 'Продлить',
  Delete: 'Удалить',
  SaveAs: 'Экспорт',
  Cancel: 'Отменить',
  Send: 'Отправить',

  // Navigation
  Organizations: 'Органы ОРМ и надзора',
  Users: 'Учетные записи',
  Folders: 'Папки заданий',
  Missions: 'Задания',
  Processing: 'Обработка',
  Surveillance: 'Обработка',
  Sanctions: 'Санкции',
  Equipment: 'Оборудование',
  CheckingState: 'Проверка технического состояния и перехвата сообщений абонентов',
  Monitoring: 'Проверка технического состояния и перехвата сообщений абонентов',
  Synchronization: 'Синхронизация',
  WhiteLists: 'Недопустимые идентификаторы',
  Whitelists: 'Недопустимые идентификаторы',
  CommunicationObjects: 'Объекты связи',
  Communicationobjects: 'Объекты связи',
  Audits: 'Журнал',
  PasswordChange: 'Сменить пароль',
  Changepassword: 'Сменить пароль',
  PasswordChangeTitle: 'Изменение пароля администратора',
  TrafficControll: 'Управление трафиком',
  Trafficcontroller: 'Управление трафиком',
  Uploadcryptokey: 'Загрузка ключа расшифровки трафика',
  Signin: 'Вход в систему',
  Logout: 'Выход из системы',

  // State
  Active: 'Активно',
  NotActive: 'Неактивно',

  // Roles
  ROLE_ADMIN: 'Главный администратор',
  ROLE_ADMIN_MISSION: 'Администратор заданий',
  ROLE_ADMIN_HARDWARE: 'Администратор оборудования',
  ROLE_ADMIN_OBR: 'Администратор обработки',
  ROLE_SUPERVISOR: 'Надзорщик',
  ROLE_OBR: 'Обработчик',
  ROLE_USER: 'Пользователь',

  // Kind
  ORG_ORM: 'Орган ОРМ',
  ORG_SUPERVISOR: 'Орган надзора',

  // Forms
  All: 'Все',
  Select: 'Выберите',
  SelectAll: 'Выбрать все',
  Role: 'Права доступа',

  // Header right
  Handler: 'Обработчик',
  AccessRights: 'Права доступа',
  Exit: 'Выйти',
  ServerTime: 'Время сервера',

  // Titles
  OrganizationsTitle: 'Формирование списка органов ОРМ и органов надзора',

  // Errors
  SUCCESS: 'Успех',
  CONFLICT: 'Конфликт',
  ERROR: 'Ошибка',
  error: 'Ошибка',
  message: 'Описание ошибки',
  empty_error: 'Неизвестная ошибка',
  ftp_server_not_found: 'FTP сервер не найден.',
  success_message_add: 'Запись успешно создана!',
  success_message_delete: 'Запись успешно удалена!',
  success_message_edit: 'Запись успешно обновлена!',
  success_message_export: 'Экспорт успешно создан!',
  wrong_password: 'Не удалось сменить пароль, проверьте правильно ли вы ввели старый и новые пароли.',
  password_not_valid: 'Новые пароли не совпадают, будьте внимательны и попробуйте еще раз.',
  password_change_success: 'Пароль успешно сменен, сейчас вас выбросит из системы, авторизуйтесь с новым паролем.',
  username_violation_of_uniqueness: 'Идентификатор обработчика пользователя должен быть уникальным',
  folder_violation_of_uniqueness: 'Папка с таким именем уже существует',
  folder_already_exist: 'Папка с таким именем уже существует',
  organization_violation_of_uniqueness: 'Орган ОРМ или Надзора с таким именем уже существует',
  mission_number_violation_of_uniqueness: 'Номер задания должен быть уникальным',

  // Users
  UsersView: 'Запрос 1.4 - Просмотр списка администраторов, обработчиков, надзорщиков',
  UsersAdd: 'Запрос 1.1 - Добавление учетной записи администратора, обработчика, надзорщика',
  UsersEdit: 'Запрос 1.1 - Редактирование учетной записи администратора, обработчика, надзорщика',
  UsersDelete: 'Запрос 1.3 - Удаление учетной записи администратора, обработчика, надзорщика',

  // Organizations
  OrganizationsView: 'Просмотр учетных записей',
  OrganizationsAdd: 'Запрос 1.1а - Добавление органа ОРМ или надзора',
  OrganizationsEdit: 'Запрос 1.1а - Редактирование органа ОРМ или надзора',
  OrganizationsDelete: 'Запрос 1.1a - Удаление органа ОРМ или надзора',

  // Folders
  FoldersView: 'Просмотр папок заданий',
  FoldersAdd: 'Запрос 1.1б - Добавление папки заданий',
  FoldersEdit: 'Запрос 1.1б - Редактирование папки заданий',
  FoldersDelete: 'Запрос 1.1б - Удаление папки заданий',

  // Missions
  MissionsView: 'Запрос 1.6 - Просмотр списка заданий на перехват',
  MissionsAdd: 'Запрос 1.5 - Формирование нового задания на перехват',
  MissionsEdit: 'Запрос 1.5 - Формирование нового задания на перехват',
  MissionsDelete: 'Запрос 1.7 - Удаление задания на перехват',
  MissionsExport: 'Запрос 1.7 - Экспорт заданий на перехват',

  // Sanctions
  SanctionsView: 'Запрос 1.9 - Просмотр списка выданных санкций',
  SanctionsAdd: 'Запрос 1.8 - Выдача санкции на обработку перехваченных сообщений абонентов',
  SanctionsRenew: 'Запрос 1.8 - Продление санкции на обработку перехваченных сообщений абонентов',
  SanctionsEdit: 'Запрос 1.5 - Формирование нового задания на перехват',
  SanctionsDelete: 'Запрос 1.7 - Удаление задания на перехват',

  // Checking state
  CheckingStateView: 'Запрос 1.14/1.14a - Проверка технического состояния и перехвата сообщений абонентов',
  CheckingStateTab1: 'Журнал событий объектов связей',
  CheckingStateTab2: 'Журнал перехвата',
  CheckingStateTab3: 'График перехвата',
  resultQuantity: 'Кол-во результатов заданий',
  missionQuantity: 'Кол-во заданий',

  // Traffic controll
  TrafficControllView: 'Запрос 1.5 - Поиск перенаправляемого трафика',
  TrafficControllAdd: 'Запрос 1.5 - Добавление перенаправляемого трафика',
  TrafficControllDelete: 'Запрос 1.5 - Удаление перенаправляемого трафика',
  Intercept: 'На перехвате',
  NotIntercept: 'Не на перехвате',

  // White lists
  WhiteListsAdd: 'Запрос 1.1в - Добавление недопустимого идентификатора абонента',
  WhiteListsEdit: 'Запрос 1.1в - Редактирование недопустимого идентификатора абонента',
  WhiteListsDelete: 'Запрос 1.1в - Удаление недопустимого идентификатора абонента',

  // Communication objects
  CommunicationObjectsAdd: 'Запрос 1.5a - Добавление объкта связи',
  CommunicationObjectsEdit: 'Запрос 1.5a - Редактирование объкта связи',
  CommunicationObjectsDelete: 'Запрос 1.5a - Удаление объкта связи',

  // Communication objects
  AuditsView: 'Запрос 1.1г - Просмотр системного электронного журнала',
  AuditsExport: 'Запрос 1.1г - Экспорт системного электронного журнала',

  // Processing
  ProcessingView: 'Запрос 1.6 - Просмотр списка заданий на перехват',
  ProcessingExport: 'Запрос 1.6 - Экспорт списка заданий на перехват',

  // Body
  QueryResults: 'Результаты запроса',

  // Alert
  AlertEmpty: 'Вы еще ничего не запрашивали',
  AlertNotFound: 'Ничего не найдено, попробуйте изменить фильтр',
  AlertNothingFound: 'Ничего не найдено',
  AlertSelectRow: 'Выберите запись для редактирования',
  oldPassword: 'Старый пароль',
  newPassword: 'Новый пароль',
  rePassword: 'Повторите новый пароль',

  // Auth
  StatusCode400: 'Неправильный запрос',
  StatusCode401: 'Неправильный логин или пароль',
  StatusCode403: 'Ваш аккаунт заблокирован. Обратитесь к Администратору системы.',
  StatusCode405: 'Метод запрещен',
  StatusCode408: 'Истекло время ожидания ответа',
  StatusCode409: 'Пользователь с такой учетной записью уже авторизован в системе',
  StatusCode500: 'Внутреняя ошибка сервера',
  StatusCode502: 'Ошибка сервера',
  StatusCode503: 'Сервер не доступен',
  StatusCode504: 'Сервер не отвечает',

  // Pagination
  PageSize: 'Кол-во на странице',
  FirstPage: 'Первая',
  Back: 'Назад',
  Forward: 'Вперед',
  LastPage: 'Последняя',
  From: 'из',
  TotalElements: 'Всего записей',

  // Mission states
  MissionStatesnew: 'Новое',
  MissionStatespreparing: 'В ожидании',
  MissionStatessent_to_sorm: 'Отправлено в СОРМ',
  MissionStateswork: 'В работе',
  MissionStatescomplete: 'Завершено',
  MissionStatesdelete: 'Удалено',
  MissionStateserror: 'Ошибка',

  // identificationKind
  IP_ADDRESS: 'IP Адрес',
  ACCOUNT: 'Аккаунт',

  // informationFeature
  TotalControl: 'Полный контроль',
  StatisticsControl: 'Статистический контроль',

  ExportFiles: 'Файлы экспорта',

  // Title header cols
  id: 'ID',
  name: 'Наименование',
  kind: 'Тип органа',
  userId: 'Идентификатор обработчика',
  user: 'Идентификатор обработчика',
  password: 'Пароль',
  roles: 'Права доступа',
  exportAccess: 'Право экспорта',
  stateAccess: 'Статус доступа',
  StatusBlocked: 'Заблокирован',
  StatusNotBlock: 'Не заблокирован',
  StatusDeleted: 'Удален',
  StatusNotDeleted: 'Не удален',
  organization: 'Орган ОРМ и надзора',
  folder: 'Папка заданий',
  folders: 'Папки заданий',
  parentFolder: 'Родительская папка',
  accountStartedAt: 'Начало действия учетной записи',
  accountEndedAt: 'Окончание действия учетной записи',
  sanctionStartedAt: 'Начало действия санкции',
  sanctionEndedAt: 'Окончание действия санкции',
  passwordStartedAt: 'Начало действия пароля',
  passwordEndedAt: 'Окончание действия пароля',
  networkConfig: 'IP адрес',
  deletedSign: 'Признак удаления',
  dataType: 'Тип данных',
  note: 'Примечание',
  processedSign: 'Статус обработки',
  processedUser: 'Обработчик',
  Processed: 'Обработано',
  NotProcessed: 'Не обработано',
  comment: 'Примечание',
  commentUser: 'Комментатор',
  timestamp: 'Дата и время',
  sourceIp: 'IP источника',
  sourcePort: 'Порт источника',
  destinationIp: 'IP назначения',
  destinationPort: 'Порт назначения',
  protocolType: 'Тип протокола',
  radiusServer: 'radiusServer',
  action: 'Метод',
  rqVersion: 'rqVersion',
  uri: 'Адрес',
  host: 'Хост',
  cookie: 'Куки',
  setCookie: 'Установленные куки',
  statusCode: 'Статус запроса',
  respDescription: 'Описание запроса',
  contentType: 'Тип контента',
  state: 'Состояние',
  trafficKinds: 'Виды трафика',
  informationFeature: 'Признак собираемых сведений',
  communicationObject: 'Объекты связи',
  communicationObjects: 'Объекты связи',
  targetId: 'Идентификатор абонента',
  targetAlias: 'Псевдоним абонента',
  number: 'Номер задания',
  referer: 'referer',
  htmlFile: 'HTML',
  sslVersionId: 'SSL',
  rawHtmlBody: 'HTML',
  rawHtmlBodyByte: 'HTML в байтах',
  date: 'Дата создания',
  createdAt: 'Дата создания',
  updatedAt: 'Дата обновления',
  startedAt: 'Дата начала',
  endedAt: 'Дата окончания',
  InterceptStartedAt: 'Дата начала перехвата',
  InterceptEndedAt: 'Дата окончания перехвата',
  cipherSuiteId: 'cipherSuiteId',
  identificationKind: 'Тип идентификатора абонента',
  cryptoKey: 'Ключ расшифрования',
  routerIp: 'IP адрес маршрутизатора',
  targetIp: 'IP адрес цели',
  isStarted: 'В работе',
  startScenario: 'Сценарий начала перехвата',
  stopScenario: 'Сценарий остановки перехвата',
  mission: 'Номер задания',
  requestMethod: 'Метод запроса',
  requestUrl: 'Адрес запроса',
  requestParameters: 'Параметры запроса',
  requestTime: 'Дата и время запроса',
  requestStatus: 'Статус запроса',
  username: 'Учетная запись',
  ip: 'IP адрес',
  LongText: 'Длина строки не должна быть более 240 символов',
  requestKey: 'Параметр',
  requestValue: 'Значение',
  RequestParameters: 'Параметры запроса',
  RequestParametrsEmpty: 'Нет параметров запроса',
  ToDesctop: 'На рабочий стол',
  ToFTP: 'На FTP',
  archiveName: 'Наименование файла экспорта',
  stateIntercept: 'Наименование внешней информационной системы',
  ftpId: 'Наименование файла экспорта',
  property: 'Свойство',
  value: 'Значение',
  Properties: 'Свойства',
  ViewHtml: 'Просмотр HTML',

  Forbidden: 'Запрещено',
  Allowed: 'Разрешено',
  ENABLE: 'Не заблокирован',
  DISABLE: 'Заблокирован',
  processedSigned: 'Обработанно',
  notProcessedSigned: 'Не обработанно',
  port: 'Порт'
}
