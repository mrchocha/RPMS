
create or replace function convert_into_citation(p_id int) returns varchar(1000) as $$
declare 
final_cite varchar(1000) default '';
cite_type varchar(50);
pub_date varchar;
pr_id int;
c_a cursor for select author_name from author where author_id in( select author_id from author_reference where reference_id =pr_id);
c_p cursor for select paper_citation_type from paper where paper_id=p_id;
c_r cursor for select * from reference where reference_id in (select reference_id from reference_paper where paper_id=p_id);
r_c_r RECORD;
r_c_p RECORD;
r_c_a RECORD;
auth_name varchar default '';

is_in varchar(1000);
begin 
open c_p;
loop
	fetch c_p into r_c_p;
	exit when not found;
	cite_type:=r_c_p.paper_citation_type;
end loop;	
close c_p;
open c_r;
loop
	fetch c_r into r_c_r;
	exit when not found;
	pr_id:=r_c_r.reference_id;
	auth_name:='';
	for r_c_a in c_a
	loop
		auth_name:=auth_name || ',' || r_c_a.author_name;
	end loop;
	auth_name:=substring(auth_name from 2 for length(auth_name));
	if cite_type='IEEE' then
		pub_date:=to_char(r_c_r.reference_paper_publish_date, 'Mon') || ', ' || to_char(r_c_r.reference_paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_r.reference_paper_name||'", '||r_c_r.publisher||', '|| pub_date ||', '||r_c_r.doi_number;
	elseif cite_type='MLA' then
		pub_date:=to_char(r_c_r.reference_paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_r.reference_paper_name||'",'||r_c_r.publisher||', '||pub_date||', '||r_c_r.doi_number;
	elseif cite_type='CHICAGO' then
		pub_date:=to_char(r_c_r.reference_paper_publish_date, 'Month') || ' '|| to_char(r_c_r.reference_paper_publish_date, 'dd')   || ', ' || to_char(r_c_r.reference_paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_r.reference_paper_name||'",'||r_c_r.publisher||', '|| pub_date ||', '||r_c_r.doi_number;
	elseif cite_type='APA' then
		pub_date:=to_char(r_c_r.reference_paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||','||pub_date||', "'||r_c_r.reference_paper_name||'", '||r_c_r.publisher||', '||r_c_r.doi_number;
	elseif cite_type='CSE' then
		pub_date:=to_char(r_c_r.reference_paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||','||pub_date||', "'||r_c_r.reference_paper_name||'", '||r_c_r.publisher||', '||r_c_r.doi_number;
	end if;
	final_cite :=final_cite ||chr(10);
end loop;
close c_r;

return final_cite;
end
$$ 
LANGUAGE plpgsql;

select * from convert_into_citation(1)




create or replace function Insert_Into_Paper_table(p_name varchar, p_t_d int, p_s_d date, p_a_d date, p_p_d date, p_c varchar) returns int 
AS $$
declare
c_p cursor for select paper_id from paper where paper_name=p_n and paper_time_duration=p_t_d and paper_submit_date=p_s_d and paper_accept_date=p_a_d and paper_publish_date=p_p_d and paper_citation_type=p_c; 
r_c_p record;
paper_gen_id int;
begin
insert into paper values(0,p_n, p_t_d, p_s_d, p_a_d, p_p_d, 1, p_c);
open c_p;
loop
	  fetch c_p into r_c_p;
	  exit when not found;
	  paper_gen_id=r_c_p.paper_id;
end loop;
close c_p;
return paper_gen_id;
end $$
LANGUAGE plpgsql ;

Select * from Insert_Into_Paper_table(‘xx’,’2020-10-10’,’2020-10-10’,’2020-10-10’,’IEEE’);





create or replace function Generate_report(p_id int) returns text[][] as $$
declare 
final_report varchar[][];
cont int default 1;
publ varchar;
user_sch varchar;
final_text varchar default '';
c_paper cursor for select * from paper where paper_id=p_id;
c_user cursor for select * from  "User" where user_id in (select user_id from user_paper where paper_id=p_id);
c_domn cursor for select * from domain where domain_id in (select domain_id from paper_domain where paper_id=p_id);
c_conf cursor for select * from conference where conference_id in (select conference_id from conference_paper where paper_id=p_id);
r_c_paper RECORD;
r_c_user RECORD;
r_c_domn RECORD;
r_c_conf RECORD;
begin 
for r_c_paper in c_paper
loop
		select publication_name into publ from publication where publication_id =(select paper_publication_id from paper where paper_id=p_id);
		final_text := final_text || r_c_paper.paper_name || ','  || r_c_paper.paper_time_duration || ',' || r_c_paper.paper_submit_date || ','  || r_c_paper.paper_accept_date || ','  || r_c_paper.paper_publish_date || ','  || publ || ','|| r_c_paper.paper_citation_type;      
		final_report[cont]:=array['paper details',final_text];
		cont:=cont+1;
end loop;
final_text:='';
for r_c_user in c_user
loop
	select school_name into user_sch from school where school_id =r_c_user.user_school;
	final_text := final_text || r_c_user.user_id || ',' || r_c_user.user_name || ','  ||user_sch || ',' || r_c_user.user_type || ','  || r_c_user.user_mail ||chr(10);
end loop;
final_report[cont]:=array['user details',final_text];
cont:=cont+1;
final_text:='';
for r_c_domn in c_domn
loop
	final_text:=final_text || ',' || r_c_domn.domain_name;
end loop;
final_report[cont]:=array['Domain details',final_text];
cont:=cont+1;

final_text:='';
for r_c_conf in c_conf
loop
	final_text:=final_text || r_c_conf.conference_name || ','  || r_c_conf.conference_venue || ','  || r_c_conf.conference_time || ',' || r_c_conf.conference_date || chr(10); 
end loop;
final_report[cont]:=array['conference details',final_text];
cont:=cont+1;


final_text:='';
final_report[cont]:=array['reference details',convert_into_citation(p_id)];


return final_report;
end
$$ 
LANGUAGE plpgsql;

select * from Generate_report(8)





create or replace function is_reachable(p_id int, usr_id int) returns int as $$
declare 
usr_type varchar;
usr_school varchar;
infom int;
yn int default 0;
sch varchar default 'seas';
c_s cursor for select school_name  from school where school_id =(select user_school from "User" where user_id=usr_id);
c_r cursor for select * from reach where paper_id=p_id;
r_c_s RECORD;
begin
for r_c_s in c_s
loop
	sch=r_c_s.school_name;
end loop;
select user_type into usr_type from "User" where user_id=usr_id;
execute 'select '|| lower(sch) ||' from reach where paper_id='|| p_id  into infom; 
if infom=0 then
	yn=0;
elsif infom=3 then
	yn=1;
elsif infom=1 and lower(usr_type)='student' then
	yn=1;
elsif infom=2 and lower(usr_type)='faculty' or lower(usr_type)='professor' or lower(usr_type)='assistant professor' then
	yn=1;
else yn=0;
end if;
return yn;
end
$$ 
LANGUAGE plpgsql;

select * from is_reachable(8,0)




create or replace function Paper_citation(p_id int, c_type varchar) returns varchar(1000) as $$
declare 
final_cite varchar(1000) default '';
c_p cursor for select * from paper where paper_id=p_id;
c_a cursor for select user_name from "User" where user_id in( select user_id from user_paper where paper_id=p_id);
r_c_a RECORD;
r_c_p RECORD;
c_pub cursor for select publication_name from publication where publication_id= (select paper_publication_id from paper where paper_id=p_id);
r_c_pub RECORD;
publishser_of_paper varchar default '';
auth_name varchar default '';
pub_date varchar default '' ;
is_in varchar(1000);
begin 
for r_c_a in c_a
loop
	auth_name:=auth_name || ',' || r_c_a.user_name;
end loop;
for r_c_pub in c_pub
loop
	publishser_of_paper:=r_c_pub.publication_name;
end loop;
auth_name:=substring(auth_name from 2 for length(auth_name));
open c_p;
loop
	fetch c_p into r_c_p;
	exit when not found;
	if r_c_p.paper_citation_type='IEEE' then
		pub_date:=to_char(r_c_p.paper_publish_date, 'Mon') || ', ' || to_char(r_c_p.paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_p.paper_name||'", '||publishser_of_paper||', '|| pub_date;
	elseif r_c_p.paper_citation_type='MLA' then
		pub_date:=to_char(r_c_r.paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_p.paper_name||'",'||publishser_of_paperr||', '||pub_date;
	elseif r_c_p.paper_citation_type='CHICAGO' then
		pub_date:=to_char(r_c_p.paper_publish_date, 'Month') || ' '|| to_char(r_c_p.paper_publish_date, 'dd')   || ', ' || to_char(r_c_p.paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||', "'||r_c_p.paper_name||'",'||publishser_of_paper||', '|| pub_date;
	elseif r_c_p.paper_citation_type='APA' then
		pub_date:=to_char(r_c_p.paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||','||pub_date||', "'||r_c_p.paper_name||'", '||publishser_of_paper;
	elseif r_c_p.paper_citation_type='CSE' then
		pub_date:=to_char(r_c_p.paper_publish_date, 'yyyy') ;
		final_cite:=final_cite || auth_name ||','||pub_date||', "'||r_c_p.paper_name||'", '||publishser_of_paper;
	end if;
	final_cite :=final_cite ||chr(10);
end loop;
close c_p;

return final_cite;
end
$$ 
LANGUAGE plpgsql;

select * from Paper_citation(11, 'CSE');





CREATE OR REPLACE FUNCTION public.check_login(
	usr_mail character varying,
	usr_passwd character varying)
    RETURNS boolean
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare
r_users record;
inter varchar(1000);
pass varchar(1000);
begin
	for r_users in select * from "User" where user_mail=usr_mail
	loop
		--RAISE NOTICE 'Calling USERNAME(%)', r_users.user_name;
		inter:=r_users.user_name;
		pass:=r_users.password;
	end loop;
	if inter is null then
	    return null;
	elsif pass=usr_passwd then
		return true;
	else
		return false;
	end if;
end; $BODY$;

ALTER FUNCTION public.check_login(character varying, character varying)
    OWNER TO postgres



