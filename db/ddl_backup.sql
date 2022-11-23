create table ar_internal_metadata
(
    key        varchar     not null
        primary key,
    value      varchar,
    created_at datetime(6) not null,
    updated_at datetime(6) not null
);

create table days
(
    id   integer not null
        primary key autoincrement,
    date date
);

create unique index index_days_on_date
    on days (date);

create table emotions
(
    id   integer not null
        primary key autoincrement,
    name varchar
);

create unique index index_emotions_on_name
    on emotions (name);

create table periods
(
    id   integer not null
        primary key autoincrement,
    name varchar
);

create table day_periods
(
    id        integer not null
        primary key autoincrement,
    day_id    integer not null
        constraint fk_rails_8232f1a3f8
            references days,
    period_id integer not null
        constraint fk_rails_6128bf19ec
            references periods
);

create index index_day_periods_on_day_id
    on day_periods (day_id);

create index index_day_periods_on_period_id
    on day_periods (period_id);

create table entries
(
    id            integer not null
        primary key autoincrement,
    day_period_id integer not null
        constraint fk_rails_dcd8644245
            references day_periods,
    emotion_id    integer not null
        constraint fk_rails_08653d90f1
            references emotions
);

create index index_entries_on_day_period_id
    on entries (day_period_id);

create index index_entries_on_emotion_id
    on entries (emotion_id);

create unique index index_periods_on_name
    on periods (name);

create table schema_migrations
(
    version varchar not null
        primary key
);


