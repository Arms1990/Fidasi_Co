package backOffice.Util;

import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
import java.util.ArrayList;

/**
 *	Classe che gestisce il caricamento del XML conservandolo tutto in memoria  
 */
public class XmlManager {
	
	private Element root;	
	private ArrayList<XmlNodePlus> elements;
	
	/**
	 * Metodo che recupera il nome del root tag del XML  
	 * @return		Stringa contenente il nome del root tag 
	 */
	public String getRootElementName()
	{	
		return root.getNodeName();
	}
	
	private Element Father;
	/**
	 * Metodo che reupera dal XML un qualsiasi attributo del elemento padre selezionato  
	 * @param AttribName	Nome dell'attributo da recuperare
	 * @return				Il valore dell'attributo selezionato
	 */
	public String getFatherAttribValue(String AttribName)
	{		
		NamedNodeMap nnm =Father.getAttributes();
	    for (int i=0;i<nnm.getLength();i++)
	    {	
	      if ( nnm.item(i).getNodeName().toUpperCase().equals(AttribName.toUpperCase()))
	      {
	    	  return nnm.item(i).getNodeValue();
	      }
	    }
	    return "";
	}
	
	private String SelectedFatherName; 
	/**
	 * Metodo che recupera il nome del nodo XML padre selezionato  
	 * @return		Stringa contenente il nome nodo 
	 */
	public String getSelectedFatherName()
	{	
		return SelectedFatherName;
	}
	
	
	/**
	 * Metodo che restituisce tutto l'oggetto XmlNodePlus attraverso nome e valore dell'attributo
	 * @param AttributeName			Nome dell'attributo
	 * @param AttributeValue		Valore dell'attributo
	 * @return						Oggetto XmlNodePlus, restituisce null se non trovato
	 */
	public XmlNodePlus getChildByAttribute(String AttributeName, String AttributeValue)
	{
		for (int i=0;i<elements.size();i++)
		{
			String sAttrValueOfArray=elements.get(i).getAttributeValue(AttributeName);			
			if (sAttrValueOfArray.equals(AttributeValue))
			{
				return elements.get(i);
			}
		}
		return null;
	}
	
	/**
	 * Metodo che restituisce tutto l'oggetto XmlNodePlus attraverso il nome 
	 * @param Name			Nome del tag
	 * @return				Oggetto XmlNodePlus, restituisce null se non trovato
	 */
	public XmlNodePlus getChildByName(String Name)
	{
		for (int i=0;i<elements.size();i++)
		{
			if (elements.get(i).getName().toUpperCase().equals(Name.toUpperCase()))
			{
				return elements.get(i);
			}
		}
		return null;
	}	
	
	
	private int ChildNumber;	
	/**
	 * Metodo che recupera il numero dei nodi child
	 * @return		Numerico contenente il numero dei Child 
	 */	
	public int getChildNumber()
	{
	  return ChildNumber;
	}
	

	/**
	 * Costruttore del XmlManager 
	 * @param XmlFile				Path completo del file XML da caricare in memoria
	 * @param SelectedFatherName	Nome del nodo padre da cercare
	 * @throws Exception 			Restituisce la gestione del errore verso l'esterno
	 */
	public XmlManager(String XmlFile, String SelectedFatherName) throws Exception
	{
		this.SelectedFatherName=SelectedFatherName;
		DocumentBuilderFactory factory;
		DocumentBuilder builder;
		Document document;		
		elements = new ArrayList<XmlNodePlus>();
		
		try
		{		
			factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
			document = builder.parse(new File(XmlFile));
			document.getDocumentElement().normalize();
			root = document.getDocumentElement();
			NodeList nList = document.getChildNodes().item(0).getChildNodes();			
			for (int iTab=0; iTab<nList.getLength();iTab++)
			{
				Node node = nList.item(iTab);
				if  (node.getNodeType() == Node.ELEMENT_NODE)
				{
					Element eElement = (Element) node;
					Father=eElement ;
					if (SelectedFatherName.toUpperCase().equals(eElement.getTagName().toUpperCase()))
					{
						nList=eElement.getChildNodes();
						break;
					}
				}				
			}					
			ChildNumber= 0;
			for (int temp = 0; temp < nList.getLength(); temp++)
			{
				 Node node = nList.item(temp);
				 if (node.getNodeType() == Node.ELEMENT_NODE)
				 {				    
				    Element eElement = (Element) node;
				    NamedNodeMap nnm = eElement.getAttributes();
				    XmlNodePlus xnp = new XmlNodePlus();
				    xnp.setName(eElement.getTagName()); 
				    xnp.setValue(eElement.getTextContent());
				    for (int i=0;i<nnm.getLength();i++)
				    {	
				    	xnp.setAttribute(nnm.item(i).getNodeName(), nnm.item(i).getNodeValue());
				    }
				    elements.add(xnp);				    
			    	ChildNumber++;
				 }				
			}
			
		}
		catch (Exception ex)
		{
			throw ex;
		}
		 
	}

}
