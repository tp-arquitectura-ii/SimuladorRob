export class Instruccion {
    id:string;
    tipo:string
    destino:string;
    op1:string;
    op2:string;
    dependencias:String[] = new Array;

    constructor(id:string,tipo:string,destino:string,op1:string,op2:string) {
      this.id=id;
      this.tipo=tipo;
      this.destino=destino;
      this.op1=op1;
      this.op2=op2; 
    }
    
    public getId(){
      return this.id;
    }
    
    public agregarDependencias(i:String){
      this.dependencias.push(i)
    }

  
  }