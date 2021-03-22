package backOffice.Util;

import java.util.Hashtable;
import java.util.Set;

/**
 * Classe che costutisce un nodo figlio XML per il backOffice
 */
public class XmlNodePlus {
	
	private Hashtable<String,String> Attributes;

	/**
	 * Costruttore del XMLNodePlus (senza parametri)
	 */
	public XmlNodePlus ()
	{
		Attributes = new Hashtable<String,String>();
	}
	
	private String Name;
	/**
	 * Metodo che imposta il nome dell'attributo
	 * @param Name		Stringa contentente il nome
	 */
	public void setName(String Name) {
		this.Name=Name;
	}
	/**
	 * Metodo che restituisce il nome dell'attributo
	 * @return	Stringa contentente il nome
	 */
	public String getName() {
		return Name;
	}

	private String Value;
	/**
	 * Metodo che imposta il valore dell'attributo
	 * @param Value		Stringa contentente il nome
	 */
	public void setValue(String Value) {
		this.Value=Value;
	}
	/**
	 * Metodo che restituisce il valore dell'attributo
	 * @return	Stringa contentente il valore
	 */
	public String getValue() {
		return Value;
	}

	
	/**
	 * Metodo che restituisce il valore dell'attributo
	 * @param Key		Stringa contentente la chiave dell'attributo
	 * @return			Stringa contentente il valore
	 */
	public String getAttributeValue(String Key) {
		Set<String> keys = Attributes.keySet();
        for(String ItemKey: keys){
            if (ItemKey.toUpperCase().equals(Key.toUpperCase()))
            {
            	return Attributes.get(ItemKey);
            }
        }
        return null;
	}

	/**
	 * Impota un attributo
	 * @param Key		Stringa della chiave
	 * @param Value		Stringa del valore
	 */
	public void setAttribute(String Key, String Value)
	{
		Attributes.put(Key, Value);
	}

}
