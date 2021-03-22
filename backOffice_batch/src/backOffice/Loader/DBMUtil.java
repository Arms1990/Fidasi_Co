package backOffice.Loader;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.text.NumberFormat;
import java.util.Hashtable;
import java.util.Locale;
import java.util.Scanner;

import backOffice.Util.*;

/**
 * Classe DBMUtil, si chiama così in quanto è una casse di utilità del Loader che fa uso del oggetto DBManager
 */
public class DBMUtil {
	
	private DBManager dbm;
	private Hashtable<String,Integer> htNullFieldTrans;

	/**
	 * Costruttore del DBMUtil 
	 * @param dbm		Oggetto DBManager 
	 */
	public DBMUtil(DBManager dbm)
	{
		this.dbm=dbm;
		htNullFieldTrans = new Hashtable<String,Integer>();
		htNullFieldTrans.put("STRING", Types.VARCHAR);
		htNullFieldTrans.put("INT", Types.INTEGER);
		htNullFieldTrans.put("DECIMAL", Types.DECIMAL);
		htNullFieldTrans.put("DATE", Types.DATE);
		htNullFieldTrans.put("TIMESTAMP", Types.TIMESTAMP);		
	}
	
	/**
	 * Metodo che carica il csv di input nella tabella specificata
	 * @param cm			ConfigManager contenente tutte le info di caricamento	 
	 * @param lm			LogManager contenente l'oggetto che logga 
	 * @param StaticValues	Array di valori statici passati in input che vengono riportati in tabella
	 * @throws Exception	Ritorna qualsiasi eccezione alla procedura chiamante
	 */
	public void LoadCsv(ConfigManager cm, LogManager lm, String [] StaticValues) throws Exception
	{
		int iRow=0;
		String vSezione="";
		String line ="";
		String vSezioneColonne="";
		BufferedReader br;
		try {
			int Commit=Integer.parseInt(cm.GetFatherXmlNodeAttribute(backOffice.Constants.Commit));			
			if (cm.getElement(backOffice.Constants.TruncateTab).equals("S"))
			{				
				String sTruncate="TRUNCATE TABLE "+cm.getElement(backOffice.Constants.FatherXmlNodeName);
				Statement stTruncate = dbm.conn.createStatement();
				stTruncate.executeUpdate(sTruncate);
				stTruncate.close();
				stTruncate=null;
			}			
			String sInsert="INSERT INTO "+cm.getElement(backOffice.Constants.FatherXmlNodeName)+" VALUES (";
			int iCntCols = cm.getChildNumber();
			for (int i = 0; i<iCntCols;i++)	
			{
				sInsert=sInsert+"?,";
			}
		
			sInsert=sInsert.substring(0,sInsert.length()-1)+")";					
	        PreparedStatement psInsert = dbm.conn.prepareStatement(sInsert); 
	        dbm.conn.setAutoCommit(false);            

	        br = new BufferedReader(new FileReader(cm.getCsvFile(true)));
	        while ( (line =  br.readLine()) != null ) {
	          vSezione="Errore su getRecordElab alla riga: "+String.valueOf(iRow+1);
	          if (iRow<dbm.getRecordElab())
	          {
	        	  iRow++;
	          }
	          else
	          {
	        	  vSezione="Errore su split alla riga: "+String.valueOf(iRow+1);
	        	  String [] Col = line.split(cm.GetFatherXmlNodeAttribute(backOffice.Constants.CSVSeparator),-1);
	        	  vSezioneColonne=", colonne parsate dallo split: ";
	        	  for (int iColLog=0;iColLog<Col.length;iColLog++)
	        	  {
	        		  vSezioneColonne=vSezioneColonne+Col[iColLog]+";";
	        	  }
		          int iStruct = 0;
		          int i = 0;
		          while ( iStruct<cm.getChildNumber() )
		          {
		        	  vSezione="Info non valide per la per la colonna "+String.valueOf(iStruct+1);		        	  
		        	  String Type= cm.getChildAttributeValue(String.valueOf(iStruct), "Type");
		        	  vSezione=vSezione+": Type="+Type;
		        	  String Format=cm.getChildAttributeValue(String.valueOf(iStruct), "Format");
		        	  vSezione=vSezione+", Format="+Format;
		        	  String FieldName=cm.getChildName(String.valueOf(iStruct));
		        	  vSezione=vSezione+", FieldName="+FieldName;
	        		  String FieldValue=cm.getChildValueByPos(String.valueOf(iStruct));
	        		  vSezione=vSezione+", FieldValue="+FieldValue;
	        		  if (FieldValue.indexOf("ARGUMENT_")!=-1)
	        		  {
	        			  vSezione=vSezione+"-FieldValue="+FieldValue;
	        			  FieldValue= StaticValues[
	        			                           Integer.parseInt(FieldValue.toUpperCase().replace("ARGUMENT_", ""))];
	        			  vSezione=vSezione+",FieldValueStatico="+FieldValue;
	        		  }
	        		  else if (FieldValue.toUpperCase().equals("ID_ELAB"))
	        		  {
	        			  vSezione=vSezione+"-FieldValue="+FieldValue;	        			  
	        			  FieldValue=String.valueOf(dbm.getElabId());
	        			  vSezione=vSezione+",IDElab="+FieldValue;
	        		  }
	        		  else 
	        		  {
	        			  vSezione=vSezione+"-Colonna da csv=";
	        			  FieldValue=Col[i];
	        			  vSezione=vSezione+FieldValue;
	        			  i++;
	        		  }
	        		  
	        		  vSezione="Formato non valido alla colonna "+String.valueOf(iStruct+1)+", campo="+FieldName+", tipo="+
	        				  Type+", formato="+Format+" e valore letto in input="+FieldValue;	
	        		  
		        	  if (FieldValue.trim().length()<=0)
		        	  {
		        		  vSezione=vSezione+"-SetNull non riuscito";
		        		  psInsert.setNull(iStruct+1, htNullFieldTrans.get(Type));
		        	  }
		        	  else if (Type.toUpperCase().equals("STRING"))
		        	  {
		        		  vSezione=vSezione+"-SetString non riuscito";
		        		  psInsert.setString(iStruct+1, FieldValue);
		        	  }
		        	  else if ( (Type.toUpperCase().equals("INT")) && (Format == null))
		        	  {
		        		  vSezione=vSezione+"-SetInt non riuscito";
		        		  psInsert.setInt(iStruct+1, Integer.parseInt(FieldValue));
		        	  }
		        	  else if ( (Type.toUpperCase().equals("DECIMAL")) && (Format != null))
		        	  {
		        		  //es: Format="en-US"
		        		  vSezione=vSezione+"-Decimale non valido";
		        		  NumberFormat format = NumberFormat.getInstance(Locale.forLanguageTag(Format));
		        		  Number number = format.parse(FieldValue);	        		  
		        		  psInsert.setDouble(iStruct+1, number.doubleValue() );
		        	  }
		        	  else if (Type.toUpperCase().equals("DATE"))
		        	  {
		        		  vSezione=vSezione+"-Data non valida";
		        		  int iDDPos=Format.indexOf("DD");
		        		  int iMMPos=Format.indexOf("MM");
		        		  int iYYYYPos=Format.indexOf("YYYY");
		        		  int iYYPos=Format.indexOf("YY");	        		  
		        		  String sDay=FieldValue.substring(iDDPos,iDDPos+2);
		        		  String sMonth=FieldValue.substring(iMMPos,iMMPos+2);
		        		  String sYear;
		        		  if (iYYYYPos !=-1)
		        		  {
		        			  sYear=FieldValue.substring(iYYYYPos,iYYYYPos+4);
		        		  }
		        		  else
		        		  {
		        			  sYear=FieldValue.substring(iYYPos,iYYPos+2);
		        		  }
		        		  psInsert.setDate(iStruct+1,  java.sql.Date.valueOf(sYear+"-"+sMonth+"-"+sDay));
		        	  }	
		        	  else if (Type.toUpperCase().equals("TIMESTAMP"))
		        	  {
		        		  vSezione=vSezione+"-Timestamp non valida";
		        		  int iDDPos=Format.indexOf("DD");
		        		  int iMMPos=Format.indexOf("MM");
		        		  int iYYYYPos=Format.indexOf("YYYY");
		        		  int iYYPos=Format.indexOf("YY");
		        		  int iHHPos=Format.indexOf("HH");
		        		  int iMIPos=Format.indexOf("MI");
		        		  int iSSPos=Format.indexOf("SS");
		        		  
		        		  String sDay=FieldValue.substring(iDDPos,iDDPos+2);
		        		  String sMonth=FieldValue.substring(iMMPos,iMMPos+2);
		        		  String sYear;
		        		  if (iYYYYPos !=-1)
		        		  {
		        			  sYear=FieldValue.substring(iYYYYPos,iYYYYPos+4);
		        		  }
		        		  else
		        		  {
		        			  sYear=FieldValue.substring(iYYPos,iYYPos+2);
		        		  }
		        		  String sHour=FieldValue.substring(iHHPos,iHHPos+2);
		        		  String sMin=FieldValue.substring(iMIPos,iMIPos+2);
		        		  String sSec=FieldValue.substring(iSSPos,iSSPos+2);
		        		  
		        		  psInsert.setTimestamp(iStruct+1, java.sql.Timestamp.valueOf(sYear+"-"+sMonth+"-"+sDay+" "+sHour+":"+sMin+":"+sSec));
		        	  }
	        		  iStruct++;		        	  	        		  
		          }
		          psInsert.addBatch();
		          iRow++;
		          if (iRow % Commit == 0 )
		          {
		        	  psInsert.executeBatch();	        	  
		        	  dbm.InsertElaboration(DBManager.LIV_ATTIVO_INFO, "Eseguita commit dopo "+Integer.toString(iRow), cm);
		        	  dbm.UpdateNRecordsElab(iRow, cm);
		        	  dbm.conn.commit();
		          }
	           }
	        }
	        psInsert.executeBatch();
      	    dbm.InsertElaboration(DBManager.LIV_ATTIVO_INFO, "Eseguita commit FINALE dopo "+Integer.toString(iRow),cm);
      	    dbm.UpdateNRecordsElab(iRow, cm);
      	    dbm.conn.commit();
			psInsert.close();			
			psInsert=null;
			br.close();
	        dbm.conn.setAutoCommit(true);
	      } catch (Exception e) {
	    	try
	    	{
	    		dbm.conn.rollback();
	    	}
	    	catch (Exception ex)
	    	{}	    	
	    	dbm.conn.setAutoCommit(true);	    	
	    	String MessageError="Errore "+vSezione+" durante l'inserimento massivo per la riga : "+
	    	line+vSezioneColonne+"- Messaggio d'errore: "+e.getMessage();
	    	dbm.InsertElaboration(DBManager.LIV_ATTIVO_ERROR, MessageError, cm);	    	
	    	throw new Exception(MessageError);
	      }
	}
	

}
