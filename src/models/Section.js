class Section {
    constructor(name) {
        this.name = name;
        this.data = [];
        this.headers = [];
        this.total = [];
        this.widths = [];
        this.subsections = [];
    }

    addSubsection(subsection) {
        this.subsections.push(subsection);
    }
}

module.exports = Section;