# Model Relationships in Rails Application

## Relationships Summary 
- As of Nov 19, 2024
- most recent migration: 20241030191324_add_timestamps_to_tables.rb

### 1. **Entry**
- **Belongs to**: `DayPeriod`, `Emotion`, `User`
- **Relationship type**:
    - One-to-Many: An `Entry` belongs to a single `DayPeriod`, and a `DayPeriod` can have many `Entries`.
    - One-to-Many: An `Entry` belongs to a single `Emotion`, and an `Emotion` can have many `Entries`.
    - One-to-Many: An `Entry` belongs to a single `User`, and a `User` can have many `Entries`.

### 2. **Period**
- **Has many**: `DayPeriods`, `Days` (through `DayPeriods`)
- **Relationship type**:
    - One-to-Many: A `Period` has many `DayPeriods`.
    - Many-to-Many: A `Period` has many `Days` through `DayPeriods`.

### 3. **Day**
- **Belongs to**: `User`
- **Has many**: `DayPeriods`, `Periods` (through `DayPeriods`), `Entries` (through `DayPeriods`), `Emotions` (through `Entries`)
- **Relationship type**:
    - One-to-Many: A `Day` belongs to a `User`, and a `User` can have many `Days`.
    - One-to-Many: A `Day` has many `DayPeriods`.
    - Many-to-Many: A `Day` has many `Periods` through `DayPeriods`.
    - Many-to-Many: A `Day` has many `Emotions` through `Entries`.

### 4. **DayPeriod**
- **Belongs to**: `Day`, `Period`, `User`
- **Has many**: `Entries`, `Emotions` (through `Entries`)
- **Relationship type**:
    - One-to-Many: A `DayPeriod` belongs to a single `Day`, and a `Day` can have many `DayPeriods`.
    - One-to-Many: A `DayPeriod` belongs to a single `Period`, and a `Period` can have many `DayPeriods`.
    - One-to-Many: A `DayPeriod` belongs to a single `User`, and a `User` can have many `DayPeriods`.
    - One-to-Many: A `DayPeriod` has many `Entries`.
    - Many-to-Many: A `DayPeriod` has many `Emotions` through `Entries`.

### 5. **Emotion**
- **Relationship type**:
    - One-to-Many: An `Emotion` can have many `Entries` (from the `Entry` model definition).

---

## Detailed Relationship Types

| **Model**      | **Relationship**         | **Target Model**    | **Type**          |
|-----------------|--------------------------|---------------------|-------------------|
| `Entry`         | `belongs_to`            | `DayPeriod`         | One-to-Many       |
| `Entry`         | `belongs_to`            | `Emotion`           | One-to-Many       |
| `Entry`         | `belongs_to`            | `User`              | One-to-Many       |
| `Period`        | `has_many`              | `DayPeriods`        | One-to-Many       |
| `Period`        | `has_many` (through)    | `Days`              | Many-to-Many      |
| `Day`           | `belongs_to`            | `User`              | One-to-Many       |
| `Day`           | `has_many`             | `DayPeriods`        | One-to-Many       |
| `Day`           | `has_many` (through)    | `Periods`           | Many-to-Many      |
| `Day`           | `has_many` (through)    | `Entries`           | Many-to-Many      |
| `Day`           | `has_many` (through)    | `Emotions`          | Many-to-Many      |
| `DayPeriod`     | `belongs_to`            | `Day`               | One-to-Many       |
| `DayPeriod`     | `belongs_to`            | `Period`            | One-to-Many       |
| `DayPeriod`     | `belongs_to`            | `User`              | One-to-Many       |
| `DayPeriod`     | `has_many`             | `Entries`           | One-to-Many       |
| `DayPeriod`     | `has_many` (through)    | `Emotions`          | Many-to-Many      |
| `Emotion`       | Implicit (via `Entry`)  | `Entries`           | One-to-Many       |

This table and summary provide a clear picture of the relationships between the models in the application.




## HABTM Relationships

### 1. Days and Periods
These are relationships that can be converted to use `has_and_belongs_to_many`, to simplify things.
Currently, they exist through `through:`./

#### Relationship
- **Type**: Many-to-Many
- **Description**: Many `Days` can have many `Periods`, and many `Periods` can belong to many `Days`.

#### Implementation
- **Join Table**: `DayPeriods`

### 2. Days and Emotions

#### Relationship
- **Type**: Many-to-Many
- **Description**: Many `Days` can have many `Emotions`, and many `Emotions` can belong to many `Days`.

#### Implementation
- **Join Table**: `Entries`

## 3. DayPeriods and Emotions

#### Relationship
- **Type**: Many-to-Many
- **Description**: Many `DayPeriods` can have many `Emotions`, and many `Emotions` can belong to many `DayPeriods`.

#### Implementation
- **Join Table**: `Entries`
