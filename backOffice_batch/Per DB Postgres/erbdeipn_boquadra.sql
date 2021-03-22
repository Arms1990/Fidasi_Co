CREATE SEQUENCE batch.seq_db_catena
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE TABLE batch.db_catena (
  id_catena integer NOT NULL DEFAULT nextval('batch.seq_db_catena'::regclass),
  descr_catena character varying(255) NOT NULL,
  stato_catena text NOT NULL,
  CONSTRAINT PK_db_catena PRIMARY KEY (id_catena)
);

INSERT INTO batch.db_catena (id_catena, descr_catena, stato_catena) VALUES (1, 'Giornaliera Mattina', 'A');
INSERT INTO batch.db_catena (id_catena, descr_catena, stato_catena) VALUES (2, 'Giornaliera pomeriggio', 'A');
INSERT INTO batch.db_catena (id_catena, descr_catena, stato_catena) VALUES (3, 'Settimanale', 'A');
INSERT INTO batch.db_catena (id_catena, descr_catena, stato_catena) VALUES (4, 'Mensile', 'A');
INSERT INTO batch.db_catena (id_catena, descr_catena, stato_catena) VALUES (5, 'Mauro', 'A');

CREATE TABLE batch.db_dett_catena (
  id_catena integer NOT NULL,
  id_step integer NOT NULL,
  descr_step character varying(255) NOT NULL,
  pgm_richiamato character varying(4096) NOT NULL,
  tipo_pgm character varying(50) DEFAULT NULL,
  CONSTRAINT PK_db_dett_catena PRIMARY KEY (id_catena,id_step)
);

INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (1, 1, 'INIZIO', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (1, 10, 'STEP10', 'C:\\prova\\batchprova1.bat', 'EXE');
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (1, 20, 'STEP20', 'C:\\prova\\batchprova2.bat', 'EXE');
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (1, 255, 'FINE', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (2, 1, 'INIZIO', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (2, 10, 'STEP10', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (2, 20, 'STEP20', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (2, 255, 'FINE', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 1, 'INIZIO', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 10, 'STEP10', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 20, 'STEP20', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 30, 'STEP30', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 40, 'STEP40', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (3, 255, 'FINE', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (4, 1, 'INIZIO', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (4, 10, 'STEP10', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (4, 20, 'STEP20', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (4, 30, 'STEP30', 'PGM1', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (4, 255, 'FINE', '', NULL);
INSERT INTO batch.db_dett_catena (id_catena, id_step, descr_step, pgm_richiamato, tipo_pgm) VALUES (5, 1, 'Caricamento', 'java -jar \"C:\\\\Progetti\\\\Scheduler\\\\Sched\\\\backOfficeLoader\\\\backOfficeLoader.jar\" \"C:\\\\Progetti\\\\Scheduler\\\\Sched\\\\backOfficeLoader\\\\bol.properties\" \"C:\\\\Progetti\\\\Scheduler\\\\Sched\\\\backOfficeLoader\\\\tab_prova2.xml\" \"C:\\\\Progetti\\\\Scheduler\\\\Sched\\backOfficeLoader\\\\tab_prova2.csv\" N tab_prova S %IDCATENA %IDSTEP 15', 'EXE');

CREATE TABLE batch.db_dett_vincolo (
  id_catena integer NOT NULL,
  id_step integer NOT NULL,
  vincolo_step integer NOT NULL,
  vincolo_Catena integer DEFAULT NULL,
  vincolo_max_rc integer NOT NULL
);

CREATE UNIQUE INDEX idx_db_dett_vincolo ON batch.db_dett_vincolo(id_catena,id_step,vincolo_step,vincolo_Catena);

INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (1, 10, 1, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (1, 20, 10, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (1, 255, 20, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 1, 1, 1, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 1, 1, 3, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 10, 255, 1, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 20, 1, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 20, 10, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (2, 255, 20, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (3, 10, 1, 1, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (3, 20, 10, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (3, 30, 20, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (3, 40, 30, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (3, 255, 40, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (4, 1, 1, 3, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (4, 10, 1, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (4, 20, 10, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (4, 30, 20, NULL, 0);
INSERT INTO batch.db_dett_vincolo (id_catena, id_step, vincolo_step, vincolo_Catena, vincolo_max_rc) VALUES (4, 255, 30, NULL, 0);


CREATE TABLE batch.db_schedulazione (
  id_catena integer NOT NULL,
  stato char(1) NOT NULL,
  orario time NOT NULL,
  periodicita char(1) NOT NULL,
  param_period character varying(255) DEFAULT NULL,
  CONSTRAINT PK_db_schedulazione PRIMARY KEY (id_catena,orario)
);

INSERT INTO batch.db_schedulazione (id_catena, stato, orario, periodicita, param_period) VALUES (1, 'A', '08:00:00', 'D', NULL);
INSERT INTO batch.db_schedulazione (id_catena, stato, orario, periodicita, param_period) VALUES (2, 'A', '08:00:00', 'D', NULL);
INSERT INTO batch.db_schedulazione (id_catena, stato, orario, periodicita, param_period) VALUES (3, 'A', '08:00:00', 'W', 'SSSSSSS');
INSERT INTO batch.db_schedulazione (id_catena, stato, orario, periodicita, param_period) VALUES (4, 'A', '08:00:00', 'D', NULL);
INSERT INTO batch.db_schedulazione (id_catena, stato, orario, periodicita, param_period) VALUES (5, 'A', '08:00:00', 'D', NULL);

CREATE SEQUENCE batch.seq_sc_pianificazione
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
  
CREATE TABLE batch.sc_pianificazione (
  id_sched bigint NOT NULL DEFAULT nextval('batch.seq_sc_pianificazione'::regclass),
  id_catena integer NOT NULL,
  orario time NOT NULL,
  start_elab timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  end_elab timestamp  with time zone DEFAULT NULL,
  stato text NOT NULL,
  CONSTRAINT PK_sc_pianificazione PRIMARY KEY (id_catena,orario)
);

CREATE UNIQUE INDEX idx_sc_pianificazione ON batch.sc_pianificazione(id_sched);

CREATE TABLE batch.sc_step (
  id_sched bigint NOT NULL,
  id_catena integer NOT NULL,
  id_step integer NOT NULL,
  descr_step character varying(255) NOT NULL,
  pgm_richiamato character varying(4096) DEFAULT NULL,
  tipo_pgm character varying(50) DEFAULT NULL,
  start_elab timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  end_elab timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  tipo_elab character varying(1) NOT NULL DEFAULT 'N',
  return_code integer DEFAULT NULL,
  msg character varying(4000) DEFAULT NULL
);

CREATE UNIQUE INDEX idx_sc_step ON batch.sc_step(id_sched,id_catena,id_step,start_elab);


