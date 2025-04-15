create table iron_cat_current.product_list
(
    id                   int auto_increment
        primary key,
    material             varchar(50)    not null,
    wholesale_price_buy  decimal(12, 2) not null,
    wholesale_price_sell decimal(12, 2) not null,
    retail_price_buy     decimal(12, 2) not null,
    retail_price_sell    decimal(12, 2) not null,
    img                  mediumtext     null
)
    collate = utf8mb4_0900_ai_ci;

