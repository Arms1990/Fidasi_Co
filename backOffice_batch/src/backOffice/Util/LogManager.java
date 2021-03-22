package backOffice.Util;

import org.apache.log4j.Logger;


/**
 * Classe che gestisce i Log sia su file (attraverso log4j) sia su DB 
 */
public class LogManager {
	final static Logger logger=Logger.getLogger(LogManager.class);
	private DBManager dbm;
	public static final int CLOSE_ABORTED = -8;
	public static final int CLOSE_OK=0;
	public static final int CLOSE_WARNING =  8;
	public static final int CLOSE_ERROR = 16;	

	
	public static final int INFO=1;
	public static final int WARNING=1;
	public static final int ERROR=2;
	
	public String ProcessName;
	
	/**
	 * Costruttore del LogManager
	 */
	public LogManager()
	{
	}
	
	/**
	 * Metodo chiamato per inizializzare l'elaborazione
	 * @param dbm           	Oggetto DBManager, se nullo non salva su DB
	 * @param cm				Oggetto ConfigManager
	 * @param ProcessName		Nome del processo da loggare (elaborazione.pgm_name)
	 * @param ProcessNameDetail	Dettaglio del nome del processo da loggare (elaborazione.elab_name)
	 * @return					Restituisce 0 se tutto ok, -1 in caso di errore 
	 * @throws Exception		Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public int startElab(DBManager dbm, ConfigManager cm, String ProcessName, String ProcessNameDetail) throws Exception
	{
		this.ProcessName=ProcessName;
		logger.debug(ProcessName+": Elaboratione iniziata");
		if (dbm != null) 
		{
			if ( dbm.StartElaboration(cm,ProcessName, ProcessNameDetail)!=0)  
			{
				logger.error(ProcessName+": Elaboration abortita");
				return -1;
			}
		}		
		return 0;
	}
	
	/**
	 * Metodo che chiude l'elaborazione su tabelle di log
	 * @param dbm           Oggetto DBManager, se nullo non salva su DB
	 * @param CloseType		16: errore (necessita restart a R), -8: abort, 8: warning e 0: ok 
	 * @param Info4File		Messaggio d'errore aggiuntivo per il file di log
	 * @param cm			Contiene l'oggetto ConfigManager
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void EndElab(DBManager dbm, int CloseType, String Info4File, ConfigManager cm) throws Exception
	{
		if (CloseType==CLOSE_OK)
		{
			if ( logger.isDebugEnabled() )
			{
				logger.debug(ProcessName+": Elaboration terminata con successo. "+Info4File);
			}
		
		}
		else if (CloseType==CLOSE_ABORTED)
		{
			if ( logger.isDebugEnabled() )
			logger.debug(ProcessName+": Elaboration abortita."+Info4File);
		}
		else
		{
			logger.debug(ProcessName+": Elaboration in errore."+Info4File);
		}
		if (dbm != null) 
		{
			dbm.EndElaboration(CloseType, cm);
		}		
	}
	
	/**
	 * Metodo che inserisce una riga di log su file e tabella dettaglio
	 * @param dbm           Oggetto DBManager, se nullo non salva su DB
	 * @param Type			1: INFO, 2: WARNING e 3: ERROR
	 * @param Message		Messaggio di log
	 * @param cm			Contiene l'oggetto ConfigManager
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void Insert(DBManager dbm, int Type, String Message,ConfigManager cm) throws Exception
	{
		if ( (logger.isDebugEnabled()) && (
					(Type == INFO) ||
					(Type == WARNING))
				)
		{
			logger.debug(Message);
		}
		
		if (Type == ERROR)
		{
			logger.error(Message);
		}
		if (dbm != null) 
		{
			dbm.InsertElaboration(Type, Message, cm);
		}			
	}
}
