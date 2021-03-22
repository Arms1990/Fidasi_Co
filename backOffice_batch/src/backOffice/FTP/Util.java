package backOffice.FTP;

import backOffice.Util.ConfigManager;
import backOffice.Util.DBManager;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

/**
 * Classe di utilità per il gestore delle connessioni FTP
 */
public class Util {

	/**
	 * Costruttore della classe Util
	 * @param cm				Oggetto ConfigManager
	 * @param dbm				Oggetto DBManager
	 * @param args				Argomenti passati in input
	 * @param iAttachmentBegin	Gli attachment cominciano dal Nesimo elemento degli args
	 * @throws Exception		Le eccezioni vengono restituite all'esterno
	 */
	public Util(ConfigManager cm, DBManager dbm, String [] args,int iAttachmentBegin) throws Exception
	{
        FTPClient ftpClient = new FTPClient();
        try {
        	
        	String server = cm.getChildValuebyName("Server");
    	    int port = Integer.parseInt(cm.getChildValuebyName("Port"));
    	    String user = cm.getChildValuebyName("Usr");
    	    String pass = cm.getChildValuebyName("Psw");
    	    String WorkingDirectory =  cm.getChildValuebyName("RemoteWorkingDirectory");
 
            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
 
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            
            ftpClient.changeWorkingDirectory(WorkingDirectory);
 
            for (int i=iAttachmentBegin;i<args.length;i++)
            {            
		        File firstLocalFile = new File(args[i]);
		 
		        String firstRemoteFile = new File(args[i]).getName();
		        InputStream inputStream = new FileInputStream(firstLocalFile);
		 
		        boolean done = ftpClient.storeFile(firstRemoteFile, inputStream);
		        inputStream.close();
		        if (done) {
		        	dbm.InsertElaboration(DBManager.LIV_ATTIVO_INFO, "File inviato correttamente.", cm);
		        }
 
            }
 
        } catch (Exception ex) {
			dbm.InsertElaboration(DBManager.LIV_ATTIVO_ERROR, "Errore durante l'invio FTP: "+ex.getMessage(), cm);
            throw ex;
        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (Exception ex) {
    			dbm.InsertElaboration(DBManager.LIV_ATTIVO_ERROR, "Errore durante la disconnessione FTP: "+ex.getMessage(), cm);
                throw ex;
            }
        }
	}
}
