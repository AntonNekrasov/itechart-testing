# --- First database schema

# --- !Ups

create table technology (
  id                        bigint not null auto_increment,
  name                      varchar(56) not null,
  description               varchar(1024) default '',
  deleted                   boolean not null default false,
  updated                   datetime not null default NOW(),
  constraint pk_technology primary key (id));

# --- !Downs

drop table if exists technology;
