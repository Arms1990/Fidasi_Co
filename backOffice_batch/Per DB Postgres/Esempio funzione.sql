CREATE OR REPLACE FUNCTION batch.get_tab_prova_row(int)
  RETURNS character varying AS
$BODY$SELECT CONCAT('#ARGUMENT_0#;',a,';',b,';',c,';',to_char(d, 'DD/MM/YYYY'),';',to_char(e, 'DD/MM/YYYY HH24:MI:SS') ) FROM batch.tab_prova where a=$1
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
