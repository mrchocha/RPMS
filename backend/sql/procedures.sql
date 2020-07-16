
create or replace procedure split_string(string_given varchar(5000)) LANGUAGE plpgsql 
AS $$
declare 
sub_strs text[];
begin

drop table if exists split_subs;
create table split_subs(sub_s varchar(100));

sub_strs:=string_to_array(string_given, '+');

FOR i IN 1 .. array_length(sub_strs, 1) LOOP
	insert into split_subs values(sub_strs[i]);
END LOOP;

END $$;

Select * from splic_string('AI+ML')



create or replace procedure Search_using_Domains(str_given varchar(500)) 
LANGUAGE plpgsql    
AS $$
declare
domain_searched varchar;
d_id int;
c_ss cursor for select distinct(sub_s) from split_subs;
c_pd cursor for select domain_id from domain where domain_name like '%'||domain_searched ||'%';
c_p cursor for select paper_id from paper_domain where domain_id=d_id;
r_c_ss record;
r_c_pd record;
r_c_p record;
final_string varchar(1000) default '';
begin
call split_string(str_given);

drop table if exists searched_resultpaper_Domain;
create table searched_resultpaper_Domain(p_id int);

open c_ss;
loop
	fetch c_ss into r_c_ss;
	exit when not found;
	domain_searched:=r_c_ss.sub_s;
	open c_pd;
	loop
		fetch c_pd into r_c_pd;
		exit when not found;
		d_id:=r_c_pd.domain_id;		
		open c_p;
		loop
			fetch c_p into r_c_p;
			exit when not found;
		    insert into searched_resultpaper_Domain values(r_c_p.paper_id);
		end loop;
		close c_p;
	end loop;		
	close c_pd;
end loop;
close c_ss;
/*select * from paper where paper_id in(select p_id from searched_resultpaper_Domain);*/
end $$ 

call Search_using_Domains('AI+ML')




create or replace procedure insert_into_publication_table(pub_name varchar,pap_id int) LANGUAGE plpgsql    
AS $$
declare
pub_id int;
c_pub cursor for select publication_id from publication where publication_name=pub_name;
r_c_pub record;
begin
insert into publication values(0,pub_name);
open c_pub;
loop
	fetch c_pub into r_c_pub;
	exit when not found;
	pub_id=r_c_pub.publication_id;
end loop;
close c_pub;
update paper set paper_publication_id=pub_id where paper_id=pap_id;
end $$

call insert_into_publication_table('XYXY',8)




create or replace procedure insert_into_school_table(sch_name varchar,pap_id int) LANGUAGE plpgsql    
AS $$
declare
sch_id int;
c_sch cursor for select school_id from school where school_name=sch_name;
r_c_sch record;
begin
open c_sch;
loop
	fetch c_sch into r_c_sch;
	exit when not found;
	sch_id=r_c_sch.school_id;
end loop;
close c_sch;
insert into paper_school values(pap_id,sch_id);
end $$;

call insert_into_school_table('SEAS',8)




create or replace procedure insert_into_Conference_table(conf_name varchar, conf_venue varchar,conf_time time, pap_id int,conf_date date) LANGUAGE plpgsql    
AS $$
declare
conf_id int;
c_conf cursor for select conference_id from conference where conference_name=conf_name and conference_venue=conf_venue and conference_time=conf_time and conference_date=conf_date;
r_c_conf record;
begin
insert into conference values(0,conf_name,conf_venue,conf_time, conf_date);
open c_conf;
loop
	fetch c_conf into r_c_conf;
	exit when not found;
	conf_id=r_c_conf.conference_id;
end loop;
close c_conf;
insert into conference_paper values(pap_id,conf_id);
end $$;

insert_into_Conference_table('xx','yy','10:10:10',8)




create or replace procedure  insert_into_Reference_table(refe_name varchar, refe_date date, refe_aut varchar[],publ varchar,doi_num varchar, pap_id int) LANGUAGE plpgsql    
AS $$
declare
ref_id int;
publ_id int;
c_refe cursor for select reference_id from reference where reference_paper_name=refe_name and reference_paper_publish_date=refe_date and publisher=publ and doi_number=doi_num;
r_c_refe record;
aut_id int;
begin
insert into reference values(0,refe_name,refe_date,publ,doi_num);
open c_refe;
loop
	fetch c_refe into r_c_refe;
	exit when not found;
	ref_id=r_c_refe.reference_id;
end loop;
close c_refe;
insert into reference_paper values(pap_id,ref_id);
for i in 1..array_length(refe_aut,1)
loop
 	insert into author values(0,refe_aut[i]);
	select author_id into aut_id from author where author_name=refe_aut[i];
	insert into author_reference values(aut_id,ref_id);	
end loop;
end $$;

call insert_into_Reference_table('xx','2020-10-10',array['aa','bb'],'IEEE','ass121321',8)




create or replace procedure insert_into_Domain_table(dom_name varchar, pap_id int) LANGUAGE plpgsql    
AS $$
declare
dom_id int;
c_dom cursor for select domain_id from domain where domain_name=dom_name;
r_c_dom record;
begin
insert into domain values(0,dom_name);
open c_dom;
loop
	fetch c_dom into r_c_dom;
	exit when not found;
	dom_id=r_c_dom.domain_id;
end loop;
close c_dom;
insert into paper_domain values(pap_id,dom_id);
end $$;

call insert_into_Domain_table('AI',8)




create or replace procedure insert_into_school_user_paper( author int[] ,paper_id int) LANGUAGE plpgsql 
AS $$
declare 
schools int[];
sch int;
flg int default -1; 
begin
for i in 1..array_length(author,1)
loop
	insert into user_paper values(paper_id,author[i]);	
	select user_school into sch from "User" where user_id=author[i];
		for j in 1..coalesce(array_length(schools,1),0)
		loop
			if schools[j]=sch then flg=1;
			end if;
		end loop;
	if flg=-1 then
	insert into paper_school values(paper_id,sch);
	schools:=array_append(schools,sch);
	end if;
end loop;
END $$;

call insert_into_school_user_paper(array[1,0,3],11)




