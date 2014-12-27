# --- First database schema

# --- !Ups

INSERT INTO technology (id, name) VALUES(3000, 'one');

# --- !Downs

delete from technology t where t.name = 'one';
