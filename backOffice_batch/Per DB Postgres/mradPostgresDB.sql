CREATE SEQUENCE batch.seq_sched_elaborazione
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

--drop table batch.sched_elaborazione;
CREATE TABLE batch.sched_elaborazione (
  id_elab integer NOT NULL DEFAULT nextval('batch.seq_sched_elaborazione'::regclass),
  id_catena integer NOT NULL,
  id_elab_prec integer DEFAULT NULL,
  id_step integer NOT NULL,
  pgm_name character varying(4096) NOT NULL,
  elab_name character varying(4096) NOT NULL,
  elab_mode character(1) NOT NULL,
  start_elab timestamp with time zone DEFAULT NULL,
  end_elab timestamp with time zone DEFAULT NULL,
  max_error_level integer NOT NULL,
  n_record_elab integer NOT NULL,
  n_trans_elab integer NOT NULL,
  return_code integer DEFAULT NULL,
  CONSTRAINT PK_sched_elaborazione PRIMARY KEY (id_elab,id_catena,id_step)
);

  
--drop table batch.sched_elaborazione_log;
CREATE TABLE batch.sched_elaborazione_log (
  id_elab integer NOT NULL,
  id_catena integer NOT NULL,
  id_step integer NOT NULL,
  prog_msg character varying(4096) NOT NULL,
  tipo_msg character varying(20) NOT NULL,
  time_stamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  liv_attivo integer,
  dato_elab character varying(4000) DEFAULT NULL,
  msg character varying(4000) NOT NULL,
  proc_gen_error character varying(50) DEFAULT NULL,
  CONSTRAINT PK_sched_elaborazione_log PRIMARY KEY (id_elab,id_catena,prog_msg)
);

