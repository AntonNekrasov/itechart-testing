# --- First database schema

# --- !Ups

INSERT INTO technology (id, `name`, description) VALUES(3000, 'One', 'Some description');
INSERT INTO technology (id, `name`, description) VALUES(3001, 'Two', 'Another description');

# --- !Downs

delete from technology t where t.name = 'One';
delete from technology t where t.name = 'Two';
