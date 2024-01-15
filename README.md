To export a report to be viewed with this app you must add the appropriate tags into your Progress source code.


{csv_exp.i '!title'} //title of the report
{csv_exp.i 'TITLE OF REPORT'}
{csv_exp.i '!date'} //date of the report
{csv_exp.i 'DATE OF REPORT'}
{csv_exp.i '!params'} //parameters of the report
{csv_exp.i 'PARAMETERS'}
{csv_exp.i '!divider'}  //OPTIONAL - only needed for reports that have dividers by date range or something like that 
                        // (like Customer Sales Detail Report)  Omit for other reports.
{csv_exp.i 'DIVIDER INFO'}
{csv_exp.i '!header'} //this is the headers of the report columns.
{csv_exp.i 'HEADERS'}



each section of a report should contain the following:
{csv_exp.i '!section'}  // specifies a new report section is starting. and all output found below until an '!end' tag is 
                        // found belongs to this section.
{csv_exp.i '!name'} //specifies that the line below contains the name of the section/subsection
{csv_exp.i 'NAME OF THE SECTION'}
{csv_exp.i '!data'} // specifies that the following data will contain the actual data values of the section.

//this is where you would be exporting the actual section data.
//within you foreach loop:
{csv_exp.i 'DATA'
           'DATA'
           ...data }



{csv_exp.i '!end'} //specifies the end of a particular section.  These won't always happen after each section.  Depending on how mnay subsections a section has, you may end up with several lines of '!end' tags in a row - this is fine.

{csv_exp.i '!total'} //specifies the total line of the particular section being parsed at that time.

{csv_exp.i '!grandtotal'} //specifies the grand total line of the report.