---
id: kubernetes
title: "Kubernetes"
sidebar_position: 3
description: "Развёртывание кластера ORDERS как StatefulSet через чарт NATS Helm и объявление потоков и потребителей через CRD"
---

# Kubernetes {#kubernetes}

На [предыдущей странице](/learn/deployment/sizing-and-resources) мы рассчитали ресурсы ORDERS: файловый поток R3 в томе 10 Gi, а `order-svc` — примерно в 128 Mi памяти. Теперь развернём кластер в Kubernetes.

Три узла `east` из главы топологий (`n1-east`, `n2-east`, `n3-east`) становятся тремя подами. Kubernetes именует их по порядковым номерам: **`nats-0`, `nats-1`, `nats-2`**. Это те же узлы с тем же потоком R3 `ORDERS`. Дальше используются имена подов, поскольку плавный вывод, бюджет нарушений и последовательные обновления опираются на их номера.

Здесь два новых понятия: чарт NATS Helm, развёртывающий StatefulSet, и контроллер NACK, позволяющий объявить `ORDERS` и его потребителей ресурсами Kubernetes вместо команд CLI.

## Чарт NATS Helm развёртывает StatefulSet {#the-nats-helm-chart-deploys-a-statefulset}

Кластер NATS хранит состояние. Каждый узел держит свою часть реплицированного потока на собственном диске, а идентичность должна переживать перезапуск: `nats-1` обязан вернуться как `nats-1` со своим томом. Для этого нужен **StatefulSet** — нагрузка Kubernetes со стабильными именами подов, сетевыми идентификаторами и томами.

**Чарт NATS Helm** устанавливает StatefulSet за вас. Файл `values.yaml` описывает кластер, а Helm создаёт StatefulSet, headless-сервис, ConfigMap и проверки. Минимальный файл для трёх узлов ORDERS:

```yaml
# values.yaml — the three-node ORDERS cluster
config:
  cluster:
    enabled: true
    replicas: 3          # nats-0, nats-1, nats-2
  jetstream:
    enabled: true
    fileStore:
      pvc:
        size: 10Gi       # the sizing baseline from the previous page
```

Установите релиз под именем `nats`: именно оно задаёт имена подов `nats-N`.

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm install nats nats/nats -f values.yaml
```

Отметим две детали. Чарт уже задаёт StatefulSet параметр `podManagementPolicy: Parallel`, добавлять его в `values.yaml` не нужно. Все три пода запускаются вместе. Последовательный запуск по умолчанию ждал бы готовности каждого перед следующим, что может заблокировать кластер NATS: одиночный узел ещё не видит соседей. Parallel позволяет им найти друг друга и сформировать кластер.

Вторая деталь — **headless-сервис**. Он даёт каждому поду стабильное DNS-имя вроде `nats-0.nats-headless.default.svc.cluster.local`, используемое для маршрутов между узлами. Клиенты подключаются к обычному ClusterIP-сервису `nats`, который тоже создаёт чарт. Именно из его набора адресов readiness исключает неготовые поды.

У чарта много других параметров с разумными значениями по умолчанию. Все настройки сервера описаны в [Справочнике → Конфигурация](/reference/config); здесь нужны лишь параметры этого развёртывания.

## Три проверки на порту мониторинга {#the-three-probes-on-the-monitor-port}

Kubernetes управляет жизненным циклом пода по проверкам. У JetStream есть три состояния, которые важно различать. Чарт направляет все три проверки на порт 8222 и `/healthz`:

```yaml
# rendered into the StatefulSet by the chart — shown for reference
startupProbe:
  httpGet: { path: /healthz, port: 8222 }
  failureThreshold: 90        # ~900s window for the node to boot + sync
readinessProbe:
  httpGet: { path: "/healthz?js-server-only=true", port: 8222 }
livenessProbe:
  httpGet: { path: "/healthz?js-enabled-only=true", port: 8222 }
```

**Startup probe** защищает время запуска. Вернувшийся узел может несколько минут догонять реплики потоков; большой порог ошибок не даёт Kubernetes убить его за нормальную работу запуска. **Readiness probe** определяет готовность обслуживать клиентов и исключает неготовый под из сервиса. **Liveness probe** проверяет лишь включение JetStream и служит последней мерой перезапуска зависшего процесса.

Значение параметров `/healthz` и выбор уведомлений для оповещения рассмотрены в [Мониторинг → Состояние JetStream](/learn/monitoring/jetstream-health). Здесь проверки передают состояние подов StatefulSet.

## Объявите потоки через CRD контроллера NACK {#declare-streams-as-crds-with-the-nack-controller}

Можно открыть оболочку в `nats-box` и вручную выполнить `nats
stream add ORDERS`. Но это императивный подход: поток существует благодаря выполненной команде, и после удаления ничто его не вернёт. Для декларативной модели Kubernetes у NATS есть контроллер.

**Контроллер NACK** работает в Kubernetes и согласует ресурсы **CRD** (Custom Resource Definitions) с кластером NATS. Вы описываете нужный `ORDERS` ресурсом `Stream`, применяете его через `kubectl`, а контроллер вызывает API JetStream для приведения кластера к описанию. Контроллер Kubernetes и оператор безопасности `ACME` — разные понятия; последний рассмотрен в [Безопасности](/learn/security).

Тот же файловый поток R3 `ORDERS`, теперь в декларативном виде CRD:

```yaml
# orders-stream.yaml — the ORDERS stream as a declarative resource
apiVersion: jetstream.nats.io/v1beta2
kind: Stream
metadata:
  name: orders
spec:
  name: ORDERS
  subjects: ["orders.>"]
  storage: file
  replicas: 3
```

И два его потребителя: `shipping`, запрашивающий сообщения, и `analytics`, фильтрующий `orders.shipped`.

```yaml
# orders-consumers.yaml — consumers as declarative resources
apiVersion: jetstream.nats.io/v1beta2
kind: Consumer
metadata:
  name: shipping
spec:
  streamName: ORDERS
  durableName: shipping
---
apiVersion: jetstream.nats.io/v1beta2
kind: Consumer
metadata:
  name: analytics
spec:
  streamName: ORDERS
  durableName: analytics
  filterSubject: orders.shipped
```

Примените ресурсы; остальное сделает контроллер:

```bash
kubectl apply -f orders-stream.yaml -f orders-consumers.yaml
```

Контроллер наблюдает CRD, вызывает API JetStream, создаёт поток R3 на `nats-0..2` и записывает результат в `.status`. Теперь желаемое состояние потока находится в системе контроля версий, а не в истории терминала.

<div class="nats-flow" data-scenario="crdReconcileAnimated" data-width="600" data-height="350"></div>

Согласование работает циклически. Если удалить поток вручную, контроллер обнаружит расхождение и пересоздаст его по CRD. Объявленное состояние служит источником истины.

У `Stream` есть много других полей: `maxBytes`, `maxAge`, `placement`, `mirror`, `sources` и прочая конфигурация потока. Полный список приведён в [Справочнике → Конфигурация](/reference/config); здесь заданы нужные ORDERS поля.

## Типичные ошибки {#pitfalls}

При первом запуске NATS в Kubernetes встречаются несколько ловушек, относящихся к StatefulSet и CRD.

**Под в Pending обычно ждёт том.** Под StatefulSet не запустится до привязки постоянного тома. Без класса хранения по умолчанию запрос может ждать бесконечно: `nats-0` остаётся в `Pending`, а с ним и кластер. Чарт создаёт отдельный запрос тома каждому поду через `volumeClaimTemplates`. Проверяйте наличие класса хранения вместо удаления и повторного запуска пода.

**Правка ConfigMap сама не перечитывает конфигурацию сервера.** Файл меняется, но работающий `nats-server` использует старые настройки до SIGHUP. Чарт включает **вспомогательный контейнер перечитывания конфигурации** `nats-server-config-reloader` по умолчанию. Без него изменения применятся лишь при перезапуске. Подробности на странице [Управление конфигурацией](/learn/deployment/config-management).

**Догоняющая репликация учитывается startup, а не readiness.** Readiness обращается к `/healthz?js-server-only=true`: проверяется лишь работа сервера и JetStream, без потоков, потребителей и назначений метаданных. Поэтому под, догоняющий реплики R3 после перезапуска, остаётся готовым обслуживать клиентов. Обычный `/healthz` из startup строже: проверяет слой метаданных и все потоки и потребителей. Поэтому `failureThreshold` равен 90, давая время синхронизации. Для увеличения окна переопределите поля проверки через `merge`/`patch` контейнера чарта: отдельного параметра `failureThreshold` в values нет.

**Не смешивайте CLI и CRD для одного потока.** Поведение NACK зависит от режима. По умолчанию он пересоздаёт удалённый поток при повторной сверке примерно каждые 30 секунд, но *не* отменяет ручной `nats stream edit`: изменение остаётся до следующей правки CRD. Режим `--control-loop` также исправляет расхождения конфигурации примерно раз в минуту. В любом случае выберите одного владельца потока: CRD или CLI.

Проверьте, что контроллер действительно создал объявленный поток R3. Откройте оболочку `nats-box` и прочитайте его состояние:

<div class="nats-example" data-type="learn-deployment-kubernetes-streamLs" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Важна строка `Replicas: 3`. Если указано `1`, в CRD отсутствует `replicas: 3` либо согласование ещё не завершено. Сначала проверьте `.status` ресурса.

## Что уже готово {#where-you-are}

Кластер ORDERS работает в Kubernetes:

- Три пода `nats-0`, `nats-1`, `nats-2` управляются StatefulSet и имеют стабильные имена, DNS и тома. Это прежние `n1-east`/`n2-east`/`n3-east`.
- Чарт NATS Helm создаёт StatefulSet, headless-сервис, ConfigMap и три проверки `/healthz`.
- Поток `ORDERS` и потребители `shipping`, `analytics` объявлены через CRD и согласуются NACK; желаемое состояние хранится в контроле версий.

## Что дальше {#whats-next}

Кластер запущен, но конфигурация пока находится в ConfigMap, который вы ещё не умеете менять без перезапуска. Следующая страница разделяет её на включаемые файлы и применяет ограничения, пути TLS и учётные записи через SIGHUP без простоя.

Перейдите к [управлению конфигурацией](/learn/deployment/config-management).

## См. также {#see-also}

- [Справочник → Конфигурация](/reference/config) — настройки сервера и полный набор полей `Stream` CRD.
- [Топологии → Ваш первый кластер](/learn/topologies/your-first-cluster) — узлы `n1-east`/`n2-east`/`n3-east`, развёрнутые этими подами.
- [Мониторинг → Состояние JetStream](/learn/monitoring/jetstream-health) — смысл проверок `/healthz` и выбор оповещений.
