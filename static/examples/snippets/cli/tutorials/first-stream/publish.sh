#!/bin/bash

# Опубликуйте три сообщения. Все темы начинаются с events., поэтому поток EVENTS
# принимает и сохраняет каждое сообщение. Для каждой публикации CLI выводит строку
# "Stored in Stream" с присвоенным порядковым номером в подтверждение сохранения.
nats pub events.page_loaded   '{"page":"/home"}'    --jetstream
nats pub events.input_changed '{"field":"email"}'   --jetstream
nats pub events.page_loaded   '{"page":"/pricing"}' --jetstream
