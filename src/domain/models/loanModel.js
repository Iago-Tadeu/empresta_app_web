export class Institution {
  constructor(id, name, type) {
    this.id = id;
    this.type = type;
    this.name = name;
  }
}

export class Agreement {
  constructor(id, name, type) {
    this.id = id;
    this.type = type;
    this.name = name;
  }
}

export class LoanOffer {
  constructor(
    rate,
    installments,
    simulatedAmount,
    installmentAmount,
    agreement,
    bank
  ) {
    this.rate = rate;
    this.installments = installments;
    this.simulatedAmount = simulatedAmount;
    this.installmentAmount = installmentAmount;
    this.agreement = agreement;
    this.bank = bank;
  }
}
