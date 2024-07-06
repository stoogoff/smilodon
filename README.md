
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
  + links (this is waiting on editor improvements)
  + properties with matching names and values
- editor needs a lot of work
  + bug with toggling state (e.g. list, blockquote)
  + needs to have a Markdown view mode as well as rich text
  + should be able to link to other entities
- uploading content to import directly
  + this needs to include uploading a project from a zip folder in the format used for backups
  + single markdown / text file should open the entity editor prefilling the description
    * if this has YAML headers in the download format it should parse those as well
  + CSV / spreadhseet import?
- handle errors in saving data


