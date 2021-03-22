package backOffice.Mail;

import java.io.File;
import java.util.Hashtable;

import backOffice.Util.*;

/**
 * Classe che invia mail
 *
 */
public class Main {
	
	int SystemError; 
	public static final int IDX_PROP_FILE = 0;
	public static final int IDX_XML_FILE = 1;
	public static final int IDX_MAIL_TYPE = 2;
	public static final int IDX_ID_CATENA = 3;
	public static final int IDX_ID_STEP = 4;
	public static final int IDX_MIN_ID_ELAB_OR_ATTACHMENT = 5;

	/**
	 * Costruttore del Main 
	 * @param args			Parametri di input
	 * @throws Exception	Eccezione inviata verso il chiamante
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
			InputElements.put(backOffice.Constants.FatherXmlNodeName, args[Main.IDX_MAIL_TYPE]);
			InputElements.put(backOffice.Constants.IDCatena, args[Main.IDX_ID_CATENA]);
			InputElements.put(backOffice.Constants.IDStep, args[Main.IDX_ID_STEP]);
			String IDElab = "";
			int iAttachmentBegin=-1;
			if ( args.length>=5 )
			{
				for (int i=5;i<args.length;i++)
				{
					if ( Checker.CheckIfNumber(args[i]).length()==0) 
					{
						IDElab=args[i];		
						if (iAttachmentBegin!=-1)
						{
							break;
						}
					}
					if ( Checker.CheckFileExist(args[i]).length()==0)
					{
						iAttachmentBegin=i;
						if (IDElab.length()!=0)
						{
							break;
						}
					}
				}				
			}
			InputElements.put(backOffice.Constants.IDElab, IDElab);
			ConfigManager cm = new ConfigManager(args[Main.IDX_PROP_FILE], 
					args[Main.IDX_XML_FILE], null, InputElements);
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
			if ( lm.startElab(dbm, cm, "backOffice.Mail",cm.getElement(backOffice.Constants.FatherXmlNodeName))==0 )
			{
				try
				{
					new backOffice.Mail.Util(cm,dbm,args,iAttachmentBegin);

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
		System.out.println("--== BackOffice.Mail v0.2b ==--");
	}
	
	/**
	 * Metodo che controlla se gli input passati sono validi
	 */	
	private int CheckInputs(String [] args)
	{
		String [] params = new String[6];
		params[Main.IDX_PROP_FILE]="Parametro 2) File di properties";
		params[Main.IDX_XML_FILE]="Parametro 3) File XML";
		params[Main.IDX_MAIL_TYPE]="Parametro 4) Identificativo tag XML";
		params[Main.IDX_ID_CATENA]="Parametro 5) ID_CATENA";
		params[Main.IDX_ID_STEP]="Parametro 6) ID_STEP";
		params[Main.IDX_MIN_ID_ELAB_OR_ATTACHMENT]="Parametro 7..N) ID_ELAB o Attachment";
		if ( args.length < 5 )
		{
			System.out.println("Parametri insufficienti, prego specificare:");
			return backOffice.Util.Checker.PrintParameters(params,null);
		}
		String [] paramsBefore=params.clone();
		
		params[Main.IDX_PROP_FILE]=params[Main.IDX_PROP_FILE]+Checker.CheckFileExist(args[Main.IDX_PROP_FILE]);
		params[Main.IDX_XML_FILE]=params[Main.IDX_XML_FILE]+Checker.CheckFileExist(args[Main.IDX_XML_FILE]);
		params[Main.IDX_MAIL_TYPE]=params[Main.IDX_MAIL_TYPE]+Checker.CheckIfNOTNumber(args[Main.IDX_MAIL_TYPE]);
		params[Main.IDX_ID_CATENA]=params[Main.IDX_ID_CATENA]+Checker.CheckIfNumber(args[Main.IDX_ID_CATENA]);
		params[Main.IDX_ID_STEP]=params[Main.IDX_ID_STEP]+Checker.CheckIfNumber(args[Main.IDX_ID_STEP]);
		if (args.length>=5)
		{
			for (int i=5;i<args.length;i++)
			{
				params[Main.IDX_MIN_ID_ELAB_OR_ATTACHMENT]=params[Main.IDX_MIN_ID_ELAB_OR_ATTACHMENT]+
						Checker.CheckFileExistORIfNumber(args[i]);
			}
		}
		
		
		return backOffice.Util.Checker.PrintParameters(params,paramsBefore);
	}		

}
