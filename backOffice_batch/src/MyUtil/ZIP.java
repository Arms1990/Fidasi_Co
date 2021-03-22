package MyUtil;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Classe che gestisce i file Zip
 */
public class ZIP {
	
	/**
	 * Metodo statico che Comprime i file ZIP
	 * @param OutFile		Nome del file ZIP di output
	 * @param InputFiles	Lista dei file da comprimere in input
	 * @return				Restituisce -1 se in errore e 0 se tutto ok.
	 */
	public static int Compress(String OutFile, String [] InputFiles)
	{
		java.io.FileOutputStream fout = null;
		try {
			fout = new java.io.FileOutputStream(OutFile);
			java.util.zip.ZipOutputStream zout = new java.util.zip.ZipOutputStream(fout);
			for (int i=0;i<InputFiles.length;i++)
			{
				java.util.zip.ZipEntry ze = new java.util.zip.ZipEntry(
						InputFiles[i]);
				zout.putNextEntry(ze);			    
				byte[] bytes = Files.readAllBytes(
				    		Paths.get(InputFiles[i])
				    		);
		        zout.write(bytes, 0, bytes.length);
		        zout.closeEntry();
			}
			zout.close();
		} catch (FileNotFoundException e) {
			System.err.println("Errore, file non trovato");	
			e.printStackTrace();
			return -1;
		} catch (IOException e) {
			System.err.println("Errore di IO");	
			e.printStackTrace();
			return -1;
		}
		return 0;
	}	
	
}
