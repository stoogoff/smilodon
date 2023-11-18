
# Smilodon

Nuxt/Vue based MindMap.

Entity:

id: string
title: string
description: string
properties: object
  [key]: Property
category: string (Category id)
tags: array of string

Property

id: string
value: string / number / boolean
type: string of [
  Text (string),
  Number (number),
  Date (ISO8601 string),
  Time (ISO8601 string),
  DateTime (ISO8601 string),
  True/False (boolean)
]

Category

id: string
title: string
parent: string (id of another category)

