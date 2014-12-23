# --- First database schema

# --- !Ups

INSERT INTO technology (name) VALUES('one');

# --- !Downs

delete from technology t where t.name = 'one';
