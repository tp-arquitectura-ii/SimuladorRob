import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Instruction } from './Instruction';
import { Processor } from './Processor';

declare var vis:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
    @ViewChild("siteConfigNetwork",{static: true}) networkContainer: ElementRef;
    executing: boolean = false;
    executingROB: boolean = false;
    configurationSaved: boolean = false;
    listInstructions = new Array<Instruction>();
    sizeROB:number = 0;

    timeSec = 0;
    timePar = 0;
    timeTotal;
    typeInstruction = [
      { type: "ADD", cycle: 1},
      { type: "SUB", cycle: 1},
      { type: "MUL", cycle: 1},
      { type: "DIV", cycle: 1},
      { type: "ST", cycle: 1},
      { type: "LD", cycle: 1}
    ];

    registers:string[] = [
      "R1",
      "R2",
      "R3",
      "R4",
      "R5",
      "R6",
      "R7",
      "R8",
      "R9",
      "R10"
    ];
    
    DHeaders: Array<string>;
    ERHeaders: Array<string>;
    UFHeaders: Array<string>;

    rowCycle: Array<string>;
    
    numOrder = 1;
    numReserveStation = 1;
    numMultifunction = 0;
    numArithmetic = 0;
    numMemory = 0;
    idInstruction = 0;
    btnDefaultIns = {
      type: "INSTRUCCION",
      dst: "DST",
      op1: "OP1",
      op2: "OP2"
    };

    cpu:Processor
    showAlert = false;
    showFinished = false;

    public network: any;

    constructor() { }


    ngOnInit() {
      const instrucions = [
        new Instruction("S0","ADD","R3","R0","R5","ARITH"),
        new Instruction("S1","MUL","R2","R2","R5","ARITH"),
        new Instruction("S2","DIV","R1","R5","R0","ARITH"),
        new Instruction("S3","ST","(R3)","R1","","MEM"),
        new Instruction("S4","SUB","R6","R3","R2","ARITH"),
        new Instruction("S5","LD","R9","(R6)","","MEM"),
        new Instruction("S6","ADD","R2","R6","R3","ARITH"),
        new Instruction("S7","DIV","R10","R3","R1","ARITH")
      ];
      this.listInstructions = instrucions;
      this.idInstruction = this.listInstructions.length;
    }
  
    change(pos,name){
      this.btnDefaultIns[pos] = name;
      this.updateButton();
    }


    updateButton(){
      let btnAgr = document.getElementById("btn-Agregar");
      let btnOp2 = document.getElementById("btn-op2");
      if (this.btnDefaultIns.type!="INSTRUCCION" && this.btnDefaultIns.dst!="DST" && this.btnDefaultIns.op1!="OP1" && this.btnDefaultIns.op2!="OP2"){
        btnAgr.removeAttribute("disabled");
      }
      if (this.btnDefaultIns.type=="ST" || this.btnDefaultIns.type == "LD"){
        btnOp2.setAttribute("disabled","");
        if (this.btnDefaultIns.dst!="DST" && this.btnDefaultIns.op1!="OP1")
          btnAgr.removeAttribute("disabled");    
      }
      else
          btnOp2.removeAttribute("disabled");  
    }

    addInstruction(){ 
        this.idInstruction=this.listInstructions.length
        let instNueva;
        if (this.btnDefaultIns.type=="ST")
          instNueva = new Instruction("S" +this.idInstruction,this.btnDefaultIns.type,"("+this.btnDefaultIns.dst+")",this.btnDefaultIns.op1,"","MEM");
        else 
          if (this.btnDefaultIns.type == "LD")
            instNueva = new Instruction("S" +this.idInstruction,this.btnDefaultIns.type,this.btnDefaultIns.dst,"("+this.btnDefaultIns.op1+")","","MEM");
          else
            instNueva = new Instruction("S" +this.idInstruction,this.btnDefaultIns.type,this.btnDefaultIns.dst,this.btnDefaultIns.op1,this.btnDefaultIns.op2,"ARITH");  
        this.listInstructions.push(instNueva);
    }

    changeOrder(num){
        this.numOrder = num;
    }

    changeCycle(pos,numcycle){
      for (let tipoIns of this.typeInstruction) {
          if (tipoIns.type == pos )
            tipoIns.cycle = numcycle;
      }
    }
  
    changeER(num){
      this.numReserveStation=num;
    }

    changeUFmultifunction(num){
      this.numMultifunction= num;
    }

    changeUFArithmetic(num){
      this.numArithmetic = num;
    }

    changeUFMemory(num){
      this.numMemory= num;
    }

    deleteInstruction(inst:Instruction){
      let i = this.listInstructions.indexOf(inst);
      this.listInstructions.splice(i,1);
      this.recalculateID();

    }

    recalculateID(){
      for(let i = 0; i < this.listInstructions.length; i++){
        this.listInstructions[i].setID("S"+i);  
      }
    }

    getDependenciasRAW(){
      let encontro = false;
      for (let i = 0; i < this.listInstructions.length -1; i++) {
        if(this.listInstructions[i].getType()!="ST")
          for (let j = i+1; j < this.listInstructions.length && !encontro; j++) {
            if(this.listInstructions[j].getType()!="ST"){
              if(this.listInstructions[j].getType()=="LD") 
                if (this.listInstructions[j].getOp1().substring(1,this.listInstructions[j].getOp1().length-1) == this.listInstructions[i].getDestination() || this.listInstructions[i].getDestination() == this.listInstructions[j].getOp2() )  
                  this.listInstructions[i].addDependency(this.listInstructions[j].getId());
                if (this.listInstructions[j].getOp1() == this.listInstructions[i].getDestination() || this.listInstructions[i].getDestination() == this.listInstructions[j].getOp2() )  
                    this.listInstructions[i].addDependency(this.listInstructions[j].getId());
                if(this.listInstructions[i].getDestination() == this.listInstructions[j].getDestination()){
                  encontro=true;
                }
            }
            else{
              if(this.listInstructions[j].getDestination().substring(1,this.listInstructions[j].getDestination().length-1) == this.listInstructions[i].getDestination() || this.listInstructions[i].getDestination()==this.listInstructions[j].getOp1())            
                this.listInstructions[i].addDependency(this.listInstructions[j].getId());             
            }
        }
        encontro = false;
      }
    }

    deleteDependencies(){
      for (let i = 0; i <this.listInstructions.length ;i++)
        this.listInstructions[i].dependecies.splice(0,this.listInstructions.length);
    }

    resetConfiguration(){
      this.configurationSaved = false;
      this.executingROB = false;
      this.executing = false;
      this.cpu = null;
      this.showFinished = false;
      this.deleteDependencies();
    }

    saveConfiguration(){
      if(this.numArithmetic!=0 || this.numMemory != 0 || this.numMultifunction!=0){
        this.configurationSaved = true;
        this.executingROB=false;
        this.showAlert=false;
        this.executing = true;
      }
      else{
        this.showAlert = true;
      }
      this.setCycles();
    }

    private setCycles(){
      for(let i=0 ; i< this.listInstructions.length; i++){
        for (let j =0 ; j < this.typeInstruction.length; j++)
          if (this.listInstructions[i].getType() == this.typeInstruction[j].type){
            this.listInstructions[i].setCycles(this.typeInstruction[j].cycle);
          }    
        }   
    }

    private createTableHeadROB(){
      const array = [];
      for (let i = 0; i < this.sizeROB; i++) {
        array.push('I');
        array.push('S');
      }
      this['ROBHeaders'] = array;
    }

    private createTableHead(desc:string, num:number){
      let array = [];
      for (let i = 0; i < num; i++) {
        array.push(desc+i);
      }
      this[desc+'Headers'] = array;
    }

    private createTableHeadUF(desc:string, numM:number, numMem:number,numA:number){
      let array = [];
      for (let i = 0; i < numM; i++) {
        array.push(desc+"M"+i);
      }
      for (let i = 0; i < numA; i++) {
        array.push(desc+"A"+i);
      }
      for (let i = 0; i < numMem; i++) {
        array.push(desc+"Mem"+i);
      }    
      this[desc+'Headers'] = array;
    }
  
    public getTimeSecuencial(){
      let sum = 0 ;
      for (let inst of this.listInstructions) {
        sum = sum + inst.getCycle()
      }
      return sum;
    }
    
    public executeRob(){
      this.executing = false;
      this.executingROB = true;
      this.createTableHead("ER",this.numReserveStation);
      this.createTableHead("D",this.numOrder);
      this.createTableHeadUF("UF",this.numMultifunction,this.numMemory,this.numArithmetic);
      document.getElementById("graph").style.visibility = "visible";
      this.sizeROB = this.numReserveStation + this.numMultifunction + this.numArithmetic + this.numMemory;
      this.createTableHeadROB();
      this.getDependenciasRAW();
      this.timeSec = this.getTimeSecuencial();
      this.cpu = new Processor(this.listInstructions,this.numOrder,this.numReserveStation,this.sizeROB);
      this.cpu.addUF(this.numArithmetic,this.numMemory,this.numMultifunction);
      var treeData = this.getTreeData();
      this.loadVisTree(treeData); 
    }


    nextInstruction(){
      if (!this.cpu.isFinished()){
        this.cpu.nextCycle();
        this.addRowCounter(this.cpu.getCycleCounter());
        this.addRow(this.cpu.getDispatcher().instruction,"tablaDispatch",this.numOrder);
        this.addRow(this.cpu.getER().instructions,"tablaER",this.numReserveStation);
        this.addRowUF(this.cpu.getUF());
        this.addRowROB(this.cpu.getROB(),"tablaROB",this.sizeROB);
      }
      else{
        this.showFinished=true;
        this.timePar= this.cpu.getCycleCounter();
        this.timeTotal = this.timeSec/this.timePar;
      }
    }

    loadVisTree(treedata) {
      var options = {
        interaction: {
          hover: true,
        },
        manipulation: {
          enabled: false
        }
      };
      var container = this.networkContainer.nativeElement;
      this.network = new vis.Network(container, treedata, options);
    }
  
    getTreeData() {     
      var nodes = []
      for (let inst of this.listInstructions) {
        let n = {id: inst.getId(), label: inst.getId() }
        nodes.push(n);
      }  
      // create an array with edges
      var edges = []
      for (let inst of this.listInstructions)
        for(let depen of inst.dependecies){
            let e = {from: inst.getId(), to: depen, arrows:"to"}
            edges.push(e);
        }
      var treeData = {
        nodes: nodes,
        edges: edges
      };
      return treeData;
    }

    addRow(inst:Array<Instruction>, id:string, cantidad:Number ){
      let tr = document.createElement("tr");
      for(let i = 0; i < cantidad;i++){
          let td = document.createElement("td");
          if (i<inst.length){
              td.appendChild(document.createTextNode(inst[i].getId()));
              tr.appendChild(td);
          }
          else{
              td.appendChild(document.createTextNode("-"));
              tr.appendChild(td);
          }
      }
      document.getElementById(id).appendChild(tr);
  }

  addRowUF(uf){
      let tr = document.createElement("tr");
      for(let i = 0; i < uf.length;i++){
          let td = document.createElement("td");
          if (uf[i].getInstruction()!= null){
              td.appendChild(document.createTextNode(uf[i].getInstruction().getId()));
              tr.appendChild(td);
          }
          else
          {
              td.appendChild(document.createTextNode("-"));
              tr.appendChild(td);
          }
          
      }
      document.getElementById("tablaUF").appendChild(tr);
  }
  addRowROB(rob, id:string,cantidad:Number){
      let tr = document.createElement("tr");
      for (let i = 0; i < cantidad; i++){
          let td = document.createElement("td");
          let td1 = document.createElement("td");
          if (rob.getRobC()[i].getInstruction()!=null){
              if (rob.getRobC()[i].getInstruction2()==null){
                  td.appendChild(document.createTextNode(rob.getRobC()[i].getInstruction().getId()))
                  td1.appendChild(document.createTextNode(rob.getRobC()[i].getInstruction().getStatus()));  
              }
              else{
                  td.appendChild(document.createTextNode(rob.getRobC()[i].getInstruction().getId()+ "/" +rob.getRobC()[i].getInstruction2().getId() ))
                  td1.appendChild(document.createTextNode(rob.getRobC()[i].getInstruction().getStatus()+"/"+ rob.getRobC()[i].getInstruction2().getStatus()));
              }
              tr.appendChild(td);
              tr.appendChild(td1);
          }
          else{
              td.appendChild(document.createTextNode("-"))
              td1.appendChild(document.createTextNode("-"));
              tr.appendChild(td);
              tr.appendChild(td1);
          }
      }
      document.getElementById(id).appendChild(tr);
  }

  addRowCounter(cycleCounter:number) {  
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.appendChild(document.createTextNode(""+cycleCounter));
      tr.appendChild(td);
      document.getElementById("tablacycle").appendChild(tr);
  
  }
}
