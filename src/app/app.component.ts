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
    title = 'Simulador ROB';
    executingROB: boolean = false;
    configurationSaved: boolean = false;
    listInstructions = new Array<Instruction>();
    sizeROB:number = 0;
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
        new Instruction("S1","LD","R1","R0","","MEM"),
        new Instruction("S2","LD","R2","R0","","MEM"),
        new Instruction("S3","MUL","R3","R0","R10","ARITH"),
        new Instruction("S4","DIV","R7","R1","R10","ARITH"),
        new Instruction("S5","ADD","R3","R3","R2","ARITH"),
        new Instruction("S6","LD","R4","R0","","MEM"),
        new Instruction("S7","DIV","R6","R1","R10","ARITH"),
        new Instruction("S8","ADD","R2","R4","R2","ARITH"),
      new Instruction("S9","SUB","R5","R3","R2","ARITH"),
      new Instruction("S10","ST","R1","R2","","MEM"),
      new Instruction("S11","ST","R1","R5","","MEM"),
      new Instruction("S12","ADD","R7","R2","R5","ARITH")
      ];
      this.listInstructions = instrucions;
      this.idInstruction = this.listInstructions.length;
      

    
    }
  
    change(pos,name){
      this.btnDefaultIns[pos] = name;
      this.updateButton();
    }

    imprimirDependencias() {
      for (let index = 0; index < this.listInstructions.length; index++) {
        console.log(this.listInstructions[index].getId() + ":" )
        for (let j = 0; j < this.listInstructions[index].dependecies.length; j++) {
          console.log(this.listInstructions[index].dependecies[j])        
        }
      }
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
        this.idInstruction++
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
    }

    getDependenciasRAW(){
      let encontro = false;
      for (let i = 0; i < this.listInstructions.length -1; i++) {
        if(this.listInstructions[i].getType()!="ST")
        for (let j = i+1; j < this.listInstructions.length && !encontro; j++) {
          if(this.listInstructions[j].getType()!="ST"){
              if (this.listInstructions[i].getDestination() == this.listInstructions[j].getOp1() || this.listInstructions[i].getDestination() == this.listInstructions[j].getOp2() )  
                this.listInstructions[i].addDependency(this.listInstructions[j].getId());            
              if(this.listInstructions[i].getDestination() == this.listInstructions[j].getDestination()){
                encontro=true;
              }
          }
            else{
              if(this.listInstructions[i].getDestination() == this.listInstructions[j].getDestination() || this.listInstructions[i].getDestination()==this.listInstructions[j].getOp1())            
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
      this.cpu = null;
      this.showFinished = false;
      this.deleteDependencies();
    }

    saveConfiguration(){
      if(this.numArithmetic!=0 || this.numMemory != 0 || this.numMultifunction!=0){
        this.configurationSaved = true;
        this.executingROB=false;
        this.showAlert=false;
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
  
    public executeRob(){
      this.executingROB = true;
      this.createTableHead("ER",this.numReserveStation);
      this.createTableHead("D",this.numOrder);
      this.createTableHead("UF",this.numArithmetic+this.numMemory+this.numMultifunction);
      this.sizeROB = this.numReserveStation + this.numMultifunction + this.numArithmetic + this.numMemory;
      this.createTableHeadROB();
      this.getDependenciasRAW();
    // this.imprimirDependencias();
      this.cpu = new Processor(this.listInstructions,this.numOrder,this.numReserveStation,this.sizeROB);
      this.cpu.addUF(this.numArithmetic,this.numMemory,this.numMultifunction);
      var treeData = this.getTreeData();
      this.loadVisTree(treeData); 
    }


    nextInstruction(){
      if (!this.cpu.isFinished())
        this.cpu.nextCycle();
      else
        this.showFinished=true;

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
  
      var that = this;
      this.network.on("hoverNode", function (params) {                  
        console.log('hoverNode Event:', params);
      });
      this.network.on("blurNode", function(params){
        console.log('blurNode event:', params);      
      });
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
}
