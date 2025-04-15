create table iron_cat_current.notes
(
    id          int auto_increment
        primary key,
    title       char(50)                                                  null,
    comment     text                                                      null,
    create_date char(100)                                                 null,
    category    enum ('automovil', 'urgentes', 'empleados', 'pendientes') null,
    deleted     smallint default 0                                        not null,
    fk_user     int                                                       null,
    fav_flag    tinyint  default 0                                        null,
    constraint notes_users_id_fk
        foreign key (fk_user) references iron_cat_current.users (id)
);

