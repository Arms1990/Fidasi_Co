package backOffice.Extractor;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import backOffice.Util.*;

public class DBMUtil {
	
	private DBManager dbm;	

	/**
	 * Costruttore del DBMUtil 
	 * @param dbm		Oggetto DBManager 
	 */
	public DBMUtil(DBManager dbm)
	{
		this.dbm=dbm;
	}	
	
	/**
	 * Metodoc che estrare i risultati di una query in un CSV
	 * @param cm			Oggetto ConfigManager
	 * @param lm			Oggetto LogManager
	 * @param StaticValues	Array di stringhe contenente i valori statici passati dall'esterno 
	 * @throws Exception	Eccezione rimandata al chiamante
	 */
	public void ExtractCsv(ConfigManager cm, LogManager lm, String [] StaticValues) throws Exception
	{
		try {
			
			String AllSqlFile=cm.getChildValuebyName("query");			
			File fout = new File(cm.getCsvFile(true));
			FileOutputStream fos = new FileOutputStream(fout);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
			for (int i=0;i<StaticValues.length;i++)
			{
				AllSqlFile=AllSqlFile.replace("#ARGUMENT_"+Integer.toString(i)+"#", StaticValues[i]);
			}
			int index=0;
			while (cm.getElement("ConnectionVariable"+Integer.toString(index))!=null)
			{
				dbm.conn.createStatement().executeUpdate(cm.getElement("ConnectionVariable"+Integer.toString(index)));
				index++;
			}			
			Statement stmtSelect=dbm.conn.createStatement();
			ResultSet rs=stmtSelect.executeQuery(AllSqlFile);
			while (rs.next()) {
				bw.write(rs.getString(1));
				bw.newLine();
			}
			rs.close();
			rs=null;
			bw.close();
			bw=null;
      	    dbm.InsertElaboration(DBManager.LIV_ATTIVO_INFO, "Elaborazione completata con successo", cm);
		} catch (Exception e) {
      	    dbm.InsertElaboration(DBManager.LIV_ATTIVO_ERROR, "Elaborazione in errore: "+e.getMessage(), cm);
      	    throw e;
		}
		
	}

}
