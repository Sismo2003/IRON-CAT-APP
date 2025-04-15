create table iron_cat_current.client_product
(
    client_id  int                                   not null,
    product_id int                                   not null,
    created_at timestamp default current_timestamp() null,
    primary key (client_id, product_id),
    constraint fk_client_product_client
        foreign key (client_id) references iron_cat_current.clients (id)
            on delete cascade,
    constraint fk_client_product_product
        foreign key (product_id) references iron_cat_current.product_list (id)
            on delete cascade
)
    collate = utf8mb4_0900_ai_ci;

