# Снимок потока {#snapshot-stream}

Создание снимка потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamSnapshotRequest from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_snapshot_request.json';
import streamSnapshotResponse from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_snapshot_response.json';

## Тема {#subject}

`$JS.API.STREAM.SNAPSHOT.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamSnapshotRequest} />

## Ответ {#response}

<JSONSchema schema={streamSnapshotResponse} />
