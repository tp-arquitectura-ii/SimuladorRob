import { Component, OnInit } from '@angular/core';
import { Instruction } from './Instruction';
import { Processor } from './Processor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
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
  constructor() { }


  ngOnInit() {
    const instrucions = [
      new Instruction("S1","ADD","R3","R0","R5","ARITH"),
      new Instruction("S2","MUL","R2","R2","R5","ARITH"),
      new Instruction("S3","DIV","R1","R5","R0","ARITH"),
      new Instruction("S4","ST","R3","R1","","MEM"),
      new Instruction("S5","SUB","R6","R3","R2","ARITH"),
      new Instruction("S6","LD","R9","R6","","MEM"),
      new Instruction("S7","ADD","R2","R6","R3","ARITH"),
      new Instruction("S8","DIV","R10","R3","R1","ARITH")
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
      console.log("Ingresa una unidad funcional boludo");
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
    this.imprimirDependencias();
    this.cpu = new Processor(this.listInstructions,this.numOrder,this.numReserveStation,this.sizeROB);
    this.cpu.addUF(this.numArithmetic,this.numMemory,this.numMultifunction);
  }


  nextInstruction(){
    if (!this.cpu.isFinished())
      this.cpu.nextCycle();
    else
      this.showFinished=true;

  }

}
