package backOffice.Extractor;

import java.io.File;
import java.util.Hashtable;

import backOffice.Util.Checker;
import backOffice.Util.ConfigManager;
import backOffice.Util.DBManager;
import backOffice.Util.LogManager;

/**
 * Classe main dell'estrattore di csv 
 */
public class Main {
	
	int SystemError; 
	public static final int IDX_PROP_FILE = 0;
	public static final int IDX_XML_FILE = 1;
	public static final int IDX_ID_EXTRACTION = 2;
	public static final int IDX_CSV_FILE = 3;
	public static final int IDX_ID_CATENA = 4;
	public static final int IDX_ID_STEP = 5;
	public static final int IDX_ID_ELAB = 6;

	/**
	 * Costruttore del Main dell'estrattore csv
	 * @param args			Argomenti passati da riga di comando
	 * @throws Exception	Restituisce l'eccezione verso l'esterno
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
			InputElements.put(backOffice.Constants.RunMode, "N");
			InputElements.put(backOffice.Constants.FatherXmlNodeName, args[Main.IDX_ID_EXTRACTION]);
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
			if ( lm.startElab(dbm, cm, "backOffice.Extractor",cm.getCsvFile(false))==0 )
			{
				try
				{
					/**
					 * Carico il file CSV di input passando l'oggetto Config Manager, Log Manager e gli args
					 */
					new DBMUtil(dbm).ExtractCsv(cm, lm, args);
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
	 * Metodo che stampa il nome del Extractor a schermo
	 */
	private void PrintAppName()
	{
		System.out.println("--== BackOffice.Extractor v0.5b ==--");
	}

	/**
	 * Metodo che controlla se gli input passati sono validi
	 */	
	private int CheckInputs(String [] args)
	{
		String [] params = new String[7];
		params[Main.IDX_PROP_FILE]="Parametro 2) File di properties";
		params[Main.IDX_XML_FILE]="Parametro 3) File XML";
		params[Main.IDX_ID_EXTRACTION]="Parametro 4) Identificativo tag XML";
		params[Main.IDX_CSV_FILE]="Parametro 5) File di output CSV";
		params[Main.IDX_ID_CATENA]="Parametro 6) ID_CATENA";
		params[Main.IDX_ID_STEP]="Parametro 7) ID_STEP";
		params[Main.IDX_ID_ELAB]="Parametro 8) ID_ELAB (se non inserito verra' autogenerato)";
		if ( args.length < 6 )
		{
			System.out.println("Parametri insufficienti, prego specificare:");
			return backOffice.Util.Checker.PrintParameters(params,null);
		}
		String [] paramsBefore=params.clone();
		
		params[Main.IDX_PROP_FILE]=params[Main.IDX_PROP_FILE]+Checker.CheckFileExist(args[Main.IDX_PROP_FILE]);
		params[Main.IDX_XML_FILE]=params[Main.IDX_XML_FILE]+Checker.CheckFileExist(args[Main.IDX_XML_FILE]);
		params[Main.IDX_ID_EXTRACTION]=params[Main.IDX_ID_EXTRACTION]+Checker.CheckIfNOTNumber(args[Main.IDX_ID_EXTRACTION]);
		params[Main.IDX_CSV_FILE]=params[Main.IDX_CSV_FILE]+Checker.CheckPathExistFromFile(
				args[Main.IDX_CSV_FILE]);		
		params[Main.IDX_ID_CATENA]=params[Main.IDX_ID_CATENA]+Checker.CheckIfNumber(args[Main.IDX_ID_CATENA]);
		params[Main.IDX_ID_STEP]=params[Main.IDX_ID_STEP]+Checker.CheckIfNumber(args[Main.IDX_ID_STEP]);
		if (args.length==7)
		{
			params[Main.IDX_ID_ELAB]=params[Main.IDX_ID_ELAB]+Checker.CheckIfNumber(args[Main.IDX_ID_ELAB]);
		}
		
		
		return backOffice.Util.Checker.PrintParameters(params,paramsBefore);
	}		

}
