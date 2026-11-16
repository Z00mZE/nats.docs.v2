#!/bin/bash

# Создайте поток EVENTS, принимающий сообщения всех тем events.>
# --defaults задаёт начальные значения без интерактивных запросов CLI.
nats stream add EVENTS --subjects "events.>" --defaults
