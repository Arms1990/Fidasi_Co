package backOffice.Util;

import java.io.File;

/**
 * Classe contenente una raccolta di metodi statici utilizzati dai flussi per fare i controlli dei parametri di input 
 */
public class Checker {
	
	/**
	 * Metodo che stampa a schermo i parametri errati nel caso dall'esterno si sbagli a passarli	
	 * @param Parameters			I parametri da stampare
	 * @param Parameters2Compare	I parametri da comparare, se diversi (ovvero sono errati) allora vengono stampati, 
	 * se questa struttura è null allora vengono stampati tutti in quanto il numero dei parametri non è corretto
	 * @return						0: ok, -1: errore
	 */
	public static int PrintParameters(String [] Parameters, String [] Parameters2Compare)
	{
		if (Parameters2Compare==null)
		{
			System.out.println("Parametro 1) Nome flusso");
		}
		int iRet=0;
		for (int i=0;i<Parameters.length;i++)
		{
			if (
					( Parameters2Compare == null ) ||
					(!( Parameters2Compare[i].equals(Parameters[i])) )
					)
			{
				iRet=-1;
				System.out.println(Parameters[i]);
			}
		}
		return iRet;
	}

	/**
	 * Metodo che verifica se il file esiste su FS o se è un numero valido
	 * @param TheValue		Path completo del file di cui controllare l'esistenza o numerico di cui controllare correttezza
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckFileExistORIfNumber(String TheValue)
	{
		File f = new File(TheValue);					
		if ( (!f.exists()) || 
				(TheValue.toUpperCase().equals(TheValue.toLowerCase()))
						)
		{
			return " --> File non valido o inesistente o numero non valido: "+TheValue;
		}
		
		return "";
	}
	
	
	/**
	 * Metodo che verifica se il file esiste su FS
	 * @param FileName		Path completo del file di cui controllare l'esistenza
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckFileExist(String FileName)
	{
		File f = new File(FileName);					
		if ( !f.exists() )
		{
			return " --> File non valido o inesistente: "+FileName;
		}
		
		return "";
	}
	
	/**
	 * Metodo che verifica se il file esiste su FS
	 * @param FileName		Path completo del file di cui controllare l'esistenza
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckPathExistFromFile(String FileName)
	{
		try
		{
			File f = new File(FileName);
			String Parent=f.getParent();
		}
		catch (Exception ex)
		{		
			return " --> Path non valido o inesistente: "+FileName;
		}
		
		return "";
	}
	
	
	/**
	 * Metodo che verifica se il valore passato è contenuto tra i valori validi
	 * @param TheValue		Valore da controllare
	 * @param ValidValues	Array di valori validi
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckValidValues(String TheValue, String [] ValidValues)
	{
		boolean found=false;
		for (int i=0;i<ValidValues.length;i++)
		{
			if (TheValue.equals(ValidValues[i]))
			{
				found=true;
				break;
			}
		}
		if (!found)
		{
			return " --> Valore non valido: "+TheValue;
		}
		else
		{
			return "";
		}
	}
	
	/**
	 * Metodo che verifica se il valore passato come stringa può essere un numerico valido
	 * @param TheValue		Valore stringa presunto numerico
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckIfNumber(String TheValue)
	{
		if (TheValue.toUpperCase().equals(TheValue.toLowerCase()))		
		{
			return "";
		}
		else
		{
			return " --> Valore non valido: "+TheValue;
		}
	}
	
	/**
	 * Metodo che verifica se il valore passato è una stringa alfanumerica e non un numero
	 * @param TheValue		Stringa presunta alfanumerica
	 * @return				Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckIfNOTNumber(String TheValue)
	{
		if (!(TheValue.toUpperCase().equals(TheValue.toLowerCase())))		
		{
			return "";
		}
		else
		{
			return " --> Valore non valido: "+TheValue;
		}
	}
	
	/**
	 * Metodo che verifica la matrice di compatibilità tra due valori passati, ogni iesimo elemento di FirstParameters2Compare sarà compatibile con l'iesimo elemento di SecondValue  
	 * @param FirstValue				Primo valore da controllare
	 * @param FirstParameters2Compare	Array di stringhe contenente i valori di cui controllare compatibilità per FirstValue 
	 * @param SecondValue				Secondo valore da controllare
	 * @param SecondParameters2Compare	Array di stringhe contenente i valori di cui controllare compatibilità per SecondValue
	 * @param LabelSecondValue			Etichetta del secondo campo da controllare, serve esclusivamente per il messaggio d'errore
	 * @return							Se esiste restituisce null, altrimenti restituisce un messaggio d'errore
	 */
	public static String CheckValidRelationValues(String FirstValue, String [] FirstParameters2Compare,
			String SecondValue, String [] SecondParameters2Compare, 
			String LabelSecondValue
			)
	{
		if (FirstParameters2Compare.length!=SecondParameters2Compare.length)
		{
			return " --> ERRRORE GRAVE: Errore di configurazione della classe, i parametri devono essere in numero uguale";
		}
		
		String sRet=" --> "+FirstValue+" non è compatibile con il parametro "+SecondValue+" di "+LabelSecondValue;
		for (int i=0;i<FirstParameters2Compare.length;i++)
		{
		  if (
			   ( FirstValue.equals(FirstParameters2Compare[i]) ) &&
			   ( SecondValue.equals(SecondParameters2Compare[i]) )
	         )
			 {
			   sRet="";
			   break;	   
			 }
		}
			
		return sRet;
	}

}
