package backOffice;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.*;
import java.time.LocalDateTime;
import java.util.Date;

import org.apache.log4j.PropertyConfigurator;

import backOffice.Extractor.Main;
import backOffice.Loader.*;
import backOffice.Util.Checker;

/**
 * Classe che esegue tutti i processi del pacchetto backOffice, lista processi: Loader, Extractor, Mail, FTP e ZIP
 */
public class Launcher {
	
	/**
	 * Metodo main chiamato da SO
	 * @param args		Parametri passati da SO
	 */
	public static void main(String[] args) {
		
		System.out.println("--== BackOffice v0.1b ==--");
		try {
			String Flow=args[0];
			LocalDateTime now = LocalDateTime.now();
			String sDateNow=
					Integer.toString(now.getYear())+
					String.format("%2s", Integer.toString(now.getMonthValue())).replace(' ', '0')+
					Integer.toString(now.getDayOfYear())+
					Integer.toString(now.getHour())+
					Integer.toString(now.getMinute())+
					Integer.toString(now.getSecond());
			System.setProperty("logFile", "BackOffice."+Flow+"_"+sDateNow);
			PropertyConfigurator.configure("./resources/log4j.properties");
			String [] ReducedArgs=new String[args.length-1];
			for (int i=0;i<ReducedArgs.length;i++)
			{
				ReducedArgs[i]=args[i+1];
			}
			if ( Flow.equals("Loader") )
			{
				new backOffice.Loader.Main(ReducedArgs);
			}
			else if ( Flow.equals("Extractor"))
			{
				new backOffice.Extractor.Main(ReducedArgs);
			}
			else if ( Flow.equals("Mail"))
			{
				new backOffice.Mail.Main(ReducedArgs);
			}
			else if ( Flow.equals("FTP"))
			{
				new backOffice.FTP.Main(ReducedArgs);
			}
			else if ( Flow.equals("ZIP"))
			{
				new backOffice.ZIPWrapper.Main(ReducedArgs);
			}
			else if ( Flow.equals("SQLExecutor"))
			{
				new backOffice.SQLExecutor.Main(ReducedArgs);
			}			
			else	
			{
				System.out.println("Il flusso "+Flow+" non esiste!");
				System.out.println("Flussi consentiti: Loader, Extractor, Mail, FTP e ZIP");
				System.exit(-1);
			}
		} catch (Exception e) {			
			e.printStackTrace();
			System.exit(-1);
		}
		System.exit(0);	
	}
	

}
