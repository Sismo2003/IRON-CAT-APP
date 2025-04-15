create table iron_cat_current.products_ticket
(
    id         int auto_increment
        primary key,
    ticket_id  int                          not null,
    product_id int                          not null,
    weight     decimal(12, 2)               not null,
    waste      decimal(12, 2)               not null,
    unit_price decimal(12, 2)               not null comment 'precio unitario por kilogramo al momento de la venta',
    total      decimal(12, 2)               null comment 'Total de kilogramos por el precio del momento en que se vendio el producto',
    type       enum ('wholesale', 'retail') null,
    constraint products_ticket_ibfk_1
        foreign key (ticket_id) references iron_cat_current.tickets (id),
    constraint products_ticket_ibfk_2
        foreign key (product_id) references iron_cat_current.product_list (id)
)
    collate = utf8mb4_0900_ai_ci;

create index product_id
    on iron_cat_current.products_ticket (product_id);

create index ticket_id
    on iron_cat_current.products_ticket (ticket_id);

