create table iron_cat_current.tickets
(
    id             int auto_increment
        primary key,
    responsible_id int                                                                   not null,
    client_id      int                                                                   null,
    customer_name  char(100)                                                             null comment 'customer name in case the client it''s not registered',
    total          decimal(12, 2)                                                        not null,
    type           enum ('sale', 'shop')                                                 null,
    status         enum ('authorized', 'deleted', 'pending') default 'pending'           not null,
    date           datetime                                  default current_timestamp() null,
    constraint tickets_clients_id_fk
        foreign key (client_id) references iron_cat_current.clients (id),
    constraint tickets_ibfk_1
        foreign key (responsible_id) references iron_cat_current.users (id)
)
    collate = utf8mb4_0900_ai_ci;

create index responsible_id
    on iron_cat_current.tickets (responsible_id);

