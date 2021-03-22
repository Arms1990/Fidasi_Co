package backOffice.Util;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * Classe del ConfigManager, legge file di properties e XML oltre che info lette da input 
 */
public class ConfigManager {
	
	private Hashtable<String,String> Elements;
	
	private XmlManager xm;
	
	/**
	 * Metodo che prende un qualsiasi elemento letto da file di properties
	 * @param Key	Chiave del file di properties
	 * @return		Restituisce il valore corrispondente alla chiave
	 */
	public String getElement(String Key)
	{
		Set<String> keys = Elements.keySet();
        for(String ItemKey: keys){
            if (ItemKey.toUpperCase().equals(Key.toUpperCase()))
            {
            	return Elements.get(ItemKey);
            }
        }
        return null;
	}
	
	/**
	 * Metodo che restituisce il valore di un attributo di una nodo figlio attraverso la posizione.
	 * @param Pos				Posizione 0 based nodo
	 * @param AttributeName		Nome dell'attributo da cercare
	 * @return					Restituisce il valore (stringa) o null se non lo trova
	 */
	public String getChildAttributeValue(String Pos, String AttributeName)
	{
		XmlNodePlus xnp = xm.getChildByAttribute("Seq", Pos);
		if (xnp != null)
		{
			return xnp.getAttributeValue(AttributeName);	
		}
		return null;
	}
	
	/**
	 * Metodo che restituisce il valore di un attributo di una nodo figlio attraverso il nome del figlio.
	 * @param Name				Nome figlio
	 * @param AttributeName		Nome dell'attributo da cercare
	 * @return					Restituisce il valore (stringa) o null se non lo trova
	 */
	public String getChildAttributeValuebyName(String Name, String AttributeName)
	{
		XmlNodePlus xnp = xm.getChildByName(Name);
		if (xnp != null)
		{
			return xnp.getAttributeValue(AttributeName);	
		}
		return null;
	}
	
	
	/**
	 * Metodo che restituisce il nome del nodo figlio attraverso la posizione
	 * @param Pos				Posizione 0 based nodo
	 * @return					Restituisce il valore (stringa) o null se non lo trova
	 */
	public String getChildName(String Pos)
	{
		XmlNodePlus xnp = xm.getChildByAttribute("Seq", Pos);
		if (xnp != null)
		{
			return xnp.getName();
		}
		return null;
	}	
	
	/**
	 * Metodo che restituisce il valore del nodo figlio attraverso la posizione
	 * @param Pos				Posizione 0 based nodo
	 * @return					Restituisce il valore (stringa) o null se non lo trova
	 */
	public String getChildValueByPos(String Pos)
	{
		XmlNodePlus xnp = xm.getChildByAttribute("Seq", Pos);
		if (xnp != null)
		{
			return xnp.getValue();
		}
		return null;
	}
	
	/**
	 * Metodo che restituisce il valore del nodo figlio attraverso il nome
	 * @param Name				Nome del nodo figlio
	 * @return					Restituisce il valore (stringa) o null se non lo trova
	 */
	public String getChildValuebyName(String Name)
	{
		XmlNodePlus xnp = xm.getChildByName(Name);
		if (xnp != null)
		{
			return xnp.getValue();
		}
		return null;
	}	
	
	/**
	 * Restituisce il numero dei figli presenti sotto il nodo padre del file XML
	 * @return		Restituisce un numerico
	 */
	public int getChildNumber()
	{
		return xm.getChildNumber();
	}
	
	private String PropertyFile;
	/**
	 * Restituisce la stringa contenente il file di Property passato in input
	 * @param WithPath		Se true restituisce il file con tutto il path altrimenti restituisce solo il nome file
	 * @return				Restituisce il file con o senza path a seconda di WithPath 
	 */
	public String getPropertyFile(boolean WithPath)
	{
		if (WithPath)
		{
			return this.PropertyFile;
		}
		else
		{
			File f = new File(this.PropertyFile);						
			return f.getName();
		}
	}
	
	private String InputFile;
	/**
	 * Metodo che restituisce il la stringa contenente il file di input SQL o XML
	 * @param WithPath		Se true restituisce il file con tutto il percorso
	 * @return				Il file con o senza il percorso a seconda di WithPath 
	 */
	public String getInputFile(boolean WithPath)
	{
		if (WithPath)
		{
			return this.InputFile;
		}
		else
		{
			File f = new File(this.InputFile);						
			return f.getName();
		}
	}
	
	private String CsvFile;
	/**
	 * Metodo che restituisce il nome del file CSV
	 * @param WithPath		Se true restituisce il nome con tutto il path
	 * @return				Restituisce il nome con o senza path a seconda di WithPath 
	 */
	public String getCsvFile(boolean WithPath)
	{
		if (WithPath)
		{
			return this.CsvFile;
		}
		else
		{
			File f = new File(this.CsvFile);						
			return f.getName();
		}
	}
	
	/**
	 * Metodo che reupera dal XML un qualsiasi attributo del elemento padre selezionato  
	 * @param AttribName	Nome dell'attributo da recuperare
	 * @return				Il valore dell'attributo selezionato
	 */	
	public String GetFatherXmlNodeAttribute(String AttribName)
	{
	  return xm.getFatherAttribValue(AttribName);
	}
		
	/**
	 * Costruttore del ConfigManager
	 * @param PropertyFile		File di properties da caricare
	 * @param InputFile			File di input XML o SQL
	 * @param CsvFile			File CSV di input o di output
	 * @param InputElements		Altri input elements dall'esterno
	 * @throws Exception		Restituisce Exception verso l'esterno
	 */
	public  ConfigManager(String PropertyFile, String InputFile, String CsvFile, 
			Hashtable<String,String> InputElements) throws Exception
	{
		FileInputStream fis;		
		Elements = new Hashtable<String,String>();
		try {
			fis = new FileInputStream(PropertyFile);
			Properties prop = new Properties();
			prop.load(fis);
			for (Map.Entry e : prop.entrySet())
			        if (!Elements.containsKey(e.getKey()))
			        	Elements.put(e.getKey().toString(), e.getValue().toString());			
			for (Map.Entry e : InputElements.entrySet())
		        if (!Elements.containsKey(e.getKey()))
		        	Elements.put(e.getKey().toString(), e.getValue().toString());
			if (InputFile.substring(InputFile.length()-4).toUpperCase().equals(".XML"))
			{
				xm = new XmlManager(InputFile,InputElements.get("FatherXmlNodeName"));
			}
			this.PropertyFile=PropertyFile;
            this.InputFile=InputFile;
            this.CsvFile=CsvFile;			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}		
		
	}
	

}
