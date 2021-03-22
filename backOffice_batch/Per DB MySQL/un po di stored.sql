
DELIMITER \\
CREATE  PROCEDURE `update_tab_prova` (p_b VARCHAR(50))
BEGIN
  UPDATE 
  `tab_prova` 
  SET b=p_b; 
END

CALL `update_tab_prova` ('aggiornata da stored')

DELIMITER \\
CREATE FUNCTION func_4(i int)
RETURNS CHAR(10)
BEGIN
  DECLARE str CHAR(10);

  CASE i
    WHEN 1 THEN SET str="1";
    WHEN 2 THEN SET str="2";
    WHEN 3 THEN SET str="3";
    ELSE SET str="unknown";
  END CASE;

  RETURN str;
END

DELIMITER \\
CREATE  function `select_tab_prova` (p_a int)
RETURNS varchar(50)
BEGIN
  DECLARE str varchar(50);

  SELECT b into str from `tab_prova` WHERE a=p_a; 

  return str;
END


DELIMITER \\
CREATE  function `select_tab_prova_all` ()
RETURNS varchar(65535)
BEGIN
  DECLARE V_CSVROW varchar(65535);
  DECLARE V_CSVALL varchar(65535);
  DECLARE finished INTEGER DEFAULT 0;

  DEClARE mycur CURSOR FOR 
    SELECT CONCAT(IFNULL(a,''),';',IFNULL(b,''),';',IFNULL(c,''),';',IFNULL(DATE_FORMAT(d, '%Y%m%d'),''),';',IFNULL(DATE_FORMAT(e, '%Y/%m/%d %T'),'')) as csvrow
    FROM `tab_prova`;
    
  DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
     
  OPEN mycur;
  
  SET V_CSVALL = "";
  SET V_CSVROW = "";

  mycurloop: LOOP
      FETCH mycur INTO V_CSVROW;
      IF finished = 1 THEN 
          LEAVE mycurloop;
      END IF;
      SET V_CSVALL = CONCAT(V_CSVALL,"\n",V_CSVROW);
   END LOOP mycurloop;
   CLOSE mycur;

   return V_CSVALL;
  
END

