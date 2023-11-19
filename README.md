
# Smilodon

Nuxt/Vue based MindMap.

## Data

### Entity

- id: string
- icon: string
- title: string
- description: string
- properties: object
  + [key]: Property
- category: string (Category id)
- tags: array of string

### Property

- id: string
- value: string / number / boolean
- type: string of
  + Text (string),
  + Number (number),
  + Date (ISO8601 string),
  + Time (ISO8601 string),
  + DateTime (ISO8601 string),
  + True/False (boolean)

### Category

- id: string
- title: string
- parent: string (id of another category)

# TODO

- deleting a tag from an entity
- tags should be auto-sorted alphabetically
- category doesn't get pre-filled when editing
- entity table should be sortable
- 