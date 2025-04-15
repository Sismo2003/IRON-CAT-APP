create table iron_cat_current.transport_services
(
    id           int auto_increment
        primary key,
    transport_id int          not null,
    service_date date         not null,
    comments     varchar(150) null,
    constraint transport_services_ibfk_1
        foreign key (transport_id) references iron_cat_current.transport (id)
)
    collate = utf8mb4_0900_ai_ci;

create index transport_id
    on iron_cat_current.transport_services (transport_id);

