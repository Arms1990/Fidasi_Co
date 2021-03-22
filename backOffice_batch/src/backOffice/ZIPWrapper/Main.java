package backOffice.ZIPWrapper;

import backOffice.Util.Checker;

/**
 * Classe Main del package che "avvolge" la classe MyUtil.ZIP
 */
public class Main {
	
	public static final int IDX_ZIP_O_PARAMETER = 0;
	public static final int IDX_ZIP_OUTPUT_FILE = 1;
	public static final int IDX_ZIP_I_PARAMETER = 2;
	public static final int IDX_ZIP_INPUT_FILES = 3;
	
	/**
	 * Costruttore del Main
	 * @param ReducedArgs	Argomenti che vengono passati dal chiamante
	 * @throws Exception	L'eccezione è gestita dal chiamante
	 */
	public Main(String [] ReducedArgs) throws Exception
	{
		int ret =0;
		System.out.println("--== BackOffice.ZIPWrapper v0.1b ==--");
		String [] params = new String[4];
		params[IDX_ZIP_O_PARAMETER]="Parametro 2) -o (file di output)";
		params[IDX_ZIP_OUTPUT_FILE]="Parametro 3) Nome del file di output";
		params[IDX_ZIP_I_PARAMETER]= "Parametro 4) -i (files di input)";
		params[IDX_ZIP_INPUT_FILES]="Parametro 5..N) Lista dei files di input";
		if (ReducedArgs.length<4)
		{
			System.out.println("Parametri insufficienti, prego specificare:");
			ret = backOffice.Util.Checker.PrintParameters(params,null);
			if (ret==-1)
			{
				throw new Exception("Parametri non validi");
			}
		}
		String [] paramsBefore=params.clone();
		params[IDX_ZIP_O_PARAMETER]=params[IDX_ZIP_O_PARAMETER]+
				backOffice.Util.Checker.CheckValidValues(ReducedArgs[IDX_ZIP_O_PARAMETER], 
				new String[] {"-o"});
		params[IDX_ZIP_OUTPUT_FILE]=params[IDX_ZIP_OUTPUT_FILE]+
				Checker.CheckPathExistFromFile(ReducedArgs[IDX_ZIP_OUTPUT_FILE]);
		params[IDX_ZIP_I_PARAMETER]=params[IDX_ZIP_I_PARAMETER]+
				backOffice.Util.Checker.CheckValidValues(ReducedArgs[IDX_ZIP_I_PARAMETER], 
						new String[] {"-i"});				
		if (ReducedArgs.length>=4)
		{
			for (int i=3;i<ReducedArgs.length;i++)
			{
				params[IDX_ZIP_INPUT_FILES]=params[IDX_ZIP_INPUT_FILES]+
						Checker.CheckFileExistORIfNumber(ReducedArgs[i]);
			}
		}
				
		ret=backOffice.Util.Checker.PrintParameters(params,paramsBefore);
		
		if (ret==0)
		{	
			String [] OnlyOutputFiles=new String[ReducedArgs.length-3];
			for (int i=IDX_ZIP_INPUT_FILES,k=0;i<ReducedArgs.length;i++,k++)
			{
				OnlyOutputFiles[k]=ReducedArgs[i];
			}
			System.out.println("In fase di elaborazione...");	
			ret=MyUtil.ZIP.Compress(ReducedArgs[IDX_ZIP_OUTPUT_FILE],OnlyOutputFiles);
			System.out.println("Elaborazione conclusa...");
		}
		
		if (ret==-1)
		{
			throw new Exception("Parametri non validi");
		}
		
	}


}
