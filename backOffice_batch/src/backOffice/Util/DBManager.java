package backOffice.Util;

import java.io.File;
import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;
import java.util.Locale;
import java.util.Scanner;

/**
 * Classe che gestisce le operazioni verso il DB 
 */
public class DBManager {
	
	public Connection conn;
	private int ElabId;
	private int IDCatena;
	private int IDStep;
	private int ProgId;
	private int MaxErrorLevel;
	private int RecordElab;
	
	/**
	 * Metodo che restituisce i record elaborati nella lavorazione precedente
	 * @return	Numero di record elaborati
	 */
	public int getRecordElab() {
		return RecordElab;
	}
	/**
	 * Metodo che restituisce l'ElabID
	 * @return	Restituisce un intero del ElabID
	 */
	public int getElabId() {
		return ElabId;
	}
	
	/**
	 * Metodo che imposta l'ElabID
	 * @param elabId	ElabID numerico da impostare
	 */
	public void setElabId(int elabId) {
		ElabId = elabId;
	}
	

	private int ElabIdPrec;

	public static final int MAX_ERRROR_LEVEL_OK = 1;
	public static final int MAX_ERRROR_LEVEL_WARNING = 2;
	public static final int MAX_ERRROR_LEVEL_ERROR = 3;

	public static final int LIV_ATTIVO_INFO = MAX_ERRROR_LEVEL_OK;
	public static final int LIV_ATTIVO_WARNING = MAX_ERRROR_LEVEL_WARNING;
	public static final int LIV_ATTIVO_ERROR = MAX_ERRROR_LEVEL_ERROR;
	
	public static final int RETURN_CODE_ABORTED = -8;
	public static final int RETURN_CODE_COMPLETED = 0;
	public static final int RETURN_CODE_WARNING =  8;
	public static final int RETURN_CODE_ERROR = 16;
	
	
	/**
	 * Costruttore del DBManager
	 * @param cm			Oggetto ConfigManager
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public DBManager(ConfigManager cm) throws Exception
	{		
		
		String DBClass = cm.getElement(backOffice.Constants.DBClass);
		String Conn = cm.getElement(backOffice.Constants.Conn);
		String User = cm.getElement(backOffice.Constants.Usr);		
		String Psw = cm.getElement(backOffice.Constants.Psw);
		
		ElabId=-1;
		ProgId=1;
		MaxErrorLevel=MAX_ERRROR_LEVEL_OK;
		RecordElab=0;
		ElabIdPrec=-1;
		conn = null;
		try {
			Class.forName(DBClass);
		} catch (ClassNotFoundException e) {
			System.err.println("Cass.forName Error: " + e.getMessage());
			throw e;
		}
		try {
			conn = DriverManager.getConnection(Conn,User, Psw);
		} catch (SQLException e) {
			System.err.println("Connection Error: " + e.getMessage());
			throw e;
		}
	}
	
	/**
	 * Metodo che chiude la connessione al DB
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void CloseConnection() throws Exception
	{
		try {
			conn.close();
		} catch (SQLException e) {
			System.err.println("Connection Error: " + e.getMessage());
			throw e;
		}
	}
	
	/**
	 * Metodo che inizializza l'elaborazione su tabelle di log
	 * @param cm			Oggetto ConfigManager  
	 * @param ProcessName		Nome del processo da loggare (elaborazione.pgm_name)
	 * @param ProcessNameDetail	Dettaglio del nome del processo da loggare (elaborazione.elab_name)	 * 
	 * @return				Restituisce 0 se tutto ok, -1 in caso di errore
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public int StartElaboration(ConfigManager cm, String ProcessName, String ProcessNameDetail) throws Exception
	{
		 try {
			String Mode=cm.getElement(backOffice.Constants.RunMode);
			int nTransElab=0;
			try 
			{
				nTransElab=Integer.parseInt(cm.GetFatherXmlNodeAttribute(backOffice.Constants.Commit));
			}
			catch (Exception ex)
			{			
			}
			String ElabName=ProcessNameDetail;
			int IDCatena=Integer.parseInt(cm.getElement(backOffice.Constants.IDCatena));
			int IDStep=Integer.parseInt(cm.getElement(backOffice.Constants.IDStep));
			int IDElab;
			if ( cm.getElement(backOffice.Constants.IDElab).length()!=0 )
			{
				IDElab=Integer.parseInt(cm.getElement(backOffice.Constants.IDElab));
			}
			else
			{
				IDElab=-1;
			}	
			String LogMessage="";
			boolean PrecInError=false;
			boolean PrecInProgress=false;
			PreparedStatement psSelectPrec =  conn.prepareStatement(cm.getElement(backOffice.Constants.PREC_ELAB));
			psSelectPrec.setString(1, ProcessName);//pgm_name
			psSelectPrec.setString(2, ElabName);//elab_name
			ResultSet rs = psSelectPrec.executeQuery();
			int ReturnCode;
			Timestamp EndElab=new Timestamp(0);
			if (rs.next())
			{
				ElabIdPrec=rs.getInt(2);
			    ReturnCode=rs.getInt(3);
			    EndElab =rs.getTimestamp(4);
			    if (ReturnCode==16)
			    {
			    	PrecInError=true;
					RecordElab = rs.getInt(1);
			    }
			    else if (EndElab==null)
			    {
			    	PrecInProgress=true;
			    }
			}	
			rs.close();
			rs=null;				
			boolean DoError=false;
			if (PrecInProgress)
			{
				LogMessage="Esiste un'altra elaborazione in corso!";
				DoError=true;
			}
			else if ( (PrecInError) && (!Mode.equals("R") ) )
				
			{
				LogMessage="Esiste un'altra elaborazione in errore!";
				DoError=true;
			}
			else if ( (!PrecInError) && (Mode.equals("R")) )
			{
				LogMessage="Impossibile eseguire la modalità Retry, non esiste precedente elaborazione in errore!";
				DoError=true;				
			}
			String sInsertStartElab=cm.getElement(backOffice.Constants.INSERT_START_ELAB);
			if (IDElab==-1)
			{
				sInsertStartElab=cm.getElement(backOffice.Constants.INSERT_START_ELAB_NO_ID_ELAB);	
			}
			PreparedStatement psInsert = conn.prepareStatement(sInsertStartElab,PreparedStatement.RETURN_GENERATED_KEYS);			
			psInsert.setInt(1, IDCatena);//id_catena
			this.IDCatena=IDCatena;
			if (ElabIdPrec==-1)
			{
				psInsert.setNull(2, Types.INTEGER);//id_elab_prec
			}
			else
			{
				psInsert.setInt(2, ElabIdPrec);//id_elab_prec
			}
			psInsert.setInt(3, IDStep);//id_step
			this.IDStep=IDStep;
			psInsert.setString(4, ProcessName);//pgm_name
			psInsert.setString(5, ElabName);
			psInsert.setString(6, Mode);//elab_mode
			psInsert.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));//start_elab			
			if (!DoError) 
			{
				psInsert.setNull(8, Types.TIMESTAMP);//end_elab
				psInsert.setInt(9,MAX_ERRROR_LEVEL_OK);//max_error_level
				psInsert.setNull(12,Types.INTEGER);//return_code		
			}
			else 
			{
				psInsert.setTimestamp(8, Timestamp.valueOf(LocalDateTime.now()));//end_elab
				psInsert.setInt(9,MAX_ERRROR_LEVEL_ERROR);//max_error_level
				psInsert.setInt(12,RETURN_CODE_ABORTED);//return_code				
			}			
			psInsert.setInt(10,RecordElab);//n_record_elab
			psInsert.setInt(11,nTransElab);//n_trans_elab
			if (IDElab!=-1)
			{
				psInsert.setInt(13,IDElab);//ID_ELAB
			}
			int row = psInsert.executeUpdate();
			ResultSet keyResultSet = psInsert.getGeneratedKeys();			
		    if (keyResultSet.next()) {
		    	ElabId = (int) keyResultSet.getInt(1);	
		    }		 			
		    this.InsertElaboration(LIV_ATTIVO_INFO, "Elaborazione iniziata", cm);		    
			if (DoError)  
			{
				this.InsertElaboration(LIV_ATTIVO_ERROR, LogMessage, cm);
				return -1;
			}
			
			psInsert.close();
			psInsert=null;		
			
		} catch (SQLException e) {
			System.err.println("Errore in inserimento: " + e.getMessage());
			throw e;
		}
		 return 0;		 
	}
	
	/**
	 * Metodo che chiude l'elaborazione su tabelle di log
	 * @param ReturnCode	16: errore (necessita restart a R), -8: abort, 8: warning e 0: ok
	 * @param cm			Contiene l'oggetto ConfigManager 
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */	
	public void EndElaboration(int ReturnCode,ConfigManager cm) throws Exception
	{		
		if ((ReturnCode==RETURN_CODE_ABORTED) ||
			(ReturnCode==RETURN_CODE_ERROR))
		{
			MaxErrorLevel=MAX_ERRROR_LEVEL_ERROR;
			this.InsertElaboration(LIV_ATTIVO_INFO, "Elaborazione completata in errore",cm);
		}
		else
		{
			this.InsertElaboration(LIV_ATTIVO_INFO, "Elaborazione completata con successo", cm);
		}
		PreparedStatement psUpdate;
		try {			
			psUpdate = conn.prepareStatement(cm.getElement(backOffice.Constants.UPDATE_END_ELAB));
			psUpdate.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));//end_elab			
			psUpdate.setInt(2,MaxErrorLevel);//max_error_level
			psUpdate.setInt(3, ReturnCode);//return_code
			psUpdate.setInt(4, this.ElabId);//id_elab
			psUpdate.executeUpdate();
			psUpdate.close();
			psUpdate=null;
		} catch (SQLException e) {
			System.err.println("Update Error: " + e.getMessage());
			throw e;
		}			
	}
	
	/**
	 * Metodo che inserisce una riga di log nella tabella di dettaglio
	 * @param Type			1: INFO, 2: WARNING e 3: ERRORE
	 * @param Message		Contente il messaggio d'errore
	 * @param cm			Contiene l'oggetto ConfigManager
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void InsertElaboration(int Type, String Message,ConfigManager cm) throws Exception
	{
		String sTipoMsg="INFO";
		if (Type == LIV_ATTIVO_WARNING)
		{
			sTipoMsg="WARNING";
		}
		else if(Type == LIV_ATTIVO_ERROR)
		{
			sTipoMsg="ERROR";
		}
		CheckMaxErrorLevel(Type);
		PreparedStatement psInsert;
		try {			
            psInsert = conn.prepareStatement(cm.getElement(backOffice.Constants.INSERT_ELAB_LOG));
			psInsert.setInt(1, ElabId);//id_elab
			psInsert.setInt(2, IDCatena);//id_catena
			psInsert.setInt(3, ProgId++);//prog_msg
			psInsert.setString(4, sTipoMsg);//tipo_msg
			psInsert.setInt(5, Type);//liv_attivo		
			psInsert.setString(6, Message);//tipo_msg
			psInsert.setInt(7, IDStep);//ID_STEP
			psInsert.executeUpdate();
			psInsert.close();
			psInsert=null;			
		} catch (SQLException e) {
			System.err.println("Insert Error: " + e.getMessage());
			throw e;
		}			
	}
	
	/**
	 * Metodo chiamato per impostare n_record_elab su tabella di dettaglio log
	 * @param NRows			Il numero di record aggiornati
	 * @param cm			Contiene l'oggetto ConfigManager 
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void UpdateNRecordsElab(int NRows,ConfigManager cm)throws Exception
	{
		PreparedStatement psUpdate;
		try {			
            psUpdate = conn.prepareStatement(cm.getElement(backOffice.Constants.UPDATE_RECORDS));
            psUpdate.setInt(1, NRows);//n_record_elab
			psUpdate.setInt(2, ElabId);//id_elab
			psUpdate.executeUpdate();
			psUpdate.close();
			psUpdate=null;			
		} catch (SQLException e) {
			System.err.println("Insert Error: " + e.getMessage());
			throw e;
		}
	}
	
	/**
	 * Metodo che aggiorna il MaxErrorLevel ma solo internamente, la variabile verrà poi utilizzata nella chiusura dell'elaborazione
	 * @param ErrorLevel	1: INFO, 2: WARNING e 3: ERRORE
	 */
	public void CheckMaxErrorLevel(int ErrorLevel)
	{
		if (ErrorLevel>this.MaxErrorLevel)
		{
			this.MaxErrorLevel=ErrorLevel;
		}
	}
	
	/**
	 * Metodo che restituisce il risultato di una query in una stringa dove le righe sono distinte da degli invio
	 * @param Query			Query da eseguire
	 * @return				Ritorna la stringa con il risultato della query
	 * @throws Exception	Restituisce Exception verso l'esterno
	 */
	public String DoQuery(String Query) throws Exception
	{
		String sTmpRes="";
		Statement stmtSelect=this.conn.createStatement();
		ResultSet rs=stmtSelect.executeQuery(Query);
		while (rs.next()) {
			sTmpRes=sTmpRes+rs.getString(1)+"\n";			
		}
		sTmpRes=sTmpRes.substring(0,sTmpRes.length()-1);
		rs.close();
		rs=null;
		stmtSelect.close();
		stmtSelect=null;
	
		return sTmpRes;
	}
	
	/**
	 * Metodo che esegue un qualsiasi comando SQL (insert, update, ecc) fornito in input
	 * @param SQLCommand		Comando SQL da eseguire
	 * @throws Exception		Eccezione gestita dall'esterno
	 */
	public void DoCommand(String SQLCommand) throws Exception
	{
		Statement stmtSelect=this.conn.createStatement();
		stmtSelect.executeUpdate(SQLCommand);
		stmtSelect.close();
		stmtSelect=null;			
	}

}
