#!/bin/bash
# Добавьте долговечный pull-потребитель `worker` к потоку EVENTS.
# --pull: читатель запрашивает сообщения по мере необходимости
# --ack explicit: каждое доставленное сообщение нужно подтвердить отдельно
# --defaults: принять значения по умолчанию для остальных параметров
nats consumer add EVENTS worker --pull --ack explicit --defaults
