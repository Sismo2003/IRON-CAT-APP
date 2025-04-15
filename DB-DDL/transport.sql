create table iron_cat_current.transport
(
    id    int auto_increment
        primary key,
    brand varchar(50) not null,
    model varchar(50) not null,
    year  int         not null
)
    collate = utf8mb4_0900_ai_ci;

