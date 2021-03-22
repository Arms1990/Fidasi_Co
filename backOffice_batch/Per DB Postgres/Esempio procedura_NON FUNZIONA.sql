CREATE OR REPLACE PROCEDURE batch.update_tab_prova(INT, character varying)
LANGUAGE plpgsql    
AS $$
BEGIN
    -- subtracting the amount from the sender's account 
    UPDATE batch.tab_prova
    SET b = $2
    WHERE a = $1;

    COMMIT;
END;
$$;