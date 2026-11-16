#!/bin/bash
# Создайте поток ORDERS, принимающий каждое событие заказа, которое приложение
# публикует. Поток хранит все сообщения в темах orders.>
# и сохраняет их между запусками.
nats stream add ORDERS \
  --subjects "orders.>" \
  --storage file \
  --defaults
