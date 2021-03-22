-- Dump della struttura di tabella mradmysqldb.sched_elaborazione
DROP TABLE IF EXISTS `sched_elaborazione`;
CREATE TABLE IF NOT EXISTS `sched_elaborazione` (
  `id_elab` int(11) NOT NULL AUTO_INCREMENT,
  `id_catena` int(11) NOT NULL,
  `id_elab_prec` int(11) DEFAULT NULL,
  `id_step` int(11) NOT NULL,
  `pgm_name` varchar(4096) NOT NULL,
  `elab_name` varchar(4096) NOT NULL,
  `elab_mode` char(1) NOT NULL,
  `start_elab` timestamp NULL DEFAULT NULL,
  `end_elab` timestamp NULL DEFAULT NULL,
  `max_error_level` int(11) NOT NULL,
  `n_record_elab` int(11) NOT NULL,
  `n_trans_elab` int(11) NOT NULL,
  `return_code` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_elab`,`id_catena`,`id_step`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;

-- Dump della struttura di tabella mradmysqldb.sched_elaborazione_log
DROP TABLE IF EXISTS `sched_elaborazione_log`;
CREATE TABLE IF NOT EXISTS `sched_elaborazione_log` (
  `id_elab` int(11) NOT NULL,
  `id_catena` int(11) NOT NULL,
  `id_step` int(11) DEFAULT NULL,
  `prog_msg` int(11) NOT NULL,
  `tipo_msg` varchar(20) NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `liv_attivo` int(11) NOT NULL,
  `dato_elab` varchar(4000) DEFAULT NULL,
  `msg` varchar(4000) NOT NULL,
  `proc_gen_error` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_elab`,`id_catena`,`prog_msg`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

