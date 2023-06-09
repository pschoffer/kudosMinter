#!/bin/sh
while true; do
  npx ts-node index.ts $@ &
  PID=$!
  inotifywait -e modify -r commands index.ts
  kill $PID
done