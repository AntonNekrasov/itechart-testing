# --- First database schema

# --- !Ups

set ignorecase true;

create table technology (
  id                        bigint not null auto_increment,
  name                      varchar(255) not null,
  constraint pk_technology primary key (id))
;

create sequence technology_seq start with 1000;

# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists technology;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists technology_seq;


