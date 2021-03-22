package backOffice.Mail;

import backOffice.Util.*;

import java.io.File;
import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.sun.mail.smtp.SMTPTransport;

/**
 * Classe di utilità per il gestore delle mail
 */
public class Util {

	/**
	 * Costruttore della classe delle utility per il gestore delle Mail
	 * @param cm				Oggetto ConfigManager
	 * @param dbm				Oggetto DBManager
	 * @param args				Argomenti passati in input
	 * @param iAttachmentBegin	Gli allegati cominciano dal Nesimo elemento di args
	 * @throws Exception		Eccezione inviata all'esterno
	 */
	public Util(ConfigManager cm, DBManager dbm, String [] args,int iAttachmentBegin) throws Exception
	{
		try
		{
			String sBodyRes=ParseBody(cm.getChildValuebyName("body"),dbm,args);
			Send(cm,sBodyRes,args,iAttachmentBegin);
		}
		catch (Exception e)
		{
			dbm.InsertElaboration(DBManager.LIV_ATTIVO_ERROR, "Errore durante l'invio mail: "+e.getMessage(),cm);
			throw e;
		}
	}
	
	/**
	 * Metodo che "parsa" il body della mail, un body è in formato HTML e legge query dinamiche e parametri passati dall'esterno
	 * @param Body			Il body da "parsare"
	 * @param dbm			Oggetto DBManager
	 * @param args			Lista di valori statici passati dall'esterno
	 * @return				Ritorna il body "parsato"
	 * @throws Exception	Ritorna l'eccezione verso l'esterno
	 */
	private String ParseBody(String Body, DBManager dbm, String [] args) throws Exception
	{
		String BodyRes=Body;
		String [] sQueryList=Body.split("§");
		
		for (int i=1;i<sQueryList.length;i+=2)
		{
			String sSingleQuery=sQueryList[i];
			for (int k=0;k<args.length;k++)
			{
				sSingleQuery=sSingleQuery.replace("#ARGUMENT_"+k+"#", args[k]);
			}
			String QueryRes=dbm.DoQuery(sSingleQuery);
			BodyRes=BodyRes.replace("§"+sQueryList[i]+"§", QueryRes);			
		}
		BodyRes=BodyRes.replace("\n", "<br/>").replace("\t", "&emsp;");
		return BodyRes;
	}
	
	/**
	 * Metodo che invia la mail
	 * @param cm				Oggetto ConfigManager
	 * @param Body				Stringa contenente il Body HTML
	 * @param args				Argomenti di input
	 * @param iAttachmentBegin	Gli allegati cominciano dal Nesimo elemento di args
	 * @throws Exception		Ritorna l'eccezione verso l'esterno
	 */
	private void Send(ConfigManager cm, String Body,String [] args,int iAttachmentBegin) throws Exception
	{
		
        Properties prop = System.getProperties();
        prop.put("mail.smtp.host", cm.getElement("mail.smtp.host") ); 
        prop.put("mail.smtp.auth", cm.getElement("mail.smtp.auth") );
        prop.put("mail.smtp.port", cm.getElement("mail.smtp.port")); 
		
        Session session = Session.getInstance(prop, null);
        
        Message msg = new MimeMessage(session);
        
        msg.setFrom(new InternetAddress(cm.getChildValuebyName("from")));
        msg.setRecipients(Message.RecipientType.TO,
                InternetAddress.parse(cm.getChildValuebyName("to"), false));
        msg.setRecipients(Message.RecipientType.CC,
                InternetAddress.parse(cm.getChildValuebyName("cc"), false));
        msg.setRecipients(Message.RecipientType.BCC,
                InternetAddress.parse(cm.getChildValuebyName("bcc"), false));
        msg.setSubject(cm.getChildValuebyName("subject"));
        msg.setSentDate(new Date());
        

        Multipart multipart = new MimeMultipart();
        MimeBodyPart BodyPart = new MimeBodyPart();
        BodyPart.setContent(Body,"text/html");        
        MimeBodyPart attachmentBodyPart= new MimeBodyPart();
        if (iAttachmentBegin!=-1) 
        {
	        for (int i=iAttachmentBegin;i<args.length;i++)
	        {
		        DataSource source = new FileDataSource(args[i]); 
		        attachmentBodyPart.setDataHandler(new DataHandler(source));	        
		        attachmentBodyPart.setFileName(new File(args[i]).getName()); 
		        multipart.addBodyPart(attachmentBodyPart); 
	        }
        }
        
        multipart.addBodyPart(BodyPart);  

        msg.setContent(multipart);
        
        SMTPTransport t = (SMTPTransport) session.getTransport("smtp");
        t.connect(cm.getElement("mail.smtp.host"), cm.getElement("mail_usr"), cm.getElement("mail_psw"));
        t.sendMessage(msg, msg.getAllRecipients());

        t.close();
		
	}

}
