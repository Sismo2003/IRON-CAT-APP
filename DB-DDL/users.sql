create table iron_cat_current.users
(
    id         int auto_increment
        primary key,
    name       varchar(50)                          not null,
    last_name  varchar(50)                          not null,
    rfc        varchar(50)                          null,
    last_login datetime default current_timestamp() null,
    email      varchar(50)                          null,
    phone      varchar(15)                          null,
    address    varchar(100)                         null,
    user_id    varchar(50)                          null,
    img        mediumtext                           null,
    username   varchar(50)                          not null,
    password   text                                 not null,
    type       enum ('admin', 'user')               not null,
    created_at datetime default current_timestamp() null,
    constraint rfc
        unique (rfc),
    constraint username
        unique (username)
)
    collate = utf8mb4_0900_ai_ci;

