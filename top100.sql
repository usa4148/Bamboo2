
create table top100 (
    category Integer,
    category_name text,
    channel_id text,
    country text,
    followers Integer Primary Key,
    join_date Integer,
	loc text, 
    picture_url text,
    profile_url text,
    title text,
    trailer_title text,
    trailer_url text,
    videos Integer
);

