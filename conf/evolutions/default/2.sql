# --- Question table database schema

# --- !Ups

create table question (
  id                        bigint not null auto_increment,
  body                      varchar(1024) not null,
  deleted                   boolean not null default false,
  updated                   datetime not null default NOW(),
  constraint pk_question primary key (id));

# --- !Downs

drop table if exists question;
