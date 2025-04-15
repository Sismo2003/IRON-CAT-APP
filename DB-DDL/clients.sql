create table iron_cat_current.clients
(
    id          int auto_increment
        primary key,
    name        varchar(50)  not null,
    last_name   varchar(50)  not null,
    rfc         varchar(50)  not null,
    last_visit  datetime     null,
    email       varchar(50)  null,
    phone       varchar(15)  null,
    address     varchar(100) null,
    customer_id varchar(50)  null,
    img         mediumtext   null
)
    collate = utf8mb4_0900_ai_ci;

