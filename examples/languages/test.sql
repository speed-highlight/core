-- Comment
SELECT 'Geeks' || ' ' || @test_hello FROM dual;
INSERT INTO database (geek_id, geek_name) VALUES (5000, 'abc');
REPLACE('123geeks123', '123', TRUE);
CREATE TABLE geeks (geek_id INT PRIMARY KEY, geek_name VARCHAR(20));
select count(geek_id) from geeks where geek_name is not null and active = true;
/* FIXME Multiline
	Comment */