import axios from "axios";
import loanAdapter from "@/core/adapters/loanAdapter";
import { Institution, Agreement } from "@/domain/models/loanModel";

const BASE_API_URL = "http://127.0.0.1:8000";

const loanRepository = {
  async getInstitutions() {
    try {
      const response = await axios.get(`${BASE_API_URL}/instituicao`);
      return response.data.map(
        (institution, index) =>
          new Institution(index + 1, institution.chave, institution.valor)
      );
    } catch (error) {
      console.error("Erro ao buscar instituições:", error);
      return [];
    }
  },

  async getAgreements() {
    try {
      const response = await axios.get(`${BASE_API_URL}/convenio`);
      return response.data.map(
        (agreement, index) =>
          new Agreement(index + 1, agreement.chave, agreement.valor)
      );
    } catch (error) {
      console.error("Erro ao buscar convênios:", error);
      return [];
    }
  },

  async simulationRequest(value, institutions, agreements, installments) {
    try {
      const payload = {
        valor_emprestimo: value,
        instituicoes: institutions,
        convenios: agreements,
        parcelas: installments,
      };

      const response = await axios.post(`${BASE_API_URL}/simular`, payload);
      return loanAdapter.getOffersFromJson(response.data, value);
    } catch (error) {
      console.error("Erro na simulação de empréstimo:", error);
      return [];
    }
  },
};

export default loanRepository;
