CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Lassi', 'https://fullstackopen.com', 'FullStackOpen');

insert into blogs (url, title, likes) values ('google.com', 'This entry has no author', 999);
