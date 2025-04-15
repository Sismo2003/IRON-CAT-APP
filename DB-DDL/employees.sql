create table iron_cat_current.employees
(
    id          int auto_increment
        primary key,
    employee_id varchar(20)   not null,
    name        varchar(100)  not null,
    img         text          null,
    designation varchar(100)  not null,
    email       varchar(100)  not null,
    phone       varchar(20)   not null,
    location    varchar(100)  null,
    experience  decimal(3, 1) not null,
    join_date   date          not null,
    constraint email
        unique (email),
    constraint employee_id
        unique (employee_id)
)
    collate = utf8mb4_0900_ai_ci;

