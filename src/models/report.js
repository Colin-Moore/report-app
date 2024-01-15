class Report{
    constructor(){
        this.sections = [];
    }
    reportType = [];
    widths = [];
    title = [];
    date = [];
    divider = [];
    parameters = [];
    header = [];
    total = [];
    sections = [];

    addSection(section){
        this.sections.push(section)
    }

    setSections(section){
        this.sections = section;
    }

    setHeaders(header){
        this.header = header;
    }

    getSection(index) {
        if (index >= 0 && index < this.sections.length) {
          return this.sections[index];
        } else {
          console.error("Invalid section index");
          return null;
        }
      }
    getSec(sectionName){
        let index = 0;
        while(index < this.sections.length){      
            if(this.sections[index].name === sectionName){
                return this.sections[index];
            } else {
            console.error("Invalid section index");
            return null;
            }
        }
        index++;
    }
}

module.exports = Report;