#!/bin/bash

# Опубликовать сообщение на demo.nats.io
nats pub --server=demo.nats.io hello "Hello NATS!"
