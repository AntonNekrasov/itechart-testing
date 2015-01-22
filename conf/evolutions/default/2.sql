# --- First database schema

# --- !Ups

INSERT INTO technology (id, `name`, description) VALUES(3000, 'Java core', 'Java can reduce costs, drive innovation, and improve application services as the programming language of choice for IoT, enterprise architecture, and cloud computing.');
INSERT INTO technology (id, `name`, description) VALUES(3001, 'Java enterprise', 'Java Platform, Enterprise Edition or Java EE is Oracle''s enterprise Java computing platform.');
INSERT INTO technology (id, `name`, description) VALUES(3002, '.Net', 'It includes a large class library known as Framework Class Library (FCL) and provides language interoperability (each language can use code written in other languages) across several programming languages.');
INSERT INTO technology (id, `name`, description) VALUES(3003, 'C#', 'C#  is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.');
INSERT INTO technology (id, `name`, description) VALUES(3004, 'Python', 'Python is a widely used general-purpose, high-level programming language.');
INSERT INTO technology (id, `name`, description) VALUES(3005, 'PHP', 'PHP is a server-side scripting language designed for web development but also used as a general-purpose programming language.');
INSERT INTO technology (id, `name`, description) VALUES(3006, 'Javascript', 'JS is a dynamic computer programming language. It is most commonly used as part of web browsers.');
INSERT INTO technology (id, `name`, description) VALUES(3007, 'HTML', 'HTML or HyperText Markup Language is the standard markup language used to create Web pages.');
INSERT INTO technology (id, `name`, description) VALUES(3008, 'Scala', 'Scala is an object-functional programming language for general software applications. ');
INSERT INTO technology (id, `name`, description) VALUES(3009, 'Android', 'Android is a mobile operating system (OS) based on the Linux kernel and currently developed by Google.');
INSERT INTO technology (id, `name`, description) VALUES(3010, 'iOs', 'iOS (previously iPhone OS) is a mobile operating system developed by Apple Inc.');
INSERT INTO technology (id, `name`, description) VALUES(3011, 'QA', 'Quality Assurance (QA) is a way of preventing mistakes or defects in manufactured products and avoiding problems when delivering solutions or services to customers.');
INSERT INTO technology (id, `name`, description) VALUES(3012, 'C ++', 'It has imperative, object-oriented and generic programming features, while also providing the facilities for low-level memory manipulation.');
INSERT INTO technology (id, `name`, description) VALUES(3013, 'RDBMS', 'Database management systems are computer software applications that interact with the user, other applications, and the database itself to capture and analyze data.');
INSERT INTO technology (id, `name`, description) VALUES(3014, 'Ruby', 'Ruby is a dynamic, reflective, object-oriented, general-purpose programming language.');

# --- !Downs

delete from technology t where t.id = 3000;
delete from technology t where t.id = 3001;
delete from technology t where t.id = 3002;
delete from technology t where t.id = 3003;
delete from technology t where t.id = 3004;
delete from technology t where t.id = 3005;
delete from technology t where t.id = 3006;
delete from technology t where t.id = 3007;
delete from technology t where t.id = 3008;
delete from technology t where t.id = 3009;
delete from technology t where t.id = 3010;
delete from technology t where t.id = 3011;
delete from technology t where t.id = 3012;
delete from technology t where t.id = 3013;
delete from technology t where t.id = 3014;
