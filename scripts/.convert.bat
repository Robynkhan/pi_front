
IF EXIST .oriconf (GOTO USE_ORI) ELSE (GOTO USE_BUILD)
:USE_ORI
	rename .conf .buildconf
	rename .depend .builddepend
	rename .error  .builderror
	rename test.depend test.builddepend

	rename .oriconf .conf
	rename .oridepend .depend
	rename .orierror .error
	rename test.oridepend test.depend

	GOTO FINAL

:USE_BUILD
	rename .conf .oriconf
	rename .depend .oridepend
	rename .error  .orierror
	rename test.depend test.oridepend

	rename .buildconf .conf
	rename .builddepend .depend
	rename .builderror .error
	rename test.builddepend test.depend

:FINAL