import { LoanOffer } from "@/domain/models/loanModel";

const loanAdapter = {
  getOffersFromJson(json, simulatedAmount) {
    const offers = [];

    Object.entries(json).forEach(([bank, offersList]) => {
      if (Array.isArray(offersList)) {
        offersList.forEach((offerData) => {
          offers.push(this.getOfferFromMap(offerData, bank, simulatedAmount));
        });
      } else if (typeof offersList === "object") {
        Object.values(offersList).forEach((offerData) => {
          offers.push(this.getOfferFromMap(offerData, bank, simulatedAmount));
        });
      }
    });

    return offers;
  },

  getOfferFromMap(data, bank, simulatedAmount) {
    return new LoanOffer(
      data.taxa,
      data.parcelas,
      simulatedAmount,
      data.valor_parcela,
      data.convenio,
      bank
    );
  },
};

export default loanAdapter;
