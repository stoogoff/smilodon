
# Smilodon

Nuxt/Vue based MindMap.

## Data

### Entity

- \_id: string
- icon: string
- title: string
- description: string
- properties: object
  + [key]: Property
- category: string (Category id)
- tags: array of string
- created: ISO date string
- modified: ISO date string

### Property

- \_id: string
- value: string / number / boolean
- type: string of
  + Text (string),
  + Number (number),
  + Date (ISO8601 string),
  + Time (ISO8601 string),
  + DateTime (ISO8601 string),
  + True/False (boolean)

### Category

- \_id: string
- title: string
- parent: string (id of another category)
- created: ISO date string
- modified: ISO date string

### Project

- \_id: string
- title: string
- description: string
- created: ISO date string
- modified: ISO date string

# TODO

- tags should be auto-sorted alphabetically
- connections table should be filterable by connection type
  + tag
  + category
  + links
- editing entities should temp save to local store
  + the whole JSON data should be saved by entity ID
  + if it's a new entity with no ID use a temp one
  + delete it on save
  + if it exists on loading the editor use the local store data
  + if it exists on viewing, flag it
- editor needs a lot of work
  + bug with toggling state (e.g. list, blockquote)
  + needs to have a Markdown view mode as well as rich text
  + should be able to link to other entities




