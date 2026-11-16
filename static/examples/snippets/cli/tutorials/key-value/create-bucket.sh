#!/bin/bash
# Создайте хранилище ключей и значений profiles. В нём будут храниться
# ваши значения.

nats kv add profiles

# Появится подтверждение с именем хранилища и его настройками:
#
#   Information for Key-Value Store Bucket profiles created 2026-06-09 10:13:41
#
#   Configuration:
#
#              Bucket Name: profiles
#             History Kept: 1
#                      ...
#       Backing Store Kind: JetStream
