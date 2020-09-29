class Money{
  constructor(quantity, currency = '$'){
    this.quantity = quantity;
    this.currency = currency;
    
    //console.log(quantity)
    if(this.isValid(quantity)){
      this.fix(quantity);
    }else{
      console.log("error");
    }
  }
  
  isValid(quantity){
    return this.isNumber(quantity);
  }
  
  isNumber(quantity){
    return !isNaN(Number(quantity));
  }
  
  isPositive(){
    return Number(this.quantity) >= 0;
  }
  
  fix(quantity){
    this.quantity = Number(quantity).toFixed(2);
  }
  
  get amount() {
    return this.quantity;
  }
  
  toString(){
    return Money.format(this.quantity, this.currency);
  }
  
  static format (quantity, currency) {
    let money = new Money(quantity);
    if(!money.isPositive()){
      let moneyFormatted = `(-) ${currency}${Math.abs(money.amount)}`;
      return moneyFormatted;
    }
    
    let moneyFormatted = `${currency}${money.amount}`;
    return moneyFormatted;
  }
  
  static calculateSum(collection){
    let result = 0;
    for(let val of collection){
      let money = new Money(val);
      result += Number(money.amount);
    }
    return new Money(result);
  }
  
  static calculateMoneySum(collection){
    let result = 0;
    for(let val of collection){
      result += Number(val.amount);
    }
    return new Money(result);
  }
  
  static calculateMoneySus(value1, value2){
    let result = value1 - value2;
    return new Money(result);
  }
  
  static calculateSus(value1, value2){
    let result = Number(value1) - Number(value2);
    console.log(value1,value2,result)
    return new Money(Number(result));
  }
}

export {Money};