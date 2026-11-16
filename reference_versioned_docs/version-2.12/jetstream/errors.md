# Ошибки JetStream {#jetstream-errors}

Полный список кодов ошибок JetStream и их описаний, сгруппированных по категориям.


## Ошибки аккаунтов {#account-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10002      | `JSAccountResourcesExceededErr`              | 400         | Превышены ограничения ресурсов учётной записи                                                         |
| 10035      | `JSNoAccountErr`              | 503         | Учётная запись не найдена                                                         |
| 10039      | `JSNotEnabledForAccountErr`              | 503         | JetStream не включён для учётной записи                                                         |


## Общие ошибки {#general-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10003      | `JSBadRequestErr`              | 400         | Некорректный запрос                                                         |
| 10015      | `JSSnapshotDeliverSubjectInvalidErr`              | 400         | Недопустимая тема доставки                                                         |
| 10023      | `JSInsufficientResourcesErr`              | 503         | Недостаточно ресурсов                                                         |
| 10025      | `JSInvalidJSONErr`              | 400         | недопустимый JSON: `{err}`                                                         |
| 10028      | `JSMemoryResourcesExceededErr`              | 500         | Недостаточно доступной памяти                                                         |
| 10038      | `JSNotEmptyRequestErr`              | 400         | Ожидается пустое тело запроса                                                         |
| 10041      | `JSRaftGeneralErrF`              | 500         | `{err}`                                                         |
| 10042      | `JSRestoreSubscribeFailedErrF`              | 500         | JetStream не удалось подписаться для восстановления снимка `{subject}`: `{err}`                                                         |
| 10043      | `JSSequenceNotFoundErrF`              | 400         | порядковый номер `{seq}` не найден                                                         |
| 10047      | `JSStorageResourcesExceededErr`              | 500         | Недостаточно ресурсов хранилища                                                         |
| 10072      | `JSTempStorageFailedErr`              | 500         | JetStream не удалось открыть временное хранилище для восстановления                                                         |
| 10073      | `JSTemplateNameNotMatchSubjectErr`              | 400         | Имя шаблона в теме не совпадает с запросом                                                         |
| 10075      | `JSPeerRemapErr`              | 503         | Не удалось переназначить участника                                                         |
| 10076      | `JSNotEnabledErr`              | 503         | JetStream не включён                                                         |
| 10120      | `JSNoLimitsErr`              | 400         | Нет стандартного или подходящего многоуровневого лимита JetStream                                                         |
| 10133      | `JSReplicasCountCannotBeNegative`              | 400         | Число реплик не может быть отрицательным                                                         |
| 10157      | `JSPedanticErrF`              | 400         | строгий режим: `{err}`                                                         |
| 10185      | `JSRequiredApiLevelErr`              | 412         | Требуется минимальный уровень API JetStream                                                         |


## Ошибки кластеризации {#clustering-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10004      | `JSClusterIncompleteErr`              | 503         | Неполные результаты                                                         |
| 10005      | `JSClusterNoPeersErrF`              | 400         | `{err}`                                                         |
| 10006      | `JSClusterNotActiveErr`              | 500         | JetStream работает не в кластерном режиме                                                         |
| 10007      | `JSClusterNotAssignedErr`              | 500         | Кластер JetStream не назначен этому серверу                                                         |
| 10008      | `JSClusterNotAvailErr`              | 503         | Система JetStream временно недоступна                                                         |
| 10009      | `JSClusterNotLeaderErr`              | 500         | Кластер JetStream не может обработать запрос                                                         |
| 10010      | `JSClusterRequiredErr`              | 503         | Требуется поддержка кластеризации JetStream                                                         |
| 10011      | `JSClusterTagsErr`              | 400         | Размещение по тегам не поддерживается для операции                                                         |
| 10036      | `JSClusterUnSupportFeatureErr`              | 503         | В кластерном режиме пока не поддерживается                                                         |
| 10040      | `JSClusterPeerNotMemberErr`              | 400         | Участник не входит в группу                                                         |
| 10044      | `JSClusterServerNotMemberErr`              | 400         | Сервер не входит в кластер                                                         |
| 10202      | `JSClusterServerMemberChangeInflightErr`              | 400         | Состав кластера сейчас изменяется                                                         |


## Ошибки потребителей {#consumer-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10012      | `JSConsumerCreateErrF`              | 500         | `{err}`                                                         |
| 10013      | `JSConsumerNameExistErr`              | 400         | Имя потребителя уже используется                                                         |
| 10014      | `JSConsumerNotFoundErr`              | 404         | Потребитель не найден                                                         |
| 10016      | `JSConsumerDurableNameNotInSubjectErr`              | 400         | Ожидается долговременный потребитель, но его имя не задано в теме                                                         |
| 10017      | `JSConsumerDurableNameNotMatchSubjectErr`              | 400         | Имя потребителя в теме не совпадает с именем долговременного потребителя в запросе                                                         |
| 10018      | `JSConsumerDurableNameNotSetErr`              | 400         | Ожидается долговременный потребитель, но его имя не задано                                                         |
| 10019      | `JSConsumerEphemeralWithDurableInSubjectErr`              | 400         | Ожидается временный потребитель, но тема содержит имя долговременного                                                         |
| 10020      | `JSConsumerEphemeralWithDurableNameErr`              | 400         | Ожидается временный потребитель, но запрос содержит имя долговременного                                                         |
| 10026      | `JSMaximumConsumersLimitErr`              | 400         | Достигнут лимит числа потребителей                                                         |
| 10029      | `JSMirrorConsumerSetupFailedErrF`              | 500         | `{err}`                                                         |
| 10045      | `JSSourceConsumerSetupFailedErrF`              | 500         | `{err}`                                                         |
| 10078      | `JSConsumerConfigRequiredErr`              | 400         | Требуется конфигурация потребителя                                                         |
| 10079      | `JSConsumerDeliverToWildcardsErr`              | 400         | Тема доставки потребителя содержит подстановочные символы                                                         |
| 10080      | `JSConsumerPushMaxWaitingErr`              | 400         | Push-потребителю нельзя задавать max waiting                                                         |
| 10081      | `JSConsumerDeliverCycleErr`              | 400         | Тема доставки потребителя образует цикл                                                         |
| 10082      | `JSConsumerMaxPendingAckPolicyRequiredErr`              | 400         | Для ограничения ожидающих подтверждений потребителю нужна политика подтверждений                                                         |
| 10083      | `JSConsumerSmallHeartbeatErr`              | 400         | Интервал heartbeat бездействия потребителя должен быть не меньше 100 мс                                                         |
| 10084      | `JSConsumerPullRequiresAckErr`              | 400         | Pull-потребителю потока workqueue требуется явная политика подтверждений                                                         |
| 10085      | `JSConsumerPullNotDurableErr`              | 400         | Pull-потребителю требуется имя долговременного потребителя                                                         |
| 10086      | `JSConsumerPullWithRateLimitErr`              | 400         | Pull-потребителю нельзя задавать ограничение скорости                                                         |
| 10087      | `JSConsumerMaxWaitingNegativeErr`              | 400         | Максимальное число ожидающих запросов потребителя должно быть положительным                                                         |
| 10088      | `JSConsumerHBRequiresPushErr`              | 400         | Heartbeat бездействия требует push-потребителя                                                         |
| 10089      | `JSConsumerFCRequiresPushErr`              | 400         | Управление потоком требует push-потребителя                                                         |
| 10090      | `JSConsumerDirectRequiresPushErr`              | 400         | Прямой доступ требует push-потребителя                                                         |
| 10091      | `JSConsumerDirectRequiresEphemeralErr`              | 400         | Прямой доступ требует временного потребителя                                                         |
| 10092      | `JSConsumerOnMappedErr`              | 400         | Прямой доступ потребителя применяется к перенаправленному потребителю                                                         |
| 10093      | `JSConsumerFilterNotSubsetErr`              | 400         | Фильтр темы потребителя не является допустимым подмножеством тем интереса                                                         |
| 10094      | `JSConsumerInvalidPolicyErrF`              | 400         | `{err}`                                                         |
| 10095      | `JSConsumerInvalidSamplingErrF`              | 400         | не удалось разобрать конфигурацию выборки потребителя: `{err}`                                                         |
| 10098      | `JSConsumerWQRequiresExplicitAckErr`              | 400         | Поток workqueue требует явных подтверждений                                                         |
| 10099      | `JSConsumerWQMultipleUnfilteredErr`              | 400         | Несколько потребителей без фильтра недопустимы в потоке workqueue                                                         |
| 10100      | `JSConsumerWQConsumerNotUniqueErr`              | 400         | Фильтр потребителя не уникален в потоке workqueue                                                         |
| 10101      | `JSConsumerWQConsumerNotDeliverAllErr`              | 400         | Для потока workqueue потребителю нужна доставка всех сообщений                                                         |
| 10102      | `JSConsumerNameTooLongErrF`              | 400         | слишком длинное имя потребителя, максимум: `{max}`                                                         |
| 10103      | `JSConsumerBadDurableNameErr`              | 400         | Имя долговременного потребителя не может содержать '.', '*', '>'                                                         |
| 10104      | `JSConsumerStoreFailedErrF`              | 500         | ошибка создания хранилища потребителя: `{err}`                                                         |
| 10105      | `JSConsumerExistingActiveErr`              | 400         | Потребитель уже существует и активен                                                         |
| 10106      | `JSConsumerReplacementWithDifferentNameErr`              | 400         | Конфигурация заменяемого долговременного потребителя отличается                                                         |
| 10107      | `JSConsumerDescriptionTooLongErrF`              | 400         | слишком длинное описание потребителя, максимум: `{max}`                                                         |
| 10108      | `JSConsumerWithFlowControlNeedsHeartbeats`              | 400         | Потребителю с управлением потоком также нужен heartbeat                                                         |
| 10112      | `JSConsumerInvalidDeliverSubject`              | 400         | Недопустимая тема доставки push-потребителя                                                         |
| 10114      | `JSConsumerMaxRequestBatchNegativeErr`              | 400         | Максимальный пакет запроса потребителя должен быть больше 0                                                         |
| 10115      | `JSConsumerMaxRequestExpiresTooSmall`              | 400         | Максимальное время запроса потребителя должно быть не меньше 1 мс                                                         |
| 10116      | `JSConsumerMaxDeliverBackoffErr`              | 400         | max deliver должен превышать длину списка интервалов backoff                                                         |
| 10119      | `JSConsumerOfflineErr`              | 500         | Потребитель недоступен                                                         |
| 10121      | `JSConsumerMaxPendingAckExcessErrF`              | 400         | лимит неподтверждённых сообщений потребителя превышает системный предел `{limit}`                                                         |
| 10125      | `JSConsumerMaxRequestBatchExceededF`              | 400         | максимальный размер запрашиваемого пакета потребителя превышает лимит сервера `{limit}`                                                         |
| 10126      | `JSConsumerReplicasExceedsStream`              | 400         | Число реплик потребителя превышает число реплик родительского потока                                                         |
| 10127      | `JSConsumerNameContainsPathSeparatorsErr`              | 400         | Имя потребителя не должно содержать разделителей пути                                                         |
| 10131      | `JSConsumerCreateFilterSubjectMismatchErr`              | 400         | Запрос создания потребителя не соответствует фильтру темы из темы создания                                                         |
| 10132      | `JSConsumerCreateDurableAndNameMismatch`              | 400         | Если заданы Durable и Name потребителя, они должны совпадать                                                         |
| 10134      | `JSConsumerReplicasShouldMatchStream`              | 400         | Число реплик потребителя должно совпадать с числом реплик потока с хранением по интересу                                                         |
| 10135      | `JSConsumerMetadataLengthErrF`              | 400         | метаданные потребителя превышают максимальный размер `{limit}`                                                         |
| 10136      | `JSConsumerDuplicateFilterSubjects`              | 400         | Потребителю нельзя одновременно задавать FilterSubject и FilterSubjects                                                         |
| 10137      | `JSConsumerMultipleFiltersNotAllowed`              | 400         | Потребитель с несколькими фильтрами тем не может использовать API на основе темы                                                         |
| 10138      | `JSConsumerOverlappingSubjectFilters`              | 400         | Фильтры тем потребителя не должны пересекаться                                                         |
| 10139      | `JSConsumerEmptyFilter`              | 400         | Фильтр потребителя в FilterSubjects не может быть пустым                                                         |
| 10148      | `JSConsumerAlreadyExists`              | 400         | Потребитель уже существует                                                         |
| 10149      | `JSConsumerDoesNotExist`              | 400         | Потребитель не существует                                                         |
| 10153      | `JSConsumerInactiveThresholdExcess`              | 400         | порог неактивности потребителя превышает системный лимит `{limit}`                                                         |
| 10159      | `JSConsumerPriorityPolicyWithoutGroup`              | 400         | Для задания PriorityPolicy требуется хотя бы одна PriorityGroup                                                         |
| 10160      | `JSConsumerInvalidPriorityGroupErr`              | 400         | Указанная приоритетная группа не существует у потребителя                                                         |
| 10161      | `JSConsumerEmptyGroupName`              | 400         | Имя группы не может быть пустой строкой                                                         |
| 10162      | `JSConsumerInvalidGroupNameErr`              | 400         | Имя приоритетной группы должно соответствовать A-Z, a-z, 0-9, -_/=)+ и быть не длиннее 16 символов                                                         |
| 10178      | `JSConsumerPushWithPriorityGroupErr`              | 400         | Приоритетные группы нельзя использовать с push-потребителями                                                         |
| 10181      | `JSConsumerAckPolicyInvalidErr`              | 400         | Недопустимая политика подтверждений потребителя                                                         |
| 10182      | `JSConsumerReplayPolicyInvalidErr`              | 400         | Недопустимая политика воспроизведения потребителя                                                         |
| 10183      | `JSConsumerAckWaitNegativeErr`              | 400         | Время ожидания подтверждения потребителя должно быть положительным                                                         |
| 10184      | `JSConsumerBackOffNegativeErr`              | 400         | Интервал повторных попыток потребителя должен быть положительным                                                         |
| 10195      | `JSConsumerOfflineReasonErrF`              | 500         | потребитель недоступен: `{err}`                                                         |
| 10196      | `JSConsumerPriorityGroupWithPolicyNone`              | 400         | При политике none у потребителя не может быть приоритетных групп                                                         |
| 10197      | `JSConsumerPinnedTTLWithoutPriorityPolicyNone`              | 400         | PinnedTTL нельзя задавать при PriorityPolicy, равном none                                                         |


## Ошибки потоков {#stream-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10021      | `JSStreamExternalApiOverlapErrF`              | 400         | внешний префикс API потока `{prefix}` не должен пересекаться с `{subject}`                                                         |
| 10022      | `JSStreamExternalDelPrefixOverlapsErrF`              | 400         | внешний префикс доставки потока `{prefix}` пересекается с субъектом потока `{subject}`                                                         |
| 10024      | `JSStreamInvalidExternalDeliverySubjErrF`              | 400         | внешний префикс доставки потока `{prefix}` не должен содержать подстановки                                                         |
| 10027      | `JSMaximumStreamsLimitErr`              | 400         | Достигнуто максимальное число потоков                                                         |
| 10048      | `JSStreamAssignmentErrF`              | 500         | `{err}`                                                         |
| 10049      | `JSStreamCreateErrF`              | 500         | `{err}`                                                         |
| 10050      | `JSStreamDeleteErrF`              | 500         | `{err}`                                                         |
| 10051      | `JSStreamGeneralErrorF`              | 500         | `{err}`                                                         |
| 10052      | `JSStreamInvalidConfigF`              | 500         | `{err}`                                                         |
| 10053      | `JSStreamLimitsErrF`              | 500         | `{err}`                                                         |
| 10054      | `JSStreamMessageExceedsMaximumErr`              | 400         | Размер сообщения превышает допустимый максимум                                                         |
| 10056      | `JSStreamMismatchErr`              | 400         | Имя потока в теме не совпадает с запросом                                                         |
| 10057      | `JSStreamMsgDeleteFailedF`              | 500         | `{err}`                                                         |
| 10058      | `JSStreamNameExistErr`              | 400         | Имя потока уже используется с другой конфигурацией                                                         |
| 10059      | `JSStreamNotFoundErr`              | 404         | Поток не найден                                                         |
| 10060      | `JSStreamNotMatchErr`              | 400         | Ожидаемый поток не совпадает                                                         |
| 10061      | `JSStreamReplicasNotUpdatableErr`              | 400         | Конфигурацию реплик нельзя обновить                                                         |
| 10062      | `JSStreamRestoreErrF`              | 500         | восстановление не удалось: `{err}`                                                         |
| 10063      | `JSStreamSequenceNotMatchErr`              | 503         | Ожидаемый порядковый номер потока не совпадает                                                         |
| 10064      | `JSStreamSnapshotErrF`              | 500         | создание снимка не удалось: `{err}`                                                         |
| 10065      | `JSStreamSubjectOverlapErr`              | 400         | Темы пересекаются с существующим потоком                                                         |
| 10066      | `JSStreamTemplateCreateErrF`              | 500         | `{err}`                                                         |
| 10067      | `JSStreamTemplateDeleteErrF`              | 500         | `{err}`                                                         |
| 10068      | `JSStreamTemplateNotFoundErr`              | 404         | Шаблон не найден                                                         |
| 10069      | `JSStreamUpdateErrF`              | 500         | `{err}`                                                         |
| 10070      | `JSStreamWrongLastMsgIDErrF`              | 400         | неверный идентификатор последнего сообщения: `{id}`                                                         |
| 10071      | `JSStreamWrongLastSequenceErrF`              | 400         | неверный последний порядковый номер: `{seq}`                                                         |
| 10074      | `JSStreamReplicasNotSupportedErr`              | 500         | Несколько реплик не поддерживаются вне кластерного режима                                                         |
| 10077      | `JSStreamStoreFailedF`              | 503         | `{err}`                                                         |
| 10096      | `JSStreamInvalidErr`              | 500         | Недопустимый поток                                                         |
| 10097      | `JSStreamHeaderExceedsMaximumErr`              | 400         | Размер заголовков превышает допустимые 64 КБ                                                         |
| 10109      | `JSStreamSealedErr`              | 400         | Недопустимая операция над запечатанным потоком                                                         |
| 10110      | `JSStreamPurgeFailedF`              | 500         | `{err}`                                                         |
| 10111      | `JSStreamRollupFailedF`              | 500         | `{err}`                                                         |
| 10113      | `JSStreamMaxBytesRequired`              | 400         | Учётная запись требует задания максимального размера потока в байтах                                                         |
| 10117      | `JSStreamInfoMaxSubjectsErr`              | 500         | Сведения о темах превысят допустимый максимум                                                         |
| 10118      | `JSStreamOfflineErr`              | 500         | Поток недоступен                                                         |
| 10122      | `JSStreamMaxStreamBytesExceeded`              | 400         | Максимальный размер потока превышает лимит учётной записи на размер одного потока                                                         |
| 10123      | `JSStreamMoveAndScaleErr`              | 400         | Нельзя одновременно перемещать поток и менять число реплик одним обновлением                                                         |
| 10124      | `JSStreamMoveInProgressF`              | 400         | перемещение потока уже выполняется: `{msg}`                                                         |
| 10128      | `JSStreamNameContainsPathSeparatorsErr`              | 400         | Имя потока не должно содержать разделителей пути                                                         |
| 10129      | `JSStreamMoveNotInProgress`              | 400         | Перемещение потока не выполняется                                                         |
| 10130      | `JSStreamNameExistRestoreFailedErr`              | 400         | Имя потока уже используется; восстановление невозможно                                                         |
| 10156      | `JSStreamTransformInvalidDestination`              | 400         | преобразование потока: `{err}`                                                         |
| 10158      | `JSStreamDuplicateMessageConflict`              | 409         | Сообщение с таким идентификатором уже обрабатывается                                                         |
| 10163      | `JSStreamExpectedLastSeqPerSubjectNotReady`              | 503         | Проверка ожидаемого последнего номера темы временно недоступна                                                         |
| 10164      | `JSStreamWrongLastSequenceConstantErr`              | 400         | Неверный последний порядковый номер                                                         |
| 10167      | `JSStreamTooManyRequests`              | 429         | Слишком много запросов                                                         |
| 10180      | `JSStreamMinLastSeqErr`              | 412         | Минимальный последний порядковый номер                                                         |
| 10193      | `JSStreamExpectedLastSeqPerSubjectInvalid`              | 400         | Отсутствует номер для проверки ожидаемого последнего номера темы                                                         |
| 10194      | `JSStreamOfflineReasonErrF`              | 500         | поток недоступен: `{err}`                                                         |


## Ошибки зеркал {#mirror-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10030      | `JSMirrorMaxMessageSizeTooBigErr`              | 400         | Максимальный размер сообщения зеркала должен быть не меньше, чем у источника                                                         |
| 10031      | `JSMirrorWithSourcesErr`              | 400         | Зеркала потоков не могут содержать другие источники                                                         |
| 10032      | `JSMirrorWithStartSeqAndTimeErr`              | 400         | Зеркалу нельзя одновременно задавать начальный номер и начальное время                                                         |
| 10033      | `JSMirrorWithSubjectFiltersErr`              | 400         | Зеркала потоков не могут содержать фильтры тем                                                         |
| 10034      | `JSMirrorWithSubjectsErr`              | 400         | Зеркала потоков не могут содержать темы                                                         |
| 10055      | `JSStreamMirrorNotUpdatableErr`              | 400         | Конфигурацию зеркала потока нельзя обновить                                                         |
| 10142      | `JSMirrorInvalidStreamName`              | 400         | Недопустимое имя зеркалируемого потока                                                         |
| 10143      | `JSMirrorWithFirstSeqErr`              | 400         | Зеркалу нельзя задавать первый порядковый номер                                                         |
| 10150      | `JSMirrorMultipleFiltersNotAllowed`              | 400         | Зеркало с несколькими преобразованиями тем не может дополнительно иметь одиночный фильтр темы                                                         |
| 10151      | `JSMirrorInvalidSubjectFilter`              | 400         | источник преобразования зеркала: `{err}`                                                         |
| 10152      | `JSMirrorOverlappingSubjectFilters`              | 400         | Фильтры тем зеркала не должны пересекаться                                                         |
| 10154      | `JSMirrorInvalidTransformDestination`              | 400         | преобразование зеркала: `{err}`                                                         |
| 10173      | `JSMirrorWithCountersErr`              | 400         | Зеркала потоков не могут одновременно вычислять счётчики                                                         |
| 10186      | `JSMirrorWithMsgSchedulesErr`              | 400         | Зеркала потоков не могут одновременно планировать сообщения                                                         |
| 10198      | `JSMirrorWithAtomicPublishErr`              | 400         | Зеркала потоков не могут использовать атомарную публикацию                                                         |


## Ошибки источников {#source-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10046      | `JSSourceMaxMessageSizeTooBigErr`              | 400         | Максимальный размер сообщения источника должен быть не меньше, чем у целевого потока                                                         |
| 10140      | `JSSourceDuplicateDetected`              | 400         | Обнаружена повторяющаяся конфигурация источника                                                         |
| 10141      | `JSSourceInvalidStreamName`              | 400         | Недопустимое имя потока-источника                                                         |
| 10144      | `JSSourceMultipleFiltersNotAllowed`              | 400         | Источник с несколькими преобразованиями тем не может дополнительно иметь одиночный фильтр темы                                                         |
| 10145      | `JSSourceInvalidSubjectFilter`              | 400         | источник преобразования источника: `{err}`                                                         |
| 10146      | `JSSourceInvalidTransformDestination`              | 400         | преобразование источника: `{err}`                                                         |
| 10147      | `JSSourceOverlappingSubjectFilters`              | 400         | Фильтры источника не должны пересекаться                                                         |
| 10155      | `JSStreamTransformInvalidSource`              | 400         | источник преобразования потока: `{err}`                                                         |
| 10187      | `JSSourceWithMsgSchedulesErr`              | 400         | Источник потока не может одновременно планировать сообщения                                                         |


## Ошибки сообщений {#message-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10037      | `JSNoMessageFoundErr`              | 404         | Сообщение не найдено                                                         |
| 10165      | `JSMessageTTLInvalidErr`              | 400         | Недопустимый TTL отдельного сообщения                                                         |
| 10166      | `JSMessageTTLDisabledErr`              | 400         | TTL отдельных сообщений отключён                                                         |
| 10168      | `JSMessageIncrDisabledErr`              | 400         | Счётчики сообщений отключены                                                         |
| 10169      | `JSMessageIncrMissingErr`              | 400         | Отсутствует приращение счётчика сообщений                                                         |
| 10170      | `JSMessageIncrPayloadErr`              | 400         | Сообщение счётчика содержит полезную нагрузку                                                         |
| 10171      | `JSMessageIncrInvalidErr`              | 400         | Недопустимое приращение счётчика сообщений                                                         |
| 10172      | `JSMessageCounterBrokenErr`              | 400         | Счётчик сообщений повреждён                                                         |
| 10188      | `JSMessageSchedulesDisabledErr`              | 400         | Расписания сообщений отключены                                                         |
| 10189      | `JSMessageSchedulesPatternInvalidErr`              | 400         | Недопустимый шаблон расписания сообщений                                                         |
| 10190      | `JSMessageSchedulesTargetInvalidErr`              | 400         | Недопустимое назначение расписания сообщений                                                         |
| 10191      | `JSMessageSchedulesTTLInvalidErr`              | 400         | Недопустимый TTL отдельного сообщения расписания                                                         |
| 10192      | `JSMessageSchedulesRollupInvalidErr`              | 400         | Недопустимая свёртка сообщения расписания                                                         |
| 10201      | `JSAtomicPublishContainsDuplicateMessageErr`              | 400         | Пакет атомарной публикации содержит повторяющийся идентификатор сообщения                                                         |


## Ошибки атомарной публикации {#atomic-publish-errors}

| Код ошибки | Константа                                     | Статус HTTP | Описание                                                                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 10174      | `JSAtomicPublishDisabledErr`              | 400         | Атомарная публикация отключена                                                         |
| 10175      | `JSAtomicPublishMissingSeqErr`              | 400         | Отсутствует порядковый номер атомарной публикации                                                         |
| 10176      | `JSAtomicPublishIncompleteBatchErr`              | 400         | Пакет атомарной публикации неполон                                                         |
| 10177      | `JSAtomicPublishUnsupportedHeaderBatchErr`              | 400         | использован неподдерживаемый заголовок атомарной публикации: `{header}`                                                         |
| 10179      | `JSAtomicPublishInvalidBatchIDErr`              | 400         | Недопустимый идентификатор пакета атомарной публикации                                                         |
| 10199      | `JSAtomicPublishTooLargeBatchErrF`              | 400         | слишком большой пакет атомарной публикации: `{size}`                                                         |
| 10200      | `JSAtomicPublishInvalidBatchCommitErr`              | 400         | Некорректная фиксация пакета атомарной публикации                                                         |


## Приложение {#appendix}

### Дополнительная информация {#additional-information}

Некоторые ошибки содержат дополнительный контекст:

- **Справочный текст**: некоторые ошибки содержат дополнительную информацию для устранения неполадок
- **Комментарии**: внутренние комментарии об условии возникновения ошибки
- **Устаревшие коды**: некоторые ошибки заменяют более старые коды ошибок
- **Подстановки**: ошибки с суффиксом `F` обычно содержат подстановки (например, `{err}`, `{limit}`), заменяемые фактическими значениями во время выполнения

### Коды состояния HTTP {#http-status-codes}

Ошибки JetStream обычно соответствуют следующим кодам состояния HTTP:

- **400 Bad Request**: ошибка клиента, недопустимый запрос или конфигурация
- **404 Not Found**: ресурс не найден (поток, потребитель, сообщение)
- **409 Conflict**: конфликт операции или состояния
- **412 Precondition Failed**: необходимое предусловие не выполнено
- **429 Too Many Requests**: ограничение частоты запросов
- **500 Internal Server Error**: ошибка на стороне сервера
- **503 Service Unavailable**: временная недоступность или проблемы кластеризации
