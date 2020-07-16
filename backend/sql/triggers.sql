
create or replace function Insert_into_reference() returns trigger
LANGUAGE plpgsql    
AS $$
declare
c_id cursor for select reference_id from reference where reference_paper_name=new.reference_paper_name and reference_paper_publish_date=new.reference_paper_publish_date and   publisher=new.publisher and doi_number=new.doi_number;
m_id cursor for select max(reference_id) as mx from reference;
r_m_id record; 
r_c_id record;
rr_id int default -1;
begin
open c_id;
loop
	fetch c_id into r_c_id;
	exit when not found;
	rr_id:=r_c_id.reference_id;
end loop;
close c_id;
if rr_id <> -1 then
return null;
elsif rr_id=-1 then
	open m_id;
	loop
		fetch m_id into r_m_id;
		exit when not found;
		rr_id:=r_m_id.mx+1;
	end loop;
	close m_id;
new.reference_id:=rr_id;
return new;
end if;
end $$;
create trigger reference_inserted before insert on reference for each row execute procedure Insert_into_reference()





create or replace function Insert_into_domain() returns trigger
LANGUAGE plpgsql    
AS $$
declare
d_id cursor for select domain_id from domain where domain_name=new.domain_name;
m_id cursor for select max(domain_id) as mx from domain;
r_d_id record;
r_m_id record; 
rr_id int default -1;
begin
open d_id;
loop
	fetch d_id into r_d_id;
	exit when not found;
	rr_id:=r_d_id.domain_id;
end loop;
close d_id;
if rr_id <> -1 then
	return null;
else 
	open m_id;
	loop
		fetch m_id into r_m_id;
		exit when not found;
		rr_id:=r_m_id.mx+1;
	end loop;
	close m_id;
	new.domain_id:=rr_id;
	return new;
end if;
end $$;
create trigger domain_inserted before insert on domain for each row execute procedure Insert_into_domain()






create or replace function Insert_into_author() returns trigger
LANGUAGE plpgsql    
AS $$
declare
auth_id cursor for select author_id from author where author_name=new.author_name;
m_id cursor for select max(author_id) as mx from author;
r_d_id record;
r_m_id record; 
rr_id int default -1;
begin
open auth_id;
loop
	fetch auth_id into r_d_id;
	exit when not found;
	rr_id:=r_d_id.author_id;
end loop;
close auth_id;
if rr_id <> -1 then
	return null;
else 
	open m_id;
	loop
		fetch m_id into r_m_id;
		exit when not found;
		rr_id:=r_m_id.mx+1;
	end loop;
	close m_id;
	new.author_id:=rr_id;
	return new;
end if;
end $$;
create trigger author_inserted before insert on author for each row execute procedure Insert_into_author()





create or replace function Insert_into_comment() returns trigger
LANGUAGE plpgsql    
AS $$
declare
m_id cursor for select max(comment_id) as mx from comment;
r_m_id record; 
rr_id int default -1;
begin
open m_id;
loop
	fetch m_id into r_m_id;
	exit when not found;
	rr_id:=r_m_id.mx+1;
end loop;
close m_id;
	new.comment_id:=rr_id;
return new;
end $$;
create trigger comment_inserted before insert on comment for each row execute procedure Insert_into_comment()





create or replace function Insert_into_conference() returns trigger
LANGUAGE plpgsql    
AS $$
declare
c_id cursor for select conference_id from conference where conference_name=new.conference_name and conference_venue=new.conference_venue and conference_time=new.conference_time and conference_date=new.conference_date ; 
s_id cursor for select max(conference_id)  as mx from conference;
r_s_id record; 
r_c_id record;
rr_id int default -1;
begin
open c_id;
loop
	fetch c_id into r_c_id;
	exit when not found;
	rr_id:=r_c_id.conference_id;
end loop;
close c_id;
if rr_id <> -1 then 
return  null;
elsif rr_id = -1 then
open s_id;
loop
	fetch s_id into r_s_id;
	exit when not found;
	rr_id:=r_s_id.mx+1;
end loop;
close s_id;
new.conference_id:=rr_id;
end if;
return new;
end $$;

create trigger conference_inserted before insert on Conference for each row execute procedure Insert_into_conference()





create or replace function Insert_into_Publication() returns trigger
LANGUAGE plpgsql    
AS $$
declare
c_id cursor for select Publication_id from Publication where Publication_name=new.Publication_name; 
s_id cursor for select max(Publication_id)  as mx from Publication;
r_s_id record; 
r_c_id record;
rr_id int default -1;
begin
open c_id;
loop
	fetch c_id into r_c_id;
	exit when not found;
	rr_id:=r_c_id.Publication_id;
end loop;
close c_id;
if rr_id <> -1 then 
return  null;
elsif rr_id = -1 then
open s_id;
loop
	fetch s_id into r_s_id;
	exit when not found;
	rr_id:=r_s_id.mx+1;
end loop;
close s_id;
new.Publication_id:=rr_id;
end if;
return new;
end $$;

create trigger Publication_inserted before insert on Publication for each row execute procedure Insert_into_Publication()






create or replace function Insert_into_Paper() returns trigger
LANGUAGE plpgsql    
AS $$
declare
c_id cursor for select paper_id from paper where paper_name=new.paper_name and paper_time_duration=new.paper_time_duration and paper_submit_date=new.paper_submit_date and paper_accept_date=new.paper_accept_date and paper_publish_date=new.paper_publish_date and paper_publication_id=new.paper_publication_id and paper_citation_type=new.paper_citation_type; 
s_id cursor for select max(paper_id)  as mx from paper;
r_s_id record; 
r_c_id record;
rr_id int default -1;
begin
open c_id;
loop
	fetch c_id into r_c_id;
	exit when not found;
	rr_id:=r_c_id.paper_id;	
end loop;
close c_id;
if rr_id <> -1 then 
	raise exception 'Paper alredy exists';
	return  null;
elsif rr_id = -1 then
	open s_id;
	loop
		fetch s_id into r_s_id;
		exit when not found;
		rr_id:=r_s_id.mx+1;
	end loop;
	close s_id;
	new.paper_id:=rr_id;
	return new;
end if;
end $$;

create trigger paper_inserted before insert on paper for each row execute procedure Insert_into_Paper()

