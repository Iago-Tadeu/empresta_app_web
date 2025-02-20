import { defineStore } from "pinia";
import loanRepository from "@/repositories/loanRepository";

export const useLoanStore = defineStore("loan", {
  state: () => ({
    institutions: [],
    agreements: [],
    offers: [],
  }),

  actions: {
    async fetchInstitutions() {
      this.institutions = await loanRepository.getInstitutions();
    },

    async fetchAgreements() {
      this.agreements = await loanRepository.getAgreements();
    },

    async fetchLoanOffers(amountValue, institutions, agreements, installments) {
      this.offers = await loanRepository.simulationRequest(
        amountValue,
        institutions,
        agreements,
        installments
      );
    },
  },

  getters: {
    getInstitutions: (state) => () => state.institutions,
    getAgreements: (state) => () => state.agreements,
    getOffers: (state) => () => state.offers,
  },
});
