function App() {
    return {
        year: [],
        semester: [],
        probation: [],
        selectedYear: null, 
        showTable: false, 
        selectedSemester: null,
        async getYear() {
            const response = await fetch("/api/year").then((res) => res.json());
            this.year = response;
            console.log(this.year);
        },

        async getSemester(year1) {
             this.selectedYear = year1;
             this.selectedSemester = null;
             this.semester = [];       
            this.probation = [];     
            this.showTable = false; 
            const response = await fetch(`/api/semester/${year1}`).then((res)=> res.json());
            this.semester = response;
            console.log(this.semester);
        },

       async getProbation(sem) {
         this.selectedSemester = sem; 
        const response = await fetch(`/api/probation/${sem}/${this.selectedYear}`).then((res) => res.json());
         this.probation = response;
         console.log(this.probation);
          this.showTable = true;
       }
    };
}
