#!/bin/bash
# Запишите значение: ключ sue.color, значение blue.

nats kv put profiles sue.color blue

# Будут выведены записанное значение и его ревизия:
#
#   blue

# Получите значение по ключу.

nats kv get profiles sue.color

# Будет выведена полная запись, включая значение:
#
#   profiles > sue.color revision: 1 created @ ...
#
#   blue
