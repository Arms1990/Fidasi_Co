package backOffice.Loader;

import java.io.File;
import java.util.Hashtable;

import backOffice.*;
import backOffice.Util.*;

/**
 * Classe Main del Loader, orchestra tutte le classi che servono al Loader per caricare i dati in tabella
 */
public class Main {
	
	int SystemError; 

	public static final int IDX_PROP_FILE = 0;
	public static final int IDX_XML_FILE = 1;
	public static final int IDX_CSV_FILE = 2;
	public static final int IDX_RUN_MODE = 3;
	public static final int IDX_TAB_NAME = 4;
	public static final int IDX_TRUNC_TAB = 5;
	public static final int IDX_ID_CATENA = 6;
	public static final int IDX_ID_STEP = 7;
	public static final int IDX_ID_ELAB = 8;
	
	/**
	 * Costruttore della classe Main
	 * @param args			I parametri vengono passati dall'esterno 
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public Main(String [] args) throws Exception
	{
		this.PrintAppName();
		SystemError=CheckInputs(args);
		
		if (SystemError==-1)
		{			
			throw new Exception("Parametri non validi");
		}
		try {
			System.out.println("In fase di elaborazione...");
			Hashtable<String,String> InputElements = new Hashtable<String,String>();			
			InputElements.put(backOffice.Constants.RunMode, args[Main.IDX_RUN_MODE]);
			InputElements.put(backOffice.Constants.FatherXmlNodeName, args[Main.IDX_TAB_NAME]);
			InputElements.put(backOffice.Constants.TruncateTab, args[Main.IDX_TRUNC_TAB]);
			InputElements.put(backOffice.Constants.IDCatena, args[Main.IDX_ID_CATENA]);
			InputElements.put(backOffice.Constants.IDStep, args[Main.IDX_ID_STEP]);
			String IDElab = "";
			if ( args.length==9 )
			{
				IDElab=args[Main.IDX_ID_ELAB];
			}			
			InputElements.put(backOffice.Constants.IDElab, IDElab);
			
			ConfigManager cm = new ConfigManager(args[Main.IDX_PROP_FILE], 
					args[Main.IDX_XML_FILE], args[Main.IDX_CSV_FILE], InputElements);
			DBManager dbm=null;
			LogManager lm =null;
			/**
			 * Istanzio connettore del DB utilizzando le info presenti nel ConfigManager
			 */
			dbm = new DBManager(cm);
			/**
			 * Istanzio Log Manager 
			 */
			lm = new LogManager();
			/**
			 * Inizializzo l'elaborazione (file di log+inserimenti a DB) 
			 */
			if ( lm.startElab(dbm, cm, "backOffice.Loader",cm.getCsvFile(false))==0 )
			{
				try
				{
					/**
					 * Carico il file CSV di input passando l'oggetto Config Manager, Log Manager e gli args
					 */
					new DBMUtil(dbm).LoadCsv(cm, lm, args);
					/**
					 * Chiudo l'elaborazione in OK (file di log+DB)
					 */
					lm.EndElab(dbm, LogManager.CLOSE_OK, "", cm);
				} 
				catch (Exception e) {
					try {
						e.printStackTrace();
						/**
						 * Chiudo l'elaborazione in errore (file di log+DB)
						 */
						lm.EndElab(dbm,LogManager.CLOSE_ERROR, e.getMessage(), cm);
					} catch (Exception e1) {
						e1.printStackTrace();
					}
				}
			}
			else
			{
				throw new Exception("Errore nella gestione dei dati del DB");
			}
    		dbm.CloseConnection();
		}
		catch (Exception e1) {
			throw e1;			
		}
		System.out.println("Elaborazione conclusa...");
	}
	
	/**
	 * Metodo che stampa il nome del Loader a schermo
	 */
	private void PrintAppName()
	{
		System.out.println("--== BackOffice.Loader v0.5b ==--");
	}
	
	/**
	 * Metodo che controlla se gli input passati sono validi
	 */
	private int CheckInputs(String [] args)
	{		
		String [] params = new String[9];
		params[Main.IDX_PROP_FILE]="Parametro 2) File di properties";
		params[Main.IDX_XML_FILE]="Parametro 3) File descrittore di tabella XML";
		params[Main.IDX_CSV_FILE]="Parametro 4) File di input CSV";
		params[Main.IDX_RUN_MODE]="Parametro 5) Modalit� lancio (N/R)";
		params[Main.IDX_TAB_NAME]="Parametro 6) Nome tabella";
		params[Main.IDX_TRUNC_TAB]="Parametro 7) Svuotamento tabella (S/N)";
		params[Main.IDX_ID_CATENA]="Parametro 8) ID_CATENA";
		params[Main.IDX_ID_STEP]="Parametro 9) ID_STEP";
		params[Main.IDX_ID_ELAB]="Parametro 10) ID_ELAB (se non inserito verra' autogenerato)";
		if ( args.length < 8 )
		{
			System.out.println("Parametri insufficienti, prego specificare:");
			return backOffice.Util.Checker.PrintParameters(params,null);
		}
		String [] paramsBefore=params.clone();
		
		params[Main.IDX_PROP_FILE]=params[Main.IDX_PROP_FILE]+Checker.CheckFileExist(args[Main.IDX_PROP_FILE]);
		params[Main.IDX_XML_FILE]=params[Main.IDX_XML_FILE]+Checker.CheckFileExist(args[Main.IDX_XML_FILE]);
		params[Main.IDX_CSV_FILE]=params[Main.IDX_CSV_FILE]+Checker.CheckFileExist(args[Main.IDX_CSV_FILE]);		
		params[Main.IDX_RUN_MODE]=params[Main.IDX_RUN_MODE]+Checker.CheckValidValues(
				args[Main.IDX_RUN_MODE],new String[] {"N", "R"});
		params[Main.IDX_TAB_NAME]=params[Main.IDX_TAB_NAME]+Checker.CheckIfNOTNumber(args[Main.IDX_TAB_NAME]);
		params[Main.IDX_TRUNC_TAB]=params[Main.IDX_TRUNC_TAB]+Checker.CheckValidValues(
				args[Main.IDX_TRUNC_TAB],new String[] {"S", "N"});		
		/* AC/mrad inserito commento al codice per usare tipo elaborazione a N
		if (params[Main.IDX_TRUNC_TAB].equals(paramsBefore[Main.IDX_TRUNC_TAB]))
		{
			params[Main.IDX_TRUNC_TAB]=params[Main.IDX_TRUNC_TAB]+Checker.CheckValidRelationValues(
					args[Main.IDX_TRUNC_TAB],new String[] {"S", "N"},
					args[Main.IDX_RUN_MODE],new String[] {"N", "R"},
					"Modalit� lancio"
					);		
		}
		*/
		params[Main.IDX_ID_CATENA]=params[Main.IDX_ID_CATENA]+Checker.CheckIfNumber(args[Main.IDX_ID_CATENA]);
		params[Main.IDX_ID_STEP]=params[Main.IDX_ID_STEP]+Checker.CheckIfNumber(args[Main.IDX_ID_STEP]);
		if (args.length==9)
		{
			params[Main.IDX_ID_ELAB]=params[Main.IDX_ID_ELAB]+Checker.CheckIfNumber(args[Main.IDX_ID_ELAB]);
		}
		
		return backOffice.Util.Checker.PrintParameters(params,paramsBefore);
	}
	

}
